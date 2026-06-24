import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.CURAAI_BACKEND_URL || 'https://curaaiteam-curaai.hf.space';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email_id, tier, plan, session_id, query } = body;

    if (!email_id || !session_id || !query) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await fetch(`${BACKEND_URL}/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_id,
        tier: tier || 'free',
        plan: plan || 'free',
        session_id,
        query,
      }),
      signal: AbortSignal.timeout(60000), // 60s timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error:', response.status, errorText);
      return NextResponse.json(
        { reply: 'I\'m having trouble connecting. Please try again in a moment.' },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Chat API error:', error);
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return NextResponse.json(
        { reply: 'The response is taking longer than expected. Please try again.' },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { reply: 'Something went wrong. Please try again.' },
      { status: 200 }
    );
  }
}
