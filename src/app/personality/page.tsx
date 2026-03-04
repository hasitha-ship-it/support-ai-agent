"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    Sparkles,
    ArrowLeft,
    ArrowRight,
    ChevronDown,
    Check,
    Wand2,
    Bot,
    Zap,
    Brain,
    Flame,
    Smile,
    Meh,
    Skull,
    Briefcase,
    Loader2,
    Lock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { usePersonality } from "@/hooks/usePersonality";

// ─── Logo Components ───────────────────────────────────────────────────────────

function XAILogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function OpenAILogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.04 6.04 0 0 0-6.51-2.9A6.06 6.06 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.04 6.04 0 0 0 .75 7.1 5.98 5.98 0 0 0 .5 4.91 6.05 6.05 0 0 0 6.52 2.9 5.98 5.98 0 0 0 4.5 2.01 6.05 6.05 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.05 6.05 0 0 0-.74-7.07Zm-9.02 12.6a4.47 4.47 0 0 1-2.88-1.04l.14-.08 4.78-2.75a.8.8 0 0 0 .4-.68v-6.74l2 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.48 4.49Zm-9.66-4.12a4.47 4.47 0 0 1-.54-3.02l.14.09 4.79 2.75a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 20a4.5 4.5 0 0 1-6.14-1.65ZM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98V11.6a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.87Zm16.6 3.86L13.1 8.36l2-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.67 8.1v-5.67a.8.8 0 0 0-.4-.67Zm2-3.02l-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66ZM8.3 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.37-3.45l-.14.08L8.7 5.46a.8.8 0 0 0-.4.68v6.72Z" />
        </svg>
    );
}

// ─── Model & Tone Data (mirrors config/ai-models.ts for UI) ──────────────────

interface UIModel {
    id: string;
    name: string;
    provider: string;
    credits: number;
    description: string;
    icon: React.ReactNode;
    color: string;
    freeTier: boolean;
}

const aiModels: UIModel[] = [
    { id: "gpt-4o-mini", name: "GPT-4o Mini", provider: "OpenAI", credits: 1, freeTier: true, description: "Fast, cost-effective model for quick responses.", icon: <OpenAILogo className="h-4 w-4" />, color: "bg-teal-500" },
    { id: "gpt-4o", name: "GPT-4o", provider: "OpenAI", credits: 2, freeTier: false, description: "OpenAI's flagship model for complex reasoning.", icon: <OpenAILogo className="h-4 w-4" />, color: "bg-emerald-500" },
    { id: "o1", name: "OpenAI o1", provider: "OpenAI", credits: 5, freeTier: false, description: "Advanced reasoning with step-by-step thinking.", icon: <OpenAILogo className="h-4 w-4" />, color: "bg-black" },
    { id: "claude-3.5-sonnet", name: "Claude 3.5 Sonnet", provider: "Anthropic", credits: 2, freeTier: false, description: "Best for nuanced writing and complex understanding.", icon: <Image src="/claude.svg" alt="Claude" width={20} height={20} className="h-5 w-5" />, color: "bg-orange-500" },
    { id: "claude-3-haiku", name: "Claude 3 Haiku", provider: "Anthropic", credits: 1, freeTier: false, description: "Fastest Claude model, ideal for real-time chat.", icon: <Image src="/claude.svg" alt="Claude" width={20} height={20} className="h-5 w-5" />, color: "bg-orange-400" },
    { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", provider: "Google", credits: 2, freeTier: false, description: "Multimodal with massive context window.", icon: <Image src="/gemini-ai.svg" alt="Gemini" width={20} height={20} className="h-5 w-5" />, color: "bg-blue-500" },
    { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", provider: "Google", credits: 1, freeTier: false, description: "High-speed model for high-volume tasks.", icon: <Image src="/gemini-ai.svg" alt="Gemini" width={20} height={20} className="h-5 w-5" />, color: "bg-sky-500" },
    { id: "deepseek-v3", name: "DeepSeek V3", provider: "DeepSeek", credits: 1, freeTier: false, description: "Open-weights model rivaling top proprietary models.", icon: <Image src="/deepseek.svg" alt="DeepSeek" width={20} height={20} className="h-5 w-5" />, color: "bg-indigo-600" },
    { id: "deepseek-r1", name: "DeepSeek R1", provider: "DeepSeek", credits: 1, freeTier: false, description: "Specialized for math, coding, and logical deduction.", icon: <Image src="/deepseek.svg" alt="DeepSeek" width={20} height={20} className="h-5 w-5" />, color: "bg-indigo-500" },
    { id: "grok-2", name: "Grok 2", provider: "xAI", credits: 2, freeTier: false, description: "Real-time knowledge from the X platform.", icon: <XAILogo className="h-4 w-4" />, color: "bg-zinc-900" },
    { id: "grok-2-mini", name: "Grok 2 Mini", provider: "xAI", credits: 1, freeTier: false, description: "Faster, lightweight Grok optimized for speed.", icon: <XAILogo className="h-4 w-4" />, color: "bg-zinc-700" },
    { id: "llama-3.3", name: "Llama 3.3", provider: "Meta", credits: 1, freeTier: false, description: "Meta's powerful open-source workhorse.", icon: <Image src="/llama.svg" alt="Llama" width={20} height={20} className="h-5 w-5 invert dark:invert-0" />, color: "bg-blue-600" },
    { id: "mistral-large-2", name: "Mistral Large 2", provider: "Mistral", credits: 2, freeTier: false, description: "Europe's leading multilingual reasoning model.", icon: <Image src="/Mistral .svg" alt="Mistral" width={20} height={20} className="h-5 w-5" />, color: "bg-amber-500" },
];

const toneOptions = [
    { id: "empathetic", label: "Empathetic", icon: <Smile className="h-4 w-4" />, description: "Warm & supportive", color: "text-rose-500" },
    { id: "professional", label: "Professional", icon: <Briefcase className="h-4 w-4" />, description: "Polished & reliable", color: "text-slate-600" },
    { id: "neutral", label: "Neutral", icon: <Meh className="h-4 w-4" />, description: "Balanced & clear", color: "text-blue-500" },
    { id: "direct", label: "Direct", icon: <Zap className="h-4 w-4" />, description: "Concise & fast", color: "text-amber-500" },
    { id: "formal", label: "Formal", icon: <Briefcase className="h-4 w-4" />, description: "Corporate tone", color: "text-slate-600" },
    { id: "witty", label: "Witty", icon: <Flame className="h-4 w-4" />, description: "Clever & fun", color: "text-orange-500" },
    { id: "pirate", label: "Pirate", icon: <Skull className="h-4 w-4" />, description: "Arr, matey!", color: "text-zinc-600" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PersonalityPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isModelOpen, setIsModelOpen] = React.useState(false);
    const [isToneOpen, setIsToneOpen] = React.useState(false);
    const [isConnecting, setIsConnecting] = React.useState(true);

    const {
        config,
        loading,
        saving,
        generating,
        error,
        planAllowsCurrentModel,
        updateConfig,
        saveConfig,
        generatePrompt,
    } = usePersonality();

    React.useEffect(() => { setMounted(true); }, []);

    // Re-trigger animation when model changes
    React.useEffect(() => {
        setIsConnecting(false);
        const timeout = setTimeout(() => setIsConnecting(true), 100);
        return () => clearTimeout(timeout);
    }, [config.ai_model]);

    // Auto-generate system prompt when tone changes (skip during initial load)
    const toneRef = React.useRef<string | null>(null);
    React.useEffect(() => {
        if (loading) return; // wait until config has loaded
        if (toneRef.current === null) {
            // first time — just record the current tone, don't generate
            toneRef.current = config.tone_of_voice;
            return;
        }
        if (toneRef.current !== config.tone_of_voice) {
            toneRef.current = config.tone_of_voice;
            generatePrompt(); // auto-fill system prompt on tone change
        }
    }, [config.tone_of_voice, loading]);

    const gridClass = mounted
        ? resolvedTheme === "dark" ? "bg-grid-dark" : "bg-grid-light"
        : "bg-grid-light";

    const selectedModel = aiModels.find((m) => m.id === config.ai_model) ?? aiModels[0];
    const selectedTone = toneOptions.find((t) => t.id === config.tone_of_voice) ?? toneOptions[0];


    async function handleContinue() {
        await saveConfig();
        router.push("/ui-setup");
    }

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            <div className="fixed top-6 right-6 z-40">
                <ThemeToggle />
            </div>

            {/* Main Container */}
            <div className="mx-auto flex min-h-screen max-w-7xl px-12 py-8">

                {/* LEFT COLUMN: Configuration */}
                <div className="flex w-1/2 flex-col justify-center pr-12">
                    {/* Header */}
                    <div className="mb-8 pl-1">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                            <Sparkles className="h-4 w-4" />
                            Step 5 of 6
                        </div>
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                                    Agent Personality
                                </h1>
                                <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">
                                    Define the brain and soul of your AI agent.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Upgrade Banner for locked model */}
                    {!planAllowsCurrentModel && (
                        <div className="mb-4 flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900 dark:bg-amber-900/20">
                            <Lock className="h-4 w-4 shrink-0 text-amber-600" />
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                                Premium models require a <strong>Pro or Enterprise</strong> plan. Your free trial uses <strong>GPT-4o Mini</strong>.
                            </p>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex items-center gap-3 py-12 text-zinc-400">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading settings…</span>
                        </div>
                    ) : (
                        <div className="max-w-xl space-y-6">
                            {/* 1. MODEL SELECTOR */}
                            <div className="relative z-30">
                                <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    AI Model
                                </label>
                                <button
                                    onClick={() => { setIsModelOpen(!isModelOpen); setIsToneOpen(false); }}
                                    className="flex w-full items-center justify-between rounded-2xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${selectedModel.color}`}>
                                            {selectedModel.icon}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                                {selectedModel.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                                <span>Powered by {selectedModel.provider}</span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
                                                    <Zap className="h-3 w-3 fill-current" />
                                                    {selectedModel.credits} Credit{selectedModel.credits > 1 ? "s" : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isModelOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isModelOpen && (
                                    <div className="absolute left-0 top-[110%] z-50 mt-2 max-h-[500px] w-full overflow-y-auto rounded-3xl border border-zinc-100 bg-white p-2 shadow-2xl ring-1 ring-black/5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-200 dark:border-zinc-800 dark:bg-zinc-900 dark:scrollbar-thumb-zinc-700">
                                        <div className="space-y-0.5">
                                            {aiModels.map((model, idx) => {
                                                const showDivider = idx > 0 && aiModels[idx - 1].provider !== model.provider;
                                                const isLocked = !planAllowsCurrentModel && !model.freeTier;
                                                return (
                                                    <React.Fragment key={model.id}>
                                                        {showDivider && <div className="mx-2 my-2 h-px bg-zinc-100 dark:bg-zinc-800" />}
                                                        <button
                                                            onClick={() => {
                                                                updateConfig({ ai_model: model.id });
                                                                setIsModelOpen(false);
                                                            }}
                                                            disabled={isLocked}
                                                            className={`group flex w-full items-start justify-between rounded-xl px-4 py-3 transition-all ${isLocked
                                                                ? "cursor-not-allowed opacity-50"
                                                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                                                } ${config.ai_model === model.id ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                        >
                                                            <div className="flex items-start gap-4">
                                                                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm ${isLocked ? "opacity-60" : "transition-transform group-hover:scale-105"} ${model.color}`}>
                                                                    {model.icon}
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="flex items-center gap-2 text-base font-bold text-zinc-900 dark:text-zinc-50">
                                                                        {model.name}
                                                                        {isLocked && <Lock className="h-3.5 w-3.5 text-zinc-400" />}
                                                                    </div>
                                                                    <div className="mt-0.5 pr-2 text-xs font-medium leading-relaxed text-zinc-500 dark:text-zinc-400">
                                                                        {model.description}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex shrink-0 items-center gap-3">
                                                                <div className={`flex items-center gap-1.5 rounded-lg border border-zinc-100 bg-white px-2 py-1 text-sm font-bold shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${model.credits >= 2 ? "text-amber-600 dark:text-amber-400" : "text-zinc-500 dark:text-zinc-400"}`}>
                                                                    <Zap className="h-3.5 w-3.5 fill-current" />
                                                                    {model.credits}
                                                                </div>
                                                                {config.ai_model === model.id && (
                                                                    <Check className="h-5 w-5 text-violet-600" />
                                                                )}
                                                            </div>
                                                        </button>
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 2. SYSTEM PROMPT */}
                            <div>
                                <div className="mb-2 flex items-center justify-between">
                                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                        System Instructions
                                    </label>
                                    <button
                                        onClick={() => generatePrompt()}
                                        disabled={generating}
                                        className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-violet-900/30 dark:text-violet-300"
                                    >
                                        {generating ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Wand2 className="h-3 w-3" />
                                        )}
                                        {generating ? "Generating…" : "Auto-Generate"}
                                    </button>
                                </div>
                                <textarea
                                    value={config.system_prompt}
                                    onChange={(e) => updateConfig({ system_prompt: e.target.value })}
                                    placeholder="You are a helpful assistant..."
                                    maxLength={8000}
                                    className="min-h-[160px] w-full resize-none rounded-2xl border-2 border-zinc-100 bg-white p-4 text-sm font-medium text-zinc-700 placeholder:text-zinc-400 focus:border-violet-200 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:ring-violet-900/30"
                                />
                                <div className="mt-1 text-right text-xs text-zinc-400">
                                    {config.system_prompt.length}/8000
                                </div>
                            </div>

                            {/* 3. TONE SELECTOR */}
                            <div className="relative z-20">
                                <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">
                                    Tone of Voice
                                </label>
                                <button
                                    onClick={() => { setIsToneOpen(!isToneOpen); setIsModelOpen(false); }}
                                    className="flex w-full items-center justify-between rounded-2xl border-2 border-zinc-100 bg-white px-4 py-3 shadow-sm transition-all hover:border-violet-200 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-violet-800 dark:focus:ring-violet-900/30"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-50 ${selectedTone.color} dark:bg-zinc-800`}>
                                            {selectedTone.icon}
                                        </div>
                                        <div className="text-left">
                                            <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{selectedTone.label}</div>
                                            <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{selectedTone.description}</div>
                                        </div>
                                    </div>
                                    <ChevronDown className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${isToneOpen ? "rotate-180" : ""}`} />
                                </button>

                                {isToneOpen && (
                                    <div className="absolute left-0 right-0 top-[110%] z-50 mt-2 max-h-[300px] overflow-y-auto rounded-3xl border border-zinc-100 bg-white p-2 shadow-xl ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900">
                                        <div className="grid grid-cols-1 gap-1">
                                            {toneOptions.map((tone) => (
                                                <button
                                                    key={tone.id}
                                                    onClick={() => { updateConfig({ tone_of_voice: tone.id }); setIsToneOpen(false); }}
                                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${config.tone_of_voice === tone.id ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-50 text-xs ${tone.color} dark:bg-zinc-800`}>
                                                            {tone.icon}
                                                        </div>
                                                        <div className="text-left">
                                                            <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">{tone.label}</div>
                                                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{tone.description}</div>
                                                        </div>
                                                    </div>
                                                    {config.tone_of_voice === tone.id && <Check className="h-4 w-4 text-violet-600" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center gap-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/guardrails")}
                                    className="h-12 flex-1 rounded-xl border-2 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back
                                </Button>
                                <Button
                                    onClick={handleContinue}
                                    disabled={saving || loading}
                                    className="h-12 flex-[2] rounded-xl bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 disabled:opacity-70"
                                >
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {saving ? "Saving…" : "Continue"}
                                    {!saving && <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: Connection Animation */}
                <div className="relative flex w-1/2 items-center justify-center">
                    <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 opacity-30 blur-3xl">
                        <div className={`h-full w-full rounded-full ${selectedModel.color.replace("bg-", "bg-opacity-20 bg-")}`} />
                    </div>

                    <div className="relative flex w-full max-w-lg items-center justify-between px-4">
                        {/* Model Node */}
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className={`relative flex h-24 w-24 items-center justify-center rounded-3xl text-white shadow-2xl transition-all duration-500 ${selectedModel.color} ${isConnecting ? "scale-105 ring-8 ring-white/20 dark:ring-white/5" : ""}`}>
                                <div className="h-12 w-12 flex items-center justify-center [&>svg]:h-full [&>svg]:w-full [&>img]:h-full [&>img]:w-full">
                                    {selectedModel.icon}
                                </div>
                                {isConnecting && <span className="absolute inline-flex h-full w-full animate-ping rounded-3xl opacity-20 bg-inherit" />}
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{selectedModel.name}</div>
                                <div className="flex items-center justify-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                                    <Zap className="h-3 w-3 fill-current text-amber-500" />
                                    {selectedModel.credits} Credit{selectedModel.credits > 1 ? "s" : ""}
                                </div>
                            </div>
                        </div>

                        {/* Connection Line */}
                        <div className="relative mx-4 flex flex-1 items-center justify-center">
                            <div className="absolute h-1 w-full rounded-full bg-zinc-200 dark:bg-zinc-800" />
                            {isConnecting && (
                                <>
                                    <div className="absolute h-1.5 w-12 animate-[slide_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                                    <div className="absolute h-1.5 w-12 animate-[slide_1.5s_ease-in-out_infinite_0.5s] rounded-full bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
                                </>
                            )}
                            <div className="relative z-10 rounded-full bg-white px-3 py-1 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-800">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                                    <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Connected</span>
                                </div>
                            </div>
                        </div>

                        {/* Agent Node */}
                        <div className="relative z-10 flex flex-col items-center gap-4">
                            <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-zinc-900 text-white shadow-2xl ring-4 ring-zinc-100 dark:bg-white dark:text-zinc-900 dark:ring-zinc-800">
                                <Bot className="h-12 w-12" />
                            </div>
                            <div className="text-center">
                                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Your Agent</div>
                                <div className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Ready to Deploy</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes slide {
                    0% { transform: translateX(-100px); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateX(100px); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
