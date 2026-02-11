"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    Search,
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
} from "lucide-react";

// Types
interface Action {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    toolIcon: React.ReactNode;
}

interface ActionCategory {
    id: string;
    name: string;
    icon: string;
    tool: string;
    actions: Action[];
}

// Compact Toggle Switch Component
function ActionToggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
    return (
        <button
            onClick={onChange}
            className={`relative h-5 w-9 rounded-full transition-all duration-300 ${enabled
                ? "bg-violet-600 shadow-md shadow-violet-500/30"
                : "bg-zinc-200 dark:bg-zinc-700"
                }`}
        >
            <div
                className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${enabled ? "left-[18px]" : "left-0.5"
                    }`}
            />
        </button>
    );
}

export default function ActionStorePage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = React.useState("");
    const [selectedCategory, setSelectedCategory] = React.useState("all");
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    // Action Data
    const [actionCategories, setActionCategories] = React.useState<ActionCategory[]>([
        {
            id: "stripe",
            name: "Stripe",
            icon: "💳",
            tool: "Stripe (Billing)",
            actions: [
                {
                    id: "stripe-1",
                    name: "Process Refund",
                    description: "Initiate full refund for transaction",
                    enabled: true,
                    toolIcon: <RefreshCw className="h-4 w-4" />,
                },
                {
                    id: "stripe-2",
                    name: "Check Subscription Status",
                    description: "Verify active plan tier",
                    enabled: true,
                    toolIcon: <Shield className="h-4 w-4" />,
                },
                {
                    id: "stripe-3",
                    name: "Cancel Subscription",
                    description: "Terminate billing cycle immediately",
                    enabled: false,
                    toolIcon: <X className="h-4 w-4" />,
                },
                {
                    id: "stripe-4",
                    name: "Update Payment Method",
                    description: "Send card update link to user",
                    enabled: false,
                    toolIcon: <CreditCard className="h-4 w-4" />,
                },
                {
                    id: "stripe-5",
                    name: "Send Invoice Email",
                    description: "Resend last month's invoice",
                    enabled: false,
                    toolIcon: <Mail className="h-4 w-4" />,
                },
                {
                    id: "stripe-6",
                    name: "Check Past Transactions",
                    description: "List recent charges and payments",
                    enabled: false,
                    toolIcon: <Clock className="h-4 w-4" />,
                },
                {
                    id: "stripe-7",
                    name: "Create Payment Link",
                    description: "Generate one-time checkout URL",
                    enabled: false,
                    toolIcon: <Link className="h-4 w-4" />,
                },
            ],
        },
        {
            id: "calendly",
            name: "Calendly",
            icon: "📅",
            tool: "Calendly (Sales)",
            actions: [
                {
                    id: "calendly-1",
                    name: "Book Meeting",
                    description: "Schedule new appointment",
                    enabled: true,
                    toolIcon: <CalendarCheck className="h-4 w-4" />,
                },
                {
                    id: "calendly-2",
                    name: "Check Availability",
                    description: "Find open slots in calendar",
                    enabled: true,
                    toolIcon: <Clock className="h-4 w-4" />,
                },
                {
                    id: "calendly-3",
                    name: "Reschedule Meeting",
                    description: "Move event to new time",
                    enabled: true,
                    toolIcon: <RefreshCcw className="h-4 w-4" />,
                },
                {
                    id: "calendly-4",
                    name: "Cancel Meeting",
                    description: "Remove event from calendar",
                    enabled: false,
                    toolIcon: <X className="h-4 w-4" />,
                },
                {
                    id: "calendly-5",
                    name: "Get Event Types",
                    description: "List available meeting durations",
                    enabled: false,
                    toolIcon: <List className="h-4 w-4" />,
                },
                {
                    id: "calendly-6",
                    name: "List Upcoming Events",
                    description: "Show scheduled meetings",
                    enabled: false,
                    toolIcon: <Calendar className="h-4 w-4" />,
                },
            ],
        },
        {
            id: "support",
            name: "Support Tools",
            icon: "🛠️",
            tool: "Support Tools",
            actions: [
                {
                    id: "support-1",
                    name: "Create Jira Ticket",
                    description: "Log bug in project board",
                    enabled: true,
                    toolIcon: <Ticket className="h-4 w-4" />,
                },
                {
                    id: "support-2",
                    name: "Search Notion Docs",
                    description: "Query knowledge base",
                    enabled: true,
                    toolIcon: <FileText className="h-4 w-4" />,
                },
                {
                    id: "support-3",
                    name: "Update Zendesk Status",
                    description: "Change ticket priority/state",
                    enabled: false,
                    toolIcon: <RefreshCw className="h-4 w-4" />,
                },
                {
                    id: "support-4",
                    name: "Send Slack Alert",
                    description: "Notify channel of urgent issue",
                    enabled: false,
                    toolIcon: <Bell className="h-4 w-4" />,
                },
                {
                    id: "support-5",
                    name: "Escalate to Human",
                    description: "Transfer to support agent",
                    enabled: false,
                    toolIcon: <Users className="h-4 w-4" />,
                },
            ],
        },
        {
            id: "account",
            name: "Account",
            icon: "🔐",
            tool: "Account Management",
            actions: [
                {
                    id: "acc-1",
                    name: "Send Password Reset",
                    description: "Trigger recovery email flow",
                    enabled: true,
                    toolIcon: <Lock className="h-4 w-4" />,
                },
                {
                    id: "acc-2",
                    name: "Unlock User Account",
                    description: "Remove login block/ban",
                    enabled: true,
                    toolIcon: <Unlock className="h-4 w-4" />,
                },
                {
                    id: "acc-3",
                    name: "Update Email Address",
                    description: "Change user identifier",
                    enabled: false,
                    toolIcon: <Mail className="h-4 w-4" />,
                },
                {
                    id: "acc-4",
                    name: "Enable 2FA Enforcement",
                    description: "Require two-factor auth",
                    enabled: false,
                    toolIcon: <Shield className="h-4 w-4" />,
                },
                {
                    id: "acc-5",
                    name: "Revoke Active Sessions",
                    description: "Log out from all devices",
                    enabled: false,
                    toolIcon: <LogOut className="h-4 w-4" />,
                },
                {
                    id: "acc-6",
                    name: "Delete User Account",
                    description: "Hard delete user data",
                    enabled: false,
                    toolIcon: <Trash2 className="h-4 w-4" />,
                },
            ],
        },
    ]);

    // Calculate totals
    const totalActions = actionCategories.reduce((acc, cat) => acc + cat.actions.length, 0);
    const enabledActions = actionCategories.reduce(
        (acc, cat) => acc + cat.actions.filter((a) => a.enabled).length,
        0
    );

    // Category counts
    const categoryMap = [
        { id: "all", name: `All Actions (${totalActions})`, icon: "✨" },
        { id: "stripe", name: "💳 Stripe", icon: "💳", count: 7 },
        { id: "calendly", name: "📅 Calendly", icon: "📅", count: 6 },
        { id: "support", name: "🛠️ Support", icon: "🛠️", count: 5 },
        { id: "account", name: "🔐 Account", icon: "🔐", count: 6 },
    ];

    // Toggle action
    const toggleAction = (categoryId: string, actionId: string) => {
        setActionCategories((prev) =>
            prev.map((cat) => {
                if (cat.id === categoryId) {
                    return {
                        ...cat,
                        actions: cat.actions.map((action) =>
                            action.id === actionId ? { ...action, enabled: !action.enabled } : action
                        ),
                    };
                }
                return cat;
            })
        );
    };

    // Filter actions based on search
    const filteredCategories = actionCategories
        .map((cat) => ({
            ...cat,
            actions: cat.actions.filter(
                (action) =>
                    action.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    action.description.toLowerCase().includes(searchQuery.toLowerCase())
            ),
        }))
        .filter((cat) => cat.actions.length > 0);

    return (
        <div className={`h-screen w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Main Layout */}
            <div className="flex h-full">
                {/* LEFT SIDEBAR - Category Navigation */}
                <div className="w-64 shrink-0 overflow-y-auto border-r border-zinc-200 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                            <Sparkles className="h-3 w-3" />
                            Step 3 of 4
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            Command Center
                        </h2>
                        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                            Enable superpowers
                        </p>
                    </div>

                    {/* Category Pills */}
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
                                {category.count && (
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-xs ${selectedCategory === category.id
                                            ? "bg-violet-200 text-violet-800 dark:bg-violet-800 dark:text-violet-200"
                                            : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                                            }`}
                                    >
                                        {category.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>

                    {/* Stats Card */}
                    <div className="mt-8 rounded-xl border border-zinc-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4 dark:border-zinc-800 dark:from-violet-900/20 dark:to-indigo-900/20">
                        <div className="mb-2 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                            {enabledActions}/{totalActions}
                        </div>
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">
                            Actions Enabled
                        </div>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                            <div
                                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500"
                                style={{ width: `${(enabledActions / totalActions) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT MAIN CONTENT */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    {/* Top Bar with Search */}
                    <div className="shrink-0 border-b border-zinc-200 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                        <div className="mx-auto max-w-4xl">
                            <h1 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                Action Store
                            </h1>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for capabilities like 'Refund', 'Book demo'..."
                                    className="h-14 w-full rounded-xl border border-zinc-200 bg-white pl-12 pr-4 text-base text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions List */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <div className="mx-auto max-w-5xl space-y-4">
                            {filteredCategories.map((category) => (
                                <div key={category.id}>
                                    {/* Compact Section Header */}
                                    <div className="mb-2 flex items-center gap-2 px-1">
                                        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            {category.tool}
                                        </h3>
                                        <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                                    </div>

                                    {/* Dense Action Rows */}
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
                                                <div
                                                    className={`flex h-7 w-7 items-center justify-center rounded-md transition-all ${action.enabled
                                                        ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                                                        : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                                                        }`}
                                                >
                                                    {action.toolIcon}
                                                </div>

                                                {/* Content */}
                                                <div className="flex flex-1 items-center justify-between gap-4">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <h4
                                                                className={`truncate text-sm font-medium ${action.enabled
                                                                    ? "text-zinc-900 dark:text-zinc-50"
                                                                    : "text-zinc-500 dark:text-zinc-500"
                                                                    }`}
                                                            >
                                                                {action.name}
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

                                                    {/* Toggle */}
                                                    <ActionToggle
                                                        enabled={action.enabled}
                                                        onChange={() => toggleAction(category.id, action.id)}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Empty State */}
                            {filteredCategories.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                        <Search className="h-8 w-8 text-zinc-400" />
                                    </div>
                                    <h3 className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                        No actions found
                                    </h3>
                                    <p className="text-sm text-zinc-500">
                                        Try adjusting your search query
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom Navigation */}
                    <div className="shrink-0 border-t border-zinc-200 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                        <div className="mx-auto flex max-w-4xl items-center justify-between">
                            <Button
                                variant="ghost"
                                className="gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Training
                            </Button>
                            <Button
                                disabled={enabledActions === 0}
                                onClick={() => router.push("/guardrails")}
                                className={`h-12 w-48 gap-2 rounded-xl font-semibold transition-all ${enabledActions > 0
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
