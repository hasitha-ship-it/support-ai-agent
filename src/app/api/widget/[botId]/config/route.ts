import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { DEFAULT_UI_CONFIG } from "@/lib/ui-config";

// ─── CORS helpers ─────────────────────────────────────────────────────────────

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ─── OPTIONS /api/widget/[botId]/config — preflight ──────────────────────────

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: CORS_HEADERS,
    });
}

// ─── GET /api/widget/[botId]/config ──────────────────────────────────────────
//
// PUBLIC — no auth required.
// Called by the embeddable chat widget on any external customer website.
//
// Note: botId == the Supabase user's profile.id (workspace ID).

export async function GET(
    _req: NextRequest,
    { params }: { params: { botId: string } }
) {
    const { botId } = params;

    if (!botId) {
        return NextResponse.json(
            { success: false, error: "botId is required." },
            { status: 400, headers: CORS_HEADERS }
        );
    }

    // Use the service-role or anon key for public access — no user token needed
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch ui_config, is_published, and enabled_actions from profiles
    const { data: profile, error } = await supabase
        .from("profiles")
        .select("ui_config, is_published, enabled_actions")
        .eq("id", botId)
        .single();

    if (error || !profile) {
        return NextResponse.json(
            { success: false, error: "Bot configuration not found." },
            { status: 404, headers: CORS_HEADERS }
        );
    }

    // Only expose config for published bots
    if (!profile.is_published) {
        return NextResponse.json(
            { success: false, error: "This bot is not yet published." },
            { status: 403, headers: CORS_HEADERS }
        );
    }

    const uiConfig = {
        ...DEFAULT_UI_CONFIG,
        ...(profile.ui_config ?? {}),
    };

    return NextResponse.json(
        {
            success: true,
            uiConfig,
            enabledActions: profile.enabled_actions ?? [],
        },
        { status: 200, headers: CORS_HEADERS }
    );
}
