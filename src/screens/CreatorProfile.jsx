import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import PromptCard from '../components/PromptCard'
import BottomNav from '../components/BottomNav'

function StatPill({ value, label }) {
  const fmt = (n) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-lg font-black text-white leading-none">{fmt(value)}</span>
      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</span>
    </div>
  )
}

export default function CreatorProfile({ user }) {
  const { username } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [profile, setProfile] = useState(null)
  const [prompts, setPrompts] = useState([])
  const [followerCount, setFollowerCount] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)
  const [totalUses, setTotalUses] = useState(0)
  const [isFollowing, setIsFollowing] = useState(false)
  const [likedIds, setLikedIds] = useState(new Set())
  const [savedIds, setSavedIds] = useState(new Set())
  const [activeTab, setActiveTab] = useState('all')
  const [loading, setLoading] = useState(true)
  const [followLoading, setFollowLoading] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    if (username) loadProfile()
  }, [username])

  useEffect(() => {
    if (user && prompts.length > 0) loadUserInteractions()
  }, [user, prompts])

  async function loadProfile() {
    setLoading(true)
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single()

      if (profileError || !profileData) {
        setLoading(false)
        return
      }
      setProfile(profileData)

      const [promptsResult, followersResult, followingResult] = await Promise.all([
        supabase
          .from('prompts')
          .select('*, author:profiles(username, full_name, avatar_url)')
          .eq('author_id', profileData.id)
          .eq('is_published', true)
          .order('created_at', { ascending: false }),
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('creator_id', profileData.id),
        user
          ? supabase
              .from('follows')
              .select('id')
              .eq('follower_id', user.id)
              .eq('creator_id', profileData.id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ])

      const fetchedPrompts = promptsResult.data || []
      setPrompts(fetchedPrompts)
      setFollowerCount(followersResult.count || 0)
      setIsFollowing(!!followingResult.data)

      const likes = fetchedPrompts.reduce((sum, p) => sum + (p.likes_count || 0), 0)
      const uses = fetchedPrompts.reduce((sum, p) => sum + (p.uses_count || 0), 0)
      setTotalLikes(likes)
      setTotalUses(uses)
    } finally {
      setLoading(false)
    }
  }

  async function loadUserInteractions() {
    if (!user) return
    const ids = prompts.map(p => p.id)
    const [likesResult, savedResult] = await Promise.all([
      supabase.from('likes').select('prompt_id').eq('user_id', user.id).in('prompt_id', ids),
      supabase.from('saves').select('prompt_id').eq('user_id', user.id).in('prompt_id', ids),
    ])
    setLikedIds(new Set((likesResult.data || []).map(r => r.prompt_id)))
    setSavedIds(new Set((savedResult.data || []).map(r => r.prompt_id)))
  }

  const uploadAvatar = async (file) => {
    if (!file || !user || user.id !== profile.id) return
    setAvatarUploading(true)
    const ext = file.name.split('.').pop()
    const filePath = `${user.id}/avatar.${ext}`
    const { error: uploadErr } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })
    if (uploadErr) { setAvatarUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath)
    await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user.id)
    setProfile(p => ({ ...p, avatar_url: publicUrl }))
    setAvatarUploading(false)
  }

  const handleFollow = async () => {
    if (!user) { navigate('/login'); return }
    setFollowLoading(true)
    if (isFollowing) {
      await supabase.from('follows').delete()
        .eq('follower_id', user.id)
        .eq('creator_id', profile.id)
      setIsFollowing(false)
      setFollowerCount(c => Math.max(0, c - 1))
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, creator_id: profile.id })
      setIsFollowing(true)
      setFollowerCount(c => c + 1)
    }
    setFollowLoading(false)
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

  const filteredPrompts = activeTab === 'popular'
    ? [...prompts].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
    : activeTab === 'free'
    ? prompts.filter(p => parseFloat(p.price) === 0)
    : prompts

  const freeCount = prompts.filter(p => parseFloat(p.price) === 0).length
  const initials = profile ? (profile.username || profile.full_name || 'UN').slice(0, 2).toUpperCase() : '??'
  const displayName = profile?.full_name || profile?.username || username

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <svg className="animate-spin w-8 h-8 text-violet-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-gray-500 text-sm">{t('common.loading')}</span>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4 font-sans px-5">
        <p className="text-gray-400 text-sm">{t('creator.notFound')}</p>
        <button onClick={() => navigate('/')} className="text-violet-400 text-sm font-semibold hover:text-violet-300">
          {t('common.goHome')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 font-sans pb-20">

      {/* Nav */}
      <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-300 transition-colors p-1 -ml-1"
          >
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
        </div>
      </nav>

      {/* Hero banner */}
      <div className="relative h-28 bg-gradient-to-br from-violet-900 via-indigo-900 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #7c3aed 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4f46e5 0%, transparent 40%)" }} />
      </div>

      <div className="max-w-lg mx-auto px-4">

        {/* Avatar + actions */}
        <div className="flex items-end justify-between -mt-10 mb-4">
          <div className="relative">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-gray-950 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center border-4 border-gray-950 shadow-xl">
                <span className="text-2xl font-black text-white">{initials}</span>
              </div>
            )}
            {user?.id === profile?.id && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => { const f = e.target.files[0]; if (f) uploadAvatar(f) }}
                />
                {avatarUploading ? (
                  <svg className="animate-spin w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                )}
              </label>
            )}
            {profile.is_verified && (
              <div className="absolute -bottom-1 -end-1 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center border-2 border-gray-950">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" className="w-3 h-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
          </div>
          <div className="flex gap-2 mb-1">
            {user?.id !== profile.id && (
              <button
                onClick={handleFollow}
                disabled={followLoading}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-60 ${
                  isFollowing
                    ? 'bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700'
                    : 'bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-900/50'
                }`}
              >
                {isFollowing ? t('creator.following') : t('creator.follow')}
              </button>
            )}
          </div>
        </div>

        {/* Name + info */}
        <div className="mb-5">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h1 className="text-xl font-black text-white">{displayName}</h1>
            {profile.is_verified && (
              <span className="text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30 px-2 py-0.5 rounded-full">
                {t('creator.verified')}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mb-2">@{profile.username || username}</p>
          {profile.bio && (
            <p className="text-sm text-gray-300 leading-relaxed mb-3">{profile.bio}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500">
            {profile.location && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {profile.location}
              </span>
            )}
            {profile.website && (
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
                <span className="text-violet-400">{profile.website}</span>
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-5">
          <div className="grid grid-cols-4 gap-2 divide-x divide-gray-800">
            <StatPill value={prompts.length} label={t('creator.stats.prompts')} />
            <div className="ps-2"><StatPill value={followerCount} label={t('creator.stats.followers')} /></div>
            <div className="ps-2"><StatPill value={totalLikes} label={t('creator.stats.likes')} /></div>
            <div className="ps-2"><StatPill value={totalUses} label={t('creator.stats.uses')} /></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-900 border border-gray-800 p-1 rounded-xl mb-5">
          {[
            { id: 'all', label: t('creator.tabs.all') },
            { id: 'popular', label: t('creator.tabs.popular') },
            { id: 'free', label: t('creator.tabs.free'), count: freeCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/50'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className="ms-1 text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Prompt grid */}
        {filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
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
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm">{t('creator.noPrompts')}</p>
          </div>
        )}
      </div>

      <BottomNav user={user} />
    </div>
  )
}
