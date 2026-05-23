import { useState } from "react";

const categories = [
  "All", "AI", "Business", "Marketing", "Design", "Development",
  "Productivity", "Writing", "Sales", "Research", "Health", "Fun"
];

const tabs = ["Prompts", "AI Images", "Automations"];

const mockPrompts = [
  {
    id: 1, type: "Prompt",
    title: "Ultimate Cold Email Generator",
    description: "Craft high-converting cold emails for any niche using proven psychological triggers and personalization.",
    category: "Sales", author: "Alex R.", avatar: "AR",
    likes: 1240, uses: 8430, price: 0, tags: ["email", "sales", "copywriting"],
    gradient: "from-violet-500 to-indigo-600",
    avatarBg: "bg-violet-100 text-violet-700"
  },
  {
    id: 2, type: "Automation",
    title: "LinkedIn Content Machine",
    description: "Generate a full month of LinkedIn posts from a single topic. Hooks, carousels, and thought leadership included.",
    category: "Marketing", author: "Sara M.", avatar: "SM",
    likes: 892, uses: 3210, price: 4.99, tags: ["linkedin", "content", "social"],
    gradient: "from-blue-500 to-cyan-500",
    avatarBg: "bg-blue-100 text-blue-700"
  },
  {
    id: 3, type: "Prompt",
    title: "AI Business Plan Builder",
    description: "Generate a full investor-ready business plan from just a one-line idea. Includes market analysis and financials.",
    category: "Business", author: "Karim D.", avatar: "KD",
    likes: 2100, uses: 12800, price: 9.99, tags: ["startup", "business", "plan"],
    gradient: "from-amber-400 to-orange-500",
    avatarBg: "bg-amber-100 text-amber-700"
  },
  {
    id: 4, type: "Prompt",
    title: "Code Review Assistant",
    description: "Paste any code and get a detailed review with bugs, security issues, performance tips, and refactoring suggestions.",
    category: "Development", author: "Lena K.", avatar: "LK",
    likes: 543, uses: 4900, price: 0, tags: ["code", "review", "dev"],
    gradient: "from-emerald-500 to-teal-500",
    avatarBg: "bg-emerald-100 text-emerald-700"
  },
  {
    id: 5, type: "AI Images",
    title: "Cinematic Product Shot",
    description: "Turn any product photo into a professional studio-quality cinematic shot. Works with Midjourney and DALL-E 3.",
    category: "Design", author: "Nina B.", avatar: "NB",
    likes: 3400, uses: 21000, price: 2.99, tags: ["image", "product", "midjourney"],
    gradient: "from-pink-500 to-rose-500",
    avatarBg: "bg-pink-100 text-pink-700"
  },
  {
    id: 6, type: "Prompt",
    title: "SEO Article Dominator",
    description: "Create fully optimized, human-sounding articles that rank on Google. Includes keyword density, meta, and internal linking.",
    category: "Marketing", author: "Tom H.", avatar: "TH",
    likes: 678, uses: 5600, price: 0, tags: ["seo", "writing", "marketing"],
    gradient: "from-cyan-500 to-blue-500",
    avatarBg: "bg-cyan-100 text-cyan-700"
  },
];

function Badge({ type }) {
  const styles = {
    Prompt: "bg-violet-100 text-violet-700",
    Automation: "bg-amber-100 text-amber-700",
    "AI Images": "bg-pink-100 text-pink-700",
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styles[type] || "bg-gray-100 text-gray-600"}`}>
      {type}
    </span>
  );
}

function PriceTag({ price }) {
  return price === 0
    ? <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Free</span>
    : <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">${price}</span>;
}

function PromptCard({ prompt, liked, onLike, onSave, saved }) {
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      <div className={`h-1.5 bg-gradient-to-r ${prompt.gradient}`} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex gap-1.5 flex-wrap">
            <Badge type={prompt.type} />
            <PriceTag price={prompt.price} />
          </div>
          <button
            onClick={() => onSave(prompt.id)}
            className={`text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0 ${saved ? "text-gray-600" : ""}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-violet-700 transition-colors">{prompt.title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{prompt.description}</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {prompt.tags.map(tag => (
            <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">#{tag}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center ${prompt.avatarBg}`}>
              {prompt.avatar}
            </div>
            <span className="text-xs text-gray-500">{prompt.author}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              {prompt.uses >= 1000 ? `${(prompt.uses/1000).toFixed(1)}k` : prompt.uses}
            </span>
            <button
              onClick={() => onLike(prompt.id)}
              className={`flex items-center gap-1 text-[11px] transition-colors ${liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {liked ? prompt.likes + 1 : prompt.likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState("Prompts");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [likedIds, setLikedIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [showSearch, setShowSearch] = useState(false);

  const toggleLike = (id) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSave = (id) => {
    setSavedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = mockPrompts.filter(p => {
    const matchTab = activeTab === "Prompts" ? p.type === "Prompt"
      : activeTab === "AI Images" ? p.type === "AI Images"
      : p.type === "Automation";
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-gray-900 text-sm hidden sm:block">Key Prompt</span>
          </div>
          {showSearch ? (
            <div className="flex-1 max-w-md flex items-center gap-2">
              <input
                autoFocus
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search prompts..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
              <button onClick={() => { setShowSearch(false); setSearch(""); }} className="text-gray-400 hover:text-gray-600 text-xs flex-shrink-0">Cancel</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setShowSearch(true)} className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>
              <button className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Submit
              </button>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
                A
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-violet-50 text-violet-700 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-violet-100">
            <span>✨</span> 50,000+ AI prompts shared
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 tracking-tight">
            The AI Prompt Marketplace
          </h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Discover, share, and sell the best AI prompts. Built by the community, for the community.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-4">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${activeTab === tab ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all border ${activeCategory === cat ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600"}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-gray-700">{filtered.length}</span> {activeTab.toLowerCase()} found
          </p>
          <select className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-600 outline-none focus:border-violet-400">
            <option>Newest</option>
            <option>Most used</option>
            <option>Top rated</option>
            <option>Price: Low</option>
          </select>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(p => (
              <PromptCard key={p.id} prompt={p} liked={likedIds.has(p.id)} saved={savedIds.has(p.id)} onLike={toggleLike} onSave={toggleSave} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm">No prompts found for this filter.</p>
            <button onClick={() => { setActiveCategory("All"); setSearch(""); }} className="mt-3 text-violet-600 text-sm font-medium hover:underline">
              Clear filters
            </button>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="text-center mt-8 mb-4">
            <button className="border border-gray-200 text-gray-600 text-sm font-medium px-6 py-2.5 rounded-xl hover:bg-gray-50 hover:border-violet-300 hover:text-violet-600 transition-all">
              Load more prompts
            </button>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex sm:hidden z-30">
        {[
          { icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", label: "Home", active: true },
          { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", label: "Search", active: false },
          { icon: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z", label: "Library", active: false },
          { icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", label: "Profile", active: false },
        ].map(({ icon, label, active }) => (
          <button key={label} className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 ${active ? "text-violet-600" : "text-gray-400"}`}>
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