import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getPlan, getUserPlanId } from "@/lib/plans";

// ─── Constants ────────────────────────────────────────────────────────────────
const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;
const DB_CHUNK_SIZE = 200; // rows per Supabase INSERT batch

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
    const { text, fileName, accessToken } = await req.json() as {
        text: string;
        fileName: string;
        accessToken: string;
    };

    if (!text || !fileName || !accessToken) {
        return NextResponse.json(
            { success: false, error: "Missing text, fileName, or accessToken" },
            { status: 400 }
        );
    }

    // ── Auth ──
    const supabase = createServerSupabaseClient(accessToken);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const workspaceId = user.id;

    try {
        const charCount = text.length;

        // ── Check plan char limit ────────────────────────────────────────────────
        const planId = await getUserPlanId(supabase, workspaceId);
        const plan = getPlan(planId);

        const { data: existing } = await supabase
            .from("knowledge_sources")
            .select("character_count")
            .eq("workspace_id", workspaceId)
            .eq("status", "completed");
        const usedChars = (existing ?? []).reduce((a, s) => a + (s.character_count ?? 0), 0);

        if (usedChars + charCount > plan.chars) {
            return NextResponse.json({
                success: false,
                error: `Character limit reached for ${plan.label} plan (${plan.chars.toLocaleString()} chars). Please upgrade your plan.`,
            }, { status: 403 });
        }

        // ── 1. Chunk the pre-extracted text ──
        const chunks = chunkText(text);
        if (chunks.length === 0) {
            return NextResponse.json({ success: false, error: "No text chunks after processing" });
        }

        // ── 2. Insert / upsert source record ──
        // We store doc://<fileName> as the URL so it's distinct from web pages
        const docUrl = `doc://${fileName}`;

        const { data: insertedRecord } = await supabase
            .from("knowledge_sources")
            .insert({ workspace_id: workspaceId, url: docUrl, status: "pending", character_count: charCount })
            .select("id")
            .single();

        let sourceId: string | null = insertedRecord?.id ?? null;

        // Fallback: row already exists
        if (!sourceId) {
            const { data: existing } = await supabase
                .from("knowledge_sources")
                .select("id")
                .eq("workspace_id", workspaceId)
                .eq("url", docUrl)
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

        // ── 4. Bulk insert embeddings in batches ──
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
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ success: false, error: msg });
    }
}
