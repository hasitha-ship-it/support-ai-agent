"use client";

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import {
    Send,
    Minimize2,
    Check,
    Star,
    Zap,
    Shield,
    Rocket,
    Package,
    Crown,
    DollarSign,
    Users,
    Layers,
    MessageCircle,
    X,
} from "lucide-react";
import type { UiConfig } from "@/lib/ui-config";
import { DEFAULT_UI_CONFIG } from "@/lib/ui-config";
import { ACTIONS_REGISTRY } from "@/lib/actions-definitions";

// Helper: resolve action ID → human-readable label
function resolveActionLabel(actionId: string): string {
    const def = ACTIONS_REGISTRY.find((a) => a.id === actionId);
    return def ? def.label : actionId.replace(/_/g, " ");
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
    role: "user" | "assistant";
    content: string;
    id: string;
}

interface ChatWidgetProps {
    staticConfig?: Partial<UiConfig>;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    /** When true, skips real AI calls — shows a dummy reply for UI/UX preview */
    previewMode?: boolean;
}

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    features: string[];
    highlight?: boolean;
}

// ─── Pricing Parser ───────────────────────────────────────────────────────────

const PLAN_ICONS: Record<string, React.ElementType> = {
    free: Package,
    starter: Star,
    basic: Layers,
    grow: Zap,
    growth: Zap,
    pro: Rocket,
    extreme: Shield,
    enterprise: Crown,
    business: Users,
    premium: Crown,
    default: DollarSign,
};

function getPlanIcon(planName: string): React.ElementType {
    const key = planName.toLowerCase().trim();
    for (const [k, Icon] of Object.entries(PLAN_ICONS)) {
        if (key.includes(k)) return Icon;
    }
    return PLAN_ICONS.default;
}

const HIGHLIGHT_PLANS = ["grow", "pro", "extreme", "premium", "popular", "recommended"];

function isPlanHighlighted(name: string): boolean {
    const lower = name.toLowerCase();
    return HIGHLIGHT_PLANS.some((k) => lower.includes(k));
}

/**
 * Parses AI response text to extract structured pricing plan data.
 * Returns null if the message doesn't look like pricing content.
 */
function parsePricingPlans(text: string): PricingPlan[] | null {
    const hasPriceSignal =
        /\$\d+|\bfree\b|\bper month\b|\/mo|\/month|\bplan\b|\bprice\b|\bpricing\b/i.test(text);
    const hasPlanNames =
        /\b(starter|grow|extreme|enterprise|pro|basic|free|premium|business|growth)\b/i.test(text);

    if (!hasPriceSignal || !hasPlanNames) return null;

    const plans: PricingPlan[] = [];

    // Try to split by markdown headings (## Plan Name or ### Plan Name or **Plan Name**)
    // or by numbered sections
    const planBlocks = text.split(
        /(?=##\s+|\*\*[A-Z][a-zA-Z ]+(?:Plan|Tier)?\*\*\s*[\n\r]|^#+\s+[A-Z])/m
    );

    // Parse each candidate block
    for (const block of planBlocks) {
        const trimmed = block.trim();
        if (!trimmed) continue;

        // Extract plan name – look for bold text or heading at top
        const nameMatch = trimmed.match(
            /^#{1,3}\s*\*{0,2}([A-Za-z][A-Za-z\s]+?)\*{0,2}\s*(?:Plan|Tier)?\s*[\n\r]/
        ) || trimmed.match(/^\*{1,2}([A-Za-z][A-Za-z\s]+?)\*{1,2}(?:\s*Plan)?[\s\n\r]/) ||
            trimmed.match(/^([A-Z][a-zA-Z ]+?(?:Plan|Tier)?)\s*[\n\r]/);

        if (!nameMatch) continue;
        const planName = nameMatch[1].trim();
        if (planName.length < 2 || planName.length > 30) continue;

        // Extract price
        const priceMatch = trimmed.match(
            /\$\s*([\d,]+(?:\.\d+)?(?:\/(?:mo(?:nth)?|year|yr))?)|free(?:\s*plan)?|\bno cost\b/i
        );
        if (!priceMatch) continue;

        let price = "";
        let period = "";
        const rawPrice = priceMatch[0];
        if (/free|no cost/i.test(rawPrice)) {
            price = "Free";
            period = "";
        } else {
            const dollarMatch = rawPrice.match(/\$([\d,]+(?:\.\d+)?)/);
            price = dollarMatch ? `$${dollarMatch[1]}` : rawPrice;
            period = /\/yr|\/year/i.test(rawPrice) ? "/yr" : "/mo";
        }

        // Extract features (bullet points or dashes)
        const featureLines: string[] = [];
        const lines = trimmed.split(/[\n\r]+/);
        for (const line of lines) {
            const stripped = line
                .replace(/^[\s\-\*\u2022\u25aa\u25cf•]+/, "")
                .replace(/\*\*/g, "")
                .trim();
            if (
                stripped.length > 3 &&
                stripped.length < 120 &&
                !stripped.match(/^\$/) &&
                !stripped.match(/^[A-Z][a-zA-Z ]+Plan\s*$/) &&
                stripped !== planName
            ) {
                featureLines.push(stripped);
            }
        }

        plans.push({
            name: planName,
            price,
            period,
            features: featureLines.slice(0, 8),
            highlight: isPlanHighlighted(planName),
        });
    }

    // Fallback: simpler line-by-line parsing for less-structured responses
    if (plans.length === 0) {
        const lines = text.split(/[\n\r]+/);
        let currentPlan: PricingPlan | null = null;

        for (const rawLine of lines) {
            const line = rawLine.trim();
            if (!line) continue;

            // Detect plan header lines like: "**Starter** – $29/mo" or "## Grow Plan – $49/month"
            const headerMatch = line.match(
                /^#{0,3}\s*\*{0,2}([A-Za-z][A-Za-z\s]{1,20}?)\*{0,2}\s*[-–—:]\s*(\$[\d,]+(?:\/(?:mo(?:nth)?|yr(?:ear)?))?|Free)/i
            );
            if (headerMatch) {
                if (currentPlan && currentPlan.features.length > 0) {
                    plans.push(currentPlan);
                }
                const [, name, rawP] = headerMatch;
                const isFree = /free/i.test(rawP);
                currentPlan = {
                    name: name.trim(),
                    price: isFree ? "Free" : rawP.replace(/\/mo(?:nth)?/i, "").replace(/\/yr(?:ear)?/i, ""),
                    period: isFree ? "" : /yr|year/i.test(rawP) ? "/yr" : "/mo",
                    features: [],
                    highlight: isPlanHighlighted(name),
                };
                continue;
            }

            // Accumulate features
            if (currentPlan) {
                const feat = line
                    .replace(/^[\-\*\u2022\u25aa\u25cf•]+\s*/, "")
                    .replace(/\*\*/g, "")
                    .trim();
                if (feat.length > 3 && feat.length < 120 && currentPlan.features.length < 8) {
                    currentPlan.features.push(feat);
                }
            }
        }
        if (currentPlan && currentPlan.features.length > 0) {
            plans.push(currentPlan);
        }
    }

    return plans.length >= 2 ? plans : null;
}

// ─── Pricing Cards Component ──────────────────────────────────────────────────

function PricingCards({ plans, primaryColor, isDark }: {
    plans: PricingPlan[];
    primaryColor: string;
    isDark: boolean;
}) {
    return (
        <div className="w-full space-y-3 py-1">
            {plans.map((plan, i) => {
                const Icon = getPlanIcon(plan.name);
                const borderStyle = plan.highlight
                    ? { borderColor: primaryColor, borderWidth: "2px" }
                    : { borderColor: isDark ? "#3f3f46" : "#e4e4e7", borderWidth: "1px" };

                return (
                    <div
                        key={i}
                        className={`rounded-xl border p-3 transition-all ${isDark ? "bg-zinc-900/50" : "bg-white/80"
                            }`}
                        style={borderStyle}
                    >
                        {/* Card Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                style={{
                                    backgroundColor: plan.highlight
                                        ? primaryColor
                                        : isDark ? "#27272a" : "#f4f4f5",
                                }}
                            >
                                <Icon
                                    className="h-4 w-4"
                                    style={{ color: plan.highlight ? "#fff" : primaryColor }}
                                />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm font-bold ${isDark ? "text-zinc-100" : "text-zinc-900"}`}>
                                        {plan.name}
                                    </span>
                                    {plan.highlight && (
                                        <span
                                            className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold text-white"
                                            style={{ backgroundColor: primaryColor }}
                                        >
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-baseline gap-0.5 mt-0.5">
                                    <span
                                        className="text-lg font-extrabold"
                                        style={{ color: primaryColor }}
                                    >
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className={`text-xs ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Features */}
                        {plan.features.length > 0 && (
                            <ul className="space-y-1">
                                {plan.features.map((feat, j) => (
                                    <li key={j} className="flex items-start gap-1.5">
                                        <Check
                                            className="mt-0.5 h-3 w-3 shrink-0"
                                            style={{ color: primaryColor }}
                                        />
                                        <span className={`text-xs leading-relaxed ${isDark ? "text-zinc-300" : "text-zinc-600"}`}>
                                            {feat}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

// ─── Markdown-lite renderer ───────────────────────────────────────────────────

function renderMarkdownLite(text: string, isDark: boolean): React.ReactNode[] {
    const lines = text.split(/\r?\n/);
    const nodes: React.ReactNode[] = [];
    let i = 0;

    const textColor = isDark ? "text-zinc-100" : "text-zinc-900";
    const mutedColor = isDark ? "text-zinc-300" : "text-zinc-600";

    while (i < lines.length) {
        const line = lines[i];

        // Skip completely empty lines between blocks (renders as spacer)
        if (line.trim() === "") {
            nodes.push(<div key={i} className="h-1" />);
            i++;
            continue;
        }

        // Heading ## or ###
        if (/^#{1,3}\s/.test(line)) {
            const headingText = line.replace(/^#{1,3}\s*/, "").replace(/\*\*/g, "").trim();
            nodes.push(
                <p key={i} className={`text-sm font-bold mt-2 mb-1 ${textColor}`}>
                    {headingText}
                </p>
            );
            i++;
            continue;
        }

        // Bullet list item (-, *, •)
        if (/^[\-\*\u2022•]\s/.test(line.trim())) {
            const bulletText = line.trim().replace(/^[\-\*\u2022•]\s*/, "").replace(/\*\*/g, "").trim();
            nodes.push(
                <div key={i} className="flex items-start gap-1.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400" />
                    <span className={`text-xs leading-relaxed ${mutedColor}`}>{bulletText}</span>
                </div>
            );
            i++;
            continue;
        }

        // Regular paragraph – inline bold handling
        const richLine = inlineBold(line.trim(), isDark);
        nodes.push(
            <p key={i} className={`text-sm leading-relaxed ${textColor}`}>
                {richLine}
            </p>
        );
        i++;
    }

    return nodes;
}

function inlineBold(text: string, isDark: boolean): React.ReactNode {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={i} className={isDark ? "text-zinc-100 font-semibold" : "text-zinc-900 font-semibold"}>
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return part;
    });
}

// ─── Rich Message Renderer ────────────────────────────────────────────────────

function MessageBubble({ msg, primaryColor, isDark, bubbleBg }: {
    msg: Message;
    primaryColor: string;
    isDark: boolean;
    bubbleBg: string;
}) {
    if (msg.role === "user") {
        return (
            <div
                className="max-w-[78%] rounded-2xl rounded-tr-sm px-3 py-2 text-sm leading-relaxed text-white"
                style={{ backgroundColor: primaryColor }}
            >
                {msg.content}
            </div>
        );
    }

    // Assistant: detect pricing content
    const plans = parsePricingPlans(msg.content);

    if (plans) {
        // Extract intro text (anything before first price plan mention)
        const introEnd = msg.content.search(
            /\$\d+|\bfree plan\b|#{1,3}\s+[A-Z]|\*\*[A-Z][a-zA-Z ]+\*\*/
        );
        const introText = introEnd > 10 ? msg.content.slice(0, introEnd).trim() : "";

        return (
            <div className={`max-w-[90%] rounded-2xl rounded-tl-sm ${bubbleBg} px-3 py-3 space-y-2`}>
                {introText && (
                    <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-200" : "text-zinc-700"}`}>
                        {introText}
                    </p>
                )}
                <PricingCards plans={plans} primaryColor={primaryColor} isDark={isDark} />
            </div>
        );
    }

    // Regular assistant message with markdown-lite rendering
    return (
        <div className={`max-w-[85%] rounded-2xl rounded-tl-sm ${bubbleBg} px-3 py-2 space-y-0.5`}>
            {renderMarkdownLite(msg.content, isDark)}
        </div>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderAvatarContent(avatar: string, size = "h-full w-full") {
    if (avatar.startsWith("/")) {
        return <img src={avatar} alt="Agent" className={`${size} object-cover`} />;
    }
    return <span className="text-xl">{avatar}</span>;
}

function TypingDots() {
    return (
        <div className="flex items-center gap-1 px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
            <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
            <div className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce" />
        </div>
    );
}

// ─── ChatWidget ───────────────────────────────────────────────────────────────

export function ChatWidget({ staticConfig, isOpen: controlledOpen, onOpenChange, className, previewMode = false }: ChatWidgetProps) {
    const [uiConfig, setUiConfig] = React.useState<UiConfig>({ ...DEFAULT_UI_CONFIG, ...staticConfig });
    const [token, setToken] = React.useState<string | null>(null);
    const [configLoaded, setConfigLoaded] = React.useState(false);
    const [open, setOpen] = React.useState(controlledOpen ?? true);

    const [messages, setMessages] = React.useState<Message[]>([]);
    const [input, setInput] = React.useState("");
    const [isTyping, setIsTyping] = React.useState(false);
    const [sessionId] = React.useState(() => Math.random().toString(36).slice(2));

    const messagesEndRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const isOpen = controlledOpen !== undefined ? controlledOpen : open;
    const setIsOpen = (v: boolean) => {
        setOpen(v);
        onOpenChange?.(v);
    };

    // ── Load saved ui_config + auth token on mount ────────────────────────────
    React.useEffect(() => {
        async function init() {
            try {
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );
                const { data: { session } } = await supabase.auth.getSession();
                if (!session) return;

                setToken(session.access_token);

                if (!staticConfig) {
                    const res = await fetch("/api/bot/update-ui", {
                        headers: { Authorization: `Bearer ${session.access_token}` },
                    });
                    if (res.ok) {
                        const { uiConfig: saved } = await res.json();
                        if (saved) setUiConfig({ ...DEFAULT_UI_CONFIG, ...saved });
                    }
                }
            } catch {
                // fall back to defaults
            } finally {
                setConfigLoaded(true);
            }
        }
        init();
    }, []);

    // ── Sync uiConfig whenever staticConfig prop changes (live preview) ────────
    React.useEffect(() => {
        if (staticConfig) {
            setUiConfig((prev) => ({ ...prev, ...staticConfig }));
        }
    }, [staticConfig]);

    React.useEffect(() => {
        if (!configLoaded) return;
        if (messages.length === 0 && uiConfig.welcomeMessage) {
            setMessages([{ role: "assistant", content: uiConfig.welcomeMessage, id: "welcome" }]);
        }
    }, [configLoaded, uiConfig.welcomeMessage]);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // ── Send message ──────────────────────────────────────────────────────────
    async function sendMessage(text: string) {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = { role: "user", content: text.trim(), id: Date.now().toString() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // ── Preview mode: skip real API, show dummy reply ──────────────────────
        if (previewMode) {
            await new Promise((resolve) => setTimeout(resolve, 800));
            setIsTyping(false);
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "This is a preview of how I will respond.",
                    id: Date.now().toString(),
                },
            ]);
            setTimeout(() => inputRef.current?.focus(), 50);
            return;
        }

        try {
            const history = [...messages.filter((m) => m.id !== "welcome"), userMsg].map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ messages: history, sessionId }),
            });

            const data = await res.json();

            if (data.success && data.message) {
                setMessages((prev) => [
                    ...prev,
                    { role: "assistant", content: data.message, id: Date.now().toString() },
                ]);
            } else {
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "assistant",
                        content: data.error ?? "Sorry, I couldn't process that. Please try again.",
                        id: Date.now().toString(),
                    },
                ]);
            }
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Connection error. Please check your internet and try again.",
                    id: Date.now().toString(),
                },
            ]);
        } finally {
            setIsTyping(false);
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        sendMessage(input);
    }

    function handleQuickAction(label: string) {
        sendMessage(label);
    }

    // ── Theme ─────────────────────────────────────────────────────────────────
    // Detect system preference for "auto" mode
    const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = uiConfig.themeMode === "dark" || (uiConfig.themeMode === "auto" && prefersDark);
    const themeClasses = isDark ? "bg-zinc-950 text-zinc-100" : "bg-white text-zinc-900";
    const bubbleBg = isDark ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900";
    const inputBg = isDark
        ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500"
        : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400";

    // ── Render ────────────────────────────────────────────────────────────────
    if (!isOpen) {
        return (
            <div className={`flex items-end justify-end p-4 ${className}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all hover:scale-110 active:scale-95"
                    style={{ backgroundColor: uiConfig.primaryColor }}
                >
                    {uiConfig.launcherStyle === "agent" ? (
                        <img
                            src="/Robot-launcher.png"
                            alt="Agent Launcher"
                            className="h-full w-full object-cover"
                        />
                    ) : uiConfig.launcherStyle === "brand" && uiConfig.brandLogoUrl ? (
                        <img
                            src={uiConfig.brandLogoUrl}
                            alt="Brand Logo"
                            className="h-9 w-9 object-contain"
                        />
                    ) : (
                        <MessageCircle className="h-7 w-7 text-white" />
                    )}
                </button>
            </div>
        );
    }

    return (
        <div
            className={`flex flex-col h-full overflow-hidden rounded-2xl border shadow-2xl transition-all ${isDark ? "border-zinc-800" : "border-zinc-200"
                } ${themeClasses} ${className ?? ""}`}
        >
            {/* ── Header ── */}
            <div
                className="flex items-center gap-3 px-4 py-3 shrink-0"
                style={{ backgroundColor: uiConfig.primaryColor }}
            >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 overflow-hidden backdrop-blur-sm">
                    {renderAvatarContent(uiConfig.avatar)}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-white truncate">{uiConfig.agentName}</div>
                    <div className="text-xs text-white/80">Online • Responds instantly</div>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setIsOpen(false)}
                        className="rounded-lg p-1.5 text-white/70 transition-all hover:bg-white/10 hover:text-white"
                        title="Minimize"
                    >
                        <Minimize2 className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-700">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                    >
                        {msg.role === "assistant" && (
                            <div
                                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full overflow-hidden"
                                style={{ backgroundColor: uiConfig.primaryColor }}
                            >
                                {renderAvatarContent(uiConfig.avatar, "h-full w-full")}
                            </div>
                        )}
                        <MessageBubble
                            msg={msg}
                            primaryColor={uiConfig.primaryColor}
                            isDark={isDark}
                            bubbleBg={bubbleBg}
                        />
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && uiConfig.showTypingIndicator && (
                    <div className="flex items-start gap-2">
                        <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full overflow-hidden"
                            style={{ backgroundColor: uiConfig.primaryColor }}
                        >
                            {renderAvatarContent(uiConfig.avatar, "h-full w-full")}
                        </div>
                        <div className={`rounded-2xl rounded-tl-sm ${bubbleBg}`}>
                            <TypingDots />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Action Chips ── */}
            {uiConfig.quickActions.length > 0 && messages.length <= 1 && (
                <div
                    className={`px-4 pb-2 flex flex-wrap gap-1.5 ${isDark ? "border-t border-zinc-800" : "border-t border-zinc-100"
                        } pt-2`}
                >
                    {uiConfig.quickActions.map((actionId) => {
                        const label = resolveActionLabel(actionId);
                        return (
                            <button
                                key={actionId}
                                onClick={() => handleQuickAction(label)}
                                disabled={isTyping}
                                className="rounded-full border px-3 py-1 text-xs font-medium transition-all hover:opacity-80 disabled:opacity-40"
                                style={{ borderColor: uiConfig.primaryColor, color: uiConfig.primaryColor }}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ── Input Bar ── */}
            <div
                className={`px-4 pb-4 pt-2 shrink-0 ${isDark ? "border-t border-zinc-800" : "border-t border-zinc-100"
                    }`}
            >
                <form onSubmit={handleSubmit} className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message…"
                        disabled={isTyping}
                        className={`flex-1 rounded-xl border px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-opacity-30 disabled:opacity-50 ${inputBg}`}
                        style={{ "--tw-ring-color": uiConfig.primaryColor } as React.CSSProperties}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white transition-all hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: uiConfig.primaryColor }}
                    >
                        <Send className="h-4 w-4" />
                    </button>
                </form>
                <p className={`mt-1.5 text-center text-[10px] ${isDark ? "text-zinc-600" : "text-zinc-400"}`}>
                    Powered by AI · Press Enter to send
                </p>
            </div>
        </div>
    );
}
