import { useTranslation } from 'react-i18next'
import { TOOL_COLORS, CATEGORY_GRADIENTS, DEFAULT_GRADIENT } from '../lib/constants'

function ToolBadge({ tool }) {
  const color = TOOL_COLORS[tool] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  return (
    <span className={`text-[10px] font-black px-2 py-1 rounded-full border backdrop-blur-sm ${color}`}>
      {tool}
    </span>
  )
}

export default function PromptCard({ prompt, liked, saved, onLike, onSave, onClick }) {
  const { t } = useTranslation()
  const gradient = CATEGORY_GRADIENTS[prompt.category] || DEFAULT_GRADIENT
  const username = prompt.author?.username || prompt.author?.full_name || 'Creator'
  const initials = username.slice(0, 2).toUpperCase()
  const tools = prompt.ai_models || []
  const primaryTool = tools[0]
  const isFree = parseFloat(prompt.price) === 0

  return (
    <div
      onClick={onClick}
      className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Thumbnail / banner */}
      <div className={`relative h-36 bg-gradient-to-br ${gradient} overflow-hidden flex-shrink-0`}>
        {prompt.thumbnail_url ? (
          <img
            src={prompt.thumbnail_url}
            alt={prompt.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-3">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-10 h-10 opacity-25 drop-shadow-lg">
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm14.024-.983a1.125 1.125 0 010 1.966l-5.603 3.113A1.125 1.125 0 019 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113z" clipRule="evenodd" />
            </svg>
            {prompt.category && (
              <span className="text-[9px] font-bold text-white/40 tracking-widest uppercase text-center leading-tight">
                {prompt.category}
              </span>
            )}
          </div>
        )}

        {/* Tool badge top-left */}
        <div className="absolute top-2 start-2 flex gap-1 flex-wrap">
          {primaryTool && <ToolBadge tool={primaryTool} />}
        </div>

        {/* Save button top-right */}
        <button
          onClick={e => { e.stopPropagation(); onSave(prompt.id) }}
          className={`absolute top-2 end-2 p-1.5 rounded-lg backdrop-blur-sm transition-all ${
            saved ? 'bg-violet-600/90 text-white' : 'bg-black/40 text-gray-400 hover:bg-black/70 hover:text-white'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </button>

        {/* Price badge bottom-right */}
        <div className="absolute bottom-2 end-2">
          {isFree
            ? <span className="text-[10px] font-bold bg-emerald-500/80 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">{t('common.free')}</span>
            : <span className="text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm">${parseFloat(prompt.price).toFixed(2)}</span>
          }
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-white text-sm leading-snug line-clamp-2 group-hover:text-violet-300 transition-colors">
          {prompt.title}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-1">{prompt.description}</p>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800">
          {/* Creator */}
          <div className="flex items-center gap-1.5 min-w-0">
            <div className="w-5 h-5 rounded-full bg-violet-900/60 text-violet-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <span className="text-xs text-gray-500 truncate">{username}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[11px] text-gray-600 flex items-center gap-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
              </svg>
              {prompt.sales_count || 0}
            </span>
            <button
              onClick={e => { e.stopPropagation(); onLike(prompt.id) }}
              className={`flex items-center gap-0.5 text-[11px] transition-colors ${liked ? 'text-rose-400' : 'text-gray-600 hover:text-rose-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {liked ? (prompt.likes_count || 0) + 1 : (prompt.likes_count || 0)}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
