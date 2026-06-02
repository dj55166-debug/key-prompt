import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [showPw, setShowPw] = useState(false)

  // Supabase sends the user back with a session token in the URL hash.
  // The Supabase client picks it up automatically on page load.
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is authenticated and ready to set a new password.
      }
    })
  }, [])

  const handleUpdate = async () => {
    setError(null)
    if (password !== confirm) { setError(t('reset.mismatch')); return }
    if (password.length < 6) { setError(t('reset.tooShort')); return }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (err) { setError(err.message); return }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5 font-sans">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
          <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white mb-2">{t('reset.successTitle')}</h2>
          <p className="text-sm text-gray-400 mb-6">{t('reset.successDesc')}</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90"
          >
            {t('reset.goToLogin')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans">
      {/* Nav */}
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-4 flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-black">K</span>
        </div>
        <span className="font-bold text-sm text-white">{t('nav.keyPrompt')}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-8 max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">{t('reset.title')}</h1>
          <p className="text-sm text-gray-400">{t('reset.sub')}</p>
        </div>

        <div className="space-y-4">
          {/* New password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">{t('reset.newPassword')}</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 pr-10 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                  {showPw
                    ? <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    : <><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></>
                  }
                </svg>
              </button>
            </div>
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400">{t('reset.confirmPassword')}</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder-gray-600"
            />
          </div>

          {error && (
            <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-3">
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleUpdate}
            disabled={loading || !password || !confirm}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 mt-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t('reset.updating')}
              </>
            ) : t('reset.update')}
          </button>
        </div>
      </div>
    </div>
  )
}
