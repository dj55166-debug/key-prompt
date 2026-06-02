// Supabase Edge Function — Create Stripe PaymentIntent
// Deploy with: supabase functions deploy create-payment-intent
// Set secrets: supabase secrets set STRIPE_SECRET_KEY=sk_live_...
//
// Handles 80/20 revenue split via Stripe Connect application_fee_amount.
// Creator must have completed Stripe Connect onboarding (stripe_account_id in profiles).

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@13.3.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { promptId, amount, authorId } = await req.json()

    // Verify the requesting user via JWT
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Look up the creator's Stripe Connect account
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', authorId)
      .single()

    const amountCents = Math.round(amount * 100) // amount in cents
    // 20% platform fee
    const applicationFee = Math.round(amountCents * 0.20)

    const paymentIntentParams: Stripe.PaymentIntentCreateParams = {
      amount: amountCents,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: {
        prompt_id: promptId,
        buyer_id: user.id,
        author_id: authorId,
      },
    }

    // If creator has a Stripe Connect account, route 80% to them
    if (profile?.stripe_account_id) {
      paymentIntentParams.application_fee_amount = applicationFee
      paymentIntentParams.transfer_data = {
        destination: profile.stripe_account_id,
      }
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams)

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
