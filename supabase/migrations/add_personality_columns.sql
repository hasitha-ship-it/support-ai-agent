-- ============================================================
-- Migration: Add personality columns to profiles table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add the ai_model column (stores the user's chosen LLM)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS ai_model text DEFAULT 'gpt-4o-mini';

-- 2. Add system_prompt column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS system_prompt text DEFAULT 'You are a helpful AI assistant.';

-- 3. Add tone_of_voice column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS tone_of_voice text DEFAULT 'professional';

-- 4. Add credit / usage tracking columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS used_message_credits integer DEFAULT 0;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS used_actions integer DEFAULT 0;

-- 5. Backfill any existing rows that have NULLs
UPDATE profiles
SET
    ai_model = 'gpt-4o-mini',
    system_prompt = 'You are a helpful AI assistant.',
    tone_of_voice = 'professional',
    used_message_credits = 0,
    used_actions = 0
WHERE
    ai_model IS NULL
    OR system_prompt IS NULL
    OR tone_of_voice IS NULL
    OR used_message_credits IS NULL
    OR used_actions IS NULL;

-- 6. Add check constraint to ensure valid model IDs
-- (Optional — remove if you plan to add more models frequently)
-- ALTER TABLE profiles
-- ADD CONSTRAINT valid_ai_model CHECK (
--     ai_model IN (
--         'gpt-4o-mini','gpt-4o','o1',
--         'claude-3.5-sonnet','claude-3-haiku',
--         'gemini-1.5-pro','gemini-1.5-flash',
--         'deepseek-v3','deepseek-r1',
--         'grok-2','grok-2-mini',
--         'llama-3.3','mistral-large-2'
--     )
-- );
