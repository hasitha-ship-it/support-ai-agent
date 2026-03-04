-- ============================================================
-- Migration: Add guardrails_config to profiles table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add the guardrails_config column to profiles (JSONB with default)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS guardrails_config jsonb DEFAULT '{
  "restrict_to_kb": true,
  "blacklisted_competitors": [],
  "anti_hallucination": true,
  "prompt_injection_defense": true,
  "spam_protection": { "enabled": true, "limit": 20 },
  "escalate_on_frustration": true,
  "redact_sensitive_data": true,
  "content_filters": {
    "hate_speech": true,
    "adult_content": true,
    "financial_advice": false
  }
}'::jsonb;

-- 2. Backfill any existing rows that have NULL
UPDATE profiles
SET guardrails_config = '{
  "restrict_to_kb": true,
  "blacklisted_competitors": [],
  "anti_hallucination": true,
  "prompt_injection_defense": true,
  "spam_protection": { "enabled": true, "limit": 20 },
  "escalate_on_frustration": true,
  "redact_sensitive_data": true,
  "content_filters": {
    "hate_speech": true,
    "adult_content": true,
    "financial_advice": false
  }
}'::jsonb
WHERE guardrails_config IS NULL;

-- 3. (Optional) Add a GIN index for faster JSONB queries
CREATE INDEX IF NOT EXISTS idx_profiles_guardrails
ON profiles USING GIN (guardrails_config);
