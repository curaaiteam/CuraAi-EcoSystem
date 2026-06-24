import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json({ error: 'Email, subject, and message are required.' }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER || 'curaai.team@gmail.com';
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailPass) {
      console.error('GMAIL_APP_PASSWORD is not set');
      return NextResponse.json({ error: 'Email service not configured.' }, { status: 503 });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    await transporter.sendMail({
      from: `"CuraAI Feedback" <${gmailUser}>`,
      to: 'curaai.team@gmail.com',
      replyTo: email,
      subject: `[Feedback] ${subject}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #2E2BFF; margin-top: 0;">New Feedback Received</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #555; width: 80px;">From:</td>
              <td style="padding: 8px 0; color: #111;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #555;">Subject:</td>
              <td style="padding: 8px 0; color: #111;">${subject}</td>
            </tr>
          </table>
          <div style="background: #f5f5f5; border-radius: 10px; padding: 20px;">
            <p style="margin: 0; color: #333; white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          <p style="margin-top: 24px; font-size: 12px; color: #999;">Sent via CuraAI Feedback Form</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Feedback email error:', err);
    return NextResponse.json({ error: 'Failed to send feedback. Please try again.' }, { status: 500 });
  }
}
