"use client";

import * as React from "react";
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
    Menu,
    ChevronDown,
    ChevronRight,
    Zap,
    Database,
    Shield,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";

const sidebarBottomItems = [
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
    { icon: LogOut, label: "Logout", href: "/logout" },
];

// Nav items — agent-specific ones need agentId in the route
const navItems = [
    { key: "agents", icon: Bot, label: "My Agents", href: "/dashboard", agentRoute: false, hasSubmenu: true },
    { key: "analytics", icon: BarChart3, label: "Analytics", href: "/dashboard/analytics", agentRoute: true },
    { key: "conversations", icon: MessageSquare, label: "Conversations", href: "/dashboard/conversations", agentRoute: true },
    { key: "leads", icon: Users, label: "Leads", href: "/dashboard/leads", agentRoute: true },
    { key: "knowledge", icon: Database, label: "Knowledge Base Hub", href: "/dashboard/knowledge", agentRoute: true },
    { key: "integrations", icon: Zap, label: "Integration Hub", href: "/dashboard/integrations", agentRoute: true },
    { key: "churnwall", icon: Shield, label: "Smart ChurnWall", href: "/dashboard/churnwall", agentRoute: true, badge: "BETA" },
    { key: "team", icon: Users, label: "Team", href: "/dashboard/team", agentRoute: true },
    { key: "billing", icon: CreditCard, label: "Billing", href: "/dashboard/billing", agentRoute: false },
    { key: "settings", icon: Settings, label: "Settings", href: "/dashboard/settings", agentRoute: false },
];

interface SidebarProps {
    /** Which nav item is currently active, e.g. "settings", "billing", "analytics" */
    activePage: string;
    /** Current agent ID — used for agent-specific routes */
    agentId?: string;
    /** Controlled open state (optional) */
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

interface AgentInfo {
    id: string;
    name: string;
    primaryColor: string;
    is_published: boolean;
    email?: string;
}

export function Sidebar({ activePage, agentId, open, onOpenChange }: SidebarProps) {
    const router = useRouter();
    const [internalOpen, setInternalOpen] = React.useState(true);
    const [myAgentsOpen, setMyAgentsOpen] = React.useState(true);
    const [agentInfo, setAgentInfo] = React.useState<AgentInfo | null>(null);

    const sidebarOpen = open !== undefined ? open : internalOpen;
    const setSidebarOpen = (v: boolean) => {
        setInternalOpen(v);
        onOpenChange?.(v);
    };

    // ── Load real agent info from Supabase ──────────────────────────────────
    React.useEffect(() => {
        async function loadAgentInfo() {
            try {
                const supabase = getSupabaseClient();
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                // Use the authenticated API endpoint to avoid RLS issues
                const res = await fetch("/api/bot/update-ui", {
                    headers: { Authorization: `Bearer ${session.access_token}` },
                });
                if (!res.ok) return;

                const data = await res.json();
                if (!data.success) return;

                const uiConfig = data.uiConfig;
                const agentName = uiConfig?.agentName ?? "My AI Agent";
                const primaryColor = uiConfig?.primaryColor ?? "#7c3aed";

                setAgentInfo({
                    id: session.user.id,
                    name: agentName,
                    primaryColor,
                    is_published: data.is_published ?? false,
                    email: session.user.email,
                });
            } catch {
                // silently ignore
            }
        }
        loadAgentInfo();
    }, []);

    // Use the real user ID as the agent ID
    const resolvedAgentId = agentId ?? agentInfo?.id ?? "me";

    const navigate = (item: typeof navItems[0]) => {
        if (item.hasSubmenu) {
            if (sidebarOpen) {
                setMyAgentsOpen((v) => !v);
            } else {
                router.push(item.href);
            }
            return;
        }
        if (item.agentRoute) {
            router.push(`${item.href}/${resolvedAgentId}`);
        } else {
            router.push(item.href);
        }
    };

    // Derive initials from email
    const initials = agentInfo?.email
        ? agentInfo.email.slice(0, 2).toUpperCase()
        : "AI";

    return (
        <aside
            className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? "w-64" : "w-20"
                }`}
        >
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
                    {navItems.map((item) => {
                        const isActive = activePage === item.key;

                        if (item.hasSubmenu) {
                            return (
                                <div key={item.key}>
                                    <button
                                        onClick={() => navigate(item)}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
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

                                    {/* Agent submenu — shows real agent */}
                                    {sidebarOpen && myAgentsOpen && (
                                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-zinc-200 pl-3 dark:border-zinc-800">
                                            {agentInfo ? (
                                                <button
                                                    onClick={() => router.push(`/dashboard/configure/${agentInfo.id}`)}
                                                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${agentInfo.id === resolvedAgentId
                                                        ? "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300"
                                                        : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                                                        }`}
                                                >
                                                    <div
                                                        className="h-2 w-2 shrink-0 rounded-full"
                                                        style={{ backgroundColor: agentInfo.primaryColor }}
                                                    />
                                                    <span className="truncate">{agentInfo.name}</span>
                                                    {agentInfo.is_published && (
                                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                                                    )}
                                                </button>
                                            ) : (
                                                <div className="px-3 py-2 text-xs text-zinc-400 italic">
                                                    No agent yet
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return (
                            <button
                                key={item.key}
                                onClick={() => navigate(item)}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${isActive
                                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                <item.icon className="h-5 w-5 shrink-0" />
                                {sidebarOpen && (
                                    <>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.badge && (
                                            <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                                                {item.badge}
                                            </span>
                                        )}
                                    </>
                                )}
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    {agentInfo?.email ?? "Loading…"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className={`h-1.5 w-1.5 rounded-full ${agentInfo?.is_published ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"}`} />
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {agentInfo?.is_published ? "Active Agent" : "Setup in Progress"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}

/**
 * Hook to sync sidebar open state with margin on the main content.
 * Usage: const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
 */
export function useSidebarState(defaultOpen = true) {
    const [sidebarOpen, setSidebarOpen] = React.useState(defaultOpen);
    const mainClass = `flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-20"}`;
    return { sidebarOpen, setSidebarOpen, mainClass };
}
