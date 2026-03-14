import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import {
    buildGuardrailsPrompt,
    DEFAULT_GUARDRAILS,
    type GuardrailsConfig,
} from "@/lib/guardrails";
import {
    AI_MODELS,
    ACTION_ROUTING_MODEL,
    DEFAULT_MODEL_ID,
    getModelConfig,
} from "@/config/ai-models";
import { getPlan, getUserPlanId } from "@/lib/plans";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}

interface ChatRequestBody {
    messages: ChatMessage[];
    sessionId?: string;            // for per-user rate limiting
    isActionRequest?: boolean;     // caller signals an action/tool execution
}

interface Profile {
    ai_model: string | null;
    system_prompt: string | null;
    tone_of_voice: string | null;
    guardrails_config: {
        spam_protection?: Record<string, unknown>;
        content_filters?: Record<string, unknown>;
        [key: string]: unknown;
    } | null;
    used_message_credits: number | null;
    used_actions: number | null;
}

// ─── In-Memory Rate Limiter (replace with Upstash Redis in production) ────────

const rateLimitStore = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(key: string, limit: number, windowMs = 60_000): boolean {
    const now = Date.now();
    const entry = rateLimitStore.get(key);
    if (!entry || now - entry.windowStart > windowMs) {
        rateLimitStore.set(key, { count: 1, windowStart: now });
        return false;
    }
    if (entry.count >= limit) return true;
    entry.count += 1;
    return false;
}

// ─── Tone Instruction Map ─────────────────────────────────────────────────────

const TONE_INSTRUCTIONS: Record<string, string> = {
    empathetic: "Maintain a warm, empathetic, and emotionally supportive tone throughout the conversation. Acknowledge the user's feelings before solving their problem.",
    neutral: "Maintain a balanced, professional, and neutral tone. Be clear and objective without being cold.",
    direct: "Be extremely concise and direct. Give the answer first, skip pleasantries, and avoid padding.",
    pirate: "Respond in a fun pirate theme! Use pirate language (Ahoy, Matey, Arr) while still being helpful and clear.",
    formal: "Maintain a highly formal, corporate tone. Use formal vocabulary, avoid contractions, and structure responses professionally.",
    witty: "Use a clever, witty tone with light humor where appropriate. Be playful but never sarcastic or dismissive.",
    professional: "Maintain a professional, courteous, and helpful tone at all times.",
};

// ─── OpenRouter Client Factory ────────────────────────────────────────────────

function createOpenRouterClient() {
    return new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            "X-Title": "Support AI Agent",
        },
    });
}

// ─── RAG: Retrieve knowledge context ─────────────────────────────────────────
//
// Embeds the user's latest message and performs cosine-similarity search
// over the workspace's knowledge_embeddings via pgvector RPC.

async function retrieveKnowledgeContext(
    supabase: ReturnType<typeof createServerSupabaseClient>,
    workspaceId: string,
    userMessage: string,
    openai: OpenAI
): Promise<string> {
    try {
        const q = userMessage.toLowerCase();
        const isPricingQuery = /price|cost|pricing|plan|subscription|fee|month|pay|tier|package|how much|starter|grow|extreme|enterprise/.test(q);

        // ── Path A: Direct source fetch for pricing queries ────────────────────
        // When user asks about pricing, grab ALL chunks from pricing pages directly.
        // This guarantees every plan (Starter/Grow/Extreme/Enterprise) is included.
        const directChunks: string[] = [];

        if (isPricingQuery) {
            // Find all pricing/plan related source IDs
            const { data: pricingSources } = await supabase
                .from("knowledge_sources")
                .select("id, url")
                .eq("workspace_id", workspaceId)
                .eq("status", "completed")
                .or("url.ilike.%pric%,url.ilike.%plan%,url.ilike.%cost%");

            if (pricingSources && pricingSources.length > 0) {
                const sourceIds = pricingSources.map((s: { id: string }) => s.id);
                console.log(`[chat] RAG: found ${sourceIds.length} pricing source(s), fetching ALL chunks directly`);

                const { data: chunks } = await supabase
                    .from("knowledge_embeddings")
                    .select("content_chunk")
                    .eq("workspace_id", workspaceId)
                    .in("source_id", sourceIds)
                    .order("id", { ascending: true });

                if (chunks && chunks.length > 0) {
                    for (const c of chunks as Array<{ content_chunk: string }>) {
                        directChunks.push(c.content_chunk.trim());
                    }
                    console.log(`[chat] RAG: directly loaded ${directChunks.length} pricing chunks`);
                }
            }
        }

        // ── Path B: Semantic similarity search ────────────────────────────────
        // Build expanded queries for better recall
        const words = userMessage.trim().split(/\s+/);
        const queries = [userMessage];

        if (words.length <= 5) {
            if (isPricingQuery) {
                queries.push(
                    "What are the pricing plans and monthly costs?",
                    "Starter Grow Extreme Enterprise plan pricing per month members",
                    "How much does it cost? subscription fee membership commission percentage",
                    "free plan paid plan pricing tiers community subscription"
                );
            } else if (/company|name|who|about/.test(q)) {
                queries.push(
                    "What is the name of this company and what do they do?",
                    "company overview about us our mission"
                );
            } else if (/contact|support|help/.test(q)) {
                queries.push(
                    "How can I contact support or get help?",
                    "contact us support email phone"
                );
            } else if (/service|feature|product/.test(q)) {
                queries.push(
                    "What services and features do you offer?",
                    "products features capabilities overview"
                );
            } else {
                queries.push(`Tell me about ${userMessage}`, `${userMessage} details information overview`);
            }
        }

        const embRes = await openai.embeddings.create({
            model: "openai/text-embedding-3-small",
            input: queries,
            encoding_format: "float",
        });

        if (!embRes.data?.length) {
            // If embedding failed but we have direct chunks, use those
            if (directChunks.length > 0) {
                return buildContextString(directChunks);
            }
            return "";
        }

        const allResults = new Map<string, number>(); // content -> best similarity

        await Promise.all(
            embRes.data.map(async (embData) => {
                const { data: matches, error } = await supabase.rpc("match_embeddings", {
                    query_embedding: embData.embedding,
                    match_workspace_id: workspaceId,
                    match_count: 15,
                });
                if (error || !matches) return;
                for (const m of matches as Array<{ content_chunk: string; similarity: number }>) {
                    const current = allResults.get(m.content_chunk) ?? 0;
                    if (m.similarity > current) {
                        allResults.set(m.content_chunk, m.similarity);
                    }
                }
            })
        );

        // ── Merge: direct chunks (guaranteed) + semantic results ───────────────
        const merged: string[] = [...directChunks];

        const sorted = [...allResults.entries()].sort(([, a], [, b]) => b - a);
        console.log(`[chat] RAG: semantic got ${sorted.length} unique chunks, top similarity: ${sorted[0]?.[1]?.toFixed(3)}`);

        const semanticChunks = sorted
            .filter(([, sim]) => sim >= 0.10)
            .slice(0, 12)
            .map(([content]) => content.trim())
            // Don't add duplicates already covered by direct fetch
            .filter(c => !merged.includes(c));

        merged.push(...semanticChunks);

        if (merged.length === 0) {
            console.warn(`[chat] RAG: no context found. Top similarity was ${sorted[0]?.[1]?.toFixed(3)}`);
            return "";
        }

        console.log(`[chat] RAG: injecting ${merged.length} chunks (${directChunks.length} direct + ${semanticChunks.length} semantic)`);
        return buildContextString(merged);

    } catch (err) {
        console.warn("[chat] RAG retrieval failed:", err);
        return "";
    }
}

function buildContextString(chunks: string[]): string {
    return (
        "\n\n--- KNOWLEDGE BASE CONTEXT ---\n" +
        "IMPORTANT INSTRUCTIONS FOR USING THIS CONTEXT:\n" +
        "1. Use ALL the information below when answering — do NOT summarize or skip details.\n" +
        "2. If the user asks about pricing or plans, list EVERY plan with its name, price, and ALL features.\n" +
        "3. PRICING FORMAT — You MUST follow this exact format for each plan:\n" +
        "   **[Plan Name]** – $[price]/mo\n" +
        "   - [feature 1]\n" +
        "   - [feature 2]\n" +
        "   (repeat for every plan, do NOT skip any)\n" +
        "4. If the user asks about features or services, list ALL of them from the context.\n" +
        "5. Never say you don't have information if the answer is present anywhere below.\n\n" +
        chunks.join("\n\n---\n") +
        "\n--- END OF KNOWLEDGE BASE CONTEXT ---\n"
    );
}

// ─── POST /api/chat ────────────────────────────────────────────────────────────
//
// Two-Tier Agentic Routing:
//
//   Tier 1 — Standard Chat: routes to the bot's configured AI model.
//     • Checks: used_message_credits + cost <= messageCredits limit
//     • Bills to: profiles.used_message_credits  (+= model.credits)
//
//   Tier 2 — Action Execution: ALWAYS forced to claude-3.5-sonnet.
//     • Checks: used_actions < actionLimit
//     • Bills to: profiles.used_actions  (+= 1, separate from message credits)
//
// Dynamic System Prompt Construction:
//   1. Bot's stored system_prompt (base personality)
//   2. Tone instruction from tone_of_voice
//   3. RAG: top-5 KB chunks most similar to user's message
//   4. Guardrails injection from guardrails_config
//
// Security:
//   • Strips client-sent system messages to prevent prompt injection
//   • Rate limits via spam_protection config

export async function POST(req: NextRequest) {
    // ── 1. Parse body ─────────────────────────────────────────────────────────
    let body: ChatRequestBody;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ success: false, error: "Invalid JSON body." }, { status: 400 });
    }

    const { messages, sessionId, isActionRequest = false } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return NextResponse.json(
            { success: false, error: "messages[] is required and must not be empty." },
            { status: 400 }
        );
    }

    // ── 2. Auth & load workspace config ──────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    // Defaults (used if no auth token / public widget)
    let guardrailsConfig: GuardrailsConfig = DEFAULT_GUARDRAILS;
    let botModelId = DEFAULT_MODEL_ID;
    let botSystemPrompt = "You are the official support voice of this company. Speak as the company itself (use 'we', 'us', 'our'). Answer questions about our services clearly and concisely. For simple questions (e.g. what the company is, who we are, what we do), give a short, direct answer — just our name and a one-sentence description of our service. Do NOT start replies with phrases like 'The information provided pertains to' or 'Based on the context'. Speak naturally as a team member who knows our mission well. Only give long, detailed answers when the question genuinely requires it (e.g. pricing plans, full feature lists).";
    let toneOfVoice = "professional";
    let userId: string | null = null;
    let planId = "free_trial";
    let supabaseForRag: ReturnType<typeof createServerSupabaseClient> | null = null;

    if (token) {
        try {
            const supabase = createServerSupabaseClient(token);
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                userId = user.id;
                supabaseForRag = supabase;
                planId = await getUserPlanId(supabase, user.id);

                const { data: profile } = await supabase
                    .from("profiles")
                    .select(
                        "ai_model, system_prompt, tone_of_voice, guardrails_config, " +
                        "used_message_credits, used_actions"
                    )
                    .eq("id", user.id)
                    .single() as { data: Profile | null; error: unknown };

                if (profile) {
                    botModelId = profile.ai_model ?? DEFAULT_MODEL_ID;
                    const COMPREHENSIVE_INSTRUCTIONS = [
                        "\n\nCRITICAL RESPONSE RULES:",
                        "- NEVER start a reply with 'The information provided pertains to', 'Based on the context', or any similar preamble. Go straight to the answer.",
                        "- You ARE the company's official support — speak as 'we', 'us', and 'our'. Never refer to the company as 'they' or 'it'.",
                        "- For simple questions (e.g. 'what is this company', 'who are you'): reply in 1-2 short sentences. State our name and what we do clearly and concisely. No extra padding.",
                        "- For complex questions (pricing, features, plans): give a full, detailed answer.",
                        "- When asked about our pricing, plans, or packages: list EVERY plan using this EXACT format:",
                        "  **[Plan Name]** – $[price]/mo",
                        "  - [feature 1]",
                        "  - [feature 2]",
                        "  (one bullet per feature, all features included, no markdown tables)",
                        "- NEVER use markdown tables for pricing — always use the bold heading + dash-bullet format above.",
                        "- When asked about our services or features: list ALL of them comprehensively.",
                        "- Never truncate a list — always complete it fully.",
                        "- If a plan is Free, write: **[Plan Name]** – Free",
                    ].join("\n");
                    const savedPrompt = profile.system_prompt ?? botSystemPrompt;
                    botSystemPrompt = savedPrompt + COMPREHENSIVE_INSTRUCTIONS;
                    toneOfVoice = profile.tone_of_voice ?? toneOfVoice;

                    if (profile.guardrails_config) {
                        guardrailsConfig = {
                            ...DEFAULT_GUARDRAILS,
                            ...profile.guardrails_config,
                            spam_protection: {
                                ...DEFAULT_GUARDRAILS.spam_protection,
                                ...(profile.guardrails_config.spam_protection ?? {}),
                            },
                            content_filters: {
                                ...DEFAULT_GUARDRAILS.content_filters,
                                ...(profile.guardrails_config.content_filters ?? {}),
                            },
                        };
                    }

                    // ── 3. Credit/Quota checks ────────────────────────────────
                    const plan = getPlan(planId);
                    const usedCredits = profile.used_message_credits ?? 0;
                    const usedActions = profile.used_actions ?? 0;

                    if (isActionRequest) {
                        // Action billing path
                        if (usedActions >= plan.actionLimit) {
                            return NextResponse.json(
                                {
                                    success: false,
                                    error: `Monthly action limit reached (${plan.actionLimit} actions). Upgrade your plan to continue.`,
                                    limit_reached: "actions",
                                    used: usedActions,
                                    limit: plan.actionLimit,
                                },
                                { status: 402 }
                            );
                        }
                    } else {
                        // Message credit path: check if model cost fits within budget
                        const resolvedModel = getModelConfig(botModelId);

                        // Fallback to free model if somehow a restricted model is saved
                        if (!plan.allModels && !resolvedModel.free_tier) {
                            botModelId = DEFAULT_MODEL_ID;
                        }

                        const modelCost = getModelConfig(botModelId).credits;

                        if (usedCredits + modelCost > plan.messageCredits) {
                            return NextResponse.json(
                                {
                                    success: false,
                                    error: `Message credit limit reached (${plan.messageCredits} credits/month). Upgrade your plan to continue.`,
                                    limit_reached: "message_credits",
                                    used: usedCredits,
                                    limit: plan.messageCredits,
                                    model_cost: modelCost,
                                },
                                { status: 402 }
                            );
                        }
                    }
                }
            }
        } catch (err) {
            console.warn("[chat] Failed to load workspace config, using defaults:", err);
        }
    }

    // ── 4. Spam Protection ────────────────────────────────────────────────────
    if (guardrailsConfig.spam_protection.enabled) {
        const identifier = sessionId ?? req.headers.get("x-forwarded-for") ?? "anonymous";
        if (isRateLimited(identifier, guardrailsConfig.spam_protection.limit)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Too many messages. Please slow down and try again in a minute.",
                    retryAfter: 60,
                },
                {
                    status: 429,
                    headers: {
                        "Retry-After": "60",
                        "X-RateLimit-Limit": String(guardrailsConfig.spam_protection.limit),
                    },
                }
            );
        }
    }

    // ── 5. Two-Tier Model Routing ─────────────────────────────────────────────
    let routedModelId: string;
    let routingTier: "standard" | "action";

    if (isActionRequest) {
        // Tier 2: Force claude-3.5-sonnet for all tool/action executions
        routedModelId = ACTION_ROUTING_MODEL;
        routingTier = "action";
    } else {
        // Tier 1: Use the bot's configured model (already sanitized above)
        routedModelId = botModelId;
        routingTier = "standard";
    }

    const routedModel = getModelConfig(routedModelId);

    // ── 6. Build OpenRouter client ────────────────────────────────────────────
    const openai = createOpenRouterClient();

    // ── 7. RAG: retrieve KB context for user's message ────────────────────────
    const userMessages = messages.filter((m) => m.role !== "system");
    const latestUserMessage = [...userMessages].reverse().find((m) => m.role === "user")?.content ?? "";

    let knowledgeContext = "";
    if (userId && supabaseForRag && !isActionRequest && latestUserMessage) {
        console.log(`[chat] RAG: retrieving context for workspace=${userId}, query="${latestUserMessage.slice(0, 60)}"`);
        knowledgeContext = await retrieveKnowledgeContext(
            supabaseForRag,
            userId,
            latestUserMessage,
            openai
        );
        console.log(`[chat] RAG: context length=${knowledgeContext.length} chars`);
    } else {
        console.log(`[chat] RAG: skipped (userId=${userId ? "set" : "null"}, isActionRequest=${isActionRequest})`);
    }

    // ── 8. Build Dynamic System Prompt ────────────────────────────────────────
    //
    //   Layer 1: Bot personality (stored system_prompt)
    //   Layer 2: Tone instruction
    //   Layer 3: RAG knowledge context (injected before guardrails)
    //   Layer 4: Guardrails rules
    //
    const toneInstruction = TONE_INSTRUCTIONS[toneOfVoice] ?? TONE_INSTRUCTIONS.professional;
    const guardrailsBlock = buildGuardrailsPrompt(guardrailsConfig);

    const fullSystemPrompt =
        botSystemPrompt +
        `\n\nTONE: ${toneInstruction}` +
        knowledgeContext +
        guardrailsBlock;

    const llmMessages: ChatMessage[] = [
        { role: "system", content: fullSystemPrompt },
        ...userMessages,
    ];

    // ── 9. Execute LLM call ───────────────────────────────────────────────────
    let assistantMessage = "";

    try {
        const completion = await openai.chat.completions.create({
            model: routedModel.openrouter_id,
            messages: llmMessages,
            temperature: routingTier === "action" ? 0.1 : 0.4,
            max_tokens: 2048,
        });

        assistantMessage = completion.choices[0]?.message?.content ?? "";
    } catch (err) {
        console.error(`[chat] LLM error (model: ${routedModel.openrouter_id}):`, err);
        return NextResponse.json(
            { success: false, error: "Failed to get a response from the AI. Please try again." },
            { status: 500 }
        );
    }

    // ── 10. Increment usage counters ──────────────────────────────────────────
    if (userId && token) {
        try {
            const supabase = createServerSupabaseClient(token);

            // Re-fetch current values to avoid race conditions
            const { data: profile } = await supabase
                .from("profiles")
                .select("used_message_credits, used_actions")
                .eq("id", userId)
                .single();

            if (profile) {
                if (routingTier === "action") {
                    // Action billing: increment used_actions by 1
                    await supabase
                        .from("profiles")
                        .update({ used_actions: (profile.used_actions ?? 0) + 1 })
                        .eq("id", userId);
                } else {
                    // Message billing: increment by model's credit cost
                    const modelCost = routedModel.credits;
                    await supabase
                        .from("profiles")
                        .update({ used_message_credits: (profile.used_message_credits ?? 0) + modelCost })
                        .eq("id", userId);
                }
            }
        } catch (err) {
            // Non-fatal — message was already delivered
            console.warn("[chat] Failed to increment usage counter:", err);
        }
    }

    // ── 11. Return response ───────────────────────────────────────────────────
    return NextResponse.json({
        success: true,
        message: assistantMessage,
        routing: {
            tier: routingTier,
            model: routedModel.id,
            model_name: routedModel.name,
            credits_charged: routingTier === "action" ? 0 : routedModel.credits,
            action_used: routingTier === "action" ? 1 : 0,
            rag_context_used: knowledgeContext.length > 0,
        },
    });
}
