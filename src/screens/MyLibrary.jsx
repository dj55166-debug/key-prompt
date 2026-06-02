import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

function EmptyState({ titleKey, descKey, actionKey, onAction }) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-gray-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
      </div>
      <h3 className="text-base font-bold text-white mb-2">{t(titleKey)}</h3>
      <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{t(descKey)}</p>
      <button
        onClick={onAction}
        className="mt-5 bg-violet-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-violet-500 transition-colors"
      >
        {t(actionKey)}
      </button>
    </div>
  )
}

function SavedCard({ item, onRemove, onClick }) {
  const { t } = useTranslation()
  const p = item.prompt
  if (!p) return null
  const tools = p.ai_models || []

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
            <div className="flex gap-1.5 mb-1.5 flex-wrap">
              {tools.slice(0, 2).map(tool => (
                <span key={tool} className="text-[10px] font-semibold bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tool}</span>
              ))}
              <span className="text-[10px] font-semibold bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{p.category}</span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug mb-1">{p.title}</h3>
            <p className="text-xs text-gray-500">
              {t('library.by')} {p.author?.username || p.author?.full_name || 'Creator'} · {t('library.savedAt', { time: new Date(item.created_at).toLocaleDateString() })}
            </p>
          </div>
          <button
            onClick={() => onRemove(item.id, p.id)}
            className="text-violet-500 flex-shrink-0 hover:text-violet-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-800">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3 h-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            {p.likes_count || 0}
          </span>
          <span className="text-xs text-gray-600">{p.uses_count || 0} uses</span>
          <button onClick={onClick} className="ms-auto text-xs font-semibold text-violet-400 hover:text-violet-300 transition-colors">
            {t('library.usePrompt')}
          </button>
        </div>
      </div>
    </div>
  )
}

function PurchasedCard({ item, onClick }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const p = item.prompt
  if (!p) return null

  const handleCopy = (e) => {
    e.stopPropagation()
    if (p.content) {
      navigator.clipboard.writeText(p.content).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex gap-1.5 mb-1.5">
              <span className="text-[10px] font-semibold bg-emerald-900/30 text-emerald-400 border border-emerald-700/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-2.5 h-2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Unlocked
              </span>
            </div>
            <h3 className="text-sm font-bold text-white leading-snug mb-1">{p.title}</h3>
            <p className="text-xs text-gray-500">
              {new Date(item.created_at).toLocaleDateString()} · ${item.amount_paid}
            </p>
          </div>
          <span className="text-2xl flex-shrink-0">🔓</span>
        </div>
        <div className="flex gap-2 mt-3">
          <button onClick={onClick} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors">
            {t('library.viewPrompt')}
          </button>
          <button onClick={handleCopy} className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${copied ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-700/30' : 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'}`}>
            {copied ? t('library.copied') : t('library.copyPrompt')}
          </button>
        </div>
      </div>
    </div>
  )
}

function MyPromptCard({ prompt, onDelete, onClick }) {
  const { t } = useTranslation()
  const isPublished = prompt.is_published

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex gap-1.5 mb-1.5 flex-wrap">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                isPublished ? 'bg-emerald-900/30 text-emerald-400' : 'bg-amber-900/30 text-amber-400'
              }`}>
                {isPublished ? 'Published' : 'Draft'}
              </span>
              <span className="text-[10px] font-semibold bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{prompt.category}</span>
              {parseFloat(prompt.price) === 0
                ? <span className="text-[10px] font-semibold bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full">Free</span>
                : <span className="text-[10px] font-semibold bg-amber-900/30 text-amber-400 px-2 py-0.5 rounded-full">${prompt.price}</span>
              }
            </div>
            <h3 className="text-sm font-bold text-white leading-snug mb-1">{prompt.title}</h3>
            <p className="text-xs text-gray-500">{new Date(prompt.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {isPublished && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-gray-800">
            {[
              { label: t('library.likes'), value: prompt.likes_count || 0 },
              { label: 'Uses', value: prompt.uses_count || 0 },
              { label: t('library.earned'), value: parseFloat(prompt.price) === 0 ? '—' : `$${((prompt.sales_count || 0) * parseFloat(prompt.price) * 0.8).toFixed(0)}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex-1 bg-gray-800 rounded-xl p-2.5 text-center">
                <p className="text-sm font-black text-white">{value}</p>
                <p className="text-[10px] text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 mt-3">
          <button onClick={onClick} className="flex-1 py-2 rounded-xl text-xs font-semibold bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors">
            {t('library.edit')}
          </button>
          <button
            onClick={() => onDelete(prompt.id)}
            className="p-2 rounded-xl text-gray-600 hover:text-rose-400 hover:bg-rose-900/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

const TABS = ['saved', 'purchased', 'mine']

export default function MyLibrary({ user }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('saved')
  const [loading, setLoading] = useState(true)

  const [profile, setProfile] = useState(null)
  const [savedList, setSavedList] = useState([])
  const [purchasedList, setPurchasedList] = useState([])
  const [myPrompts, setMyPrompts] = useState([])

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)

    const [profileRes, savedRes, purchasedRes, myRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('saves')
        .select('*, prompt:prompts(*, author:profiles(id, username, full_name))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      supabase.from('purchases')
        .select('*, prompt:prompts(*, author:profiles(id, username, full_name))')
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false }),
      supabase.from('prompts')
        .select('*')
        .eq('author_id', user.id)
        .order('created_at', { ascending: false }),
    ])

    setProfile(profileRes.data)
    setSavedList(savedRes.data || [])
    setPurchasedList(purchasedRes.data || [])
    setMyPrompts(myRes.data || [])
    setLoading(false)
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  const handleRemoveSaved = async (saveId, promptId) => {
    await supabase.from('saves').delete().eq('id', saveId)
    setSavedList(prev => prev.filter(s => s.id !== saveId))
  }

  const handleDeletePrompt = async (promptId) => {
    await supabase.from('prompts').delete().eq('id', promptId)
    setMyPrompts(prev => prev.filter(p => p.id !== promptId))
  }

  const totalEarned = myPrompts
    .filter(p => parseFloat(p.price) > 0)
    .reduce((sum, p) => sum + (p.sales_count || 0) * parseFloat(p.price) * 0.8, 0)

  const displayName = profile?.username || profile?.full_name || user?.email?.split('@')[0] || 'User'
  const initials = displayName.slice(0, 2).toUpperCase()
  const totalItems = savedList.length + purchasedList.length + myPrompts.length

  const tabCounts = { saved: savedList.length, purchased: purchasedList.length, mine: myPrompts.length }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 font-sans pb-24">
      {/* Nav */}
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm text-white">{t('library.title')}</span>
          </div>
          <button onClick={() => navigate('/search')} className="text-gray-500 hover:text-gray-300 p-1.5 rounded-lg hover:bg-gray-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-lg mx-auto px-4 py-5">
        {/* Earnings banner */}
        {activeTab === 'mine' && totalEarned > 0 && (
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-4 mb-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">💰</span>
            </div>
            <div className="flex-1">
              <p className="text-xs text-amber-100 font-medium mb-0.5">{t('library.earnings')}</p>
              <p className="text-2xl font-black text-white">${totalEarned.toFixed(2)}</p>
              <p className="text-xs text-amber-200 mt-0.5">{t('library.from', { count: myPrompts.filter(p => parseFloat(p.price) > 0).length })}</p>
            </div>
            <button className="bg-white text-amber-600 text-xs font-bold px-3 py-2 rounded-xl hover:bg-amber-50 transition-colors flex-shrink-0">
              {t('library.withdraw')}
            </button>
          </div>
        )}

        {/* User profile card */}
        <div className="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-700 to-indigo-700 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-white">{displayName}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">{t('library.items', { count: totalItems })}</p>
            <p className="text-xs text-violet-400 font-semibold">{t('library.inLibrary')}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-900 border border-gray-800 p-1 rounded-2xl mb-5 gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 rounded-xl text-[11px] font-bold transition-all ${
                activeTab === tab ? 'bg-violet-600 text-white shadow-md shadow-violet-900/50' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <span>{t(`library.${tab === 'mine' ? 'myPrompts' : tab}`)}</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                activeTab === tab ? 'bg-white/20 text-white' : 'bg-gray-800 text-gray-500'
              }`}>{tabCounts[tab]}</span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="space-y-3">
          {activeTab === 'saved' && (
            savedList.length > 0
              ? savedList.map(item => (
                  <SavedCard
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveSaved}
                    onClick={() => navigate(`/prompt/${item.prompt?.id}`)}
                  />
                ))
              : <EmptyState
                  titleKey="library.nothing.savedTitle"
                  descKey="library.nothing.savedDesc"
                  actionKey="library.browse"
                  onAction={() => navigate('/')}
                />
          )}

          {activeTab === 'purchased' && (
            purchasedList.length > 0
              ? purchasedList.map(item => (
                  <PurchasedCard
                    key={item.id}
                    item={item}
                    onClick={() => navigate(`/prompt/${item.prompt?.id}`)}
                  />
                ))
              : <EmptyState
                  titleKey="library.nothing.purchasedTitle"
                  descKey="library.nothing.purchasedDesc"
                  actionKey="library.browse"
                  onAction={() => navigate('/')}
                />
          )}

          {activeTab === 'mine' && (
            myPrompts.length > 0 ? (
              <>
                <button
                  onClick={() => navigate('/submit')}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-violet-800/50 text-violet-500 text-xs font-bold hover:bg-violet-900/10 transition-colors flex items-center justify-center gap-2"
                >
                  {t('library.submitNew')}
                </button>
                {myPrompts.map(p => (
                  <MyPromptCard
                    key={p.id}
                    prompt={p}
                    onDelete={handleDeletePrompt}
                    onClick={() => navigate(`/prompt/${p.id}`)}
                  />
                ))}
              </>
            ) : (
              <EmptyState
                titleKey="library.nothing.mineTitle"
                descKey="library.nothing.mineDesc"
                actionKey="library.submitPrompt"
                onAction={() => navigate('/submit')}
              />
            )
          )}
        </div>
      </div>

      <BottomNav user={user} />
    </div>
  )
}
