"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
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
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Copy,
    ExternalLink,
    TrendingUp,
    Clock,
    Zap,
    Globe,
    ChevronRight,
    Search,
    Bell,
    Menu,
} from "lucide-react";

// Dummy agent data
const deployedAgents = [
    {
        id: "wn_abc123xyz",
        name: "Customer Support Bot",
        description: "Handles customer inquiries and support tickets 24/7",
        status: "active",
        conversations: 1243,
        avgResponseTime: "1.2s",
        satisfaction: 94,
        lastActive: "2 mins ago",
        model: "Claude 3.5 Sonnet",
        theme: "#7c3aed",
        createdAt: "Jan 15, 2026",
    },
    {
        id: "wn_def456uvw",
        name: "Sales Assistant",
        description: "Qualifies leads and schedules demo calls",
        status: "active",
        conversations: 856,
        avgResponseTime: "0.8s",
        satisfaction: 91,
        lastActive: "5 mins ago",
        model: "GPT-4o",
        theme: "#3b82f6",
        createdAt: "Jan 28, 2026",
    },
    {
        id: "wn_ghi789rst",
        name: "Product Expert",
        description: "Answers technical questions about products",
        status: "paused",
        conversations: 432,
        avgResponseTime: "1.5s",
        satisfaction: 88,
        lastActive: "1 hour ago",
        model: "Gemini 2.0 Flash",
        theme: "#10b981",
        createdAt: "Feb 1, 2026",
    },
];

// Sidebar navigation items
const sidebarNavItems = [
    { icon: Bot, label: "My Agents", href: "/dashboard", active: true },
    { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics", active: false },
    { icon: MessageSquare, label: "Conversations", href: "/dashboard/conversations", active: false },
    { icon: Users, label: "Team", href: "/dashboard/team", active: false },
    { icon: CreditCard, label: "Billing", href: "/dashboard/billing", active: false },
    { icon: Settings, label: "Settings", href: "/dashboard/settings", active: false },
];

const sidebarBottomItems = [
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: LogOut, label: "Logout", href: "/logout" },
];

export default function DashboardPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [sidebarOpen, setSidebarOpen] = React.useState(true);
    const [showAgentMenu, setShowAgentMenu] = React.useState<string | null>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

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
                        {sidebarNavItems.map((item) => (
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

            {/* Main Content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            My Agents
                        </h1>
                        <div className="hidden items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 md:flex">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            {deployedAgents.filter(a => a.status === "active").length} Active
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                placeholder="Search agents..."
                                className="h-10 w-64 rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                            />
                        </div>

                        {/* Notifications */}
                        <button className="relative rounded-xl bg-zinc-100 p-2.5 text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                3
                            </span>
                        </button>

                        <ThemeToggle />

                        {/* Create New Agent */}
                        <Button
                            onClick={() => router.push("/onboarding")}
                            className="h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Agent
                        </Button>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-6">{/* Removed gridClass */}
                    {/* Section Header */}
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                Deployed Agents
                            </h2>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                Manage and monitor your AI agents
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                                Filter
                            </button>
                            <button className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700">
                                Sort
                            </button>
                        </div>
                    </div>

                    {/* Agent Cards Grid */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {deployedAgents.map((agent) => (
                            <div
                                key={agent.id}
                                onClick={() => router.push(`/dashboard/configure/${agent.id}`)}
                                className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-violet-500/10 dark:border-zinc-800/50 dark:bg-zinc-900/80 cursor-pointer"
                            >
                                {/* Card Header */}
                                <div className="relative p-4">
                                    {/* Status Badge */}
                                    <div className="absolute right-3 top-3">
                                        <div className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${agent.status === "active"
                                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                            : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                            }`}>
                                            <div className={`h-1 w-1 rounded-full ${agent.status === "active" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                                                }`} />
                                            {agent.status === "active" ? "Active" : "Paused"}
                                        </div>
                                    </div>

                                    {/* Agent Avatar */}
                                    <div
                                        className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl shadow-lg"
                                        style={{
                                            backgroundColor: agent.theme,
                                            boxShadow: `0 8px 20px -5px ${agent.theme}40`
                                        }}
                                    >
                                        <Bot className="h-5 w-5 text-white" />
                                    </div>

                                    {/* Agent Info */}
                                    <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                        {agent.name}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
                                        {agent.description}
                                    </p>

                                    {/* Model Badge */}
                                    <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                                        <Sparkles className="h-2.5 w-2.5" />
                                        {agent.model}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-px border-t border-zinc-200 bg-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                    <div className="bg-white p-2 text-center dark:bg-zinc-900">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                            {agent.conversations.toLocaleString()}
                                        </p>
                                        <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Chats
                                        </p>
                                    </div>
                                    <div className="bg-white p-2 text-center dark:bg-zinc-900">
                                        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                            {agent.avgResponseTime}
                                        </p>
                                        <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Avg Time
                                        </p>
                                    </div>
                                    <div className="bg-white p-2 text-center dark:bg-zinc-900">
                                        <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                                            {agent.satisfaction}%
                                        </p>
                                        <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Rating
                                        </p>
                                    </div>
                                </div>

                                {/* Card Footer */}
                                <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
                                    <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                                        <Clock className="h-2.5 w-2.5" />
                                        {agent.lastActive}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-0.5">
                                        <button className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-400">
                                            <Eye className="h-3.5 w-3.5" />
                                        </button>
                                        <button className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-400">
                                            <Edit className="h-3.5 w-3.5" />
                                        </button>
                                        <button className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-400">
                                            <ExternalLink className="h-3.5 w-3.5" />
                                        </button>
                                        <div className="relative">
                                            <button
                                                onClick={() => setShowAgentMenu(showAgentMenu === agent.id ? null : agent.id)}
                                                className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
                                            >
                                                <MoreVertical className="h-3.5 w-3.5" />
                                            </button>

                                            {/* Dropdown Menu */}
                                            {showAgentMenu === agent.id && (
                                                <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-zinc-200 bg-white py-1 shadow-xl dark:border-zinc-700 dark:bg-zinc-800">
                                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700">
                                                        <Copy className="h-4 w-4" />
                                                        Copy Embed Code
                                                    </button>
                                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-700">
                                                        <Globe className="h-4 w-4" />
                                                        Share Public Link
                                                    </button>
                                                    <hr className="my-1 border-zinc-200 dark:border-zinc-700" />
                                                    <button className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20">
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete Agent
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Gradient Border Effect */}
                                <div
                                    className="absolute inset-0 rounded-2xl opacity-20 transition-opacity group-hover:opacity-100 pointer-events-none"
                                    style={{
                                        background: `linear-gradient(135deg, ${agent.theme}20, transparent)`,
                                    }}
                                />
                            </div>
                        ))}

                        {/* Create New Agent Card */}
                        <button
                            onClick={() => router.push("/onboarding")}
                            className="group flex min-h-[240px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-300 bg-white/50 text-zinc-400 transition-all hover:border-violet-400 hover:bg-violet-50/50 hover:text-violet-600 dark:border-zinc-700 dark:bg-zinc-900/50 dark:hover:border-violet-500 dark:hover:bg-violet-900/10 dark:hover:text-violet-400"
                        >
                            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-dashed border-current transition-all group-hover:border-solid group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="text-base font-semibold">Create New Agent</span>
                            <span className="mt-0.5 text-xs opacity-60">Start building your AI assistant</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Click outside to close menu */}
            {showAgentMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowAgentMenu(null)}
                />
            )}
        </div>
    );
}
