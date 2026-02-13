"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter, useParams } from "next/navigation";
import {
    Sparkles,
    Bot,
    Settings,
    BarChart3,
    MessageSquare,
    Users,
    CreditCard,
    HelpCircle,
    LogOut,
    Plus,
    Bell,
    Menu,
    ChevronDown,
    ChevronRight,
    Globe,
    Zap,
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
} from "lucide-react";

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

// Sidebar nav items
const sidebarNavItems = [
    { icon: Bot, label: "My Agents", href: "/dashboard", active: true, hasSubmenu: true },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics", active: false, hasSubmenu: false },
    { icon: MessageSquare, label: "Conversations", href: "/dashboard/conversations", active: false, hasSubmenu: false },
    { icon: Users, label: "Team", href: "/dashboard/team", active: false, hasSubmenu: false },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing", active: false, hasSubmenu: false },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", active: false, hasSubmenu: false },
];

const sidebarBottomItems = [
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: LogOut, label: "Logout", href: "/logout" },
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
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [expandedCards, setExpandedCards] = React.useState<Set<string>>(new Set(["training"]));
    const [agentsSubmenuOpen, setAgentsSubmenuOpen] = React.useState(true);

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
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* ── Sidebar ────────────────────────────────────── */}
            <aside className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"}`}>
                <div className="flex h-full flex-col border-r border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    {/* Logo */}
                    <div className="flex h-16 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30">
                                <Sparkles className="h-5 w-5 text-white" />
                            </div>
                            {sidebarOpen && (
                                <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                    WizName
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
                        {sidebarNavItems.map((item) => (
                            <div key={item.label}>
                                <button
                                    onClick={() => {
                                        if (item.hasSubmenu && sidebarOpen) {
                                            setAgentsSubmenuOpen(!agentsSubmenuOpen);
                                        } else {
                                            router.push(item.href);
                                        }
                                    }}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${item.active
                                        ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {sidebarOpen && (
                                        <>
                                            <span className="flex-1 text-left">{item.label}</span>
                                            {item.hasSubmenu && (
                                                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${agentsSubmenuOpen ? "" : "-rotate-90"}`} />
                                            )}
                                        </>
                                    )}
                                </button>

                                {/* Agents Submenu */}
                                {item.hasSubmenu && sidebarOpen && agentsSubmenuOpen && (
                                    <div className="mt-1 ml-3 space-y-0.5 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
                                        {allAgents.map((agent) => (
                                            <button
                                                key={agent.id}
                                                onClick={() => router.push(`/dashboard/configure/${agent.id}`)}
                                                className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-all ${agent.id === agentId
                                                    ? "bg-violet-50 dark:bg-violet-950/30"
                                                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                                    }`}
                                            >
                                                {/* Agent Avatar */}
                                                <div
                                                    className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-bold text-white shadow-sm transition-transform group-hover:scale-105"
                                                    style={{
                                                        backgroundColor: agent.theme,
                                                        boxShadow: `0 2px 8px -2px ${agent.theme}50`,
                                                    }}
                                                >
                                                    {agent.initials}
                                                    {/* Status dot */}
                                                    <div
                                                        className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border-[1.5px] border-white dark:border-zinc-900 ${agent.status === "active" ? "bg-emerald-500" : "bg-amber-500"
                                                            }`}
                                                    />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className={`truncate text-xs font-semibold ${agent.id === agentId
                                                        ? "text-violet-700 dark:text-violet-300"
                                                        : "text-zinc-700 dark:text-zinc-300"
                                                        }`}>
                                                        {agent.name}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                        {/* Add New Agent */}
                                        <button
                                            onClick={() => router.push("/")}
                                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-medium text-zinc-400 transition-all hover:bg-zinc-50 hover:text-violet-600 dark:hover:bg-zinc-800/50 dark:hover:text-violet-400"
                                        >
                                            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600">
                                                <Plus className="h-3.5 w-3.5" />
                                            </div>
                                            <span>New Agent</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>

                    {/* Bottom Navigation */}
                    <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
                        {sidebarBottomItems.map((item) => (
                            <button
                                key={item.label}
                                onClick={() => router.push(item.href)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {sidebarOpen && <span>{item.label}</span>}
                            </button>
                        ))}
                    </div>

                    {/* User Profile */}
                    {sidebarOpen && (
                        <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-white">
                                    JD
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                        John Doe
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Pro Plan
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* ── Main Content ───────────────────────────────── */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`}>
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
                <div className="flex h-[calc(100vh-64px)]">
                    {/* LEFT - Customize Section */}
                    <div className="flex-1 overflow-y-auto border-r border-zinc-200 p-6 dark:border-zinc-800">
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
                                                {step.id === "guardrails" && (
                                                    <div className="flex items-center gap-3 rounded-xl bg-rose-50 p-4 dark:bg-rose-950/30">
                                                        <Shield className="h-5 w-5 text-rose-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Set Guardrails</p>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Define safety rules, churn prevention, and compliance policies</p>
                                                        </div>
                                                        <Button
                                                            onClick={(e) => { e.stopPropagation(); router.push("/guardrails"); }}
                                                            variant="outline"
                                                            className="ml-auto shrink-0 rounded-lg text-xs"
                                                        >
                                                            Configure
                                                        </Button>
                                                    </div>
                                                )}
                                                {step.id === "personality" && (
                                                    <div className="flex items-center gap-3 rounded-xl bg-pink-50 p-4 dark:bg-pink-950/30">
                                                        <Palette className="h-5 w-5 text-pink-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Set Personality</p>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Choose AI model, tone of voice, and response style</p>
                                                        </div>
                                                        <Button
                                                            onClick={(e) => { e.stopPropagation(); router.push("/personality"); }}
                                                            variant="outline"
                                                            className="ml-auto shrink-0 rounded-lg text-xs"
                                                        >
                                                            Configure
                                                        </Button>
                                                    </div>
                                                )}
                                                {step.id === "ui-setup" && (
                                                    <div className="flex items-center gap-3 rounded-xl bg-cyan-50 p-4 dark:bg-cyan-950/30">
                                                        <Wand2 className="h-5 w-5 text-cyan-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Customize UI</p>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Design your chat widget appearance and welcome messages</p>
                                                        </div>
                                                        <Button
                                                            onClick={(e) => { e.stopPropagation(); router.push("/ui-setup"); }}
                                                            variant="outline"
                                                            className="ml-auto shrink-0 rounded-lg text-xs"
                                                        >
                                                            Configure
                                                        </Button>
                                                    </div>
                                                )}
                                                {step.id === "integration" && (
                                                    <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/30">
                                                        <Code className="h-5 w-5 text-emerald-500" />
                                                        <div>
                                                            <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Deploy & Integrate</p>
                                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Get embed code, share links, and connect to your platforms</p>
                                                        </div>
                                                        <Button
                                                            onClick={(e) => { e.stopPropagation(); router.push("/integration"); }}
                                                            variant="outline"
                                                            className="ml-auto shrink-0 rounded-lg text-xs"
                                                        >
                                                            Configure
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT - Preview Section */}
                    <div className="hidden w-[780px] shrink-0 flex-col bg-zinc-100/50 p-6 dark:bg-zinc-950/50 lg:flex">
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
