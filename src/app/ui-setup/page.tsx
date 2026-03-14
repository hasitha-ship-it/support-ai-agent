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
    ChevronDown,
    Check,
    Send,
    X,
    ImageIcon,
    Monitor,
    Smartphone,
} from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase-client";
import { ACTIONS_REGISTRY } from "@/lib/actions-definitions";
import { DEFAULT_UI_CONFIG } from "@/lib/ui-config";
import type { UiConfig } from "@/lib/ui-config";
import { ChatWidget } from "@/components/ChatWidget";

// Avatar Options
const defaultAvatars = [
    { id: "agent_img", image: "/Agent-avatar.png", label: "Agent Face" },
    { id: "chatbot_img", image: "/Chatbot-avatar.png", label: "Chatbot Face" },
    { id: "support_agent_img", image: "/Headset.png", label: "Support Agent" },
    { id: "robot", emoji: "🤖", label: "Robot Face" },
    { id: "headset", emoji: "🎧", label: "Support Agent (Emoji)" },
    { id: "sparkle", emoji: "✨", label: "AI Sparkle" },
    { id: "brain", emoji: "🧠", label: "Smart Brain" },
];

/** Avatar Render Helper */
function renderAvatar(avatar: typeof defaultAvatars[0], className?: string) {
    if (avatar.image) {
        return <img src={avatar.image} alt={avatar.label} className={`h-full w-full object-cover rounded-xl ${className}`} />;
    }
    return <span className={className}>{avatar.emoji}</span>;
}

// Category emoji mapping for action icons
const CATEGORY_EMOJI: Record<string, string> = {
    stripe: "💳",
    calendly: "📅",
    support_tools: "🛠️",
    account_management: "👤",
};

export default function UISetupPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [previewMode, setPreviewMode] = React.useState<"desktop" | "mobile">("desktop");
    const [previewOpen, setPreviewOpen] = React.useState(false);

    // ── Shared Supabase client (singleton to avoid multiple GoTrueClient instances) ──
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const supabase = React.useMemo(() => getSupabaseClient(), []);

    // ── Enabled actions loaded from Supabase ───────────────────────────────────
    // enabledActionIds: the IDs stored in profiles.enabled_actions
    const [enabledActionIds, setEnabledActionIds] = React.useState<string[]>([]);
    const [actionsLoading, setActionsLoading] = React.useState(true);

    // Configuration State
    const [agentName, setAgentName] = React.useState("WizName Support");
    const [themeColor, setThemeColor] = React.useState("#7c3aed");
    const [themeMode, setThemeMode] = React.useState<"light" | "dark" | "auto">("auto");
    const [selectedAvatar, setSelectedAvatar] = React.useState(defaultAvatars[0]);
    // Launcher style: "bubble" | "agent" | "brand"
    const [launcherStyle, setLauncherStyle] = React.useState<"bubble" | "agent" | "brand">("bubble");
    // Brand logo upload
    const [brandLogoUrl, setBrandLogoUrl] = React.useState<string | null>(null);
    const brandLogoInputRef = React.useRef<HTMLInputElement>(null);

    const [welcomeMessage, setWelcomeMessage] = React.useState(
        "👋 Hi! I'm your AI assistant. How can I help you today?"
    );
    // selectedActions: IDs of the enabled actions chosen for Quick Action chips (max 5)
    const [selectedActions, setSelectedActions] = React.useState<string[]>([]);
    const [showTypingIndicator, setShowTypingIndicator] = React.useState(true);

    // Dropdown states
    const [isAvatarOpen, setIsAvatarOpen] = React.useState(false);
    const [isActionSelectorOpen, setIsActionSelectorOpen] = React.useState(false);

    // ── Save / Publish state ──────────────────────────────────────────────────
    const [isSaving, setIsSaving] = React.useState(false);
    const [saveStatus, setSaveStatus] = React.useState<"idle" | "saved" | "published" | "error">("idle");
    const [isPublished, setIsPublished] = React.useState(false);

    // Determine the theme to apply to the preview widget
    const activePreviewTheme = React.useMemo(() => {
        if (themeMode === "auto") return resolvedTheme;
        return themeMode;
    }, [themeMode, resolvedTheme]);

    // ── Load UI config from backend on mount ──────────────────────────────────
    React.useEffect(() => {
        setMounted(true);
        async function loadAll() {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) { setActionsLoading(false); return; }

                const token = session.access_token;

                // Fetch UI config + enabled_actions in parallel
                const [configRes, profileRes] = await Promise.all([
                    fetch("/api/bot/update-ui", {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    supabase
                        .from("profiles")
                        .select("enabled_actions")
                        .eq("id", session.user.id)
                        .single(),
                ]);

                // Re-hydrate UI config state
                if (configRes.ok) {
                    const { uiConfig, is_published } = await configRes.json() as {
                        uiConfig: UiConfig;
                        is_published: boolean;
                    };
                    setAgentName(uiConfig.agentName ?? DEFAULT_UI_CONFIG.agentName);
                    setThemeColor(uiConfig.primaryColor ?? DEFAULT_UI_CONFIG.primaryColor);
                    setThemeMode(uiConfig.themeMode ?? DEFAULT_UI_CONFIG.themeMode);
                    setWelcomeMessage(uiConfig.welcomeMessage ?? DEFAULT_UI_CONFIG.welcomeMessage);
                    setSelectedActions(uiConfig.quickActions ?? []);
                    setShowTypingIndicator(uiConfig.showTypingIndicator ?? true);
                    setIsPublished(is_published ?? false);

                    // Re-hydrate launcher style
                    if (uiConfig.launcherStyle) setLauncherStyle(uiConfig.launcherStyle);
                    if (uiConfig.brandLogoUrl) setBrandLogoUrl(uiConfig.brandLogoUrl);

                    // Re-hydrate avatar
                    const found = defaultAvatars.find((a) =>
                        (a.image && a.image === uiConfig.avatar) ||
                        (a.emoji && a.emoji === uiConfig.avatar)
                    );
                    if (found) setSelectedAvatar(found);
                }

                // Re-hydrate enabled actions
                const profileData = profileRes.data as { enabled_actions?: string[] } | null;
                const ids: string[] = profileData?.enabled_actions ?? [];
                setEnabledActionIds(ids);
            } catch {
                // silently fall back to defaults
            } finally {
                setActionsLoading(false);
            }
        }
        loadAll();
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    // Only show actions the user has enabled in the Action Store
    const availableActions = ACTIONS_REGISTRY
        .filter((a) => enabledActionIds.includes(a.id))
        .map((a) => ({
            id: a.id,
            label: a.label,
            icon: CATEGORY_EMOJI[a.category] ?? "⚡",
            category: a.category,
        }));

    // Toggle action selection (max 5 quick-action chips)
    const toggleAction = (actionId: string) => {
        if (selectedActions.includes(actionId)) {
            setSelectedActions(selectedActions.filter((id) => id !== actionId));
        } else if (selectedActions.length < 5) {
            setSelectedActions([...selectedActions, actionId]);
        }
    };

    // Handle brand logo file upload
    function handleBrandLogoUpload(file: File) {
        const url = URL.createObjectURL(file);
        setBrandLogoUrl(url);
    }

    // ── Save / Publish handler ────────────────────────────────────────────────
    async function handlePublish(publishNow = false) {
        setIsSaving(true);
        setSaveStatus("idle");
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");

            const uiConfig: UiConfig = {
                agentName,
                primaryColor: themeColor,
                themeMode,
                avatar: selectedAvatar.image ?? selectedAvatar.emoji ?? "🤖",
                launcherStyle,
                brandLogoUrl,
                welcomeMessage,
                quickActions: selectedActions,
                showTypingIndicator,
            };

            const res = await fetch("/api/bot/update-ui", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({ uiConfig, publish: publishNow }),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                console.error("[handlePublish] API returned error:", res.status, errBody);
                throw new Error(errBody.error ?? "Save failed");
            }

            console.log("[handlePublish] Success! publish:", publishNow);
            setSaveStatus(publishNow ? "published" : "saved");
            if (publishNow) {
                setIsPublished(true);
                // Redirect to the dashboard to see the published agent
                setTimeout(() => router.push("/dashboard"), 600);
            } else {
                setTimeout(() => setSaveStatus("idle"), 3000);
            }
        } catch (err) {
            console.error("[handlePublish] Error:", err);
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
        } finally {
            setIsSaving(false);
        }
    }

    // \u2500\u2500 Build live config from current form state \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const liveConfig = React.useMemo<Partial<UiConfig>>(() => ({
        agentName,
        primaryColor: themeColor,
        themeMode,
        avatar: selectedAvatar.image ?? selectedAvatar.emoji ?? "\ud83e\udd16",
        launcherStyle,
        brandLogoUrl: brandLogoUrl ?? undefined,
        welcomeMessage,
        quickActions: selectedActions,
        showTypingIndicator,
    }), [
        agentName, themeColor, themeMode, selectedAvatar,
        launcherStyle, brandLogoUrl, welcomeMessage, selectedActions, showTypingIndicator,
    ]);

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

                        {/* 2. WELCOME MESSAGE */}
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

                        {/* 3. THEME */}
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

                        {/* 4. AVATAR */}
                        <div className="relative z-30">
                            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                Avatar
                            </label>
                            <button
                                onClick={() => {
                                    setIsAvatarOpen(!isAvatarOpen);
                                    setIsActionSelectorOpen(false);
                                }}
                                className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-2xl dark:bg-zinc-800 overflow-hidden">
                                        {renderAvatar(selectedAvatar)}
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
                                                <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-zinc-100 text-xl dark:bg-zinc-800 overflow-hidden">
                                                    {renderAvatar(avatar)}
                                                </div>
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

                        {/* 5. LAUNCHER ICON STYLE */}
                        <div>
                            <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                Launcher Icon Style
                            </label>

                            {/* Three pill buttons */}
                            <div className="flex gap-2">
                                {([
                                    { id: "bubble" as const, label: "Chat Bubble 💬", hint: "Basic" },
                                    { id: "agent" as const, label: "Agent Face 🤖", hint: "Personal" },
                                    { id: "brand" as const, label: "Brand Logo", hint: "Professional" },
                                ] as const).map((opt) => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setLauncherStyle(opt.id)}
                                        className={`flex-1 rounded-xl border-2 px-3 py-2 text-xs font-semibold transition-all ${launcherStyle === opt.id
                                            ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300"
                                            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                                            }`}
                                    >
                                        <div>{opt.label}</div>
                                        <div className="mt-0.5 text-[10px] font-normal opacity-60">{opt.hint}</div>
                                    </button>
                                ))}
                            </div>

                            {/* Brand logo upload zone — shown only when 'brand' is selected */}
                            {launcherStyle === "brand" && (
                                <div className="mt-3">
                                    <input
                                        ref={brandLogoInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleBrandLogoUpload(file);
                                        }}
                                    />
                                    {brandLogoUrl ? (
                                        /* Preview + change button */
                                        <div className="flex items-center gap-3 rounded-xl border-2 border-violet-200 bg-violet-50 px-4 py-3 dark:border-violet-800 dark:bg-violet-900/20">
                                            <img
                                                src={brandLogoUrl}
                                                alt="Brand logo"
                                                className="h-10 w-10 rounded-lg object-contain"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Logo uploaded ✓</div>
                                                <div className="text-xs text-zinc-500">Will appear on launcher button</div>
                                            </div>
                                            <button
                                                onClick={() => brandLogoInputRef.current?.click()}
                                                className="rounded-lg border border-violet-300 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 dark:border-violet-700 dark:bg-zinc-800 dark:text-violet-400"
                                            >
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        /* Empty upload zone */
                                        <button
                                            onClick={() => brandLogoInputRef.current?.click()}
                                            className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-6 transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-700"
                                        >
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
                                                <ImageIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                    <span className="text-violet-600 dark:text-violet-400">Click to upload</span> your brand logo
                                                </div>
                                                <div className="text-xs text-zinc-400">PNG, JPG, SVG or WebP · Max 1 MB</div>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            )}
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

                            {/* Loading state */}
                            {actionsLoading ? (
                                <div className="flex h-12 items-center justify-center rounded-xl border-2 border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                    <span className="text-xs text-zinc-400">Loading your enabled actions…</span>
                                </div>
                            ) : availableActions.length === 0 ? (
                                /* Empty state — user hasn't enabled any actions yet */
                                <div className="flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 py-5 dark:border-zinc-700 dark:bg-zinc-900">
                                    <span className="text-2xl">⚡</span>
                                    <div className="text-center">
                                        <div className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">No actions enabled yet</div>
                                        <div className="mt-0.5 text-xs text-zinc-400">
                                            Go to{" "}
                                            <button
                                                onClick={() => router.push("/actions")}
                                                className="text-violet-600 underline hover:text-violet-700 dark:text-violet-400"
                                            >
                                                Action Store
                                            </button>{" "}
                                            to enable actions first.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Dropdown trigger */
                                <>
                                    <button
                                        onClick={() => {
                                            setIsActionSelectorOpen(!isActionSelectorOpen);
                                            setIsAvatarOpen(false);
                                        }}
                                        className="flex w-full items-center justify-between rounded-xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                                    >
                                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                            {selectedActions.length === 0
                                                ? "Select actions to display (max 5)"
                                                : `${selectedActions.length} action${selectedActions.length > 1 ? "s" : ""} selected`}
                                        </span>
                                        <ChevronDown
                                            className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isActionSelectorOpen ? "rotate-180" : ""
                                                }`}
                                        />
                                    </button>

                                    {/* Action Selector Dropdown — grouped by category */}
                                    {isActionSelectorOpen && (
                                        <div className="absolute left-0 top-[110%] z-50 mt-2 max-h-[360px] w-full overflow-y-auto rounded-xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900">
                                            {(["stripe", "calendly", "support_tools", "account_management"] as const).map((cat) => {
                                                const catActions = availableActions.filter((a) => a.category === cat);
                                                if (catActions.length === 0) return null;
                                                const catEmoji = CATEGORY_EMOJI[cat] ?? "⚡";
                                                const catLabel = cat.replace(/_/g, " ");
                                                return (
                                                    <div key={cat} className="mb-2">
                                                        <div className="mb-1 flex items-center gap-2 px-2 py-1">
                                                            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                                {catEmoji} {catLabel} ({catActions.length})
                                                            </span>
                                                            <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                                                        </div>
                                                        {catActions.map((action) => {
                                                            const isSelected = selectedActions.includes(action.id);
                                                            const isDisabled = !isSelected && selectedActions.length >= 5;
                                                            return (
                                                                <button
                                                                    key={action.id}
                                                                    onClick={() => !isDisabled && toggleAction(action.id)}
                                                                    disabled={isDisabled}
                                                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 transition-all ${isDisabled ? "cursor-not-allowed opacity-40" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                                                        } ${isSelected ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
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
                                                );
                                            })}
                                        </div>
                                    )}
                                </>
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
                                onClick={() => handlePublish(true)}
                                disabled={isSaving}
                                className="h-12 flex-[2] rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Publishing…
                                    </>
                                ) : saveStatus === "published" ? (
                                    <><Check className="mr-2 h-4 w-4" /> Published!</>
                                ) : saveStatus === "error" ? (
                                    "Error — Retry"
                                ) : isPublished ? (
                                    <>Update &amp; Publish <ArrowRight className="ml-2 h-4 w-4" /></>
                                ) : (
                                    <>Looks Good &amp; Publish <ArrowRight className="ml-2 h-4 w-4" /></>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Live Preview (55%) — real ChatWidget */}
                <div className="relative flex w-[55%] flex-col items-center justify-center gap-3 py-8">
                    {/* Header row: label + Live badge + Desktop/Mobile toggle */}
                    <div className="flex w-full max-w-sm items-center justify-between px-1">
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                                Live Preview
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full bg-violet-100 px-2.5 py-0.5 text-[10px] font-semibold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                                <span className="inline-block h-1.5 w-1.5 rounded-full bg-violet-500" />
                                Preview
                            </span>
                        </div>
                        {/* Desktop / Mobile toggle */}
                        <div className="flex items-center gap-1 rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-900">
                            <button
                                onClick={() => setPreviewMode("desktop")}
                                title="Desktop view"
                                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${previewMode === "desktop"
                                    ? "bg-white text-violet-700 shadow-sm dark:bg-zinc-800 dark:text-violet-400"
                                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    }`}
                            >
                                <Monitor className="h-3.5 w-3.5" />
                                Desktop
                            </button>
                            <button
                                onClick={() => setPreviewMode("mobile")}
                                title="Mobile view"
                                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-all ${previewMode === "mobile"
                                    ? "bg-white text-violet-700 shadow-sm dark:bg-zinc-800 dark:text-violet-400"
                                    : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                    }`}
                            >
                                <Smartphone className="h-3.5 w-3.5" />
                                Mobile
                            </button>
                        </div>
                    </div>

                    {previewMode === "desktop" ? (
                        /* ── Desktop: Browser chrome frame ── */
                        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 w-full max-w-2xl transition-all duration-300">
                            {/* Browser chrome dots */}
                            <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-100 px-3 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                                <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                                <div className="ml-2 h-4 flex-1 rounded bg-white/60 dark:bg-zinc-800 flex items-center px-2">
                                    <span className="text-[9px] text-zinc-400">yoursite.com</span>
                                </div>
                            </div>
                            {/* Mock Website Background */}
                            <div className="relative bg-zinc-50 dark:bg-zinc-900/50" style={{ height: "500px" }}>
                                <div className="p-8">
                                    <div className="h-8 w-32 rounded bg-zinc-200 dark:bg-zinc-800 mb-8" />
                                    <div className="space-y-4">
                                        <div className="h-12 w-3/4 rounded-lg bg-zinc-200 dark:bg-zinc-800 font-bold flex items-center px-4 text-zinc-400 text-sm">Welcome to our Website</div>
                                        <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
                                        <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
                                        <div className="h-4 w-4/6 rounded bg-zinc-100 dark:bg-zinc-800" />
                                    </div>
                                    <div className="mt-12 grid grid-cols-2 gap-4">
                                        <div className="h-24 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700" />
                                        <div className="h-24 rounded-xl bg-white dark:bg-zinc-800 shadow-sm border border-zinc-100 dark:border-zinc-700" />
                                    </div>
                                </div>

                                {/* Floating ChatWidget */}
                                <div className="absolute bottom-0 right-0 w-full h-full flex items-end justify-end pointer-events-none">
                                    <div className={`pointer-events-auto transition-all duration-300 ${previewOpen ? "w-[340px] h-[450px] p-4" : "w-20 h-20"}`}>
                                        <ChatWidget
                                            className="h-full shadow-2xl"
                                            staticConfig={liveConfig}
                                            previewMode={true}
                                            isOpen={previewOpen}
                                            onOpenChange={setPreviewOpen}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ── Mobile: Phone frame ── */
                        <div className="relative mx-auto flex flex-col overflow-hidden rounded-[2.5rem] border-4 border-zinc-300 bg-zinc-200 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 transition-all duration-300"
                            style={{ width: "320px", height: "600px" }}
                        >
                            {/* Phone notch / status bar */}
                            <div className="flex h-7 shrink-0 items-center justify-center bg-zinc-900 dark:bg-zinc-950">
                                <div className="h-3 w-20 rounded-full bg-zinc-800 dark:bg-zinc-700" />
                            </div>
                            {/* Dummy mobile content */}
                            <div className="relative flex-1 bg-white dark:bg-zinc-950 overflow-hidden">
                                <div className="p-4 space-y-4">
                                    <div className="h-6 w-24 rounded bg-zinc-100 dark:bg-zinc-800" />
                                    <div className="h-32 w-full rounded-xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-900/30" />
                                    <div className="space-y-2">
                                        <div className="h-3 w-full rounded bg-zinc-50 dark:bg-zinc-800" />
                                        <div className="h-3 w-full rounded bg-zinc-50 dark:bg-zinc-800" />
                                        <div className="h-3 w-2/3 rounded bg-zinc-50 dark:bg-zinc-800" />
                                    </div>
                                </div>

                                {/* Absolute ChatWidget for Mobile */}
                                <div className="absolute bottom-0 right-0 w-full h-full flex items-end justify-end pointer-events-none">
                                    <div className={`pointer-events-auto transition-all duration-300 ${previewOpen ? "w-full h-full" : "w-20 h-20"}`}>
                                        <ChatWidget
                                            className="h-full"
                                            staticConfig={liveConfig}
                                            previewMode={true}
                                            isOpen={previewOpen}
                                            onOpenChange={setPreviewOpen}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* Home bar */}
                            <div className="flex h-6 shrink-0 items-center justify-center bg-white dark:bg-zinc-950">
                                <div className="h-1 w-24 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                            </div>
                        </div>
                    )}

                    <p className="text-center text-[10px] text-zinc-400 dark:text-zinc-600">
                        Changes reflect instantly as you configure
                    </p>
                </div>
            </div>
        </div >
    );
}
