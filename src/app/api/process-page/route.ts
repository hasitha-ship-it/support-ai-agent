import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// ─── Constants ────────────────────────────────────────────────────────────────
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const SPIDER_TIMEOUT_MS = 25_000; // generous per-invocation timeout
const DB_CHUNK_SIZE = 200;        // rows per Supabase INSERT

// ─── Helpers ─────────────────────────────────────────────────────────────────

function chunkText(text: string): string[] {
    const chunks: string[] = [];
    let start = 0;
    while (start < text.length) {
        const end = Math.min(start + CHUNK_SIZE, text.length);
        chunks.push(text.slice(start, end));
        if (end === text.length) break;
        start += CHUNK_SIZE - CHUNK_OVERLAP;
    }
    return chunks.filter((c) => c.trim().length > 20);
}

// ─── Route ────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    const { url, accessToken } = await req.json() as { url: string; accessToken: string };

    if (!url || !accessToken) {
        return NextResponse.json({ success: false, error: "Missing url or accessToken" }, { status: 400 });
    }

    // ── Auth ──
    const supabase = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const workspaceId = user.id;

    try {
        // ── 1. Fetch page via Spider.cloud ──
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), SPIDER_TIMEOUT_MS);

        const spiderRes = await fetch("https://api.spider.cloud/crawl", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env["SPIDER_API_KEY"]}`,
            },
            body: JSON.stringify({ url, limit: 1, return_format: "markdown" }),
            signal: controller.signal,
        });
        clearTimeout(timer);

        if (!spiderRes.ok) {
            return NextResponse.json({ success: false, error: `Spider HTTP ${spiderRes.status}` });
        }

        const spiderData = await spiderRes.json() as Array<{ content?: string }>;
        const markdown = spiderData?.[0]?.content ?? "";
        if (!markdown || markdown.length < 50) {
            return NextResponse.json({ success: false, error: "Empty content from Spider" });
        }

        const charCount = markdown.length;
        const chunks = chunkText(markdown);
        if (chunks.length === 0) {
            return NextResponse.json({ success: false, error: "No text chunks after processing" });
        }

        // ── 2. Insert / fetch source record ──
        const { data: insertedRecord } = await supabase
            .from("knowledge_sources")
            .insert({ workspace_id: workspaceId, url, status: "pending", character_count: charCount })
            .select("id")
            .single();

        let sourceId: string | null = insertedRecord?.id ?? null;

        if (!sourceId) {
            const { data: existing } = await supabase
                .from("knowledge_sources")
                .select("id")
                .eq("workspace_id", workspaceId)
                .eq("url", url)
                .order("created_at", { ascending: false })
                .limit(1)
                .single();
            sourceId = existing?.id ?? null;
        }

        if (!sourceId) {
            return NextResponse.json({ success: false, error: "Failed to create DB record" });
        }

        // ── 3. Generate embeddings (one API call for all chunks) ──
        const openai = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            },
        });

        const embRes = await openai.embeddings.create({
            model: "openai/text-embedding-3-small",
            input: chunks,
            encoding_format: "float",
        });
        const embeddings = embRes.data.map((d) => d.embedding);

        // ── 4. Bulk insert embeddings in chunks to avoid statement timeout ──
        const allRows = chunks.map((chunk, i) => ({
            source_id: sourceId,
            workspace_id: workspaceId,
            content_chunk: chunk,
            embedding: embeddings[i],
        }));

        for (let start = 0; start < allRows.length; start += DB_CHUNK_SIZE) {
            const slice = allRows.slice(start, start + DB_CHUNK_SIZE);
            const { error: dbErr } = await supabase.from("knowledge_embeddings").insert(slice);
            if (dbErr) {
                await supabase.from("knowledge_sources").update({ status: "failed" }).eq("id", sourceId);
                return NextResponse.json({ success: false, error: `DB insert failed: ${dbErr.message}` });
            }
        }

        // ── 5. Mark completed ──
        await supabase.from("knowledge_sources").update({ status: "completed" }).eq("id", sourceId);

        return NextResponse.json({ success: true, chunkCount: chunks.length, charCount });

    } catch (err) {
        const isAbort = err instanceof Error && (err.name === "AbortError" || err.message === "This operation was aborted");
        const msg = isAbort ? "Spider timeout — page took too long" : (err instanceof Error ? err.message : String(err));
        return NextResponse.json({ success: false, error: msg });
    }
}
