import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { DEFAULT_UI_CONFIG } from "@/lib/ui-config";
import type { UiConfig } from "@/lib/ui-config";

// ─── POST /api/bot/update-ui ──────────────────────────────────────────────────
//
// Body: { uiConfig: UiConfig, publish?: boolean }
// Auth: Bearer <supabase-access-token> in Authorization header
//
// Saves ui_config to profiles and optionally sets is_published = true.

export async function POST(req: NextRequest) {
    // ── 1. Parse body ─────────────────────────────────────────────────────────
    let body: { uiConfig: UiConfig; publish?: boolean };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { success: false, error: "Invalid JSON body." },
            { status: 400 }
        );
    }

    const { uiConfig, publish = false } = body;

    if (!uiConfig || typeof uiConfig !== "object") {
        return NextResponse.json(
            { success: false, error: "Missing or invalid uiConfig object." },
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

    // ── 3. Merge with defaults (safety net) ───────────────────────────────────
    const safeConfig: UiConfig = {
        ...DEFAULT_UI_CONFIG,
        ...uiConfig,
        // Sanitise string fields
        agentName: (uiConfig.agentName ?? DEFAULT_UI_CONFIG.agentName).slice(0, 100),
        welcomeMessage: (uiConfig.welcomeMessage ?? DEFAULT_UI_CONFIG.welcomeMessage).slice(0, 500),
        // Ensure quickActions is a clean array of strings
        quickActions: Array.isArray(uiConfig.quickActions)
            ? uiConfig.quickActions.filter((id) => typeof id === "string").slice(0, 5)
            : [],
        // Clamp color to valid hex (basic safety)
        primaryColor: /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(uiConfig.primaryColor ?? "")
            ? uiConfig.primaryColor
            : DEFAULT_UI_CONFIG.primaryColor,
    };

    // ── 4. Build the update payload ───────────────────────────────────────────
    const updatePayload: { ui_config: UiConfig; is_published?: boolean } = {
        ui_config: safeConfig,
    };

    if (publish) {
        updatePayload.is_published = true;
    }

    // ── 5. Save to profiles ───────────────────────────────────────────────────
    console.log("[update-ui] Saving for user:", user.id, "publish:", publish, "payload keys:", Object.keys(updatePayload));
    const { error: updateError, count } = await supabase
        .from("profiles")
        .update(updatePayload)
        .eq("id", user.id);

    console.log("[update-ui] Update result: error=", updateError, "count=", count);

    if (updateError) {
        console.error("[update-ui] DB error:", JSON.stringify(updateError));
        return NextResponse.json(
            { success: false, error: `Failed to save UI configuration: ${updateError.message}` },
            { status: 500 }
        );
    }

    return NextResponse.json({
        success: true,
        uiConfig: safeConfig,
        is_published: publish,
        message: publish
            ? "Bot published successfully! Your widget is now live."
            : "UI configuration saved successfully.",
    });
}

// ─── GET /api/bot/update-ui — fetch current config ────────────────────────────

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

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("ui_config, is_published")
        .eq("id", user.id)
        .single();

    if (profileError) {
        console.error("[update-ui GET] DB error:", profileError);
        return NextResponse.json(
            { success: false, error: "Failed to load UI configuration." },
            { status: 500 }
        );
    }

    const uiConfig: UiConfig = {
        ...DEFAULT_UI_CONFIG,
        ...(profile?.ui_config ?? {}),
    };

    return NextResponse.json({
        success: true,
        uiConfig,
        is_published: profile?.is_published ?? false,
    });
}
