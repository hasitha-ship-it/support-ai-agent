import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// ─── GET /api/debug-rag?q=price ──────────────────────────────────────────────
// Debug endpoint: shows exactly what chunks are stored and what gets retrieved.
// Protected by Bearer token (must be logged in).
// Usage:  GET /api/debug-rag?q=price
//         GET /api/debug-rag               (lists all stored sources)

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
        return NextResponse.json({ error: "Authorization header required." }, { status: 401 });
    }

    const supabase = createServerSupabaseClient(token);
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) {
        return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }

    const workspaceId = user.id;
    const query = req.nextUrl.searchParams.get("q");

    // ── 1. Summary of stored knowledge ────────────────────────────────────────
    const { data: sources } = await supabase
        .from("knowledge_sources")
        .select("url, status, character_count, created_at")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

    const { count: embCount } = await supabase
        .from("knowledge_embeddings")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", workspaceId);

    if (!query) {
        // No query param — just show stored sources summary
        return NextResponse.json({
            workspace_id: workspaceId,
            total_sources: sources?.length ?? 0,
            total_embeddings: embCount ?? 0,
            sources: sources?.map(s => ({
                url: s.url,
                status: s.status,
                chars: s.character_count,
            })),
        });
    }

    // ── 2. Run similarity search for the query ────────────────────────────────
    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            "X-Title": "Support AI Agent Debug",
        },
    });

    let embedding: number[];
    try {
        const embRes = await openai.embeddings.create({
            model: "openai/text-embedding-3-small",
            input: [query],
            encoding_format: "float",
        });
        embedding = embRes.data[0]?.embedding ?? [];
    } catch (err) {
        return NextResponse.json({ error: `Embedding failed: ${err}` }, { status: 500 });
    }

    if (!embedding.length) {
        return NextResponse.json({ error: "Empty embedding returned." }, { status: 500 });
    }

    const { data: matches, error: rpcErr } = await supabase.rpc("match_embeddings", {
        query_embedding: embedding,
        match_workspace_id: workspaceId,
        match_count: 20,
    });

    if (rpcErr) {
        return NextResponse.json({
            error: `match_embeddings RPC error: ${rpcErr.message}`,
            hint: "Make sure you ran supabase/migrations/match_embeddings.sql in your Supabase SQL editor.",
        }, { status: 500 });
    }

    return NextResponse.json({
        workspace_id: workspaceId,
        query,
        total_embeddings_in_db: embCount ?? 0,
        total_sources: sources?.length ?? 0,
        matches_returned: matches?.length ?? 0,
        results: (matches as Array<{ content_chunk: string; similarity: number }>)?.map(m => ({
            similarity: parseFloat(m.similarity.toFixed(4)),
            preview: m.content_chunk.slice(0, 200) + (m.content_chunk.length > 200 ? "…" : ""),
        })),
    });
}
