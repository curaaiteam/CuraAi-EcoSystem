import { NextResponse } from 'next/server';
  import webpush from 'web-push';
  import { createClient } from '@supabase/supabase-js';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  webpush.setVapidDetails(
    'mailto:hello@curaai.app',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const MESSAGES = [
    { title: 'CuraAi misses you 💙', body: "Hey! It's been a while. How are you feeling today? 😊" },
    { title: 'Checking in 🌟', body: "CuraAi is here whenever you're ready to chat. How's your day going?" },
    { title: 'Just thinking of you 💜', body: "Haven't heard from you in a bit — I'm always here when you need me." },
    { title: 'How are you doing? 🌸', body: "It's been over a day. Come tell Cura how you're really feeling." },
    { title: 'CuraAi says hi 👋', body: "Whenever you feel like talking, I'm right here. No pressure at all." },
  ];

  async function insertChatMessage(userId: string, messageBody: string) {
    try {
      // Find user's most recent conversation
      const { data: convs } = await supabase
        .from('conversations')
        .select('id')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (!convs || convs.length === 0) return; // No conversation yet, skip

      const conversationId = convs[0].id;

      // Insert assistant message into that conversation
      await supabase.from('messages').insert({
        id: crypto.randomUUID(),
        conversation_id: conversationId,
        role: 'assistant',
        content: messageBody,
        created_at: new Date().toISOString(),
      });
    } catch {
      // Non-fatal — push still goes out even if chat insert fails
    }
  }

  async function runNotifications() {
    try {
      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: subs, error } = await supabase
        .from('push_subscriptions')
        .select('*')
        .lt('last_seen_at', cutoff)
        .or(`last_notified_at.is.null,last_notified_at.lt.${cutoff}`);

      if (error) throw error;
      if (!subs || subs.length === 0) return NextResponse.json({ sent: 0 });

      let sent = 0;
      const expired: string[] = [];

      for (const sub of subs) {
        try {
          const parsed = JSON.parse(sub.subscription);
          const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

          await webpush.sendNotification(parsed, JSON.stringify(msg));

          // Also drop the same message into the user's chat
          await insertChatMessage(sub.user_id, msg.body);

          await supabase
            .from('push_subscriptions')
            .update({ last_notified_at: new Date().toISOString() })
            .eq('id', sub.id);

          sent++;
        } catch (e: any) {
          if (e.statusCode === 410 || e.statusCode === 404) expired.push(sub.id);
        }
      }

      if (expired.length > 0) await supabase.from('push_subscriptions').delete().in('id', expired);
      return NextResponse.json({ sent, expired: expired.length });
    } catch (e) {
      return NextResponse.json({ error: String(e) }, { status: 500 });
    }
  }

  export async function GET() { return runNotifications(); }
  export async function POST() { return runNotifications(); }
  