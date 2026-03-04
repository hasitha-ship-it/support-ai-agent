import React from "react";
import Image from "next/image";
import { Smile, Meh, Zap, Skull, Briefcase, Flame } from "lucide-react";

// --- LOGO COMPONENTS ---
export function XAILogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

export function OpenAILogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.28 9.82a5.98 5.98 0 0 0-.51-4.91 6.04 6.04 0 0 0-6.51-2.9A6.06 6.06 0 0 0 4.98 4.18a5.98 5.98 0 0 0-4 2.9 6.04 6.04 0 0 0 .75 7.1 5.98 5.98 0 0 0 .5 4.91 6.05 6.05 0 0 0 6.52 2.9 5.98 5.98 0 0 0 4.5 2.01 6.05 6.05 0 0 0 5.77-4.2 5.99 5.99 0 0 0 4-2.9 6.05 6.05 0 0 0-.74-7.07Zm-9.02 12.6a4.47 4.47 0 0 1-2.88-1.04l.14-.08 4.78-2.75a.8.8 0 0 0 .4-.68v-6.74l2 1.17a.07.07 0 0 1 .04.05v5.58a4.5 4.5 0 0 1-4.48 4.49Zm-9.66-4.12a4.47 4.47 0 0 1-.54-3.02l.14.09 4.79 2.75a.77.77 0 0 0 .78 0l5.84-3.37v2.33a.08.08 0 0 1-.03.06L9.74 20a4.5 4.5 0 0 1-6.14-1.65ZM2.34 7.9a4.48 4.48 0 0 1 2.37-1.98V11.6a.77.77 0 0 0 .39.68l5.81 3.35-2.02 1.17a.08.08 0 0 1-.07 0l-4.83-2.79A4.5 4.5 0 0 1 2.34 7.87Zm16.6 3.86L13.1 8.36l2-1.16a.08.08 0 0 1 .07 0l4.83 2.79a4.5 4.5 0 0 1-.67 8.1v-5.67a.8.8 0 0 0-.4-.67Zm2-3.02l-.14-.09-4.77-2.78a.78.78 0 0 0-.79 0L9.41 9.23V6.9a.07.07 0 0 1 .03-.06l4.83-2.79a4.5 4.5 0 0 1 6.68 4.66ZM8.3 12.86l-2.02-1.16a.08.08 0 0 1-.04-.06V6.07a4.5 4.5 0 0 1 7.37-3.45l-.14.08L8.7 5.46a.8.8 0 0 0-.4.68v6.72Z" />
        </svg>
    );
}

export interface AIModel {
    id: string;
    name: string;
    provider: string;
    credits: number;
    description: string;
    icon: React.ReactNode;
    color: string;
}

export const aiModels: AIModel[] = [
    // OpenAI Group
    {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "OpenAI",
        credits: 3,
        description: "OpenAI's flagship model known for high reliability, complex reasoning, and natural conversation.",
        icon: <OpenAILogo className="h-4 w-4" />,
        color: "bg-emerald-500",
    },
    {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        provider: "OpenAI",
        credits: 1,
        description: "A fast, cost-effective model optimized for simple tasks and quick responses.",
        icon: <OpenAILogo className="h-4 w-4" />,
        color: "bg-teal-500",
    },
    {
        id: "o1",
        name: "OpenAI o1",
        provider: "OpenAI",
        credits: 10,
        description: "Designed for advanced reasoning and complex problem-solving. Takes time to 'think' before answering.",
        icon: <OpenAILogo className="h-4 w-4" />,
        color: "bg-black",
    },

    // Anthropic Group
    {
        id: "claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        credits: 3,
        description: "Anthropic's most intelligent model, excelling in coding, writing, and nuanced understanding.",
        icon: <Image src="/claude.svg" alt="Claude" width={20} height={20} className="h-5 w-5" />,
        color: "bg-orange-500",
    },
    {
        id: "claude-3-haiku",
        name: "Claude 3 Haiku",
        provider: "Anthropic",
        credits: 1,
        description: "The fastest model in the Claude family, perfect for near-instant customer interactions.",
        icon: <Image src="/claude.svg" alt="Claude" width={20} height={20} className="h-5 w-5" />,
        color: "bg-orange-400",
    },
    // Google Group
    {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        provider: "Google",
        credits: 3,
        description: "Google's mid-size multimodal model with a massive context window for analyzing large amounts of data.",
        icon: <Image src="/gemini-ai.svg" alt="Gemini" width={20} height={20} className="h-5 w-5" />,
        color: "bg-blue-500",
    },
    {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        provider: "Google",
        credits: 1,
        description: "Google's high-speed, low-latency model designed for high-volume tasks.",
        icon: <Image src="/gemini-ai.svg" alt="Gemini" width={20} height={20} className="h-5 w-5" />,
        color: "bg-sky-500",
    },
    // DeepSeek Group
    {
        id: "deepseek-v3",
        name: "DeepSeek V3",
        provider: "DeepSeek",
        credits: 1,
        description: "A highly efficient open-weights model that rivals top-tier proprietary models.",
        icon: <Image src="/deepseek.svg" alt="DeepSeek" width={20} height={20} className="h-5 w-5" />,
        color: "bg-indigo-600",
    },
    {
        id: "deepseek-r1",
        name: "DeepSeek R1",
        provider: "DeepSeek",
        credits: 1,
        description: "Specialized for math, coding, and logical deduction with strong chains of thought.",
        icon: <Image src="/deepseek.svg" alt="DeepSeek" width={20} height={20} className="h-5 w-5" />,
        color: "bg-indigo-500",
    },
    // xAI Group
    {
        id: "grok-2",
        name: "Grok 2",
        provider: "xAI",
        credits: 3,
        description: "xAI's uncensored model featuring real-time knowledge from the X platform.",
        icon: <XAILogo className="h-4 w-4" />,
        color: "bg-zinc-900",
    },
    {
        id: "grok-2-mini",
        name: "Grok 2 Mini",
        provider: "xAI",
        credits: 1,
        description: "A faster, lightweight version of Grok optimized for speed and wit.",
        icon: <XAILogo className="h-4 w-4" />,
        color: "bg-zinc-700",
    },
    // Other Group
    {
        id: "llama-3.3",
        name: "Llama 3.3",
        provider: "Meta",
        credits: 1,
        description: "Meta's powerful open-source model capable of handling a wide range of general tasks.",
        icon: <Image src="/llama.svg" alt="Llama" width={20} height={20} className="h-5 w-5 invert dark:invert-0" />,
        color: "bg-blue-600",
    },
    {
        id: "mistral-large-2",
        name: "Mistral Large 2",
        provider: "Mistral",
        credits: 3,
        description: "Europe's leading model with strong multilingual capabilities and reasoning skills.",
        icon: <Image src="/Mistral .svg" alt="Mistral" width={20} height={20} className="h-5 w-5" />,
        color: "bg-amber-500",
    },
];

export const toneOptions = [
    { id: "empathetic", label: "Empathetic", icon: <Smile className="h-4 w-4" />, description: "Supportive", color: "text-rose-500" },
    { id: "neutral", label: "Neutral", icon: <Meh className="h-4 w-4" />, description: "Professional", color: "text-blue-500" },
    { id: "direct", label: "Direct", icon: <Zap className="h-4 w-4" />, description: "Concise", color: "text-amber-500" },
    { id: "pirate", label: "Pirate", icon: <Skull className="h-4 w-4" />, description: "Fun", color: "text-zinc-600" },
    { id: "formal", label: "Formal", icon: <Briefcase className="h-4 w-4" />, description: "Corporate", color: "text-slate-600" },
    { id: "witty", label: "Witty", icon: <Flame className="h-4 w-4" />, description: "Clever", color: "text-orange-500" },
];
