"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    ArrowLeft,
    ArrowRight,
    Upload,
    MessageCircle,
    Bot,
    Building2,
    ChevronDown,
    Check,
    Smartphone,
    Monitor,
    Send,
    X,
} from "lucide-react";

// Avatar Options
const defaultAvatars = [
    { id: "robot", emoji: "🤖", label: "Robot Face" },
    { id: "headset", emoji: "🎧", label: "Support Agent" },
    { id: "sparkle", emoji: "✨", label: "AI Sparkle" },
    { id: "brain", emoji: "🧠", label: "Smart Brain" },
    { id: "star", emoji: "⭐", label: "Star Assistant" },
];

// Launcher Icon Styles
const launcherStyles = [
    { id: "bubble", label: "Chat Bubble 💬", description: "Basic" },
    { id: "agent", label: "Agent Face 🤖", description: "Personal" },
    { id: "brand", label: "Brand Logo", description: "Professional" },
];

// All 24 Action chips from the action store
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

export default function UISetupPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Configuration State
    const [agentName, setAgentName] = React.useState("WizName Support");
    const [themeColor, setThemeColor] = React.useState("#7c3aed");
    const [themeMode, setThemeMode] = React.useState<"light" | "dark" | "auto">("auto");
    const [selectedAvatar, setSelectedAvatar] = React.useState(defaultAvatars[0]);
    const [launcherStyle, setLauncherStyle] = React.useState(launcherStyles[0]);
    const [welcomeMessage, setWelcomeMessage] = React.useState(
        "👋 Hi! I'm your AI assistant. How can I help you today?"
    );
    const [selectedActions, setSelectedActions] = React.useState<string[]>([
        "stripe-1",
        "calendly-1",
        "stripe-2",
        "support-5",
        "acc-1",
    ]);
    const [showTypingIndicator, setShowTypingIndicator] = React.useState(true);

    // Dropdown states
    const [isAvatarOpen, setIsAvatarOpen] = React.useState(false);
    const [isLauncherOpen, setIsLauncherOpen] = React.useState(false);
    const [isActionSelectorOpen, setIsActionSelectorOpen] = React.useState(false);

    // Preview Mode State - Desktop/Mobile toggle
    const [previewMode, setPreviewMode] = React.useState<"desktop" | "mobile">("desktop");
    // Launcher expanded/collapsed state
    const [launcherExpanded, setLauncherExpanded] = React.useState(true);

    // Chat simulation state
    const [messages, setMessages] = React.useState<Array<{ role: "user" | "agent"; text: string; status?: string }>>([]);
    const [isTyping, setIsTyping] = React.useState(false);
    const [typingStatus, setTypingStatus] = React.useState("Typing...");

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    // Toggle action selection
    const toggleAction = (actionId: string) => {
        if (selectedActions.includes(actionId)) {
            setSelectedActions(selectedActions.filter((id) => id !== actionId));
        } else if (selectedActions.length < 5) {
            setSelectedActions([...selectedActions, actionId]);
        }
    };

    // Simulate agent typing
    const simulateTyping = (status: string = "Typing...") => {
        if (!showTypingIndicator) return;
        setIsTyping(true);
        setTypingStatus(status);
        setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            <div className="fixed top-6 right-6 z-40">
                <ThemeToggle />
            </div>

            {/* Main Container */}
            <div className="mx-auto flex min-h-screen max-w-7xl px-12 py-8">
                {/* LEFT COLUMN: Configuration (45%) */}
                <div className="flex w-[45%] flex-col justify-center pr-8">
                    {/* Header */}
                    <div className="mb-8 pl-1">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                            <Sparkles className="h-4 w-4" />
                            Step 6 of 6
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                            Agent UI Setup
                        </h1>
                        <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
                            Customize how your agent looks and feels to your customers.
                        </p>
                    </div>

                    <div className="max-w-xl space-y-5 overflow-y-auto pr-2" style={{ maxHeight: "calc(100vh - 280px)" }}>
                        {/* 1. AGENT NAME */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                Agent Name
                            </label>
                            <input
                                type="text"
                                value={agentName}
                                onChange={(e) => setAgentName(e.target.value)}
                                className="h-12 w-full rounded-xl border-2 border-zinc-100 bg-white px-4 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:ring-violet-900/30"
                            />
                        </div>

                        {/* 2. THEME */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                🎨 Theme
                            </label>
                            <div className="space-y-3">
                                {/* Color Picker */}
                                <div className="flex items-center gap-3">
                                    <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                        Primary Color
                                    </label>
                                    <input
                                        type="color"
                                        value={themeColor}
                                        onChange={(e) => setThemeColor(e.target.value)}
                                        className="h-10 w-20 cursor-pointer rounded-lg border-2 border-zinc-200 dark:border-zinc-700"
                                    />
                                    <span className="text-xs font-mono text-zinc-500">{themeColor}</span>
                                </div>

                                {/* Mode Selector */}
                                <div className="flex gap-2">
                                    {(["light", "dark", "auto"] as const).map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => setThemeMode(mode)}
                                            className={`flex-1 rounded-lg border-2 px-3 py-2 text-xs font-semibold capitalize transition-all ${themeMode === mode
                                                ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                                                }`}
                                        >
                                            {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. AVATAR */}
                        <div className="relative z-30">
                            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                Avatar
                            </label>
                            <button
                                onClick={() => {
                                    setIsAvatarOpen(!isAvatarOpen);
                                    setIsLauncherOpen(false);
                                    setIsActionSelectorOpen(false);
                                }}
                                className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-2xl dark:bg-zinc-800">
                                        {selectedAvatar.emoji}
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                        {selectedAvatar.label}
                                    </span>
                                </div>
                                <ChevronDown
                                    className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isAvatarOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Avatar Dropdown */}
                            {isAvatarOpen && (
                                <div className="absolute left-0 top-[110%] z-50 mt-2 w-full rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900">
                                    {defaultAvatars.map((avatar) => (
                                        <button
                                            key={avatar.id}
                                            onClick={() => {
                                                setSelectedAvatar(avatar);
                                                setIsAvatarOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${selectedAvatar.id === avatar.id
                                                ? "bg-violet-50 dark:bg-violet-900/20"
                                                : ""
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{avatar.emoji}</span>
                                                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                                                    {avatar.label}
                                                </span>
                                            </div>
                                            {selectedAvatar.id === avatar.id && (
                                                <Check className="h-4 w-4 text-violet-600" />
                                            )}
                                        </button>
                                    ))}
                                    <div className="mt-2 border-t border-zinc-100 pt-2 dark:border-zinc-800">
                                        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-violet-600 transition-all hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-900/20">
                                            <Upload className="h-4 w-4" />
                                            Upload Custom Avatar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 4. LAUNCHER ICON STYLE */}
                        <div className="relative z-20">
                            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                Launcher Icon Style
                            </label>
                            <button
                                onClick={() => {
                                    setIsLauncherOpen(!isLauncherOpen);
                                    setIsAvatarOpen(false);
                                    setIsActionSelectorOpen(false);
                                }}
                                className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                            >
                                <div className="text-left">
                                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                        {launcherStyle.label}
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                        {launcherStyle.description}
                                    </div>
                                </div>
                                <ChevronDown
                                    className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isLauncherOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Launcher Dropdown */}
                            {isLauncherOpen && (
                                <div className="absolute left-0 top-[110%] z-50 mt-2 w-full rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900">
                                    {launcherStyles.map((style) => (
                                        <button
                                            key={style.id}
                                            onClick={() => {
                                                setLauncherStyle(style);
                                                setIsLauncherOpen(false);
                                            }}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${launcherStyle.id === style.id
                                                ? "bg-violet-50 dark:bg-violet-900/20"
                                                : ""
                                                }`}
                                        >
                                            <div className="text-left">
                                                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                                                    {style.label}
                                                </div>
                                                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    {style.description}
                                                </div>
                                            </div>
                                            {launcherStyle.id === style.id && (
                                                <Check className="h-4 w-4 text-violet-600" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 5. WELCOME MESSAGE */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                Welcome Message
                            </label>
                            <textarea
                                value={welcomeMessage}
                                onChange={(e) => setWelcomeMessage(e.target.value)}
                                placeholder="Enter your welcome message..."
                                className="min-h-[80px] w-full resize-none rounded-xl border-2 border-zinc-100 bg-white p-3 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:ring-violet-900/30"
                            />
                        </div>

                        {/* 6. QUICK ACTION BUTTONS */}
                        <div className="relative z-10">
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    Quick Action Buttons
                                </label>
                                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                    {selectedActions.length}/5 selected
                                </span>
                            </div>
                            <button
                                onClick={() => {
                                    setIsActionSelectorOpen(!isActionSelectorOpen);
                                    setIsAvatarOpen(false);
                                    setIsLauncherOpen(false);
                                }}
                                className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                            >
                                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                    Select actions to display
                                </span>
                                <ChevronDown
                                    className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isActionSelectorOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {/* Action Selector Dropdown */}
                            {isActionSelectorOpen && (
                                <div className="absolute left-0 top-[110%] z-50 mt-2 max-h-[400px] w-full overflow-y-auto rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900">
                                    {/* Stripe Actions */}
                                    <div className="mb-2">
                                        <div className="mb-1 flex items-center gap-2 px-2 py-1">
                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">💳 Stripe (7)</span>
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Stripe").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleAction(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"} ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{action.label}</span>
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
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Calendly").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleAction(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"} ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{action.label}</span>
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
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Support").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleAction(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"} ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{action.label}</span>
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
                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                                        </div>
                                        {availableActions.filter(a => a.category === "Account").map((action) => {
                                            const isSelected = selectedActions.includes(action.id);
                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                            return (
                                                <button
                                                    key={action.id}
                                                    onClick={() => !isDisabled && toggleAction(action.id)}
                                                    disabled={isDisabled}
                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"} ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span>{action.icon}</span>
                                                        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{action.label}</span>
                                                    </div>
                                                    {isSelected && <Check className="h-4 w-4 text-violet-600" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 7. TYPING ANIMATION */}
                        <div>
                            <div className="flex items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                                <div>
                                    <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                                        Show Typing Indicator
                                    </div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                                        Show an animation while the agent is generating a response
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowTypingIndicator(!showTypingIndicator)}
                                    className={`relative h-6 w-11 rounded-full transition-all duration-300 ${showTypingIndicator
                                        ? "bg-violet-600 shadow-md shadow-violet-500/30"
                                        : "bg-zinc-200 dark:bg-zinc-700"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${showTypingIndicator ? "left-[22px]" : "left-0.5"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => router.push("/personality")}
                                className="h-12 flex-1 rounded-xl border-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back
                            </Button>
                            <Button
                                onClick={() => router.push("/integration")}
                                className="h-12 flex-[2] rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700"
                            >
                                Looks Good & Publish
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Live Preview (55%) */}
                <div className="relative flex w-[55%] flex-col items-center justify-center">
                    {/* Preview Mode Toggle */}
                    <div className="absolute top-8 flex items-center gap-2 rounded-xl border border-zinc-200 bg-white/80 p-1 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                        <button
                            onClick={() => setPreviewMode("desktop")}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${previewMode === "desktop"
                                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                }`}
                        >
                            <Monitor className="h-4 w-4" />
                            Desktop
                        </button>
                        <button
                            onClick={() => setPreviewMode("mobile")}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${previewMode === "mobile"
                                ? "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300"
                                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                }`}
                        >
                            <Smartphone className="h-4 w-4" />
                            Mobile
                        </button>
                    </div>

                    {/* Desktop Preview */}
                    {previewMode === "desktop" && (
                        <div className="relative mt-16">
                            {/* Browser Mockup */}
                            <div className="relative h-[520px] w-[720px] overflow-hidden rounded-xl border border-zinc-300 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-950">
                                {/* Browser Chrome */}
                                <div className="flex h-10 items-center gap-2 border-b border-zinc-200 bg-zinc-100 px-4 dark:border-zinc-800 dark:bg-zinc-900">
                                    <div className="flex gap-1.5">
                                        <div className="h-3 w-3 rounded-full bg-red-400" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                        <div className="h-3 w-3 rounded-full bg-green-400" />
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="h-6 w-72 rounded-md bg-white/60 dark:bg-zinc-800 flex items-center px-3">
                                            <span className="text-xs text-zinc-500">yoursite.com</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Website Content Background */}
                                <div className="relative h-[calc(100%-2.5rem)] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
                                    {/* Fake website content */}
                                    <div className="p-6 space-y-4 opacity-40">
                                        <div className="h-8 w-48 rounded bg-zinc-300 dark:bg-zinc-700" />
                                        <div className="h-4 w-96 rounded bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="h-4 w-80 rounded bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="mt-6 grid grid-cols-3 gap-4">
                                            <div className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                            <div className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                            <div className="h-24 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                        </div>
                                    </div>

                                    {/* Chat Widget (Expanded) */}
                                    {launcherExpanded && (
                                        <div className="absolute bottom-4 right-4 w-[340px] h-[420px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 flex flex-col">
                                            {/* Chat Header */}
                                            <div
                                                className="flex items-center gap-3 px-4 py-3 shadow-sm shrink-0"
                                                style={{ backgroundColor: themeColor }}
                                            >
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur-sm">
                                                    {selectedAvatar.emoji}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-white">{agentName}</div>
                                                    <div className="text-xs text-white/80">Online • Responds instantly</div>
                                                </div>
                                                <button
                                                    onClick={() => setLauncherExpanded(false)}
                                                    className="rounded-full p-1 hover:bg-white/10"
                                                >
                                                    <X className="h-4 w-4 text-white" />
                                                </button>
                                            </div>

                                            {/* Chat Messages */}
                                            <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 p-3 dark:bg-zinc-900">
                                                {/* Welcome Message */}
                                                <div className="flex gap-2">
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm dark:bg-zinc-800">
                                                        {selectedAvatar.emoji}
                                                    </div>
                                                    <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
                                                        <p className="text-xs text-zinc-900 dark:text-zinc-50">
                                                            {welcomeMessage}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Quick Action Chips */}
                                                <div className="flex flex-wrap gap-1.5 pl-9">
                                                    {selectedActions.slice(0, 5).map((actionId) => {
                                                        const action = availableActions.find((a) => a.id === actionId);
                                                        return (
                                                            <button
                                                                key={actionId}
                                                                onClick={() => simulateTyping("Processing request...")}
                                                                className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-[10px] font-semibold text-zinc-700 transition-all hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                                style={{ borderColor: themeColor + "40" }}
                                                            >
                                                                {action?.icon} {action?.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Typing Indicator */}
                                                {isTyping && showTypingIndicator && (
                                                    <div className="flex gap-2">
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm dark:bg-zinc-800">
                                                            {selectedAvatar.emoji}
                                                        </div>
                                                        <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
                                                            <div className="flex gap-1">
                                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: themeColor, animationDelay: "0ms" }} />
                                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: themeColor, animationDelay: "150ms" }} />
                                                                <div className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: themeColor, animationDelay: "300ms" }} />
                                                            </div>
                                                            <span className="text-[10px] text-zinc-500">{typingStatus}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Chat Input */}
                                            <div className="border-t border-zinc-200 bg-white p-2 shrink-0 dark:border-zinc-800 dark:bg-zinc-900">
                                                <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 dark:border-zinc-700 dark:bg-zinc-800">
                                                    <input
                                                        type="text"
                                                        placeholder="Type your message..."
                                                        className="flex-1 bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50"
                                                        readOnly
                                                    />
                                                    <button
                                                        className="flex h-6 w-6 items-center justify-center rounded-full transition-all"
                                                        style={{ backgroundColor: themeColor }}
                                                    >
                                                        <Send className="h-3 w-3 text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Floating Launcher Button (Collapsed) */}
                                    {!launcherExpanded && (
                                        <button
                                            onClick={() => setLauncherExpanded(true)}
                                            className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110"
                                            style={{ backgroundColor: themeColor }}
                                        >
                                            {launcherStyle.id === "bubble" && <MessageCircle className="h-7 w-7 text-white" />}
                                            {launcherStyle.id === "agent" && <span className="text-2xl">{selectedAvatar.emoji}</span>}
                                            {launcherStyle.id === "brand" && <Building2 className="h-7 w-7 text-white" />}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Demo Actions */}
                            <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 gap-2">
                                <button
                                    onClick={() => simulateTyping("Typing...")}
                                    className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Test Typing
                                </button>
                                <button
                                    onClick={() => setLauncherExpanded(!launcherExpanded)}
                                    className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    {launcherExpanded ? "Collapse" : "Expand"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Mobile Preview */}
                    {previewMode === "mobile" && (
                        <div className="relative mt-16">
                            {/* Phone Frame */}
                            <div className="relative h-[680px] w-[340px] rounded-[3rem] border-[14px] border-zinc-900 bg-zinc-900 shadow-2xl dark:border-zinc-700">
                                {/* Notch */}
                                <div className="absolute left-1/2 top-0 z-10 h-6 w-40 -translate-x-1/2 rounded-b-2xl bg-zinc-900 dark:bg-zinc-700" />

                                {/* Screen */}
                                <div className="relative h-full w-full overflow-hidden rounded-[2.2rem] bg-white dark:bg-zinc-950">
                                    {/* Status Bar */}
                                    <div className="flex h-12 items-center justify-between bg-white px-6 pt-2 dark:bg-zinc-950">
                                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-50">9:41</span>
                                        <div className="flex items-center gap-1">
                                            <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                            <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                            <div className="h-3 w-3 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                                        </div>
                                    </div>

                                    {/* Website Content Background (simulated mobile site) */}
                                    <div className="relative h-[calc(100%-3rem)] bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-950">
                                        {/* Fake mobile website content */}
                                        <div className="p-4 space-y-3 opacity-40">
                                            <div className="h-6 w-32 rounded bg-zinc-300 dark:bg-zinc-700" />
                                            <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
                                            <div className="h-3 w-3/4 rounded bg-zinc-200 dark:bg-zinc-800" />
                                            <div className="mt-4 h-32 rounded-lg bg-zinc-200 dark:bg-zinc-800" />
                                        </div>

                                        {/* Chat Widget (Expanded) - Full screen inside the phone */}
                                        {launcherExpanded && (
                                            <div className="absolute inset-0 overflow-hidden bg-white shadow-2xl dark:bg-zinc-950 flex flex-col">
                                                {/* Chat Header */}
                                                <div
                                                    className="flex items-center gap-3 px-4 py-3 shadow-sm shrink-0"
                                                    style={{ backgroundColor: themeColor }}
                                                >
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-xl backdrop-blur-sm">
                                                        {selectedAvatar.emoji}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm font-bold text-white">{agentName}</div>
                                                        <div className="text-xs text-white/80">Online • Responds instantly</div>
                                                    </div>
                                                    <button
                                                        onClick={() => setLauncherExpanded(false)}
                                                        className="rounded-full p-1 hover:bg-white/10"
                                                    >
                                                        <X className="h-4 w-4 text-white" />
                                                    </button>
                                                </div>

                                                {/* Chat Messages */}
                                                <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 p-3 dark:bg-zinc-900">
                                                    {/* Welcome Message */}
                                                    <div className="flex gap-2">
                                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm dark:bg-zinc-800">
                                                            {selectedAvatar.emoji}
                                                        </div>
                                                        <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
                                                            <p className="text-xs text-zinc-900 dark:text-zinc-50">
                                                                {welcomeMessage}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Quick Action Chips */}
                                                    <div className="flex flex-wrap gap-1.5 pl-9">
                                                        {selectedActions.slice(0, 5).map((actionId) => {
                                                            const action = availableActions.find((a) => a.id === actionId);
                                                            return (
                                                                <button
                                                                    key={actionId}
                                                                    onClick={() => simulateTyping("Processing request...")}
                                                                    className="rounded-full border border-zinc-200 bg-white px-2 py-1 text-[10px] font-semibold text-zinc-700 transition-all hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                                                                    style={{ borderColor: themeColor + "40" }}
                                                                >
                                                                    {action?.icon} {action?.label}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Typing Indicator */}
                                                    {isTyping && showTypingIndicator && (
                                                        <div className="flex gap-2">
                                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm dark:bg-zinc-800">
                                                                {selectedAvatar.emoji}
                                                            </div>
                                                            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-white px-3 py-2 shadow-sm dark:bg-zinc-800">
                                                                <div className="flex gap-1">
                                                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: themeColor, animationDelay: "0ms" }} />
                                                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: themeColor, animationDelay: "150ms" }} />
                                                                    <div className="h-1.5 w-1.5 animate-bounce rounded-full" style={{ backgroundColor: themeColor, animationDelay: "300ms" }} />
                                                                </div>
                                                                <span className="text-[10px] text-zinc-500">{typingStatus}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Chat Input */}
                                                <div className="border-t border-zinc-200 bg-white p-3 shrink-0 dark:border-zinc-800 dark:bg-zinc-900">
                                                    <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800">
                                                        <input
                                                            type="text"
                                                            placeholder="Type your message..."
                                                            className="flex-1 bg-transparent text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50"
                                                            readOnly
                                                        />
                                                        <button
                                                            className="flex h-6 w-6 items-center justify-center rounded-full transition-all"
                                                            style={{ backgroundColor: themeColor }}
                                                        >
                                                            <Send className="h-3 w-3 text-white" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Floating Launcher Button (inside the phone screen) */}
                                        {!launcherExpanded && (
                                            <button
                                                onClick={() => setLauncherExpanded(true)}
                                                className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-transform hover:scale-110"
                                                style={{ backgroundColor: themeColor }}
                                            >
                                                {launcherStyle.id === "bubble" && <MessageCircle className="h-7 w-7 text-white" />}
                                                {launcherStyle.id === "agent" && <span className="text-2xl">{selectedAvatar.emoji}</span>}
                                                {launcherStyle.id === "brand" && <Building2 className="h-7 w-7 text-white" />}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Demo Actions */}
                            <div className="absolute -bottom-12 left-1/2 flex -translate-x-1/2 gap-2">
                                <button
                                    onClick={() => simulateTyping("Typing...")}
                                    className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    Test Typing
                                </button>
                                <button
                                    onClick={() => setLauncherExpanded(!launcherExpanded)}
                                    className="rounded-lg bg-zinc-200 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                >
                                    {launcherExpanded ? "Collapse" : "Expand"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
