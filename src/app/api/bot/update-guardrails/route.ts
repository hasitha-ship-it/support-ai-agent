import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DEFAULT_GUARDRAILS } from "@/lib/guardrails";
import type { GuardrailsConfig } from "@/lib/guardrails";

// ─── POST /api/bot/update-guardrails ──────────────────────────────────────────
//
// Body: { config: GuardrailsConfig }
// Auth: Bearer <supabase-access-token> in Authorization header
//
// Saves the guardrails config to profiles.guardrails_config (per workspace).

export async function POST(req: NextRequest) {
    // ── 1. Parse body ─────────────────────────────────────────────────────────
    let body: { config: GuardrailsConfig };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid JSON body." },
            { status: 400 }
        );
    }

    const { config } = body;

    if (!config || typeof config !== "object") {
        return NextResponse.json(
            { success: false, error: "Missing or invalid config object." },
            { status: 400 }
        );
    }

    // ── 2. Auth ───────────────────────────────────────────────────────────────
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

    const workspaceId = user.id;

    // ── 3. Merge with defaults (safety net) ───────────────────────────────────
    const safeConfig: GuardrailsConfig = {
        ...DEFAULT_GUARDRAILS,
        ...config,
        spam_protection: {
            ...DEFAULT_GUARDRAILS.spam_protection,
            ...(config.spam_protection ?? {}),
        },
        content_filters: {
            ...DEFAULT_GUARDRAILS.content_filters,
            ...(config.content_filters ?? {}),
        },
        blacklisted_competitors: Array.isArray(config.blacklisted_competitors)
            ? config.blacklisted_competitors.filter((c) => typeof c === "string" && c.trim().length > 0)
            : [],
    };

    // Clamp rate limit to a sane value
    safeConfig.spam_protection.limit = Math.max(1, Math.min(1000, safeConfig.spam_protection.limit));

    // ── 4. Upsert into profiles ───────────────────────────────────────────────
    const { error: upsertError } = await supabase
        .from("profiles")
        .update({ guardrails_config: safeConfig })
        .eq("id", workspaceId);

    if (upsertError) {
        console.error("[update-guardrails] DB error:", upsertError);
        return NextResponse.json(
            { success: false, error: "Failed to save guardrails configuration." },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        config: safeConfig,
        message: "Guardrails configuration saved successfully.",
    });
}

// ─── GET /api/bot/update-guardrails — fetch current config ────────────────────

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
        .select("guardrails_config")
        .eq("id", user.id)
        .single();

    const config: GuardrailsConfig = {
        ...DEFAULT_GUARDRAILS,
        ...(profile?.guardrails_config ?? {}),
    };

    return NextResponse.json({
        success: true,
        config,
    });
}
