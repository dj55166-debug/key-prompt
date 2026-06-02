-- ============================================================
-- Key Prompt — Seed 20 AI Video Prompts
-- Run this in the Supabase SQL Editor
-- Requires at least one row in the profiles table
-- ============================================================

DO $$
DECLARE
  author uuid;
BEGIN
  SELECT id INTO author FROM profiles LIMIT 1;

  IF author IS NULL THEN
    RAISE EXCEPTION 'No profiles found. Create a user account first, then re-run this seed.';
  END IF;

  -- ── CINEMATIC (5) ─────────────────────────────────────────────

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Golden Hour Desert Chase',
    'Cinematic car chase across a salt flat at golden hour with dust trails and anamorphic lens flares.',
    'A sleek black sports car races across a cracked desert salt flat at golden hour. The camera starts in an aerial drone shot pulling back dramatically as dust trails billow behind the vehicle. Cut to a low ground-level angle, car roaring past at 120mph, rocks and sand exploding outward. The setting sun casts long amber shadows across the flat terrain. Slow-motion wheel spin captures tire smoke dissolving into the air. Interior shot of the driver''s determined eyes reflected in the rearview mirror. Cinematic lens flare bleeds across the frame. Shot on ARRI Alexa, anamorphic lens, film grain texture, 24fps, 2.39:1 aspect ratio. Color grade: warm amber highlights, teal shadows, crushed blacks.',
    'Cinematic',
    ARRAY['Kling', 'Veo 3'],
    0.00, true, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Rainy Tokyo Neon Walk',
    'A solitary figure walks rain-soaked Tokyo streets surrounded by neon reflections and shallow focus.',
    'A lone figure in a black trench coat walks through neon-lit Tokyo streets in heavy rain at midnight. Shallow depth of field focuses on their silhouette as reflections of red and blue neon signs shimmer across the wet pavement. The camera tracks smoothly at shoulder level, rainwater splashing with each deliberate step. A passing yellow taxi sends a wave of water across the frame. Rain particles catch the light in slow motion. The figure stops, looks upward at a towering billboard. Their breath fogs in the cold air. Shot with anamorphic bokeh producing oval highlights, heavy rain simulation, street-level perspective. Mood: melancholic, cinematic noir. ARRI Alexa LF, 35mm equivalent, Kodak 5219 emulation.',
    'Cinematic',
    ARRAY['Kling', 'Veo 3'],
    3.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Mountain Storm Lightning',
    'Epic granite peaks emerge from storm clouds while a lone climber clings to the rock face.',
    'Towering granite peaks emerge from swirling storm clouds at dusk. A timelapse of clouds racing over ridgelines transitions to real-time as lightning strikes illuminate the valley far below. The camera pushes slowly toward the mountain face, revealing a tiny climber on a sheer vertical rock wall, wind whipping their jacket violently. The storm clears in accelerated time, unveiling a blood-red sunset bleeding across the snow-capped summit. Scale is everything: the human figure emphasizes the mountain''s overwhelming scale. Shot on RED Monstro 8K, ultra-wide 16mm lens, extreme sharpness throughout, RAW color science. Grade: desaturated midtones, burning orange sky, dark storm greens.',
    'Cinematic',
    ARRAY['Veo 3'],
    4.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Venice Canal At Dawn',
    'Mist rises from a still Venice canal at sunrise as a lone gondola glides through absolute silence.',
    'Mist rises from a perfectly still Venice canal at dawn, the water a dark mirror. A lone gondola moves silently through the frame, the gondolier a dark silhouette against a soft peach and lavender sky. Camera floats at water level on a rig just centimeters above the surface, reflections of terracotta buildings rippling gently in the gondola''s wake. An unseen church bell rings, and pigeons explode from a rooftop in a rush of wings. The camera tilts upward slowly to reveal the full expanse of the Bacino di San Marco bathed in first morning gold. Not a tourist in sight. Timeless and quiet. Shot on anamorphic with heavy lens breathing, vintage warm grade, highlights lifted to milky softness.',
    'Cinematic',
    ARRAY['Veo 3', 'Kling'],
    4.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Midnight Subway Platform',
    'A Tokyo metro train screams through an empty midnight station leaving a single figure in its wake.',
    'A Tokyo metro train rushes through an underground station at midnight. Camera positioned at the far end of the platform as the train screams past at full speed, creating a sonic boom of displaced air visible as a shockwave rippling outward. Motion blur of lit windows streaks across the frame. As the last car disappears into the tunnel, a single figure stands alone on the now-empty platform, long coat still billowing from the wind. Fluorescent strip lights flicker once. The camera begins a long slow push toward the figure from behind. Brutalist concrete architecture, deep geometric shadows, industrial scale. Cyberpunk color grade: magenta reflections, cyan highlights, deep crushed shadow. 4K, high frame rate for motion blur precision.',
    'Cinematic',
    ARRAY['Kling'],
    2.99, false, true, author, 'video'
  );

  -- ── ANIME (4) ────────────────────────────────────────────────

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Cherry Blossom Samurai',
    'A female samurai draws her katana at cliff edge as cherry blossoms swirl in slow motion around her.',
    'A female samurai stands at the edge of a cliff overlooking an endless sea of pink cherry blossom trees in full bloom at golden hour. Her long black hair and flowing white kimono flutter in a warm spring breeze. She slowly draws her katana, the blade catching the slanted sunlight, sending a flash across the screen. Thousands of petals spiral upward around her as if drawn by an invisible force. The camera performs a slow 360-degree orbit at chest level, starting behind her and revolving to face her directly. Her expression is calm and resolute. Studio Ghibli inspired art style: soft cel shading, hand-painted watercolor backgrounds, fluid cloth and hair physics, ambient occlusion. Color palette: sakura pink, ivory white, deep ocean blue sky, gold.',
    'Anime',
    ARRAY['Midjourney', 'Kling'],
    0.00, true, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Neon Mech City Battle',
    'Two colossal mechs collide over a rain-soaked cyberpunk megacity in an Akira-inspired showdown.',
    'A 50-meter humanoid mech stands in the rain-soaked ruins of a neon-lit megacity at night. Its chest reactor pulses electric blue, casting colored light across the wet streets below. Across the skyline a second mech charges at full speed, jet boosters blazing orange. The camera starts aerial at rooftop height then crash-zooms to ground level where civilians scatter. The impact explosion sends a shockwave across the frame, rippling every puddle simultaneously, shattering glass in all directions. Debris rains in slow motion. Animated in the style of Ghost in the Shell and Akira: high contrast lighting, chromatic aberration on energy emissions, hyper-detailed mechanical joint articulation, cinematic 2.39:1 widescreen. Rain is constant, heavy, photorealistic.',
    'Anime',
    ARRAY['Kling'],
    3.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Spirit Forest Journey',
    'A child in a red raincoat discovers a bioluminescent spirit forest guarded by ancient glowing creatures.',
    'A small child wearing a red raincoat walks alone through an ancient glowing forest at night. Enormous tree roots pulse with soft bioluminescent blue light beneath a thick carpet of luminous green moss. Tiny spirit creatures — translucent, wispy, made of light — flutter between the branches overhead, watching with curious enormous eyes. The camera follows at ground level behind the child, framing them small against the vast ancient trees. As the child enters a clearing, an impossibly large spirit tree is revealed: its trunk wider than a house, emanating warm golden light from deep within its bark cracks. Small spirits drift upward from its canopy like embers. Studio Ghibli aesthetic inspired by My Neighbor Totoro and Princess Mononoke: lush hand-painted backgrounds, soft warm lighting, gentle animation timing.',
    'Anime',
    ARRAY['Midjourney', 'Kling'],
    2.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Ocean Dragon Awakening',
    'A colossal iridescent sea dragon erupts from a typhoon ocean in a Makoto Shinkai waterscape.',
    'A colossal sea dragon rises from churning storm-dark ocean water during a typhoon at night. Its scales are iridescent blue-black, catching lightning flashes, eyes burning amber like twin furnaces. The camera begins fully submerged, looking upward through turbulent dark water as the creature''s enormous shadow blocks out the storm-lit sky above. It breaches the surface in slow motion, displacing walls of white water hundreds of meters into the air. Lightning illuminates its serpentine body coiling against storm clouds that part before it. A deep resonant roar sends visible pressure waves across the ocean surface in concentric rings. Makoto Shinkai color palette: saturated deep navy, luminous white foam, electric amber. Hyper-detailed water simulation, atmospheric god-rays breaking through storm cloud, heroic low-angle composition.',
    'Anime',
    ARRAY['Kling', 'Midjourney'],
    4.99, false, true, author, 'video'
  );

  -- ── LUXURY ADS (3) ───────────────────────────────────────────

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Perfume Northern Lights',
    'A sculptural perfume bottle refracts aurora borealis light on Icelandic tundra in ultra-macro.',
    'A sculptural glass perfume bottle sits on a mirror-black obsidian surface beneath a real aurora borealis sky in Iceland. The bottle catches and refracts the shifting green and purple curtains of light, casting spectral reflections across the polished surface. Extreme macro close-up of the amber liquid inside swirling in slow motion as if alive, moved by an unseen current. Camera pulls back on a long lens to reveal the full landscape: frozen tundra stretching to the horizon, a star-filled sky, the perfume bottle the only warm amber element in an entire world of cold blues and greens. Liquid droplets fall from the golden stopper in ultra slow-motion, 1000fps, each one refracting the aurora inside. Color grade: desaturated cool tones with warm amber bottle, maximum contrast, premium editorial.',
    'Luxury Ads',
    ARRAY['Runway', 'Veo 3'],
    4.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Swiss Watch Movement Macro',
    'Extreme macro cinematography exploring a mechanical watch movement with jeweled gears and hairspring.',
    'Extreme macro cinematography inside a luxury Swiss mechanical watch movement. The camera explores the gear train in intimate detail: the hairspring oscillating at 28,800 beats per hour, the escape wheel ticking with mechanical precision, jeweled ruby bearings gleaming like tiny red stars. Shot from inside the case looking upward through the sapphire crystal. Rack focus pulls between the balance wheel and the mainspring barrel. Light sources shift: warm amber to cold blue to surgical white. Seamless transition to the exterior: the watch on a man''s wrist, the cuff of a black tuxedo, a firm confident handshake. Hero final shot: the watch face reflected in the convex glass of a camera lens. Grade: high contrast metallic tones, silver and gold color story, absolute sharpness.',
    'Luxury Ads',
    ARRAY['Runway'],
    3.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Supercar Desert Dawn Launch',
    'A matte black supercar launches from darkness into a desert sunrise under a full Milky Way sky.',
    'A matte black supercar sits motionless in the Atacama Desert at 4am, surrounded by perfect silence and an unobstructed carpet of stars. A timelapse compresses the Milky Way arcing in a full arc overhead in thirty seconds. As the first light appears on the eastern horizon, the car''s headlights snap on — two piercing white beams cutting through pre-dawn blue, reaching into infinity. The engine starts with a low resonant rumble that builds. The car launches forward in a straight line toward the rising sun at full throttle, a chase helicopter camera matching its speed from thirty meters above and behind. Speed ramp: normal speed to 4x as it crosses frame. Rooster tail of desert dust. No driver visible. Pure mechanical life. Color grade: teal shadows, burning orange horizon, luxury automotive precision.',
    'Luxury Ads',
    ARRAY['Veo 3', 'Runway'],
    4.99, false, true, author, 'video'
  );

  -- ── TIKTOK / REELS (3) ───────────────────────────────────────

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Color Pop Dance Transitions',
    'Dancer in white performs urban choreography with viral color-pop background transitions on each beat.',
    'A dancer in an all-white outfit performs high-energy urban choreography in a stark white infinite studio. On each beat drop the background explodes with a different vivid color: hot pink, electric yellow, neon green, cobalt blue. The dancer''s clothing morphs to match in seamless color transitions. Camera cuts are rhythmic and sharp: wide full-body shot, close-up of hands in motion, extreme low angle looking up, overhead bird''s-eye, slow-motion freeze at the peak of a jump. A confetti burst at the final beat. Vertical 9:16 format. Punchy over-saturated color grade, high contrast, deep blacks. Trending TikTok visual language: fast cuts, graphic color, kinetic energy. 15 to 30 second format, designed for maximum replay value and shareability.',
    'TikTok / Reels',
    ARRAY['Pika', 'Kling'],
    0.00, true, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Satisfying Food ASMR Macro',
    'Ultra-slow macro food shots: chocolate pours, cake slices, and pulled croissant layers for viral food content.',
    'Ultra-close macro cinematography of perfect food preparation in slow motion. Scene one: glossy dark chocolate poured from height over a perfectly assembled five-layer dessert tower, filmed at 240fps, the chocolate flowing in long viscous ribbons coating every surface edge. Scene two: a single clean knife stroke through a rainbow layer cake, the cross-section perfectly symmetrical, cream cheese frosting catching the light. Scene three: hands pull apart a freshly baked butter croissant, steam rising, the laminated interior layers separating into hundreds of thin sheets. Each individual shot runs two to four seconds. Overall color palette: warm pastels, cream, rich brown. Natural window light from camera left. All shots perfectly centered and symmetrical. Vertical 9:16. Perfect for food brand or recipe TikTok account.',
    'TikTok / Reels',
    ARRAY['Pika'],
    2.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Fashion POV Street Reveal',
    'First-person fashion POV walk through golden-hour city streets with mirror and puddle outfit reveals.',
    'First-person POV walk through a stylish urban neighborhood at golden hour, wearing a new outfit. The camera bobs naturally with each step, looking downward to reveal color-coordinated clean white sneakers, tailored trousers, the edge of a structured jacket. Transitions between three different outfit reveals: walking past a full-length mirror mounted on a brick wall giving the first complete outfit view; passing a designer boutique window that reflects the second look; stepping over a rain puddle that reflects the third look perfectly. The walk ends with a confident stop, camera panning up to face level for the first time. Shot handheld on iPhone Pro for authentic movement. Color graded warm with lifted shadows. Vertical 9:16. Text overlay space reserved at top and bottom. 20 to 30 second format for Instagram Reels and TikTok.',
    'TikTok / Reels',
    ARRAY['Pika', 'Kling'],
    2.99, false, true, author, 'video'
  );

  -- ── PRODUCT REVEAL (3) ───────────────────────────────────────

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Sneaker Fog Pedestal Reveal',
    'Limited-edition sneakers emerge from dry ice fog on a spotlight pedestal in hypebeast cinematic style.',
    'A pair of limited-edition sneakers sits on a black circular pedestal in absolute darkness. Dry ice fog creeps slowly across the floor from all sides, pooling around the base of the pedestal. A single narrow spotlight activates from directly above, illuminating the shoe in hard white light against total black. The camera orbits at shoe level in a slow deliberate 270-degree arc, capturing every design detail in sequence: the stitching on the toe box, the layered sole construction, the premium lace texture, the embossed heel counter. At the end of the orbit, a second spotlight activates, revealing an identical pedestal beside the first displaying the alternate colorway. Both shoes, wide hero shot, dry ice fog settling at ground level, theatrical pause. Hypebeast streetwear aesthetic. Grade: near-monochrome with the shoe''s accent color as the only saturation in frame.',
    'Product Reveal',
    ARRAY['Runway', 'Veo 3'],
    3.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Smartphone Dark Matter Reveal',
    'A premium smartphone powers on in total darkness, light expanding outward across a polished glass surface.',
    'Total darkness for two full seconds. A single hair-thin line of light appears at the bottom edge of the frame: the edge of a smartphone screen powering on for the very first time. The camera pulls back in extreme slow motion as screen brightness expands, spilling light gradually across a highly polished black glass desk surface. The phone''s face is revealed over five seconds: impossibly thin profile, aerospace-grade materials, the glass surface catching and holding the light like a mirror. The camera performs a smooth 270-degree orbit at table level, the phone''s reflection perfectly duplicated in the surface below. The hand that reaches in to pick it up moves with deliberate elegance, long fingers, clean nails. The phone rises. Final frame: product held up against a pure white background, face-on, screen lighting the holder''s face with soft blue light. Grade: pure neutral whites, graphite blacks, surgical precision.',
    'Product Reveal',
    ARRAY['Runway'],
    3.99, false, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Diamond Ring Light Prism',
    'A diamond ring diffracts a beam of white light into full spectrum rainbows across a white satin surface.',
    'A diamond solitaire engagement ring sits centered on a white satin surface under a single narrow beam of white light from directly above. As the camera begins a slow orbital movement at extreme close range just millimeters from the surface, the diamond begins to refract the light into a full spectrum of rainbow colors that sweep slowly across the entire frame. Ultra-macro detail of the internal facets: light bouncing between cut surfaces in slow motion, each reflection a tiny perfect spectrum. The camera pulls back to reveal the full ring setting. An elegant hand enters frame and lifts the ring, holding it up against a soft gradient sky background with the sun directly behind, creating a halo flare through the stone. Final shot: a premium box closes, the ring disappearing, the brand''s initials impressed in velvet. Grade: pure white tones, spectral rainbow color, every surface at maximum sharpness.',
    'Product Reveal',
    ARRAY['Veo 3', 'Runway'],
    4.99, false, true, author, 'video'
  );

  -- ── FANTASY (2) ──────────────────────────────────────────────

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Enchanted Library Vortex',
    'Thousands of ancient books take flight inside a towering magical library, swirling in a golden tornado.',
    'An impossibly tall ancient library stretches upward into darkness so deep the upper shelves are invisible. Thousands of leather-bound books line oak shelves from floor to ceiling, illuminated by floating golden lanterns drifting slowly through still air like deep sea creatures. Slowly, one book trembles. Then another. Then simultaneously every book on every shelf begins to rise, floating gently at first, then building speed until the entire library erupts into a whirlwind of spinning pages and swirling dust. The camera moves upward through the center of this tornado of books and light, rising toward the unseen ceiling. A robed figure stands at the apex on a circular stone platform, their staff raised, orchestrating the chaos. Loose pages flutter directly past the lens. Magic particles like golden fireflies fill every shadow. Rich deep mahogany shelving, warm amber lantern light, aged parchment yellows. Inspired by Doctor Strange and Harry Potter aesthetic.',
    'Fantasy',
    ARRAY['Midjourney'],
    0.00, true, true, author, 'video'
  );

  INSERT INTO prompts (title, description, content, category, ai_models, price, is_free, is_published, author_id, type)
  VALUES (
    'Dragon Rider Sunset Kingdom',
    'A dragon rider banks over a fantasy kingdom at sunset, breathes blue fire through storm clouds.',
    'A dragon and its rider soar above an endless fantasy landscape at sunset. The dragon''s wingspan reaches thirty meters, each powerful wingbeat sending visible pressure waves through the clouds below. The camera opens behind the rider at helmet level, wind tearing past, altitude making the kingdom below look like a detailed map. Cut to a side profile as the dragon banks sharply left, revealing a kingdom of white stone towers and golden spires far below, rivers catching sunset light like ribbons of fire. The setting sun is three times its normal apparent size, bleeding red and gold and deep violet across a cloudscape that stretches to every horizon. On the rider''s command the dragon rolls and dives, breathing a stream of blue-white fire downward that illuminates the underbelly of clouds from within. Final frame: dragon silhouetted against the full sun, wings spread at maximum span. Painterly fantasy art style, hyperdetailed creature design, scale and grandeur at every frame.',
    'Fantasy',
    ARRAY['Midjourney'],
    2.99, false, true, author, 'video'
  );

  RAISE NOTICE 'Seeded 20 AI video prompts successfully.';
END $$;
