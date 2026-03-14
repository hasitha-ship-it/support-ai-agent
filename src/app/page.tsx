"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = React.useState<Mode>("signin");
  const [animating, setAnimating] = React.useState(false);

  // Sign In state
  const [siEmail, setSiEmail] = React.useState("");
  const [siPassword, setSiPassword] = React.useState("");
  const [siError, setSiError] = React.useState("");
  const [siLoading, setSiLoading] = React.useState(false);

  // Sign Up state
  const [suName, setSuName] = React.useState("");
  const [suEmail, setSuEmail] = React.useState("");
  const [suPassword, setSuPassword] = React.useState("");
  const [suConfirm, setSuConfirm] = React.useState("");
  const [suError, setSuError] = React.useState("");
  const [suSuccess, setSuSuccess] = React.useState("");
  const [suLoading, setSuLoading] = React.useState(false);

  // Show/hide password
  const [showSiPw, setShowSiPw] = React.useState(false);
  const [showSuPw, setShowSuPw] = React.useState(false);
  const [showSuCPw, setShowSuCPw] = React.useState(false);

  const switchMode = (next: Mode) => {
    if (next === mode || animating) return;
    setAnimating(true);
    setSiError("");
    setSuError("");
    setSuSuccess("");
    setTimeout(() => {
      setMode(next);
      setAnimating(false);
    }, 280);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSiError("");

    if (!siEmail.trim()) return setSiError("Email is required.");
    if (!siPassword) return setSiError("Password is required.");

    setSiLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: siEmail.trim(),
      password: siPassword,
    });
    setSiLoading(false);

    if (error) {
      setSiError(error.message);
    } else {
      router.push("/onboarding");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuError("");
    setSuSuccess("");

    if (!suName.trim()) return setSuError("Full name is required.");
    if (!suEmail.trim()) return setSuError("Email is required.");
    if (suPassword.length < 6)
      return setSuError("Password must be at least 6 characters.");
    if (suPassword !== suConfirm) return setSuError("Passwords do not match.");

    setSuLoading(true);
    const { error } = await supabase.auth.signUp({
      email: suEmail.trim(),
      password: suPassword,
      options: { data: { full_name: suName.trim() } },
    });
    setSuLoading(false);

    if (error) {
      setSuError(error.message);
    } else {
      setSuSuccess(
        "Account created! Check your email to confirm your account."
      );
      setSuName("");
      setSuEmail("");
      setSuPassword("");
      setSuConfirm("");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ─── LEFT COLUMN — Branding ─────────────────────────────── */}
      <div className="relative hidden w-1/2 overflow-hidden lg:flex lg:flex-col">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-700" />

        {/* Animated blobs */}
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-violet-400/30 blur-3xl animate-pulse" />
        <div
          className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-indigo-400/30 blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/4 h-64 w-64 rounded-full bg-purple-300/20 blur-2xl animate-pulse"
          style={{ animationDelay: "0.75s" }}
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Content */}
        <div className="relative flex flex-1 flex-col items-center justify-center px-12 py-16 text-white">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm ring-1 ring-white/30">
              <svg
                className="h-7 w-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <span className="text-2xl font-bold tracking-tight">
              SupportAI
            </span>
          </div>

          {/* Main headline */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight xl:text-5xl">
              Your AI-powered
              <br />
              <span className="bg-gradient-to-r from-violet-200 to-pink-200 bg-clip-text text-transparent">
                support agent
              </span>
            </h1>
            <p className="mx-auto max-w-sm text-lg text-violet-100/80 leading-relaxed">
              Convert visitors into customers, qualify leads, and handle support
              — all on autopilot.
            </p>
          </div>

          {/* Feature chips */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {[
              "⚡ Instant Setup",
              "🤖 AI-Powered",
              "📊 Analytics",
              "💬 24/7 Support",
            ].map((f) => (
              <span
                key={f}
                className="rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm ring-1 ring-white/20"
              >
                {f}
              </span>
            ))}
          </div>

          {/* Testimonial card */}
          <div className="w-full max-w-sm rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20 shadow-xl">
            <div className="mb-3 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-4 w-4 text-yellow-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-violet-100">
              &ldquo;SupportAI cut our support tickets by 60% while boosting
              qualified demo bookings by 3×. Incredible ROI.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-pink-400 to-violet-400 text-xs font-bold text-white">
                AK
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Alex Kim</p>
                <p className="text-xs text-violet-300">Founder @ NexusSaaS</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT COLUMN — Auth Forms ──────────────────────────── */}
      <div className="flex w-full flex-col items-center justify-center bg-zinc-50 px-6 py-12 dark:bg-zinc-950 lg:w-1/2 lg:px-12 xl:px-20">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
            SupportAI
          </span>
        </div>

        <div className="w-full max-w-md">
          {/* Toggle pill */}
          <div className="mb-8 flex items-center rounded-xl bg-zinc-200/70 p-1 dark:bg-zinc-800/70">
            <button
              onClick={() => switchMode("signin")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${mode === "signin"
                ? "bg-white text-violet-700 shadow-sm dark:bg-zinc-700 dark:text-violet-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchMode("signup")}
              className={`flex-1 rounded-lg py-2.5 text-sm font-semibold transition-all duration-300 ${mode === "signup"
                ? "bg-white text-violet-700 shadow-sm dark:bg-zinc-700 dark:text-violet-400"
                : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form wrapper with animation */}
          <div
            className={`transition-all duration-280 ${animating
              ? "opacity-0 translate-y-2"
              : "opacity-100 translate-y-0"
              }`}
          >
            {mode === "signin" ? (
              /* ── SIGN IN FORM ── */
              <form onSubmit={handleSignIn} noValidate className="space-y-5">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Welcome back
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Sign in to your SupportAI account
                  </p>
                </div>

                {siError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {siError}
                  </div>
                )}

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={siEmail}
                      onChange={(e) => setSiEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-violet-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-xs font-medium text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                    <input
                      type={showSiPw ? "text" : "password"}
                      value={siPassword}
                      onChange={(e) => setSiPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-11 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSiPw(!showSiPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showSiPw ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={siLoading}
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {siLoading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Signing in…
                    </>
                  ) : (
                    <>
                      Sign In
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signup")}
                    className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  >
                    Sign up free
                  </button>
                </p>
              </form>
            ) : (
              /* ── SIGN UP FORM ── */
              <form onSubmit={handleSignUp} noValidate className="space-y-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                    Create your account
                  </h2>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Start your free trial — no credit card required
                  </p>
                </div>

                {suError && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800/50 dark:bg-red-950/30 dark:text-red-400">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {suError}
                  </div>
                )}

                {suSuccess && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                    <svg
                      className="mt-0.5 h-4 w-4 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {suSuccess}
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Full name
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      value={suName}
                      onChange={(e) => setSuName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-violet-500"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Email address
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </span>
                    <input
                      type="email"
                      value={suEmail}
                      onChange={(e) => setSuEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-violet-500"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </span>
                    <input
                      type={showSuPw ? "text" : "password"}
                      value={suPassword}
                      onChange={(e) => setSuPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-11 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuPw(!showSuPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showSuPw ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Confirm password
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </span>
                    <input
                      type={showSuCPw ? "text" : "password"}
                      value={suConfirm}
                      onChange={(e) => setSuConfirm(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-11 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-violet-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSuCPw(!showSuCPw)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                    >
                      {showSuCPw ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={suLoading}
                  className="group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {suLoading ? (
                    <>
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating account…
                    </>
                  ) : (
                    <>
                      Create Account
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-zinc-400">
                  By signing up you agree to our{" "}
                  <a
                    href="#"
                    className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                  >
                    Terms
                  </a>{" "}
                  &amp;{" "}
                  <a
                    href="#"
                    className="font-medium text-violet-600 hover:underline dark:text-violet-400"
                  >
                    Privacy Policy
                  </a>
                </p>

                <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => switchMode("signin")}
                    className="font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-zinc-400 dark:text-zinc-600">
          © 2026 SupportAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
