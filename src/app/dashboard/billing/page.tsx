"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import { Sidebar, useSidebarState } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { PLANS, getPlan, type PlanId, type PlanConfig } from "@/lib/plans";
import {
    CreditCard,
    Zap,
    CheckCircle,
    AlertTriangle,
    Download,
    ExternalLink,
    RefreshCw,
    TrendingUp,
    MessageCircle,
    HardDrive,
    Globe,
    Users,
    Shield,
    X,
    Loader2,
    Crown,
    Sparkles,
} from "lucide-react";

// ─── Static Placeholders (until payment gateway is integrated) ─────────────────
const invoices = [
    { date: "Feb 18, 2026", amount: "$39.00", status: "Paid" },
    { date: "Jan 18, 2026", amount: "$39.00", status: "Paid" },
    { date: "Dec 18, 2025", amount: "$39.00", status: "Paid" },
    { date: "Nov 18, 2025", amount: "$39.00", status: "Paid" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface PlanUsage {
    planId: PlanId;
    plan: PlanConfig;
    totalPages: number;
    totalChars: number;
}

function pct(used: number, max: number) {
    return Math.min(Math.round((used / Math.max(max, 1)) * 100), 100);
}

function fmtNum(n: number) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
    return String(n);
}

// ─── Plan Card (modal) ────────────────────────────────────────────────────────
function PlanCard({
    id,
    config,
    current,
    selected,
    onSelect,
}: {
    id: PlanId;
    config: PlanConfig;
    current: boolean;
    selected: boolean;
    onSelect: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            className={`relative rounded-xl border-2 p-4 text-left transition-all ${current
                    ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                    : selected
                        ? "border-violet-400 bg-violet-50/50 dark:bg-violet-900/10"
                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800/50"
                }`}
        >
            {current && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-bold text-white">
                    Current
                </span>
            )}
            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{config.label}</p>
            <div className="my-2 flex items-baseline gap-1">
                {config.price === 0 ? (
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">Free</span>
                ) : (
                    <>
                        <span className="text-2xl font-black text-violet-600 dark:text-violet-400">${config.price}</span>
                        <span className="text-xs text-zinc-500">/mo</span>
                    </>
                )}
            </div>
            <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                <p>🤖 {config.chatbots} chatbot{config.chatbots > 1 ? "s" : ""}</p>
                <p>🌐 {fmtNum(config.pages)} pages</p>
                <p>📝 {fmtNum(config.chars)} chars</p>
                <p>💬 {fmtNum(config.messageCredits)} credits/mo</p>
                <p>⚡ {config.actionLimit} actions/mo</p>
                <p>🧠 {config.allModels ? "GPT + Claude 3.5" : "GPT-4o-mini only"}</p>
            </div>
        </button>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BillingPage() {
    const router = useRouter();
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();

    const [usage, setUsage] = React.useState<PlanUsage | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [showCancelModal, setShowCancelModal] = React.useState(false);
    const [showChangePlanModal, setShowChangePlanModal] = React.useState(false);
    const [selectedPlan, setSelectedPlan] = React.useState<PlanId | null>(null);

    React.useEffect(() => {
        (async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) { router.push("/"); return; }

            const userId = session.user.id;

            // Fetch plan from profiles
            const { data: profile } = await supabase
                .from("profiles")
                .select("plan")
                .eq("id", userId)
                .single();

            const planId = (profile?.plan ?? "free_trial") as PlanId;
            const plan = getPlan(planId);

            // Fetch real usage
            const { data: sources } = await supabase
                .from("knowledge_sources")
                .select("character_count")
                .eq("workspace_id", userId)
                .eq("status", "completed");

            const totalPages = sources?.length ?? 0;
            const totalChars = sources?.reduce((a, s) => a + (s.character_count ?? 0), 0) ?? 0;

            setUsage({ planId, plan, totalPages, totalChars });
            setLoading(false);
        })();
    }, [router]);

    // Build usage items from real data
    const usageItems = usage
        ? [
            {
                label: "Pages Crawled",
                icon: Globe,
                used: usage.totalPages,
                limit: usage.plan.pages,
                unit: "",
                color: "bg-violet-500",
                trackColor: "bg-violet-100 dark:bg-violet-900/30",
                textColor: "text-violet-600 dark:text-violet-400",
                nearLimit: pct(usage.totalPages, usage.plan.pages) > 80,
            },
            {
                label: "Storage (Characters)",
                icon: HardDrive,
                used: usage.totalChars,
                limit: usage.plan.chars,
                unit: "",
                color: "bg-amber-500",
                trackColor: "bg-amber-100 dark:bg-amber-900/30",
                textColor: "text-amber-600 dark:text-amber-400",
                nearLimit: pct(usage.totalChars, usage.plan.chars) > 80,
            },
            {
                label: "Message Credits",
                icon: MessageCircle,
                used: 0,
                limit: usage.plan.messageCredits,
                unit: "",
                color: "bg-emerald-500",
                trackColor: "bg-emerald-100 dark:bg-emerald-900/30",
                textColor: "text-emerald-600 dark:text-emerald-400",
                nearLimit: false,
            },
        ]
        : [];

    const planEntries = Object.entries(PLANS) as [PlanId, PlanConfig][];

    const planIcon =
        usage?.planId === "enterprise" ? (
            <Crown className="h-7 w-7 text-amber-300" />
        ) : usage?.planId === "pro" ? (
            <Sparkles className="h-7 w-7 text-violet-200" />
        ) : (
            <Zap className="h-7 w-7 text-violet-200" />
        );

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="billing" open={sidebarOpen} onOpenChange={setSidebarOpen} />

            <main className={mainClass}>
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-md">
                            <CreditCard className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Billing & Subscription</h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Manage your plan, usage, and payments</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </header>

                <div className="p-6 space-y-6">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                        </div>
                    ) : usage ? (
                        <>
                            {/* ── Top Row: Subscription Status + Usage ── */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

                                {/* 💳 Subscription Status Card */}
                                <div className="relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6 shadow-xl shadow-violet-500/20 dark:border-violet-800/40">
                                    <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/5" />
                                    <div className="pointer-events-none absolute -bottom-12 -right-4 h-48 w-48 rounded-full bg-white/5" />

                                    <div className="relative">
                                        {/* Header */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <p className="text-xs font-bold uppercase tracking-widest text-violet-200">Current Plan</p>
                                            <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 backdrop-blur-sm">
                                                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                                                <span className="text-xs font-bold text-emerald-300">Active</span>
                                            </div>
                                        </div>

                                        {/* Plan Name & Price */}
                                        <div className="mb-5">
                                            <div className="flex items-center gap-2">
                                                {planIcon}
                                                <h2 className="text-3xl font-black tracking-tight text-white uppercase">
                                                    {usage.plan.label}
                                                </h2>
                                            </div>
                                            {usage.plan.price > 0 ? (
                                                <div className="mt-1 flex items-baseline gap-1">
                                                    <span className="text-4xl font-bold text-white">${usage.plan.price}</span>
                                                    <span className="text-sm font-medium text-violet-200">/ month</span>
                                                </div>
                                            ) : (
                                                <p className="mt-1 text-sm text-violet-200">
                                                    {usage.plan.trialDays}-day free trial · Upgrade anytime
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center gap-1.5 text-xs text-violet-200">
                                                <RefreshCw className="h-3 w-3" />
                                                Renews on April 1, 2026
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => setShowChangePlanModal(true)}
                                                className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/30"
                                            >
                                                <TrendingUp className="h-4 w-4" />
                                                Change Plan
                                            </button>
                                            <button className="flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/10">
                                                <ExternalLink className="h-4 w-4" />
                                                Manage on Stripe
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* 📊 Usage & Limits */}
                                <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
                                    <div className="mb-5 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Plan Usage</h3>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Current billing cycle</p>
                                        </div>
                                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600 dark:bg-violet-900/20 dark:text-violet-400">
                                            {usage.plan.label}
                                        </span>
                                    </div>

                                    <div className="space-y-5">
                                        {usageItems.map((item) => {
                                            const p = Math.round((item.used / Math.max(item.limit, 1)) * 100);
                                            const displayUsed = item.label === "Storage (Characters)"
                                                ? fmtNum(item.used)
                                                : item.used.toLocaleString();
                                            const displayLimit = item.label === "Storage (Characters)"
                                                ? fmtNum(item.limit)
                                                : item.limit.toLocaleString();
                                            const Icon = item.icon;
                                            return (
                                                <div key={item.label}>
                                                    <div className="mb-1.5 flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Icon className={`h-3.5 w-3.5 ${item.textColor}`} />
                                                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{item.label}</span>
                                                        </div>
                                                        <span className={`text-xs font-bold ${item.nearLimit ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                                                            {displayUsed} / {displayLimit} <span className="font-normal">({p}%)</span>
                                                        </span>
                                                    </div>
                                                    <div className={`h-2.5 w-full overflow-hidden rounded-full ${item.trackColor}`}>
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-700 ${item.color} ${item.nearLimit ? "animate-pulse" : ""}`}
                                                            style={{ width: `${Math.min(p, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Upsell Banner */}
                                    {usageItems.some((i) => i.nearLimit) && (
                                        <div className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800/40 dark:bg-amber-900/10">
                                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                                            <div className="flex-1">
                                                <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                                                    Running low on usage? Upgrade for more capacity.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowChangePlanModal(true)}
                                                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-3 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg"
                                            >
                                                <Zap className="h-3 w-3" />
                                                Upgrade Now
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Bottom Row: Payment Method + Invoices ── */}
                            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">

                                {/* 💳 Payment Method */}
                                <div className="lg:col-span-2 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
                                    <h3 className="mb-4 text-base font-bold text-zinc-900 dark:text-zinc-100">Payment Method</h3>

                                    {/* Card Display */}
                                    <div className="relative mb-4 overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 p-5 shadow-lg">
                                        <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5" />
                                        <div className="pointer-events-none absolute -bottom-6 right-8 h-20 w-20 rounded-full bg-white/5" />

                                        {/* Visa Logo */}
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="flex h-8 w-12 items-center justify-center rounded-md bg-white/10">
                                                <span className="text-sm font-black italic text-blue-400">VISA</span>
                                            </div>
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded-full bg-red-500/70" />
                                                <div className="-ml-2 h-5 w-5 rounded-full bg-amber-400/70" />
                                            </div>
                                        </div>

                                        <p className="mb-1 font-mono text-base tracking-widest text-white/80">
                                            •••• •••• •••• <span className="font-bold text-white">4242</span>
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-white/50">Expires 12/28</p>
                                            <p className="text-xs font-semibold text-white/70">John Doe</p>
                                        </div>
                                    </div>

                                    <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:border-violet-600 dark:hover:bg-violet-900/20 dark:hover:text-violet-400">
                                        <CreditCard className="h-4 w-4" />
                                        Update Card
                                    </button>
                                </div>

                                {/* 🧾 Invoice History */}
                                <div className="lg:col-span-3 rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50 overflow-hidden">
                                    <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Invoice History</h3>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Download past receipts</p>
                                    </div>

                                    {/* Table Header */}
                                    <div className="grid grid-cols-12 gap-2 border-b border-zinc-100 bg-zinc-50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-900/80">
                                        <div className="col-span-4 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Date</div>
                                        <div className="col-span-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Amount</div>
                                        <div className="col-span-3 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Status</div>
                                        <div className="col-span-2 text-xs font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Invoice</div>
                                    </div>

                                    {/* Table Rows */}
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                        {invoices.map((inv, i) => (
                                            <div key={i} className="grid grid-cols-12 gap-2 px-6 py-3.5 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                                <div className="col-span-4 flex items-center text-sm text-zinc-700 dark:text-zinc-300">{inv.date}</div>
                                                <div className="col-span-3 flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">{inv.amount}</div>
                                                <div className="col-span-3 flex items-center">
                                                    <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 dark:bg-emerald-900/20">
                                                        <CheckCircle className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                                        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{inv.status}</span>
                                                    </div>
                                                </div>
                                                <div className="col-span-2 flex items-center">
                                                    <button className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-semibold text-zinc-600 transition-all hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:border-violet-600 dark:hover:text-violet-400">
                                                        <Download className="h-3 w-3" />
                                                        PDF
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* ⚠️ Danger Zone */}
                            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
                                <div className="flex items-start justify-between gap-6">
                                    <div className="flex items-start gap-4">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30">
                                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-red-900 dark:text-red-200">Cancel Subscription</h3>
                                            <p className="mt-1 text-sm text-red-700/80 dark:text-red-400/80">
                                                Once you cancel, you will lose access to {usage.plan.label} features at the end of your billing cycle on <strong>April 1, 2026</strong>.
                                            </p>
                                            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600/70 dark:text-red-500/70">
                                                <Shield className="h-3.5 w-3.5" />
                                                Our Smart ChurnWall will try to help before you go 🛡️
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowCancelModal(true)}
                                        className="shrink-0 rounded-xl border-2 border-red-400 bg-white px-5 py-2.5 text-sm font-bold text-red-600 transition-all hover:bg-red-600 hover:text-white dark:border-red-700 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-700 dark:hover:text-white"
                                    >
                                        Cancel Subscription
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </main>

            {/* ── Change Plan Modal ── */}
            {showChangePlanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setShowChangePlanModal(false)}>
                    <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-5 flex items-start justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Change Your Plan</h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Select a plan that fits your needs</p>
                            </div>
                            <button onClick={() => setShowChangePlanModal(false)} className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {planEntries.map(([id, config]) => (
                                <PlanCard
                                    key={id}
                                    id={id}
                                    config={config}
                                    current={usage?.planId === id}
                                    selected={selectedPlan === id}
                                    onSelect={() => setSelectedPlan(id)}
                                />
                            ))}
                        </div>

                        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800/40 dark:bg-blue-900/10">
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                💡 Plans are managed manually for now. To upgrade, contact us and we'll activate it right away.
                            </p>
                        </div>

                        <div className="mt-5 flex justify-end gap-3">
                            <button onClick={() => setShowChangePlanModal(false)} className="rounded-xl border border-zinc-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Cancel
                            </button>
                            <button
                                disabled={!selectedPlan || usage?.planId === selectedPlan}
                                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl disabled:opacity-50"
                            >
                                Confirm Change
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Cancel Modal ── */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm" onClick={() => setShowCancelModal(false)}>
                    <div className="relative w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
                            <AlertTriangle className="h-7 w-7 text-red-600 dark:text-red-400" />
                        </div>
                        <h2 className="mb-2 text-xl font-bold text-zinc-900 dark:text-zinc-100">Cancel your subscription?</h2>
                        <p className="mb-1 text-sm text-zinc-600 dark:text-zinc-400">
                            You'll keep access to {usage?.plan.label} features until <strong>April 1, 2026</strong>. After that, your account will be downgraded to the free plan.
                        </p>
                        <div className="my-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-800/40 dark:bg-amber-900/10">
                            <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                            <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
                                Before you go — our Smart ChurnWall may have a special offer for you. You'll see it on the next step.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowCancelModal(false)} className="flex-1 rounded-xl border border-zinc-300 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800">
                                Keep My Plan
                            </button>
                            <button className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-all hover:bg-red-700">
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
