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
    Trash2,
    Plus,
    Settings,
    Brain,
    TrendingDown,
    Shield,
    Rocket,
    Layers,
    ShieldAlert,
    Ban,
    Zap,
    HeartHandshake,
    EyeOff,
    Filter,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
interface DiscountTier {
    id: string;
    tenure: number;
    tenureUnit: "months" | "years";
    discountPercent: number;
    validMonths: number;
}

interface ChurnRule {
    id: string;
    reason: string;
    action: string;
    discountTiers?: DiscountTier[];
    active: boolean;
}

// Toggle Switch Component
function ToggleSwitch({
    enabled,
    onChange,
    size = "default",
}: {
    enabled: boolean;
    onChange: () => void;
    size?: "default" | "small";
}) {
    const sizeClasses = size === "small"
        ? "h-5 w-9"
        : "h-6 w-11";
    const dotSizeClasses = size === "small"
        ? "h-4 w-4"
        : "h-5 w-5";
    const dotPosition = size === "small"
        ? enabled ? "left-[18px]" : "left-0.5"
        : enabled ? "left-[22px]" : "left-0.5";

    return (
        <button
            onClick={onChange}
            className={`relative ${sizeClasses} rounded-full transition-all duration-300 ${enabled
                ? "bg-violet-600 shadow-md shadow-violet-500/30"
                : "bg-zinc-200 dark:bg-zinc-700"
                }`}
        >
            <div
                className={`absolute top-0.5 ${dotSizeClasses} rounded-full bg-white shadow-sm transition-all duration-300 ${dotPosition}`}
            />
        </button>
    );
}

// Tag Input Component for Competitor Shield
function TagInput({
    tags,
    setTags,
    placeholder,
}: {
    tags: string[];
    setTags: React.Dispatch<React.SetStateAction<string[]>>;
    placeholder: string;
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
                    <button
                        onClick={() => removeTag(tag)}
                        className="rounded-full p-0.5 transition-colors hover:bg-violet-200 dark:hover:bg-violet-800"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : "Add more..."}
                className="min-w-[200px] flex-1 border-none bg-transparent py-1 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-zinc-50 dark:placeholder:text-zinc-500"
            />
        </div>
    );
}

// Multi-Tiered Discount Modal Component
function TieredDiscountModal({
    isOpen,
    onClose,
    onSave,
    initialTiers,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tiers: DiscountTier[]) => void;
    initialTiers?: DiscountTier[];
}) {
    const [tiers, setTiers] = React.useState<DiscountTier[]>(
        initialTiers && initialTiers.length > 0
            ? initialTiers
            : [
                {
                    id: Date.now().toString(),
                    tenure: 1,
                    tenureUnit: "months",
                    discountPercent: 10,
                    validMonths: 1,
                },
            ]
    );

    // Reset tiers when modal opens with new initial values
    React.useEffect(() => {
        if (isOpen) {
            setTiers(
                initialTiers && initialTiers.length > 0
                    ? initialTiers
                    : [
                        {
                            id: Date.now().toString(),
                            tenure: 1,
                            tenureUnit: "months",
                            discountPercent: 10,
                            validMonths: 1,
                        },
                    ]
            );
        }
    }, [isOpen, initialTiers]);

    const addTier = () => {
        const lastTier = tiers[tiers.length - 1];
        setTiers([
            ...tiers,
            {
                id: Date.now().toString(),
                tenure: lastTier ? lastTier.tenure + 6 : 6,
                tenureUnit: "months",
                discountPercent: lastTier ? Math.min(lastTier.discountPercent + 10, 50) : 20,
                validMonths: lastTier ? lastTier.validMonths : 3,
            },
        ]);
    };

    const updateTier = (id: string, updates: Partial<DiscountTier>) => {
        setTiers(tiers.map((tier) => (tier.id === id ? { ...tier, ...updates } : tier)));
    };

    const removeTier = (id: string) => {
        if (tiers.length > 1) {
            setTiers(tiers.filter((tier) => tier.id !== id));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                {/* Header */}
                <div className="border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
                            <Layers className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                                Configure Discount Strategy
                            </h3>
                            <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">
                                Define different offers based on customer loyalty (Tenure)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tiers List */}
                <div className="max-h-[400px] overflow-y-auto px-6 py-4">
                    <div className="space-y-3">
                        {tiers.map((tier, index) => (
                            <div
                                key={tier.id}
                                className="group rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 transition-all hover:border-violet-200 hover:bg-violet-50/30 dark:border-zinc-700 dark:bg-zinc-800/30 dark:hover:border-violet-800 dark:hover:bg-violet-900/20"
                            >
                                {/* Tier Header */}
                                <div className="mb-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                                            {index + 1}
                                        </span>
                                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                            Tier {index + 1}
                                        </span>
                                    </div>
                                    {tiers.length > 1 && (
                                        <button
                                            onClick={() => removeTier(tier.id)}
                                            className="rounded-lg p-1.5 text-zinc-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Tier Fields */}
                                <div className="grid grid-cols-3 gap-3">
                                    {/* Condition */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            If tenure &gt;
                                        </label>
                                        <div className="flex gap-1.5">
                                            <input
                                                type="number"
                                                value={tier.tenure}
                                                onChange={(e) =>
                                                    updateTier(tier.id, {
                                                        tenure: Number(e.target.value),
                                                    })
                                                }
                                                min={1}
                                                className="h-9 w-16 rounded-lg border border-zinc-200 bg-white px-2 text-center text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                                            />
                                            <select
                                                value={tier.tenureUnit}
                                                onChange={(e) =>
                                                    updateTier(tier.id, {
                                                        tenureUnit: e.target.value as "months" | "years",
                                                    })
                                                }
                                                className="h-9 flex-1 rounded-lg border border-zinc-200 bg-white px-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                                            >
                                                <option value="months">Mo</option>
                                                <option value="years">Yr</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Discount */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            Discount
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="number"
                                                value={tier.discountPercent}
                                                onChange={(e) =>
                                                    updateTier(tier.id, {
                                                        discountPercent: Number(e.target.value),
                                                    })
                                                }
                                                min={1}
                                                max={100}
                                                className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2 pr-8 text-center text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                                            />
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-400">
                                                %
                                            </span>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
                                            Valid for
                                        </label>
                                        <div className="flex items-center gap-1.5">
                                            <input
                                                type="number"
                                                value={tier.validMonths}
                                                onChange={(e) =>
                                                    updateTier(tier.id, {
                                                        validMonths: Number(e.target.value),
                                                    })
                                                }
                                                min={1}
                                                className="h-9 w-16 rounded-lg border border-zinc-200 bg-white px-2 text-center text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50"
                                            />
                                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                                months
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add Tier Button */}
                    <button
                        onClick={addTier}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 py-3 text-sm font-medium text-zinc-500 transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-600 dark:border-zinc-700 dark:hover:border-violet-700 dark:hover:bg-violet-900/20 dark:hover:text-violet-400"
                    >
                        <Plus className="h-4 w-4" />
                        Add Another Tier
                    </button>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 border-zinc-200 dark:border-zinc-700"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            onSave(tiers);
                            onClose();
                        }}
                        className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:from-violet-700 hover:to-indigo-700"
                    >
                        <Layers className="mr-2 h-4 w-4" />
                        Save Strategy
                    </Button>
                </div>
            </div>
        </div>
    );
}

// Main Component
export default function GuardrailsPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Core Behavior State
    const [strictBusinessMode, setStrictBusinessMode] = React.useState(true);
    const [competitorTags, setCompetitorTags] = React.useState<string[]>([
        "Uber",
        "PickMe",
    ]);

    // Smart Retention Engine State
    const [churnRules, setChurnRules] = React.useState<ChurnRule[]>([
        {
            id: "1",
            reason: "Pricing too high",
            action: "💸 Offer Discount",
            discountTiers: [
                {
                    id: "tier-1",
                    tenure: 1,
                    tenureUnit: "months",
                    discountPercent: 10,
                    validMonths: 1,
                },
                {
                    id: "tier-2",
                    tenure: 6,
                    tenureUnit: "months",
                    discountPercent: 20,
                    validMonths: 3,
                },
                {
                    id: "tier-3",
                    tenure: 12,
                    tenureUnit: "months",
                    discountPercent: 30,
                    validMonths: 6,
                },
            ],
            active: true,
        },
        {
            id: "2",
            reason: "Missing Features",
            action: "👨‍💻 Escalate to Human",
            active: true,
        },
    ]);

    // Modal State
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editingRuleId, setEditingRuleId] = React.useState<string | null>(null);

    // Stability & Advanced Safety State
    const [antiHallucination, setAntiHallucination] = React.useState(true);
    const [promptInjectionDefense, setPromptInjectionDefense] = React.useState(true);
    const [spamProtection, setSpamProtection] = React.useState(true);
    const [rateLimit, setRateLimit] = React.useState(20);
    const [humanHandover, setHumanHandover] = React.useState(true);
    const [piiMasking, setPiiMasking] = React.useState(true);
    const [contentFilters, setContentFilters] = React.useState({
        hateSpeech: true,
        adultContent: true,
        financialAdvice: false,
    });

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    // Churn Prevention Handlers
    const reasonOptions = [
        "Pricing too high",
        "Missing Features",
        "Bugs / Technical Issues",
        "Too Complex / High Learning Curve",
        "No Longer Needed / Project Ended",
        "Poor Customer Support",
    ];

    const actionOptions = [
        "💸 Offer Discount",
        "👨‍💻 Escalate to Human",
        "💬 Send Custom Message",
        "🎫 Open Support Ticket",
        "⛔ Do Nothing (Log Only)",
    ];

    const addNewRule = () => {
        const newRule: ChurnRule = {
            id: Date.now().toString(),
            reason: reasonOptions[0],
            action: actionOptions[0],
            active: true,
        };
        setChurnRules([...churnRules, newRule]);
    };

    const updateRule = (id: string, updates: Partial<ChurnRule>) => {
        setChurnRules(
            churnRules.map((rule) =>
                rule.id === id ? { ...rule, ...updates } : rule
            )
        );
    };

    const deleteRule = (id: string) => {
        setChurnRules(churnRules.filter((rule) => rule.id !== id));
    };

    const openDiscountModal = (ruleId: string) => {
        setEditingRuleId(ruleId);
        setModalOpen(true);
    };

    const saveDiscountTiers = (tiers: DiscountTier[]) => {
        if (editingRuleId) {
            updateRule(editingRuleId, { discountTiers: tiers });
        }
    };

    const editingRule = churnRules.find((r) => r.id === editingRuleId);

    // Helper to generate tier summary
    const getTierSummary = (tiers: DiscountTier[] | undefined) => {
        if (!tiers || tiers.length === 0) return null;
        const maxDiscount = Math.max(...tiers.map((t) => t.discountPercent));
        return {
            count: tiers.length,
            maxDiscount,
        };
    };

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-40">
                <ThemeToggle />
            </div>

            {/* Tiered Discount Modal */}
            <TieredDiscountModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={saveDiscountTiers}
                initialTiers={editingRule?.discountTiers}
            />

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

                {/* Cards Container */}
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
                            {/* Strict Business Mode */}
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
                                    enabled={strictBusinessMode}
                                    onChange={() => setStrictBusinessMode(!strictBusinessMode)}
                                />
                            </div>

                            {/* Competitor Shield */}
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
                                    tags={competitorTags}
                                    setTags={setCompetitorTags}
                                    placeholder="Type competitor names and press Enter..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: Smart Retention Engine */}
                    <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
                        <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25">
                                        <TrendingDown className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                                            Smart Retention Engine 📉
                                        </h2>
                                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                            Churn Prevention Rules
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={addNewRule}
                                    variant="outline"
                                    className="gap-2 border-violet-200 text-violet-700 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-900/30"
                                >
                                    <Plus className="h-4 w-4" />
                                    Add New Rule
                                </Button>
                            </div>
                        </div>

                        {/* Rules Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/30">
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Cancellation Reason
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Bot Action
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Configuration
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {churnRules.map((rule) => {
                                        const tierSummary = getTierSummary(rule.discountTiers);

                                        return (
                                            <tr
                                                key={rule.id}
                                                className="transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
                                            >
                                                {/* Reason Dropdown */}
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={rule.reason}
                                                        onChange={(e) =>
                                                            updateRule(rule.id, { reason: e.target.value })
                                                        }
                                                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                                    >
                                                        {reasonOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                {/* Action Dropdown */}
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={rule.action}
                                                        onChange={(e) =>
                                                            updateRule(rule.id, {
                                                                action: e.target.value,
                                                                discountTiers:
                                                                    e.target.value !== "💸 Offer Discount"
                                                                        ? undefined
                                                                        : rule.discountTiers,
                                                            })
                                                        }
                                                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                                                    >
                                                        {actionOptions.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>

                                                {/* Configuration - Multi-Tiered Summary */}
                                                <td className="px-6 py-4">
                                                    {rule.action === "💸 Offer Discount" ? (
                                                        tierSummary ? (
                                                            <button
                                                                onClick={() => openDiscountModal(rule.id)}
                                                                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 text-sm font-medium text-blue-700 ring-1 ring-blue-200/50 transition-all hover:from-blue-100 hover:to-indigo-100 hover:ring-blue-300 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-300 dark:ring-blue-700/50 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50"
                                                            >
                                                                <Layers className="h-4 w-4" />
                                                                <span>
                                                                    🏷️ {tierSummary.count} Tier{tierSummary.count > 1 ? "s" : ""} Active
                                                                </span>
                                                                <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                                                                    Max {tierSummary.maxDiscount}%
                                                                </span>
                                                            </button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => openDiscountModal(rule.id)}
                                                                className="gap-1.5 border-zinc-200 text-zinc-600 hover:border-violet-300 hover:text-violet-700 dark:border-zinc-700 dark:text-zinc-400"
                                                            >
                                                                <Settings className="h-3.5 w-3.5" />
                                                                Configure Tiers
                                                            </Button>
                                                        )
                                                    ) : (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="gap-1.5 border-zinc-200 text-zinc-600 hover:border-violet-300 hover:text-violet-700 dark:border-zinc-700 dark:text-zinc-400"
                                                        >
                                                            <Settings className="h-3.5 w-3.5" />
                                                            Configure Message/Ticket
                                                        </Button>
                                                    )}
                                                </td>

                                                {/* Status Toggle */}
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center">
                                                        <ToggleSwitch
                                                            enabled={rule.active}
                                                            onChange={() =>
                                                                updateRule(rule.id, { active: !rule.active })
                                                            }
                                                            size="small"
                                                        />
                                                    </div>
                                                </td>

                                                {/* Delete */}
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => deleteRule(rule.id)}
                                                        className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {churnRules.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                                            >
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                                                        <TrendingDown className="h-6 w-6 text-zinc-400" />
                                                    </div>
                                                    <p>No churn prevention rules configured</p>
                                                    <Button
                                                        onClick={addNewRule}
                                                        variant="outline"
                                                        size="sm"
                                                        className="mt-2 gap-1.5"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        Add Your First Rule
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* CARD 3: Stability & Advanced Safety */}
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
                            {/* 1. Anti-Hallucination */}
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
                                                Strictly limits the AI to your Knowledge Base. If the answer isn't found, it will say "I don't know" instead of guessing.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <ToggleSwitch
                                            enabled={antiHallucination}
                                            onChange={() => setAntiHallucination(!antiHallucination)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Prompt Injection Defense */}
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
                                                Detects and blocks attempts to "jailbreak" or override the AI's system instructions (e.g., "Ignore previous rules").
                                            </p>
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <ToggleSwitch
                                            enabled={promptInjectionDefense}
                                            onChange={() => setPromptInjectionDefense(!promptInjectionDefense)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 3. Spam Protection (Rate Limiting) */}
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

                                            {/* Inline Rate Limit Config */}
                                            {spamProtection && (
                                                <div className="mt-3 flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2.5 dark:bg-zinc-800/50">
                                                    <Zap className="h-4 w-4 text-violet-500" />
                                                    <span className="text-sm text-zinc-600 dark:text-zinc-400">
                                                        Limit users to
                                                    </span>
                                                    <input
                                                        type="number"
                                                        value={rateLimit}
                                                        onChange={(e) => setRateLimit(Number(e.target.value))}
                                                        min={1}
                                                        max={100}
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
                                            enabled={spamProtection}
                                            onChange={() => setSpamProtection(!spamProtection)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 4. Human Handover */}
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
                                            enabled={humanHandover}
                                            onChange={() => setHumanHandover(!humanHandover)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 5. PII Masking */}
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
                                            enabled={piiMasking}
                                            onChange={() => setPiiMasking(!piiMasking)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* 6. Content Filters */}
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
                                            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-2.5 transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
                                                <input
                                                    type="checkbox"
                                                    checked={contentFilters.hateSpeech}
                                                    onChange={() =>
                                                        setContentFilters({
                                                            ...contentFilters,
                                                            hateSpeech: !contentFilters.hateSpeech,
                                                        })
                                                    }
                                                    className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-700"
                                                />
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    Hate Speech
                                                </span>
                                            </label>

                                            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-2.5 transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
                                                <input
                                                    type="checkbox"
                                                    checked={contentFilters.adultContent}
                                                    onChange={() =>
                                                        setContentFilters({
                                                            ...contentFilters,
                                                            adultContent: !contentFilters.adultContent,
                                                        })
                                                    }
                                                    className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-700"
                                                />
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    Adult Content
                                                </span>
                                            </label>

                                            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-200 bg-zinc-50/80 px-4 py-2.5 transition-all hover:border-violet-300 hover:bg-violet-50/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
                                                <input
                                                    type="checkbox"
                                                    checked={contentFilters.financialAdvice}
                                                    onChange={() =>
                                                        setContentFilters({
                                                            ...contentFilters,
                                                            financialAdvice: !contentFilters.financialAdvice,
                                                        })
                                                    }
                                                    className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-violet-500 dark:border-zinc-600 dark:bg-zinc-700"
                                                />
                                                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                                    Financial Advice
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
                        onClick={() => router.push("/personality")}
                        className="h-12 gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-violet-500/30"
                    >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
