import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'

function InputField({ label, type = 'text', placeholder, value, onChange, icon }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-400">{label}</label>
      <div className="relative">
        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</span>
        <input
          type={isPassword && show ? 'text' : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl ps-10 pe-10 py-3 text-sm text-white outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder-gray-600"
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)} className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
            {show ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

export default function AuthScreen() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [mode, setMode] = useState(
    searchParams.get('mode') === 'signup' ? 'signup' :
    searchParams.get('mode') === 'forgot' ? 'forgot' :
    'login'
  )
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [agreed, setAgreed] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async () => {
    setError(null)
    setLoading(true)
    try {
      if (mode === 'login') {
        const { error: err } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
        if (err) throw err
      } else if (mode === 'signup') {
        if (form.password !== form.confirm) throw new Error(t('auth.errors.mismatch'))
        if (!agreed) throw new Error(t('auth.errors.terms'))
        if (form.password.length < 6) throw new Error(t('auth.errors.tooShort'))
        const { error: err } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: { data: { full_name: form.name } }
        })
        if (err) throw err
        setSuccess(true)
      } else if (mode === 'forgot') {
        const { error: err } = await supabase.auth.resetPasswordForEmail(form.email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (err) throw err
        setSuccess(true)
      }
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
  }

  const switchMode = (m) => {
    setMode(m)
    setError(null)
    setSuccess(false)
    setForm({ name: '', email: '', password: '', confirm: '' })
  }

  const SuccessCard = ({ titleKey, descKey, desc2 }) => (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-5 font-sans">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-sm w-full text-center shadow-xl">
        <div className="w-16 h-16 bg-emerald-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-emerald-400">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-black text-white mb-2">{t(titleKey)}</h2>
        <p className="text-sm text-gray-400 mb-5">{t(descKey, { email: form.email })}{desc2}</p>
        <button onClick={() => switchMode('login')} className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3 rounded-xl text-sm hover:opacity-90">
          {t('auth.backToLogin')}
        </button>
      </div>
    </div>
  )

  if (success && mode === 'signup') return <SuccessCard titleKey="auth.checkEmail" descKey="auth.checkEmailDesc" />
  if (success && mode === 'forgot') return <SuccessCard titleKey="auth.emailSent" descKey="auth.emailSentDesc" />

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col font-sans">
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-4 flex items-center gap-2">
        <div className="w-7 h-7 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-black">K</span>
        </div>
        <span className="font-bold text-sm text-white">{t('nav.keyPrompt')}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center px-5 py-8 max-w-sm mx-auto w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-900/50">
            <span className="text-white text-2xl font-black">K</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-1">
            {mode === 'login' && t('auth.welcomeBack')}
            {mode === 'signup' && t('auth.createAccount')}
            {mode === 'forgot' && t('auth.resetPassword')}
          </h1>
          <p className="text-sm text-gray-500">
            {mode === 'login' && t('auth.signInSub')}
            {mode === 'signup' && t('auth.signUpSub')}
            {mode === 'forgot' && t('auth.forgotSub')}
          </p>
        </div>

        <div className="space-y-4">
          {mode !== 'forgot' && (
            <>
              <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-2.5 bg-gray-900 border border-gray-700 rounded-xl py-3 text-sm font-semibold text-gray-300 hover:bg-gray-800 active:scale-95 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                {t('auth.continueGoogle')}
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-800" />
                <span className="text-xs text-gray-600 font-medium">{t('auth.or')}</span>
                <div className="flex-1 h-px bg-gray-800" />
              </div>
            </>
          )}

          <div className="space-y-3">
            {mode === 'signup' && (
              <InputField label={t('auth.fullName')} placeholder="Awad" value={form.name} onChange={update('name')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
              />
            )}
            <InputField label={t('auth.email')} type="email" placeholder="you@example.com" value={form.email} onChange={update('email')}
              icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>}
            />
            {mode !== 'forgot' && (
              <InputField label={t('auth.password')} type="password" placeholder={t('auth.passwordPlaceholder')} value={form.password} onChange={update('password')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>}
              />
            )}
            {mode === 'signup' && (
              <InputField label={t('auth.confirmPassword')} type="password" placeholder={t('auth.confirmPlaceholder')} value={form.confirm} onChange={update('confirm')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
              />
            )}
          </div>

          {mode === 'login' && (
            <div className="text-end -mt-1">
              <button onClick={() => switchMode('forgot')} className="text-xs text-violet-400 font-medium hover:underline">
                {t('auth.forgotPassword')}
              </button>
            </div>
          )}

          {mode === 'signup' && (
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 accent-violet-600 w-4 h-4 flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                {t('auth.agreeTerms')} <span className="text-violet-400 font-medium">{t('auth.terms')}</span> {t('auth.and')} <span className="text-violet-400 font-medium">{t('auth.privacy')}</span>
              </span>
            </label>
          )}

          {error && (
            <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-3">
              <p className="text-xs text-rose-400 font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 mt-1"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {mode === 'login' ? t('auth.signingIn') : mode === 'signup' ? t('auth.creating') : t('auth.sending')}
              </>
            ) : (
              <>
                {mode === 'login' && t('auth.signIn')}
                {mode === 'signup' && t('auth.signUp')}
                {mode === 'forgot' && t('auth.sendReset')}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-600 pt-1">
            {mode === 'login' && (
              <>{t('auth.noAccount')}{' '}<button onClick={() => switchMode('signup')} className="text-violet-400 font-semibold hover:underline">{t('auth.signUpFree')}</button></>
            )}
            {mode === 'signup' && (
              <>{t('auth.haveAccount')}{' '}<button onClick={() => switchMode('login')} className="text-violet-400 font-semibold hover:underline">{t('auth.signIn')}</button></>
            )}
            {mode === 'forgot' && (
              <>{t('auth.rememberPassword')}{' '}<button onClick={() => switchMode('login')} className="text-violet-400 font-semibold hover:underline">{t('auth.backToLogin')}</button></>
            )}
          </p>
        </div>
      </div>

      <div className="text-center pb-6 px-4">
        <p className="text-[11px] text-gray-700">{t('auth.footer')}</p>
      </div>
    </div>
  )
}
