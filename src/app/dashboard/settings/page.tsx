"use client";

import * as React from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar, useSidebarState } from "@/components/sidebar";
import {
    Settings,
    Bell,
    Camera,
    Lock,
    Eye,
    EyeOff,
    Palette,
    Globe,
    Clock,
    Trash2,
    Check,
    AlertTriangle,
    Sun,
    Moon,
    Monitor,
    KeyRound,
    User,
    Mail,
    Briefcase,
    QrCode,
    X,
    Shield,
    Sparkles,
} from "lucide-react";

const settingsSections = [
    { id: "profile", label: "Profile", icon: User, color: "violet", activeClass: "text-violet-600 dark:text-violet-400", bgClass: "bg-violet-100 dark:bg-violet-900/30" },
    { id: "security", label: "Security", icon: Lock, color: "amber", activeClass: "text-amber-600 dark:text-amber-400", bgClass: "bg-amber-100 dark:bg-amber-900/30" },
    { id: "preferences", label: "Preferences", icon: Palette, color: "blue", activeClass: "text-blue-600 dark:text-blue-400", bgClass: "bg-blue-100 dark:bg-blue-900/30" },
    { id: "danger", label: "Danger Zone", icon: AlertTriangle, color: "red", activeClass: "text-red-600 dark:text-red-400", bgClass: "bg-red-100 dark:bg-red-900/30" },
];

type ThemeOption = "light" | "dark" | "system";

export default function SettingsPage() {
    const { sidebarOpen, setSidebarOpen, mainClass } = useSidebarState();
    const [activeSection, setActiveSection] = React.useState("profile");

    // Profile state
    const [fullName, setFullName] = React.useState("John Doe");
    const [jobTitle, setJobTitle] = React.useState("Founder");
    const [profileSaved, setProfileSaved] = React.useState(false);
    const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Security state
    const [currentPassword, setCurrentPassword] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [showCurrentPw, setShowCurrentPw] = React.useState(false);
    const [showNewPw, setShowNewPw] = React.useState(false);
    const [showConfirmPw, setShowConfirmPw] = React.useState(false);
    const [twoFAEnabled, setTwoFAEnabled] = React.useState(false);
    const [show2FAModal, setShow2FAModal] = React.useState(false);
    const [passwordSaved, setPasswordSaved] = React.useState(false);

    // Preferences state
    const [theme, setTheme] = React.useState<ThemeOption>("system");
    const [language, setLanguage] = React.useState("English");
    const [timezone, setTimezone] = React.useState("(GMT+5:30) Colombo");
    const [prefSaved, setPrefSaved] = React.useState(false);

    // Danger zone state
    const [showDeleteModal, setShowDeleteModal] = React.useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = React.useState("");

    // Password validation
    const pwHasLength = newPassword.length >= 8;
    const pwHasNumber = /\d/.test(newPassword);
    const pwHasUpper = /[A-Z]/.test(newPassword);
    const pwMatch = newPassword === confirmPassword && confirmPassword.length > 0;

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatarUrl(url);
        }
    };

    const handleProfileSave = () => {
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 2500);
    };

    const handlePasswordSave = () => {
        setPasswordSaved(true);
        setTimeout(() => {
            setPasswordSaved(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }, 2500);
    };

    const handlePrefSave = () => {
        setPrefSaved(true);
        setTimeout(() => setPrefSaved(false), 2500);
    };

    const handle2FAToggle = () => {
        if (!twoFAEnabled) {
            setShow2FAModal(true);
        } else {
            setTwoFAEnabled(false);
        }
    };

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Sidebar activePage="settings" open={sidebarOpen} onOpenChange={setSidebarOpen} />

            {/* Main Content */}
            <main className={mainClass}>
                {/* Top Header */}
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/80 px-6 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/80">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                            <Settings className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                        </div>
                        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Settings</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative rounded-xl bg-zinc-100 p-2.5 text-zinc-600 transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">3</span>
                        </button>
                        <ThemeToggle />
                    </div>
                </header>

                {/* ── Creative Tab Nav Bar ── */}
                <div className="sticky top-16 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/90">
                    <div className="flex items-center gap-1 px-6 py-2">
                        {settingsSections.map((section) => {
                            const isActive = activeSection === section.id;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => scrollToSection(section.id)}
                                    className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                                        ? section.id === "danger"
                                            ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
                                            : "bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-300"
                                        : section.id === "danger"
                                            ? "text-red-400 hover:bg-red-50/60 hover:text-red-500 dark:text-red-500 dark:hover:bg-red-900/10"
                                            : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                                        }`}
                                >
                                    {/* Icon bubble */}
                                    <span className={`flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200 ${isActive ? section.bgClass : "bg-transparent group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800"
                                        }`}>
                                        <section.icon className={`h-3.5 w-3.5 transition-all duration-200 ${isActive ? section.activeClass : ""
                                            }`} />
                                    </span>
                                    <span>{section.label}</span>
                                    {/* Active dot */}
                                    {isActive && (
                                        <span className={`ml-0.5 h-1.5 w-1.5 rounded-full ${section.id === "danger" ? "bg-red-500" : "bg-violet-500"
                                            }`} />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                    <div className="space-y-8 p-8 pb-24">

                        {/* ─── SECTION 1: Profile Information ─── */}
                        <section id="profile" className="scroll-mt-32">
                            <div className="mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-100 dark:bg-violet-900/30">
                                        <User className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                                    </div>
                                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Profile Information</h2>
                                </div>
                                <p className="mt-1 ml-9 text-sm text-zinc-500 dark:text-zinc-400">
                                    Your identity on the platform — used in emails and communications.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                {/* Avatar Section */}
                                <div className="flex items-center gap-5 border-b border-zinc-100 p-6 dark:border-zinc-800">
                                    <div className="relative">
                                        {avatarUrl ? (
                                            <img
                                                src={avatarUrl}
                                                alt="Profile"
                                                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-violet-100 dark:ring-violet-900/30"
                                            />
                                        ) : (
                                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-2xl font-bold text-white ring-4 ring-emerald-100 dark:ring-emerald-900/30">
                                                {getInitials(fullName)}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-600 text-white shadow-lg transition-all hover:bg-violet-700 dark:border-zinc-900"
                                        >
                                            <Camera className="h-3.5 w-3.5" />
                                        </button>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleAvatarUpload}
                                        />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Profile Photo</p>
                                        <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                            JPG, PNG or GIF. Max size 2MB.
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-all hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                                            >
                                                Upload Photo
                                            </button>
                                            {avatarUrl && (
                                                <button
                                                    onClick={() => setAvatarUrl(null)}
                                                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-all hover:bg-red-50 dark:hover:bg-red-900/10"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
                                    {/* Full Name */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            <User className="h-3 w-3" />
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="John Doe"
                                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
                                        />
                                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                            Used in email greetings: "Hi {fullName.split(" ")[0]},"
                                        </p>
                                    </div>

                                    {/* Email */}
                                    <div className="space-y-1.5">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            <Mail className="h-3 w-3" />
                                            Email Address
                                            <span className="ml-auto flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                                                <Lock className="h-2.5 w-2.5" />
                                                Locked
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value="john@example.com"
                                                disabled
                                                className="w-full cursor-not-allowed rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2.5 text-sm text-zinc-400 outline-none dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-500"
                                            />
                                            <Lock className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                                        </div>
                                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                            Contact support to change your email address.
                                        </p>
                                    </div>

                                    {/* Job Title */}
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            <Briefcase className="h-3 w-3" />
                                            Job Title
                                            <span className="ml-1 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-400 dark:bg-zinc-800">Optional</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={jobTitle}
                                            onChange={(e) => setJobTitle(e.target.value)}
                                            placeholder="e.g. Founder, Developer, Product Manager"
                                            className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
                                        />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex items-center justify-end border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                                    <button
                                        onClick={handleProfileSave}
                                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${profileSaved
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
                                            }`}
                                    >
                                        {profileSaved ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Saved!
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* ─── SECTION 2: Security & Login ─── */}
                        <section id="security" className="scroll-mt-32">
                            <div className="mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                                        <Lock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Security & Login</h2>
                                </div>
                                <p className="mt-1 ml-9 text-sm text-zinc-500 dark:text-zinc-400">
                                    Manage your password and two-factor authentication.
                                </p>
                            </div>

                            {/* Change Password */}
                            <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center gap-3 border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                                        <KeyRound className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Change Password</p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Use a strong, unique password</p>
                                    </div>
                                </div>

                                <div className="space-y-4 p-6">
                                    {/* Current Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPw ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                placeholder="Enter your current password"
                                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 pr-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPw(!showCurrentPw)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                            >
                                                {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPw ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Create a new password"
                                                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 pr-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPw(!showNewPw)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                            >
                                                {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>

                                        {/* Password Strength Indicators */}
                                        {newPassword.length > 0 && (
                                            <div className="mt-2 space-y-1.5">
                                                {[
                                                    { ok: pwHasLength, label: "At least 8 characters" },
                                                    { ok: pwHasNumber, label: "Contains a number" },
                                                    { ok: pwHasUpper, label: "Contains an uppercase letter" },
                                                ].map((rule) => (
                                                    <div key={rule.label} className="flex items-center gap-2">
                                                        <div className={`flex h-4 w-4 items-center justify-center rounded-full ${rule.ok ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"}`}>
                                                            {rule.ok && <Check className="h-2.5 w-2.5 text-white" />}
                                                        </div>
                                                        <span className={`text-xs ${rule.ok ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-400 dark:text-zinc-500"}`}>
                                                            {rule.label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPw ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Re-enter your new password"
                                                className={`w-full rounded-xl border bg-zinc-50 px-4 py-2.5 pr-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:ring-2 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${confirmPassword.length > 0
                                                    ? pwMatch
                                                        ? "border-emerald-400 focus:border-emerald-500 focus:ring-emerald-500/20"
                                                        : "border-red-400 focus:border-red-500 focus:ring-red-500/20"
                                                    : "border-zinc-200 focus:border-violet-500 focus:ring-violet-500/20 dark:border-zinc-700"
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                                            >
                                                {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {confirmPassword.length > 0 && !pwMatch && (
                                            <p className="text-[11px] text-red-500">Passwords do not match</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                                    <button
                                        onClick={handlePasswordSave}
                                        disabled={!pwHasLength || !pwHasNumber || !pwHasUpper || !pwMatch || !currentPassword}
                                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-40 ${passwordSaved
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
                                            }`}
                                    >
                                        {passwordSaved ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Password Updated!
                                            </>
                                        ) : (
                                            "Update Password"
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* 2FA */}
                            <div className="mt-4 rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
                                            <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                                                Two-Factor Authentication
                                            </p>
                                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                Add an extra layer of security to your account
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handle2FAToggle}
                                        className={`relative h-6 w-11 rounded-full transition-all duration-300 ${twoFAEnabled
                                            ? "bg-violet-600"
                                            : "bg-zinc-200 dark:bg-zinc-700"
                                            }`}
                                    >
                                        <span
                                            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ${twoFAEnabled ? "left-5" : "left-0.5"
                                                }`}
                                        />
                                    </button>
                                </div>
                                {twoFAEnabled && (
                                    <div className="flex items-center gap-2 border-t border-zinc-100 px-6 py-3 dark:border-zinc-800">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            Two-factor authentication is active
                                        </span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* ─── SECTION 3: Preferences ─── */}
                        <section id="preferences" className="scroll-mt-32">
                            <div className="mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                        <Palette className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Preferences</h2>
                                </div>
                                <p className="mt-1 ml-9 text-sm text-zinc-500 dark:text-zinc-400">
                                    Customize how the platform looks and behaves for you.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                                    {/* Theme */}
                                    <div className="p-6">
                                        <div className="mb-3 flex items-center gap-2">
                                            <Palette className="h-4 w-4 text-zinc-400" />
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Theme</p>
                                        </div>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { value: "light" as ThemeOption, label: "Light", icon: Sun, desc: "Always light" },
                                                { value: "dark" as ThemeOption, label: "Dark", icon: Moon, desc: "Always dark" },
                                                { value: "system" as ThemeOption, label: "System", icon: Monitor, desc: "Follow OS" },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setTheme(opt.value)}
                                                    className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${theme === opt.value
                                                        ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                                                        : "border-zinc-200 bg-zinc-50 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600"
                                                        }`}
                                                >
                                                    <opt.icon className={`h-5 w-5 ${theme === opt.value ? "text-violet-600 dark:text-violet-400" : "text-zinc-400"}`} />
                                                    <span className={`text-xs font-semibold ${theme === opt.value ? "text-violet-700 dark:text-violet-300" : "text-zinc-600 dark:text-zinc-400"}`}>
                                                        {opt.label}
                                                    </span>
                                                    <span className="text-[10px] text-zinc-400">{opt.desc}</span>
                                                    {theme === opt.value && (
                                                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-600">
                                                            <Check className="h-2.5 w-2.5 text-white" />
                                                        </div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language */}
                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-4 w-4 text-zinc-400" />
                                            <div>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Language</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Interface display language</p>
                                            </div>
                                        </div>
                                        <select
                                            value={language}
                                            onChange={(e) => setLanguage(e.target.value)}
                                            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                        >
                                            <option>English</option>
                                            <option>Sinhala</option>
                                            <option>Tamil</option>
                                            <option>French</option>
                                            <option>German</option>
                                        </select>
                                    </div>

                                    {/* Timezone */}
                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-4 w-4 text-zinc-400" />
                                            <div>
                                                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Timezone</p>
                                                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                    Used for reports and notification timing
                                                </p>
                                            </div>
                                        </div>
                                        <select
                                            value={timezone}
                                            onChange={(e) => setTimezone(e.target.value)}
                                            className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                                        >
                                            <option>(GMT+5:30) Colombo</option>
                                            <option>(GMT+0:00) London</option>
                                            <option>(GMT-5:00) New York</option>
                                            <option>(GMT-8:00) Los Angeles</option>
                                            <option>(GMT+5:30) Mumbai</option>
                                            <option>(GMT+8:00) Singapore</option>
                                            <option>(GMT+9:00) Tokyo</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end border-t border-zinc-100 px-6 py-4 dark:border-zinc-800">
                                    <button
                                        onClick={handlePrefSave}
                                        className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${prefSaved
                                            ? "bg-emerald-500 text-white"
                                            : "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40"
                                            }`}
                                    >
                                        {prefSaved ? (
                                            <>
                                                <Check className="h-4 w-4" />
                                                Preferences Saved!
                                            </>
                                        ) : (
                                            "Save Preferences"
                                        )}
                                    </button>
                                </div>
                            </div>
                        </section>

                        {/* ─── SECTION 4: Danger Zone ─── */}
                        <section id="danger" className="scroll-mt-32">
                            <div className="mb-5">
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                        <AlertTriangle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Danger Zone</h2>
                                </div>
                                <p className="mt-1 ml-9 text-sm text-zinc-500 dark:text-zinc-400">
                                    Irreversible actions. Proceed with extreme caution.
                                </p>
                            </div>

                            <div className="rounded-2xl border-2 border-red-200 bg-white dark:border-red-900/50 dark:bg-zinc-900">
                                <div className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 dark:bg-red-900/20">
                                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Delete Account</p>
                                            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                                                Once you delete your account, there is no going back. Please be certain.
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowDeleteModal(true)}
                                        className="shrink-0 rounded-xl border-2 border-red-500 px-4 py-2 text-sm font-semibold text-red-600 transition-all hover:bg-red-500 hover:text-white dark:border-red-500 dark:text-red-400 dark:hover:bg-red-500 dark:hover:text-white"
                                    >
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* ─── 2FA Modal ─── */}
            {show2FAModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Enable 2FA</h3>
                            </div>
                            <button
                                onClick={() => setShow2FAModal(false)}
                                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <p className="mb-4 text-sm text-zinc-500 dark:text-zinc-400">
                            Scan this QR code with your authenticator app (e.g. Google Authenticator) to enable 2FA.
                        </p>

                        {/* Fake QR Code */}
                        <div className="mb-4 flex items-center justify-center rounded-xl bg-zinc-50 p-6 dark:bg-zinc-800">
                            <div className="relative flex h-32 w-32 items-center justify-center rounded-xl bg-white shadow-inner dark:bg-zinc-700">
                                <QrCode className="h-24 w-24 text-zinc-900 dark:text-zinc-100" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600">
                                        <Sparkles className="h-4 w-4 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <p className="mb-4 text-center text-xs text-zinc-400 dark:text-zinc-500">
                            Can't scan? Use code: <span className="font-mono font-bold text-zinc-700 dark:text-zinc-300">WZNM-X7K2-9QP4</span>
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setShow2FAModal(false)}
                                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    setTwoFAEnabled(true);
                                    setShow2FAModal(false);
                                }}
                                className="flex-1 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-all hover:shadow-xl"
                            >
                                I've Scanned It ✓
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Delete Account Modal ─── */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/30">
                                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Delete Account</h3>
                            </div>
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText("");
                                }}
                                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="mb-4 rounded-xl bg-red-50 p-4 dark:bg-red-900/10">
                            <p className="text-sm font-medium text-red-700 dark:text-red-400">
                                ⚠️ This action is permanent and cannot be undone.
                            </p>
                            <ul className="mt-2 space-y-1 text-xs text-red-600 dark:text-red-400">
                                <li>• All your agents will be permanently deleted</li>
                                <li>• All conversation history will be lost</li>
                                <li>• Your subscription will be cancelled immediately</li>
                            </ul>
                        </div>

                        <p className="mb-2 text-sm text-zinc-600 dark:text-zinc-400">
                            To confirm, type <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">DELETE</span> below:
                        </p>
                        <input
                            type="text"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            placeholder="Type DELETE to confirm"
                            className="mb-4 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setDeleteConfirmText("");
                                }}
                                className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
                            >
                                Cancel
                            </button>
                            <button
                                disabled={deleteConfirmText !== "DELETE"}
                                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-500/30 transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
