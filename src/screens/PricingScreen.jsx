import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { loadStripe } from '@stripe/stripe-js'
import { supabase } from '../lib/supabase'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

const PRICE_IDS = {
  monthly: import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID || '',
  yearly: import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID || '',
}

export default function PricingScreen({ user }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [billing, setBilling] = useState('monthly')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const monthlyPrice = '€5.99'
  const yearlyPrice = '€49.99'
  const yearlyMonthly = '€4.17'

  const supabaseUrl = 'https://xwcrzedgekurwoykbcys.supabase.co'
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Y3J6ZWRnZWt1cndveWtiY3lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MzI0ODUsImV4cCI6MjA5NTEwODQ4NX0.JaZ9iOC85C1dZFn70ncFgxaGEf3gX9NVvHbAzhqQv9s'

  const handleUpgrade = async () => {
    if (!user) { navigate('/login'); return }
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { navigate('/login'); return }

      const isYearly = billing === 'yearly'
      const priceId = isYearly
        ? import.meta.env.VITE_STRIPE_PRO_YEARLY_PRICE_ID
        : import.meta.env.VITE_STRIPE_PRO_MONTHLY_PRICE_ID
      if (!priceId) throw new Error('Price ID not configured')

      const token = session.access_token || supabaseKey

      const response = await fetch(
        `${supabaseUrl}/functions/v1/create-subscription`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'apikey': supabaseKey,
          },
          body: JSON.stringify({
            priceId,
            successUrl: window.location.origin + '/?upgraded=true',
            cancelUrl: window.location.origin + '/pricing',
          }),
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Stripe function error:', response.status, errorText)
        throw new Error(`Payment service error: ${response.status}`)
      }

      const data = await response.json()
      if (data?.url) {
        window.location.href = data.url
      } else {
        throw new Error(data?.error || 'No checkout URL returned')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const FREE_FEATURES = [
    t('pricing.free.f1'),
    t('pricing.free.f2'),
    t('pricing.free.f3'),
    t('pricing.free.f4'),
  ]

  const PRO_FEATURES = [
    t('pricing.pro.f1'),
    t('pricing.pro.f2'),
    t('pricing.pro.f3'),
    t('pricing.pro.f4'),
    t('pricing.pro.f5'),
    t('pricing.pro.f6'),
  ]

  return (
    <div className="min-h-screen bg-gray-950 font-sans text-white">

      {/* Nav */}
      <nav className="border-b border-gray-800 bg-gray-950 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white p-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <div onClick={() => navigate('/')} className="flex items-center gap-2 flex-1 cursor-pointer">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-md flex items-center justify-center">
              <span className="text-white text-xs font-black">K</span>
            </div>
            <span className="font-bold text-sm">{t('nav.keyPrompt')}</span>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">{t('pricing.title')}</h1>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">{t('pricing.sub')}</p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                billing === 'monthly'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/50'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {t('pricing.monthly')}
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all relative ${
                billing === 'yearly'
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-900/50'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {t('pricing.yearly')}
              <span className="absolute -top-2 -end-2 bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
                -30%
              </span>
            </button>
          </div>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">

          {/* Free plan */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-gray-500 to-gray-600" />
            <div className="p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">{t('pricing.free.name')}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">€0</span>
              </div>
              <p className="text-xs text-gray-500 mb-6">{t('pricing.free.desc')}</p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl text-sm font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all mb-6"
              >
                {t('pricing.free.cta')}
              </button>
              <ul className="space-y-2.5">
                {FREE_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pro plan */}
          <div className="relative bg-gray-900 border border-violet-500 rounded-2xl overflow-hidden shadow-xl shadow-violet-900/30">
            <div className="bg-violet-600 text-white text-center py-1.5 text-xs font-bold">
              {t('pricing.pro.badge')}
            </div>
            <div className="h-1 bg-gradient-to-r from-violet-500 to-indigo-600" />
            <div className="p-6">
              <p className="text-xs font-bold text-violet-400 uppercase tracking-wide mb-1">{t('pricing.pro.name')}</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">
                  {billing === 'monthly' ? monthlyPrice : yearlyMonthly}
                </span>
                <span className="text-gray-500 text-sm mb-1">/ {t('pricing.mo')}</span>
              </div>
              {billing === 'yearly' && (
                <p className="text-xs text-gray-500 mb-1">
                  {t('pricing.billedYearly', { price: yearlyPrice })}
                </p>
              )}
              <p className="text-xs text-gray-500 mb-6">{t('pricing.pro.desc')}</p>

              {error && (
                <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-rose-400">{error}</p>
                </div>
              )}

              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 active:scale-95 disabled:opacity-60 transition-all mb-6 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('common.loading')}
                  </>
                ) : t('pricing.pro.cta')}
              </button>

              <ul className="space-y-2.5">
                {PRO_FEATURES.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-violet-400 flex-shrink-0 mt-0.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust line */}
        <p className="text-center text-xs text-gray-600">
          {t('pricing.trust')}
        </p>
      </div>
    </div>
  )
}
