/**
 * AI_MODELS — Central registry of all supported models.
 *
 * `openrouter_id`  : The exact model ID to pass to OpenRouter's API.
 * `credits`        : Credits deducted per message (from plan's messageCredits).
 * `free_tier`      : If false, Free/Trial users are blocked from this model.
 * `action_capable` : Whether this model supports function/tool calling reliably.
 *
 * NOTE: For Action routing, we ALWAYS force `claude-3.5-sonnet` regardless
 * of the bot's configured model (see chat route).
 */

export interface AIModelConfig {
    id: string;               // key used in DB / UI
    name: string;             // display name
    provider: string;
    openrouter_id: string;    // exact ID for OpenRouter
    credits: number;          // message credits per call
    free_tier: boolean;       // available to free_trial users?
    action_capable: boolean;  // supports tool/function calling?
}

export const AI_MODELS: Record<string, AIModelConfig> = {
    // ── OpenAI ──────────────────────────────────────────────────────────────────
    "gpt-4o-mini": {
        id: "gpt-4o-mini",
        name: "GPT-4o Mini",
        provider: "OpenAI",
        openrouter_id: "openai/gpt-4o-mini",
        credits: 1,
        free_tier: true,
        action_capable: true,
    },
    "gpt-4o": {
        id: "gpt-4o",
        name: "GPT-4o",
        provider: "OpenAI",
        openrouter_id: "openai/gpt-4o",
        credits: 2,
        free_tier: false,
        action_capable: true,
    },
    "o1": {
        id: "o1",
        name: "OpenAI o1",
        provider: "OpenAI",
        openrouter_id: "openai/o1",
        credits: 5,
        free_tier: false,
        action_capable: false, // o1 doesn't support tool calling well yet
    },

    // ── Anthropic ───────────────────────────────────────────────────────────────
    "claude-3.5-sonnet": {
        id: "claude-3.5-sonnet",
        name: "Claude 3.5 Sonnet",
        provider: "Anthropic",
        openrouter_id: "anthropic/claude-3-5-sonnet",
        credits: 2,
        free_tier: false,
        action_capable: true,
    },
    "claude-3-haiku": {
        id: "claude-3-haiku",
        name: "Claude 3 Haiku",
        provider: "Anthropic",
        openrouter_id: "anthropic/claude-3-haiku",
        credits: 1,
        free_tier: false,
        action_capable: true,
    },

    // ── Google ───────────────────────────────────────────────────────────────────
    "gemini-1.5-pro": {
        id: "gemini-1.5-pro",
        name: "Gemini 1.5 Pro",
        provider: "Google",
        openrouter_id: "google/gemini-pro-1.5",
        credits: 2,
        free_tier: false,
        action_capable: true,
    },
    "gemini-1.5-flash": {
        id: "gemini-1.5-flash",
        name: "Gemini 1.5 Flash",
        provider: "Google",
        openrouter_id: "google/gemini-flash-1.5",
        credits: 1,
        free_tier: false,
        action_capable: true,
    },

    // ── DeepSeek ─────────────────────────────────────────────────────────────────
    "deepseek-v3": {
        id: "deepseek-v3",
        name: "DeepSeek V3",
        provider: "DeepSeek",
        openrouter_id: "deepseek/deepseek-chat",
        credits: 1,
        free_tier: false,
        action_capable: true,
    },
    "deepseek-r1": {
        id: "deepseek-r1",
        name: "DeepSeek R1",
        provider: "DeepSeek",
        openrouter_id: "deepseek/deepseek-r1",
        credits: 1,
        free_tier: false,
        action_capable: false,
    },

    // ── xAI ──────────────────────────────────────────────────────────────────────
    "grok-2": {
        id: "grok-2",
        name: "Grok 2",
        provider: "xAI",
        openrouter_id: "x-ai/grok-2-1212",
        credits: 2,
        free_tier: false,
        action_capable: true,
    },
    "grok-2-mini": {
        id: "grok-2-mini",
        name: "Grok 2 Mini",
        provider: "xAI",
        openrouter_id: "x-ai/grok-2-mini",
        credits: 1,
        free_tier: false,
        action_capable: true,
    },

    // ── Meta ──────────────────────────────────────────────────────────────────────
    "llama-3.3": {
        id: "llama-3.3",
        name: "Llama 3.3",
        provider: "Meta",
        openrouter_id: "meta-llama/llama-3.3-70b-instruct",
        credits: 1,
        free_tier: false,
        action_capable: true,
    },

    // ── Mistral ───────────────────────────────────────────────────────────────────
    "mistral-large-2": {
        id: "mistral-large-2",
        name: "Mistral Large 2",
        provider: "Mistral",
        openrouter_id: "mistralai/mistral-large",
        credits: 2,
        free_tier: false,
        action_capable: true,
    },
};

/** The model forced for ALL action/tool executions, regardless of bot config. */
export const ACTION_ROUTING_MODEL = "claude-3.5-sonnet";

/** Default model for free tier and fallback. */
export const DEFAULT_MODEL_ID = "gpt-4o-mini";

/** Returns config or falls back to gpt-4o-mini. */
export function getModelConfig(modelId: string): AIModelConfig {
    return AI_MODELS[modelId] ?? AI_MODELS[DEFAULT_MODEL_ID];
}
