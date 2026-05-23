import { useState } from "react";

const creator = {
  name: "Alex Rivera",
  username: "@alexrivera",
  avatar: "AR",
  role: "Growth Marketer & Prompt Engineer",
  bio: "Building AI-powered growth systems. I share the exact prompts I use to grow B2B companies from 0 to $1M ARR. 10+ years in marketing.",
  location: "Paris, France",
  website: "alexrivera.co",
  joined: "January 2024",
  verified: true,
  followers: 3240,
  following: 128,
  totalLikes: 18400,
  totalUses: 94200,
  prompts: [
    { id: 1, title: "Ultimate Cold Email Generator", category: "Sales", likes: 1240, uses: 8430, price: 4.99, type: "Prompt", gradient: "from-violet-500 to-indigo-600" },
    { id: 2, title: "LinkedIn Content Machine", category: "Marketing", likes: 892, uses: 3210, price: 0, type: "Automation", gradient: "from-blue-500 to-cyan-500" },
    { id: 3, title: "AI Business Plan Builder", category: "Business", likes: 2100, uses: 12800, price: 9.99, type: "Prompt", gradient: "from-amber-400 to-orange-500" },
    { id: 4, title: "SEO Article Dominator", category: "Marketing", likes: 678, uses: 5600, price: 0, type: "Prompt", gradient: "from-emerald-500 to-teal-500" },
    { id: 5, title: "Investor Pitch Deck Script", category: "Business", likes: 1560, uses: 7800, price: 14.99, type: "Prompt", gradient: "from-rose-500 to-pink-500" },
    { id: 6, title: "Cold Call Script Generator", category: "Sales", likes: 430, uses: 2100, price: 0, type: "Prompt", gradient: "from-indigo-500 to-purple-500" },
  ],
  badges: ["Top Creator", "100+ Sales", "Verified"],
};

const TABS = ["Prompts", "Popular", "Free"];

function StatPill({ value, label }) {
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n;
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-black text-white leading-none">{fmt(value)}</span>
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
}

function PromptCard({ prompt }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/30">
      <div className={`h-1 bg-gradient-to-r ${prompt.gradient}`} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{prompt.type}</span>
            <span className="text-[10px] font-semibold bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{prompt.category}</span>
          </div>
          {prompt.price === 0
            ? <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex-shrink-0">Free</span>
            : <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex-shrink-0">${prompt.price}</span>
          }
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-3 group-hover:text-violet-300 transition-colors line-clamp-2">{prompt.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {prompt.uses >= 1000 ? `${(prompt.uses/1000).toFixed(1)}k` : prompt.uses}
            </span>
          </div>
          <button
            onClick={() => setLiked(!liked)}
            className={`flex items-center gap-1 text-[11px] transition-colors ${liked ? "text-rose-400" : "text-gray-600 hover:text-rose-400"}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {liked ? prompt.likes + 1 : prompt.likes}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreatorProfile() {
  const [activeTab, setActiveTab] = useState("Prompts");
  const [following, setFollowing] = useState(false);

  const filtered = activeTab === "Popular"
    ? [...creator.prompts].sort((a, b) => b.likes - a.likes)
    : activeTab === "Free"
    ? creator.prompts.filter(p => p.price === 0)
    : creator.prompts;

  return (
    <div className="min-h-screen bg-gray-950 font-sans">

      {/* Nav */}
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-300 transition-colors p-1 -ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm text-white">Key Prompt</span>
          </div>
          <button className="text-gray-500 hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative h-28 bg-gradient-to-br from-violet-900 via-indigo-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4f46e5 0%, transparent 40%)" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
      </div>

      <div className="max-w-lg mx-auto px-4">

        {/* Avatar overlapping banner */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black border-4 border-gray-950 shadow-xl">
              {creator.avatar}
            </div>
            {creator.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center border-2 border-gray-950">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex gap-2 mb-1">
            <button className="p-2 rounded-xl border border-gray-700 text-gray-400 hover:text-gray-200 hover:border-gray-500 transition-all bg-gray-900">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </button>
            <button
              onClick={() => setFollowing(!following)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                following
                  ? "bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700"
                  : "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/50"
              }`}
            >
              {following ? "Following ✓" : "Follow"}
            </button>
          </div>
        </div>

        {/* Name + info */}
        <div className="mb-5">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h1 className="text-xl font-black text-white">{creator.name}</h1>
            {creator.badges.map(b => (
              <span key={b} className="text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">{b}</span>
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-2">{creator.username}</p>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">{creator.bio}</p>

          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {creator.location}
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span className="text-violet-400">{creator.website}</span>
            </span>
            <span className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              Joined {creator.joined}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-4 gap-2 divide-x divide-gray-800">
            <StatPill value={creator.prompts.length} label="Prompts" />
            <div className="pl-2"><StatPill value={creator.followers} label="Followers" /></div>
            <div className="pl-2"><StatPill value={creator.totalLikes} label="Likes" /></div>
            <div className="pl-2"><StatPill value={creator.totalUses} label="Uses" /></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 p-1 rounded-xl mb-5">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white shadow-md shadow-violet-900/50"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab}
              {tab === "Free" && (
                <span className="ml-1 text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                  {creator.prompts.filter(p => p.price === 0).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Prompt grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 pb-10">
            {filtered.map(p => <PromptCard key={p.id} prompt={p} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p className="text-gray-500 text-sm">No prompts in this category.</p>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-800 flex sm:hidden z-30">
        {[
          { icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", label: "Home", active: false },
          { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", label: "Search", active: false },
          { icon: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z", label: "Library", active: false },
          { icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", label: "Profile", active: true },
        ].map(({ icon, label, active }) => (
          <button key={label} className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${active ? "text-violet-400" : "text-gray-600 hover:text-gray-400"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
            </svg>
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}