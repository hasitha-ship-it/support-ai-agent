"use client";

import * as React from "react";
import { createClient } from "@supabase/supabase-js";
import { Send, X, Minimize2, MessageCircle, Bot } from "lucide-react";
import type { UiConfig } from "@/lib/ui-config";
import { DEFAULT_UI_CONFIG } from "@/lib/ui-config";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
    role: "user" | "assistant";
    content: string;
    id: string;
}

interface ChatWidgetProps {
    /** If provided, widget uses this config instead of fetching from API */
    staticConfig?: Partial<UiConfig>;
    /** Control open/close from parent */
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    /** CSS class wrapper */
    className?: string;
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

export function ChatWidget({ staticConfig, isOpen: controlledOpen, onOpenChange, className }: ChatWidgetProps) {
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

    // Sync controlled open state
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

                // Load ui_config unless caller supplied staticConfig
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

    // Pre-load welcome message when config is ready
    React.useEffect(() => {
        if (!configLoaded) return;
        if (messages.length === 0 && uiConfig.welcomeMessage) {
            setMessages([
                {
                    role: "assistant",
                    content: uiConfig.welcomeMessage,
                    id: "welcome",
                },
            ]);
        }
    }, [configLoaded, uiConfig.welcomeMessage]);

    // Auto-scroll messages to bottom
    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    // ── Send message to /api/chat ─────────────────────────────────────────────
    async function sendMessage(text: string) {
        if (!text.trim() || isTyping) return;

        const userMsg: Message = { role: "user", content: text.trim(), id: Date.now().toString() };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            // Build conversation history for API (exclude welcome msg)
            const history = [...messages.filter(m => m.id !== "welcome"), userMsg].map(m => ({
                role: m.role,
                content: m.content,
            }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({
                    messages: history,
                    sessionId,
                }),
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

    // ── Resolved theme ────────────────────────────────────────────────────────
    const isDark = uiConfig.themeMode === "dark";

    const themeClasses = isDark
        ? "bg-zinc-950 text-zinc-100"
        : "bg-white text-zinc-900";

    const bubbleBg = isDark ? "bg-zinc-800 text-zinc-100" : "bg-zinc-100 text-zinc-900";
    const inputBg = isDark ? "bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" : "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400";

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className={`flex flex-col h-full overflow-hidden rounded-2xl border shadow-2xl transition-all ${isDark ? "border-zinc-800" : "border-zinc-200"} ${themeClasses} ${className ?? ""}`}>
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
                        onClick={() => setIsOpen(!isOpen)}
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
                        <div
                            className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user"
                                ? "rounded-tr-sm text-white"
                                : `${bubbleBg} rounded-tl-sm`
                                }`}
                            style={msg.role === "user" ? { backgroundColor: uiConfig.primaryColor } : undefined}
                        >
                            {msg.content}
                        </div>
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
                <div className={`px-4 pb-2 flex flex-wrap gap-1.5 ${isDark ? "border-t border-zinc-800" : "border-t border-zinc-100"} pt-2`}>
                    {uiConfig.quickActions.map((action) => (
                        <button
                            key={action}
                            onClick={() => handleQuickAction(action)}
                            disabled={isTyping}
                            className="rounded-full border px-3 py-1 text-xs font-medium transition-all hover:opacity-80 disabled:opacity-40"
                            style={{
                                borderColor: uiConfig.primaryColor,
                                color: uiConfig.primaryColor,
                            }}
                        >
                            {action}
                        </button>
                    ))}
                </div>
            )}

            {/* ── Input Bar ── */}
            <div className={`px-4 pb-4 pt-2 shrink-0 ${isDark ? "border-t border-zinc-800" : "border-t border-zinc-100"}`}>
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
