import { useState } from "react";

const savedPrompts = [
  { id: 1, title: "Ultimate Cold Email Generator", category: "Sales", author: "Alex R.", likes: 1240, uses: 8430, price: 0, type: "Prompt", gradient: "from-violet-500 to-indigo-600", savedAt: "2 days ago" },
  { id: 2, title: "LinkedIn Content Machine", category: "Marketing", author: "Sara M.", likes: 892, uses: 3210, price: 0, type: "Automation", gradient: "from-blue-500 to-cyan-500", savedAt: "5 days ago" },
  { id: 3, title: "SEO Article Dominator", category: "Marketing", author: "Tom H.", likes: 678, uses: 5600, price: 0, type: "Prompt", gradient: "from-cyan-500 to-blue-500", savedAt: "1 week ago" },
];

const purchasedPrompts = [
  { id: 4, title: "AI Business Plan Builder", category: "Business", author: "Karim D.", likes: 2100, uses: 12800, price: 9.99, type: "Prompt", gradient: "from-amber-400 to-orange-500", purchasedAt: "Jan 12, 2025", unlocked: true },
  { id: 5, title: "Investor Pitch Deck Script", category: "Business", author: "Alex R.", likes: 1560, uses: 7800, price: 14.99, type: "Prompt", gradient: "from-rose-500 to-pink-500", purchasedAt: "Jan 3, 2025", unlocked: true },
];

const myPrompts = [
  { id: 6, title: "French Copywriting Master", category: "Writing", likes: 340, uses: 1200, price: 0, type: "Prompt", gradient: "from-emerald-500 to-teal-500", status: "Published", createdAt: "2 weeks ago" },
  { id: 7, title: "E-commerce Product Description AI", category: "Marketing", likes: 89, uses: 430, price: 4.99, type: "Prompt", gradient: "from-indigo-500 to-purple-500", status: "Published", createdAt: "1 month ago" },
  { id: 8, title: "French Legal Contract Simplifier", category: "Legal", likes: 0, uses: 0, price: 2.99, type: "Prompt", gradient: "from-slate-500 to-gray-600", status: "Draft", createdAt: "3 days ago" },
];

const TABS = [
  { id: "saved", label: "Saved", icon: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z", count: savedPrompts.length },
  { id: "purchased", label: "Purchased", icon: "M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z", count: purchasedPrompts.length },
  { id: "mine", label: "My Prompts", icon: "M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z", count: myPrompts.length },
];

function EmptyState({ tab }) {
  const content = {
    saved: { icon: "🔖", title: "Nothing saved yet", desc: "Browse prompts and tap the bookmark icon to save them here." },
    purchased: { icon: "🛒", title: "No purchases yet", desc: "Buy premium prompts to unlock them and access them here anytime." },
    mine: { icon: "✍️", title: "You haven't published yet", desc: "Share your best prompts with the community and start earning." },
  };
  const { icon, title, desc } = content[tab];
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-base font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed max-w-xs">{desc}</p>
      <button className="mt-5 bg-amber-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-amber-600 transition-colors">
        {tab === "mine" ? "Submit a prompt" : "Browse prompts"}
      </button>
    </div>
  );
}

function SavedCard({ prompt, onRemove }) {
  return (
    <div className="group bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-md hover:border-stone-200 transition-all">
      <div className={`h-1 bg-gradient-to-r ${prompt.gradient}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex gap-1.5 mb-1.5 flex-wrap">
              <span className="text-[10px] font-semibold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{prompt.type}</span>
              <span className="text-[10px] font-semibold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{prompt.category}</span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{prompt.title}</h3>
            <p className="text-xs text-gray-400">by {prompt.author} · saved {prompt.savedAt}</p>
          </div>
          <button
            onClick={() => onRemove(prompt.id)}
            className="text-amber-400 flex-shrink-0 hover:text-amber-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-stone-50">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {prompt.likes.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            {prompt.uses.toLocaleString()} uses
          </span>
          <button className="ml-auto text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors">
            Use prompt →
          </button>
        </div>
      </div>
    </div>
  );
}

function PurchasedCard({ prompt }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
      <div className={`h-1 bg-gradient-to-r ${prompt.gradient}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex gap-1.5 mb-1.5 flex-wrap">
              <span className="text-[10px] font-semibold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{prompt.type}</span>
              <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Unlocked
              </span>
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{prompt.title}</h3>
            <p className="text-xs text-gray-400">Purchased {prompt.purchasedAt} · ${prompt.price}</p>
          </div>
          <div className="text-2xl flex-shrink-0">🔓</div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-colors">
            View prompt
          </button>
          <button
            onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
              copied ? "bg-emerald-100 text-emerald-700 border border-emerald-200" : "bg-stone-100 text-stone-600 border border-stone-200 hover:bg-stone-200"
            }`}
          >
            {copied ? "Copied ✓" : "Copy prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MyPromptCard({ prompt, onDelete }) {
  return (
    <div className="bg-white border border-stone-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
      <div className={`h-1 bg-gradient-to-r ${prompt.gradient}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex gap-1.5 mb-1.5 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                prompt.status === "Published"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-amber-100 text-amber-600"
              }`}>{prompt.status}</span>
              <span className="text-[10px] font-semibold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">{prompt.category}</span>
              {prompt.price === 0
                ? <span className="text-[10px] font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Free</span>
                : <span className="text-[10px] font-semibold bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">${prompt.price}</span>
              }
            </div>
            <h3 className="text-sm font-bold text-gray-900 leading-snug mb-1">{prompt.title}</h3>
            <p className="text-xs text-gray-400">Created {prompt.createdAt}</p>
          </div>
        </div>
        {prompt.status === "Published" && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-stone-50">
            <div className="flex-1 bg-stone-50 rounded-xl p-2.5 text-center">
              <p className="text-sm font-black text-gray-800">{prompt.likes}</p>
              <p className="text-[10px] text-gray-400">Likes</p>
            </div>
            <div className="flex-1 bg-stone-50 rounded-xl p-2.5 text-center">
              <p className="text-sm font-black text-gray-800">{prompt.uses.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">Uses</p>
            </div>
            <div className="flex-1 bg-stone-50 rounded-xl p-2.5 text-center">
              <p className="text-sm font-black text-gray-800">{prompt.price === 0 ? "—" : `$${(prompt.uses * prompt.price * 0.8).toFixed(0)}`}</p>
              <p className="text-[10px] text-gray-400">Earned</p>
            </div>
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-2 rounded-xl text-xs font-semibold bg-stone-100 text-stone-600 hover:bg-stone-200 transition-colors">
            Edit
          </button>
          {prompt.status === "Draft" && (
            <button className="flex-1 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors">
              Publish
            </button>
          )}
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-2 rounded-xl text-gray-300 hover:text-rose-400 hover:bg-rose-50 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyLibrary() {
  const [activeTab, setActiveTab] = useState("saved");
  const [saved, setSaved] = useState(savedPrompts);
  const [mine, setMine] = useState(myPrompts);

  const removeSaved = (id) => setSaved(s => s.filter(p => p.id !== id));
  const deleteMine = (id) => setMine(m => m.filter(p => p.id !== id));

  const totalEarned = mine
    .filter(p => p.price > 0 && p.status === "Published")
    .reduce((sum, p) => sum + p.uses * p.price * 0.8, 0);

  return (
    <div className="min-h-screen bg-stone-50 font-sans">

      {/* Nav */}
      <nav className="bg-white border-b border-stone-100 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm text-gray-900">My Library</span>
          </div>
          <button className="text-stone-400 hover:text-stone-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5">

        {/* Earnings banner — show only on my prompts tab */}
        {activeTab === "mine" && totalEarned > 0 && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 mb-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💰</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-100 font-medium mb-0.5">Total earnings</p>
              <p className="text-2xl font-black text-white">${totalEarned.toFixed(2)}</p>
              <p className="text-xs text-amber-100 mt-0.5">From {mine.filter(p => p.price > 0).length} paid prompts</p>
            </div>
            <button className="bg-white text-amber-600 text-xs font-bold px-3 py-2 rounded-xl hover:bg-amber-50 transition-colors flex-shrink-0">
              Withdraw
            </button>
          </div>
        )}

        {/* User summary */}
        <div className="flex items-center gap-3 bg-white border border-stone-100 rounded-2xl p-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            AW
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900">Awad</p>
            <p className="text-xs text-gray-400 truncate">dj55166@gmail.com</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">{saved.length + purchasedPrompts.length + mine.length} items</p>
            <p className="text-xs text-amber-500 font-semibold">in library</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white border border-stone-100 p-1 rounded-2xl mb-5 gap-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-amber-500 text-white shadow-md shadow-amber-200"
                  : "text-stone-400 hover:text-stone-600"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} />
              </svg>
              <span>{tab.label}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab.id ? "bg-white/20 text-white" : "bg-stone-100 text-stone-500"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-3 pb-24">

          {activeTab === "saved" && (
            saved.length > 0
              ? saved.map(p => <SavedCard key={p.id} prompt={p} onRemove={removeSaved} />)
              : <EmptyState tab="saved" />
          )}

          {activeTab === "purchased" && (
            purchasedPrompts.length > 0
              ? purchasedPrompts.map(p => <PurchasedCard key={p.id} prompt={p} />)
              : <EmptyState tab="purchased" />
          )}

          {activeTab === "mine" && (
            mine.length > 0 ? (
              <>
                <button className="w-full py-3 rounded-2xl border-2 border-dashed border-amber-300 text-amber-600 text-xs font-bold hover:bg-amber-50 transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  Submit a new prompt
                </button>
                {mine.map(p => <MyPromptCard key={p.id} prompt={p} onDelete={deleteMine} />)}
              </>
            ) : <EmptyState tab="mine" />
          )}

        </div>
      </div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex sm:hidden z-30">
        {[
          { icon: "M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25", label: "Home", active: false },
          { icon: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z", label: "Search", active: false },
          { icon: "M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z", label: "Library", active: true },
          { icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z", label: "Profile", active: false },
        ].map(({ icon, label, active }) => (
          <button key={label} className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 ${active ? "text-amber-500" : "text-stone-400"}`}>
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