import { NextResponse } from 'next/server';
  import { createClient } from '@supabase/supabase-js';

  export async function POST() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!serviceKey || !url) {
      return NextResponse.json({ error: 'Missing Supabase service credentials' }, { status: 500 });
    }

    const admin = createClient(url, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // Check if bucket already exists
    const { data: buckets } = await admin.storage.listBuckets();
    const exists = buckets?.some(b => b.name === 'chat-images');
    if (exists) {
      return NextResponse.json({ ok: true, created: false });
    }

    // Create public bucket
    const { error } = await admin.storage.createBucket('chat-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'],
      fileSizeLimit: 10485760, // 10 MB
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, created: true });
  }
  