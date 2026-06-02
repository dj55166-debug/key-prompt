import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { CATEGORIES, TOOL_IDS, TRENDING_TERMS } from '../lib/constants'
import PromptCard from '../components/PromptCard'
import BottomNav from '../components/BottomNav'

export default function SearchResults({ user }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const inputRef = useRef(null)

  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [tool, setTool] = useState('All')
  const [priceFilter, setPriceFilter] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [results, setResults] = useState([])
  const [allPrompts, setAllPrompts] = useState([])
  const [likedIds, setLikedIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    inputRef.current?.focus()
    fetchAll()
  }, [])

  useEffect(() => {
    if (user && allPrompts.length > 0) loadUserInteractions()
  }, [user, allPrompts])

  const fetchAll = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('prompts')
      .select('*, author:profiles(id, username, full_name, avatar_url)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    setAllPrompts(data || [])
    setResults(data || [])
    setLoading(false)
  }

  const loadUserInteractions = async () => {
    const ids = allPrompts.map(p => p.id)
    if (!ids.length) return
    const [likesRes, savedRes] = await Promise.all([
      supabase.from('likes').select('prompt_id').eq('user_id', user.id).in('prompt_id', ids),
      supabase.from('saves').select('prompt_id').eq('user_id', user.id).in('prompt_id', ids),
    ])
    setLikedIds(new Set((likesRes.data || []).map(r => r.prompt_id)))
    setSavedIds(new Set((savedRes.data || []).map(r => r.prompt_id)))
  }

  const applyFilters = (q = query, cat = category, t2 = tool, price = priceFilter) => {
    const sq = q.trim().toLowerCase()
    setActiveQuery(sq)
    let filtered = allPrompts
    if (sq) {
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(sq) ||
        p.description?.toLowerCase().includes(sq) ||
        (p.tags || []).some(tag => tag.toLowerCase().includes(sq))
      )
    }
    if (cat !== 'All') filtered = filtered.filter(p => p.category === cat)
    if (t2 !== 'All') filtered = filtered.filter(p => (p.ai_models || []).includes(t2))
    if (price === 'free') filtered = filtered.filter(p => parseFloat(p.price) === 0)
    if (price === 'paid') filtered = filtered.filter(p => parseFloat(p.price) > 0)
    setResults(filtered)
  }

  useEffect(() => {
    if (allPrompts.length > 0) applyFilters(query, category, tool, priceFilter)
  }, [category, tool, priceFilter, allPrompts])

  const handleLike = async (promptId) => {
    if (!user) { navigate('/login'); return }
    const liked = likedIds.has(promptId)
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('prompt_id', promptId)
      setLikedIds(s => { const n = new Set(s); n.delete(promptId); return n })
    } else {
      await supabase.from('likes').insert({ user_id: user.id, prompt_id: promptId })
      setLikedIds(s => new Set([...s, promptId]))
    }
  }

  const handleSave = async (promptId) => {
    if (!user) { navigate('/login'); return }
    const saved = savedIds.has(promptId)
    if (saved) {
      await supabase.from('saves').delete().eq('user_id', user.id).eq('prompt_id', promptId)
      setSavedIds(s => { const n = new Set(s); n.delete(promptId); return n })
    } else {
      await supabase.from('saves').insert({ user_id: user.id, prompt_id: promptId })
      setSavedIds(s => new Set([...s, promptId]))
    }
  }

  const clearAll = () => {
    setQuery('')
    setActiveQuery('')
    setCategory('All')
    setTool('All')
    setPriceFilter('all')
    setResults(allPrompts)
  }

  const hasFilters = category !== 'All' || tool !== 'All' || priceFilter !== 'all'

  return (
    <div className="min-h-screen bg-gray-950 font-sans pb-20">

      {/* Search header */}
      <div className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-2 mb-3">
            <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-300 p-1 flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <div className="relative flex-1">
              <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && applyFilters()}
                placeholder={t('search.placeholder')}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl ps-9 pe-9 py-2.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); applyFilters('') }}
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <button
              onClick={() => applyFilters()}
              className="bg-violet-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-violet-500 flex-shrink-0"
            >
              {t('search.search')}
            </button>
          </div>

          {/* Filter toggle + category pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold flex-shrink-0 transition-all ${
                showFilters || hasFilters
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
              </svg>
              {t('search.filters')}
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
            </button>
            {CATEGORIES.slice(1).map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(category === cat.id ? 'All' : cat.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                  category === cat.id
                    ? 'bg-violet-600 text-white border-violet-600'
                    : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500'
                }`}
              >
                {t(cat.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Expanded filters */}
        {showFilters && (
          <div className="border-t border-gray-800 bg-gray-900 px-4 py-3 max-w-lg mx-auto">
            <div className="flex justify-between mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{t('search.filterTitle')}</p>
              {hasFilters && (
                <button onClick={clearAll} className="text-xs text-violet-400 font-semibold">
                  {t('search.clearAll')}
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1.5">{t('search.tool')}</p>
                <div className="flex gap-2 flex-wrap">
                  {['All', ...TOOL_IDS].map(toolId => (
                    <button
                      key={toolId}
                      onClick={() => setTool(toolId)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        tool === toolId
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {toolId === 'All' ? t('search.allTools') : toolId}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1.5">{t('search.price')}</p>
                <div className="flex gap-2">
                  {[['all', t('search.priceAll')], ['free', t('search.priceFree')], ['paid', t('search.pricePaid')]].map(([v, label]) => (
                    <button
                      key={v}
                      onClick={() => setPriceFilter(v)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                        priceFilter === v
                          ? 'bg-violet-600 text-white border-violet-600'
                          : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">

        {/* Trending */}
        {!activeQuery && (
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">{t('search.trending')}</p>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TERMS.map(term => (
                <button
                  key={term}
                  onClick={() => { setQuery(term); applyFilters(term) }}
                  className="px-3 py-2 bg-gray-900 border border-gray-700 rounded-xl text-xs font-medium text-gray-400 hover:border-violet-500/50 hover:text-violet-400 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-white">
            {activeQuery ? (
              <>{results.length} {t('search.resultsFor')} <span className="text-violet-400">"{activeQuery}"</span></>
            ) : (
              <>{results.length} {t('search.prompts')}</>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {results.map(p => (
              <PromptCard
                key={p.id}
                prompt={p}
                liked={likedIds.has(p.id)}
                saved={savedIds.has(p.id)}
                onLike={handleLike}
                onSave={handleSave}
                onClick={() => navigate(`/prompt/${p.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm mb-3">{t('search.noResults')}</p>
            <button onClick={clearAll} className="bg-violet-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-violet-500">
              {t('search.clearSearch')}
            </button>
          </div>
        )}
      </div>

      <BottomNav user={user} />
    </div>
  )
}
