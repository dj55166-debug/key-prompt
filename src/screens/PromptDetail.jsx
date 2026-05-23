import { useState } from "react";

const prompt = {
  id: 1,
  title: "Ultimate Cold Email Generator",
  description: "Craft high-converting cold emails for any niche using proven psychological triggers and deep personalization techniques. This prompt has been tested across 200+ industries with an average reply rate of 34%.",
  content: `You are an expert cold email copywriter with 10 years of experience. Write a cold email for the following context:

Industry: [INDUSTRY]
Target: [TARGET_ROLE] at [COMPANY_NAME]
My product/service: [YOUR_OFFER]
Pain point to address: [PAIN_POINT]
Desired action: [CTA]

Guidelines:
- Subject line: under 8 words, curiosity-driven
- Opening: reference something specific about their company
- Body: 3 sentences max — problem, solution, proof
- CTA: one single low-friction ask
- Tone: confident but not salesy
- No buzzwords, no generic phrases`,
  category: "Sales",
  type: "Prompt",
  tags: ["email", "sales", "copywriting", "cold outreach", "B2B"],
  price: 4.99,
  author: { name: "Alex Rivera", avatar: "AR", role: "Growth Marketer", prompts: 34, followers: 1240 },
  likes: 1240, uses: 8430, remixes: 89,
  rating: 4.8, reviews: 312,
  model: "ChatGPT, Claude, Gemini",
  createdAt: "March 12, 2025",
  comments: [
    { id: 1, user: "Sara M.", avatar: "SM", text: "Used this for a SaaS outreach campaign — got 3 meetings in the first week. Incredible prompt!", time: "2 days ago", likes: 24 },
    { id: 2, user: "Karim D.", avatar: "KD", text: "The structure is really clean. I tweaked the tone for a French audience and it worked perfectly.", time: "5 days ago", likes: 11 },
    { id: 3, user: "Lena K.", avatar: "LK", text: "Best cold email prompt I've found anywhere. Worth every cent.", time: "1 week ago", likes: 18 },
  ]
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? "currentColor" : "none"}
          stroke="currentColor" strokeWidth="1.5"
          className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? "text-amber-400" : "text-gray-300"}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initials, color = "violet" }) {
  const colors = {
    violet: "bg-violet-100 text-violet-700",
    blue: "bg-blue-100 text-blue-700",
    amber: "bg-amber-100 text-amber-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return (
    <div className={`rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${colors[color]}`}
      style={{ width: 32, height: 32 }}>
      {initials}
    </div>
  );
}

export default function PromptDetail() {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [purchased, setPurchased] = useState(false);
  const [comment, setComment] = useState("");
  const [showFull, setShowFull] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = () => setPurchased(true);

  const previewContent = prompt.content.slice(0, 120) + "...";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Top nav */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-700 transition-colors p-1 -ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm text-gray-900">Key Prompt</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSaved(!saved)}
              className={`p-2 rounded-xl transition-all ${saved ? "bg-violet-50 text-violet-600" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </button>
            <button className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-5">

        {/* Header card */}
        <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden mb-4">
          <div className="h-1.5 bg-gradient-to-r from-violet-500 via-indigo-500 to-blue-500" />
          <div className="p-5">
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full">{prompt.type}</span>
              <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{prompt.category}</span>
              <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                {prompt.model}
              </span>
            </div>

            <h1 className="text-xl font-black text-gray-900 mb-2 leading-tight">{prompt.title}</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">{prompt.description}</p>

            {/* Stats row */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {(prompt.uses / 1000).toFixed(1)}k uses
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
                {prompt.remixes} remixes
              </span>
              <div className="flex items-center gap-1">
                <StarRating rating={prompt.rating} />
                <span className="font-medium text-gray-600">{prompt.rating}</span>
                <span>({prompt.reviews})</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  liked
                    ? "bg-rose-50 border-rose-200 text-rose-600"
                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-rose-200 hover:text-rose-500"
                }`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {liked ? prompt.likes + 1 : prompt.likes}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-500 hover:border-indigo-200 hover:text-indigo-600 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
                Remix
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 p-1 rounded-xl mb-4">
          {["overview", "prompt", "comments"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? "bg-violet-600 text-white" : "text-gray-500 hover:text-gray-700"
              }`}>
              {tab} {tab === "comments" && `(${prompt.comments.length})`}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Creator card */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Creator</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-sm font-black">
                    {prompt.author.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{prompt.author.name}</p>
                    <p className="text-xs text-gray-500">{prompt.author.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{prompt.author.followers.toLocaleString()} followers</p>
                  <p className="text-xs text-gray-400">{prompt.author.prompts} prompts</p>
                </div>
              </div>
              <button className="mt-3 w-full py-2 rounded-xl text-xs font-semibold border border-violet-200 text-violet-600 hover:bg-violet-50 transition-colors">
                Follow {prompt.author.name.split(" ")[0]}
              </button>
            </div>

            {/* Tags */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map(tag => (
                  <span key={tag} className="text-xs text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1 rounded-full">#{tag}</span>
                ))}
              </div>
            </div>

            {/* Info grid */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Details</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Published", value: prompt.createdAt },
                  { label: "Works with", value: "ChatGPT, Claude" },
                  { label: "Category", value: prompt.category },
                  { label: "Type", value: prompt.type },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-medium mb-1">{label}</p>
                    <p className="text-xs font-semibold text-gray-700">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Prompt */}
        {activeTab === "prompt" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-700">Prompt Content</p>
                {purchased ? (
                  <button onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      copied ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700"
                    }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                    </svg>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                    Locked
                  </span>
                )}
              </div>
              <div className="p-4 relative">
                <pre className={`text-xs text-gray-600 leading-relaxed whitespace-pre-wrap font-mono ${!purchased ? "select-none" : ""}`}>
                  {purchased ? prompt.content : previewContent}
                </pre>
                {!purchased && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent rounded-b-2xl flex items-end justify-center pb-4">
                    <span className="text-xs text-gray-400 font-medium">Purchase to reveal full prompt</span>
                  </div>
                )}
              </div>
            </div>

            {/* Buy / already purchased */}
            {!purchased ? (
              <div className="bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-black text-gray-900">${prompt.price}</p>
                    <p className="text-xs text-gray-400 mt-0.5">One-time purchase · instant access</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <StarRating rating={prompt.rating} />
                      <span className="text-xs font-semibold text-gray-700">{prompt.rating}</span>
                    </div>
                    <p className="text-xs text-gray-400">{prompt.reviews} reviews</p>
                  </div>
                </div>
                <button onClick={handleBuy}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm">
                  Buy for ${prompt.price}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2">Secure payment via Stripe · Instant access</p>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-emerald-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Purchased! Full prompt unlocked.</p>
                  <p className="text-xs text-emerald-600">Saved to your library automatically.</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Comments */}
        {activeTab === "comments" && (
          <div className="space-y-3">
            {prompt.comments.map(c => (
              <div key={c.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Avatar initials={c.avatar} color={c.id === 1 ? "violet" : c.id === 2 ? "amber" : "blue"} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-semibold text-gray-900">{c.user}</p>
                      <p className="text-[10px] text-gray-400 flex-shrink-0">{c.time}</p>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{c.text}</p>
                    <button className="mt-2 flex items-center gap-1 text-[10px] text-gray-400 hover:text-rose-500 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                      {c.likes}
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Add comment */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-700 mb-3">Add a comment</p>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this prompt..."
                rows={3}
                className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none placeholder-gray-400"
              />
              <button
                disabled={!comment.trim()}
                className="mt-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                Post Comment
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}