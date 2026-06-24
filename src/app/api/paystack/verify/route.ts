import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { reference, user_id, user_email } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: 'Payment configuration error' }, { status: 500 });
    }

    // Verify with Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${secretKey}` },
    });

    const data = await response.json();

    if (!data.status || data.data?.status !== 'success') {
      return NextResponse.json({ success: false, error: 'Payment verification failed' }, { status: 400 });
    }

    const metadata = data.data?.metadata || {};
    const plan = metadata.plan || 'monthly';
    const tier = metadata.tier || 'pro';
    const billing_cycle = metadata.billing_cycle || 'monthly';
    const amount = data.data.amount / 100;

    // Calculate renewal date
    const startDate = new Date();
    const renewalDate = new Date(startDate);
    if (billing_cycle === 'annual') {
      renewalDate.setFullYear(renewalDate.getFullYear() + 1);
    } else {
      renewalDate.setMonth(renewalDate.getMonth() + 1);
    }

    // Update profile
    if (user_id) {
      await supabase.from('profiles').update({
        tier,
        plan,
        subscription_status: 'active',
        billing_cycle,
      }).eq('id', user_id);

      // Record subscription
      await supabase.from('subscriptions').insert({
        user_id,
        paystack_reference: reference,
        plan,
        tier,
        billing_cycle,
        amount,
        status: 'active',
        start_date: startDate.toISOString(),
        next_renewal_date: renewalDate.toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      plan,
      tier,
      billing_cycle,
      amount,
    });
  } catch (error) {
    console.error('Paystack verify error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
