"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Sidebar, useSidebarState } from "@/components/sidebar";
import { createClient } from "@supabase/supabase-js";
import { ChatWidget } from "@/components/ChatWidget";
import {
    Plus,
    Eye,
    Edit,
    ExternalLink,
    Clock,
    Search,
    Bell,
    Bot,
    Sparkles,
    MessageCircle,
} from "lucide-react";


// Shape of a live agent card derived from profiles
interface LiveAgent {
    id: string;
    name: string;
    primaryColor: string;
    avatar: string;
    is_published: boolean;
    publishedAt: string;
}


export default function DashboardPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [publishedAgent, setPublishedAgent] = React.useState<LiveAgent | null>(null);
    const [agentsLoading, setAgentsLoading] = React.useState(true);

    React.useEffect(() => {
        setMounted(true);
        async function loadAgent() {
            try {
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("ui_config, is_published, created_at")
                    .eq("id", session.user.id)
                    .single();

                if (profile?.is_published && profile?.ui_config) {
                    setPublishedAgent({
                        id: session.user.id,
                        name: profile.ui_config.agentName ?? "My AI Agent",
                        primaryColor: profile.ui_config.primaryColor ?? "#7c3aed",
                        avatar: profile.ui_config.avatar ?? "🤖",
                        is_published: true,
                        publishedAt: profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "",
                    });
                }
            } catch {
                // silently fail
            } finally {
                setAgentsLoading(false);
            }
        }
        loadAgent();
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="agents" open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <main className={mainClass}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                            My Agents
                        </h1>
                        {publishedAgent && (
                            <div className="hidden items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 md:flex">
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                1 Active
                            </div>
                        )}
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

                {/* Dashboard Content — Two-column: agent cards + live chat */}
                <div className="flex h-[calc(100vh-4rem)] gap-0">

                    {/* LEFT: Agent Cards */}
                    <div className="flex-1 overflow-y-auto p-6">
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
                            {/* Loading state */}
                            {agentsLoading && (
                                <div className="col-span-2 flex h-48 items-center justify-center rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Loading agents…
                                    </div>
                                </div>
                            )}

                            {/* Published Agent Card */}
                            {!agentsLoading && publishedAgent && (
                                <div
                                    key={publishedAgent.id}
                                    onClick={() => router.push(`/dashboard/configure/${publishedAgent.id}`)}
                                    className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 bg-white/80 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-violet-500/10 dark:border-zinc-800/50 dark:bg-zinc-900/80 cursor-pointer"
                                >
                                    {/* Card Header */}
                                    <div className="relative p-4">
                                        {/* Status Badge */}
                                        <div className="absolute right-3 top-3">
                                            <div className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                                Active
                                            </div>
                                        </div>

                                        {/* Agent Avatar */}
                                        <div
                                            className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl shadow-lg text-2xl overflow-hidden"
                                            style={{
                                                backgroundColor: publishedAgent.primaryColor,
                                                boxShadow: `0 8px 20px -5px ${publishedAgent.primaryColor}40`
                                            }}
                                        >
                                            {publishedAgent.avatar.startsWith("/") ? (
                                                <img src={publishedAgent.avatar} alt={publishedAgent.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span>{publishedAgent.avatar}</span>
                                            )}
                                        </div>

                                        {/* Agent Info */}
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                            {publishedAgent.name}
                                        </h3>
                                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            Your published AI support agent
                                        </p>

                                        {/* Published badge */}
                                        <div className="mt-2 inline-flex items-center gap-1 rounded-lg bg-violet-100 px-2 py-0.5 text-[10px] font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                                            <Sparkles className="h-2.5 w-2.5" />
                                            Published {publishedAgent.publishedAt}
                                        </div>
                                    </div>

                                    {/* Stats placeholder */}
                                    <div className="grid grid-cols-3 gap-px border-t border-zinc-200 bg-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-800/50">
                                        <div className="bg-white p-2 text-center dark:bg-zinc-900">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">0</p>
                                            <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Chats</p>
                                        </div>
                                        <div className="bg-white p-2 text-center dark:bg-zinc-900">
                                            <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">—</p>
                                            <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Avg Time</p>
                                        </div>
                                        <div className="bg-white p-2 text-center dark:bg-zinc-900">
                                            <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">—</p>
                                            <p className="text-[9px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Rating</p>
                                        </div>
                                    </div>

                                    {/* Card Footer */}
                                    <div className="flex items-center justify-between border-t border-zinc-200 px-4 py-2 dark:border-zinc-800">
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                                            <Clock className="h-2.5 w-2.5" />
                                            Just now
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); router.push("/deploy"); }}
                                                className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
                                                title="View Embed Code"
                                            >
                                                <ExternalLink className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); router.push("/ui-setup"); }}
                                                className="rounded-lg p-1.5 text-zinc-500 transition-all hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800 dark:hover:text-violet-400"
                                                title="Edit Agent"
                                            >
                                                <Edit className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Gradient Border Effect */}
                                    <div
                                        className="absolute inset-0 rounded-2xl opacity-20 transition-opacity group-hover:opacity-100 pointer-events-none"
                                        style={{
                                            background: `linear-gradient(135deg, ${publishedAgent.primaryColor}20, transparent)`,
                                        }}
                                    />
                                </div>
                            )}

                            {/* Empty state when no published agent */}
                            {!agentsLoading && !publishedAgent && (
                                <div className="col-span-2 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 bg-white/50 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900/50">
                                    <Bot className="mb-3 h-10 w-10 text-zinc-300 dark:text-zinc-600" />
                                    <p className="text-sm font-semibold text-zinc-600 dark:text-zinc-400">No published agents yet</p>
                                    <p className="mt-1 text-xs text-zinc-400">Complete the setup and publish your agent to see it here</p>
                                    <button
                                        onClick={() => router.push("/onboarding")}
                                        className="mt-4 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                                    >
                                        Create Agent
                                    </button>
                                </div>
                            )}

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
                    {/* END LEFT */}

                    {/* RIGHT: Live Chat Panel */}
                    <div className="w-[380px] shrink-0 border-l border-zinc-200 dark:border-zinc-800 flex flex-col">
                        {/* Panel Header */}
                        <div className="flex items-center gap-2 border-b border-zinc-200 bg-white/80 px-4 py-3 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80 shrink-0">
                            <MessageCircle className="h-4 w-4 text-violet-500" />
                            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Live Preview</span>
                            <span className="ml-auto flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                Live
                            </span>
                        </div>
                        {/* Chat widget fills remaining height */}
                        <div className="flex-1 overflow-hidden">
                            <ChatWidget className="h-full rounded-none border-0 shadow-none" />
                        </div>
                    </div>
                    {/* END RIGHT */}

                </div>
                {/* END Two-column layout */}
            </main>
        </div>
    );
}
