import { useState, useRef, useEffect } from "react";

const ALL_PROMPTS = [
  { id: 1, title: "Ultimate Cold Email Generator", description: "Craft high-converting cold emails for any niche using proven psychological triggers.", category: "Sales", author: "Alex R.", avatar: "AR", avatarBg: "bg-violet-100 text-violet-700", likes: 1240, uses: 8430, price: 4.99, type: "Prompt", gradient: "from-violet-500 to-indigo-600", tags: ["email", "sales", "b2b"] },
  { id: 2, title: "LinkedIn Content Machine", description: "Generate a full month of LinkedIn posts from a single topic.", category: "Marketing", author: "Sara M.", avatar: "SM", avatarBg: "bg-blue-100 text-blue-700", likes: 892, uses: 3210, price: 0, type: "Automation", gradient: "from-blue-500 to-cyan-500", tags: ["linkedin", "content", "social"] },
  { id: 3, title: "AI Business Plan Builder", description: "Generate a full investor-ready business plan from just a one-line idea.", category: "Business", author: "Karim D.", avatar: "KD", avatarBg: "bg-amber-100 text-amber-700", likes: 2100, uses: 12800, price: 9.99, type: "Prompt", gradient: "from-amber-400 to-orange-500", tags: ["startup", "business", "plan"] },
  { id: 4, title: "Code Review Assistant", description: "Paste any code and get a detailed review with bugs and security issues.", category: "Development", author: "Lena K.", avatar: "LK", avatarBg: "bg-emerald-100 text-emerald-700", likes: 543, uses: 4900, price: 0, type: "Prompt", gradient: "from-emerald-500 to-teal-500", tags: ["code", "review", "dev"] },
  { id: 5, title: "Cinematic Product Shot", description: "Turn any product photo into a professional studio-quality cinematic shot.", category: "Design", author: "Nina B.", avatar: "NB", avatarBg: "bg-pink-100 text-pink-700", likes: 3400, uses: 21000, price: 2.99, type: "AI Image", gradient: "from-pink-500 to-rose-500", tags: ["image", "product", "midjourney"] },
  { id: 6, title: "SEO Article Dominator", description: "Create fully optimized articles that rank on Google with correct keyword density.", category: "Marketing", author: "Tom H.", avatar: "TH", avatarBg: "bg-cyan-100 text-cyan-700", likes: 678, uses: 5600, price: 0, type: "Prompt", gradient: "from-cyan-500 to-blue-500", tags: ["seo", "writing", "marketing"] },
  { id: 7, title: "Investor Pitch Deck Script", description: "Turn your startup idea into a compelling 10-slide pitch deck narrative.", category: "Business", author: "Alex R.", avatar: "AR", avatarBg: "bg-violet-100 text-violet-700", likes: 1560, uses: 7800, price: 14.99, type: "Prompt", gradient: "from-rose-500 to-pink-500", tags: ["pitch", "startup", "investor"] },
  { id: 8, title: "YouTube Script Generator", description: "Write engaging YouTube scripts that hook viewers in the first 30 seconds.", category: "Writing", author: "Marc L.", avatar: "ML", avatarBg: "bg-red-100 text-red-700", likes: 920, uses: 6100, price: 0, type: "Prompt", gradient: "from-red-500 to-orange-500", tags: ["youtube", "video", "script"] },
  { id: 9, title: "E-commerce Product Description", description: "Generate SEO-optimized product descriptions that convert browsers to buyers.", category: "Marketing", author: "Awad", avatar: "AW", avatarBg: "bg-indigo-100 text-indigo-700", likes: 340, uses: 1200, price: 4.99, type: "Prompt", gradient: "from-indigo-500 to-purple-500", tags: ["ecommerce", "product", "copy"] },
  { id: 10, title: "French Legal Contract Simplifier", description: "Translate complex French legal language into plain, easy-to-understand terms.", category: "Legal", author: "Awad", avatar: "AW", avatarBg: "bg-indigo-100 text-indigo-700", likes: 89, uses: 430, price: 2.99, type: "Prompt", gradient: "from-slate-500 to-gray-600", tags: ["legal", "french", "contract"] },
];

const CATEGORIES = ["All", "Sales", "Marketing", "Business", "Development", "Design", "Writing", "Legal"];
const SORT_OPTIONS = ["Most relevant", "Most used", "Top rated", "Newest", "Price: Low", "Price: High"];
const TRENDING = ["cold email", "business plan", "linkedin", "seo", "pitch deck", "code review"];

function highlight(text, query) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part)
      ? <mark key={i} className="bg-yellow-200 text-gray-900 rounded px-0.5">{part}</mark>
      : part
  );
}

function ResultCard({ prompt, query }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-gray-200 transition-all duration-200">
      <div className={`h-1 bg-gradient-to-r ${prompt.gradient}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{prompt.type}</span>
              <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{prompt.category}</span>
              {prompt.price === 0
                ? <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">Free</span>
                : <span className="text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">${prompt.price}</span>
              }
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
              {highlight(prompt.title, query)}
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
              {highlight(prompt.description, query)}
            </p>
          </div>
          <button onClick={() => setSaved(!saved)} className={`flex-shrink-0 p-1 rounded-lg transition-colors ${saved ? "text-indigo-500" : "text-gray-300 hover:text-gray-500"}`}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap gap-1 mt-2 mb-3">
          {prompt.tags.map(tag => (
            <span key={tag} className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md">#{tag}</span>
          ))}
        </div>

        <div className="flex items-center justify-between">
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
              {prompt.uses >= 1000 ? `${(prompt.uses / 1000).toFixed(1)}k` : prompt.uses}
            </span>
            <button onClick={() => setLiked(!liked)} className={`flex items-center gap-1 text-[11px] transition-colors ${liked ? "text-rose-500" : "text-gray-400 hover:text-rose-400"}`}>
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

export default function SearchResults() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("Most relevant");
  const [showFilters, setShowFilters] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all"); // all | free | paid
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSearch = () => {
    setSubmitted(query);
  };

  const handleTrending = (term) => {
    setQuery(term);
    setSubmitted(term);
  };

  const results = ALL_PROMPTS.filter(p => {
    const q = submitted.toLowerCase();
    const matchQuery = !q ||
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q)) ||
      p.category.toLowerCase().includes(q);
    const matchCat = category === "All" || p.category === category;
    const matchPrice = priceFilter === "all" || (priceFilter === "free" ? p.price === 0 : p.price > 0);
    return matchQuery && matchCat && matchPrice;
  }).sort((a, b) => {
    if (sort === "Most used") return b.uses - a.uses;
    if (sort === "Top rated") return b.likes - a.likes;
    if (sort === "Price: Low") return a.price - b.price;
    if (sort === "Price: High") return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Search header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-3">

          {/* Top row */}
          <div className="flex items-center gap-2 mb-3">
            <button className="text-gray-400 hover:text-gray-600 p-1 -ml-1 flex-shrink-0 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>

            {/* Search input */}
            <div className="flex-1 relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search prompts, categories, tags..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all placeholder-gray-400"
              />
              {query && (
                <button onClick={() => { setQuery(""); setSubmitted(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl hover:bg-indigo-700 active:scale-95 transition-all flex-shrink-0"
            >
              Search
            </button>
          </div>

          {/* Filter row */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border flex-shrink-0 transition-all ${
                showFilters ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              Filters {(category !== "All" || priceFilter !== "all") && <span className="bg-white text-indigo-600 rounded-full w-4 h-4 text-[9px] flex items-center justify-center font-black">{(category !== "All" ? 1 : 0) + (priceFilter !== "all" ? 1 : 0)}</span>}
            </button>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="flex-shrink-0 text-xs border border-gray-200 rounded-full px-3 py-1.5 bg-white text-gray-600 outline-none focus:border-indigo-400 font-semibold appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>

            {/* Category pills */}
            {CATEGORIES.slice(0, 5).map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  category === cat
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                }`}
              >{cat}</button>
            ))}
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Category</p>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        category === cat ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                      }`}
                    >{cat}</button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Price</p>
                <div className="flex gap-1.5">
                  {[["all", "All"], ["free", "Free only"], ["paid", "Paid only"]].map(([val, label]) => (
                    <button
                      key={val}
                      onClick={() => setPriceFilter(val)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                        priceFilter === val ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"
                      }`}
                    >{label}</button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setCategory("All"); setPriceFilter("all"); }}
                className="mt-3 text-xs text-indigo-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">

        {/* No query yet — show trending */}
        {!submitted ? (
          <div>
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5 text-orange-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                </svg>
                Trending searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map(term => (
                  <button
                    key={term}
                    onClick={() => handleTrending(term)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3 text-orange-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                    </svg>
                    {term}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Browse categories</p>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.slice(1).map((cat, i) => {
                const colors = ["bg-violet-50 border-violet-100 text-violet-700", "bg-blue-50 border-blue-100 text-blue-700", "bg-amber-50 border-amber-100 text-amber-700", "bg-emerald-50 border-emerald-100 text-emerald-700", "bg-pink-50 border-pink-100 text-pink-700", "bg-cyan-50 border-cyan-100 text-cyan-700", "bg-indigo-50 border-indigo-100 text-indigo-700"];
                return (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setSubmitted(" "); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold transition-all hover:shadow-sm ${colors[i % colors.length]}`}
                  >
                    {cat}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 opacity-50">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        ) : results.length > 0 ? (
          <>
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900">
                  {results.length} result{results.length !== 1 ? "s" : ""}
                </p>
                {submitted.trim() && (
                  <p className="text-xs text-gray-400 mt-0.5">for "<span className="text-indigo-600 font-medium">{submitted}</span>"</p>
                )}
              </div>
              {(category !== "All" || priceFilter !== "all") && (
                <button
                  onClick={() => { setCategory("All"); setPriceFilter("all"); }}
                  className="text-xs text-indigo-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear filters
                </button>
              )}
            </div>

            <div className="space-y-3 pb-24">
              {results.map(p => <ResultCard key={p.id} prompt={p} query={submitted} />)}
            </div>
          </>
        ) : (
          /* No results */
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-base font-bold text-gray-800 mb-2">No results found</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-xs">
              No prompts match "<span className="font-semibold text-gray-600">{submitted}</span>". Try a different keyword or browse categories.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {TRENDING.slice(0, 3).map(term => (
                <button key={term} onClick={() => handleTrending(term)} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Try "{term}"
                </button>
              ))}
            </div>
            <button onClick={() => { setQuery(""); setSubmitted(""); setCategory("All"); setPriceFilter("all"); }} className="mt-4 text-xs text-indigo-600 font-semibold hover:underline">
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex sm:hidden z-30">
        {[
          { icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", label: "Home", active: false },
          { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", label: "Search", active: true },
          { icon: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z", label: "Library", active: false },
          { icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", label: "Profile", active: false },
        ].map(({ icon, label, active }) => (
          <button key={label} className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 ${active ? "text-indigo-600" : "text-gray-400"}`}>
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