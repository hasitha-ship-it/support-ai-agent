import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { AI_MODELS, DEFAULT_MODEL_ID, getModelConfig } from "@/config/ai-models";
import { getPlan, getUserPlanId } from "@/lib/plans";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface PersonalityBody {
    ai_model: string;
    system_prompt: string;
    tone_of_voice: string;
}

// ─── POST /api/bot/update-personality ─────────────────────────────────────────
//
// Saves ai_model, system_prompt, and tone_of_voice to profiles table.
// Validates that free-tier users can only use gpt-4o-mini.

export async function POST(req: NextRequest) {
    // ── 1. Parse body ─────────────────────────────────────────────────────────
    let body: PersonalityBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const { ai_model, system_prompt, tone_of_voice } = body;

    if (!ai_model || !tone_of_voice) {
        return NextResponse.json(
            { success: false, error: "ai_model and tone_of_voice are required." },
            { status: 400 }
        );
    }

    // ── 2. Validate model exists ───────────────────────────────────────────────
    if (!AI_MODELS[ai_model]) {
        return NextResponse.json(
            { success: false, error: `Unknown model: "${ai_model}". Valid models: ${Object.keys(AI_MODELS).join(", ")}` },
            { status: 400 }
        );
    }

    // ── 3. Auth ───────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") ?? "";

    if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const supabase = createServerSupabaseClient(token);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    // ── 4. Plan-based model restriction ──────────────────────────────────────
    const planId = await getUserPlanId(supabase, user.id);
    const plan = getPlan(planId);
    const modelConfig = getModelConfig(ai_model);

    // Free trial users can only use models marked free_tier = true
    if (!plan.allModels && !modelConfig.free_tier) {
        return NextResponse.json(
            {
                success: false,
                error: `Upgrade to Pro or Enterprise to use ${modelConfig.name}. Your Free Trial plan only allows GPT-4o Mini.`,
                upgrade_required: true,
                allowed_model: DEFAULT_MODEL_ID,
            },
            { status: 403 }
        );
    }

    // ── 5. Sanitize system prompt ─────────────────────────────────────────────
    const sanitizedPrompt = (system_prompt ?? "You are a helpful AI assistant.")
        .slice(0, 8000) // cap at 8k chars
        .trim() || "You are a helpful AI assistant.";

    // ── 6. Save to profiles ───────────────────────────────────────────────────
    const { error: updateError } = await supabase
        .from("profiles")
        .update({
            ai_model: ai_model,
            system_prompt: sanitizedPrompt,
            tone_of_voice: tone_of_voice,
        })
        .eq("id", user.id);

    if (updateError) {
        console.error("[update-personality] DB error:", updateError);
        return NextResponse.json(
            { success: false, error: "Failed to save personality settings." },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        message: "Personality settings saved.",
        saved: {
            ai_model,
            system_prompt: sanitizedPrompt,
            tone_of_voice,
            credits_per_message: modelConfig.credits,
        },
    });
}

// ─── GET /api/bot/update-personality — fetch current config ──────────────────

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") ?? "";

    if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const supabase = createServerSupabaseClient(token);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("ai_model, system_prompt, tone_of_voice")
        .eq("id", user.id)
        .single();

    const planId = await getUserPlanId(supabase, user.id);
    const plan = getPlan(planId);

    return NextResponse.json({
        success: true,
        ai_model: profile?.ai_model ?? DEFAULT_MODEL_ID,
        system_prompt: profile?.system_prompt ?? "You are a helpful AI assistant.",
        tone_of_voice: profile?.tone_of_voice ?? "professional",
        plan: planId,
        all_models_enabled: plan.allModels,
    });
}
