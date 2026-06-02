import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../lib/constants'
import PromptCard from '../components/PromptCard'
import BottomNav from '../components/BottomNav'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function HomeScreen({ user }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [activeCategory, setActiveCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [search, setSearch] = useState('')
  const [allPrompts, setAllPrompts] = useState([])
  const [promptCount, setPromptCount] = useState(0)
  const [likedIds, setLikedIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showMenu, setShowMenu] = useState(false)

  // Load ALL published prompts once on mount — no per-keystroke refetches
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fast count query for the hero badge — resolves before full data
        supabase
          .from('prompts')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true)
          .then(({ count }) => { if (count != null) setPromptCount(count) })
          .catch(() => {})

        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timed out after 8 seconds — check network or Supabase config')), 8000)
        )
        const { data, error: err } = await Promise.race([
          supabase
            .from('prompts')
            .select('*, author:profiles(id, username, full_name, avatar_url)')
            .eq('is_published', true)
            .order('created_at', { ascending: false }),
          timeoutPromise,
        ])
        if (err) { console.error('[HomeScreen] query error:', err.message); setError(err.message) }
        else {
          console.log('[HomeScreen] loaded', data?.length, 'prompts')
          setAllPrompts(data || [])
          setPromptCount(data?.length || 0)
        }
      } catch (e) {
        console.error('[HomeScreen] fetch failed:', e?.message)
        setError(e?.message || 'Failed to load prompts')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    if (user && allPrompts.length > 0) loadUserInteractions()
  }, [user, allPrompts])

  // All filtering and sorting happens client-side — no race conditions
  const filteredPrompts = useMemo(() => {
    let results = [...allPrompts]

    if (activeCategory && activeCategory !== 'All') {
      results = results.filter(p => p.category === activeCategory)
    }

    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase()
      results = results.filter(p =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      )
    }

    if (sort === 'mostUsed') {
      results.sort((a, b) => (b.uses_count || 0) - (a.uses_count || 0))
    } else if (sort === 'priceLow') {
      results.sort((a, b) => (a.price || 0) - (b.price || 0))
    } else {
      results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    return results
  }, [allPrompts, activeCategory, search, sort])

  const loadUserInteractions = async () => {
    if (!user) return
    const ids = allPrompts.map(p => p.id)
    if (!ids.length) return
    const [likesRes, savedRes] = await Promise.all([
      supabase.from('likes').select('prompt_id').eq('user_id', user.id).in('prompt_id', ids),
      supabase.from('saves').select('prompt_id').eq('user_id', user.id).in('prompt_id', ids),
    ])
    setLikedIds(new Set((likesRes.data || []).map(r => r.prompt_id)))
    setSavedIds(new Set((savedRes.data || []).map(r => r.prompt_id)))
  }

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

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 font-sans pb-20">

      {/* Nav */}
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-white text-sm hidden sm:block">{t('nav.keyPrompt')}</span>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            {user ? (
              <>
                <button
                  onClick={() => navigate('/pricing')}
                  className="text-xs font-semibold text-amber-400 px-2 py-1.5 rounded-xl border border-amber-500/30 hover:bg-amber-500/10 hidden sm:flex items-center gap-1"
                >
                  ✦ {t('nav.pro')}
                </button>
                <button
                  onClick={() => navigate('/submit')}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:opacity-90 hidden sm:flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                  {t('nav.submit')}
                </button>
                <div className="relative">
                  <div
                    onClick={() => setShowMenu(m => !m)}
                    className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer select-none"
                  >
                    {(user.email || 'U').slice(0, 1).toUpperCase()}
                  </div>
                  {showMenu && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowMenu(false)} />
                      <div className="absolute right-0 top-9 z-40 bg-gray-900 border border-gray-700 rounded-xl shadow-xl shadow-black/50 py-1 min-w-[140px]">
                        <button
                          onClick={() => { setShowMenu(false); navigate('/library') }}
                          className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          {t('nav.myProfile')}
                        </button>
                        <button
                          onClick={() => { setShowMenu(false); navigate('/submit') }}
                          className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          {t('nav.submit')}
                        </button>
                        <div className="border-t border-gray-800 my-1" />
                        <button
                          onClick={() => { setShowMenu(false); handleSignOut() }}
                          className="w-full text-left px-4 py-2 text-xs text-rose-400 hover:bg-gray-800 transition-colors"
                        >
                          {t('nav.signOut')}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="text-xs font-semibold text-gray-400 px-3 py-1.5 rounded-xl border border-gray-700 hover:bg-gray-800">
                  {t('nav.signIn')}
                </button>
                <button onClick={() => navigate('/login')} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold px-3 py-1.5 rounded-xl hover:opacity-90">
                  {t('nav.signUp')}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="border-b border-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-1.5 bg-violet-950/60 text-violet-400 text-xs font-semibold px-3 py-1 rounded-full mb-3 border border-violet-800/50">
            ✦ {t('home.heroTag', { count: promptCount })}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">{t('home.heroTitle')}</h1>
          <p className="text-gray-500 text-sm max-w-md mx-auto mb-5">{t('home.heroSub')}</p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={t('search.search')}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4">

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                activeCategory === cat.id
                  ? 'bg-violet-600 text-white border-violet-600'
                  : 'bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Sort + count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-600">
            <span className="font-semibold text-gray-400">{filteredPrompts.length}</span> {t('home.promptsFound')}
          </p>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="text-xs border border-gray-700 rounded-lg px-2 py-1.5 bg-gray-900 text-gray-400 outline-none focus:border-violet-500 cursor-pointer"
          >
            <option value="newest">{t('home.sort.newest')}</option>
            <option value="mostUsed">{t('home.sort.mostUsed')}</option>
            <option value="priceLow">{t('home.sort.priceLow')}</option>
          </select>
        </div>

        {error && (
          <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-4 mb-4">
            <p className="text-sm text-rose-400 font-bold">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <svg className="animate-spin w-8 h-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredPrompts.map(p => (
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
            <p className="text-gray-500 text-sm mb-3">{t('home.noPrompts')}</p>
            <button
              onClick={() => { setActiveCategory('All'); setSearch('') }}
              className="text-violet-400 text-sm font-semibold hover:text-violet-300"
            >
              {t('home.clearFilters')}
            </button>
          </div>
        )}
      </div>

      <BottomNav user={user} />
    </div>
  )
}
