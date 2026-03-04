"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter, useParams } from "next/navigation";
import { Sidebar, useSidebarState } from "@/components/sidebar";
import {
    Plus,
    Bell,
    Search,
    Send,
    Play,
    User,
    Mail,
    Globe,
    Monitor,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    X,
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


const mockConversations = [
    {
        id: "conv_1",
        userName: "John Doe",
        userEmail: "john@example.com",
        lastMessage: "Can you help me reset my password?",
        time: "2m ago",
        status: "bot-active" as const,
        unread: true,
        userInfo: {
            location: "🇺🇸 United States",
            browser: "Chrome 120",
            ip: "192.168.1.1",
            plan: "Pro Plan",
            planPrice: "$49",
            ltv: "$500",
            churnRisk: "high" as const,
        },
        messages: [
            { role: "user", text: "Hi, I need help with my account", time: "5m ago" },
            { role: "bot", text: "Hello! I'd be happy to help you with your account. What seems to be the issue?", time: "5m ago" },
            { role: "user", text: "Can you help me reset my password?", time: "2m ago" },
            { role: "bot", text: "I can definitely help you reset your password. I'll send you a reset link to your email address.", time: "2m ago" },
        ],
    },
    {
        id: "conv_2",
        userName: "Guest #4920",
        userEmail: "guest4920@temp.com",
        lastMessage: "I need to speak with a human agent",
        time: "15m ago",
        status: "human-needed" as const,
        unread: true,
        userInfo: {
            location: "🇬🇧 United Kingdom",
            browser: "Safari 17",
            ip: "10.0.0.5",
            plan: "Free Plan",
            planPrice: "$0",
            ltv: "$0",
            churnRisk: "low" as const,
        },
        messages: [
            { role: "user", text: "I have a billing issue", time: "20m ago" },
            { role: "bot", text: "I understand you have a billing concern. Could you please provide more details?", time: "19m ago" },
            { role: "user", text: "I need to speak with a human agent", time: "15m ago" },
        ],
    },
    {
        id: "conv_3",
        userName: "Sarah Wilson",
        userEmail: "sarah@company.com",
        lastMessage: "Thank you so much for your help!",
        time: "1h ago",
        status: "resolved" as const,
        unread: false,
        userInfo: {
            location: "🇨🇦 Canada",
            browser: "Firefox 121",
            ip: "172.16.0.10",
            plan: "Enterprise",
            planPrice: "$199",
            ltv: "$2,400",
            churnRisk: "low" as const,
        },
        messages: [
            { role: "user", text: "How do I export my data?", time: "2h ago" },
            { role: "bot", text: "You can export your data from Settings > Data Export. Would you like me to guide you through the process?", time: "2h ago" },
            { role: "user", text: "Yes please", time: "1h ago" },
            { role: "bot", text: "Great! Here are the steps: 1) Go to Settings, 2) Click on Data Export, 3) Select the format you want...", time: "1h ago" },
            { role: "user", text: "Thank you so much for your help!", time: "1h ago" },
        ],
    },
    {
        id: "conv_4",
        userName: "Mike Johnson",
        userEmail: "mike@startup.io",
        lastMessage: "What integrations do you support?",
        time: "3h ago",
        status: "bot-active" as const,
        unread: false,
        userInfo: {
            location: "🇦🇺 Australia",
            browser: "Edge 120",
            ip: "203.0.113.42",
            plan: "Pro Plan",
            planPrice: "$49",
            ltv: "$147",
            churnRisk: "medium" as const,
        },
        messages: [
            { role: "user", text: "What integrations do you support?", time: "3h ago" },
            { role: "bot", text: "We support integrations with Stripe, Slack, Zapier, and many more. Would you like to see the full list?", time: "3h ago" },
        ],
    },
];

type ConversationStatus = "all" | "bot-active" | "human-needed" | "resolved";

export default function ConversationsPage() {
    const router = useRouter();
    const params = useParams();
    const agentId = params.id as string;
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [activeFilter, setActiveFilter] = React.useState<ConversationStatus>("all");
    const [selectedConversation, setSelectedConversation] = React.useState(mockConversations[0]);
    const [botPaused, setBotPaused] = React.useState(false);
    const [messageInput, setMessageInput] = React.useState("");
    const [userSidebarOpen, setUserSidebarOpen] = React.useState(true);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const currentAgent = allAgents.find(a => a.id === agentId) || allAgents[0];

    const filteredConversations = mockConversations.filter((conv) => {
        if (activeFilter === "all") return true;
        return conv.status === activeFilter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "bot-active":
                return { label: "🤖 Bot Active", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" };
            case "human-needed":
                return { label: "👨‍💻 Human Needed", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" };
            case "resolved":
                return { label: "✅ Resolved", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" };
            default:
                return { label: "Active", color: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" };
        }
    };

    const getChurnRiskColor = (risk: string) => {
        switch (risk) {
            case "high":
                return "text-red-600 dark:text-red-400";
            case "medium":
                return "text-amber-600 dark:text-amber-400";
            case "low":
                return "text-green-600 dark:text-green-400";
            default:
                return "text-zinc-600 dark:text-zinc-400";
        }
    };

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;
        // Handle message sending logic here
        setMessageInput("");
    };

    return (
        <div className="flex min-h-screen overflow-x-hidden bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="conversations" agentId={agentId} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* ── Main Content ───────────────────────────────── */}
            <main className={`${mainClass} overflow-x-hidden`}>
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
                                {currentAgent.name} - Conversations
                            </h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                Manage and monitor all conversations
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative rounded-xl bg-zinc-100 p-2.5 text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                            <Bell className="h-5 w-5" />
                        </button>
                        <ThemeToggle />
                    </div>
                </header>

                {/* ── Two Column Layout with Overlay ── */}
                <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden">
                    {/* LEFT - Conversation List (60%) */}
                    <div className="w-full overflow-y-auto border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60 lg:w-[60%]">
                        {/* Search */}
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search conversations..."
                                    className="w-full rounded-xl border-2 border-zinc-100 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:ring-violet-900/30"
                                />
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="mb-4 flex flex-wrap gap-2">
                            {[
                                { id: "all" as const, label: "All Open", count: mockConversations.length },
                                { id: "bot-active" as const, label: "🤖 Bot Active", count: mockConversations.filter(c => c.status === "bot-active").length },
                                { id: "human-needed" as const, label: "👨‍💻 Human", count: mockConversations.filter(c => c.status === "human-needed").length },
                                { id: "resolved" as const, label: "✅ Resolved", count: mockConversations.filter(c => c.status === "resolved").length },
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => setActiveFilter(filter.id)}
                                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${activeFilter === filter.id
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                        }`}
                                >
                                    {filter.label}
                                    <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeFilter === filter.id
                                        ? "bg-white/20"
                                        : "bg-zinc-200 dark:bg-zinc-700"
                                        }`}>
                                        {filter.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Conversation Cards */}
                        <div className="space-y-2">
                            {filteredConversations.map((conv) => {
                                const badge = getStatusBadge(conv.status);
                                return (
                                    <button
                                        key={conv.id}
                                        onClick={() => setSelectedConversation(conv)}
                                        className={`w-full rounded-xl border-2 p-3.5 text-left transition-all ${selectedConversation.id === conv.id
                                            ? "border-violet-200 bg-violet-50 shadow-md dark:border-violet-800 dark:bg-violet-900/20"
                                            : "border-zinc-100 bg-white hover:border-zinc-200 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
                                            }`}
                                    >
                                        <div className="mb-2 flex items-start justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-xs font-bold text-white">
                                                    {conv.userName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                                        {conv.userName}
                                                    </p>
                                                    <span className={`text-[10px] font-medium ${badge.color} rounded-full px-2 py-0.5`}>
                                                        {badge.label}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                {conv.time}
                                            </span>
                                        </div>
                                        <p className="truncate text-xs text-zinc-600 dark:text-zinc-400">
                                            {conv.lastMessage}
                                        </p>
                                        {conv.unread && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                                                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400">
                                                    New message
                                                </span>
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* RIGHT - Chat Feed (40%) with Overlay Sidebar */}
                    <div className="relative flex w-full flex-col bg-zinc-50 dark:bg-zinc-950 lg:w-[40%]">
                        {/* Chat Header */}
                        <div className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-sm font-bold text-white">
                                        {selectedConversation.userName.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                            {selectedConversation.userName}
                                        </h3>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            {selectedConversation.userEmail}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setUserSidebarOpen(!userSidebarOpen)}
                                    className={`rounded-lg p-2 transition-all ${userSidebarOpen
                                        ? "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
                                        : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                        }`}
                                >
                                    <User className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            {selectedConversation.messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === "user"
                                        ? "bg-violet-600 text-white"
                                        : "bg-white text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                                        }`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <span className={`mt-1 block text-[10px] ${msg.role === "user" ? "text-violet-200" : "text-zinc-500 dark:text-zinc-400"
                                            }`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Takeover Input */}
                        <div className="border-t border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
                            {!botPaused ? (
                                <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                                    <div className="mb-3 flex items-center gap-2">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                        <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                                            ⚠️ Bot is handling this conversation
                                        </p>
                                    </div>
                                    <Button
                                        onClick={() => setBotPaused(true)}
                                        className="w-full rounded-xl bg-amber-600 text-white hover:bg-amber-700"
                                    >
                                        ✋ Stop Bot & Join Chat
                                    </Button>
                                </div>
                            ) : (
                                <div>
                                    <div className="mb-2 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                                        <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                                            🔵 Bot Paused - You're now chatting
                                        </span>
                                        <button
                                            onClick={() => setBotPaused(false)}
                                            className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700"
                                        >
                                            <Play className="h-3 w-3" />
                                            Resume Bot
                                        </button>
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                                            placeholder="Type your message..."
                                            className="flex-1 rounded-xl border-2 border-zinc-100 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:ring-violet-900/30"
                                        />
                                        <Button
                                            onClick={handleSendMessage}
                                            className="rounded-xl bg-violet-600 px-4 text-white hover:bg-violet-700"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Context Sidebar - Overlay */}
                        <div
                            className={`absolute right-0 top-0 z-50 h-full w-80 transform overflow-y-auto border-l border-zinc-200 bg-white p-4 shadow-2xl transition-transform duration-300 dark:border-zinc-800 dark:bg-zinc-900 ${userSidebarOpen ? "translate-x-0" : "translate-x-full"
                                }`}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                                    User Context
                                </h3>
                                <button
                                    onClick={() => setUserSidebarOpen(false)}
                                    className="rounded-lg p-1 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* User Profile */}
                            <div className="mb-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                                <h4 className="mb-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                    👤 User Profile
                                </h4>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <User className="h-4 w-4 text-zinc-500" />
                                        <span className="text-xs text-zinc-900 dark:text-zinc-100">
                                            {selectedConversation.userName}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-zinc-500" />
                                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                            {selectedConversation.userEmail}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-zinc-500" />
                                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                            {selectedConversation.userInfo.location}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4 text-zinc-500" />
                                        <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                            {selectedConversation.userInfo.browser}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-zinc-500" />
                                        <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
                                            {selectedConversation.userInfo.ip}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* SaaS Info */}
                            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
                                <h4 className="mb-3 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                                    💼 SaaS Info
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">Plan</span>
                                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                                {selectedConversation.userInfo.plan}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3 text-emerald-600" />
                                            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                                                {selectedConversation.userInfo.planPrice}/mo
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">LTV</span>
                                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                                                {selectedConversation.userInfo.ltv}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="h-3 w-3 text-blue-600" />
                                            <span className="text-xs text-blue-600 dark:text-blue-400">
                                                Lifetime Value
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-zinc-200 pt-3 dark:border-zinc-700">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">Churn Risk</span>
                                            <span className={`text-xs font-bold uppercase ${getChurnRiskColor(selectedConversation.userInfo.churnRisk)}`}>
                                                {selectedConversation.userInfo.churnRisk}
                                                {selectedConversation.userInfo.churnRisk === "high" && " 🔴"}
                                                {selectedConversation.userInfo.churnRisk === "medium" && " 🟡"}
                                                {selectedConversation.userInfo.churnRisk === "low" && " 🟢"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
