import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import BottomNav from '../components/BottomNav'

function ContactSupportModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.email || !form.subject || !form.message) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from('contact_messages').insert({
        email: form.email,
        subject: form.subject,
        message: form.message,
        created_at: new Date().toISOString()
      })

      if (error) {
        alert('Failed to send message. Please try again.')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        setForm({ email: '', subject: '', message: '' })
        setSuccess(false)
        onClose()
      }, 2000)
    } catch (err) {
      alert('Error sending message')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end z-50">
      <div className="w-full bg-gray-900 border-t border-gray-800 rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="max-w-lg mx-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('library.contactForm.successTitle')}</h3>
              <p className="text-sm text-gray-400">{t('library.contactForm.successDesc')}</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-black text-white mb-5">{t('library.contactForm.title')}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">{t('library.contactForm.email')}</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">{t('library.contactForm.subject')}</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-400 block mb-2">{t('library.contactForm.message')}</label>
                  <textarea
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    rows="4"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-violet-600 text-white font-bold py-3 rounded-xl hover:bg-violet-500 transition-colors disabled:opacity-50"
                >
                  {loading ? t('library.contactForm.sending') : t('library.contactForm.send')}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function DeleteAccountModal({ isOpen, onClose, user }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleDelete = async () => {
    if (!password) {
      alert('Please enter your password')
      return
    }

    setLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password
      })

      if (signInError) {
        alert('Password is incorrect')
        setLoading(false)
        return
      }

      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

      if (deleteError && deleteError.message !== 'Auth session missing!') {
        alert('Failed to delete account')
        setLoading(false)
        return
      }

      await supabase.from('profiles').delete().eq('id', user.id)

      setSuccess(true)
      setTimeout(() => {
        supabase.auth.signOut()
        navigate('/login')
      }, 1500)
    } catch (err) {
      alert('Error deleting account: ' + err.message)
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 max-w-sm w-full">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t('library.deleteAccountModal.successTitle')}</h3>
            <p className="text-sm text-gray-400">{t('library.deleteAccountModal.successDesc')}</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-black text-white mb-2">{t('library.deleteAccountModal.title')}</h2>
            <p className="text-sm text-gray-400 mb-5">{t('library.deleteAccountModal.warning')}</p>

            <div className="mb-5">
              <label className="text-xs font-semibold text-gray-400 block mb-2">{t('library.deleteAccountModal.password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="flex-1 bg-gray-800 text-gray-300 font-semibold py-2.5 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {t('library.deleteAccountModal.cancel')}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                {loading ? t('library.deleteAccountModal.deleting') : t('library.deleteAccountModal.delete')}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

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
            onClick={() => onRemove(item.id)}
            className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-900/20 transition-colors flex-shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

function PurchasedCard({ item, onClick }) {
  const p = item.prompt
  if (!p) return null
  const tools = p.ai_models || []

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all cursor-pointer" onClick={onClick}>
      <div className="p-4">
        <div className="flex gap-1.5 mb-1.5 flex-wrap">
          {tools.slice(0, 2).map(tool => (
            <span key={tool} className="text-[10px] font-semibold bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tool}</span>
          ))}
          <span className="text-[10px] font-semibold bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{p.category}</span>
        </div>
        <h3 className="text-sm font-bold text-white leading-snug mb-1">{p.title}</h3>
        <p className="text-xs text-gray-500 mb-3">
          {p.author?.username || p.author?.full_name || 'Creator'} · ${parseFloat(p.price).toFixed(2)}
        </p>
        <button className="w-full text-xs font-bold text-violet-400 py-2 rounded-lg hover:bg-violet-900/20 transition-colors">
          View Prompt →
        </button>
      </div>
    </div>
  )
}

function MyPromptCard({ prompt, onDelete, onClick }) {
  const { t } = useTranslation()
  const p = prompt
  const tools = p.ai_models || []
  const isPublished = p.is_published
  const isFree = parseFloat(p.price) === 0

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
            <div className="flex gap-1.5 mb-1.5 flex-wrap items-center">
              {tools.slice(0, 2).map(tool => (
                <span key={tool} className="text-[10px] font-semibold bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">{tool}</span>
              ))}
              <span className="text-[10px] font-semibold bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full">{p.category}</span>
              {isPublished && (
                <span className="text-[10px] font-semibold bg-emerald-900/40 text-emerald-300 px-2 py-0.5 rounded-full">Published</span>
              )}
            </div>
            <h3 className="text-sm font-bold text-white leading-snug mb-1">{p.title}</h3>
            <p className="text-xs text-gray-500 mb-2">{p.description}</p>
          </div>
        </div>

        {isPublished && (
          <div className="flex gap-3 mt-3 pt-3 border-t border-gray-800">
            {[
              { label: t('library.likes'), value: p.likes_count || 0 },
              { label: 'Uses', value: p.uses_count || 0 },
              { label: t('library.earned'), value: isFree ? '—' : `$${((p.sales_count || 0) * parseFloat(p.price) * 0.8).toFixed(0)}` },
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
            onClick={() => onDelete(p.id)}
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
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
    const { error } = await supabase.from('saves').delete().eq('id', saveId)
    if (error) {
      console.error('Failed to remove from saved:', error)
      alert('Failed to remove from library. Please try again.')
      return
    }
    setSavedList(prev => prev.filter(s => s.id !== saveId))
  }

  const handleDeletePrompt = async (promptId) => {
    const { error } = await supabase.from('prompts').delete().eq('id', promptId)
    if (error) {
      console.error('Failed to delete prompt:', error)
      alert('Failed to delete prompt. Please try again.')
      return
    }
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

      {/* Settings Section */}
      <div className="max-w-lg mx-auto px-4 py-5 border-t border-gray-800 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide px-1">{t('library.settings')}</p>
        
        <button
          onClick={() => setShowContactModal(true)}
          className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-all"
        >
          <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-violet-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-white">{t('library.contactSupport')}</p>
            <p className="text-xs text-gray-500">{t('library.contactDesc')}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-2xl p-4 hover:border-red-800/50 hover:bg-red-900/10 transition-all"
        >
          <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-red-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-white">{t('library.deleteAccount')}</p>
            <p className="text-xs text-gray-500">{t('library.deleteDesc')}</p>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-gray-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Modals */}
      <ContactSupportModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      <DeleteAccountModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} user={user} />

      <BottomNav user={user} />
    </div>
  )
}
