-- ============================================================
-- Migration: Add ui_config & is_published to profiles table
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Add ui_config column (stores the Agent UI Setup customisation)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS ui_config jsonb DEFAULT '{
  "agentName": "Support Agent",
  "primaryColor": "#7c3aed",
  "themeMode": "auto",
  "avatar": "🤖",
  "launcherStyle": "bubble",
  "brandLogoUrl": null,
  "welcomeMessage": "👋 Hi! I''m your AI assistant. How can I help you today?",
  "quickActions": [],
  "showTypingIndicator": true
}'::jsonb;

-- 2. Add is_published column (tracks whether the bot is live)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_published boolean DEFAULT false;

-- 3. Backfill any existing rows that have NULL values
UPDATE profiles
SET
    ui_config = '{
      "agentName": "Support Agent",
      "primaryColor": "#7c3aed",
      "themeMode": "auto",
      "avatar": "🤖",
      "launcherStyle": "bubble",
      "brandLogoUrl": null,
      "welcomeMessage": "👋 Hi! I''m your AI assistant. How can I help you today?",
      "quickActions": [],
      "showTypingIndicator": true
    }'::jsonb,
    is_published = false
WHERE
    ui_config IS NULL
    OR is_published IS NULL;

-- 4. Add a GIN index for faster JSONB queries on ui_config
CREATE INDEX IF NOT EXISTS idx_profiles_ui_config
ON profiles USING GIN (ui_config);
