"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter, useParams } from "next/navigation";
import {
    Sparkles,
    Globe,
    Zap,
    Database,
    Shield,
    Palette,
    Code,
    Check,
    Brain,
    Wand2,
    Loader2,
    Upload,
    BookOpen,
    Video,
    MessageCircle,
    Send,
    User,
    X,
    ShieldAlert,
    Ban,
    HeartHandshake,
    EyeOff,
    Filter,
    Flame,
    Smile,
    Meh,
    Skull,
    Briefcase,
    Copy,
    Share2,
    Bell,
    Plus,
    ChevronDown,
    ChevronRight,
    Settings,
} from "lucide-react";
import { Sidebar, useSidebarState } from "@/components/sidebar";
import Image from "next/image";
import { AIModel, aiModels, toneOptions } from "./models";

// Agent data
const allAgents = [
    {
        id: "wn_abc123xyz",
        name: "Customer Support Bot",
        description: "Handles customer inquiries and support tickets 24/7",
        status: "active",
        model: "Claude 3.5 Sonnet",
        theme: "#7c3aed",
        initials: "CS",
    },
    {
        id: "wn_def456uvw",
        name: "Sales Assistant",
        description: "Qualifies leads and schedules demo calls",
        status: "active",
        model: "GPT-4o",
        theme: "#3b82f6",
        initials: "SA",
    },
    {
        id: "wn_ghi789rst",
        name: "Product Expert",
        description: "Answers technical questions about products",
        status: "paused",
        model: "Gemini 2.0 Flash",
        theme: "#10b981",
        initials: "PE",
    },
];

// Onboarding steps config
const onboardingSteps = [
    {
        id: "training",
        step: 1,
        title: "Training",
        description: "Connect your website and knowledge sources to train your agent",
        icon: Brain,
        color: "from-violet-500 to-purple-600",
        bgLight: "bg-violet-50",
        bgDark: "dark:bg-violet-950/30",
        textColor: "text-violet-600 dark:text-violet-400",
        borderColor: "border-violet-200 dark:border-violet-800",
    },
    {
        id: "actions",
        step: 2,
        title: "Actions",
        description: "Configure what your agent can do — process refunds, create tickets, and more",
        icon: Zap,
        color: "from-amber-500 to-orange-600",
        bgLight: "bg-amber-50",
        bgDark: "dark:bg-amber-950/30",
        textColor: "text-amber-600 dark:text-amber-400",
        borderColor: "border-amber-200 dark:border-amber-800",
    },
    {
        id: "guardrails",
        step: 3,
        title: "Guardrails",
        description: "Set boundaries and safety rules to keep interactions on-brand and compliant",
        icon: Shield,
        color: "from-rose-500 to-red-600",
        bgLight: "bg-rose-50",
        bgDark: "dark:bg-rose-950/30",
        textColor: "text-rose-600 dark:text-rose-400",
        borderColor: "border-rose-200 dark:border-rose-800",
    },
    {
        id: "personality",
        step: 4,
        title: "Personality",
        description: "Define your agent's tone, style, and the AI model powering it",
        icon: Palette,
        color: "from-pink-500 to-fuchsia-600",
        bgLight: "bg-pink-50",
        bgDark: "dark:bg-pink-950/30",
        textColor: "text-pink-600 dark:text-pink-400",
        borderColor: "border-pink-200 dark:border-pink-800",
    },
    {
        id: "ui-setup",
        step: 5,
        title: "UI Setup",
        description: "Customize the chat widget appearance, colors, and welcome messages",
        icon: Wand2,
        color: "from-cyan-500 to-blue-600",
        bgLight: "bg-cyan-50",
        bgDark: "dark:bg-cyan-950/30",
        textColor: "text-cyan-600 dark:text-cyan-400",
        borderColor: "border-cyan-200 dark:border-cyan-800",
    },
    {
        id: "integration",
        step: 6,
        title: "Integration",
        description: "Get the embed code and deploy your agent to your website",
        icon: Code,
        color: "from-emerald-500 to-teal-600",
        bgLight: "bg-emerald-50",
        bgDark: "dark:bg-emerald-950/30",
        textColor: "text-emerald-600 dark:text-emerald-400",
        borderColor: "border-emerald-200 dark:border-emerald-800",
    },
];


// ── Training Card Content (Simplified) ──────────────────────────
function TrainingCardContent() {
    const [url, setUrl] = React.useState("");
    const [isScanning, setIsScanning] = React.useState(false);
    const [scanDone, setScanDone] = React.useState(false);

    const handleScan = () => {
        if (!url) return;
        setIsScanning(true);
        setTimeout(() => {
            setIsScanning(false);
            setScanDone(true);
        }, 2000);
    };

    const sources = [
        { icon: Upload, label: "Documents", desc: "PDF, DOCX, TXT", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/40" },
        { icon: Video, label: "Videos", desc: "YouTube URL", color: "text-red-500", bg: "bg-red-50 dark:bg-red-950/40" },
        { icon: BookOpen, label: "Notion", desc: "Sync workspace", color: "text-zinc-700 dark:text-zinc-300", bg: "bg-zinc-100 dark:bg-zinc-800" },
        { icon: MessageCircle, label: "Q&A", desc: "Manual FAQs", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-950/40" },
    ];

    return (
        <div className="space-y-5">
            {/* URL Input */}
            <div>
                <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Website URL
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            placeholder="https://your-company.com"
                            className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                        />
                    </div>
                    <Button
                        onClick={handleScan}
                        disabled={!url || isScanning}
                        className="h-11 gap-2 rounded-xl bg-zinc-900 px-5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                        {isScanning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : scanDone ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Sparkles className="h-4 w-4" />
                        )}
                        {isScanning ? "Scanning..." : scanDone ? "Scanned" : "Scan Site"}
                    </Button>
                </div>
                {scanDone && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                        <Check className="h-3 w-3" />
                        Found 29 pages, logo, and brand colors
                    </div>
                )}
            </div>

            {/* Additional Sources */}
            <div>
                <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                    Additional Sources
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {sources.map((source) => (
                        <button
                            key={source.label}
                            className={`group flex flex-col items-center gap-2 rounded-xl border border-zinc-200 ${source.bg} p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:hover:border-zinc-600`}
                        >
                            <source.icon className={`h-5 w-5 ${source.color} transition-transform group-hover:scale-110`} />
                            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">{source.label}</span>
                            <span className="text-[10px] text-zinc-500 dark:text-zinc-400">{source.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── Actions Card Content ────────────────────────────────────────
function ActionsCardContent() {
    const [enabledActions, setEnabledActions] = React.useState<Set<string>>(
        new Set(["create-ticket", "send-email", "search-kb"])
    );

    const toggleAction = (actionId: string) => {
        setEnabledActions(prev => {
            const next = new Set(prev);
            if (next.has(actionId)) {
                next.delete(actionId);
            } else {
                next.add(actionId);
            }
            return next;
        });
    };

    const actionCategories = [
        {
            category: "Customer Support",
            color: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-950/30",
            actions: [
                { id: "create-ticket", name: "Create Support Ticket", desc: "Generate tickets in your helpdesk" },
                { id: "update-ticket", name: "Update Ticket Status", desc: "Modify existing ticket information" },
                { id: "search-kb", name: "Search Knowledge Base", desc: "Find relevant articles and docs" },
                { id: "send-email", name: "Send Email", desc: "Automated email notifications" },
            ]
        },
        {
            category: "Sales",
            color: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
            actions: [
                { id: "schedule-demo", name: "Schedule Demo", desc: "Book calendar appointments" },
                { id: "qualify-lead", name: "Qualify Lead", desc: "Score and categorize prospects" },
                { id: "send-quote", name: "Send Quote", desc: "Generate and send pricing quotes" },
                { id: "update-crm", name: "Update CRM", desc: "Sync data to your CRM system" },
            ]
        },
        {
            category: "E-commerce",
            color: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-50 dark:bg-purple-950/30",
            actions: [
                { id: "process-refund", name: "Process Refund", desc: "Issue refunds automatically" },
                { id: "track-order", name: "Track Order", desc: "Check shipment status" },
                { id: "update-inventory", name: "Update Inventory", desc: "Modify stock levels" },
                { id: "apply-discount", name: "Apply Discount", desc: "Generate coupon codes" },
            ]
        },
        {
            category: "Technical Support",
            color: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-50 dark:bg-orange-950/30",
            actions: [
                { id: "reset-password", name: "Reset Password", desc: "Send password reset links" },
                { id: "check-status", name: "Check System Status", desc: "Monitor service health" },
                { id: "run-diagnostic", name: "Run Diagnostic", desc: "Troubleshoot technical issues" },
                { id: "escalate-issue", name: "Escalate Issue", desc: "Route to technical team" },
            ]
        },
        {
            category: "Account Management",
            color: "text-pink-600 dark:text-pink-400",
            bg: "bg-pink-50 dark:bg-pink-950/30",
            actions: [
                { id: "update-profile", name: "Update Profile", desc: "Modify user information" },
                { id: "change-plan", name: "Change Subscription", desc: "Upgrade or downgrade plans" },
                { id: "cancel-account", name: "Cancel Account", desc: "Process cancellations" },
                { id: "verify-identity", name: "Verify Identity", desc: "Authenticate users" },
            ]
        },
        {
            category: "Analytics",
            color: "text-cyan-600 dark:text-cyan-400",
            bg: "bg-cyan-50 dark:bg-cyan-950/30",
            actions: [
                { id: "log-interaction", name: "Log Interaction", desc: "Record conversation data" },
                { id: "track-conversion", name: "Track Conversion", desc: "Monitor goal completions" },
                { id: "send-feedback", name: "Send Feedback", desc: "Collect user ratings" },
                { id: "generate-report", name: "Generate Report", desc: "Create analytics summaries" },
            ]
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                        Available Actions
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Enable actions your agent can perform automatically
                    </p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
                    {enabledActions.size} / 24 enabled
                </span>
            </div>

            <div className="max-h-[400px] space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 hover:scrollbar-thumb-zinc-400 dark:scrollbar-track-zinc-800 dark:scrollbar-thumb-zinc-600 dark:hover:scrollbar-thumb-zinc-500">
                {actionCategories.map((category) => (
                    <div key={category.category} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                        <div className={`${category.bg} px-4 py-2.5`}>
                            <h4 className={`text-xs font-bold ${category.color}`}>
                                {category.category}
                            </h4>
                        </div>
                        <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                            {category.actions.map((action) => {
                                const isEnabled = enabledActions.has(action.id);
                                return (
                                    <div
                                        key={action.id}
                                        className="flex items-center gap-3 bg-white px-4 py-3 transition-colors hover:bg-zinc-50 dark:bg-zinc-900/60 dark:hover:bg-zinc-800/60"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                                                {action.name}
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {action.desc}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => toggleAction(action.id)}
                                            className={`relative h-6 w-11 rounded-full transition-all duration-200 ${isEnabled
                                                ? "bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-500/30"
                                                : "bg-zinc-200 dark:bg-zinc-700"
                                                }`}
                                        >
                                            <div
                                                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-all duration-200 ${isEnabled ? "left-[22px]" : "left-0.5"
                                                    }`}
                                            />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Guardrails Card Content ─────────────────────────────────────
function GuardrailsCardContent() {
    // Core Behavior State
    const [strictBusinessMode, setStrictBusinessMode] = React.useState(true);
    const [competitorTags, setCompetitorTags] = React.useState<string[]>(["Uber", "PickMe"]);
    const [competitorInput, setCompetitorInput] = React.useState("");

    // Stability & Advanced Safety State
    const [antiHallucination, setAntiHallucination] = React.useState(true);
    const [promptInjectionDefense, setPromptInjectionDefense] = React.useState(true);
    const [spamProtection, setSpamProtection] = React.useState(true);
    const [rateLimit, setRateLimit] = React.useState(20);
    const [humanHandover, setHumanHandover] = React.useState(true);
    const [piiMasking, setPiiMasking] = React.useState(true);
    const [contentFilters, setContentFilters] = React.useState({
        hateSpeech: true,
        adultContent: true,
        financialAdvice: false,
    });

    const handleCompetitorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && competitorInput.trim()) {
            e.preventDefault();
            if (!competitorTags.includes(competitorInput.trim())) {
                setCompetitorTags([...competitorTags, competitorInput.trim()]);
            }
            setCompetitorInput("");
        }
    };

    const removeCompetitorTag = (tagToRemove: string) => {
        setCompetitorTags(competitorTags.filter((tag) => tag !== tagToRemove));
    };

    // Toggle Switch Component
    const ToggleSwitch = ({
        enabled,
        onChange,
        size = "default",
    }: {
        enabled: boolean;
        onChange: () => void;
        size?: "default" | "small";
    }) => {
        const sizeClasses = size === "small" ? "h-5 w-9" : "h-6 w-11";
        const dotSizeClasses = size === "small" ? "h-4 w-4" : "h-5 w-5";
        const dotPosition = size === "small"
            ? enabled ? "left-[18px]" : "left-0.5"
            : enabled ? "left-[22px]" : "left-0.5";

        return (
            <button
                onClick={onChange}
                className={`relative ${sizeClasses} rounded-full transition-all duration-300 ${enabled
                    ? "bg-violet-600 shadow-md shadow-violet-500/30"
                    : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
            >
                <div
                    className={`absolute top-0.5 ${dotSizeClasses} rounded-full bg-white shadow-sm transition-all duration-300 ${dotPosition}`}
                />
            </button>
        );
    };

    return (
        <div className="max-h-[500px] space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 hover:scrollbar-thumb-zinc-400 dark:scrollbar-track-zinc-800 dark:scrollbar-thumb-zinc-600 dark:hover:scrollbar-thumb-zinc-500">
            {/* Section 1: Core Behavior */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2.5 dark:from-violet-950/30 dark:to-purple-950/30">
                    <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Core Behavior
                        </h3>
                    </div>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Restrict to Knowledge Base */}
                    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    Restrict AI to Knowledge Base
                                </h4>
                                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                    Recommended
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Prevents the AI from answering general questions outside your domain
                            </p>
                        </div>
                        <ToggleSwitch
                            enabled={strictBusinessMode}
                            onChange={() => setStrictBusinessMode(!strictBusinessMode)}
                        />
                    </div>

                    {/* Competitor Blacklist */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Blacklisted Competitors
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                AI will never recommend or mention these competitors
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-800/50">
                            {competitorTags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                                >
                                    {tag}
                                    <button
                                        onClick={() => removeCompetitorTag(tag)}
                                        className="rounded-full p-0.5 transition-colors hover:bg-violet-200 dark:hover:bg-violet-800"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                            <input
                                type="text"
                                value={competitorInput}
                                onChange={(e) => setCompetitorInput(e.target.value)}
                                onKeyDown={handleCompetitorKeyDown}
                                placeholder={competitorTags.length === 0 ? "Type and press Enter..." : "Add more..."}
                                className="min-w-[120px] flex-1 border-none bg-transparent py-1 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Stability & Advanced Safety */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-2.5 dark:from-emerald-950/30 dark:to-teal-950/30">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Stability & Advanced Safety
                        </h3>
                    </div>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Anti-Hallucination */}
                    <div className="flex items-start justify-between gap-3 bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                                <Brain className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                    Anti-Hallucination Mode
                                </h4>
                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    Strictly limits the AI to your Knowledge Base. If the answer isn't found, it will say "I don't know" instead of guessing.
                                </p>
                            </div>
                        </div>
                        <ToggleSwitch
                            enabled={antiHallucination}
                            onChange={() => setAntiHallucination(!antiHallucination)}
                            size="small"
                        />
                    </div>

                    {/* Prompt Injection Defense */}
                    <div className="flex items-start justify-between gap-3 bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30">
                                <ShieldAlert className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                    Prompt Injection Defense
                                </h4>
                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    Detects and blocks attempts to "jailbreak" or override the AI's system instructions.
                                </p>
                            </div>
                        </div>
                        <ToggleSwitch
                            enabled={promptInjectionDefense}
                            onChange={() => setPromptInjectionDefense(!promptInjectionDefense)}
                            size="small"
                        />
                    </div>

                    {/* Spam Protection */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                                    <Ban className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                        Spam Protection
                                    </h4>
                                    <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                        Prevents bot abuse by limiting how many messages a single user can send.
                                    </p>
                                    {spamProtection && (
                                        <div className="mt-2 flex items-center gap-2 rounded-lg bg-zinc-50 px-2.5 py-2 dark:bg-zinc-800/50">
                                            <Zap className="h-3.5 w-3.5 text-violet-500" />
                                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                                Limit users to
                                            </span>
                                            <input
                                                type="number"
                                                value={rateLimit}
                                                onChange={(e) => setRateLimit(Number(e.target.value))}
                                                min={1}
                                                max={100}
                                                className="h-7 w-14 rounded-md border border-zinc-200 bg-white px-2 text-center text-xs font-medium text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                                            />
                                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                                msgs/min
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ToggleSwitch
                                enabled={spamProtection}
                                onChange={() => setSpamProtection(!spamProtection)}
                                size="small"
                            />
                        </div>
                    </div>

                    {/* Human Handover */}
                    <div className="flex items-start justify-between gap-3 bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30">
                                <HeartHandshake className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                    Escalate on Frustration
                                </h4>
                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    Transfer to human agent if sentiment analysis detects negative emotions.
                                </p>
                            </div>
                        </div>
                        <ToggleSwitch
                            enabled={humanHandover}
                            onChange={() => setHumanHandover(!humanHandover)}
                            size="small"
                        />
                    </div>

                    {/* PII Masking */}
                    <div className="flex items-start justify-between gap-3 bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                                <EyeOff className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                        Redact Sensitive Data
                                    </h4>
                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                        GDPR
                                    </span>
                                </div>
                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    Automatically hide emails, phone numbers, and credit card info in logs.
                                </p>
                            </div>
                        </div>
                        <ToggleSwitch
                            enabled={piiMasking}
                            onChange={() => setPiiMasking(!piiMasking)}
                            size="small"
                        />
                    </div>

                    {/* Content Filters */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-100 to-fuchsia-100 dark:from-pink-900/30 dark:to-fuchsia-900/30">
                                <Filter className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                    Content Filters
                                </h4>
                                <p className="mt-0.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
                                    Block AI from generating restricted content types.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
                                        <input
                                            type="checkbox"
                                            checked={contentFilters.hateSpeech}
                                            onChange={() =>
                                                setContentFilters({
                                                    ...contentFilters,
                                                    hateSpeech: !contentFilters.hateSpeech,
                                                })
                                            }
                                            className="h-3.5 w-3.5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-700"
                                        />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            Hate Speech
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
                                        <input
                                            type="checkbox"
                                            checked={contentFilters.adultContent}
                                            onChange={() =>
                                                setContentFilters({
                                                    ...contentFilters,
                                                    adultContent: !contentFilters.adultContent,
                                                })
                                            }
                                            className="h-3.5 w-3.5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-700"
                                        />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            Adult Content
                                        </span>
                                    </label>

                                    <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-1.5 text-xs transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
                                        <input
                                            type="checkbox"
                                            checked={contentFilters.financialAdvice}
                                            onChange={() =>
                                                setContentFilters({
                                                    ...contentFilters,
                                                    financialAdvice: !contentFilters.financialAdvice,
                                                })
                                            }
                                            className="h-3.5 w-3.5 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-700"
                                        />
                                        <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                            Financial Advice
                                        </span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Integration Card Content ────────────────────────────────────
function IntegrationCardContent() {
    const [activeTab, setActiveTab] = React.useState<"embed" | "share">("embed");
    const [copied, setCopied] = React.useState(false);

    // Embed code
    const embedCode = `<!-- WizName AI Agent Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['WizNameWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'wn', 'https://cdn.wizname.ai/widget.js'));
  wn('init', { agentId: 'wn_abc123xyz' });
</script>`;

    const shareLink = "https://chat.wizname.ai/agent/wn_abc123xyz";

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-h-[500px] space-y-6 overflow-y-auto pr-2">
            {/* Tab Selector */}
            <div className="flex items-center gap-2 rounded-xl bg-zinc-50 p-1.5 dark:bg-zinc-800/50">
                <button
                    onClick={() => setActiveTab("embed")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${activeTab === "embed"
                        ? "bg-white text-violet-600 shadow-sm dark:bg-zinc-900 dark:text-violet-400"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                        }`}
                >
                    <Code className="h-4 w-4" />
                    Embed Code
                </button>
                <button
                    onClick={() => setActiveTab("share")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold transition-all ${activeTab === "share"
                        ? "bg-white text-violet-600 shadow-sm dark:bg-zinc-900 dark:text-violet-400"
                        : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
                        }`}
                >
                    <Globe className="h-4 w-4" />
                    Share Link
                </button>
            </div>

            {/* Content */}
            {activeTab === "embed" ? (
                <div className="space-y-4">
                    {/* Embed Code Block */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            Website Embed Code
                        </label>
                        <div className="relative">
                            <pre className="rounded-xl border-2 border-zinc-100 bg-zinc-950 p-4 text-xs font-mono text-emerald-400 overflow-x-auto dark:border-zinc-800">
                                <code>{embedCode}</code>
                            </pre>
                            <button
                                onClick={() => copyToClipboard(embedCode)}
                                className={`absolute top-2 right-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${copied
                                    ? "bg-emerald-500 text-white"
                                    : "bg-violet-600 text-white hover:bg-violet-700"
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3 w-3" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="rounded-xl bg-violet-50 p-4 dark:bg-violet-900/20">
                        <h4 className="mb-3 text-sm font-bold text-violet-900 dark:text-violet-200">
                            Quick Setup
                        </h4>
                        <div className="space-y-2">
                            {[
                                "Copy the embed code above",
                                "Paste before the closing </body> tag",
                                "Save and refresh your website",
                            ].map((text, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">
                                        {idx + 1}
                                    </div>
                                    <span className="text-xs text-violet-800 dark:text-violet-300">
                                        {text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Share Link */}
                    <div>
                        <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                            Public Chat Link
                        </label>
                        <div className="flex items-center gap-2 rounded-xl border-2 border-zinc-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="flex-1 truncate font-mono text-xs text-violet-600 dark:text-violet-400">
                                {shareLink}
                            </div>
                            <button
                                onClick={() => copyToClipboard(shareLink)}
                                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all ${copied
                                    ? "bg-emerald-500 text-white"
                                    : "bg-violet-600 text-white hover:bg-violet-700"
                                    }`}
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-3 w-3" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-3 w-3" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Share Description */}
                    <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-start gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-800/50">
                                <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-blue-900 dark:text-blue-200">
                                    Share with Anyone
                                </h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300">
                                    Anyone with this link can chat with your AI agent directly in their browser.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ── Personality Card Content ────────────────────────────────────
function PersonalityCardContent() {
    // State
    const [selectedModel, setSelectedModel] = React.useState<AIModel>(aiModels[0]);
    const [selectedTone, setSelectedTone] = React.useState(toneOptions[0]);
    const [systemPrompt, setSystemPrompt] = React.useState("");

    // Dropdown States
    const [isModelOpen, setIsModelOpen] = React.useState(false);
    const [isToneOpen, setIsToneOpen] = React.useState(false);

    // Helper to render dividers
    const renderModelItem = (model: AIModel, index: number) => {
        const showDivider = index > 0 && aiModels[index - 1].provider !== model.provider;
        return (
            <React.Fragment key={model.id}>
                {showDivider && <div className="mx-2 my-2 h-px bg-zinc-100 dark:bg-zinc-800" />}
                <button
                    onClick={() => {
                        setSelectedModel(model);
                        setIsModelOpen(false);
                    }}
                    className={`group flex w-full items-start justify-between rounded-xl px-4 py-3 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${selectedModel.id === model.id ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                >
                    <div className="flex items-start gap-4">
                        <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm transition-transform group-hover:scale-105 ${model.color}`}>
                            {model.icon}
                        </div>
                        <div className="text-left">
                            <div className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                                {model.name}
                            </div>
                            <div className="mt-0.5 pr-2 text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                                {model.description}
                            </div>
                        </div>
                    </div>
                </button>
            </React.Fragment>
        );
    };

    return (
        <div className="max-h-[500px] space-y-6 overflow-y-auto pr-2">
            {/* 1. MODEL SELECTOR */}
            <div className="relative z-30">
                <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    AI Model
                </label>
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsModelOpen(!isModelOpen);
                            setIsToneOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${selectedModel.color}`}>
                                {selectedModel.icon}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                    {selectedModel.name}
                                </div>
                                <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                    <span>{selectedModel.provider}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                                        <Zap className="h-3 w-3 fill-current" />
                                        {selectedModel.credits} Credits
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isModelOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown List */}
                    {isModelOpen && (
                        <div className="absolute left-0 top-[110%] z-50 mt-2 max-h-[400px] w-full overflow-y-auto rounded-xl border border-zinc-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:scrollbar-thumb-zinc-700">
                            <div className="space-y-0.5">
                                {aiModels.map((model, idx) => renderModelItem(model, idx))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. SYSTEM PROMPT */}
            <div>
                <div className="mb-2 flex items-center justify-between">
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                        System Instructions
                    </label>
                    <button
                        onClick={() => setSystemPrompt("You are a friendly and professional customer support agent for WizName. Your goal is to help users with their inquiries, troubleshoot issues, and provide accurate information about our products and services. Always be polite, concise, and helpful.")}
                        className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-200 dark:bg-violet-900/30 dark:text-violet-300"
                    >
                        <Wand2 className="h-3 w-3" />
                        Generate
                    </button>
                </div>
                <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="You are a helpful assistant..."
                    className="min-h-[120px] w-full resize-none rounded-xl border-2 border-zinc-100 bg-white p-4 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:ring-violet-900/30"
                />
            </div>

            {/* 3. TONE SELECTOR */}
            <div className="relative z-20">
                <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Tone of Voice
                </label>
                <div className="relative">
                    <button
                        onClick={() => {
                            setIsToneOpen(!isToneOpen);
                            setIsModelOpen(false);
                        }}
                        className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 ${selectedTone.color} dark:bg-zinc-800`}>
                                {selectedTone.icon}
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                    {selectedTone.label}
                                </div>
                                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                    {selectedTone.description}
                                </div>
                            </div>
                        </div>
                        <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isToneOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Dropdown List */}
                    {isToneOpen && (
                        <div className="absolute left-0 right-0 top-[110%] z-50 mt-2 max-h-[300px] overflow-y-auto rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="grid grid-cols-1 gap-1">
                                {toneOptions.map((tone) => (
                                    <button
                                        key={tone.id}
                                        onClick={() => {
                                            setSelectedTone(tone);
                                            setIsToneOpen(false);
                                        }}
                                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${selectedTone.id === tone.id ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 text-xs ${tone.color} dark:bg-zinc-800`}>
                                                {tone.icon}
                                            </div>
                                            <div className="text-left">
                                                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {tone.label}
                                                </div>
                                                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                                                    {tone.description}
                                                </div>
                                            </div>
                                        </div>
                                        {selectedTone.id === tone.id && (
                                            <Check className="h-4 w-4 text-violet-600" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ── UI Setup Card Content ───────────────────────────────────────
function UISetupCardContent() {
    // Theme State
    const [agentName, setAgentName] = React.useState("Support Agent");
    const [primaryColor, setPrimaryColor] = React.useState("#8b5cf6");
    const [themeMode, setThemeMode] = React.useState<"light" | "dark" | "auto">("auto");

    // Avatar State
    const [avatarStyle, setAvatarStyle] = React.useState<"robo" | "agent" | "upload">("agent");
    const [avatarDropdownOpen, setAvatarDropdownOpen] = React.useState(false);

    // Launcher State
    const [launcherIcon, setLauncherIcon] = React.useState<"bubble" | "agent" | "upload">("bubble");
    const [launcherDropdownOpen, setLauncherDropdownOpen] = React.useState(false);
    const [launcherPosition, setLauncherPosition] = React.useState<"bottom-right" | "bottom-left">("bottom-right");

    // Welcome Message State
    const [welcomeMessage, setWelcomeMessage] = React.useState("Hi! How can I help you today?");
    const [showTypingIndicator, setShowTypingIndicator] = React.useState(true);

    // Action Chips State
    const [actionChipsOpen, setActionChipsOpen] = React.useState(false);
    const [selectedActions, setSelectedActions] = React.useState<string[]>(["stripe-1", "calendly-1", "support-5"]);

    // All 24 Action chips from the action store (same as onboarding page)
    const availableActions = [
        // Stripe (Billing) - 7 actions
        { id: "stripe-1", label: "Process Refund", icon: "💳", category: "Stripe" },
        { id: "stripe-2", label: "Check Subscription Status", icon: "🔍", category: "Stripe" },
        { id: "stripe-3", label: "Cancel Subscription", icon: "❌", category: "Stripe" },
        { id: "stripe-4", label: "Update Payment Method", icon: "💳", category: "Stripe" },
        { id: "stripe-5", label: "Send Invoice Email", icon: "📧", category: "Stripe" },
        { id: "stripe-6", label: "Check Past Transactions", icon: "⏰", category: "Stripe" },
        { id: "stripe-7", label: "Create Payment Link", icon: "🔗", category: "Stripe" },
        // Calendly (Sales) - 6 actions
        { id: "calendly-1", label: "Book Meeting", icon: "📅", category: "Calendly" },
        { id: "calendly-2", label: "Check Availability", icon: "⏰", category: "Calendly" },
        { id: "calendly-3", label: "Reschedule Meeting", icon: "🔄", category: "Calendly" },
        { id: "calendly-4", label: "Cancel Meeting", icon: "❌", category: "Calendly" },
        { id: "calendly-5", label: "Get Event Types", icon: "📋", category: "Calendly" },
        { id: "calendly-6", label: "List Upcoming Events", icon: "📆", category: "Calendly" },
        // Support Tools - 5 actions
        { id: "support-1", label: "Create Jira Ticket", icon: "🎫", category: "Support" },
        { id: "support-2", label: "Search Notion Docs", icon: "📄", category: "Support" },
        { id: "support-3", label: "Update Zendesk Status", icon: "🔄", category: "Support" },
        { id: "support-4", label: "Send Slack Alert", icon: "🔔", category: "Support" },
        { id: "support-5", label: "Escalate to Human", icon: "👤", category: "Support" },
        // Account Management - 6 actions
        { id: "acc-1", label: "Send Password Reset", icon: "🔐", category: "Account" },
        { id: "acc-2", label: "Unlock User Account", icon: "🔓", category: "Account" },
        { id: "acc-3", label: "Update Email Address", icon: "📧", category: "Account" },
        { id: "acc-4", label: "Enable 2FA Enforcement", icon: "🛡️", category: "Account" },
        { id: "acc-5", label: "Revoke Active Sessions", icon: "🚪", category: "Account" },
        { id: "acc-6", label: "Delete User Account", icon: "🗑️", category: "Account" },
    ];

    // Chat Appearance State
    const [chatWidth, setChatWidth] = React.useState(400);
    const [chatHeight, setChatHeight] = React.useState(600);
    const [borderRadius, setBorderRadius] = React.useState(16);
    const [showBranding, setShowBranding] = React.useState(true);

    const toggleActionChip = (actionId: string) => {
        if (selectedActions.includes(actionId)) {
            setSelectedActions(selectedActions.filter((id) => id !== actionId));
        } else if (selectedActions.length < 5) {
            setSelectedActions([...selectedActions, actionId]);
        }
    };

    // Toggle Switch Component
    const ToggleSwitch = ({
        enabled,
        onChange,
        size = "default",
    }: {
        enabled: boolean;
        onChange: () => void;
        size?: "default" | "small";
    }) => {
        const sizeClasses = size === "small" ? "h-5 w-9" : "h-6 w-11";
        const dotSizeClasses = size === "small" ? "h-4 w-4" : "h-5 w-5";
        const dotPosition = size === "small"
            ? enabled ? "left-[18px]" : "left-0.5"
            : enabled ? "left-[22px]" : "left-0.5";

        return (
            <button
                onClick={onChange}
                className={`relative ${sizeClasses} rounded-full transition-all duration-300 ${enabled
                    ? "bg-violet-600 shadow-md shadow-violet-500/30"
                    : "bg-zinc-200 dark:bg-zinc-700"
                    }`}
            >
                <div
                    className={`absolute top-0.5 ${dotSizeClasses} rounded-full bg-white shadow-sm transition-all duration-300 ${dotPosition}`}
                />
            </button>
        );
    };

    return (
        <div className="max-h-[500px] space-y-4 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-zinc-100 scrollbar-thumb-zinc-300 hover:scrollbar-thumb-zinc-400 dark:scrollbar-track-zinc-800 dark:scrollbar-thumb-zinc-600 dark:hover:scrollbar-thumb-zinc-500">
            {/* Section 1: Theme & Branding */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="bg-gradient-to-r from-violet-50 to-purple-50 px-4 py-2.5 dark:from-violet-950/30 dark:to-purple-950/30">
                    <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Theme & Branding
                        </h3>
                    </div>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Agent Name */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Agent Name
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Display name for your AI assistant
                            </p>
                        </div>
                        <input
                            type="text"
                            value={agentName}
                            onChange={(e) => setAgentName(e.target.value)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            placeholder="Enter agent name..."
                        />
                    </div>

                    {/* Primary Color */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Primary Color
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Choose your brand color for the chat widget
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="h-10 w-20 cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-700"
                            />
                            <input
                                type="text"
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-mono text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                placeholder="#8b5cf6"
                            />
                        </div>
                    </div>

                    {/* Theme Mode */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Theme Mode
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Select light, dark, or auto mode based on user preference
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {(["light", "dark", "auto"] as const).map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setThemeMode(mode)}
                                    className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium capitalize transition-all ${themeMode === mode
                                        ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                        : "border-zinc-200 bg-white text-zinc-600 hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400"
                                        }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Avatar & Launcher */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="bg-gradient-to-r from-cyan-50 to-sky-50 px-4 py-2.5 dark:from-cyan-950/30 dark:to-sky-950/30">
                    <div className="flex items-center gap-2">
                        <Wand2 className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Avatar & Launcher Icon
                        </h3>
                    </div>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Agent Avatar Dropdown */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Agent Avatar
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Choose avatar style for your agent
                            </p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setAvatarDropdownOpen(!avatarDropdownOpen)}
                                className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-all hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            >
                                <span className="capitalize">{avatarStyle === "robo" ? "🤖 Robo Face" : avatarStyle === "agent" ? "👤 Agent Face" : "📤 Upload Avatar"}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${avatarDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {avatarDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                                    {(["robo", "agent", "upload"] as const).map((style) => (
                                        <button
                                            key={style}
                                            onClick={() => {
                                                setAvatarStyle(style);
                                                setAvatarDropdownOpen(false);
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-violet-50 dark:text-zinc-300 dark:hover:bg-violet-900/20"
                                        >
                                            {style === "robo" && "🤖 Robo Face"}
                                            {style === "agent" && "👤 Agent Face"}
                                            {style === "upload" && "📤 Upload Avatar"}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {avatarStyle === "upload" && (
                            <div className="mt-3">
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600 transition-all hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-violet-600">
                                    <Upload className="h-4 w-4" />
                                    Upload Avatar Image
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Launcher Icon Dropdown */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Launcher Icon
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Choose icon for the chat launcher button
                            </p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setLauncherDropdownOpen(!launcherDropdownOpen)}
                                className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-all hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            >
                                <span className="capitalize">{launcherIcon === "bubble" ? "💬 Chat Bubble Icon" : launcherIcon === "agent" ? "👤 Agent Face" : "🏢 Upload Brand Logo"}</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${launcherDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {launcherDropdownOpen && (
                                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                                    {(["bubble", "agent", "upload"] as const).map((icon) => (
                                        <button
                                            key={icon}
                                            onClick={() => {
                                                setLauncherIcon(icon);
                                                setLauncherDropdownOpen(false);
                                            }}
                                            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-zinc-700 transition-colors hover:bg-violet-50 dark:text-zinc-300 dark:hover:bg-violet-900/20"
                                        >
                                            {icon === "bubble" && "💬 Chat Bubble Icon"}
                                            {icon === "agent" && "👤 Agent Face"}
                                            {icon === "upload" && "🏢 Upload Brand Logo"}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {launcherIcon === "upload" && (
                            <div className="mt-3">
                                <button className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-3 text-xs font-medium text-zinc-600 transition-all hover:border-violet-400 hover:bg-violet-50 dark:border-zinc-600 dark:bg-zinc-800/50 dark:text-zinc-400 dark:hover:border-violet-600">
                                    <Upload className="h-4 w-4" />
                                    Upload Brand Logo
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Launcher Position */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Launcher Position
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Position of the chat launcher on your website
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setLauncherPosition("bottom-right")}
                                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${launcherPosition === "bottom-right"
                                    ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                    : "border-zinc-200 bg-white text-zinc-600 hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400"
                                    }`}
                            >
                                Bottom Right
                            </button>
                            <button
                                onClick={() => setLauncherPosition("bottom-left")}
                                className={`flex-1 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${launcherPosition === "bottom-left"
                                    ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                    : "border-zinc-200 bg-white text-zinc-600 hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400"
                                    }`}
                            >
                                Bottom Left
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Welcome Message & Actions */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 px-4 py-2.5 dark:from-pink-950/30 dark:to-rose-950/30">
                    <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Welcome Message & Actions
                        </h3>
                    </div>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Welcome Message Text */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Welcome Message
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                First message users see when opening the chat
                            </p>
                        </div>
                        <textarea
                            value={welcomeMessage}
                            onChange={(e) => setWelcomeMessage(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            placeholder="Enter welcome message..."
                        />
                    </div>

                    {/* Action Chips Dropdown */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    Action Chips
                                </h4>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {selectedActions.length}/5 selected
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Quick action buttons shown below welcome message
                            </p>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setActionChipsOpen(!actionChipsOpen)}
                                className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 transition-all hover:border-violet-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                            >
                                <span className="text-xs">Select actions to display</span>
                                <ChevronDown className={`h-4 w-4 transition-transform ${actionChipsOpen ? "rotate-180" : ""}`} />
                            </button>
                            {actionChipsOpen && (
                                <div className="absolute z-10 mt-1 max-h-80 w-full overflow-y-auto rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
                                    {/* Stripe Actions */}
                                    <div className="mb-2">
                                        <div className="mb-1 flex items-center gap-2 px-2 py-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">💳 Stripe (7)</span>
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-700" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Stripe").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleActionChip(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                                                        } ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-zinc-700 dark:text-zinc-300">{action.label}</span>
                                                    </div>
                                                    {isSelected && <Check className="h-4 w-4 text-violet-600" />}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Calendly Actions */}
                                    <div className="mb-2">
                                        <div className="mb-1 flex items-center gap-2 px-2 py-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">📅 Calendly (6)</span>
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-700" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Calendly").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleActionChip(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                                                        } ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-zinc-700 dark:text-zinc-300">{action.label}</span>
                                                    </div>
                                                    {isSelected && <Check className="h-4 w-4 text-violet-600" />}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Support Tools Actions */}
                                    <div className="mb-2">
                                        <div className="mb-1 flex items-center gap-2 px-2 py-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">🛠️ Support (5)</span>
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-700" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Support").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleActionChip(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                                                        } ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-zinc-700 dark:text-zinc-300">{action.label}</span>
                                                    </div>
                                                    {isSelected && <Check className="h-4 w-4 text-violet-600" />}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Account Management Actions */}
                                    <div>
                                        <div className="mb-1 flex items-center gap-2 px-2 py-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">🔐 Account (6)</span>
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-700" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Account").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleActionChip(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-700/50"
                                                        } ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-zinc-700 dark:text-zinc-300">{action.label}</span>
                                                    </div>
                                                    {isSelected && <Check className="h-4 w-4 text-violet-600" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                        {selectedActions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {selectedActions.map((actionId) => {
                                    const action = availableActions.find(a => a.id === actionId);
                                    return (
                                        <span
                                            key={actionId}
                                            className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                                        >
                                            {action?.icon} {action?.label}
                                            <button
                                                onClick={() => toggleActionChip(actionId)}
                                                className="rounded-full p-0.5 transition-colors hover:bg-violet-200 dark:hover:bg-violet-800"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Show Typing Indicator */}
                    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Show Typing Indicator
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Display animated dots when AI is generating response
                            </p>
                        </div>
                        <ToggleSwitch
                            enabled={showTypingIndicator}
                            onChange={() => setShowTypingIndicator(!showTypingIndicator)}
                            size="small"
                        />
                    </div>
                </div>
            </div>

            {/* Section 4: Chat Appearance */}
            <div className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 dark:from-amber-950/30 dark:to-orange-950/30">
                    <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                            Chat Appearance
                        </h3>
                    </div>
                </div>

                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {/* Chat Dimensions */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-3">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Chat Window Size
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Adjust the width and height of the chat window
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                        Width
                                    </label>
                                    <span className="text-xs font-mono text-zinc-500">
                                        {chatWidth}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="300"
                                    max="600"
                                    value={chatWidth}
                                    onChange={(e) => setChatWidth(Number(e.target.value))}
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-600"
                                />
                            </div>
                            <div>
                                <div className="mb-1.5 flex items-center justify-between">
                                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                        Height
                                    </label>
                                    <span className="text-xs font-mono text-zinc-500">
                                        {chatHeight}px
                                    </span>
                                </div>
                                <input
                                    type="range"
                                    min="400"
                                    max="800"
                                    value={chatHeight}
                                    onChange={(e) => setChatHeight(Number(e.target.value))}
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Border Radius */}
                    <div className="bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="mb-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                    Border Radius
                                </h4>
                                <span className="text-xs font-mono text-zinc-500">
                                    {borderRadius}px
                                </span>
                            </div>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Roundness of chat window corners
                            </p>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="32"
                            value={borderRadius}
                            onChange={(e) => setBorderRadius(Number(e.target.value))}
                            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-zinc-200 dark:bg-zinc-700 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-600"
                        />
                    </div>

                    {/* Show Branding */}
                    <div className="flex items-center justify-between bg-white px-4 py-3 dark:bg-zinc-900/60">
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                Show "Powered by" Badge
                            </h4>
                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                Display branding in chat footer
                            </p>
                        </div>
                        <ToggleSwitch
                            enabled={showBranding}
                            onChange={() => setShowBranding(!showBranding)}
                            size="small"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Chat Preview Component ──────────────────────────────────────
function ChatPreview({ agent }: { agent: typeof allAgents[0] }) {
    const [messages] = React.useState([
        { role: "bot", text: `Hi there! 👋 I'm ${agent.name}. How can I help you today?` },
        { role: "user", text: "What can you do?" },
        { role: "bot", text: "I can help you with customer inquiries, track orders, handle returns, and much more. Just ask me anything!" },
    ]);

    return (
        <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-zinc-200/50 bg-gradient-to-b from-white to-zinc-50 shadow-2xl dark:border-zinc-800/50 dark:from-zinc-900 dark:to-zinc-950">
            {/* Chat Header */}
            <div
                className="relative flex items-center gap-4 px-6 py-5 backdrop-blur-sm"
                style={{
                    background: `linear-gradient(135deg, ${agent.theme}f0, ${agent.theme}dd)`,
                    boxShadow: `0 4px 20px -4px ${agent.theme}40`
                }}
            >
                <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/25 text-sm font-bold text-white shadow-lg backdrop-blur-md ring-2 ring-white/30 transition-transform hover:scale-105"
                >
                    {agent.initials}
                </div>
                <div className="flex-1">
                    <p className="text-base font-bold text-white drop-shadow-sm">{agent.name}</p>
                    <div className="flex items-center gap-2">
                        <div className="relative flex items-center gap-1.5">
                            <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50 animate-pulse" />
                            <span className="text-xs font-medium text-white/90">Online</span>
                        </div>
                        <span className="text-xs text-white/60">• Avg response 0.8s</span>
                    </div>
                </div>
                {/* Decorative gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
            </div>

            {/* Chat Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.map((msg, i) => (
                    <div key={i} className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                        {msg.role === "bot" ? (
                            <div
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
                                style={{ backgroundColor: agent.theme }}
                            >
                                {agent.initials}
                            </div>
                        ) : (
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 dark:bg-zinc-700">
                                <User className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user"
                                ? "rounded-br-md bg-gradient-to-r text-white"
                                : "rounded-bl-md bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200"
                                }`}
                            style={msg.role === "user" ? { background: `linear-gradient(135deg, ${agent.theme}, ${agent.theme}cc)` } : {}}
                        >
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>

            {/* Chat Input */}
            <div className="border-t border-zinc-200/50 bg-white/80 p-5 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-5 py-3.5 shadow-sm transition-all focus-within:border-zinc-300 focus-within:shadow-md dark:border-zinc-700 dark:bg-zinc-800">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                        readOnly
                    />
                    <button
                        className="flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
                        style={{
                            backgroundColor: agent.theme,
                            boxShadow: `0 4px 12px -2px ${agent.theme}60`
                        }}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500">
                        Powered by WizName AI
                    </p>
                    <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                </div>
            </div>
        </div>
    );
}

// ── Main Configure Page ─────────────────────────────────────────
export default function ConfigurePage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id as string;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set(["training"]));

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const currentAgent = allAgents.find(a => a.id === agentId) || allAgents[0];

    const toggleCard = (cardId: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            if (next.has(cardId)) {
                next.delete(cardId);
            } else {
                next.add(cardId);
            }
            return next;
        });
    };

    return (
        <div className="flex min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="configure" agentId={agentId} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* ── Main Content ───────────────────────────────── */}
            <main className={mainClass}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-md"
                            style={{ backgroundColor: currentAgent.theme }}
                        >
                            {currentAgent.initials}
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                {currentAgent.name}
                            </h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Configure your agent
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative rounded-xl bg-zinc-100 p-2.5 text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <ThemeToggle />
                        <Button className="h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-5 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all">
                            <Sparkles className="mr-2 h-4 w-4" />
                            Deploy
                        </Button>
                    </div>
                </header>

                {/* ── Split Layout: Customize (Left) + Preview (Right) ── */}
                <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
                    {/* LEFT - Customize Section */}
                    <div className="w-full overflow-y-auto border-r border-zinc-200 p-4 sm:p-6 lg:w-3/5 xl:w-[60%] dark:border-zinc-800">
                        {/* Page Title */}
                        <div className="mb-6">
                            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                Customize
                            </h2>
                            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                Build an intelligent AI Agent your users will truly love
                            </p>
                        </div>

                        {/* Collapsible Cards */}
                        <div className="space-y-3">
                            {onboardingSteps.map((step) => {
                                const isExpanded = expandedCards.has(step.id);
                                const StepIcon = step.icon;

                                return (
                                    <div
                                        key={step.id}
                                        className={`overflow-hidden rounded-2xl border transition-all duration-300 ${isExpanded
                                            ? `${step.borderColor} bg-white shadow-lg shadow-zinc-200/50 dark:bg-zinc-900 dark:shadow-none`
                                            : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700"
                                            }`}
                                    >
                                        {/* Card Header */}
                                        <button
                                            onClick={() => toggleCard(step.id)}
                                            className="flex w-full items-center gap-4 p-4 text-left transition-colors"
                                        >
                                            {/* Step Badge */}
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${step.color} text-white shadow-lg transition-transform duration-300 ${isExpanded ? "scale-110" : ""
                                                    }`}
                                            >
                                                <StepIcon className="h-4 w-4" />
                                            </div>

                                            {/* Title + Description */}
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                        {step.title}
                                                    </h3>
                                                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${step.bgLight} ${step.bgDark} ${step.textColor}`}>
                                                        Step {step.step}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                                                    {step.description}
                                                </p>
                                            </div>

                                            {/* Chevron */}
                                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-all ${isExpanded
                                                ? "bg-zinc-100 dark:bg-zinc-800"
                                                : "text-zinc-400"
                                                }`}>
                                                {isExpanded ? (
                                                    <ChevronDown className="h-4 w-4 text-zinc-600 dark:text-zinc-300" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Card Content */}
                                        <div
                                            className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <div className="border-t border-zinc-100 px-4 pb-4 pt-4 dark:border-zinc-800">
                                                {step.id === "training" && <TrainingCardContent />}
                                                {step.id === "actions" && <ActionsCardContent />}
                                                {step.id === "guardrails" && <GuardrailsCardContent />}
                                                {step.id === "personality" && <PersonalityCardContent />}
                                                {step.id === "ui-setup" && <UISetupCardContent />}
                                                {step.id === "integration" && <IntegrationCardContent />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT - Preview Section */}
                    <div className="hidden shrink-0 flex-col bg-zinc-100/50 p-4 sm:p-6 lg:flex lg:w-2/5 xl:w-[40%] dark:bg-zinc-950/50">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                Live Preview
                            </h3>
                            <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Real-time
                            </span>
                        </div>
                        <div className="flex-1">
                            <ChatPreview agent={currentAgent} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
