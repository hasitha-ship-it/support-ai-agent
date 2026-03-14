"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { Sidebar, useSidebarState } from "@/components/sidebar";
import {
    Bot,
    Search,
    Download,
    TrendingUp,
    Flame,
    ArrowUp,
    Mail,
    ExternalLink,
    Users2,
} from "lucide-react";


// Sample leads data
const leadsData = [
    {
        id: 1,
        name: "Sarah Johnson",
        email: "sarah.j@techcorp.com",
        intent: "Pricing Inquiry",
        sourcePage: "/pricing",
        capturedAt: "2 mins ago",
        isHot: true,
    },
    {
        id: 2,
        name: "Michael Chen",
        email: "m.chen@startup.io",
        intent: "Demo Request",
        sourcePage: "/features",
        capturedAt: "15 mins ago",
        isHot: true,
    },
    {
        id: 3,
        name: "Emily Rodriguez",
        email: "emily.r@enterprise.com",
        intent: "Enterprise Plan",
        sourcePage: "/pricing",
        capturedAt: "1 hour ago",
        isHot: true,
    },
    {
        id: 4,
        name: "David Kim",
        email: "david@agency.co",
        intent: "Integration Questions",
        sourcePage: "/integrations",
        capturedAt: "2 hours ago",
        isHot: false,
    },
    {
        id: 5,
        name: "Lisa Anderson",
        email: "lisa.a@company.com",
        intent: "General Inquiry",
        sourcePage: "/contact",
        capturedAt: "3 hours ago",
        isHot: false,
    },
    {
        id: 6,
        name: "James Wilson",
        email: "j.wilson@business.net",
        intent: "API Documentation",
        sourcePage: "/docs",
        capturedAt: "5 hours ago",
        isHot: false,
    },
    {
        id: 7,
        name: "Maria Garcia",
        email: "maria.g@solutions.com",
        intent: "Pricing Inquiry",
        sourcePage: "/pricing",
        capturedAt: "6 hours ago",
        isHot: true,
    },
    {
        id: 8,
        name: "Robert Taylor",
        email: "r.taylor@tech.io",
        intent: "Support Question",
        sourcePage: "/support",
        capturedAt: "1 day ago",
        isHot: false,
    },
];

export default function LeadsPage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id as string;
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [searchQuery, setSearchQuery] = React.useState("");

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
    };

    // Filter leads based on search query
    const filteredLeads = leadsData.filter(
        (lead) =>
            lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lead.intent.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate stats
    const totalLeads = 1240;
    const newThisWeek = 45;
    const hotLeads = leadsData.filter((lead) => lead.isHot).length;

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="leads" agentId={agentId} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <main className={mainClass}>
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
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Leads Dashboard</p>
                        </div>
                    </div>

                    <ThemeToggle />
                </header>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Summary Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Total Leads */}
                        <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
                                    <Users2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {totalLeads.toLocaleString()}
                                </p>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    📊 Total Leads
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                    All captured leads
                                </p>
                            </div>
                        </div>

                        {/* New This Week */}
                        <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 dark:bg-emerald-900/20">
                                    <ArrowUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                        New
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                                    +{newThisWeek}
                                </p>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    📈 New This Week
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                    Fresh opportunities
                                </p>
                            </div>
                        </div>

                        {/* Hot Leads */}
                        <div className="group rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center justify-between">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20">
                                    <Flame className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {hotLeads}
                                </p>
                                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    🔥 Hot Leads
                                </p>
                                <p className="text-xs text-zinc-500 dark:text-zinc-500">
                                    Pricing inquiries
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filter Bar */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Search */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by email..."
                                className="h-10 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                            />
                        </div>

                        {/* Export CSV Button */}
                        <Button className="gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:from-violet-700 hover:to-purple-700">
                            <Download className="h-4 w-4" />
                            Export CSV
                        </Button>
                    </div>

                    {/* Leads Table */}
                    <div className="rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            User (Lead)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Intent
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Source Page
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Captured At
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                                    {filteredLeads.map((lead) => (
                                        <tr
                                            key={lead.id}
                                            className="transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-purple-500 text-sm font-bold text-white">
                                                        {lead.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                                {lead.name}
                                                            </p>
                                                            {lead.isHot && (
                                                                <Flame className="h-4 w-4 text-orange-500" />
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                                                            <Mail className="h-3 w-3" />
                                                            {lead.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                                                    {lead.intent}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a
                                                    href={lead.sourcePage}
                                                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                >
                                                    {lead.sourcePage}
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                                    {lead.capturedAt}
                                                </p>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Empty State */}
                        {filteredLeads.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                    <Search className="h-8 w-8 text-zinc-400" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                    No leads found
                                </h3>
                                <p className="text-sm text-zinc-500">
                                    Try adjusting your search query
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
