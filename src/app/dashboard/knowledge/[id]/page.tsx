"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { useParams } from "next/navigation";
import {
    Bot,
    Globe,
    FileText,
    Type,
    HelpCircle as QuestionIcon,
    Upload,
    Link as LinkIcon,
    CheckCircle,
    Loader2,
    Trash2,
    Plus,
    Database,
    FileUp,
} from "lucide-react";
import { Sidebar, useSidebarState } from "@/components/sidebar";

export default function KnowledgeBaseHubPage() {
    const params = useParams();
    const agentId = params.id as string;
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [activeTab, setActiveTab] = React.useState<"website" | "files" | "text" | "qa">("website");

    // Website Crawler State
    const [websiteUrl, setWebsiteUrl] = React.useState("");
    const [isFetching, setIsFetching] = React.useState(false);
    const [fetchedLinks, setFetchedLinks] = React.useState<string[]>([]);
    const [selectedLinks, setSelectedLinks] = React.useState<Set<string>>(new Set());

    // File Upload State
    const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);

    // Plain Text State
    const [plainText, setPlainText] = React.useState("");

    // Q&A State
    const [qaList, setQaList] = React.useState<{ question: string; answer: string }[]>([]);
    const [newQuestion, setNewQuestion] = React.useState("");
    const [newAnswer, setNewAnswer] = React.useState("");

    // Dummy agent data
    const agent = {
        id: params.id || "wn_abc123xyz",
        name: "Customer Support Bot",
        theme: "#7c3aed",
    };

    // Usage Stats
    const usageStats = {
        charactersUsed: 150000,
        charactersLimit: 200000,
        sourcesAdded: 4,
        sourcesLimit: 5,
        webPagesCrawled: 12,
        webPagesLimit: 50,
    };

    // Handle Website Fetch
    const handleFetchLinks = () => {
        setIsFetching(true);
        setTimeout(() => {
            const dummyLinks = [
                `${websiteUrl}/about`,
                `${websiteUrl}/pricing`,
                `${websiteUrl}/features`,
                `${websiteUrl}/contact`,
                `${websiteUrl}/blog`,
            ];
            setFetchedLinks(dummyLinks);
            setIsFetching(false);
        }, 1500);
    };

    const handleSelectAll = () => {
        if (selectedLinks.size === fetchedLinks.length) {
            setSelectedLinks(new Set());
        } else {
            setSelectedLinks(new Set(fetchedLinks));
        }
    };

    const toggleLinkSelection = (link: string) => {
        const newSelected = new Set(selectedLinks);
        if (newSelected.has(link)) {
            newSelected.delete(link);
        } else {
            newSelected.add(link);
        }
        setSelectedLinks(newSelected);
    };

    // Handle File Upload
    const handleFileUpload = (files: FileList | null) => {
        if (files) {
            const newFiles = Array.from(files).filter(
                (file) =>
                    file.type === "application/pdf" ||
                    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                    file.type === "text/plain"
            );
            setUploadedFiles([...uploadedFiles, ...newFiles]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        handleFileUpload(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
    };

    // Handle Q&A
    const handleAddQA = () => {
        if (newQuestion.trim() && newAnswer.trim()) {
            setQaList([...qaList, { question: newQuestion, answer: newAnswer }]);
            setNewQuestion("");
            setNewAnswer("");
        }
    };

    const removeQA = (index: number) => {
        setQaList(qaList.filter((_, i) => i !== index));
    };

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="knowledge" agentId={agentId} open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <main className={mainClass}>
                {/* Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-9 w-9 items-center justify-center rounded-xl shadow-lg"
                            style={{
                                backgroundColor: agent.theme,
                                boxShadow: `0 4px 12px -2px ${agent.theme}40`,
                            }}
                        >
                            <Bot className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                                {agent.name}
                            </h1>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Knowledge Base Hub</p>
                        </div>
                    </div>
                    <ThemeToggle />
                </header>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Page Title */}
                    <div>
                        <h2 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                            📚 Knowledge Base Hub
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Train your AI agent with website content, documents, and custom Q&A
                        </p>
                    </div>

                    {/* Usage Stats Cards */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {/* Character Usage */}
                        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                                    <Database className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                                </div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Character Usage</h3>
                            </div>
                            <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">Knowledge Storage</p>
                            <div className="mb-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {usageStats.charactersUsed.toLocaleString()}
                                </span>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    / {usageStats.charactersLimit.toLocaleString()}
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all"
                                    style={{ width: `${(usageStats.charactersUsed / usageStats.charactersLimit) * 100}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                {((usageStats.charactersUsed / usageStats.charactersLimit) * 100).toFixed(1)}% used
                            </p>
                        </div>

                        {/* Source Limit */}
                        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                    <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Source Limit</h3>
                            </div>
                            <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">File/Link Count</p>
                            <div className="mb-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {usageStats.sourcesAdded}
                                </span>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    / {usageStats.sourcesLimit}
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 transition-all"
                                    style={{ width: `${(usageStats.sourcesAdded / usageStats.sourcesLimit) * 100}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                {usageStats.sourcesLimit - usageStats.sourcesAdded} sources remaining
                            </p>
                        </div>

                        {/* Crawler Pages */}
                        <div className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800/50 dark:bg-zinc-900/50">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                    <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Crawler Pages</h3>
                            </div>
                            <p className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">Web Limit</p>
                            <div className="mb-2 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                                    {usageStats.webPagesCrawled}
                                </span>
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                                    / {usageStats.webPagesLimit}
                                </span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 transition-all"
                                    style={{ width: `${(usageStats.webPagesCrawled / usageStats.webPagesLimit) * 100}%` }}
                                />
                            </div>
                            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                {usageStats.webPagesLimit - usageStats.webPagesCrawled} pages remaining
                            </p>
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <div className="border-b border-zinc-200 dark:border-zinc-800">
                        <div className="flex gap-1">
                            <button
                                onClick={() => setActiveTab("website")}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${activeTab === "website"
                                    ? "border-b-2 border-violet-600 text-violet-600 dark:text-violet-400"
                                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                    }`}
                            >
                                <Globe className="h-4 w-4" />
                                Website Crawler
                            </button>
                            <button
                                onClick={() => setActiveTab("files")}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${activeTab === "files"
                                    ? "border-b-2 border-violet-600 text-violet-600 dark:text-violet-400"
                                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                    }`}
                            >
                                <FileText className="h-4 w-4" />
                                Files Upload
                            </button>
                            <button
                                onClick={() => setActiveTab("text")}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${activeTab === "text"
                                    ? "border-b-2 border-violet-600 text-violet-600 dark:text-violet-400"
                                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                    }`}
                            >
                                <Type className="h-4 w-4" />
                                Plain Text
                            </button>
                            <button
                                onClick={() => setActiveTab("qa")}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all ${activeTab === "qa"
                                    ? "border-b-2 border-violet-600 text-violet-600 dark:text-violet-400"
                                    : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                                    }`}
                            >
                                <QuestionIcon className="h-4 w-4" />
                                Q&A
                            </button>
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[500px]">
                        {/* Website Crawler Tab */}
                        {activeTab === "website" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <div className="mb-6">
                                        <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                            🌐 Website Crawler
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Enter your website URL to crawl and extract content
                                        </p>
                                    </div>
                                    <div className="mb-4 flex gap-3">
                                        <div className="flex-1">
                                            <input
                                                type="url"
                                                value={websiteUrl}
                                                onChange={(e) => setWebsiteUrl(e.target.value)}
                                                placeholder="https://mysaas.com"
                                                className="w-full rounded-xl border-2 border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-600 dark:focus:ring-violet-900/30"
                                            />
                                        </div>
                                        <button
                                            onClick={handleFetchLinks}
                                            disabled={!websiteUrl || isFetching}
                                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            {isFetching ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Fetching...
                                                </>
                                            ) : (
                                                <>
                                                    <LinkIcon className="h-4 w-4" />
                                                    Fetch Links
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {fetchedLinks.length > 0 && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                    Found {fetchedLinks.length} pages
                                                </p>
                                                <button
                                                    onClick={handleSelectAll}
                                                    className="text-sm font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                                                >
                                                    {selectedLinks.size === fetchedLinks.length ? "Deselect All" : "Select All"}
                                                </button>
                                            </div>
                                            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                                                {fetchedLinks.map((link, index) => (
                                                    <label
                                                        key={index}
                                                        className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-all hover:bg-white dark:hover:bg-zinc-800"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedLinks.has(link)}
                                                            onChange={() => toggleLinkSelection(link)}
                                                            className="h-4 w-4 rounded border-zinc-300 text-violet-600 focus:ring-2 focus:ring-violet-500 dark:border-zinc-600"
                                                        />
                                                        <span className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
                                                            {link}
                                                        </span>
                                                    </label>
                                                ))}
                                            </div>
                                            <button
                                                disabled={selectedLinks.size === 0}
                                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                                Train Bot with {selectedLinks.size} Selected Pages
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Files Upload Tab */}
                        {activeTab === "files" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <div className="mb-6">
                                        <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                            📄 Files Upload
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Upload PDF, DOCX, or TXT files to train your bot
                                        </p>
                                    </div>
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        className={`mb-6 rounded-2xl border-2 border-dashed p-12 text-center transition-all ${isDragging
                                            ? "border-violet-400 bg-violet-50 dark:border-violet-600 dark:bg-violet-900/20"
                                            : "border-zinc-300 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900/50"
                                            }`}
                                    >
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 shadow-lg shadow-violet-500/30">
                                                <FileUp className="h-8 w-8 text-white" />
                                            </div>
                                            <div>
                                                <p className="mb-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                                    Drag & Drop your files here
                                                </p>
                                                <p className="text-sm text-zinc-600 dark:text-zinc-400">or click to browse</p>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept=".pdf,.docx,.txt"
                                                onChange={(e) => handleFileUpload(e.target.files)}
                                                className="hidden"
                                                id="file-upload"
                                            />
                                            <label
                                                htmlFor="file-upload"
                                                className="cursor-pointer rounded-lg border-2 border-violet-600 px-6 py-2 text-sm font-semibold text-violet-600 transition-all hover:bg-violet-600 hover:text-white dark:border-violet-400 dark:text-violet-400 dark:hover:bg-violet-600 dark:hover:text-white"
                                            >
                                                Browse Files
                                            </label>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Supported: PDF, DOCX, TXT</p>
                                        </div>
                                    </div>
                                    {uploadedFiles.length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                Uploaded Files ({uploadedFiles.length})
                                            </p>
                                            <div className="space-y-2">
                                                {uploadedFiles.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                                                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{file.name}</p>
                                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                                    {(file.size / 1024).toFixed(2)} KB
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => removeFile(index)}
                                                            className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40">
                                                <Upload className="h-4 w-4" />
                                                Train Bot with {uploadedFiles.length} Files
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Plain Text Tab */}
                        {activeTab === "text" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <div className="mb-6">
                                        <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                            📝 Plain Text
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Add custom text content that&apos;s not on your website or in files
                                        </p>
                                    </div>
                                    <textarea
                                        value={plainText}
                                        onChange={(e) => setPlainText(e.target.value)}
                                        placeholder={"Enter internal rules, policies, or any custom information here...\n\nExample:\n- Our support hours are 9 AM to 6 PM EST\n- We offer a 30-day money-back guarantee\n- Premium customers get priority support"}
                                        rows={12}
                                        className="mb-4 w-full resize-none rounded-xl border-2 border-zinc-200 bg-white p-4 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-600 dark:focus:ring-violet-900/30"
                                    />
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{plainText.length} characters</p>
                                        <button
                                            disabled={!plainText.trim()}
                                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                            Save & Train
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Q&A Tab */}
                        {activeTab === "qa" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-zinc-200/50 bg-white/80 p-6 backdrop-blur-sm dark:border-zinc-800/50 dark:bg-zinc-900/80">
                                    <div className="mb-6">
                                        <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                                            ❓ Q&A (Manual Questions)
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                                            Add specific question-answer pairs to ensure accurate responses
                                        </p>
                                    </div>
                                    <div className="mb-6 space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                Question
                                            </label>
                                            <input
                                                type="text"
                                                value={newQuestion}
                                                onChange={(e) => setNewQuestion(e.target.value)}
                                                placeholder="e.g., Who is the CEO?"
                                                className="w-full rounded-lg border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-600 dark:focus:ring-violet-900/30"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-2 block text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                Answer
                                            </label>
                                            <textarea
                                                value={newAnswer}
                                                onChange={(e) => setNewAnswer(e.target.value)}
                                                placeholder="e.g., Mr. Perera."
                                                rows={3}
                                                className="w-full resize-none rounded-lg border-2 border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-violet-400 focus:outline-none focus:ring-4 focus:ring-violet-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-violet-600 dark:focus:ring-violet-900/30"
                                            />
                                        </div>
                                        <button
                                            onClick={handleAddQA}
                                            disabled={!newQuestion.trim() || !newAnswer.trim()}
                                            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Q&A Pair
                                        </button>
                                    </div>
                                    {qaList.length > 0 && (
                                        <div className="space-y-4">
                                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                                                Saved Q&A Pairs ({qaList.length})
                                            </p>
                                            <div className="space-y-3">
                                                {qaList.map((qa, index) => (
                                                    <div
                                                        key={index}
                                                        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
                                                    >
                                                        <div className="mb-3 flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <p className="mb-1 text-xs font-semibold text-violet-600 dark:text-violet-400">
                                                                    Q: Question
                                                                </p>
                                                                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                                                                    {qa.question}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => removeQA(index)}
                                                                className="rounded-lg p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                                                A: Answer
                                                            </p>
                                                            <p className="text-sm text-zinc-700 dark:text-zinc-300">{qa.answer}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:shadow-xl hover:shadow-emerald-500/40">
                                                <CheckCircle className="h-4 w-4" />
                                                Train Bot with {qaList.length} Q&A Pairs
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
