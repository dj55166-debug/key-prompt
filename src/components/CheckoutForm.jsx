import { useState } from 'react'
import {
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { supabase } from '../lib/supabase'

export default function CheckoutForm({ prompt, user, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/`,
      },
      redirect: 'if_required'
    })

    if (stripeError) {
      setError(stripeError.message)
      setLoading(false)
      return
    }

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      await supabase.from('purchases').insert({
        buyer_id: user.id,
        prompt_id: prompt.id,
        amount_paid: prompt.price,
        stripe_payment_id: paymentIntent.id,
        status: 'completed'
      })
      onSuccess()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="bg-rose-900/30 border border-rose-700/50 rounded-xl p-3">
          <p className="text-xs text-rose-400">{error}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 transition-all text-sm"
      >
        {loading ? 'Processing...' : `Pay $${prompt.price}`}
      </button>
      <p className="text-center text-xs text-gray-400">
        Secured by Stripe · Instant access after payment
      </p>
    </form>
  )
}