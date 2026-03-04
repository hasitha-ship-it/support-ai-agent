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

// All agents (shared dummy data — replace with real data later)
const userAgents = [
    { id: "wn_abc123xyz", name: "Customer Support Bot", theme: "#7c3aed", active: true },
    { id: "wn_def456uvw", name: "Sales Assistant", theme: "#3b82f6", active: false },
    { id: "wn_ghi789rst", name: "HR Helper", theme: "#10b981", active: false },
];

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

export function Sidebar({ activePage, agentId, open, onOpenChange }: SidebarProps) {
    const router = useRouter();
    const [internalOpen, setInternalOpen] = React.useState(true);
    const [myAgentsOpen, setMyAgentsOpen] = React.useState(true);

    const sidebarOpen = open !== undefined ? open : internalOpen;
    const setSidebarOpen = (v: boolean) => {
        setInternalOpen(v);
        onOpenChange?.(v);
    };

    // Fallback agentId — use first agent if none provided
    const resolvedAgentId = agentId ?? userAgents[0].id;

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

                                    {/* Agent submenu */}
                                    {sidebarOpen && myAgentsOpen && (
                                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-zinc-200 pl-3 dark:border-zinc-800">
                                            {userAgents.map((agent) => (
                                                <button
                                                    key={agent.id}
                                                    onClick={() =>
                                                        router.push(`/dashboard/configure/${agent.id}`)
                                                    }
                                                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${agent.id === resolvedAgentId
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-bold text-white">
                                JD
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                    John Doe
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">Pro Plan</div>
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
