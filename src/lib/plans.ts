// ─── Plan Configuration ────────────────────────────────────────────────────────
// Single source of truth for all subscription plan limits.
// To change a plan's limits, edit ONLY this file.

export type PlanId = "free_trial" | "pro" | "enterprise";

export interface PlanConfig {
    label: string;
    price: number;          // USD/month (0 = free)
    trialDays?: number;     // Only for free_trial
    chatbots: number;
    pages: number;          // Max crawled pages (knowledge_sources)
    chars: number;          // Max total characters stored
    messageCredits: number; // Per billing cycle
    actionStore: number;    // Max actions installed (Infinity = unlimited)
    actionLimit: number;    // Max action executions per month
    allModels: boolean;     // true = GPT + Claude 3.5, false = GPT-4o-mini only
}

export const PLANS: Record<PlanId, PlanConfig> = {
    free_trial: {
        label: "Free Trial",
        price: 0,
        trialDays: 14,
        chatbots: 1,
        pages: 100,
        chars: 2_000_000,
        messageCredits: 200,
        actionStore: 5,
        actionLimit: 20,
        allModels: false,
    },
    pro: {
        label: "Pro",
        price: 39,
        chatbots: 1,
        pages: 1_000,
        chars: 5_000_000,
        messageCredits: 3_000,
        actionStore: Infinity,
        actionLimit: 150,
        allModels: true,
    },
    enterprise: {
        label: "Enterprise",
        price: 99,
        chatbots: 2,
        pages: 3_000,
        chars: 10_000_000,
        messageCredits: 10_000,
        actionStore: Infinity,
        actionLimit: 500,
        allModels: true,
    },
};

/** Returns the plan config for a given plan ID (defaults to free_trial). */
export function getPlan(id: string | null | undefined): PlanConfig {
    if (id && id in PLANS) return PLANS[id as PlanId];
    return PLANS.free_trial;
}

/**
 * Fetches the active plan for a user from the `profiles` table.
 * Falls back to `free_trial` if no record or plan is found.
 */
export async function getUserPlanId(
    supabase: import("@supabase/supabase-js").SupabaseClient,
    userId: string
): Promise<PlanId> {
    const { data } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", userId)
        .single();

    const plan = data?.plan as string | undefined;
    if (plan && plan in PLANS) return plan as PlanId;
    return "free_trial";
}
