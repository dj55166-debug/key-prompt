-- ============================================================
-- Key Prompt — Fix legacy category values
-- Run this in the Supabase SQL Editor (one-time migration)
-- Maps old category names to the new AI-video category system
-- ============================================================

-- Cinematic: old motion/product/cinematic values
UPDATE prompts SET category = 'Cinematic'
WHERE category ILIKE '%cinematic%'
   OR category ILIKE '%motion%'
   OR category ILIKE '%product%';

-- Anime: character/cartoon/anime values
UPDATE prompts SET category = 'Anime'
WHERE category ILIKE '%anime%'
   OR category ILIKE '%cartoon%'
   OR category ILIKE '%character%';

-- TikTok / Reels: short-form / fun / social
UPDATE prompts SET category = 'TikTok / Reels'
WHERE category ILIKE '%tiktok%'
   OR category ILIKE '%reel%'
   OR category ILIKE '%short%'
   OR category ILIKE '%fun%';

-- Fantasy: story / fantasy / creative
UPDATE prompts SET category = 'Fantasy'
WHERE category ILIKE '%fantasy%'
   OR category ILIKE '%story%';

-- Corporate: business / marketing / sales / email / design / ai
UPDATE prompts SET category = 'Corporate'
WHERE category ILIKE '%business%'
   OR category ILIKE '%marketing%'
   OR category ILIKE '%sales%'
   OR category ILIKE '%email%'
   OR category ILIKE '%design%'
   OR category ILIKE '%ai%';

-- Luxury Ads: luxury / ad / brand
UPDATE prompts SET category = 'Luxury Ads'
WHERE category ILIKE '%luxury%'
   OR category ILIKE '%ad%'
   OR category ILIKE '%brand%';

-- Verify result
SELECT category, count(*) FROM prompts GROUP BY category ORDER BY count DESC;
