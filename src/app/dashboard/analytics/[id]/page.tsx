"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
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
    Menu,
    DollarSign,
    Clock,
    TrendingUp,
    Zap,
    CheckCircle,
    XCircle,
    MapPin,
    Calendar,
    Edit,
    Activity,
    Brain,
    Shield,
    Timer,
    ArrowUp,
    ArrowDown,
    Plus,
    Flame,
    BookOpen,
    X,
    Star,
    ChevronDown,
    ChevronRight,
} from "lucide-react";

// Sidebar navigation items
const sidebarNavItems = [
    { icon: Bot, label: "My Agents", href: "/dashboard", active: false },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics", active: true },
    { icon: MessageSquare, label: "Conversations", href: "/dashboard/conversations", active: false },
    { icon: Users, label: "Team", href: "/dashboard/team", active: false },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing", active: false },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", active: false },
];

const sidebarBottomItems = [
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: LogOut, label: "Logout", href: "/logout" },
];

export default function AnalyticsPage() {
    const router = useRouter();
    const params = useParams();
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [myAgentsOpen, setMyAgentsOpen] = React.useState(true);
    const [editingValue, setEditingValue] = React.useState(false);
    const [ticketValue, setTicketValue] = React.useState(5.0);

    // Refs for scroll navigation
    const valueRef = React.useRef<HTMLDivElement>(null);
    const performanceRef = React.useRef<HTMLDivElement>(null);
    const sentimentRef = React.useRef<HTMLDivElement>(null);
    const trafficRef = React.useRef<HTMLDivElement>(null);

    // Scroll to section
    const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // User's Agent List
    const userAgents = [
        { id: "wn_abc123xyz", name: "Customer Support Bot", theme: "#7c3aed", active: true },
        { id: "wn_def456uvw", name: "Sales Assistant", theme: "#3b82f6", active: false },
        { id: "wn_ghi789rst", name: "HR Helper", theme: "#10b981", active: false },
    ];

    // Dummy agent data
    const agent = {
        id: params.id || "wn_abc123xyz",
        name: "Customer Support Bot",
        theme: "#7c3aed",
        totalChats: 250,
        avgHandlingTime: 5,
    };

    const moneySaved = agent.totalChats * ticketValue;
    const timeSaved = (agent.totalChats * agent.avgHandlingTime) / 60;

    const actionBreakdown = [
        { name: "Stripe Refunds", value: 40, color: "#7c3aed" },
        { name: "Calendly Bookings", value: 30, color: "#3b82f6" },
        { name: "Support Tickets", value: 30, color: "#f97316" },
    ];

    const sentimentData = [
        { label: "Positive", value: 65, emoji: "😁", color: "#10b981" },
        { label: "Neutral", value: 25, emoji: "😐", color: "#f59e0b" },
        { label: "Negative", value: 10, emoji: "😡", color: "#ef4444" },
    ];

    const topTopics = [
        { word: "Refund", count: 45 },
        { word: "Pricing", count: 38 },
        { word: "API Key", count: 32 },
        { word: "Login Error", count: 28 },
        { word: "Billing", count: 22 },
        { word: "Integration", count: 18 },
    ];

    const heatmapData = [
        { day: "Mon", hours: [2, 5, 8, 12, 18, 25, 32, 28, 35, 42, 38, 30, 25, 28, 32, 35, 30, 22, 15, 10, 8, 5, 3, 2] },
        { day: "Tue", hours: [1, 4, 7, 10, 15, 22, 30, 25, 32, 40, 35, 28, 22, 25, 30, 32, 28, 20, 12, 8, 6, 4, 2, 1] },
        { day: "Wed", hours: [2, 3, 6, 9, 14, 20, 28, 24, 30, 38, 33, 26, 20, 23, 28, 30, 26, 18, 10, 7, 5, 3, 2, 1] },
        { day: "Thu", hours: [1, 4, 8, 11, 16, 23, 31, 27, 33, 41, 36, 29, 23, 26, 31, 33, 29, 21, 13, 9, 7, 5, 3, 2] },
        { day: "Fri", hours: [3, 6, 9, 13, 19, 26, 34, 30, 36, 44, 39, 32, 26, 29, 34, 36, 32, 24, 16, 11, 9, 6, 4, 3] },
        { day: "Sat", hours: [1, 2, 3, 5, 8, 12, 16, 14, 18, 22, 20, 16, 14, 16, 18, 20, 18, 14, 10, 7, 5, 3, 2, 1] },
        { day: "Sun", hours: [1, 1, 2, 4, 6, 10, 14, 12, 16, 20, 18, 14, 12, 14, 16, 18, 16, 12, 8, 6, 4, 2, 1, 1] },
    ];

    const countryData = [
        { country: "United States", count: 85, code: "US" },
        { country: "United Kingdom", count: 42, code: "GB" },
        { country: "Canada", count: 28, code: "CA" },
        { country: "Australia", count: 22, code: "AU" },
        { country: "Germany", count: 18, code: "DE" },
        { country: "France", count: 15, code: "FR" },
        { country: "India", count: 12, code: "IN" },
        { country: "Others", count: 28, code: "XX" },
    ];

    // Knowledge Gap Data
    const knowledgeGaps = [
        { id: 1, query: "How to reset API key?", frequency: 15, lastAsked: "2 mins ago", priority: "high" },
        { id: 2, query: "Can I change my billing cycle?", frequency: 12, lastAsked: "5 mins ago", priority: "high" },
        { id: 3, query: "What's the refund policy for annual plans?", frequency: 8, lastAsked: "1 hour ago", priority: "medium" },
        { id: 4, query: "How to integrate with Shopify?", frequency: 7, lastAsked: "2 hours ago", priority: "medium" },
        { id: 5, query: "Can I export conversation logs?", frequency: 5, lastAsked: "3 hours ago", priority: "low" },
        { id: 6, query: "How to add team members?", frequency: 4, lastAsked: "5 hours ago", priority: "low" },
    ];

    // Training popup state
    const [trainingPopup, setTrainingPopup] = React.useState<{ query: string; id: number } | null>(null);
    const [trainingAnswer, setTrainingAnswer] = React.useState("");

    const maxHeatmapValue = Math.max(...heatmapData.flatMap(d => d.hours));

    const sections = [
        { id: "value", icon: DollarSign, label: "Value", ref: valueRef },
        { id: "performance", icon: Zap, label: "Performance", ref: performanceRef },
        { id: "sentiment", icon: Brain, label: "Sentiment", ref: sentimentRef },
        { id: "traffic", icon: Activity, label: "Traffic", ref: trafficRef },
    ];

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'}`}>
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
                        {sidebarNavItems.map((item) => {
                            // Special handling for My Agents with submenu
                            if (item.label === "My Agents") {
                                return (
                                    <div key={item.label}>
                                        {/* My Agents Main Button */}
                                        <button
                                            onClick={() => {
                                                if (sidebarOpen) {
                                                    setMyAgentsOpen(!myAgentsOpen);
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
                                                    {myAgentsOpen ? (
                                                        <ChevronDown className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="h-4 w-4" />
                                                    )}
                                                </>
                                            )}
                                        </button>

                                        {/* Submenu - Agent List */}
                                        {sidebarOpen && myAgentsOpen && (
                                            <div className="ml-3 mt-1 space-y-1 border-l-2 border-zinc-200 pl-3 dark:border-zinc-800">
                                                {userAgents.map((agent) => (
                                                    <button
                                                        key={agent.id}
                                                        onClick={() => router.push(`/dashboard/analytics/${agent.id}`)}
                                                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${agent.active
                                                                ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300"
                                                                : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                                                            }`}
                                                    >
                                                        <div
                                                            className="h-2 w-2 shrink-0 rounded-full"
                                                            style={{ backgroundColor: agent.theme }}
                                                        />
                                                        <span className="truncate">{agent.name}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Regular nav items
                            return (
                                <button
                                    key={item.label}
                                    onClick={() => router.push(item.href)}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${item.active
                                            ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                                            : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                        }`}
                                >
                                    <item.icon className="h-5 w-5 shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </button>
                            );
                        })}
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

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg"
                            style={{
                                backgroundColor: agent.theme,
                                boxShadow: `0 4px 12px -2px ${agent.theme}40`,
                            }}
                        >
                            <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                {agent.name}
                            </h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Analytics Dashboard</p>
                        </div>
                    </div>

                    <ThemeToggle />
                </header>

                {/* Sticky Section Navigation */}
                <div className="sticky top-16 z-20 border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex gap-1">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.ref)}
                                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-zinc-600 transition-all hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                            >
                                <section.icon className="h-4 w-4" />
                                {section.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content - All Sections */}
                <div className="p-6 space-y-12">
                    {/* Value Section */}
                    <div ref={valueRef} className="scroll-mt-24">
                        <div className="space-y-6">
                            <div>
                                <h2 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    📊 Key Metrics
                                </h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Track your agent's performance at a glance
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                {/* Total Traffic */}
                                <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                            <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
                                            <ArrowUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                12%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                            1,240
                                        </p>
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            💬 Total Traffic
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                            1,107 chats last month
                                        </p>
                                    </div>
                                </div>

                                {/* Automation Rate */}
                                <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
                                            <Bot className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
                                            <ArrowUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                5%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                            85%
                                        </p>
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            🤖 Automation Rate
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                            80% solved last month
                                        </p>
                                    </div>
                                </div>

                                {/* Retention Success */}
                                <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                            <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 dark:bg-red-900/20">
                                            <ArrowDown className="h-3 w-3 text-red-600 dark:text-red-400" />
                                            <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                                3%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                            60%
                                        </p>
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            🛡️ Retention Success
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                            63% saved last month
                                        </p>
                                    </div>
                                </div>

                                {/* Avg Speed */}
                                <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                            <Timer className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
                                            <ArrowDown className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                18s
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                            2m 15s
                                        </p>
                                        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            ⏱️ Avg. Speed
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                            2m 33s last month
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Performance Section */}
                    <div ref={performanceRef} className="scroll-mt-24">
                        <div className="space-y-6">
                            <div>
                                <h2 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    ⚡ Action Performance
                                </h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Your bot doesn't just chat—it takes action
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Actions Triggered */}
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                            Actions Triggered
                                        </h3>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                                            <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                        </div>
                                    </div>
                                    <p className="text-5xl font-bold text-zinc-900 dark:text-zinc-100">150</p>
                                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                                        Total skills used
                                    </p>

                                    <div className="mt-6 space-y-3">
                                        {actionBreakdown.map((action) => (
                                            <div key={action.name}>
                                                <div className="mb-1.5 flex items-center justify-between text-sm">
                                                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                                        {action.name}
                                                    </span>
                                                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                                        {action.value}%
                                                    </span>
                                                </div>
                                                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${action.value}%`,
                                                            backgroundColor: action.color,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Success vs Failure */}
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <div className="mb-4 flex items-center justify-between">
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                            Success vs Failure
                                        </h3>
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="rounded-xl bg-emerald-50 p-5 dark:bg-emerald-900/20">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-sm font-medium text-emerald-900 dark:text-emerald-300">
                                                        Success
                                                    </span>
                                                </div>
                                                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                                                    95%
                                                </span>
                                            </div>
                                        </div>

                                        <button className="w-full rounded-xl bg-red-50 p-5 text-left transition-all hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                                    <span className="text-sm font-medium text-red-900 dark:text-red-300">
                                                        Failed
                                                    </span>
                                                </div>
                                                <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                                                    5%
                                                </span>
                                            </div>
                                            <p className="mt-3 text-xs text-red-700 dark:text-red-400">
                                                Click to view failed actions →
                                            </p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sentiment Section */}
                    <div ref={sentimentRef} className="scroll-mt-24">
                        <div className="space-y-6">
                            <div>
                                <h2 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    🧠 Sentiment Analysis
                                </h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Are customers happy or frustrated?
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* User Sentiment with CSAT Score */}
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <h3 className="mb-5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        User Sentiment
                                    </h3>

                                    {/* Sentiment Breakdown */}
                                    <div className="mb-6 space-y-4">
                                        {sentimentData.map((sentiment) => (
                                            <div key={sentiment.label}>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl">{sentiment.emoji}</span>
                                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                            {sentiment.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                                        {sentiment.value}%
                                                    </span>
                                                </div>
                                                <div className="h-3 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                    <div
                                                        className="h-full rounded-full transition-all"
                                                        style={{
                                                            width: `${sentiment.value}%`,
                                                            backgroundColor: sentiment.color,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Divider */}
                                    <div className="my-6 h-px bg-zinc-200 dark:bg-zinc-800" />

                                    {/* CSAT Score Section */}
                                    <div>
                                        <h4 className="mb-4 text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                            CSAT Score 😊
                                        </h4>

                                        {/* Rating Display */}
                                        <div className="mb-4 flex items-center justify-between">
                                            <div>
                                                <div className="mb-1 flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                                                        4.6
                                                    </span>
                                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        / 5.0
                                                    </span>
                                                </div>
                                                {/* Star Rating */}
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`h-5 w-5 ${star <= 4
                                                                ? "fill-amber-400 text-amber-400"
                                                                : star === 5
                                                                    ? "fill-amber-400/60 text-amber-400/60"
                                                                    : "text-zinc-300 dark:text-zinc-700"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Trend Indicator */}
                                            <div className="flex flex-col items-end gap-1">
                                                <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 dark:bg-emerald-900/20">
                                                    <ArrowUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                        +0.3
                                                    </span>
                                                </div>
                                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    vs last month
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                                                <div className="text-xs text-zinc-600 dark:text-zinc-400">Total Ratings</div>
                                                <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">1,240</div>
                                            </div>
                                            <div className="rounded-lg bg-zinc-50 p-3 dark:bg-zinc-800/50">
                                                <div className="text-xs text-zinc-600 dark:text-zinc-400">Response Rate</div>
                                                <div className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-100">87%</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Top Topics */}
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <h3 className="mb-5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        Top User Topics
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {topTopics.map((topic) => {
                                            const maxCount = Math.max(...topTopics.map(t => t.count));
                                            const size = 12 + (topic.count / maxCount) * 12;
                                            return (
                                                <div
                                                    key={topic.word}
                                                    className="rounded-lg bg-violet-100 px-3 py-2 dark:bg-violet-900/30"
                                                    style={{ fontSize: `${size}px` }}
                                                >
                                                    <span className="font-bold text-violet-700 dark:text-violet-300">
                                                        {topic.word}
                                                    </span>
                                                    <span className="ml-1.5 text-[10px] text-violet-500 dark:text-violet-400">
                                                        {topic.count}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-5 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                                        <p className="text-xs text-blue-700 dark:text-blue-300">
                                            💡 Use these insights to improve your Knowledge Base
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Traffic Section */}
                    <div ref={trafficRef} className="scroll-mt-24">
                        <div className="space-y-6">
                            <div>
                                <h2 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    🚦 Traffic & Usage
                                </h2>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    When and where do users engage?
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                {/* Heatmap */}
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <h3 className="mb-5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        <Calendar className="mr-2 inline h-5 w-5" />
                                        Busy Hours Heatmap
                                    </h3>
                                    <div className="overflow-x-auto">
                                        <div className="min-w-[600px]">
                                            <div className="mb-1 flex">
                                                <div className="w-12" />
                                                {Array.from({ length: 24 }, (_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex-1 text-center text-[9px] text-zinc-500 dark:text-zinc-400"
                                                    >
                                                        {i}
                                                    </div>
                                                ))}
                                            </div>
                                            {heatmapData.map((dayData) => (
                                                <div key={dayData.day} className="mb-1 flex items-center">
                                                    <div className="w-12 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                                                        {dayData.day}
                                                    </div>
                                                    {dayData.hours.map((value, hourIndex) => {
                                                        const intensity = value / maxHeatmapValue;
                                                        return (
                                                            <div
                                                                key={hourIndex}
                                                                className="flex-1 aspect-square rounded-sm transition-all hover:scale-110"
                                                                style={{
                                                                    backgroundColor: `rgba(124, 58, 237, ${intensity * 0.8})`,
                                                                }}
                                                                title={`${dayData.day} ${hourIndex}:00 - ${value} chats`}
                                                            />
                                                        );
                                                    })}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="mt-4 rounded-lg bg-violet-50 p-3 dark:bg-violet-900/20">
                                        <p className="text-xs text-violet-700 dark:text-violet-300">
                                            💡 Peak hours: Monday 9-11 AM
                                        </p>
                                    </div>
                                </div>

                                {/* Country Map */}
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <h3 className="mb-5 text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        <MapPin className="mr-2 inline h-5 w-5" />
                                        Traffic by Country
                                    </h3>
                                    <div className="space-y-3">
                                        {countryData.map((country) => {
                                            const maxCount = Math.max(...countryData.map(c => c.count));
                                            const percentage = (country.count / maxCount) * 100;
                                            return (
                                                <div key={country.code}>
                                                    <div className="mb-1.5 flex items-center justify-between text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-[10px] text-zinc-500 dark:text-zinc-400">
                                                                {country.code}
                                                            </span>
                                                            <span className="font-medium text-zinc-700 dark:text-zinc-300">
                                                                {country.country}
                                                            </span>
                                                        </div>
                                                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                                                            {country.count}
                                                        </span>
                                                    </div>
                                                    <div className="h-2.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                        <div
                                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all"
                                                            style={{ width: `${percentage}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Knowledge Training Center Section */}
                    <div className="scroll-mt-24">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                        🧠 Knowledge Training Center
                                    </h2>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Train your bot on missed queries to improve accuracy
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2 dark:bg-violet-900/20">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-semibold text-violet-900 dark:text-violet-300">
                                        {knowledgeGaps.length} gaps detected
                                    </span>
                                </div>
                            </div>

                            {/* Action Table */}
                            <div className="overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                {/* Table Header */}
                                <div className="border-b border-zinc-200 bg-zinc-50/50 px-6 py-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-5">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                Missed Query
                                            </span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                Frequency
                                            </span>
                                        </div>
                                        <div className="col-span-3">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                Last Asked
                                            </span>
                                        </div>
                                        <div className="col-span-2 text-right">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                                Action
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Table Body */}
                                <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {knowledgeGaps.map((gap) => (
                                        <div
                                            key={gap.id}
                                            className="grid grid-cols-12 gap-4 px-6 py-4 transition-all hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                                        >
                                            {/* Query */}
                                            <div className="col-span-5 flex items-center">
                                                <div className="flex items-start gap-3">
                                                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/30">
                                                        <MessageSquare className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                                                    </div>
                                                    <span className="text-sm font-medium leading-relaxed text-zinc-900 dark:text-zinc-100">
                                                        {gap.query}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Frequency */}
                                            <div className="col-span-2 flex items-center">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                                        {gap.frequency}
                                                    </span>
                                                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                                        Times
                                                    </span>
                                                    {gap.frequency >= 10 && (
                                                        <Flame className="h-4 w-4 text-orange-500" />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Last Asked */}
                                            <div className="col-span-3 flex items-center">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-zinc-400" />
                                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                        {gap.lastAsked}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="col-span-2 flex items-center justify-end">
                                                <button
                                                    onClick={() => {
                                                        setTrainingPopup({ query: gap.query, id: gap.id });
                                                        setTrainingAnswer("");
                                                    }}
                                                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Train
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Empty State (if no gaps) */}
                                {knowledgeGaps.length === 0 && (
                                    <div className="px-6 py-12 text-center">
                                        <BookOpen className="mx-auto mb-3 h-12 w-12 text-zinc-300 dark:text-zinc-700" />
                                        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                            No knowledge gaps detected. Your bot is well trained! 🎉
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Training Popup Modal */}
                {trainingPopup && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
                            {/* Close Button */}
                            <button
                                onClick={() => {
                                    setTrainingPopup(null);
                                    setTrainingAnswer("");
                                }}
                                className="absolute right-4 top-4 rounded-lg p-2 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
                            >
                                <X className="h-5 w-5" />
                            </button>

                            {/* Modal Header */}
                            <div className="mb-6">
                                <div className="mb-2 flex items-center gap-2">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/30">
                                        <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                                        Train on New Query
                                    </h3>
                                </div>
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                    Provide an answer to help your bot learn
                                </p>
                            </div>

                            {/* Query Display */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    User Asked:
                                </label>
                                <div className="rounded-xl border-2 border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/50">
                                    <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                                        "{trainingPopup.query}"
                                    </p>
                                </div>
                            </div>

                            {/* Answer Input */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                    Bot Answer:
                                </label>
                                <textarea
                                    value={trainingAnswer}
                                    onChange={(e) => setTrainingAnswer(e.target.value)}
                                    placeholder="Type the answer here..."
                                    rows={6}
                                    className="w-full resize-none rounded-xl border-2 border-zinc-200 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-600 dark:focus:ring-violet-900/30"
                                />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setTrainingPopup(null);
                                        setTrainingAnswer("");
                                    }}
                                    className="rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        // Here you would save the training data
                                        console.log("Training saved:", {
                                            query: trainingPopup.query,
                                            answer: trainingAnswer,
                                        });
                                        setTrainingPopup(null);
                                        setTrainingAnswer("");
                                    }}
                                    disabled={!trainingAnswer.trim()}
                                    className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Save & Learn
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
