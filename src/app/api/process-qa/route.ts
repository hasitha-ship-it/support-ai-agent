import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getPlan, getUserPlanId } from "@/lib/plans";

// ─── Constants ─────────────────────────────────────────────────────────────────
const DB_CHUNK_SIZE = 200;

// ─── Types ─────────────────────────────────────────────────────────────────────
interface QAPair {
    question: string;
    answer: string;
}

// ─── Route ─────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    const { qaPairs, accessToken } = await req.json() as {
        qaPairs: QAPair[];
        accessToken: string;
    };

    if (!qaPairs || !Array.isArray(qaPairs) || qaPairs.length === 0 || !accessToken) {
        return NextResponse.json(
            { success: false, error: "Missing qaPairs or accessToken" },
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
        // ── 1. Filter valid pairs and format as text strings ──
        const validPairs = qaPairs.filter(
            (p) => p.question?.trim().length > 0 && p.answer?.trim().length > 0
        );
        if (validPairs.length === 0) {
            return NextResponse.json({ success: false, error: "No valid Q&A pairs provided" });
        }

        const formattedTexts = validPairs.map(
            ({ question, answer }) =>
                `Question: ${question.trim()}\nAnswer: ${answer.trim()}`
        );

        // ── Check plan char limit ────────────────────────────────────────────────
        const planId = await getUserPlanId(supabase, workspaceId);
        const plan = getPlan(planId);
        const newChars = formattedTexts.reduce((a, t) => a + t.length, 0);

        const { data: existing } = await supabase
            .from("knowledge_sources")
            .select("character_count")
            .eq("workspace_id", workspaceId)
            .eq("status", "completed");
        const usedChars = (existing ?? []).reduce((a, s) => a + (s.character_count ?? 0), 0);

        if (usedChars + newChars > plan.chars) {
            return NextResponse.json({
                success: false,
                error: `Character limit reached for ${plan.label} plan (${plan.chars.toLocaleString()} chars). Please upgrade your plan.`,
            }, { status: 403 });
        }

        // ── 2. Create a single knowledge_source row for this session's Q&A batch ──
        const batchLabel = `manual_qa:${new Date().toISOString()}`;

        const { data: insertedRecord } = await supabase
            .from("knowledge_sources")
            .insert({
                workspace_id: workspaceId,
                url: batchLabel,
                status: "pending",
                character_count: formattedTexts.reduce((a, t) => a + t.length, 0),
            })
            .select("id")
            .single();

        let sourceId: string | null = insertedRecord?.id ?? null;

        if (!sourceId) {
            return NextResponse.json({ success: false, error: "Failed to create DB record" });
        }

        // ── 3. Generate embeddings — one API call for all pairs ──
        const openai = new OpenAI({
            apiKey: process.env.OPENROUTER_API_KEY,
            baseURL: "https://openrouter.ai/api/v1",
            defaultHeaders: {
                "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            },
        });

        const embRes = await openai.embeddings.create({
            model: "openai/text-embedding-3-small",
            input: formattedTexts,
            encoding_format: "float",
        });
        const embeddings = embRes.data.map((d) => d.embedding);

        // ── 4. Bulk insert into knowledge_embeddings ──
        const allRows = formattedTexts.map((text, i) => ({
            source_id: sourceId,
            workspace_id: workspaceId,
            content_chunk: text,
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

        return NextResponse.json({ success: true, savedCount: validPairs.length });

    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return NextResponse.json({ success: false, error: msg });
    }
}
