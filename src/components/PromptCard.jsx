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

  // Fix: use preview_url first, fall back to thumbnail_url
  const mediaSrc = prompt.preview_url || prompt.thumbnail_url
  const isVideo = mediaSrc && /\.(mp4|webm|mov)$/i.test(mediaSrc)

  return (
    <div
      onClick={onClick}
      className="group bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Thumbnail / banner */}
      <div className={`relative h-36 bg-gradient-to-br ${gradient} overflow-hidden flex-shrink-0`}>
        {mediaSrc ? (
          isVideo ? (
            <video
              src={mediaSrc}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
            />
          ) : (
            <img
              src={mediaSrc}
              alt={prompt.title}
              className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
              onError={e => { e.currentTarget.style.display = 'none' }}
            />
          )
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
        </button>

        {/* Price badge bottom-right */}
        {!isFree && (
          <div className="absolute bottom-2 end-2 bg-black/70 backdrop-blur-sm text-white text-[11px] font-black px-2 py-0.5 rounded-lg">
            ${parseFloat(prompt.price).toFixed(2)}
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        <h3 className="text-sm font-bold text-white leading-snug line-clamp-2">{prompt.title}</h3>
        {prompt.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{prompt.description}</p>
        )}

        {/* Author row */}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex items-center gap-1.5">
            {prompt.author?.avatar_url ? (
              <img src={prompt.author.avatar_url} alt={username} className="w-5 h-5 rounded-full object-cover" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">{initials}</span>
              </div>
            )}
            <span className="text-xs text-gray-500 font-medium">{username}</span>
          </div>
          <div className="flex items-center gap-2.5 text-gray-600">
            <span className="flex items-center gap-0.5 text-[11px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
              </svg>
              {prompt.comments_count ?? 0}
            </span>
            <span className="flex items-center gap-0.5 text-[11px]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {prompt.likes_count ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
