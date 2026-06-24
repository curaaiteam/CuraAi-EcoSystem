import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.CURAAI_BACKEND_URL || 'https://curaaiteam-curaai.hf.space';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_URL}/`, {
      method: 'GET',
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'degraded' }, { status: 200 });
    }

    const data = await response.json();

    if (data?.status === 'ok') {
      return NextResponse.json({ status: 'ok' });
    }

    return NextResponse.json({ status: 'degraded' });
  } catch (error) {
    return NextResponse.json({ status: 'offline' }, { status: 200 });
  }
}
