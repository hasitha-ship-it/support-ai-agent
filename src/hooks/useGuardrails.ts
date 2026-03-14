"use client";

import * as React from "react";
import { DEFAULT_GUARDRAILS, type GuardrailsConfig } from "@/lib/guardrails";

interface UseGuardrailsReturn {
    config: GuardrailsConfig;
    loading: boolean;
    saving: boolean;
    error: string | null;
    updateConfig: (updates: Partial<GuardrailsConfig>) => void;
    saveConfig: () => Promise<boolean>;
    loadConfig: () => Promise<void>;
}

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

export function useGuardrails(): UseGuardrailsReturn {
    const [config, setConfig] = React.useState<GuardrailsConfig>(DEFAULT_GUARDRAILS);
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    const loadConfig = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) {
                setLoading(false);
                return;
            }

            const res = await fetch("/api/bot/update-guardrails", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success && data.config) {
                setConfig(data.config);
            }
        } catch (err) {
            console.error("[useGuardrails] Failed to load config:", err);
            setError("Failed to load guardrails configuration.");
        } finally {
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        loadConfig();
    }, [loadConfig]);

    const updateConfig = React.useCallback((updates: Partial<GuardrailsConfig>) => {
        setConfig((prev) => ({ ...prev, ...updates }));
    }, []);

    const saveConfig = React.useCallback(async (): Promise<boolean> => {
        setSaving(true);
        setError(null);
        try {
            const token = await getToken();
            if (!token) {
                setError("Not authenticated.");
                return false;
            }

            const res = await fetch("/api/bot/update-guardrails", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ config }),
            });

            const data = await res.json();
            if (!data.success) {
                setError(data.error ?? "Failed to save.");
                return false;
            }

            // Sync with the validated/merged config from server
            if (data.config) setConfig(data.config);
            return true;
        } catch (err) {
            console.error("[useGuardrails] Failed to save config:", err);
            setError("Failed to save guardrails configuration.");
            return false;
        } finally {
            setSaving(false);
        }
    }, [config]);

    return { config, loading, saving, error, updateConfig, saveConfig, loadConfig };
}
