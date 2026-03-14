"use server";

import OpenAI from "openai";
import * as cheerio from "cheerio";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getPlan, getUserPlanId } from "@/lib/plans";

// ─── Constants ───────────────────────────────────────────────────────────────
// Limits are now driven by PLANS config in @/lib/plans.ts — do not hardcode here.
const CHUNK_SIZE = 1000;         // characters per chunk
const CHUNK_OVERLAP = 200;       // overlap between consecutive chunks
const SPIDER_TIMEOUT_MS = 12_000;  // fail fast — don't block a batch
const LINK_FETCH_TIMEOUT_MS = 8_000; // 8-second timeout for link discovery

// ─── Types ────────────────────────────────────────────────────────────────────
export interface CrawlResult {
    success: boolean;
    sourceId?: string;
    chunkCount?: number;
    charCount?: number;
    error?: string;
}

export interface WorkspaceLimits {
    plan: string;
    planLabel: string;
    totalPages: number;
    totalChars: number;
    remainingPages: number;
    remainingChars: number;
    maxPages: number;
    maxChars: number;
    messageCredits: number;
    actionLimit: number;
    allModels: boolean;
}

export interface DiscoverResult {
    urls: string[];
    source: string;
    error?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Splits a long text into overlapping chunks for embedding.
 */
function chunkText(text: string, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP): string[] {
    const chunks: string[] = [];
    let start = 0;

    while (start < text.length) {
        const end = Math.min(start + chunkSize, text.length);
        chunks.push(text.slice(start, end));
        if (end === text.length) break;
        start += chunkSize - overlap;
    }

    return chunks.filter((c) => c.trim().length > 20);
}

// ─── Main Server Action: Crawl a Single Page ─────────────────────────────────

/**
 * Crawls a single URL using Spider.cloud, generates embeddings in ONE call,
 * and bulk-inserts everything to Supabase.
 */
export async function crawlWebsiteAction(url: string, accessToken: string): Promise<CrawlResult> {
    // ── 1. Init clients ────────────────────────────────────────────────────
    const supabase = createServerSupabaseClient(accessToken);
    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        },
    });

    // ── 2. Auth ────────────────────────────────────────────────────────────
    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Unauthorized. Please sign in." };
    }

    const workspaceId = user.id;

    // ── 3. Validate URL ────────────────────────────────────────────────────
    let normalizedUrl: string;
    try {
        const parsed = new URL(url);
        normalizedUrl = parsed.toString();
    } catch {
        return { success: false, error: "Invalid URL format." };
    }

    // ── 4. Check workspace limits (plan-aware) ─────────────────────────────
    const planId = await getUserPlanId(supabase, workspaceId);
    const plan = getPlan(planId);
    const MAX_PAGES = plan.pages;
    const MAX_CHARS = plan.chars;

    const { data: sources, error: limitsError } = await supabase
        .from("knowledge_sources")
        .select("character_count")
        .eq("workspace_id", workspaceId)
        .eq("status", "completed");

    if (limitsError) {
        return { success: false, error: "Failed to check workspace limits." };
    }

    const totalPages = (sources ?? []).length;
    const totalChars = (sources ?? []).reduce((acc, s) => acc + (s.character_count ?? 0), 0);

    if (totalPages >= MAX_PAGES) {
        return {
            success: false,
            error: `Page limit reached (${MAX_PAGES} pages). Upgrade or remove old sources.`,
        };
    }

    if (totalChars >= MAX_CHARS) {
        return {
            success: false,
            error: `Character limit reached (${MAX_CHARS.toLocaleString()} chars). Upgrade or remove old sources.`,
        };
    }

    // ── 5. Fetch content via Spider.cloud ────────────────────────────────
    let markdownContent: string;
    try {
        const controller = new AbortController();
        const timeout: NodeJS.Timeout = setTimeout(() => controller.abort(), SPIDER_TIMEOUT_MS);

        const spiderResponse = await fetch("https://api.spider.cloud/crawl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env["SPIDER_API_KEY"]}`,
            },
            body: JSON.stringify({ url: normalizedUrl, limit: 1, return_format: "markdown" }),
            signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!spiderResponse.ok) {
            return {
                success: false,
                error: `Spider.cloud failed to fetch the page (HTTP ${spiderResponse.status}).`,
            };
        }

        const spiderData = await spiderResponse.json() as Array<{ content?: string }>;
        markdownContent = spiderData?.[0]?.content ?? "";
    } catch (err: unknown) {
        if (err instanceof Error && err.name === "AbortError") {
            return { success: false, error: "Request timed out while fetching the page." };
        }
        return { success: false, error: "Failed to fetch page content via Spider.cloud." };
    }

    // ── 6. Pre-processing & character limit check ─────────────────────────
    const charCount = markdownContent.length;

    if (charCount === 0) {
        return { success: false, error: "The page returned no readable content." };
    }

    if (totalChars + charCount > MAX_CHARS) {
        return {
            success: false,
            error: `Adding this page (${charCount.toLocaleString()} chars) would exceed your limit.`,
        };
    }

    // ── 7. Insert 'pending' source record — try plain INSERT first; if row
    //       already exists (no unique constraint), fall back to SELECT ──────
    const { data: insertedRecord } = await supabase
        .from("knowledge_sources")
        .insert({ workspace_id: workspaceId, url: normalizedUrl, status: "pending", character_count: charCount })
        .select("id")
        .single();

    let sourceId: string | null = insertedRecord?.id ?? null;

    // Fallback: row already exists — just fetch its id
    if (!sourceId) {
        const { data: existing, error: fetchErr } = await supabase
            .from("knowledge_sources")
            .select("id")
            .eq("workspace_id", workspaceId)
            .eq("url", normalizedUrl)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (fetchErr || !existing) {
            return { success: false, error: `Failed to create source record: ${fetchErr?.message ?? "Unknown error"}` };
        }
        sourceId = existing.id;
    }

    try {
        // ── 8. Chunk the content ───────────────────────────────────────────
        const chunks = chunkText(markdownContent);

        if (chunks.length === 0) {
            throw new Error("No valid text chunks found after processing.");
        }

        // ── 9. Generate ALL embeddings in ONE API call ─────────────────────
        let embeddingResponse;
        try {
            embeddingResponse = await openai.embeddings.create({
                model: "openai/text-embedding-3-small",
                input: chunks,           // ← entire array in one shot
                encoding_format: "float",
            });
        } catch (embApiErr) {
            await supabase.from("knowledge_sources").update({ status: "failed" }).eq("id", sourceId);
            throw new Error(`Embedding API error: ${embApiErr instanceof Error ? embApiErr.message : String(embApiErr)}`);
        }
        const embeddings = embeddingResponse.data.map((d) => d.embedding);

        // ── 10. Bulk insert ALL embeddings in ONE Supabase call ────────────
        const embeddingRows = chunks.map((chunk, i) => ({
            source_id: sourceId,
            workspace_id: workspaceId,
            content_chunk: chunk,
            embedding: embeddings[i],
        }));

        const { error: embeddingError } = await supabase
            .from("knowledge_embeddings")
            .insert(embeddingRows);  // ← single bulk insert

        if (embeddingError) {
            throw new Error(`Failed to insert embeddings into DB: ${embeddingError.message}`);
        }

        // ── 11. Mark source as completed ────────────────────────────────────
        await supabase
            .from("knowledge_sources")
            .update({ status: "completed" })
            .eq("id", sourceId);

        return {
            success: true,
            sourceId: sourceId ?? undefined,
            chunkCount: chunks.length,
            charCount,
        };
    } catch (err: unknown) {
        // Clean up: mark source as failed
        await supabase
            .from("knowledge_sources")
            .update({ status: "failed" })
            .eq("id", sourceId);

        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        return { success: false, error: message };
    }
}

// ─── Workspace Limits ─────────────────────────────────────────────────────────

export async function getWorkspaceLimits(accessToken: string): Promise<WorkspaceLimits | null> {
    const supabase = createServerSupabaseClient(accessToken);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const planId = await getUserPlanId(supabase, user.id);
    const plan = getPlan(planId);

    const { data: sources, error } = await supabase
        .from("knowledge_sources")
        .select("character_count")
        .eq("workspace_id", user.id)
        .eq("status", "completed");

    if (error) return null;

    const totalPages = sources?.length ?? 0;
    const totalChars = sources?.reduce((acc, s) => acc + (s.character_count ?? 0), 0) ?? 0;

    return {
        plan: planId,
        planLabel: plan.label,
        totalPages,
        totalChars,
        remainingPages: plan.pages - totalPages,
        remainingChars: plan.chars - totalChars,
        maxPages: plan.pages,
        maxChars: plan.chars,
        messageCredits: plan.messageCredits,
        actionLimit: plan.actionLimit,
        allModels: plan.allModels,
    };
}

// ─── Knowledge Sources ────────────────────────────────────────────────────────

export async function getKnowledgeSources(accessToken: string) {
    const supabase = createServerSupabaseClient(accessToken);

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("knowledge_sources")
        .select("id, url, status, character_count, created_at")
        .eq("workspace_id", user.id)
        .order("created_at", { ascending: false });

    if (error) return [];

    return data ?? [];
}


// ─── Sitemap-First Link Discovery ────────────────────────────────────────────

/** Extract the "base domain" from a URL origin, stripping www. for comparison.
 *  e.g. "https://www.chatbase.co" → "chatbase.co"
 *       "https://chatbase.co"     → "chatbase.co"  */
function baseDomain(origin: string): string {
    try {
        const host = new URL(origin).hostname;
        return host.replace(/^www\./, "");
    } catch {
        return origin;
    }
}

/** Check if two origins refer to the same site (ignoring www prefix) */
function isSameSite(originA: string, originB: string): boolean {
    return baseDomain(originA) === baseDomain(originB);
}

/** Fetch a URL with a short timeout; returns null on failure */
async function fetchText(url: string, timeoutMs = 8000): Promise<string | null> {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), timeoutMs);
        const res = await fetch(url, {
            headers: { "User-Agent": "SupportAI-Crawler/1.0", Accept: "text/html,application/xml,text/*" },
            signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok) return null;
        return await res.text();
    } catch {
        return null;
    }
}

/**
 * Parse a sitemap XML string and extract all <loc> URLs.
 * Works for both regular sitemaps and sitemap index files.
 * Returns { urls, isSitemapIndex }
 */
function parseSitemap(xml: string, origin: string): { urls: string[]; isSitemapIndex: boolean } {
    const isSitemapIndex = xml.includes("<sitemapindex");
    const tag = isSitemapIndex ? "sitemap" : "url";

    // Extract all <loc> values inside the correct container tags
    const urls: string[] = [];
    const locRegex = new RegExp(`<${tag}[^>]*>[\\s\\S]*?<loc>([^<]+)<\\/loc>`, "g");
    let match;
    while ((match = locRegex.exec(xml)) !== null) {
        const rawUrl = match[1].trim();
        try {
            const parsed = new URL(rawUrl);
            // Only keep same-site URLs (www/non-www treated as same)
            if (isSitemapIndex || isSameSite(parsed.origin, origin)) {
                urls.push(parsed.toString());
            }
        } catch {
            // Invalid URL — skip
        }
    }

    // Fallback: grab any <loc> if structured parsing found nothing
    if (urls.length === 0) {
        const fallbackRegex = /<loc>([^<]+)<\/loc>/g;
        while ((match = fallbackRegex.exec(xml)) !== null) {
            try {
                const parsed = new URL(match[1].trim());
                urls.push(parsed.toString());
            } catch { /* skip */ }
        }
    }

    return { urls, isSitemapIndex };
}

/**
 * Try to discover all pages via sitemap.xml.
 * Supports sitemap index files (nested sitemaps).
 * Returns null if no sitemap is found.
 */
async function discoverViaSitemap(origin: string, pageLimit: number): Promise<string[] | null> {
    // Build www and non-www variants of the origin
    const parsedOrigin = new URL(origin);
    const hasWww = parsedOrigin.hostname.startsWith("www.");
    const altOrigin = hasWww
        ? `${parsedOrigin.protocol}//${parsedOrigin.hostname.replace(/^www\./, "")}`
        : `${parsedOrigin.protocol}//www.${parsedOrigin.hostname}`;

    // Common sitemap locations to try (both www and non-www)
    const candidates = [
        `${origin}/sitemap.xml`,
        `${altOrigin}/sitemap.xml`,
        `${origin}/sitemap_index.xml`,
        `${altOrigin}/sitemap_index.xml`,
        `${origin}/sitemap-index.xml`,
        `${origin}/sitemap/sitemap.xml`,
        `${origin}/wp-sitemap.xml`,        // WordPress
        `${altOrigin}/wp-sitemap.xml`,
        `${origin}/news-sitemap.xml`,
    ];

    // Also check robots.txt for Sitemap: directive
    const robotsTxt = await fetchText(`${origin}/robots.txt`, 5000);
    if (robotsTxt) {
        const sitemapMatches = robotsTxt.match(/^Sitemap:\s*(.+)$/gmi) ?? [];
        for (const line of sitemapMatches) {
            const sitemapUrl = line.replace(/^Sitemap:\s*/i, "").trim();
            if (!candidates.includes(sitemapUrl)) candidates.unshift(sitemapUrl);
        }
    }

    for (const sitemapUrl of candidates) {
        const xml = await fetchText(sitemapUrl, 8000);
        if (!xml || !xml.includes("<loc>")) continue;

        const { urls: topLevelUrls, isSitemapIndex } = parseSitemap(xml, origin);
        if (topLevelUrls.length === 0) continue;

        if (isSitemapIndex) {
            // Recursively fetch child sitemaps in parallel
            const childSitemaps = await Promise.allSettled(
                topLevelUrls.slice(0, 20).map((u) => fetchText(u, 8000))
            );

            const allUrls: string[] = [];
            for (const result of childSitemaps) {
                if (result.status !== "fulfilled" || !result.value) continue;
                const { urls } = parseSitemap(result.value, origin);
                for (const u of urls) {
                    if (!allUrls.includes(u)) allUrls.push(u);
                    if (allUrls.length >= pageLimit) break;
                }
                if (allUrls.length >= pageLimit) break;
            }

            if (allUrls.length > 0) return allUrls.slice(0, pageLimit);
        } else {
            // Regular sitemap — filter to same-site (www/non-www OK)
            const sameOrigin = topLevelUrls
                .filter((u) => {
                    try { return isSameSite(new URL(u).origin, origin); } catch { return false; }
                })
                .slice(0, pageLimit);
            if (sameOrigin.length > 0) return sameOrigin;
        }
    }

    return null; // No sitemap found
}

/**
 * BFS fallback: crawl pages and extract <a href> links using cheerio.
 */
async function discoverViaBFS(startUrl: string, origin: string, pageLimit: number): Promise<string[]> {
    const visited = new Set<string>([startUrl]);
    const queue = [startUrl];
    const found = [startUrl];
    const BATCH = 10;

    while (queue.length > 0 && found.length < pageLimit) {
        const batch = queue.splice(0, BATCH);

        const results = await Promise.allSettled(
            batch.map(async (pageUrl) => {
                const html = await fetchText(pageUrl, LINK_FETCH_TIMEOUT_MS);
                if (!html) return [];

                const $ = cheerio.load(html);
                const links: string[] = [];

                $("a[href]").each((_, el) => {
                    const href = $(el).attr("href");
                    if (!href) return;
                    if (href.startsWith("#") || href.startsWith("mailto:") ||
                        href.startsWith("tel:") || href.startsWith("javascript:")) return;
                    try {
                        const resolved = new URL(href, pageUrl);
                        if (!isSameSite(resolved.origin, origin)) return;
                        resolved.hash = "";
                        const clean = resolved.toString();
                        const path = resolved.pathname.toLowerCase();
                        if (/\.(png|jpe?g|gif|svg|webp|ico|css|js|pdf|zip|mp[34]|wav|woff2?)$/.test(path)) return;
                        links.push(clean);
                    } catch { /* skip */ }
                });

                return links;
            })
        );

        for (const result of results) {
            if (result.status !== "fulfilled") continue;
            for (const link of result.value) {
                if (visited.has(link)) continue;
                if (found.length >= pageLimit) break;
                visited.add(link);
                found.push(link);
                queue.push(link);
            }
            if (found.length >= pageLimit) break;
        }
    }

    return found;
}

/**
 * Discovers all internal pages of a website.
 * Strategy: sitemap.xml first (instant, complete) → BFS fallback (slower).
 * This matches how tools like Chatbase discover pages so quickly.
 */
export async function discoverPages(
    url: string,
    accessToken: string
): Promise<DiscoverResult> {
    // ── Validate & extract origin ──
    let origin: string;
    let startUrl: string;
    try {
        const parsed = new URL(url);
        origin = parsed.origin;
        parsed.hash = "";
        startUrl = parsed.toString();
    } catch {
        return { urls: [url], source: "input", error: "Invalid URL — crawling as single page." };
    }

    // ── Auth check ──
    const supabase = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { urls: [], source: "none", error: "Unauthorized. Please sign in." };
    }

    const planId = await getUserPlanId(supabase, user.id);
    const plan = getPlan(planId);
    const pageLimit = plan.pages;

    // ── 1. Try sitemap first (fast & complete) ──
    const sitemapUrls = await discoverViaSitemap(origin, pageLimit);
    if (sitemapUrls && sitemapUrls.length > 0) {
        return { urls: sitemapUrls, source: "sitemap" };
    }

    // ── 2. Fall back to BFS crawling ──
    const bfsUrls = await discoverViaBFS(startUrl, origin, pageLimit);
    return {
        urls: bfsUrls,
        source: bfsUrls.length > 1 ? "cheerio-bfs" : "single-page",
    };
}


