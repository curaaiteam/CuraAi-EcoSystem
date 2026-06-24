import { NextRequest, NextResponse } from 'next/server';
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  export async function POST(req: NextRequest) {
    try {
      const { subscription, userId } = await req.json();
      if (!subscription || !userId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

      const { error } = await supabase.from('push_subscriptions').upsert(
        { user_id: userId, subscription: JSON.stringify(subscription), last_seen_at: new Date().toISOString() },
        { onConflict: 'user_id' }
      );

      if (error) console.error('push subscribe error:', error);
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  export async function PATCH(req: NextRequest) {
    try {
      const { userId } = await req.json();
      if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
      await supabase.from('push_subscriptions').update({ last_seen_at: new Date().toISOString() }).eq('user_id', userId);
      return NextResponse.json({ ok: true });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }
  