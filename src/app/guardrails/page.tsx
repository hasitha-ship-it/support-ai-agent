"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    Sparkles,
    ArrowLeft,
    ArrowRight,
    X,
    Brain,
    Shield,
    ShieldAlert,
    Ban,
    Zap,
    HeartHandshake,
    EyeOff,
    Filter,
    Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useGuardrails } from "@/hooks/useGuardrails";

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function ToggleSwitch({
    enabled,
    onChange,
    disabled = false,
    size = "default",
}: {
    enabled: boolean;
    onChange: () => void;
    disabled?: boolean;
    size?: "default" | "small";
}) {
    const sizeClasses = size === "small" ? "h-5 w-9" : "h-6 w-11";
    const dotSizeClasses = size === "small" ? "h-4 w-4" : "h-5 w-5";
    const dotPosition = size === "small"
        ? enabled ? "left-[18px]" : "left-0.5"
        : enabled ? "left-[22px]" : "left-0.5";

    return (
        <button
            onClick={onChange}
            disabled={disabled}
            className={`relative ${sizeClasses} rounded-full transition-all duration-300 ${enabled
                ? "bg-violet-600 shadow-md shadow-violet-500/30"
                : "bg-zinc-200 dark:bg-zinc-700"
                } ${disabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
            <div
                className={`absolute top-0.5 ${dotSizeClasses} rounded-full bg-white shadow-sm transition-all duration-300 ${dotPosition}`}
            />
        </button>
    );
}

// ─── Tag Input ─────────────────────────────────────────────────────────────────
function TagInput({
    tags,
    setTags,
    placeholder,
    disabled = false,
}: {
    tags: string[];
    setTags: (tags: string[]) => void;
    placeholder: string;
    disabled?: boolean;
}) {
    const [inputValue, setInputValue] = React.useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && inputValue.trim()) {
            e.preventDefault();
            if (!tags.includes(inputValue.trim())) {
                setTags([...tags, inputValue.trim()]);
            }
            setInputValue("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2.5 dark:border-zinc-700 dark:bg-zinc-800/50">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                >
                    {tag}
                    {!disabled && (
                        <button
                            onClick={() => removeTag(tag)}
                            className="rounded-full p-0.5 transition-colors hover:bg-violet-200 dark:hover:bg-violet-800"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </span>
            ))}
            {!disabled && (
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? placeholder : "Add more..."}
                    className="min-w-[200px] flex-1 border-none bg-transparent py-1 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-500"
                />
            )}
        </div>
    );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function GuardrailsPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    const { config, loading, saving, updateConfig, saveConfig } = useGuardrails();

    React.useEffect(() => { setMounted(true); }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark" ? "bg-grid-dark" : "bg-grid-light"
        : "bg-grid-light";

    async function handleContinue() {
        await saveConfig();
        router.push("/personality");
    }

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-40">
                <ThemeToggle />
            </div>

            {/* Main Content */}
            <div className="mx-auto max-w-5xl px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                        <Sparkles className="h-4 w-4" />
                        Step 4 of 6
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                        Guardrails & Safety
                    </h1>
                    <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                        Configure AI behavior boundaries and safety protocols
                    </p>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex items-center justify-center py-16 gap-3 text-zinc-400">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Loading your settings…</span>
                    </div>
                )}

                {/* Cards Container */}
                {!loading && (
                    <div className="space-y-6">
                        {/* CARD 1: Core Behavior */}
                        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                            <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-500/25">
                                        <Brain className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            Core Behavior 🧠
                                        </h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Define AI response boundaries
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {/* Restrict to KB */}
                                <div className="flex items-center justify-between px-6 py-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                                                Restrict AI to Knowledge Base
                                            </h3>
                                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                                                Recommended
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                            Prevents the AI from answering general questions outside your domain
                                        </p>
                                    </div>
                                    <ToggleSwitch
                                        enabled={config.restrict_to_kb}
                                        onChange={() => updateConfig({ restrict_to_kb: !config.restrict_to_kb })}
                                    />
                                </div>

                                {/* Competitor Blacklist */}
                                <div className="px-6 py-4">
                                    <div className="mb-3">
                                        <h3 className="font-medium text-zinc-900 dark:text-zinc-50">
                                            Blacklisted Competitors
                                        </h3>
                                        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                                            AI will never recommend or mention these competitors
                                        </p>
                                    </div>
                                    <TagInput
                                        tags={config.blacklisted_competitors}
                                        setTags={(tags) => updateConfig({ blacklisted_competitors: tags })}
                                        placeholder="Type competitor names and press Enter..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* CARD 2: Stability & Advanced Safety */}
                        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                            <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
                                        <Shield className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            Stability & Advanced Safety 🛡️
                                        </h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Core protection layers for your AI agent
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                {/* Anti-Hallucination */}
                                <div className="px-6 py-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
                                                <Brain className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        Anti-Hallucination Mode
                                                    </h3>
                                                    <span className="text-base">🤥</span>
                                                </div>
                                                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                    Strictly limits the AI to your Knowledge Base. If the answer isn&apos;t found, it will say &ldquo;I don&apos;t know&rdquo; instead of guessing.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <ToggleSwitch
                                                enabled={config.anti_hallucination}
                                                onChange={() => updateConfig({ anti_hallucination: !config.anti_hallucination })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Prompt Injection Defense */}
                                <div className="px-6 py-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30">
                                                <ShieldAlert className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        Prompt Injection Defense
                                                    </h3>
                                                    <span className="text-base">🛡️</span>
                                                </div>
                                                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                    Detects and blocks attempts to &ldquo;jailbreak&rdquo; or override the AI&apos;s system instructions (e.g., &ldquo;Ignore previous rules&rdquo;).
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <ToggleSwitch
                                                enabled={config.prompt_injection_defense}
                                                onChange={() => updateConfig({ prompt_injection_defense: !config.prompt_injection_defense })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Spam Protection */}
                                <div className="px-6 py-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                                                <Ban className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        Spam Protection
                                                    </h3>
                                                    <span className="text-base">🛑</span>
                                                </div>
                                                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                    Prevents bot abuse by limiting how many messages a single user can send in a short time.
                                                </p>

                                                {/* Rate Limit Config */}
                                                {config.spam_protection.enabled && (
                                                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/50">
                                                        <Zap className="h-4 w-4 text-violet-500" />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            Limit users to
                                                        </span>
                                                        <input
                                                            type="number"
                                                            value={config.spam_protection.limit}
                                                            onChange={(e) =>
                                                                updateConfig({
                                                                    spam_protection: {
                                                                        ...config.spam_protection,
                                                                        limit: Number(e.target.value),
                                                                    },
                                                                })
                                                            }
                                                            min={1}
                                                            max={1000}
                                                            className="h-8 w-16 rounded-md border border-zinc-200 bg-white px-2 text-center text-sm font-medium text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                                                        />
                                                        <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                            messages per minute
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <ToggleSwitch
                                                enabled={config.spam_protection.enabled}
                                                onChange={() =>
                                                    updateConfig({
                                                        spam_protection: {
                                                            ...config.spam_protection,
                                                            enabled: !config.spam_protection.enabled,
                                                        },
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Escalate on Frustration */}
                                <div className="px-6 py-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-100 to-blue-100 dark:from-sky-900/30 dark:to-blue-900/30">
                                                <HeartHandshake className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        Escalate on Frustration
                                                    </h3>
                                                    <span className="text-base">🤝</span>
                                                </div>
                                                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                    Transfer to human agent if sentiment analysis detects negative emotions or user frustration.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <ToggleSwitch
                                                enabled={config.escalate_on_frustration}
                                                onChange={() => updateConfig({ escalate_on_frustration: !config.escalate_on_frustration })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* PII Masking */}
                                <div className="px-6 py-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex gap-4">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                                                <EyeOff className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                        Redact Sensitive Data
                                                    </h3>
                                                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-400">
                                                        GDPR
                                                    </span>
                                                    <span className="text-base">🔒</span>
                                                </div>
                                                <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                    Automatically hide emails, phone numbers, and credit card info in logs and conversations.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-1">
                                            <ToggleSwitch
                                                enabled={config.redact_sensitive_data}
                                                onChange={() => updateConfig({ redact_sensitive_data: !config.redact_sensitive_data })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Filters */}
                                <div className="px-6 py-5">
                                    <div className="flex gap-4">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-100 to-fuchsia-100 dark:from-pink-900/30 dark:to-fuchsia-900/30">
                                            <Filter className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                                                    Content Filters
                                                </h3>
                                                <span className="text-base">🚫</span>
                                            </div>
                                            <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                Block AI from generating restricted content types.
                                            </p>

                                            {/* Checkbox Filters */}
                                            <div className="mt-4 flex flex-wrap gap-3">
                                                {[
                                                    { key: "hate_speech" as const, label: "Hate Speech" },
                                                    { key: "adult_content" as const, label: "Adult Content" },
                                                    { key: "financial_advice" as const, label: "Financial Advice" },
                                                ].map(({ key, label }) => (
                                                    <label
                                                        key={key}
                                                        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-2.5 transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={config.content_filters[key]}
                                                            onChange={() =>
                                                                updateConfig({
                                                                    content_filters: {
                                                                        ...config.content_filters,
                                                                        [key]: !config.content_filters[key],
                                                                    },
                                                                })
                                                            }
                                                            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-700"
                                                        />
                                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                            {label}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Navigation */}
                <div className="mt-8 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white/80 px-6 py-4 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
                    <Button
                        variant="ghost"
                        onClick={() => router.push("/actions")}
                        className="gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Actions
                    </Button>
                    <Button
                        onClick={handleContinue}
                        disabled={saving || loading}
                        className="h-12 gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-violet-500/30 disabled:opacity-70"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        {saving ? "Saving…" : "Continue"}
                        {!saving && <ArrowRight className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
}
