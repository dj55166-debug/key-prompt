-- ============================================================
-- Key Prompt — Seed Slow Motion Prompts
-- Run this in the Supabase SQL Editor
-- ============================================================

DO $$
DECLARE
  author uuid := (SELECT id FROM profiles LIMIT 1);
BEGIN
  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Bullet Time Water Splash',
    'Ultra slow motion water splash frozen at peak impact with 10000fps crystal clarity.',
    'A single water droplet falls from extreme height onto a perfectly still mirror surface. Camera positioned at surface level captures the crown splash formation in ultra slow motion at 10000fps equivalent. The splash crown rises in perfect symmetry, each individual droplet catching studio light creating hundreds of tiny prisms. Secondary ripples expand outward in mathematical precision. At peak height the entire structure freezes for a beat then collapses back in reverse symmetry. Shot in a black infinity studio with single overhead softbox. Color grade: pure whites, deep blacks, subtle cool blue tint on water. Maximum clarity throughout.',
    'Slow Motion', ARRAY['Veo 3', 'Runway'], 4.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Hummingbird Wing Freeze',
    'A hummingbird frozen in slow motion reveals invisible wingbeats and iridescent feather detail.',
    'A ruby-throated hummingbird hovers at a red flower in a sun-drenched garden. Ultra slow motion at 4000fps reveals each individual wingbeat: the complex figure-eight motion, the way each feather bends and flexes under aerodynamic load, the iridescent throat patch shifting color from black to brilliant ruby as light angle changes by fractions of a degree. The camera tracks at bird eye level, background garden blurring into soft impressionist color. Pollen particles drift past in suspended animation. The birds eye blinks in slow motion revealing a perfect reflection of the garden in its convex surface. Natural light, golden hour, no artificial illumination. Color grade: rich saturated greens, warm amber light, jewel-tone feather colors at maximum saturation.',
    'Slow Motion', ARRAY['Veo 3'], 3.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Glass Shatter Impact',
    'A glass sphere shatters in hyper slow motion revealing the internal fracture wave before visible cracks appear.',
    'A perfect glass sphere sits on a black marble plinth. A steel ball bearing drops from above frame in slow motion. The moment of contact unfolds at 50000fps equivalent: first the internal stress wave visible as a refractive distortion traveling through the glass faster than the surface can crack, then the fracture network propagating outward from the impact point in a branching crystal tree pattern, then finally the catastrophic surface failure as thousands of fragments explode outward in a perfect radial pattern. Each glass fragment tumbles in slow motion catching the single studio light source creating thousands of simultaneous lens flares. Camera locked on tripod, no movement. Pure black background. Single hard key light from camera left. Grade: cold steel blue tones, maximum contrast, absolute sharpness on every glass fragment.',
    'Slow Motion', ARRAY['Runway', 'Veo 3'], 0.00, true, true, author, 'video'
  );

  RAISE NOTICE 'Slow motion prompts inserted successfully.';
END $$;
