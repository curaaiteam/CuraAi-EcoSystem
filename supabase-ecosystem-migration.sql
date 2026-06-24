-- CuraAI Ecosystem Phase 1 Migration
-- Run this in your Supabase SQL editor to add ecosystem columns to the profiles table

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS country TEXT,
  ADD COLUMN IF NOT EXISTS goals TEXT[],
  ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS ecosystem_plan TEXT DEFAULT 'free' CHECK (ecosystem_plan IN ('free', 'basic', 'standard', 'pro'));

-- Index for username lookups (search, @mentions, DMs)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username);

-- Example: verify columns were added
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles';
