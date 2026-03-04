"use client";

import * as React from "react";

interface PersonalityConfig {
    ai_model: string;
    system_prompt: string;
    tone_of_voice: string;
}

interface UsePersonalityReturn {
    config: PersonalityConfig;
    loading: boolean;
    saving: boolean;
    generating: boolean;
    error: string | null;
    planAllowsCurrentModel: boolean;
    updateConfig: (updates: Partial<PersonalityConfig>) => void;
    saveConfig: () => Promise<boolean>;
    generatePrompt: (context?: { websiteUrl?: string; botName?: string; industry?: string }) => Promise<void>;
}

const DEFAULT_CONFIG: PersonalityConfig = {
    ai_model: "gpt-4o-mini",
    system_prompt: "You are a helpful AI assistant.",
    tone_of_voice: "professional",
};

async function getToken(): Promise<string | null> {
    try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data: { session } } = await supabase.auth.getSession();
        return session?.access_token ?? null;
    } catch {
        return null;
    }
}

export function usePersonality(): UsePersonalityReturn {
    const [config, setConfig] = React.useState<PersonalityConfig>(DEFAULT_CONFIG);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [generating, setGenerating] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);
    const [planAllowsCurrentModel, setPlanAllowsCurrentModel] = React.useState(true);

    React.useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const token = await getToken();
                if (!token) { setLoading(false); return; }

                const res = await fetch("/api/bot/update-personality", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (data.success) {
                    setConfig({
                        ai_model: data.ai_model,
                        system_prompt: data.system_prompt,
                        tone_of_voice: data.tone_of_voice,
                    });
                    setPlanAllowsCurrentModel(data.all_models_enabled);
                }
            } catch (err) {
                console.error("[usePersonality] load error:", err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const updateConfig = React.useCallback((updates: Partial<PersonalityConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
        setError(null);
    }, []);

    const saveConfig = React.useCallback(async (): Promise<boolean> => {
        setSaving(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) { setError("Not authenticated."); return false; }

            const res = await fetch("/api/bot/update-personality", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(config),
            });

            const data = await res.json();

            if (!data.success) {
                setError(data.error ?? "Failed to save.");
                // If upgrade required, show which model is blocked
                if (data.upgrade_required) {
                    setConfig((prev) => ({ ...prev, ai_model: data.allowed_model }));
                    setPlanAllowsCurrentModel(false);
                }
                return false;
            }

            return true;
        } catch (err) {
            console.error("[usePersonality] save error:", err);
            setError("Failed to save personality settings.");
            return false;
        } finally {
            setSaving(false);
        }
    }, [config]);

    const generatePrompt = React.useCallback(async (
        context?: { websiteUrl?: string; botName?: string; industry?: string }
    ): Promise<void> => {
        setGenerating(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) { setError("Not authenticated."); return; }

            const res = await fetch("/api/bot/generate-prompt", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(context ?? {}),
            });

            const data = await res.json();

            if (data.success && data.prompt) {
                setConfig((prev) => ({ ...prev, system_prompt: data.prompt }));
            } else {
                setError(data.error ?? "Failed to generate prompt.");
            }
        } catch (err) {
            console.error("[usePersonality] generate error:", err);
            setError("Failed to generate prompt.");
        } finally {
            setGenerating(false);
        }
    }, []);

    return {
        config,
        loading,
        saving,
        generating,
        error,
        planAllowsCurrentModel,
        updateConfig,
        saveConfig,
        generatePrompt,
    };
}
