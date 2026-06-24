-- ============================================================
-- CURA FULL DATABASE SETUP
-- Run this entire file in Supabase → SQL Editor → Run
-- This is safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================


-- ============================================================
-- 1. PROFILES TABLE (core user data)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id                  TEXT PRIMARY KEY,           -- Firebase UID
  email               TEXT NOT NULL,
  display_name        TEXT,
  avatar_url          TEXT,

  -- AI System (CuraAI Core)
  tier                TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro')),
  plan                TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'monthly', 'annual', 'basic', 'standard', 'pro')),
  subscription_status TEXT CHECK (subscription_status IN ('active', 'inactive', 'cancelled')),
  billing_cycle       TEXT CHECK (billing_cycle IN ('monthly', 'annual')),

  -- Ecosystem Identity
  username            TEXT UNIQUE,
  whatsapp_number     TEXT,
  country             TEXT,
  goals               TEXT[],
  onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,

  -- Ecosystem Subscription (separate from AI)
  ecosystem_plan      TEXT NOT NULL DEFAULT 'free'
                        CHECK (ecosystem_plan IN ('free', 'basic', 'standard', 'pro')),

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast @username lookup
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_idx ON profiles (username)
  WHERE username IS NOT NULL;

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================
-- 2. CONVERSATIONS TABLE (AI chat sessions)
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id  TEXT NOT NULL,
  title       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS conversations_user_id_idx   ON conversations (user_id);
CREATE INDEX IF NOT EXISTS conversations_session_id_idx ON conversations (session_id);


-- ============================================================
-- 3. MESSAGES TABLE (AI chat messages)
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id   UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role              TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content           TEXT NOT NULL,
  file_url          TEXT,
  file_name         TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages (conversation_id);


-- ============================================================
-- 4. SUBSCRIPTIONS TABLE (payment records)
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  paystack_reference  TEXT,
  plan                TEXT NOT NULL,
  tier                TEXT NOT NULL,
  billing_cycle       TEXT,
  amount              INTEGER,                      -- in kobo (smallest unit)
  status              TEXT NOT NULL DEFAULT 'active',
  start_date          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_renewal_date   TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);


-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Enable RLS so users can only read/write their own data

ALTER TABLE profiles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/write their own row
DROP POLICY IF EXISTS "profiles_self" ON profiles;
CREATE POLICY "profiles_self" ON profiles
  FOR ALL USING (auth.uid()::text = id);

-- Conversations: users can read/write their own
DROP POLICY IF EXISTS "conversations_owner" ON conversations;
CREATE POLICY "conversations_owner" ON conversations
  FOR ALL USING (auth.uid()::text = user_id);

-- Messages: accessible if user owns the parent conversation
DROP POLICY IF EXISTS "messages_owner" ON messages;
CREATE POLICY "messages_owner" ON messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM conversations c
      WHERE c.id = messages.conversation_id
        AND c.user_id = auth.uid()::text
    )
  );

-- Subscriptions: users can read their own
DROP POLICY IF EXISTS "subscriptions_owner" ON subscriptions;
CREATE POLICY "subscriptions_owner" ON subscriptions
  FOR ALL USING (auth.uid()::text = user_id);


-- ============================================================
-- 6. SERVICE ROLE BYPASS (for server-side API calls)
-- ============================================================
-- Allow the service role (used in API routes) to bypass RLS
DROP POLICY IF EXISTS "profiles_service" ON profiles;
CREATE POLICY "profiles_service" ON profiles
  FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "conversations_service" ON conversations;
CREATE POLICY "conversations_service" ON conversations
  FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "messages_service" ON messages;
CREATE POLICY "messages_service" ON messages
  FOR ALL TO service_role USING (true);


-- ============================================================
-- DONE — verify with:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- ============================================================
