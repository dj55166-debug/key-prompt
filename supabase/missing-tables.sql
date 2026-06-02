-- ============================================================
-- Key Prompt — Missing Tables & Column Additions
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Add missing columns to existing tables ──────────────────

-- prompts: add thumbnail_url and sales_count
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS thumbnail_url  text;
ALTER TABLE prompts ADD COLUMN IF NOT EXISTS sales_count    integer NOT NULL DEFAULT 0;

-- profiles: add extra fields used by CreatorProfile
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS bio          text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS website      text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS location     text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_verified  boolean NOT NULL DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url   text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_account_id text; -- Stripe Connect

-- ── New tables ───────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS likes (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id  uuid REFERENCES prompts(id)  ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

CREATE TABLE IF NOT EXISTS saved_prompts (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id  uuid REFERENCES prompts(id)  ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, prompt_id)
);

CREATE TABLE IF NOT EXISTS follows (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  creator_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(follower_id, creator_id)
);

CREATE TABLE IF NOT EXISTS comments (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prompt_id  uuid REFERENCES prompts(id)  ON DELETE CASCADE,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type       text NOT NULL, -- 'new_follower' | 'new_sale' | 'new_review' | 'new_purchase'
  data       jsonb,
  read       boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ── Row Level Security ───────────────────────────────────────
-- Enable RLS on every new table

ALTER TABLE likes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_prompts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows        ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments       ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications  ENABLE ROW LEVEL SECURITY;

-- likes: users can see all likes but only insert/delete their own
CREATE POLICY "likes_select_all"   ON likes FOR SELECT USING (true);
CREATE POLICY "likes_insert_own"   ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "likes_delete_own"   ON likes FOR DELETE USING  (auth.uid() = user_id);

-- saved_prompts: private to owner
CREATE POLICY "saved_select_own"   ON saved_prompts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "saved_insert_own"   ON saved_prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "saved_delete_own"   ON saved_prompts FOR DELETE USING  (auth.uid() = user_id);

-- follows: public read, own write
CREATE POLICY "follows_select_all" ON follows FOR SELECT USING (true);
CREATE POLICY "follows_insert_own" ON follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "follows_delete_own" ON follows FOR DELETE USING  (auth.uid() = follower_id);

-- comments: public read, own write
CREATE POLICY "comments_select_all"  ON comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own"  ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "comments_delete_own"  ON comments FOR DELETE USING  (auth.uid() = user_id);

-- notifications: private to owner
CREATE POLICY "notif_select_own"   ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notif_update_own"   ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- ── Indexes for performance ──────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_likes_prompt_id    ON likes(prompt_id);
CREATE INDEX IF NOT EXISTS idx_likes_user_id      ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_id      ON saved_prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_creator    ON follows(creator_id);
CREATE INDEX IF NOT EXISTS idx_comments_prompt    ON comments(prompt_id);
CREATE INDEX IF NOT EXISTS idx_notif_user         ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_author     ON prompts(author_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category   ON prompts(category);

-- ── Function: auto-increment sales_count after purchase ─────
CREATE OR REPLACE FUNCTION increment_sales_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE prompts SET sales_count = sales_count + 1
  WHERE id = NEW.prompt_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_purchase_increment_sales ON purchases;
CREATE TRIGGER on_purchase_increment_sales
  AFTER INSERT ON purchases
  FOR EACH ROW EXECUTE PROCEDURE increment_sales_count();

-- ── NOTES FOR MANUAL SETUP IN SUPABASE DASHBOARD ─────────────
-- 1. In Authentication > URL Configuration, add:
--    Site URL: https://keyprompt.app
--    Redirect URLs: https://keyprompt.app/reset-password
--
-- 2. Enable Google OAuth in Authentication > Providers > Google
--
-- 3. Create the profiles table auto-population trigger (if not done):
--    CREATE OR REPLACE FUNCTION handle_new_user()
--    RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
--    BEGIN
--      INSERT INTO public.profiles (id, full_name, username)
--      VALUES (
--        new.id,
--        new.raw_user_meta_data->>'full_name',
--        lower(split_part(new.email, '@', 1))
--      )
--      ON CONFLICT (id) DO NOTHING;
--      RETURN new;
--    END;
--    $$;
--    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
--    CREATE TRIGGER on_auth_user_created
--      AFTER INSERT ON auth.users
--      FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
--
-- 4. For Stripe Connect (80/20 split):
--    Deploy the Edge Function at supabase/functions/create-payment-intent/
--    Set secrets: STRIPE_SECRET_KEY, STRIPE_PLATFORM_ACCOUNT_ID
--    Each creator must complete Stripe Connect onboarding (stripe_account_id in profiles)
