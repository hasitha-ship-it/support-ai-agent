"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { supabase } from "@/lib/supabase";
import {
    Sparkles,
    Globe,
    FileText,
    Play,
    MessageSquare,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Check,
    CheckCircle2,
    XCircle,
    Clock,
    Trash2,
    AlertTriangle,
    Search,
    ChevronDown,
    ChevronUp,
    Link2,
} from "lucide-react";
import {
    getWorkspaceLimits,
    getKnowledgeSources,
    type WorkspaceLimits,
} from "@/app/actions/crawl";
import dynamic from "next/dynamic";

// Dynamically imported so pdfjs-dist (which needs browser APIs) never runs on the server
const DocumentUploader = dynamic(
    () => import("@/components/DocumentUploader").then((m) => ({ default: m.DocumentUploader })),
    { ssr: false }
);

const QAManualEntry = dynamic(
    () => import("@/components/QAManualEntry").then((m) => ({ default: m.QAManualEntry })),
    { ssr: false }
);

// ─── Types ───────────────────────────────────────────────────────────────────
interface KnowledgeSource {
    id: string;
    url: string;
    status: "pending" | "completed" | "failed";
    character_count: number;
    created_at: string;
}

interface PageResult {
    url: string;
    success: boolean;
    chunkCount?: number;
    charCount?: number;
    error?: string;
}

type CrawlState = "idle" | "discovering" | "crawling" | "done" | "error";

// ─── Sub-components ───────────────────────────────────────────────────────────

function LimitBar({
    label,
    used,
    max,
    unit = "",
}: {
    label: string;
    used: number;
    max: number;
    unit?: string;
}) {
    const pct = Math.min((used / max) * 100, 100);
    const isWarning = pct > 80;
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
                <span className={`font-semibold ${isWarning ? "text-amber-600" : "text-zinc-500"}`}>
                    {used.toLocaleString()}{unit} / {max.toLocaleString()}{unit}
                </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${isWarning
                        ? "bg-gradient-to-r from-amber-400 to-orange-500"
                        : "bg-gradient-to-r from-violet-500 to-indigo-500"
                        }`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function CrawlProgressBar({
    current,
    total,
    currentUrl,
    successes,
    failures,
}: {
    current: number;
    total: number;
    currentUrl: string;
    successes: number;
    failures: number;
}) {
    const pct = total > 0 ? Math.min((current / total) * 100, 100) : 0;
    const domain = (() => {
        try { return new URL(currentUrl).pathname; } catch { return currentUrl; }
    })();

    return (
        <div className="mt-3 space-y-3 rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800/40 dark:bg-violet-950/30">
            {/* Header with counter */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-violet-600 dark:text-violet-400" />
                    <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                        Crawling {current}/{total}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" /> {successes}
                    </span>
                    {failures > 0 && (
                        <span className="flex items-center gap-1 text-red-500">
                            <XCircle className="h-3.5 w-3.5" /> {failures}
                        </span>
                    )}
                </div>
            </div>

            {/* Progress bar */}
            <div className="h-3 w-full overflow-hidden rounded-full bg-violet-100 dark:bg-violet-900/50">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>

            {/* Current URL */}
            <p className="truncate text-xs text-violet-600/80 dark:text-violet-400/80">
                → {domain}
            </p>
        </div>
    );
}

function SiteCard({ domain, sources }: { domain: string; sources: KnowledgeSource[] }) {
    const [open, setOpen] = React.useState(false);

    const completed = sources.filter((s) => s.status === "completed").length;
    const failed = sources.filter((s) => s.status === "failed").length;
    const pending = sources.filter((s) => s.status === "pending").length;
    const totalChars = sources.reduce((a, s) => a + (s.character_count ?? 0), 0);

    return (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            {/* Card header — click to collapse/expand */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
            >
                {/* Globe icon */}
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50">
                    <Globe className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>

                {/* Domain + stats */}
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-800 dark:text-zinc-100">{domain}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs">
                        <span className="text-zinc-500">{sources.length} pages</span>
                        {completed > 0 && <span className="text-emerald-600 dark:text-emerald-400">✓ {completed}</span>}
                        {pending > 0 && <span className="text-violet-500">◌ {pending}</span>}
                        {failed > 0 && <span className="text-red-500">✕ {failed}</span>}
                        {totalChars > 0 && (
                            <span className="text-zinc-400">{(totalChars / 1000).toFixed(0)}k chars</span>
                        )}
                    </div>
                </div>

                {/* Chevron */}
                <ChevronDown
                    className={`h-4 w-4 flex-shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Expandable link list with scrollbar */}
            {open && (
                <div className="border-t border-zinc-100 dark:border-zinc-800">
                    <div className="max-h-64 overflow-y-auto">
                        {sources.map((src) => {
                            let path = src.url;
                            try { path = new URL(src.url).pathname || "/"; } catch { /* keep full URL */ }
                            return (
                                <div
                                    key={src.id}
                                    className="flex items-center gap-2 border-b border-zinc-50 px-4 py-2 last:border-b-0 dark:border-zinc-800/50"
                                >
                                    {src.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />}
                                    {src.status === "pending" && <Clock className="h-3.5 w-3.5 flex-shrink-0 animate-pulse text-violet-400" />}
                                    {src.status === "failed" && <XCircle className="h-3.5 w-3.5 flex-shrink-0 text-red-400" />}
                                    <p className="min-w-0 flex-1 truncate font-mono text-[11px] text-zinc-500 dark:text-zinc-400">{path}</p>
                                    {src.status === "completed" && src.character_count > 0 && (
                                        <span className="flex-shrink-0 text-[10px] text-zinc-400">
                                            {(src.character_count / 1000).toFixed(1)}k
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}


// ─── Site Discovery Card ──────────────────────────────────────────────────────

function SiteDiscoveryCard({
    siteUrl,
    urls,
    crawlState,
}: {
    siteUrl: string;
    urls: string[];
    crawlState: CrawlState;
}) {
    const [expanded, setExpanded] = React.useState(false);

    let hostname = siteUrl;
    try { hostname = new URL(siteUrl).hostname; } catch { /* keep as-is */ }

    const isBusy = crawlState === "crawling" || crawlState === "discovering";

    return (
        <div className="mt-3 overflow-hidden rounded-xl border border-indigo-200 bg-indigo-50/60 dark:border-indigo-800/40 dark:bg-indigo-950/20">
            {/* Header row */}
            <button
                onClick={() => setExpanded((v) => !v)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-indigo-100/50 dark:hover:bg-indigo-900/20"
            >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50">
                    <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-indigo-800 dark:text-indigo-200">{hostname}</p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400">
                        {urls.length} page{urls.length !== 1 ? "s" : ""} discovered
                        {isBusy && " · crawling…"}
                    </p>
                </div>
                {isBusy && <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-indigo-500" />}
                {!isBusy && (
                    expanded
                        ? <ChevronUp className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                        : <ChevronDown className="h-4 w-4 flex-shrink-0 text-indigo-500" />
                )}
            </button>

            {/* Expanded page list */}
            {expanded && (
                <div className="max-h-52 overflow-y-auto border-t border-indigo-200 dark:border-indigo-800/40">
                    <ul className="divide-y divide-indigo-100 dark:divide-indigo-800/30">
                        {urls.map((u) => {
                            let path = u;
                            try { path = new URL(u).pathname || "/"; } catch { /* keep */ }
                            return (
                                <li key={u} className="flex items-center gap-2 px-4 py-1.5">
                                    <Link2 className="h-3 w-3 flex-shrink-0 text-indigo-400" />
                                    <span className="truncate text-xs text-indigo-700 dark:text-indigo-300" title={u}>{path}</span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function TrainingSourcesPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Form state
    const [url, setUrl] = React.useState("");
    const [crawlState, setCrawlState] = React.useState<CrawlState>("idle");
    const [errorMsg, setErrorMsg] = React.useState("");

    // Progress state
    const [totalPages, setTotalPages] = React.useState(0);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [currentUrl, setCurrentUrl] = React.useState("");
    const [pageResults, setPageResults] = React.useState<PageResult[]>([]);
    const [sitemapSource, setSitemapSource] = React.useState("");
    const [discoveredUrls, setDiscoveredUrls] = React.useState<string[]>([]);
    const [crawledSiteUrl, setCrawledSiteUrl] = React.useState("");

    // UI state
    const [docUploadCollapsed, setDocUploadCollapsed] = React.useState(false);
    const [qaManualCollapsed, setQaManualCollapsed] = React.useState(false);

    // Auth state
    const [accessToken, setAccessToken] = React.useState("");

    // Data state
    const [limits, setLimits] = React.useState<WorkspaceLimits | null>(null);
    const [sources, setSources] = React.useState<KnowledgeSource[]>([]);
    const [siteGroups, setSiteGroups] = React.useState<
        { domain: string; sources: KnowledgeSource[] }[]
    >([]);

    React.useEffect(() => {
        setMounted(true);
        refreshData();
    }, []);

    React.useEffect(() => {
        const grouped = sources.reduce((acc, source) => {
            let domain = source.url;
            try {
                domain = new URL(source.url).hostname;
            } catch {
                // Keep full URL if invalid
            }
            if (!acc[domain]) {
                acc[domain] = [];
            }
            acc[domain].push(source);
            return acc;
        }, {} as Record<string, KnowledgeSource[]>);

        const sortedGroups = Object.entries(grouped)
            .map(([domain, sources]) => ({ domain, sources }))
            .sort((a, b) => a.domain.localeCompare(b.domain)); // Optional: sort by domain

        setSiteGroups(sortedGroups);
    }, [sources]);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    async function refreshData() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        // Keep token in state so DocumentUploader can use it
        setAccessToken(session.access_token);

        const [limitsData, sourcesData] = await Promise.all([
            getWorkspaceLimits(session.access_token),
            getKnowledgeSources(session.access_token),
        ]);
        setLimits(limitsData);
        setSources(sourcesData as KnowledgeSource[]);
    }

    // ── Real-time subscription: update KB panel live as pages complete ──
    React.useEffect(() => {
        let channel: ReturnType<typeof supabase.channel> | null = null;

        (async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user?.id) return;

            channel = supabase
                .channel("kb-live")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "knowledge_sources",
                        filter: `workspace_id=eq.${session.user.id}`,
                    },
                    () => {
                        // Re-fetch limits + sources whenever any row changes
                        refreshData();
                    }
                )
                .subscribe();
        })();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCrawl = async () => {
        if (!url.trim()) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) {
            setCrawlState("error");
            setErrorMsg("You are not signed in. Please sign in first.");
            return;
        }

        const token = session.access_token;

        // ── Phase 1: Discover pages via /api/get-links ──
        setCrawlState("discovering");
        setErrorMsg("");
        setPageResults([]);
        setCurrentPage(0);
        setTotalPages(0);
        setCurrentUrl("");
        setSitemapSource("");
        setDiscoveredUrls([]);
        setCrawledSiteUrl(url.trim());

        let urls: string[];
        try {
            const res = await fetch("/api/get-links", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: url.trim(), accessToken: token }),
            });
            const data = await res.json();
            if (data.error && (!data.urls || data.urls.length === 0)) {
                setCrawlState("error");
                setErrorMsg(data.error);
                return;
            }
            urls = data.urls ?? [];
            setSitemapSource(data.source ?? "unknown");
            setDiscoveredUrls(urls);
        } catch (err) {
            setCrawlState("error");
            setErrorMsg(err instanceof Error ? err.message : "Failed to discover pages");
            return;
        }

        setTotalPages(urls.length);
        if (urls.length === 0) {
            setCrawlState("error");
            setErrorMsg("No pages discovered. Check the URL and try again.");
            return;
        }

        // ── Phase 2: Browser drives 40-concurrent /api/process-page requests ──
        // Each request is an independent serverless invocation = horizontal scaling.
        setCrawlState("crawling");
        const CONCURRENCY = 40;
        const MAX_RETRIES = 3;
        const RETRY_DELAY_MS = 2000;
        const results: PageResult[] = [];
        let processed = 0;

        // Auto-retry helper: retries up to MAX_RETRIES with RETRY_DELAY_MS backoff
        async function processWithRetry(
            pageUrl: string,
            attempt: number = 1
        ): Promise<{ success: boolean; chunkCount?: number; charCount?: number; error?: string }> {
            try {
                const res = await fetch("/api/process-page", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: pageUrl, accessToken: token }),
                });
                const data = await res.json();
                // If the server returned success: false, retry on transient errors
                if (!data.success && attempt < MAX_RETRIES) {
                    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
                    return processWithRetry(pageUrl, attempt + 1);
                }
                return data;
            } catch (err) {
                // Network-level failure — retry if attempts remain
                if (attempt < MAX_RETRIES) {
                    await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
                    return processWithRetry(pageUrl, attempt + 1);
                }
                return { success: false, error: err instanceof Error ? err.message : "Network error" };
            }
        }

        // Simple semaphore-based concurrency pool (no external library)
        const queue = [...urls];

        async function worker() {
            while (queue.length > 0) {
                const pageUrl = queue.shift();
                if (!pageUrl) break;

                const data = await processWithRetry(pageUrl);
                processed++;
                setCurrentPage(processed);
                setCurrentUrl(pageUrl);
                const result: PageResult = {
                    url: pageUrl,
                    success: data.success,
                    chunkCount: data.chunkCount,
                    charCount: data.charCount,
                    error: data.error,
                };
                results.push(result);
                setPageResults([...results]);
                if (processed % 10 === 0) await refreshData();
            }
        }

        // Spin up CONCURRENCY workers — they pull from the shared queue
        await Promise.allSettled(
            Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker())
        );

        setCrawlState("done");
        setUrl("");
        await refreshData();
    };

    const successes = pageResults.filter((r) => r.success).length;
    const failures = pageResults.filter((r) => !r.success).length;
    const totalChunks = pageResults.reduce((acc, r) => acc + (r.chunkCount ?? 0), 0);
    const totalChars = pageResults.reduce((acc, r) => acc + (r.charCount ?? 0), 0);
    const completedCount = sources.filter((s) => s.status === "completed").length;
    const firstFailureError = pageResults.find((r) => !r.success)?.error;

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Split Screen Layout */}
            <div className="flex min-h-screen">
                {/* ─── LEFT PANEL ─────────────────────────────────────────────── */}
                <div className="flex w-1/2 flex-col border-r border-zinc-200 bg-white/80 p-8 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 lg:p-12">
                    {/* Step badge */}
                    <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                        <Sparkles className="h-4 w-4" />
                        Step 2 of 3
                    </div>

                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-4xl">
                        Train your Agent&apos;s Brain
                    </h1>
                    <p className="mb-8 text-base text-zinc-600 dark:text-zinc-400">
                        Enter your website URL. We&apos;ll discover all pages from the sitemap, crawl each one, and embed them into your knowledge base.
                    </p>

                    {/* ── URL Input + Button ── */}
                    <div className="mb-6">
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Website URL
                        </label>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => {
                                        setUrl(e.target.value);
                                        if (crawlState === "done" || crawlState === "error") {
                                            setCrawlState("idle");
                                            setErrorMsg("");
                                        }
                                    }}
                                    onKeyDown={(e) => e.key === "Enter" && handleCrawl()}
                                    placeholder="https://your-company.com"
                                    disabled={crawlState === "discovering" || crawlState === "crawling"}
                                    className="h-14 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                                />
                            </div>
                            <Button
                                onClick={handleCrawl}
                                disabled={!url.trim() || crawlState === "discovering" || crawlState === "crawling"}
                                className="h-14 gap-2 rounded-xl bg-zinc-900 px-6 text-base font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                {crawlState === "discovering" || crawlState === "crawling" ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                                {crawlState === "discovering"
                                    ? "Discovering…"
                                    : crawlState === "crawling"
                                        ? "Crawling…"
                                        : "Crawl & Embed"}
                            </Button>
                        </div>

                        {/* ── Status Feedback ── */}

                        {/* Discovering phase */}
                        {crawlState === "discovering" && (
                            <div className="mt-3 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm text-violet-700 dark:border-violet-800/40 dark:bg-violet-950/30 dark:text-violet-300">
                                <Search className="h-4 w-4 animate-pulse flex-shrink-0" />
                                <span>Searching for sitemap and discovering pages…</span>
                            </div>
                        )}

                        {/* Site discovery card — shown once URLs are found */}
                        {discoveredUrls.length > 0 && (crawlState === "crawling" || crawlState === "done" || crawlState === "error") && (
                            <SiteDiscoveryCard
                                siteUrl={crawledSiteUrl}
                                urls={discoveredUrls}
                                crawlState={crawlState}
                            />
                        )}

                        {/* Crawling phase — progress bar */}
                        {crawlState === "crawling" && totalPages > 0 && (
                            <CrawlProgressBar
                                current={currentPage}
                                total={totalPages}
                                currentUrl={currentUrl}
                                successes={successes}
                                failures={failures}
                            />
                        )}

                        {/* Found pages notification (shows briefly during crawl) */}
                        {crawlState === "crawling" && sitemapSource && sitemapSource !== "fallback" && sitemapSource !== "input" && currentPage <= 1 && (
                            <div className="mt-2 flex items-center gap-2 rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-xs text-indigo-600 dark:border-indigo-800/30 dark:bg-indigo-950/20 dark:text-indigo-400">
                                <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                                <span>Found <strong>{totalPages}</strong> pages from sitemap</span>
                            </div>
                        )}

                        {/* Done phase */}
                        {crawlState === "done" && pageResults.length > 0 && (
                            <div className="mt-3 space-y-2">
                                <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                    <span>
                                        Done! Crawled <strong>{successes}/{pageResults.length} pages</strong> successfully
                                        — saved <strong>{totalChunks} chunks</strong> from{" "}
                                        <strong>{totalChars.toLocaleString()} characters</strong>.
                                    </span>
                                </div>
                                {failures > 0 && (
                                    <div className="flex flex-col gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:border-amber-800/40 dark:bg-amber-950/30 dark:text-amber-400">
                                        <div className="flex items-center gap-1.5">
                                            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span className="font-semibold">{failures} page{failures > 1 ? "s" : ""} failed to crawl</span>
                                        </div>
                                        {firstFailureError && (
                                            <p className="ml-5 font-mono text-[11px] text-amber-600 dark:text-amber-500">
                                                Error: {firstFailureError}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error phase */}
                        {crawlState === "error" && (
                            <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400">
                                <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                    </div>

                    {/* ── Workspace Limits ── */}
                    {limits && (
                        <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-700 dark:bg-zinc-800/50">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Workspace Usage — {limits.planLabel}
                                </h3>
                                <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                                    {limits.plan === "free_trial" ? "Free Trial" : `$${limits.plan === "pro" ? 39 : 99}/mo`}
                                </span>
                            </div>
                            <div className="space-y-3">
                                <LimitBar
                                    label="Pages crawled"
                                    used={limits.totalPages}
                                    max={limits.maxPages}
                                />
                                <LimitBar
                                    label="Characters stored"
                                    used={limits.totalChars}
                                    max={limits.maxChars}
                                />
                            </div>
                        </div>
                    )}

                    {/* ── Additional Sources ── */}
                    <div className="flex-1 space-y-4">
                        {/* Document Upload — LIVE */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/40">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Document Upload</p>
                                    <p className="text-xs text-zinc-500">PDFs, DOCX, TXT — text extracted in your browser</p>
                                </div>
                                <button
                                    onClick={() => setDocUploadCollapsed(!docUploadCollapsed)}
                                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    title={docUploadCollapsed ? "Expand" : "Collapse"}
                                >
                                    {docUploadCollapsed ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronUp className="h-4 w-4 text-zinc-400" />}
                                </button>
                            </div>
                            {accessToken ? (
                                <DocumentUploader
                                    accessToken={accessToken}
                                    onSuccess={refreshData}
                                    isCollapsed={docUploadCollapsed}
                                />
                            ) : (
                                <div className="flex items-center justify-center py-6 text-xs text-zinc-400">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                                </div>
                            )}
                        </div>

                        {/* Q&A Manual Entry — LIVE */}
                        <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800/40">
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
                                    <MessageSquare className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Q&amp;A Manual Entry</p>
                                    <p className="text-xs text-zinc-500">Add custom FAQs and knowledge pairs</p>
                                </div>
                                <button
                                    onClick={() => setQaManualCollapsed(!qaManualCollapsed)}
                                    className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                                    title={qaManualCollapsed ? "Expand" : "Collapse"}
                                >
                                    {qaManualCollapsed ? <ChevronDown className="h-4 w-4 text-zinc-400" /> : <ChevronUp className="h-4 w-4 text-zinc-400" />}
                                </button>
                            </div>
                            {accessToken ? (
                                <QAManualEntry
                                    accessToken={accessToken}
                                    onSuccess={refreshData}
                                    isCollapsed={qaManualCollapsed}
                                />
                            ) : (
                                <div className="flex items-center justify-center py-6 text-xs text-zinc-400">
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading…
                                </div>
                            )}
                        </div>

                        {/* Coming soon sources */}
                        <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
                            More Sources (coming soon)
                        </label>
                        {[
                            { label: "Video Learning", desc: "YouTube URL transcription", icon: <Play className="h-5 w-5" />, color: "text-red-600 bg-red-100 dark:bg-red-900/40" },
                        ].map(({ label, desc, icon, color }) => (
                            <div
                                key={label}
                                className="group flex cursor-not-allowed items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 opacity-60 dark:border-zinc-700 dark:bg-zinc-800/40"
                            >
                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                                    {icon}
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{label}</p>
                                    <p className="text-xs text-zinc-500">{desc}</p>
                                </div>
                                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-400 dark:bg-zinc-700">Soon</span>
                            </div>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            onClick={() => router.back()}
                            className="gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <Button
                            onClick={() => router.push("/actions")}
                            disabled={completedCount === 0}
                            className={`h-12 w-40 gap-2 rounded-xl font-semibold transition-all ${completedCount > 0
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700"
                                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                                }`}
                        >
                            Continue
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* ─── RIGHT PANEL ─────────────────────────────────────────────── */}
                <div className="flex w-1/2 flex-col p-8 lg:p-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            Knowledge Base
                        </h2>
                        {sources.length > 0 && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                                {completedCount} page{completedCount !== 1 ? "s" : ""} indexed
                            </span>
                        )}
                    </div>

                    {/* Site-grouped collapsible cards */}
                    <div className="flex-1 overflow-y-auto">
                        {siteGroups.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900/60">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50">
                                    <Globe className="h-10 w-10 text-violet-500" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                    No sources yet
                                </h3>
                                <p className="max-w-xs text-sm text-zinc-500">
                                    Enter a URL on the left and click &quot;Crawl &amp; Embed&quot; to start building your knowledge base.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {siteGroups.map(({ domain, sources: siteSources }) => (
                                    <SiteCard key={domain} domain={domain} sources={siteSources} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* How it works */}
                    <div className="mt-6 rounded-xl border border-zinc-100 bg-zinc-50/80 p-5 dark:border-zinc-800 dark:bg-zinc-800/30">
                        <h3 className="mb-3 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            How it works
                        </h3>
                        <ol className="space-y-2">
                            {[
                                { step: "1", label: "Discover", desc: "Find all pages from your website's sitemap" },
                                { step: "2", label: "Fetch", desc: "Jina AI Reader extracts clean Markdown from each page" },
                                { step: "3", label: "Chunk & Embed", desc: "Content split and embedded with text-embedding-3-small" },
                                { step: "4", label: "Store", desc: "Vectors saved to Supabase pgvector, isolated by workspace" },
                            ].map(({ step, label, desc }) => (
                                <li key={step} className="flex items-start gap-3">
                                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                                        {step}
                                    </span>
                                    <div>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{label}:</span>{" "}
                                        <span className="text-xs text-zinc-500">{desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}
