-- ============================================================
-- Key Prompt — Archive Old Generic Prompts
-- Run this in the Supabase SQL Editor
-- Hides legacy non-AI-video prompts without deleting them
-- ============================================================

-- Preview what will be archived before committing
-- (run this SELECT first to review the list)
SELECT id, title, category, is_published
FROM prompts
WHERE category NOT IN (
  'Cinematic',
  'Anime',
  'Luxury Ads',
  'TikTok / Reels',
  'Product Reveal',
  'Slow Motion',
  'Fantasy',
  'Corporate'
)
ORDER BY created_at DESC;

-- ── Archive: hide all prompts whose category does not match ──
-- the 8 new AI-video categories.
-- is_published = false hides them from the marketplace
-- but keeps the data intact and recoverable.

UPDATE prompts
SET is_published = false
WHERE category NOT IN (
  'Cinematic',
  'Anime',
  'Luxury Ads',
  'TikTok / Reels',
  'Product Reveal',
  'Slow Motion',
  'Fantasy',
  'Corporate'
);

-- ── Also hide any Corporate prompts that are clearly non-video ──
-- (old generic business/marketing/writing prompts that were
-- remapped to Corporate by fix-categories.sql)
-- Remove this block if you want to keep Corporate prompts visible.

UPDATE prompts
SET is_published = false
WHERE category = 'Corporate'
  AND (
    type != 'video'
    OR type IS NULL
  );

-- ── Verify result ─────────────────────────────────────────────
SELECT
  category,
  COUNT(*) FILTER (WHERE is_published = true)  AS published,
  COUNT(*) FILTER (WHERE is_published = false) AS archived,
  COUNT(*)                                      AS total
FROM prompts
GROUP BY category
ORDER BY published DESC;
