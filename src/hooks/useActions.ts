"use client";

import * as React from "react";
import { supabase } from "@/lib/supabase";
import type { ActionDefinition, ActionCategory } from "@/lib/actions-definitions";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ActionWithState extends ActionDefinition {
    enabled: boolean;
    locked: boolean;     // true if premiumOnly and user is on free_trial
}

export interface ActionsState {
    actions: ActionWithState[];
    enabledActions: string[];
    planId: string;
    planLabel: string;
    actionStoreLimit: number | null;
    usedSlots: number;
    loading: boolean;
    error: string | null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Fetches the action store state for the current workspace.
 * Provides `toggleAction` to enable/disable individual actions.
 *
 * Usage:
 *   const { actions, toggleAction, loading, error } = useActions();
 */
export function useActions() {
    const [state, setState] = React.useState<ActionsState>({
        actions: [],
        enabledActions: [],
        planId: "free_trial",
        planLabel: "Free Trial",
        actionStoreLimit: 5,
        usedSlots: 0,
        loading: true,
        error: null,
    });

    // Fetch on mount
    React.useEffect(() => {
        void fetchActions();
    }, []);

    async function getToken(): Promise<string | null> {
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token ?? null;
    }

    async function fetchActions() {
        setState((s) => ({ ...s, loading: true, error: null }));
        const token = await getToken();
        if (!token) {
            setState((s) => ({ ...s, loading: false, error: "Not authenticated." }));
            return;
        }

        const res = await fetch("/api/bot/update-actions", {
            headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!data.success) {
            setState((s) => ({ ...s, loading: false, error: data.error ?? "Failed to load actions." }));
            return;
        }

        setState({
            actions: data.actions,
            enabledActions: data.enabledActions,
            planId: data.planId,
            planLabel: data.planLabel,
            actionStoreLimit: data.actionStoreLimit,
            usedSlots: data.usedSlots,
            loading: false,
            error: null,
        });
    }

    /**
     * Toggle a single action on or off.
     * Returns `{ success, error }`.
     */
    async function toggleAction(actionId: string, enable: boolean): Promise<{ success: boolean; error?: string }> {
        const token = await getToken();
        if (!token) return { success: false, error: "Not authenticated." };

        const res = await fetch("/api/bot/update-actions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ actionId, operation: enable ? "enable" : "disable" }),
        });

        const data = await res.json();

        if (data.success) {
            // Optimistic update: refresh derived state from returned enabledActions
            setState((s) => ({
                ...s,
                enabledActions: data.enabledActions,
                usedSlots: data.used ?? data.enabledActions.length,
                actions: s.actions.map((a) => ({
                    ...a,
                    enabled: (data.enabledActions as string[]).includes(a.id),
                })),
            }));
            return { success: true };
        }

        return { success: false, error: data.error };
    }

    /** Group actions by category for easy rendering. */
    function getByCategory(category: ActionCategory): ActionWithState[] {
        return state.actions.filter((a) => a.category === category);
    }

    return {
        ...state,
        toggleAction,
        getByCategory,
        refetch: fetchActions,
    };
}
