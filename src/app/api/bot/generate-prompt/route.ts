import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createServerSupabaseClient } from "@/lib/supabase-server";

// ─── POST /api/bot/generate-prompt ────────────────────────────────────────────
//
// Accepts { websiteUrl?, botName?, industry?, customContext? }
// Uses gpt-4o-mini to generate a highly-optimized customer support system prompt.
// Returns { success, prompt } — the generated prompt as a plain string.

interface GeneratePromptBody {
    websiteUrl?: string;
    botName?: string;
    industry?: string;
    customContext?: string;
}

export async function POST(req: NextRequest) {
    // ── 1. Auth ────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "") ?? "";

    if (!token) {
        return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const supabase = createServerSupabaseClient(token);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    // ── 2. Parse body ─────────────────────────────────────────────────────────
    let body: GeneratePromptBody = {};
    try {
        body = await req.json();
    } catch {
        // body is optional, continue with defaults
    }

    const { websiteUrl, botName, industry, customContext } = body;

    // Build context string from whatever info we have
    const contextParts: string[] = [];
    if (botName) contextParts.push(`Bot name: "${botName}"`);
    if (websiteUrl) contextParts.push(`Company website: ${websiteUrl}`);
    if (industry) contextParts.push(`Industry/domain: ${industry}`);
    if (customContext) contextParts.push(`Additional context: ${customContext}`);

    const contextStr = contextParts.length > 0
        ? contextParts.join("\n")
        : "A generic customer support chatbot for a SaaS company.";

    // ── 3. Build the meta-prompt ──────────────────────────────────────────────
    const metaPrompt = `You are an expert AI prompt engineer specializing in creating system prompts for customer support AI chatbots.

Your task: Generate a highly optimized, production-ready system prompt for a customer support AI assistant.

Context about this bot:
${contextStr}

Requirements for the generated prompt:
- Start with a clear role definition (who the bot is, what company it represents)
- Include specific behavioral guidelines (tone, response length, escalation triggers)
- Define what topics are in-scope vs. out-of-scope
- Include placeholders like {{COMPANY_NAME}} or {{PRODUCT_NAME}} where appropriate
- Mention handling of edge cases (unanswered questions, frustrated users, sensitive data)
- Should be 150-250 words, professional, and immediately ready to use
- Do NOT include JSON, markdown headers, or meta-commentary — output ONLY the system prompt text itself

Generate the system prompt now:`;

    // ── 4. Call LLM ──────────────────────────────────────────────────────────
    const openai = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY!,
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
            "X-Title": "Support AI Agent — Prompt Generator",
        },
    });

    if (!process.env.OPENROUTER_API_KEY) {
        return NextResponse.json(
            { success: false, error: "Server configuration error: OPENROUTER_API_KEY is not set." },
            { status: 500 }
        );
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "openai/gpt-4o-mini",
            messages: [{ role: "user", content: metaPrompt }],
            temperature: 0.7,
            max_tokens: 600,
        });

        const generatedPrompt = completion.choices[0]?.message?.content?.trim() ?? "";

        if (!generatedPrompt) {
            return NextResponse.json(
                { success: false, error: "The AI returned an empty response. Please try again." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            prompt: generatedPrompt,
        });
    } catch (err) {
        // Surface the real error so it's visible in the UI
        const message =
            err instanceof Error
                ? err.message
                : typeof err === "object" && err !== null && "message" in err
                    ? String((err as Record<string, unknown>).message)
                    : String(err);

        console.error("[generate-prompt] LLM error:", message, err);
        return NextResponse.json(
            { success: false, error: `AI error: ${message}` },
            { status: 500 }
        );
    }
}
