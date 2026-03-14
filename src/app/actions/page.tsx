"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    ArrowLeft,
    ArrowRight,
    CreditCard,
    Calendar,
    RefreshCw,
    Shield,
    X,
    CalendarCheck,
    Clock,
    Users,
    Mail,
    Link,
    RefreshCcw,
    List,
    Ticket,
    FileText,
    Bell,
    Lock,
    Unlock,
    LogOut,
    Trash2,
    Loader2,
    Zap,
    CheckCircle,
} from "lucide-react";
import { useActions } from "@/hooks/useActions";
import type { ActionCategory } from "@/lib/actions-definitions";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ACTION_ICONS: Record<string, React.ReactNode> = {
    stripe_process_refund: <RefreshCw className="h-4 w-4" />,
    stripe_check_subscription: <Shield className="h-4 w-4" />,
    stripe_cancel_subscription: <X className="h-4 w-4" />,
    stripe_update_payment_method: <CreditCard className="h-4 w-4" />,
    stripe_send_invoice_email: <Mail className="h-4 w-4" />,
    stripe_check_transactions: <Clock className="h-4 w-4" />,
    stripe_create_payment_link: <Link className="h-4 w-4" />,
    calendly_book_meeting: <CalendarCheck className="h-4 w-4" />,
    calendly_check_availability: <Clock className="h-4 w-4" />,
    calendly_reschedule_meeting: <RefreshCcw className="h-4 w-4" />,
    calendly_cancel_meeting: <X className="h-4 w-4" />,
    calendly_get_event_types: <List className="h-4 w-4" />,
    calendly_list_upcoming_events: <Calendar className="h-4 w-4" />,
    support_report_bug: <Ticket className="h-4 w-4" />,
    support_search_web: <FileText className="h-4 w-4" />,
    support_check_request_status: <RefreshCw className="h-4 w-4" />,
    support_send_slack_alert: <Bell className="h-4 w-4" />,
    support_escalate_to_human: <Users className="h-4 w-4" />,
    account_send_password_reset: <Lock className="h-4 w-4" />,
    account_unlock_user: <Unlock className="h-4 w-4" />,
    account_update_email: <Mail className="h-4 w-4" />,
    account_enable_2fa: <Shield className="h-4 w-4" />,
    account_revoke_sessions: <LogOut className="h-4 w-4" />,
    account_delete_user: <Trash2 className="h-4 w-4" />,
};

// ─── Category config ──────────────────────────────────────────────────────────
const CATEGORY_DISPLAY: Record<ActionCategory, { label: string; tool: string }> = {
    stripe: { label: "💳 Stripe", tool: "Stripe (Billing)" },
    calendly: { label: "📅 Calendly", tool: "Calendly (Sales)" },
    support_tools: { label: "🛠️ Support", tool: "Support Tools" },
    account_management: { label: "🔐 Account", tool: "Account Management" },
};
const ALL_CATEGORIES: ActionCategory[] = ["stripe", "calendly", "support_tools", "account_management"];

// ─── Toggle switch ─────────────────────────────────────────────────────────────
function ActionToggle({
    enabled,
    loading,
    onChange,
}: {
    enabled: boolean;
    loading: boolean;
    onChange: () => void;
}) {
    if (loading) return <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />;
    return (
        <button
            onClick={onChange}
            className={`relative h-5 w-9 rounded-full transition-all duration-300 ${enabled ? "bg-violet-600 shadow-md shadow-violet-500/30" : "bg-zinc-200 dark:bg-zinc-700"
                }`}
        >
            <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${enabled ? "left-[18px]" : "left-0.5"
                    }`}
            />
        </button>
    );
}

// ─── Upgrade Modal ────────────────────────────────────────────────────────────
function UpgradeModal({ onClose }: { onClose: () => void }) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Gradient Header */}
                <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 px-6 pt-8 pb-6 text-center">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />
                        <div className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full bg-white/5" />
                    </div>
                    <div className="relative">
                        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                            <Zap className="h-7 w-7 text-white" />
                        </div>
                        <h2 className="text-xl font-black text-white">Action Limit Reached</h2>
                        <p className="mt-1 text-sm text-violet-200">
                            Your Free Trial supports up to <strong className="text-white">5 actions</strong>.
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5">
                    <p className="mb-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
                        Upgrade to <strong className="text-violet-600 dark:text-violet-400">Pro</strong> or{" "}
                        <strong className="text-violet-600 dark:text-violet-400">Enterprise</strong> to unlock all 25 actions with no limits.
                    </p>

                    {/* Plan comparison */}
                    <div className="mb-5 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border-2 border-violet-200 bg-violet-50 p-3 dark:border-violet-800/50 dark:bg-violet-900/20">
                            <p className="text-xs font-bold text-violet-700 dark:text-violet-300">Pro Plan</p>
                            <p className="mt-1 text-2xl font-black text-violet-600 dark:text-violet-400">$39<span className="text-xs font-normal text-violet-500">/mo</span></p>
                            <div className="mt-2 space-y-1 text-xs text-violet-700 dark:text-violet-300">
                                <div className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> All 25 actions</div>
                                <div className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> 150 executions/mo</div>
                                <div className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> GPT-4o + Claude</div>
                            </div>
                        </div>
                        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-3 dark:border-amber-800/50 dark:bg-amber-900/20">
                            <p className="text-xs font-bold text-amber-700 dark:text-amber-300">Enterprise</p>
                            <p className="mt-1 text-2xl font-black text-amber-600 dark:text-amber-400">$99<span className="text-xs font-normal text-amber-500">/mo</span></p>
                            <div className="mt-2 space-y-1 text-xs text-amber-700 dark:text-amber-300">
                                <div className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> All 25 actions</div>
                                <div className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> 500 executions/mo</div>
                                <div className="flex items-center gap-1.5"><CheckCircle className="h-3 w-3" /> Priority support</div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-xl border border-zinc-300 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                        >
                            Maybe Later
                        </button>
                        <button
                            onClick={() => window.location.href = "/dashboard/billing"}
                            className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl"
                        >
                            Upgrade Now →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ActionStorePage() {
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [togglingId, setTogglingId] = React.useState<string | null>(null);
    const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);

    const { actions, enabledActions, actionStoreLimit, usedSlots, planLabel, loading, toggleAction, getByCategory } = useActions();

    React.useEffect(() => { setMounted(true); }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark" ? "bg-grid-dark" : "bg-grid-light"
        : "bg-grid-light";

    async function handleToggle(actionId: string, currentEnabled: boolean) {
        setTogglingId(actionId);
        const result = await toggleAction(actionId, !currentEnabled);
        setTogglingId(null);
        if (!result.success) {
            // Show upgrade modal for limit errors, ignore others silently
            setShowUpgradeModal(true);
        }
    }

    const totalActions = actions.length;
    const enabledCount = enabledActions.length;

    const categoryMap = [
        { id: "all", name: `All Actions (${totalActions})` },
        ...ALL_CATEGORIES.map((cat) => ({
            id: cat,
            name: CATEGORY_DISPLAY[cat].label,
            count: getByCategory(cat).length,
        })),
    ];

    // Filter by category
    const displayCategories = ALL_CATEGORIES
        .filter((cat) => selectedCategory === "all" || selectedCategory === cat)
        .map((cat) => ({
            id: cat,
            tool: CATEGORY_DISPLAY[cat].tool,
            actions: getByCategory(cat),
        }))
        .filter((cat) => cat.actions.length > 0);

    return (
        <div className={`h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            {/* Upgrade Modal */}
            {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}

            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Main Layout */}
            <div className="flex h-full">
                {/* LEFT SIDEBAR */}
                <div className="w-64 shrink-0 overflow-y-auto border-r border-zinc-200 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="mb-8">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                            <Sparkles className="h-3 w-3" />
                            Step 3 of 4
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">Command Center</h2>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Enable superpowers</p>
                    </div>

                    <nav className="space-y-1.5">
                        {categoryMap.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${selectedCategory === category.id
                                    ? "bg-violet-100 text-violet-700 shadow-sm dark:bg-violet-900/50 dark:text-violet-300"
                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                <span>{category.name}</span>
                                {"count" in category && category.count !== undefined && (
                                    <span className={`rounded-full px-2 py-0.5 text-xs ${selectedCategory === category.id
                                        ? "bg-violet-200 text-violet-800 dark:bg-violet-800 dark:text-violet-200"
                                        : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                                        }`}>
                                        {category.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Stats Card */}
                    <div className="mt-8 rounded-xl border border-zinc-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4 dark:border-zinc-800 dark:from-violet-900/20 dark:to-indigo-900/20">
                        {loading ? (
                            <div className="flex items-center gap-2 text-zinc-400">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-xs">Loading…</span>
                            </div>
                        ) : (
                            <>
                                <div className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                                    {enabledCount}{actionStoreLimit ? `/${actionStoreLimit}` : ""}
                                </div>
                                <div className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Actions Enabled · {planLabel}
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                                        style={{
                                            width: actionStoreLimit
                                                ? `${Math.min((usedSlots / actionStoreLimit) * 100, 100)}%`
                                                : `${totalActions > 0 ? (enabledCount / totalActions) * 100 : 0}%`,
                                        }}
                                    />
                                </div>
                                {actionStoreLimit && usedSlots >= actionStoreLimit && (
                                    <button
                                        onClick={() => setShowUpgradeModal(true)}
                                        className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 py-1.5 text-xs font-bold text-white shadow hover:shadow-md transition-all"
                                    >
                                        <Zap className="h-3 w-3" />
                                        Upgrade for More
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT MAIN CONTENT */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="shrink-0 border-b border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                        <div className="mx-auto max-w-4xl">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                Action Store
                            </h1>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mx-auto max-w-5xl space-y-4">
                            {loading && (
                                <div className="flex items-center justify-center py-24 gap-3 text-zinc-400">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span className="text-sm">Loading actions…</span>
                                </div>
                            )}

                            {!loading && displayCategories.map((category) => (
                                <div key={category.id}>
                                    <div className="mb-2 flex items-center gap-2 px-1">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            {category.tool}
                                        </h3>
                                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                                    </div>

                                    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                                        {category.actions.map((action, index) => (
                                            <div
                                                key={action.id}
                                                className={`group flex items-center gap-3 px-3 py-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${index !== category.actions.length - 1
                                                    ? "border-b border-zinc-100 dark:border-zinc-800/50"
                                                    : ""
                                                    }`}
                                            >
                                                {/* Icon */}
                                                <div className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${action.enabled
                                                    ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                                                    : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                                                    }`}>
                                                    {ACTION_ICONS[action.id] ?? <Sparkles className="h-4 w-4" />}
                                                </div>

                                                {/* Content */}
                                                <div className="flex flex-1 items-center justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className={`truncate text-sm font-medium ${action.enabled
                                                                ? "text-zinc-900 dark:text-zinc-50"
                                                                : "text-zinc-500 dark:text-zinc-500"
                                                                }`}>
                                                                {action.label}
                                                            </h4>
                                                            {action.enabled && (
                                                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                                    Active
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                                                            {action.description}
                                                        </p>
                                                    </div>

                                                    <ActionToggle
                                                        enabled={action.enabled}
                                                        loading={togglingId === action.id}
                                                        onChange={() => handleToggle(action.id, action.enabled)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {!loading && displayCategories.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <h3 className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                        No actions available
                                    </h3>
                                    <p className="text-sm text-zinc-500">
                                        There are no actions in this category.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="shrink-0 border-t border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                        <div className="mx-auto flex max-w-4xl items-center justify-between">
                            <Button variant="ghost" className="gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Training
                            </Button>
                            <Button
                                disabled={enabledCount === 0}
                                onClick={() => router.push("/guardrails")}
                                className={`h-12 w-48 gap-2 rounded-xl font-semibold transition-all ${enabledCount > 0
                                    ? "bg-gradient-to-r from-violet-600 to-violet-700 text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-violet-800"
                                    : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                                    }`}
                            >
                                Continue
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
