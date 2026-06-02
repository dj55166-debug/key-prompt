-- ============================================================
-- Key Prompt — Final Cleanup: Hide Remaining Non-Video Prompts
-- Run this in the Supabase SQL Editor
-- ============================================================

UPDATE prompts
SET is_published = false
WHERE title IN (
  'Travel Itinerary Builder',
  'Baby Name Generator',
  'Funny Girls Chat Generator'
)
AND (type != 'video' OR type IS NULL);

-- Verify result
SELECT id, title, category, type, is_published
FROM prompts
WHERE title IN (
  'Travel Itinerary Builder',
  'Baby Name Generator',
  'Funny Girls Chat Generator'
);
