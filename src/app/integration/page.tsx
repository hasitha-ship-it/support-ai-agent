"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import {
    Sparkles,
    ArrowLeft,
    Copy,
    Check,
    Code,
    Share2,
    ExternalLink,
    Rocket,
    Globe,
    Zap,
} from "lucide-react";

// Social Media Logo Components
function XLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );
}

function LinkedInLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    );
}

function WhatsAppLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

function FacebookLogo({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    );
}

export default function IntegrationPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [showConfetti, setShowConfetti] = React.useState(false);
    const [activeTab, setActiveTab] = React.useState<"embed" | "share">("embed");
    const [copied, setCopied] = React.useState(false);

    // Embed code
    const embedCode = `<!-- WizName AI Agent Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['WizNameWidget']=o;w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments) };
    js = d.createElement(s), fjs = d.getElementsByTagName(s)[0];
    js.id = o; js.src = f; js.async = 1; fjs.parentNode.insertBefore(js, fjs);
  }(window, document, 'script', 'wn', 'https://cdn.wizname.ai/widget.js'));
  wn('init', { agentId: 'wn_abc123xyz' });
</script>`;

    const shareLink = "https://chat.wizname.ai/agent/wn_abc123xyz";

    React.useEffect(() => {
        setMounted(true);

        // Simulate building agent
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            setShowConfetti(true);

            // Hide confetti after 4 seconds
            setTimeout(() => setShowConfetti(false), 4000);
        }, 2000);

        return () => clearTimeout(loadingTimer);
    }, []);

    const gridClass = mounted
        ? resolvedTheme === "dark"
            ? "bg-grid-dark"
            : "bg-grid-light"
        : "bg-grid-light";

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Loading Screen
    if (isLoading) {
        return (
            <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-center">
                        {/* Animated Rocket */}
                        <div className="relative mb-8 inline-block">
                            <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full bg-violet-600 shadow-2xl shadow-violet-500/50 animate-pulse">
                                <Rocket className="h-16 w-16 text-white animate-bounce" />
                            </div>
                            {/* Pulse rings */}
                            <span className="absolute inset-0 inline-flex h-32 w-32 animate-ping rounded-full bg-violet-400 opacity-30" />
                            <span className="absolute inset-0 inline-flex h-32 w-32 animate-ping rounded-full bg-violet-400 opacity-20" style={{ animationDelay: "0.5s" }} />
                        </div>

                        {/* Loading Text */}
                        <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                            Building Your Agent...
                        </h2>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">
                            Hang tight! We're setting everything up for you.
                        </p>

                        {/* Loading Bar */}
                        <div className="mt-8 mx-auto w-64 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 animate-[loading_2s_ease-in-out_infinite]" />
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes loading {
                        0% { width: 0%; }
                        100% { width: 100%; }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass} relative overflow-hidden`}>
            <div className="fixed top-6 right-6 z-40">
                <ThemeToggle />
            </div>

            {/* Advanced Paper Confetti Effect */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(80)].map((_, i) => {
                        const colors = [
                            "#7c3aed", "#ec4899", "#f59e0b", "#10b981",
                            "#3b82f6", "#8b5cf6", "#ef4444", "#06b6d4",
                            "#fbbf24", "#a855f7", "#14b8a6", "#f97316"
                        ];
                        const color = colors[Math.floor(Math.random() * colors.length)];
                        const size = 8 + Math.random() * 12;
                        const isRectangle = Math.random() > 0.5;
                        const startX = Math.random() * 100;
                        const swayAmount = 50 + Math.random() * 100;
                        const fallDuration = 3 + Math.random() * 3;
                        const delay = Math.random() * 1.5;
                        const rotateSpeed = 2 + Math.random() * 3;

                        return (
                            <div
                                key={i}
                                className="absolute"
                                style={{
                                    left: `${startX}%`,
                                    top: `-5%`,
                                    animation: `paper-fall ${fallDuration}s ease-in-out ${delay}s forwards`,
                                    ["--sway-amount" as string]: `${swayAmount}px`,
                                }}
                            >
                                <div
                                    className="origin-center"
                                    style={{
                                        width: isRectangle ? `${size}px` : `${size * 0.7}px`,
                                        height: isRectangle ? `${size * 0.6}px` : `${size}px`,
                                        backgroundColor: color,
                                        borderRadius: '2px',
                                        boxShadow: `0 2px 4px ${color}40`,
                                        animation: `paper-tumble ${rotateSpeed}s ease-in-out infinite`,
                                        animationDelay: `${delay}s`,
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Main Container */}
            <div className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-12 py-16">
                {/* Success Header with Glassmorphism */}
                <div className="mb-10 text-center animate-fade-in">
                    {/* Floating Success Badge */}
                    <div className="mb-6 inline-flex items-center gap-3 rounded-2xl bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl px-6 py-3 shadow-xl border border-emerald-200 dark:border-emerald-800">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg shadow-emerald-500/40 animate-pulse">
                            <Check className="h-5 w-5 text-white" />
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                                Agent Successfully Deployed!
                            </div>
                            <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70">
                                Your AI is now live and ready
                            </div>
                        </div>
                    </div>

                    <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                        🎉 Congratulations!
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Your AI agent is ready to go live. Choose how you'd like to integrate it.
                    </p>
                </div>

                {/* Modern Tab System */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        <div className="inline-flex items-center gap-2 rounded-2xl bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl p-2 shadow-xl border border-zinc-200 dark:border-zinc-800">
                            <button
                                onClick={() => setActiveTab("embed")}
                                className={`flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-bold transition-all ${activeTab === "embed"
                                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                <Code className="h-4 w-4" />
                                Add to Website
                            </button>
                            <button
                                onClick={() => setActiveTab("share")}
                                className={`flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-bold transition-all ${activeTab === "share"
                                    ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30"
                                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                                    }`}
                            >
                                <Globe className="h-4 w-4" />
                                Share Public Link
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="rounded-3xl border border-zinc-200/50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 shadow-2xl dark:border-zinc-700/50 animate-slide-up">
                    {activeTab === "embed" ? (
                        <div>
                            {/* Header with Icon */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                                    <Code className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                                        Embed Code
                                    </h2>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Copy and paste this code snippet before the closing <code className="px-2 py-0.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-violet-600 dark:text-violet-400 font-mono text-xs">&lt;/body&gt;</code> tag
                                    </p>
                                </div>
                            </div>

                            {/* Code Block */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                                <pre className="relative rounded-2xl bg-zinc-950 p-6 overflow-x-auto border border-zinc-800">
                                    <code className="text-sm font-mono text-emerald-400">
                                        {embedCode}
                                    </code>
                                </pre>

                                {/* Copy Button - Always visible */}
                                <button
                                    onClick={() => copyToClipboard(embedCode)}
                                    className={`absolute top-4 right-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${copied
                                        ? "bg-emerald-500 text-white"
                                        : "bg-violet-600 text-white hover:bg-violet-700"
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="h-4 w-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="h-4 w-4" />
                                            Copy Code
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Instructions */}
                            <div className="mt-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 p-6 border border-violet-200/50 dark:border-violet-700/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-800/50">
                                        <Zap className="h-4 w-4 text-violet-600 dark:text-violet-300" />
                                    </div>
                                    <h3 className="text-base font-bold text-violet-900 dark:text-violet-200">
                                        Quick Setup Instructions
                                    </h3>
                                </div>
                                <div className="grid gap-3">
                                    {[
                                        { step: 1, text: "Copy the embed code above" },
                                        { step: 2, text: "Open your website's HTML file" },
                                        { step: 3, text: "Paste the code before the closing </body> tag" },
                                        { step: 4, text: "Save and refresh - the chat widget will appear!" },
                                    ].map((item) => (
                                        <div key={item.step} className="flex items-center gap-3">
                                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                                                {item.step}
                                            </div>
                                            <span className="text-sm text-violet-800 dark:text-violet-300">
                                                {item.text}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {/* Header with Icon */}
                            <div className="flex items-start gap-4 mb-6">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30">
                                    <Globe className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                                        Public Chat Link
                                    </h2>
                                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                        Share this link with anyone to let them chat with your AI agent directly
                                    </p>
                                </div>
                            </div>

                            {/* Link Display */}
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity" />
                                <div className="relative flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900 p-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                                        <Zap className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <div className="flex-1 font-mono text-sm text-violet-600 dark:text-violet-400 break-all">
                                        {shareLink}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(shareLink)}
                                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all shrink-0 ${copied
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-lg hover:shadow-violet-500/30"
                                            }`}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4" />
                                                Copy Link
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Preview Button */}
                            <div className="mt-6 flex gap-3">
                                <a
                                    href={shareLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-100 dark:to-white px-6 py-3.5 text-sm font-bold text-white dark:text-zinc-900 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                    Open Chat in New Tab
                                </a>
                            </div>

                            {/* Social Share Options */}
                            <div className="mt-8 rounded-2xl bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800/50 dark:to-zinc-900/50 p-6 border border-zinc-200 dark:border-zinc-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                                        <Share2 className="h-5 w-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                            Share with the World
                                        </h3>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            Let everyone know about your new AI agent
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-4 gap-3">
                                    {/* X (Twitter) */}
                                    <button className="group flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-200 dark:border-zinc-700 transition-all hover:border-zinc-900 hover:shadow-lg hover:scale-105 dark:hover:border-zinc-400">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform group-hover:scale-110">
                                            <XLogo className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">X</span>
                                    </button>

                                    {/* LinkedIn */}
                                    <button className="group flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-200 dark:border-zinc-700 transition-all hover:border-[#0A66C2] hover:shadow-lg hover:scale-105">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0A66C2] text-white transition-transform group-hover:scale-110">
                                            <LinkedInLogo className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">LinkedIn</span>
                                    </button>

                                    {/* WhatsApp */}
                                    <button className="group flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-200 dark:border-zinc-700 transition-all hover:border-[#25D366] hover:shadow-lg hover:scale-105">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform group-hover:scale-110">
                                            <WhatsAppLogo className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">WhatsApp</span>
                                    </button>

                                    {/* Facebook */}
                                    <button className="group flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-zinc-900 p-4 border-2 border-zinc-200 dark:border-zinc-700 transition-all hover:border-[#1877F2] hover:shadow-lg hover:scale-105">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877F2] text-white transition-transform group-hover:scale-110">
                                            <FacebookLogo className="h-5 w-5" />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Facebook</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between gap-4 mt-10 p-4 rounded-2xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200/50 dark:border-zinc-800/50">
                    <Button
                        variant="outline"
                        onClick={() => router.push("/ui-setup")}
                        className="h-12 rounded-xl border-2 border-zinc-300 dark:border-zinc-700 px-6 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 hover:border-zinc-400 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-all"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to UI Setup
                    </Button>

                    <Button
                        onClick={() => router.push("/dashboard")}
                        className="h-12 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 text-white shadow-xl shadow-violet-500/30 hover:shadow-2xl hover:shadow-violet-500/40 hover:scale-105 transition-all"
                    >
                        Go to Dashboard
                        <Sparkles className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>

            <style jsx global>{`
                @keyframes paper-fall {
                    0% {
                        transform: translateY(0) translateX(0) rotate(0deg);
                        opacity: 1;
                    }
                    25% {
                        transform: translateY(25vh) translateX(var(--sway-amount)) rotate(180deg);
                    }
                    50% {
                        transform: translateY(50vh) translateX(calc(var(--sway-amount) * -0.5)) rotate(360deg);
                    }
                    75% {
                        transform: translateY(75vh) translateX(var(--sway-amount)) rotate(540deg);
                    }
                    100% {
                        transform: translateY(110vh) translateX(0) rotate(720deg);
                        opacity: 0;
                    }
                }
                
                @keyframes paper-tumble {
                    0% {
                        transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
                    }
                    25% {
                        transform: rotateX(90deg) rotateY(45deg) rotateZ(90deg) scale(0.9);
                    }
                    50% {
                        transform: rotateX(180deg) rotateY(90deg) rotateZ(180deg) scale(1);
                    }
                    75% {
                        transform: rotateX(270deg) rotateY(135deg) rotateZ(270deg) scale(0.9);
                    }
                    100% {
                        transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg) scale(1);
                    }
                }
                
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s ease-out 0.2s both;
                }
            `}</style>
        </div>
    );
}
