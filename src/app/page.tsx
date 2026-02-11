"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  DollarSign,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type Category = "micro-saas" | "b2b-enterprise" | "agency" | null;

interface CategoryCardProps {
  id: Category;
  title: string;
  subtitle: string;
  description: string;
  focus: string;
  icon: React.ReactNode;
  tags: string[];
  themeColor: string;
  ringColor: string;
  bgColor: string;
  iconBgColor: string;
  tagBgColor: string;
  selected: boolean;
  onSelect: () => void;
}

function CategoryCard({
  title,
  subtitle,
  description,
  focus,
  icon,
  tags,
  themeColor,
  ringColor,
  bgColor,
  iconBgColor,
  tagBgColor,
  selected,
  onSelect,
}: CategoryCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`group relative flex w-full flex-col rounded-2xl border p-6 text-left transition-all duration-300 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
        ${selected
          ? `${ringColor} ring-2 shadow-lg ${bgColor}`
          : "border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:backdrop-blur-md dark:hover:border-zinc-700"
        }
      `}
    >
      {/* Selected Indicator */}
      {selected && (
        <div
          className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full ${themeColor} text-white shadow-lg`}
        >
          <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor} transition-transform duration-300 group-hover:scale-110`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {title}
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{subtitle}</p>
        </div>
      </div>

      {/* Focus Badge */}
      <div className="mt-4 flex items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${bgColor} ${themeColor.replace("bg-", "text-")}`}
        >
          <Sparkles className="h-3 w-3" />
          Focus: {focus}
        </span>
      </div>

      {/* Description */}
      <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>

      {/* Feature Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${tagBgColor} ${themeColor.replace("bg-", "text-")}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Hover gradient effect */}
      <div
        className={`absolute inset-0 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-20 ${themeColor}`}
      />
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const categories: Omit<CategoryCardProps, "selected" | "onSelect">[] = [
    {
      id: "micro-saas",
      title: "Micro-SaaS",
      subtitle: "For indie hackers & creators",
      description:
        "Convert traffic into Stripe revenue 24/7. Auto-negotiates discounts and closes deals while you sleep.",
      focus: "Sales",
      icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
      tags: ["Stripe Checkout", "Auto-Discount"],
      themeColor: "bg-emerald-600",
      ringColor: "ring-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      iconBgColor: "bg-emerald-100 dark:bg-emerald-900/50",
      tagBgColor: "bg-emerald-100/80 dark:bg-emerald-900/50",
    },
    {
      id: "b2b-enterprise",
      title: "B2B Enterprise",
      subtitle: "For sales-led companies",
      description:
        "Stop wasting time on bad leads. Qualifies visitors and only books demos with high-value prospects.",
      focus: "Leads",
      icon: <Users className="h-6 w-6 text-indigo-600" />,
      tags: ["Lead Qualification", "Calendly Booking"],
      themeColor: "bg-indigo-600",
      ringColor: "ring-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950/30",
      iconBgColor: "bg-indigo-100 dark:bg-indigo-900/50",
      tagBgColor: "bg-indigo-100/80 dark:bg-indigo-900/50",
    },
    {
      id: "agency",
      title: "Agency",
      subtitle: "For marketing & creative agencies",
      description:
        "Scale your client services with AI. Handle inquiries, schedule consultations, and showcase your portfolio 24/7.",
      focus: "Clients",
      icon: <Building2 className="h-6 w-6 text-amber-600" />,
      tags: ["Client Intake", "Portfolio Showcase"],
      themeColor: "bg-amber-600",
      ringColor: "ring-amber-600",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      iconBgColor: "bg-amber-100 dark:bg-amber-900/50",
      tagBgColor: "bg-amber-100/80 dark:bg-amber-900/50",
    },
  ];

  // Determine grid class based on theme
  const gridClass = mounted
    ? resolvedTheme === "dark"
      ? "bg-grid-dark"
      : "bg-grid-light"
    : "bg-grid-light";

  const handleContinue = () => {
    if (selectedCategory) {
      router.push("/training");
    }
  };

  return (
    <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 ${gridClass}`}>
      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-24">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-100 px-4 py-1.5 text-sm font-medium text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
            <Sparkles className="h-4 w-4" />
            Step 1 of 3
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
            What are you building?
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Choose your SaaS type to get an AI agent pre-configured for your
            specific goals. You can customize everything later.
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid gap-6 md:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              {...category}
              selected={selectedCategory === category.id}
              onSelect={() => setSelectedCategory(category.id)}
            />
          ))}
        </div>

        {/* Continue Button - Bottom Right */}
        <div className="mt-12 flex flex-col items-end gap-3">
          <Button
            size="lg"
            disabled={!selectedCategory}
            onClick={handleContinue}
            className={`group h-12 w-48 rounded-xl text-base font-semibold transition-all duration-300 ${selectedCategory
              ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25 hover:bg-violet-700 hover:shadow-xl hover:shadow-violet-500/30"
              : "cursor-not-allowed bg-zinc-200 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"
              }`}
          >
            Continue
            <ArrowRight
              className={`ml-2 h-5 w-5 transition-transform duration-300 ${selectedCategory ? "group-hover:translate-x-1" : ""
                }`}
            />
          </Button>
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            {selectedCategory
              ? "Ready to configure your AI agent"
              : "Select a category to continue"}
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-b from-violet-500/10 to-transparent blur-3xl dark:from-violet-500/5" />
      </div>
    </div>
  );
}
