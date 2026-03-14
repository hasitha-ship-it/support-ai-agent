import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { getPlan, getUserPlanId } from "@/lib/plans";
import { getAction, ACTIONS_REGISTRY } from "@/lib/actions-definitions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UpdateActionsBody {
    actionId: string;
    operation: "enable" | "disable";
}

// ─── POST /api/bot/update-actions ─────────────────────────────────────────────

export async function POST(req: NextRequest) {
    // ── 1. Parse body ────────────────────────────────────────────────────────
    let body: UpdateActionsBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const { actionId, operation } = body;

    if (!actionId || !["enable", "disable"].includes(operation)) {
        return NextResponse.json(
            { success: false, error: "Missing or invalid actionId / operation." },
            { status: 400 }
        );
    }

    // ── 2. Auth ──────────────────────────────────────────────────────────────
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

    // ── 3. Validate action exists ────────────────────────────────────────────
    const actionDef = getAction(actionId);
    if (!actionDef) {
        return NextResponse.json(
            { success: false, error: `Unknown action: "${actionId}".` },
            { status: 404 }
        );
    }

    // ── 4. Load user plan ────────────────────────────────────────────────────
    const planId = await getUserPlanId(supabase, workspaceId);
    const plan = getPlan(planId);

    // ── 5. Load current enabled_actions from profiles ────────────────────────
    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("enabled_actions")
        .eq("id", workspaceId)
        .single();

    if (profileError) {
        return NextResponse.json(
            { success: false, error: "Failed to load profile." },
            { status: 500 }
        );
    }

    const currentActions: string[] = profile?.enabled_actions ?? [];

    // ── 6. Handle ENABLE ────────────────────────────────────────────────────
    if (operation === "enable") {
        // Already enabled — idempotent success
        if (currentActions.includes(actionId)) {
            return NextResponse.json({
                success: true,
                enabledActions: currentActions,
                message: "Action was already enabled.",
            });
        }

        // Plan limit: check actionStore cap (Infinity = unlimited)
        const actionStoreLimit = plan.actionStore;
        if (isFinite(actionStoreLimit) && currentActions.length >= actionStoreLimit) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Action store limit reached. Your ${plan.label} plan supports up to ${actionStoreLimit} actions. Upgrade to Pro or Enterprise for unlimited actions.`,
                    limitReached: true,
                    planLabel: plan.label,
                    limit: actionStoreLimit,
                    used: currentActions.length,
                },
                { status: 403 }
            );
        }

        // NOTE: Free trial users can enable ANY action freely (only the slot cap applies).

        // Add action
        const updatedActions = [...currentActions, actionId];
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ enabled_actions: updatedActions })
            .eq("id", workspaceId);

        if (updateError) {
            return NextResponse.json(
                { success: false, error: "Failed to save action." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            enabledActions: updatedActions,
            planLabel: plan.label,
            limit: isFinite(plan.actionStore) ? plan.actionStore : null,
            used: updatedActions.length,
        });
    }

    // ── 7. Handle DISABLE ───────────────────────────────────────────────────
    if (operation === "disable") {
        // Not enabled — idempotent success
        if (!currentActions.includes(actionId)) {
            return NextResponse.json({
                success: true,
                enabledActions: currentActions,
                message: "Action was already disabled.",
            });
        }

        const updatedActions = currentActions.filter((id) => id !== actionId);
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ enabled_actions: updatedActions })
            .eq("id", workspaceId);

        if (updateError) {
            return NextResponse.json(
                { success: false, error: "Failed to update actions." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            enabledActions: updatedActions,
            planLabel: plan.label,
            limit: isFinite(plan.actionStore) ? plan.actionStore : null,
            used: updatedActions.length,
        });
    }

    return NextResponse.json({ success: false, error: "Invalid operation." }, { status: 400 });
}

// ─── GET /api/bot/update-actions — fetch current enabled actions + plan state ──

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

    const workspaceId = user.id;
    const planId = await getUserPlanId(supabase, workspaceId);
    const plan = getPlan(planId);

    const { data: profile } = await supabase
        .from("profiles")
        .select("enabled_actions")
        .eq("id", workspaceId)
        .single();

    const enabledActions: string[] = profile?.enabled_actions ?? [];

    // Annotate with enabled state only — no locked state (free trial can pick any 5)
    const atSlotLimit = isFinite(plan.actionStore) && enabledActions.length >= plan.actionStore;
    const actions = ACTIONS_REGISTRY.map((action) => ({
        ...action,
        enabled: enabledActions.includes(action.id),
        // locked only if at slot cap AND this action is not already enabled
        locked: atSlotLimit && !enabledActions.includes(action.id),
    }));

    return NextResponse.json({
        success: true,
        actions,
        enabledActions,
        planId,
        planLabel: plan.label,
        actionStoreLimit: isFinite(plan.actionStore) ? plan.actionStore : null,
        usedSlots: enabledActions.length,
    });
}
