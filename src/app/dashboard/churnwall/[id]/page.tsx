"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useRouter, useParams } from "next/navigation";
import {
    Bell,
    Shield,
    Edit2,
    Save,
    X,
    Trash2,
    ChevronRight,
    ChevronDown,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    ArrowUp,
    Lightbulb,
    CheckCircle2,
    WrenchIcon,
    Plus,
    Settings,
    Sparkles,
    Zap,
} from "lucide-react";
import { Sidebar, useSidebarState } from "@/components/sidebar";

const allAgents = [
    { id: "wn_abc123xyz", name: "Customer Support Bot", status: "active", theme: "#7c3aed", initials: "CS" },
    { id: "wn_def456uvw", name: "Sales Assistant", status: "active", theme: "#3b82f6", initials: "SA" },
    { id: "wn_ghi789rst", name: "Product Expert", status: "paused", theme: "#10b981", initials: "PE" },
];

// Available bot actions from guardrails
const botActions = [
    { id: "offer-discount", label: "Offer Discount", requiresInput: true, inputPlaceholder: "COUPON_30OFF" },
    { id: "escalate-human", label: "Escalate to Human", requiresInput: true, inputPlaceholder: "calendly.com/founder" },
    { id: "link-resource", label: "Link to Resource", requiresInput: true, inputPlaceholder: "/academy/getting-started" },
    { id: "pause-subscription", label: "Pause Subscription", requiresInput: false },
    { id: "offer-downgrade", label: "Offer Downgrade", requiresInput: true, inputPlaceholder: "Basic Plan - $9/mo" },
    { id: "schedule-call", label: "Schedule Call", requiresInput: true, inputPlaceholder: "calendly.com/support" },
    { id: "send-survey", label: "Send Survey", requiresInput: true, inputPlaceholder: "typeform.com/feedback" },
];

type ChurnRule = {
    id: string;
    reason: string;
    action: string;
    actionValue: string;
    isEditing?: boolean;
};

export default function SmartChurnWallPage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id as string;
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [configureId, setConfigureId] = React.useState<string | null>(null);
    const [showDiscountModal, setShowDiscountModal] = React.useState(false);
    const [currentRuleId, setCurrentRuleId] = React.useState<string | null>(null);

    // Discount tiers state
    const [discountTiers, setDiscountTiers] = React.useState([
        { tenure: "1", discount: "10", duration: "once", repeatMonths: "3", coupon: "SAVE10" },
        { tenure: "6", discount: "20", duration: "once", repeatMonths: "3", coupon: "SAVE20" },
        { tenure: "12", discount: "30", duration: "once", repeatMonths: "3", coupon: "SAVE30" },
    ]);

    const currentAgent = allAgents.find(a => a.id === agentId) || allAgents[0];

    const [churnRules, setChurnRules] = React.useState<ChurnRule[]>([
        {
            id: "1",
            reason: "Pricing is too high",
            action: "offer-discount",
            actionValue: "COUPON_30OFF",
        },
        {
            id: "2",
            reason: "Missing features",
            action: "escalate-human",
            actionValue: "calendly.com/founder",
        },
        {
            id: "3",
            reason: "Technical issues / Bugs",
            action: "escalate-human",
            actionValue: "calendly.com/support",
        },
        {
            id: "4",
            reason: "Too complex / Hard to use",
            action: "link-resource",
            actionValue: "/academy/getting-started",
        },
        {
            id: "5",
            reason: "No longer needed",
            action: "pause-subscription",
            actionValue: "(No Input Needed)",
        },
        {
            id: "6",
            reason: "Poor customer support",
            action: "escalate-human",
            actionValue: "Email / Slack Alert",
        },
    ]);

    const [tempEdit, setTempEdit] = React.useState<ChurnRule | null>(null);

    const handleEdit = (rule: ChurnRule) => {
        setEditingId(rule.id);
        setTempEdit({ ...rule });
    };

    const handleSave = () => {
        if (tempEdit && editingId) {
            setChurnRules(prev => prev.map(r => r.id === editingId ? { ...tempEdit } : r));
            setEditingId(null);
            setTempEdit(null);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setTempEdit(null);
    };

    const handleDelete = (id: string) => {
        setChurnRules(prev => prev.filter(r => r.id !== id));
    };

    const handleAddNew = () => {
        const newRule: ChurnRule = {
            id: Date.now().toString(),
            reason: "New cancellation reason",
            action: "escalate-human",
            actionValue: "",
        };
        setChurnRules(prev => [...prev, newRule]);
        setEditingId(newRule.id);
        setTempEdit(newRule);
    };

    const getActionLabel = (actionId: string) => {
        return botActions.find(a => a.id === actionId)?.label || actionId;
    };

    const selectedAction = botActions.find(a => a.id === tempEdit?.action);

    return (
        <div className="flex min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="churnwall" agentId={agentId} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <main className={mainClass}>
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md" style={{ backgroundColor: currentAgent.theme }}>
                            {currentAgent.initials}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{currentAgent.name} - Smart ChurnWall</h1>
                                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">BETA</span>
                            </div>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Intelligent retention engine to prevent cancellations</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="rounded-xl bg-zinc-100 p-2.5 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <ThemeToggle />
                    </div>
                </header>

                <div className="p-6">
                    {/* Stats Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Saved Revenue */}
                        <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                    <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
                                    <ArrowUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">12%</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">$1,250</p>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">💰 Saved Revenue (MRR)</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">+12% from last month</p>
                            </div>
                        </div>

                        {/* Retention Rate */}
                        <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                                    <Shield className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
                                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Good</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">18.5%</p>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">🛡️ Retention Rate</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">18 out of 97 attempts saved</p>
                            </div>
                        </div>

                        {/* Top Cancel Reason */}
                        <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-600 dark:bg-amber-900/20 dark:text-amber-400">#1</span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Too Expensive</p>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">⚠️ Top Cancel Reason</p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">45% of users selected this</p>
                            </div>
                        </div>
                    </div>

                    {/* Header Section */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Retention Logic Builder</h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Configure automated responses when users attempt to cancel their subscription
                            </p>
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl"
                        >
                            <Plus className="h-4 w-4" />
                            Add New Rule
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 border-b border-zinc-200 bg-zinc-50 px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900/80">
                            <div className="col-span-4 flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                                    Reason Label
                                </span>
                                <Edit2 className="h-3.5 w-3.5 text-amber-500" />
                            </div>
                            <div className="col-span-3 flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                                    Agent Action
                                </span>
                                <ChevronDown className="h-3.5 w-3.5 text-violet-500" />
                            </div>
                            <div className="col-span-4 flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
                                    Configure
                                </span>
                                <Settings className="h-3.5 w-3.5 text-blue-500" />
                            </div>
                            <div className="col-span-1"></div>
                        </div>

                        {/* Table Body */}
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {churnRules.map((rule) => {
                                const isEditing = editingId === rule.id;
                                const displayRule = isEditing && tempEdit ? tempEdit : rule;

                                return (
                                    <div key={rule.id} className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                                        {/* Reason Label */}
                                        <div className="col-span-4 flex items-center">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={tempEdit?.reason || ""}
                                                    onChange={(e) => setTempEdit(prev => prev ? { ...prev, reason: e.target.value } : null)}
                                                    className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                    placeholder="Enter cancellation reason"
                                                />
                                            ) : (
                                                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                                                    {displayRule.reason}
                                                </span>
                                            )}
                                        </div>

                                        {/* Agent Action Dropdown */}
                                        <div className="col-span-3 flex items-center">
                                            {isEditing ? (
                                                <div className="relative w-full">
                                                    <select
                                                        value={tempEdit?.action || ""}
                                                        onChange={(e) => {
                                                            const selectedAction = botActions.find(a => a.id === e.target.value);
                                                            setTempEdit(prev => prev ? {
                                                                ...prev,
                                                                action: e.target.value,
                                                                actionValue: selectedAction?.requiresInput ? "" : "(No Input Needed)"
                                                            } : null);
                                                        }}
                                                        className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-3 py-2 pr-10 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                    >
                                                        {botActions.map(action => (
                                                            <option key={action.id} value={action.id}>
                                                                {action.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                                </div>
                                            ) : (
                                                <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                                                    {getActionLabel(displayRule.action)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Configure / Action Value */}
                                        <div className="col-span-4 flex items-center">
                                            {isEditing && selectedAction?.requiresInput ? (
                                                selectedAction.id === "offer-discount" ? (
                                                    <button
                                                        onClick={() => {
                                                            setCurrentRuleId(rule.id);
                                                            setShowDiscountModal(true);
                                                        }}
                                                        className="flex items-center gap-2 rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition-all hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-900/20 dark:text-violet-300 dark:hover:bg-violet-900/30"
                                                    >
                                                        <Settings className="h-4 w-4" />
                                                        Setup Offers
                                                    </button>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={tempEdit?.actionValue || ""}
                                                        onChange={(e) => setTempEdit(prev => prev ? { ...prev, actionValue: e.target.value } : null)}
                                                        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                                        placeholder={selectedAction.inputPlaceholder}
                                                    />
                                                )
                                            ) : isEditing ? (
                                                <span className="text-sm italic text-zinc-400 dark:text-zinc-500">No input needed</span>
                                            ) : displayRule.action === "offer-discount" ? (
                                                <button
                                                    onClick={() => {
                                                        setCurrentRuleId(rule.id);
                                                        setShowDiscountModal(true);
                                                    }}
                                                    className="flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-medium text-violet-600 transition-all hover:bg-violet-50 dark:border-violet-800 dark:bg-zinc-800 dark:text-violet-400 dark:hover:bg-violet-900/20"
                                                >
                                                    <Settings className="h-4 w-4" />
                                                    Setup Offers
                                                </button>
                                            ) : (
                                                <span className="font-mono text-sm text-zinc-600 dark:text-zinc-400">
                                                    {displayRule.actionValue}
                                                </span>
                                            )}
                                        </div>

                                        {/* Actions */}
                                        <div className="col-span-1 flex items-center justify-end gap-2">
                                            {isEditing ? (
                                                <>
                                                    <button
                                                        onClick={handleSave}
                                                        className="rounded-lg bg-emerald-600 p-2 text-white transition-all hover:bg-emerald-700"
                                                        title="Save"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        className="rounded-lg bg-zinc-200 p-2 text-zinc-700 transition-all hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                                                        title="Cancel"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => handleEdit(rule)}
                                                        className="rounded-lg bg-violet-100 p-2 text-violet-600 transition-all hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:hover:bg-violet-900/50"
                                                        title="Edit"
                                                    >
                                                        <Edit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(rule.id)}
                                                        className="rounded-lg bg-red-100 p-2 text-red-600 transition-all hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                        <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                            <div>
                                <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">How Smart ChurnWall Works</h3>
                                <p className="mt-1 text-xs leading-relaxed text-blue-700 dark:text-blue-300">
                                    When a user attempts to cancel, the AI detects their reason and automatically triggers the corresponding action.
                                    For example, if they say "too expensive," the bot can offer a discount code. If they mention bugs, it escalates to your support team.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* AI Insights Section */}
                    <div className="mt-8">
                        {/* Section Header */}
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">✨ Smart Insights</h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">AI-powered recommendations based on your retention data</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {/* Scenario A — Offer too weak 📉 */}
                            <div className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 dark:border-amber-800/40 dark:bg-amber-900/10">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                                <span className="mr-1.5 text-amber-600 dark:text-amber-400">📉 Insight:</span>
                                                &ldquo;Pricing is too high&rdquo; is the top churn reason (45%), but your 10% discount offer only saves 5% of users.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                        Low Impact
                                    </span>
                                </div>
                                <div className="ml-11 rounded-xl border border-amber-200 bg-white/70 p-3.5 dark:border-amber-800/30 dark:bg-zinc-900/50">
                                    <div className="mb-2.5 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">AI Suggestion</span>
                                    </div>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                        Try increasing the discount to <strong>20%</strong> or offer a <strong>2-month pause option</strong> instead.
                                    </p>
                                    <button className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-violet-500/20 transition-all hover:shadow-lg hover:shadow-violet-500/30">
                                        <Zap className="h-3.5 w-3.5" />
                                        Apply Suggestion
                                    </button>
                                </div>
                            </div>

                            {/* Scenario B — Wrong action ⚠️ */}
                            <div className="rounded-2xl border border-red-200/70 bg-red-50/60 p-5 dark:border-red-800/40 dark:bg-red-900/10">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                                <span className="mr-1.5 text-red-600 dark:text-red-400">⚠️ Insight:</span>
                                                Users choosing &ldquo;Technical Bugs&rdquo; are rejecting the &ldquo;Link to Resource&rdquo; offer instantly.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                        Fix Needed
                                    </span>
                                </div>
                                <div className="ml-11 rounded-xl border border-red-200 bg-white/70 p-3.5 dark:border-red-800/30 dark:bg-zinc-900/50">
                                    <div className="mb-2.5 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">AI Suggestion</span>
                                    </div>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                        These users are frustrated. Change the action to <strong>&ldquo;Escalate to Human&rdquo;</strong> to save them.
                                    </p>
                                    <button className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-red-500/20 transition-all hover:shadow-lg hover:shadow-red-500/30">
                                        <WrenchIcon className="h-3.5 w-3.5" />
                                        Fix Configuration
                                    </button>
                                </div>
                            </div>

                            {/* Scenario C — Working well ✅ */}
                            <div className="rounded-2xl border border-emerald-200/70 bg-emerald-50/60 p-5 dark:border-emerald-800/40 dark:bg-emerald-900/10">
                                <div className="mb-3 flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                                                <span className="mr-1.5 text-emerald-600 dark:text-emerald-400">✅ Insight:</span>
                                                Your &ldquo;Pause Subscription&rdquo; offer has an <strong>85% success rate</strong> for users leaving due to &ldquo;No longer needed&rdquo;.
                                            </p>
                                        </div>
                                    </div>
                                    <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                        High Impact
                                    </span>
                                </div>
                                <div className="ml-11 rounded-xl border border-emerald-200 bg-white/70 p-3.5 dark:border-emerald-800/30 dark:bg-zinc-900/50">
                                    <div className="mb-2.5 flex items-center gap-2">
                                        <Lightbulb className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                        <span className="text-xs font-bold text-violet-700 dark:text-violet-300">AI Suggestion</span>
                                    </div>
                                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                        Great strategy! Consider <strong>moving this offer to other reasons</strong> too.
                                    </p>
                                    <button className="mt-3 flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-500/20 transition-all hover:shadow-lg hover:shadow-emerald-500/30">
                                        <TrendingUp className="h-3.5 w-3.5" />
                                        Expand to Other Reasons
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Discount Configuration Modal */}
                {showDiscountModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                        <div className="relative w-full max-w-xl rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-6">
                            {/* Modal Header */}
                            <div className="mb-4 flex items-start justify-between gap-3 sm:mb-5">
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 sm:text-xl">Configure Discount Strategy</h2>
                                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
                                        Set up tiered discounts based on customer tenure
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowDiscountModal(false)}
                                    className="rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                                >
                                    <X className="h-4 w-4 sm:h-5 sm:w-5" />
                                </button>
                            </div>

                            {/* Discount Tiers */}
                            <div className="max-h-[60vh] space-y-3 overflow-y-auto pr-1">
                                {discountTiers.map((tier, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50"
                                    >
                                        <div className="mb-2 flex items-center gap-2">
                                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                                                {index + 1}
                                            </div>
                                            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                                Tier {index + 1}
                                            </h3>
                                        </div>
                                        <div className="space-y-2">
                                            {/* First Row: Tenure and Discount */}
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                                                {/* Tenure */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:text-xs">
                                                        If tenure &gt;
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={tier.tenure}
                                                            onChange={(e) => {
                                                                const newTiers = [...discountTiers];
                                                                newTiers[index].tenure = e.target.value;
                                                                setDiscountTiers(newTiers);
                                                            }}
                                                            className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 pr-14 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                                            placeholder="1"
                                                        />
                                                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-zinc-500">
                                                            Month{tier.tenure !== "1" ? "s" : ""}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Discount */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:text-xs">
                                                        Give Discount
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={tier.discount}
                                                            onChange={(e) => {
                                                                const newTiers = [...discountTiers];
                                                                newTiers[index].discount = e.target.value;
                                                                setDiscountTiers(newTiers);
                                                            }}
                                                            className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 pr-8 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                                            placeholder="10"
                                                        />
                                                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-medium text-zinc-500">
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Second Row: Duration and Stripe Coupon */}
                                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                                                {/* Duration (Valid For) */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:text-xs">
                                                        Duration (Valid For)
                                                    </label>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <select
                                                                value={tier.duration}
                                                                onChange={(e) => {
                                                                    const newTiers = [...discountTiers];
                                                                    newTiers[index].duration = e.target.value;
                                                                    setDiscountTiers(newTiers);
                                                                }}
                                                                className="w-full appearance-none rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 pr-8 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                                            >
                                                                <option value="once">Once</option>
                                                                <option value="repeating">Repeating</option>
                                                                <option value="forever">Forever</option>
                                                            </select>
                                                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                                                        </div>
                                                        {tier.duration === "repeating" && (
                                                            <div className="relative w-20">
                                                                <input
                                                                    type="number"
                                                                    value={tier.repeatMonths}
                                                                    onChange={(e) => {
                                                                        const newTiers = [...discountTiers];
                                                                        newTiers[index].repeatMonths = e.target.value;
                                                                        setDiscountTiers(newTiers);
                                                                    }}
                                                                    className="w-full rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                                                    placeholder="3"
                                                                    min="1"
                                                                />
                                                                <span className="pointer-events-none absolute -bottom-4 left-0 text-[9px] font-medium text-zinc-400">
                                                                    months
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Stripe Coupon */}
                                                <div>
                                                    <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 sm:text-xs">
                                                        Stripe Coupon
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={tier.coupon}
                                                        onChange={(e) => {
                                                            const newTiers = [...discountTiers];
                                                            newTiers[index].coupon = e.target.value;
                                                            setDiscountTiers(newTiers);
                                                        }}
                                                        className="w-full rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 font-mono text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                                                        placeholder="SAVE10"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Tier Button */}
                            <button
                                onClick={() => {
                                    setDiscountTiers([
                                        ...discountTiers,
                                        { tenure: "", discount: "", duration: "once", repeatMonths: "3", coupon: "" }
                                    ]);
                                }}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-3 py-2 text-xs font-semibold text-zinc-600 transition-all hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-violet-600 dark:hover:bg-violet-900/20 dark:hover:text-violet-400 sm:text-sm"
                            >
                                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                Add New Tier
                            </button>

                            {/* Modal Footer */}
                            <div className="mt-4 flex flex-col-reverse items-center gap-2 border-t border-zinc-200 pt-3 dark:border-zinc-800 sm:flex-row sm:justify-end sm:gap-3 sm:pt-4">
                                <button
                                    onClick={() => setShowDiscountModal(false)}
                                    className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 sm:w-auto"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Save the discount configuration
                                        setShowDiscountModal(false);
                                    }}
                                    className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl sm:w-auto"
                                >
                                    Save Configuration
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
