"use client";

import * as React from "react";
import {
    Plus,
    Trash2,
    Sparkles,
    Loader2,
    CheckCircle2,
    XCircle,
    MessageSquare,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface QAPair {
    id: string; // local key for React
    question: string;
    answer: string;
}

type SaveStatus = "idle" | "saving" | "done" | "error";

interface Props {
    accessToken: string;
    onSuccess?: () => void;
    isCollapsed?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function uid() {
    return Math.random().toString(36).slice(2);
}

function emptyPair(): QAPair {
    return { id: uid(), question: "", answer: "" };
}

// ─── Component ────────────────────────────────────────────────────────────────
export function QAManualEntry({ accessToken, onSuccess, isCollapsed }: Props) {
    const [pairs, setPairs] = React.useState<QAPair[]>([emptyPair()]);
    const [saveStatus, setSaveStatus] = React.useState<SaveStatus>("idle");
    const [errorMsg, setErrorMsg] = React.useState("");
    const [savedCount, setSavedCount] = React.useState(0);

    const isSaving = saveStatus === "saving";

    // ── Pair mutations ────────────────────────────────────────────────────────
    function addPair() {
        setPairs((prev) => [...prev, emptyPair()]);
        setSaveStatus("idle");
        setErrorMsg("");
    }

    function removePair(id: string) {
        setPairs((prev) => {
            const next = prev.filter((p) => p.id !== id);
            return next.length > 0 ? next : [emptyPair()];
        });
    }

    function updatePair(id: string, field: "question" | "answer", value: string) {
        setPairs((prev) =>
            prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
        );
        if (saveStatus !== "idle") {
            setSaveStatus("idle");
            setErrorMsg("");
        }
    }

    // ── Validation ────────────────────────────────────────────────────────────
    const validPairs = pairs.filter(
        (p) => p.question.trim().length > 0 && p.answer.trim().length > 0
    );
    const canSave = !isSaving && validPairs.length > 0;

    // ── Save & Train ──────────────────────────────────────────────────────────
    async function handleSave() {
        if (!canSave) return;
        setSaveStatus("saving");
        setErrorMsg("");

        try {
            const res = await fetch("/api/process-qa", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    qaPairs: validPairs.map(({ question, answer }) => ({ question, answer })),
                    accessToken,
                }),
            });

            const data = await res.json() as {
                success: boolean;
                savedCount?: number;
                error?: string;
            };

            if (!data.success) {
                setSaveStatus("error");
                setErrorMsg(data.error ?? "Server returned an error.");
                return;
            }

            setSavedCount(data.savedCount ?? validPairs.length);
            setSaveStatus("done");
            // Reset to a fresh single pair after success
            setPairs([emptyPair()]);
            onSuccess?.();
        } catch (err) {
            setSaveStatus("error");
            setErrorMsg(err instanceof Error ? err.message : "Network error. Please try again.");
        }
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="space-y-3">
            {!isCollapsed && (
                <>
                    {/* ── Q&A Pairs ── */}
                    <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                        {pairs.map((pair, idx) => (
                            <div
                                key={pair.id}
                                className="group relative rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-800/50"
                            >
                                {/* Pair number + delete */}
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                                        {idx + 1}
                                    </span>
                                    <button
                                        onClick={() => removePair(pair.id)}
                                        disabled={isSaving}
                                        title="Remove pair"
                                        className="rounded-lg p-1 text-zinc-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-500 disabled:pointer-events-none dark:hover:bg-red-950/30"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                {/* Question */}
                                <div className="mb-2">
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Question
                                    </label>
                                    <input
                                        type="text"
                                        value={pair.question}
                                        onChange={(e) => updatePair(pair.id, "question", e.target.value)}
                                        disabled={isSaving}
                                        placeholder="e.g. What is your refund policy?"
                                        className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                    />
                                </div>

                                {/* Answer */}
                                <div>
                                    <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                                        Answer
                                    </label>
                                    <textarea
                                        value={pair.answer}
                                        onChange={(e) => updatePair(pair.id, "answer", e.target.value)}
                                        disabled={isSaving}
                                        rows={3}
                                        placeholder="e.g. We offer a 30-day money-back guarantee on all plans."
                                        className="w-full resize-none rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── Actions row ── */}
                    <div className="flex items-center gap-2">
                        {/* Add Q&A */}
                        <button
                            onClick={addPair}
                            disabled={isSaving}
                            className="flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 px-3 py-2 text-xs font-semibold text-zinc-500 transition-colors hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 disabled:pointer-events-none disabled:opacity-50 dark:border-zinc-600 dark:hover:border-emerald-600 dark:hover:bg-emerald-950/20 dark:hover:text-emerald-400"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Q&amp;A
                        </button>

                        {/* Spacer */}
                        <div className="flex-1" />

                        {/* Save & Train */}
                        <button
                            onClick={handleSave}
                            disabled={!canSave}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Sparkles className="h-4 w-4" />
                            )}
                            {isSaving ? "Saving…" : "Save & Train"}
                        </button>
                    </div>
                </>
            )}

            {/* ── Status banners ── */}
            {saveStatus === "done" && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>
                        <strong>{savedCount} Q&amp;A pair{savedCount !== 1 ? "s" : ""}</strong> saved to knowledge base successfully!
                    </span>
                    <button
                        onClick={() => setSaveStatus("idle")}
                        className="ml-auto text-xs text-emerald-600 underline hover:no-underline dark:text-emerald-400"
                    >
                        Add more
                    </button>
                </div>
            )}

            {saveStatus === "error" && (
                <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400">
                    <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                    <button
                        onClick={() => { setSaveStatus("idle"); setErrorMsg(""); }}
                        className="ml-auto text-xs text-red-600 underline hover:no-underline dark:text-red-400"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* ── Hint when no valid pairs ── */}
            {saveStatus === "idle" && validPairs.length === 0 && pairs.some((p) => p.question || p.answer) && (
                <p className="px-1 text-xs text-amber-600 dark:text-amber-400">
                    Fill in both Question and Answer for at least one pair to save.
                </p>
            )}
        </div>
    );
}
