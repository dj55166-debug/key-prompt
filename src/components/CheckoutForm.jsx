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

    if (!paymentIntent) {
      setError('Payment intent not created. Please try again.')
      setLoading(false)
      return
    }

    if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing') {
      try {
        const { error: insertErr } = await supabase.from('purchases').insert({
          buyer_id: user.id,
          prompt_id: prompt.id,
          amount_paid: prompt.price,
          stripe_payment_id: paymentIntent.id,
          status: paymentIntent.status === 'succeeded' ? 'completed' : 'pending'
        })
        if (insertErr) {
          setError('Payment recorded but purchase record failed. Contact support.')
          setLoading(false)
          return
        }
        onSuccess()
      } catch (err) {
        setError('Payment succeeded but database error occurred. Contact support.')
        setLoading(false)
        return
      }
    } else {
      setError(`Payment status: ${paymentIntent.status}. Please check your account.`)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : 'Pay now'}
      </button>
    </form>
  )
}
