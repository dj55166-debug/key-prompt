import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Elements } from '@stripe/react-stripe-js'
import { stripePromise } from '../lib/stripe'h
import { supabase } from '../lib/supabase'
import { TOOL_COLORS } from '../lib/constants'
import CheckoutForm from '../components/CheckoutForm'

function ToolBadge({ tool }) {
  const color = TOOL_COLORS[tool] || 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  return <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{tool}</span>
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          fill={i <= Math.floor(rating) ? 'currentColor' : 'none'}
          stroke="currentColor" strokeWidth="1.5"
          className={`w-3.5 h-3.5 ${i <= Math.floor(rating) ? 'text-amber-400' : 'text-gray-600'}`}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </div>
  )
}

export default function PromptDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [prompt, setPrompt] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [following, setFollowing] = useState(false)

  const [activeTab, setActiveTab] = useState('overview')
  const [showCheckout, setShowCheckout] = useState(false)
  const [clientSecret, setClientSecret] = useState(null)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)

  const [comments, setComments] = useState([])
  const [commentText, setCommentText] = useState('')
  const [postingComment, setPostingComment] = useState(false)

  // ── Load prompt ────────────────────────────────────────────
  const fetchPrompt = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: err } = await supabase
        .from('prompts')
        .select('*, author:profiles(id, username, full_name, avatar_url)')
        .eq('id', id)
        .single()

      if (err) { setError(err.message); return }
      if (!data) { setError('Prompt not found'); return }
      setPrompt(data)

      // Increment uses_count (fire-and-forget, never crash the page)
      try {
        const { error: rpcErr } = await supabase.rpc('increment_uses_count', { prompt_id: id })
        if (rpcErr) console.warn('increment failed:', rpcErr.message)
      } catch (e) {
        console.warn('increment failed:', e?.message)
      }
    } catch (e) {
      setError(e?.message || 'Failed to load prompt')
    } finally {
      setLoading(false)
    }
  }, [id])

  // ── Load comments ──────────────────────────────────────────
  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from('comments')
      .select('*, user:profiles(id, username, full_name)')
      .eq('prompt_id', id)
      .order('created_at', { ascending: false })
    setComments(data || [])
  }, [id])

  // ── Check user state: liked, saved, purchased, following ──
  const fetchUserState = useCallback(async () => {
    if (!user) return
    const [likeRes, saveRes, purchaseRes] = await Promise.all([
      supabase.from('likes').select('id').eq('user_id', user.id).eq('prompt_id', id).maybeSingle(),
      supabase.from('saves').select('id').eq('user_id', user.id).eq('prompt_id', id).maybeSingle(),
      supabase.from('purchases').select('id').eq('buyer_id', user.id).eq('prompt_id', id).maybeSingle(),
    ])
    setLiked(!!likeRes.data)
    setSaved(!!saveRes.data)
    setPurchased(!!purchaseRes.data)
  }, [user, id])

  // ── Check if user follows the creator ─────────────────────
  const fetchFollowing = useCallback(async (authorId) => {
    if (!user || !authorId) return
    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('creator_id', authorId)
      .maybeSingle()
    setFollowing(!!data)
  }, [user])

  useEffect(() => {
    fetchPrompt()
    fetchComments()
    fetchUserState()
  }, [fetchPrompt, fetchComments, fetchUserState])

  useEffect(() => {
    if (prompt?.author?.id) fetchFollowing(prompt.author.id)
  }, [prompt, fetchFollowing])

  // ── Like toggle ────────────────────────────────────────────
  const handleLike = async () => {
    if (!user) { navigate('/login'); return }
    if (liked) {
      await supabase.from('likes').delete().eq('user_id', user.id).eq('prompt_id', id)
      setLiked(false)
    } else {
      await supabase.from('likes').insert({ user_id: user.id, prompt_id: id })
      setLiked(true)
    }
  }

  // ── Save toggle ────────────────────────────────────────────
  const handleSave = async () => {
    if (!user) { navigate('/login'); return }
    if (saved) {
      await supabase.from('saves').delete().eq('user_id', user.id).eq('prompt_id', id)
      setSaved(false)
    } else {
      await supabase.from('saves').insert({ user_id: user.id, prompt_id: id })
      setSaved(true)
    }
  }

  // ── Follow toggle ──────────────────────────────────────────
  const handleFollow = async () => {
    if (!user) { navigate('/login'); return }
    const authorId = prompt.author?.id
    if (!authorId) return
    if (following) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('creator_id', authorId)
      setFollowing(false)
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, creator_id: authorId })
      setFollowing(true)
    }
  }

  // ── Copy prompt ────────────────────────────────────────────
  const handleCopy = () => {
    if (!prompt?.content) return
    navigator.clipboard.writeText(prompt.content).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Initiate Stripe checkout ───────────────────────────────
  const handleBuy = async () => {
    if (!user) { navigate('/login'); return }
    setCheckoutError(null)
    setCheckoutLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify({
            prompt_id: prompt.id,
            amount: Math.round((prompt.price || 0) * 100),
            author_id: prompt.author_id,
          }),
        }
      )
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setClientSecret(json.clientSecret)
      setShowCheckout(true)
    } catch (err) {
      setCheckoutError(err.message)
    }
    setCheckoutLoading(false)
  }

  // ── Handle successful purchase ─────────────────────────────
  const handlePurchaseSuccess = () => {
    setShowCheckout(false)
    setClientSecret(null)
    setPurchased(true)
    setSaved(true)
  }

  // ── Post comment ───────────────────────────────────────────
  const handlePostComment = async () => {
    if (!user) { navigate('/login'); return }
    if (!commentText.trim()) return
    setPostingComment(true)
    const { error: err } = await supabase.from('comments').insert({
      user_id: user.id,
      prompt_id: id,
      content: commentText.trim(),
    })
    if (!err) {
      setCommentText('')
      fetchComments()
    }
    setPostingComment(false)
  }

  // ── Render: loading / error ────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-violet-600 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !prompt) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-400">{error || t('prompt.notFound')}</p>
        <button onClick={() => navigate(-1)} className="text-violet-400 text-sm hover:underline">← Back</button>
      </div>
    )
  }

  const isFree = parseFloat(prompt.price) === 0
  const isUnlocked = isFree || purchased
  const tools = prompt.ai_models || []
  const authorName = prompt.author?.username || prompt.author?.full_name || 'Creator'
  const authorInitials = authorName.slice(0, 2).toUpperCase()
  const previewContent = (prompt.content || '').slice(0, 150) + '...'

  return (
    <div className="min-h-screen bg-gray-950 font-sans pb-24 sm:pb-0">
      {/* Nav */}
      <nav className="bg-gray-950/95 backdrop-blur border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-gray-300 transition-colors p-1 -ms-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm text-white">{t('nav.keyPrompt')}</span>
          </div>
          <button
            onClick={handleSave}
            className={`p-2 rounded-xl transition-all ${saved ? 'bg-violet-900/60 text-violet-400' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-5">
        {/* Header card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-4">
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />
          <div className="p-5">
            <div className="flex gap-2 mb-3 flex-wrap">
              {tools.map(tool => <ToolBadge key={tool} tool={tool} />)}
              <span className="text-xs font-semibold bg-gray-800 text-gray-400 px-2.5 py-1 rounded-full">{prompt.category}</span>
            </div>

            <h1 className="text-xl font-black text-white mb-2 leading-tight">{prompt.title}</h1>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">{prompt.description}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                {t('prompt.uses', { count: prompt.uses_count >= 1000 ? `${(prompt.uses_count / 1000).toFixed(1)}k` : prompt.uses_count || 0 })}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
                {prompt.sales_count || 0} {t('common.sales')}
              </span>
              <div className="flex items-center gap-1">
                <StarRating rating={4.8} />
                <span className="font-medium text-gray-400">4.8</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  liked ? 'bg-rose-900/30 border-rose-700/50 text-rose-400' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-rose-700/50 hover:text-rose-400'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {liked ? (prompt.likes_count || 0) + 1 : (prompt.likes_count || 0)}
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-700 bg-gray-800 text-gray-400 hover:border-indigo-600/50 hover:text-indigo-400 transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                </svg>
                {t('prompt.remix')}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 p-1 rounded-xl mb-4">
          {['overview', 'prompt', 'comments'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                activeTab === tab ? 'bg-violet-600 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab === 'comments' ? t('prompt.comments', { count: comments.length }) : t(`prompt.${tab}`)}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Creator card */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t('prompt.creator')}</p>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(`/creator/${prompt.author?.username || prompt.author?.id}`)}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-700 to-indigo-700 flex items-center justify-center text-white text-sm font-black">
                    {authorInitials}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white flex items-center gap-1">
                      {authorName}
                      {(prompt.author?.is_verified || prompt.is_verified) && (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-violet-400">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.491 4.491 0 01-3.497-1.307 4.491 4.491 0 01-1.307-3.497A4.49 4.49 0 012.25 12a4.49 4.49 0 011.549-3.397 4.491 4.491 0 011.307-3.497 4.491 4.491 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{'Creator'}</p>
                  </div>
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    following ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-violet-600 text-white hover:bg-violet-500'
                  }`}
                >
                  {following ? t('prompt.following') : t('prompt.follow')}
                </button>
              </div>
            </div>

            {/* Tags */}
            {(prompt.tags || []).length > 0 && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t('prompt.tags')}</p>
                <div className="flex flex-wrap gap-2">
                  {prompt.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Details */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{t('prompt.details')}</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: t('prompt.category'), value: prompt.category },
                  { label: t('prompt.type'), value: prompt.type },
                  { label: t('prompt.worksWith'), value: (prompt.ai_models || []).join(', ') || '—' },
                  { label: t('prompt.published'), value: new Date(prompt.created_at).toLocaleDateString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-800 rounded-xl p-3">
                    <p className="text-[10px] text-gray-500 font-medium mb-1">{label}</p>
                    <p className="text-xs font-semibold text-gray-300">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab: Prompt */}
        {activeTab === 'prompt' && (
          <div className="space-y-4">
            {/* Content box */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <p className="text-xs font-semibold text-gray-300">{t('prompt.content')}</p>
                {isUnlocked ? (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                      copied ? 'bg-emerald-900/40 text-emerald-400' : 'bg-gray-800 text-gray-400 hover:bg-violet-900/40 hover:text-violet-400'
                    }`}
                  >
                    {copied ? t('prompt.copied') : t('prompt.copy')}
                  </button>
                ) : (
                  <span className="text-xs text-gray-600 flex items-center gap-1">🔒 {t('prompt.locked')}</span>
                )}
              </div>
              <div className="p-4 relative">
                <pre className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono">
                  {isUnlocked ? prompt.content : previewContent}
                </pre>
                {!isUnlocked && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent rounded-b-2xl flex items-end justify-center pb-4">
                    <span className="text-xs text-gray-500 font-medium">{t('prompt.purchase')}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Buy / Purchased state */}
            {!isUnlocked && !showCheckout && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-black text-white">${parseFloat(prompt.price).toFixed(2)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">One-time purchase · instant access</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                      <StarRating rating={4.8} />
                      <span className="text-xs font-semibold text-gray-300">4.8</span>
                    </div>
                  </div>
                </div>
                {checkoutError && (
                  <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-rose-400">{checkoutError}</p>
                  </div>
                )}
                <button
                  onClick={handleBuy}
                  disabled={checkoutLoading}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 transition-all text-sm disabled:opacity-50"
                >
                  {checkoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('common.loading')}
                    </span>
                  ) : t('prompt.buy', { price: parseFloat(prompt.price).toFixed(2) })}
                </button>
                <p className="text-center text-xs text-gray-600 mt-2">{t('prompt.securedBy')}</p>
              </div>
            )}

            {/* Stripe Elements checkout */}
            {!isUnlocked && showCheckout && clientSecret && (
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <p className="text-sm font-bold text-white mb-4">Complete your purchase</p>
                <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
                  <CheckoutForm
                    prompt={prompt}
                    user={user}
                    onSuccess={handlePurchaseSuccess}
                  />
                </Elements>
                <button
                  onClick={() => { setShowCheckout(false); setClientSecret(null) }}
                  className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors mt-2"
                >
                  {t('nav.cancel')}
                </button>
              </div>
            )}

            {/* Purchased success state */}
            {isUnlocked && purchased && (
              <div className="bg-emerald-900/20 border border-emerald-700/40 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 text-emerald-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-300">{t('prompt.purchasedTitle')}</p>
                  <p className="text-xs text-emerald-500">{t('prompt.savedToLibrary')}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Comments */}
        {activeTab === 'comments' && (
          <div className="space-y-3">
            {comments.map(c => {
              const cName = c.user?.username || c.user?.full_name || 'User'
              const cInitials = cName.slice(0, 2).toUpperCase()
              return (
                <div key={c.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-violet-900/50 text-violet-300 text-xs font-bold flex items-center justify-center flex-shrink-0">
                      {cInitials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-xs font-semibold text-white">{cName}</p>
                        <p className="text-[10px] text-gray-600 flex-shrink-0">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{c.content}</p>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Add comment */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
              <p className="text-xs font-semibold text-gray-300 mb-3">{t('prompt.addComment')}</p>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder={t('prompt.commentPlaceholder')}
                rows={3}
                className="w-full text-sm text-gray-300 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2.5 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none placeholder-gray-600"
              />
              <button
                onClick={handlePostComment}
                disabled={!commentText.trim() || postingComment}
                className="mt-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {postingComment ? t('common.loading') : t('prompt.postComment')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
