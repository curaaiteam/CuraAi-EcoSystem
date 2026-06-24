import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('x-paystack-signature') || '';
  const secretKey = process.env.PAYSTACK_SECRET_KEY || '';

  const hash = crypto.createHmac('sha512', secretKey).update(body).digest('hex');
  if (hash !== signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const event = JSON.parse(body);

  if (event.event === 'charge.success') {
    const { metadata, status, reference, amount } = event.data;
    if (status === 'success' && metadata?.user_email) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', metadata.user_email)
        .single();

      if (profile) {
        const plan = metadata.plan || 'monthly';
        const tier = metadata.tier || 'pro';
        const billing_cycle = metadata.billing_cycle || 'monthly';
        const renewalDate = new Date();
        if (billing_cycle === 'annual') {
          renewalDate.setFullYear(renewalDate.getFullYear() + 1);
        } else {
          renewalDate.setMonth(renewalDate.getMonth() + 1);
        }

        await supabase.from('profiles').update({
          tier, plan, subscription_status: 'active', billing_cycle,
        }).eq('id', profile.id);

        await supabase.from('subscriptions').upsert({
          user_id: profile.id,
          paystack_reference: reference,
          plan, tier, billing_cycle,
          amount: amount / 100,
          status: 'active',
          start_date: new Date().toISOString(),
          next_renewal_date: renewalDate.toISOString(),
        }, { onConflict: 'paystack_reference' });
      }
    }
  }

  return NextResponse.json({ received: true });
}
