"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    Sparkles,
    Globe,
    FileText,
    Play,
    MessageSquare,
    ArrowRight,
    ArrowLeft,
    Loader2,
    Check,
    Minus,
    Image,
    Palette,
    Link2,
    ChevronDown,
    ChevronRight,
    ExternalLink,
} from "lucide-react";

// Types
type FetchStatus = "idle" | "loading" | "done";

interface FetchStep {
    id: string;
    label: string;
    icon: React.ReactNode;
    status: FetchStatus;
    value?: string;
    count?: number;
}

interface LinkItem {
    id: string;
    name: string;
    url: string;
    selected: boolean;
}

interface LinkGroup {
    id: string;
    name: string;
    path: string;
    expanded: boolean;
    links: LinkItem[];
}

// Checkbox component
function SelectCheckbox({
    checked,
    indeterminate,
    onChange,
    size = "md",
}: {
    checked: boolean;
    indeterminate?: boolean;
    onChange: () => void;
    size?: "sm" | "md";
}) {
    const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5";
    const iconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";

    return (
        <button
            onClick={(e) => { e.stopPropagation(); onChange(); }}
            className={`flex ${sizeClass} items-center justify-center rounded border-2 transition-all ${checked || indeterminate
                ? "border-emerald-500 bg-emerald-500"
                : "border-zinc-300 bg-white hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800"
                }`}
        >
            {indeterminate ? (
                <Minus className={`${iconSize} text-white`} />
            ) : checked ? (
                <Check className={`${iconSize} text-white`} />
            ) : null}
        </button>
    );
}

export default function TrainingSourcesPage() {
    const router = useRouter();
    const [url, setUrl] = React.useState("");
    const [isScanning, setIsScanning] = React.useState(false);
    const [scanComplete, setScanComplete] = React.useState(false);
    const [fetchSteps, setFetchSteps] = React.useState<FetchStep[]>([]);
    const [brandColor, setBrandColor] = React.useState("#6366F1");
    const [showLinks, setShowLinks] = React.useState(false);
    const [linkGroups, setLinkGroups] = React.useState<LinkGroup[]>([]);
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    // Calculate totals
    const totalLinks = linkGroups.reduce((acc, g) => acc + g.links.length, 0);
    const selectedLinks = linkGroups.reduce((acc, g) => acc + g.links.filter(l => l.selected).length, 0);

    const handleAutoScan = () => {
        if (!url) return;

        setIsScanning(true);
        setScanComplete(false);
        setShowLinks(false);
        setBrandColor("#6366F1");

        // Initialize fetch steps
        setFetchSteps([
            { id: "logo", label: "Website Logo", icon: <Image className="h-5 w-5" />, status: "idle" },
            { id: "color", label: "Theme Color", icon: <Palette className="h-5 w-5" />, status: "idle" },
            { id: "links", label: "Page Links", icon: <Link2 className="h-5 w-5" />, status: "idle", count: 0 },
        ]);

        // Animated sequence
        setTimeout(() => {
            setFetchSteps(prev => prev.map(s => s.id === "logo" ? { ...s, status: "loading" } : s));

            setTimeout(() => {
                setFetchSteps(prev => prev.map(s => s.id === "logo" ? { ...s, status: "done", value: "S" } : s));

                setTimeout(() => {
                    setFetchSteps(prev => prev.map(s => s.id === "color" ? { ...s, status: "loading" } : s));

                    setTimeout(() => {
                        setBrandColor("#6366F1");
                        setFetchSteps(prev => prev.map(s => s.id === "color" ? { ...s, status: "done", value: "#6366F1" } : s));

                        setTimeout(() => {
                            setFetchSteps(prev => prev.map(s => s.id === "links" ? { ...s, status: "loading" } : s));

                            const groups: LinkGroup[] = [
                                {
                                    id: "products",
                                    name: "Products",
                                    path: "/products",
                                    expanded: false,
                                    links: [
                                        { id: "p1", name: "Payments", url: "/products/payments", selected: true },
                                        { id: "p2", name: "Billing", url: "/products/billing", selected: true },
                                        { id: "p3", name: "Connect", url: "/products/connect", selected: true },
                                        { id: "p4", name: "Terminal", url: "/products/terminal", selected: true },
                                        { id: "p5", name: "Atlas", url: "/products/atlas", selected: true },
                                        { id: "p6", name: "Radar", url: "/products/radar", selected: true },
                                        { id: "p7", name: "Sigma", url: "/products/sigma", selected: true },
                                        { id: "p8", name: "Climate", url: "/products/climate", selected: true },
                                    ],
                                },
                                {
                                    id: "docs",
                                    name: "Documentation",
                                    path: "/docs",
                                    expanded: false,
                                    links: [
                                        { id: "d1", name: "Getting Started", url: "/docs/getting-started", selected: true },
                                        { id: "d2", name: "API Reference", url: "/docs/api", selected: true },
                                        { id: "d3", name: "SDKs", url: "/docs/sdks", selected: true },
                                        { id: "d4", name: "Webhooks", url: "/docs/webhooks", selected: true },
                                        { id: "d5", name: "Authentication", url: "/docs/auth", selected: true },
                                        { id: "d6", name: "Testing", url: "/docs/testing", selected: true },
                                        { id: "d7", name: "Error Handling", url: "/docs/errors", selected: true },
                                        { id: "d8", name: "Best Practices", url: "/docs/best-practices", selected: true },
                                        { id: "d9", name: "Security", url: "/docs/security", selected: true },
                                        { id: "d10", name: "Rate Limits", url: "/docs/rate-limits", selected: true },
                                        { id: "d11", name: "Changelog", url: "/docs/changelog", selected: true },
                                        { id: "d12", name: "Migration", url: "/docs/migration", selected: true },
                                    ],
                                },
                                {
                                    id: "pricing",
                                    name: "Pricing",
                                    path: "/pricing",
                                    expanded: false,
                                    links: [
                                        { id: "pr1", name: "Overview", url: "/pricing", selected: true },
                                        { id: "pr2", name: "Enterprise", url: "/pricing/enterprise", selected: true },
                                        { id: "pr3", name: "Startups", url: "/pricing/startups", selected: true },
                                    ],
                                },
                                {
                                    id: "blog",
                                    name: "Blog",
                                    path: "/blog",
                                    expanded: false,
                                    links: [
                                        { id: "b1", name: "Updates", url: "/blog/updates", selected: true },
                                        { id: "b2", name: "Engineering", url: "/blog/engineering", selected: true },
                                        { id: "b3", name: "Product", url: "/blog/product", selected: true },
                                        { id: "b4", name: "Customers", url: "/blog/customers", selected: true },
                                        { id: "b5", name: "Security", url: "/blog/security", selected: true },
                                        { id: "b6", name: "Company", url: "/blog/company", selected: true },
                                    ],
                                },
                            ];

                            setTimeout(() => {
                                setLinkGroups(groups);
                                const total = groups.reduce((acc, g) => acc + g.links.length, 0);
                                setFetchSteps(prev => prev.map(s => s.id === "links" ? { ...s, status: "done", count: total } : s));
                                setIsScanning(false);
                                setScanComplete(true);
                            }, 600);
                        }, 300);
                    }, 500);
                }, 300);
            }, 700);
        }, 200);
    };

    const toggleGroup = (groupId: string) => {
        setLinkGroups(prev => prev.map(g =>
            g.id === groupId ? { ...g, expanded: !g.expanded } : g
        ));
    };

    const toggleGroupSelection = (groupId: string) => {
        setLinkGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                const allSelected = g.links.every(l => l.selected);
                return { ...g, links: g.links.map(l => ({ ...l, selected: !allSelected })) };
            }
            return g;
        }));
    };

    const toggleLinkSelection = (groupId: string, linkId: string) => {
        setLinkGroups(prev => prev.map(g => {
            if (g.id === groupId) {
                return { ...g, links: g.links.map(l => l.id === linkId ? { ...l, selected: !l.selected } : l) };
            }
            return g;
        }));
    };

    const getGroupCheckState = (group: LinkGroup) => {
        const selected = group.links.filter(l => l.selected).length;
        if (selected === 0) return { checked: false, indeterminate: false };
        if (selected === group.links.length) return { checked: true, indeterminate: false };
        return { checked: false, indeterminate: true };
    };

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Split Screen Layout */}
            <div className="flex min-h-screen">
                {/* LEFT PANEL */}
                <div className="flex w-1/2 flex-col border-r border-zinc-200 bg-white/80 p-8 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 lg:p-12">
                    {/* Step Indicator */}
                    <div className="mb-6 inline-flex items-center gap-2 self-start rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                        <Sparkles className="h-4 w-4" />
                        Step 2 of 3
                    </div>

                    {/* Header */}
                    <h1 className="mb-3 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 lg:text-4xl">
                        Train your Agent&apos;s Brain
                    </h1>
                    <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400">
                        Connect your website and content. We&apos;ll auto-detect your brand identity.
                    </p>

                    {/* Primary URL Input */}
                    <div className="mb-8">
                        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Website URL
                        </label>
                        <div className="flex gap-3">
                            <div className="relative flex-1">
                                <Globe className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://your-company.com"
                                    className="h-14 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-lg text-zinc-900 placeholder:text-zinc-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder:text-zinc-500"
                                />
                            </div>
                            <Button
                                onClick={handleAutoScan}
                                disabled={!url || isScanning}
                                className="h-14 gap-2 rounded-xl bg-zinc-900 px-6 text-base font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                            >
                                {isScanning ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Sparkles className="h-4 w-4" />
                                )}
                                Auto-Scan Site
                            </Button>
                        </div>
                    </div>

                    {/* Additional Sources - Full Width Cards */}
                    <div className="flex-1">
                        <label className="mb-3 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Additional Sources
                        </label>
                        <div className="space-y-3">
                            {/* Document Upload - Full Width */}
                            <div className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-5 transition-all hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-violet-700 dark:hover:bg-violet-900/20">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition-transform group-hover:scale-110 dark:bg-blue-900/50 dark:text-blue-400">
                                    <FileText className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">Document Upload</p>
                                    <p className="text-sm text-zinc-500">Drag PDFs, DOCX, or TXT files to train your agent</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1" />
                            </div>

                            {/* Video Learning - Full Width */}
                            <div className="group flex cursor-pointer items-center gap-4 rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 p-5 transition-all hover:border-red-300 hover:bg-red-50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-red-700 dark:hover:bg-red-900/20">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 transition-transform group-hover:scale-110 dark:bg-red-900/50 dark:text-red-400">
                                    <Play className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">Video Learning</p>
                                    <p className="text-sm text-zinc-500">Paste YouTube URL to transcribe and learn from videos</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1" />
                            </div>

                            {/* Notion Sync - Full Width */}
                            <div className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100 transition-transform group-hover:scale-110 dark:bg-zinc-700">
                                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 2.022c-.42-.326-.98-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.934-.56.934-1.166V6.354c0-.606-.233-.933-.746-.886l-15.177.887c-.56.047-.747.327-.747.934z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">Notion Sync</p>
                                    <p className="text-sm text-zinc-500">Connect your workspace to sync pages automatically</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1" />
                            </div>

                            {/* Q&A Entry - Full Width */}
                            <div className="group flex cursor-pointer items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-emerald-300 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-emerald-700">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 transition-transform group-hover:scale-110 dark:bg-emerald-900/50 dark:text-emerald-400">
                                    <MessageSquare className="h-6 w-6" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">Q&A Manual Entry</p>
                                    <p className="text-sm text-zinc-500">Add custom FAQs and knowledge manually</p>
                                </div>
                                <ArrowRight className="h-5 w-5 text-zinc-400 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex items-center justify-between">
                        <Button
                            variant="ghost"
                            className="gap-2 text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <Button
                            onClick={() => router.push("/actions")}
                            disabled={!scanComplete || selectedLinks === 0}
                            className={`h-12 w-40 gap-2 rounded-xl font-semibold transition-all ${scanComplete && selectedLinks > 0
                                ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700"
                                : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
                                }`}
                        >
                            Continue
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* RIGHT PANEL */}
                <div className="flex w-1/2 flex-col p-8 lg:p-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                            Scan Results
                        </h2>
                        {scanComplete && (
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                {selectedLinks}/{totalLinks} selected
                            </span>
                        )}
                    </div>

                    {/* Results Container */}
                    <div className="flex-1 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60 dark:backdrop-blur-md">
                        {fetchSteps.length === 0 ? (
                            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-900/50 dark:to-indigo-900/50">
                                    <Globe className="h-10 w-10 text-violet-500" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                    Ready to scan
                                </h3>
                                <p className="max-w-xs text-sm text-zinc-500">
                                    Enter your website URL and click &quot;Auto-Scan Site&quot; to detect your brand.
                                </p>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col">
                                {/* Modern Step Progress */}
                                <div className="border-b border-zinc-100 p-6 dark:border-zinc-800">
                                    <div className="flex items-center justify-between">
                                        {fetchSteps.map((step, index) => (
                                            <React.Fragment key={step.id}>
                                                {/* Step Circle */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-500 ${step.status === "done"
                                                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/30"
                                                        : step.status === "loading"
                                                            ? "bg-gradient-to-br from-violet-400 to-violet-600 shadow-lg shadow-violet-500/30"
                                                            : "bg-zinc-100 dark:bg-zinc-800"
                                                        }`}>
                                                        {step.status === "loading" ? (
                                                            <Loader2 className="h-6 w-6 animate-spin text-white" />
                                                        ) : step.status === "done" ? (
                                                            <Check className="h-6 w-6 text-white" />
                                                        ) : (
                                                            <span className="text-zinc-400">{step.icon}</span>
                                                        )}
                                                        {/* Pulse animation for loading */}
                                                        {step.status === "loading" && (
                                                            <div className="absolute inset-0 animate-ping rounded-full bg-violet-400 opacity-20" />
                                                        )}
                                                    </div>
                                                    <p className={`mt-2 text-xs font-medium ${step.status === "done" ? "text-emerald-600" :
                                                        step.status === "loading" ? "text-violet-600" : "text-zinc-400"
                                                        }`}>
                                                        {step.label}
                                                    </p>
                                                    {/* Value display */}
                                                    {step.status === "done" && step.id === "logo" && (
                                                        <div className="mt-1 flex h-6 w-6 items-center justify-center rounded bg-indigo-500 text-xs font-bold text-white">
                                                            {step.value}
                                                        </div>
                                                    )}
                                                    {step.status === "done" && step.id === "color" && (
                                                        <div className="mt-1 h-4 w-8 rounded" style={{ backgroundColor: brandColor }} />
                                                    )}
                                                    {step.status === "done" && step.id === "links" && (
                                                        <button
                                                            onClick={() => setShowLinks(!showLinks)}
                                                            className="mt-1 flex items-center gap-1 rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 hover:bg-violet-200 dark:bg-violet-900/50 dark:text-violet-300"
                                                        >
                                                            {step.count}
                                                            {showLinks ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                                                        </button>
                                                    )}
                                                </div>
                                                {/* Connector Line */}
                                                {index < fetchSteps.length - 1 && (
                                                    <div className={`h-0.5 flex-1 mx-4 rounded-full transition-all duration-500 ${fetchSteps[index + 1].status !== "idle"
                                                        ? "bg-gradient-to-r from-emerald-400 to-violet-400"
                                                        : "bg-zinc-200 dark:bg-zinc-700"
                                                        }`} />
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                {/* Links Section */}
                                {showLinks && linkGroups.length > 0 && (
                                    <div className="flex-1 overflow-y-auto p-4">
                                        <div className="space-y-3">
                                            {linkGroups.map((group) => {
                                                const { checked, indeterminate } = getGroupCheckState(group);
                                                const selectedCount = group.links.filter(l => l.selected).length;

                                                return (
                                                    <div
                                                        key={group.id}
                                                        className="overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-800/30"
                                                    >
                                                        {/* Group Header */}
                                                        <div
                                                            className="flex cursor-pointer items-center gap-3 p-4 transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                            onClick={() => toggleGroup(group.id)}
                                                        >
                                                            <SelectCheckbox
                                                                checked={checked}
                                                                indeterminate={indeterminate}
                                                                onChange={() => toggleGroupSelection(group.id)}
                                                            />
                                                            <div
                                                                className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
                                                                style={{ backgroundColor: brandColor }}
                                                            >
                                                                <Link2 className="h-4 w-4" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-semibold text-zinc-800 dark:text-zinc-200">{group.name}</p>
                                                            </div>
                                                            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 shadow-sm dark:bg-zinc-900 dark:text-zinc-400">
                                                                {selectedCount}/{group.links.length}
                                                            </span>
                                                            {group.expanded ? (
                                                                <ChevronDown className="h-4 w-4 text-zinc-400" />
                                                            ) : (
                                                                <ChevronRight className="h-4 w-4 text-zinc-400" />
                                                            )}
                                                        </div>

                                                        {/* Links List */}
                                                        {group.expanded && (
                                                            <div className="border-t border-zinc-100 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/50">
                                                                <div className="space-y-1">
                                                                    {group.links.map((link) => (
                                                                        <div
                                                                            key={link.id}
                                                                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${link.selected
                                                                                ? "bg-emerald-50 dark:bg-emerald-900/20"
                                                                                : "bg-zinc-50 opacity-60 dark:bg-zinc-800/50"
                                                                                }`}
                                                                        >
                                                                            <SelectCheckbox
                                                                                checked={link.selected}
                                                                                onChange={() => toggleLinkSelection(group.id, link.id)}
                                                                                size="sm"
                                                                            />
                                                                            <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                                                                            <span className={`flex-1 text-sm ${link.selected
                                                                                ? "text-zinc-700 dark:text-zinc-300"
                                                                                : "text-zinc-400 line-through"
                                                                                }`}>
                                                                                {link.name}
                                                                            </span>
                                                                            <span className="text-xs text-zinc-400">{link.url}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
