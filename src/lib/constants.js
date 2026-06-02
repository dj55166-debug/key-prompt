// ── AI Video categories ───────────────────────────────────────
export const CATEGORIES = [
  { id: 'All',             labelKey: 'categories.all' },
  { id: 'Cinematic',       labelKey: 'categories.cinematic' },
  { id: 'Anime',           labelKey: 'categories.anime' },
  { id: 'Luxury Ads',      labelKey: 'categories.luxuryAds' },
  { id: 'TikTok / Reels',  labelKey: 'categories.tiktok' },
  { id: 'Product Reveal',  labelKey: 'categories.productReveal' },
  { id: 'Slow Motion',     labelKey: 'categories.slowMotion' },
  { id: 'Fantasy',         labelKey: 'categories.fantasy' },
]

// ── AI tools with colored badge styles ──────────────────────
export const AI_TOOLS = [
  { id: 'Veo 3',       color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { id: 'Kling',       color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { id: 'Runway',      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { id: 'Midjourney',  color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  { id: 'Pika',        color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
]

export const TOOL_COLORS = {
  'Veo 3':      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
  'Kling':      'bg-purple-500/20 text-purple-400 border border-purple-500/30',
  'Runway':     'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'Midjourney': 'bg-orange-500/20 text-orange-400 border border-orange-500/30',
  'Pika':       'bg-pink-500/20 text-pink-400 border border-pink-500/30',
}

// ── Per-category thumbnail gradient fallback ─────────────────
export const CATEGORY_GRADIENTS = {
  'Cinematic':      'from-blue-950 via-indigo-900 to-purple-900',
  'Anime':          'from-pink-900 via-rose-800 to-orange-800',
  'Luxury Ads':     'from-yellow-900 via-amber-800 to-orange-900',
  'TikTok / Reels': 'from-emerald-950 via-teal-900 to-cyan-800',
  'Product Reveal': 'from-sky-950 via-blue-900 to-indigo-900',
  'Slow Motion':    'from-indigo-950 via-violet-900 to-blue-900',
  'Fantasy':        'from-violet-900 via-fuchsia-900 to-purple-950',
  'Corporate':      'from-slate-900 via-zinc-800 to-gray-900',
}

export const DEFAULT_GRADIENT = 'from-violet-950 via-purple-900 to-indigo-900'

// ── Category list strings (for SubmitPromptForm selects) ─────
export const CATEGORY_IDS = CATEGORIES.filter(c => c.id !== 'All').map(c => c.id)

// ── Tool list strings ────────────────────────────────────────
export const TOOL_IDS = AI_TOOLS.map(t => t.id)

// ── Trending search terms ────────────────────────────────────
export const TRENDING_TERMS = [
  'cinematic slow motion',
  'luxury product',
  'anime girl',
  'kling runway',
  'tiktok viral',
  'veo 3',
  'product reveal',
  'fantasy landscape',
]
