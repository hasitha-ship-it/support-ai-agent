"use client";

import * as React from "react";
import { useDropzone } from "react-dropzone";
import { FileText, Loader2, CheckCircle2, XCircle, UploadCloud, ChevronDown, ChevronUp } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type UploadStatus = "idle" | "extracting" | "processing" | "done" | "error";

interface Props {
    accessToken: string;
    onSuccess?: () => void; // optional callback so parent can refresh data
    isCollapsed?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
    });
}

async function extractTextFromDocx(file: File): Promise<string> {
    const mammoth = await import("mammoth");
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
}

// Cache the pdfjs module so we only set up the worker once per session
let pdfjsCache: typeof import("pdfjs-dist") | null = null;

async function getPdfjsLib() {
    if (pdfjsCache) return pdfjsCache;
    const pdfjs = await import("pdfjs-dist");
    // Use the locally-served worker (copied to /public during build)
    // Wrap in a new Worker to hand the port directly — avoids pdfjs v5 CDN fallback
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
    pdfjsCache = pdfjs;
    return pdfjs;
}

async function extractTextFromPdf(file: File): Promise<string> {
    const pdfjsLib = await getPdfjsLib();
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const pageTexts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
            .map((item) => ("str" in item ? item.str : ""))
            .join(" ");
        pageTexts.push(pageText);
    }
    await pdf.destroy();
    return pageTexts.join("\n\n");
}


async function extractText(file: File): Promise<string> {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "txt") return readFileAsText(file);
    if (ext === "docx") return extractTextFromDocx(file);
    if (ext === "pdf") return extractTextFromPdf(file);
    throw new Error(`Unsupported file type: .${ext}`);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DocumentUploader({ accessToken, onSuccess, isCollapsed }: Props) {
    const [status, setStatus] = React.useState<UploadStatus>("idle");
    const [fileName, setFileName] = React.useState("");
    const [charCount, setCharCount] = React.useState(0);
    const [chunkCount, setChunkCount] = React.useState(0);
    const [errorMsg, setErrorMsg] = React.useState("");

    const isProcessing = status === "extracting" || status === "processing";

    const onDrop = React.useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (!file) return;

            setFileName(file.name);
            setStatus("extracting");
            setErrorMsg("");
            setCharCount(0);
            setChunkCount(0);

            let extractedText = "";
            try {
                extractedText = await extractText(file);
            } catch (err) {
                setStatus("error");
                setErrorMsg(err instanceof Error ? err.message : "Failed to read file.");
                return;
            }

            if (!extractedText.trim()) {
                setStatus("error");
                setErrorMsg("The file appears to be empty or has no readable text.");
                return;
            }

            setCharCount(extractedText.length);
            setStatus("processing");

            try {
                const res = await fetch("/api/process-document", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        text: extractedText,
                        fileName: file.name,
                        accessToken,
                    }),
                });
                const data = await res.json() as {
                    success: boolean;
                    chunkCount?: number;
                    charCount?: number;
                    error?: string;
                };

                if (!data.success) {
                    setStatus("error");
                    setErrorMsg(data.error ?? "Server returned an error.");
                    return;
                }

                setChunkCount(data.chunkCount ?? 0);
                setStatus("done");
                onSuccess?.();
            } catch (err) {
                setStatus("error");
                setErrorMsg(err instanceof Error ? err.message : "Network error. Please try again.");
            }
        },
        [accessToken, onSuccess]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        disabled: isProcessing,
        accept: {
            "application/pdf": [".pdf"],
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
            "text/plain": [".txt"],
        },
        maxFiles: 1,
    });

    return (
        <div className="space-y-3">
            {!isCollapsed && (
                <>
                    {/* ── Drop Zone ── */}
                    <div
                        {...getRootProps()}
                        className={`
                    relative flex cursor-pointer flex-col items-center justify-center gap-3
                    rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-all duration-200
                    ${isProcessing
                                ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-60 dark:border-zinc-700 dark:bg-zinc-800/30"
                                : isDragActive
                                    ? "border-blue-400 bg-blue-50 dark:border-blue-600 dark:bg-blue-950/30"
                                    : "border-zinc-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 dark:border-zinc-700 dark:bg-zinc-800/40 dark:hover:border-blue-700 dark:hover:bg-blue-950/20"
                            }
                `}
                    >
                        <input {...getInputProps()} />

                        {/* Icon */}
                        <div className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${isDragActive ? "bg-blue-100 dark:bg-blue-900/50" : "bg-blue-50 dark:bg-blue-900/30"}`}>
                            {isProcessing ? (
                                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                            ) : (
                                <UploadCloud className={`h-6 w-6 ${isDragActive ? "text-blue-600" : "text-blue-500"}`} />
                            )}
                        </div>

                        {/* Labels */}
                        <div>
                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                {isProcessing
                                    ? status === "extracting"
                                        ? "Extracting text…"
                                        : "Processing with AI…"
                                    : isDragActive
                                        ? "Drop your file here"
                                        : "Drag & drop a document"}
                            </p>
                            <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                                {isProcessing ? fileName : "PDF, DOCX, or TXT · click to browse"}
                            </p>
                        </div>

                        {/* Progress indicator */}
                        {isProcessing && (
                            <div className="w-full max-w-[200px]">
                                <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/40">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 ${status === "extracting" ? "w-2/5" : "w-4/5"} transition-all duration-700`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Result / Error Banner ── */}
                    {status === "done" && (
                        <div className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <div>
                                <p className="font-semibold">{fileName}</p>
                                <p className="text-xs font-normal opacity-80">
                                    {charCount.toLocaleString()} characters → {chunkCount} chunks saved to knowledge base
                                </p>
                            </div>
                            <button
                                onClick={() => { setStatus("idle"); setFileName(""); }}
                                className="ml-auto text-xs text-emerald-600 underline hover:no-underline dark:text-emerald-400"
                            >
                                Upload another
                            </button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/40 dark:bg-red-950/30 dark:text-red-400">
                            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{errorMsg}</span>
                            <button
                                onClick={() => { setStatus("idle"); setErrorMsg(""); }}
                                className="ml-auto text-xs text-red-600 underline hover:no-underline dark:text-red-400"
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    {/* ── Supported formats hint ── */}
                    {status === "idle" && (
                        <div className="flex items-center gap-3 px-1">
                            {[
                                { label: "PDF", color: "text-red-500 bg-red-50 dark:bg-red-950/30" },
                                { label: "DOCX", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/30" },
                                { label: "TXT", color: "text-zinc-500 bg-zinc-100 dark:bg-zinc-800" },
                            ].map(({ label, color }) => (
                                <span key={label} className={`rounded-md px-2 py-0.5 text-xs font-semibold ${color}`}>
                                    {label}
                                </span>
                            ))}
                            <span className="text-xs text-zinc-400">Text is extracted in your browser</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
