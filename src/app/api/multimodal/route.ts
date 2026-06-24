import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.CURAAI_BACKEND_URL || 'https://curaaiteam-curaai.hf.space';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const email_id = formData.get('email_id') as string;
    const tier = formData.get('tier') as string;
    const plan = formData.get('plan') as string;
    const session_id = formData.get('session_id') as string;
    const file = formData.get('file') as File;
    const text = formData.get('text') as string;

    if (!email_id || !session_id || !file) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Forward to backend
    const backendForm = new FormData();
    backendForm.append('email_id', email_id);
    backendForm.append('tier', tier || 'free');
    backendForm.append('plan', plan || 'free');
    backendForm.append('session_id', session_id);
    backendForm.append('file', file);
    if (text) backendForm.append('text', text);

    const response = await fetch(`${BACKEND_URL}/multimodal`, {
      method: 'POST',
      body: backendForm,
      signal: AbortSignal.timeout(90000), // 90s for file processing
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Multimodal backend error:', response.status, errorText);
      return NextResponse.json(
        { reply: 'I had trouble processing your file. Please try again.' },
        { status: 200 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Multimodal API error:', error);
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return NextResponse.json(
        { reply: 'File processing is taking too long. Please try with a smaller file.' },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { reply: 'Something went wrong processing your file. Please try again.' },
      { status: 200 }
    );
  }
}
