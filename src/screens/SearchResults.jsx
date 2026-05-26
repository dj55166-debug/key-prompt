import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

const CATEGORIES = ["All", "AI", "Business", "Marketing", "Design", "Development", "Productivity", "Writing", "Sales", "Research", "Health", "Fun"];
const TYPES = ["All types", "Prompt", "AI Image", "AI Video", "Automation"];
const TRENDING = ["cold email", "business plan", "cinematic", "tiktok", "midjourney", "kling", "wallpaper", "cartoon"];

function Badge({ type }) {
  const styles = { Prompt: "bg-violet-100 text-violet-700", Automation: "bg-amber-100 text-amber-700", "AI Image": "bg-pink-100 text-pink-700", "AI Video": "bg-blue-100 text-blue-700" };
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${styles[type] || "bg-gray-100 text-gray-600"}`}>{type}</span>;
}

function ResultCard({ prompt, onClick }) {
  const [saved, setSaved] = useState(false);
  const username = prompt.author?.username || "Creator";
  const initials = username.slice(0, 2).toUpperCase();
  return (
    <div onClick={onClick} className="group bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer p-4">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex gap-1.5 mb-2 flex-wrap">
            <Badge type={prompt.type} />
            <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{prompt.category}</span>
            {parseFloat(prompt.price) === 0
              ? <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Free</span>
              : <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded-full">${parseFloat(prompt.price).toFixed(2)}</span>}
          </div>
          <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-indigo-700 transition-colors line-clamp-1">{prompt.title}</h3>
          <p className="text-xs text-slate-400 line-clamp-2">{prompt.description}</p>
        </div>
        <button onClick={e => { e.stopPropagation(); setSaved(!saved); }}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-all ${saved ? "text-indigo-500 bg-indigo-50" : "text-slate-300 hover:text-slate-500"}`}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50">
        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[9px] font-bold text-indigo-700">{initials}</div>
        <span className="text-xs text-slate-400">{username}</span>
        <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {prompt.likes_count || 0}
        </span>
        <span className="text-xs font-bold text-indigo-600">View →</span>
      </div>
    </div>
  );
}

export default function SearchResults() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All types");
  const [priceFilter, setPriceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState([]);
  const [allPrompts, setAllPrompts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { inputRef.current?.focus(); fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("prompts")
      .select("*, author:profiles(id, username, full_name)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    setAllPrompts(data || []);
    setResults(data || []);
    setLoading(false);
  };

  const handleSearch = (q = query) => {
    const sq = q.trim().toLowerCase();
    setActiveQuery(sq);
    let filtered = allPrompts;
    if (sq) filtered = filtered.filter(p => p.title.toLowerCase().includes(sq) || p.description.toLowerCase().includes(sq) || (p.tags || []).some(t => t.toLowerCase().includes(sq)));
    if (category !== "All") filtered = filtered.filter(p => p.category === category);
    if (type !== "All types") filtered = filtered.filter(p => p.type === type);
    if (priceFilter === "free") filtered = filtered.filter(p => parseFloat(p.price) === 0);
    if (priceFilter === "paid") filtered = filtered.filter(p => parseFloat(p.price) > 0);
    setResults(filtered);
  };

  useEffect(() => { if (allPrompts.length > 0) handleSearch(query); }, [category, type, priceFilter, allPrompts]);

  const hasFilters = category !== "All" || type !== "All types" || priceFilter !== "all";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-slate-600 p-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search 170+ prompts..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder-slate-400" />
              {query && <button onClick={() => { setQuery(""); setActiveQuery(""); setResults(allPrompts); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>}
            </div>
            <button onClick={() => handleSearch()} className="bg-indigo-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-indigo-700 flex-shrink-0">Search</button>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold flex-shrink-0 ${showFilters || hasFilters ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200"}`}>
              Filters {hasFilters && "●"}
            </button>
            {CATEGORIES.slice(1).map(cat => (
              <button key={cat} onClick={() => setCategory(category === cat ? "All" : cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${category === cat ? "bg-indigo-100 text-indigo-700 border-indigo-200" : "bg-white text-slate-500 border-slate-200"}`}>{cat}</button>
            ))}
          </div>
        </div>
        {showFilters && (
          <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 max-w-lg mx-auto">
            <div className="flex justify-between mb-3">
              <p className="text-xs font-bold text-slate-600 uppercase">Filter</p>
              {hasFilters && <button onClick={() => { setCategory("All"); setType("All types"); setPriceFilter("all"); }} className="text-xs text-indigo-600 font-semibold">Clear all</button>}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 font-semibold mb-1.5">TYPE</p>
                <div className="flex gap-2 flex-wrap">
                  {TYPES.map(t => <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${type === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200"}`}>{t}</button>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold mb-1.5">PRICE</p>
                <div className="flex gap-2">
                  {[["all","All"],["free","Free"],["paid","Paid"]].map(([v,l]) => <button key={v} onClick={() => setPriceFilter(v)} className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${priceFilter === v ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-500 border-slate-200"}`}>{l}</button>)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {!activeQuery && (
          <div className="mb-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-3">🔥 Trending</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING.map(term => (
                <button key={term} onClick={() => { setQuery(term); handleSearch(term); }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-600 hover:border-indigo-300 hover:text-indigo-700 transition-all">{term}</button>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-slate-800">
            {activeQuery ? <>{results.length} results for <span className="text-indigo-600">"{activeQuery}"</span></> : <>{results.length} prompts</>}
          </p>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3 pb-24">
            {results.map(p => <ResultCard key={p.id} prompt={p} onClick={() => navigate(`/prompt/${p.id}`)} />)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-base font-bold text-slate-700 mb-2">No results</h3>
            <button onClick={() => { setActiveQuery(""); setQuery(""); setCategory("All"); setType("All types"); setPriceFilter("all"); setResults(allPrompts); }}
              className="mt-3 bg-indigo-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl">Clear search</button>
          </div>
        )}
      </div>
    </div>
  );
}