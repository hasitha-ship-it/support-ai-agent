"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { createClient } from "@supabase/supabase-js";
import {
    CheckCircle,
    Copy,
    Check,
    ExternalLink,
    LayoutDashboard,
    Sparkles,
    Code2,
    Globe,
    Rocket,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DeployPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [agentName, setAgentName] = React.useState("Your AI Agent");
    const [primaryColor, setPrimaryColor] = React.useState("#7c3aed");
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
        async function loadAgent() {
            const supabase = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            setUserId(session.user.id);

            const { data: profile } = await supabase
                .from("profiles")
                .select("ui_config")
                .eq("id", session.user.id)
                .single();

            if (profile?.ui_config) {
                setAgentName(profile.ui_config.agentName ?? "Your AI Agent");
                setPrimaryColor(profile.ui_config.primaryColor ?? "#7c3aed");
            }
        }
        loadAgent();
    }, []);

    const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
    const embedCode = userId ? `<!-- ${agentName} Chat Widget -->
<script>
  (function() {
    var botId = "${userId}";
    var script = document.createElement("script");
    script.src = "${origin}/widget.js";
    script.setAttribute("data-bot-id", botId);
    script.async = true;
    document.head.appendChild(script);
  })();
</script>` : "Loading...";

    const configUrl = userId ? `${origin}/api/widget/${userId}/config` : "";

    const gridClass = mounted
        ? resolvedTheme === "dark" ? "bg-grid-dark" : "bg-grid-light"
        : "bg-grid-light";

    function copyEmbed() {
        navigator.clipboard.writeText(embedCode).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    return (
        <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass} flex flex-col items-center justify-center p-6`}>
            {/* Theme Toggle */}
            <div className="fixed top-6 right-6 z-40">
                <ThemeToggle />
            </div>

            <div className="w-full max-w-2xl">
                {/* Success Header */}
                <div className="mb-8 text-center">
                    <div
                        className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl shadow-2xl"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}bb)`,
                            boxShadow: `0 20px 60px -10px ${primaryColor}50`,
                        }}
                    >
                        <Rocket className="h-10 w-10 text-white" />
                    </div>
                    <div className="mb-2 flex items-center justify-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                            Agent Published Successfully!
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                        {agentName} is Live 🎉
                    </h1>
                    <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                        Your AI agent is ready. Embed it on any website using the code below.
                    </p>
                </div>

                {/* Embed Code Card */}
                <div className="mb-5 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3 dark:border-zinc-800">
                        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                            <Code2 className="h-4 w-4" />
                            Embed Code
                        </div>
                        <button
                            onClick={copyEmbed}
                            className="flex items-center gap-1.5 rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700 transition-all hover:bg-violet-100 hover:text-violet-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-violet-900/30 dark:hover:text-violet-400"
                        >
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    </div>
                    <pre className="overflow-x-auto p-5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                        <code>{embedCode}</code>
                    </pre>
                </div>

                {/* Widget Config API Link */}
                {userId && (
                    <div className="mb-5 flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <Globe className="h-4 w-4 shrink-0 text-violet-500" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">Widget Config API</p>
                            <p className="truncate text-xs text-zinc-400">{configUrl}</p>
                        </div>
                        <a
                            href={configUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg p-1.5 text-zinc-400 transition-all hover:bg-zinc-100 hover:text-violet-600 dark:hover:bg-zinc-800"
                        >
                            <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                    </div>
                )}

                {/* Instructions */}
                <div className="mb-6 rounded-xl border border-violet-200 bg-violet-50 px-5 py-4 dark:border-violet-800/50 dark:bg-violet-900/20">
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-violet-700 dark:text-violet-300">
                        <Sparkles className="h-4 w-4" />
                        How to embed
                    </div>
                    <ol className="space-y-1 text-xs text-violet-700 dark:text-violet-300 list-decimal list-inside">
                        <li>Copy the embed code above</li>
                        <li>Paste it inside the <code className="rounded bg-violet-100 px-1 dark:bg-violet-800/50">&lt;head&gt;</code> tag of your website</li>
                        <li>The chat widget will appear on every page automatically</li>
                    </ol>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/ui-setup")}
                        className="flex-1 rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-700 transition-all hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                        ✏️ Edit Widget
                    </button>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="flex-[2] flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-xl"
                        style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}cc)`,
                            boxShadow: `0 8px 24px -6px ${primaryColor}50`,
                        }}
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
}
