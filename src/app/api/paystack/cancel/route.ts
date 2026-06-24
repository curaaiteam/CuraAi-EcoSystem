import { NextRequest, NextResponse } from 'next/server';
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  export async function POST(req: NextRequest) {
    try {
      const { user_id, user_email } = await req.json();

      if (!user_id && !user_email) {
        return NextResponse.json({ error: 'Missing user identifier' }, { status: 400 });
      }

      // Find the profile
      let query = supabase.from('profiles').update({
        subscription_status: 'cancelled',
      });

      if (user_id) {
        query = query.eq('id', user_id);
      } else {
        query = query.eq('email', user_email);
      }

      const { error } = await query;

      if (error) {
        return NextResponse.json({ error: 'Failed to cancel subscription' }, { status: 500 });
      }

      // Also update the subscriptions table
      if (user_id) {
        await supabase
          .from('subscriptions')
          .update({ status: 'cancelled' })
          .eq('user_id', user_id)
          .eq('status', 'active');
      }

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  