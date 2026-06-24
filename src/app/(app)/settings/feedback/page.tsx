'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Send, CheckCircle } from 'lucide-react';

export default function FeedbackPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const isValid = email.trim() && subject.trim() && message.trim();

  const handleSend = async () => {
    if (!isValid) return;
    setSending(true);
    setError('');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), subject: subject.trim(), message: message.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send feedback');
      }

      setSent(true);
      setTimeout(() => router.back(), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--card-bg)', fontFamily: 'inherit' }}>
        <div style={{ textAlign: 'center', padding: 'clamp(24px, 8vw, 48px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <CheckCircle size={52} color="#34C759" strokeWidth={1.5} />
          </div>
          <h2 style={{ fontSize: 'clamp(17px, 4vw, 22px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>Thank you!</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', margin: 0 }}>Your feedback has been sent to the Cura team.</p>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 14px',
    border: '1.5px solid var(--border-color)',
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'inherit',
    outline: 'none',
    boxSizing: 'border-box',
    background: 'var(--page-bg)',
    color: 'var(--text-primary)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 500,
    color: 'var(--text-muted)',
    marginBottom: 8,
    display: 'block',
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: 'inherit' }}>
      {/* Header */}
      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
          <button
            onClick={() => router.back()}
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4 }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Feedback</span>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px)' }}>
        {/* Intro */}
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.6 }}>
          We'd love to hear from you. Share your thoughts, report a bug, or suggest a feature — our team reads every message.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 'clamp(14px, 4vw, 20px)' }}>
            <label style={labelStyle}>Your email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          {/* Subject */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 'clamp(14px, 4vw, 20px)' }}>
            <label style={labelStyle}>Subject</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="What's this about?"
              style={inputStyle}
            />
          </div>

          {/* Message */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 12, padding: 'clamp(14px, 4vw, 20px)' }}>
            <label style={labelStyle}>Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Tell us what's on your mind..."
              rows={6}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 140 }}
            />
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 13, color: '#FF3B30', marginTop: 12, textAlign: 'center' }}>{error}</p>
        )}

        <button
          onClick={handleSend}
          disabled={sending || !isValid}
          style={{
            marginTop: 20,
            width: '100%',
            padding: 'clamp(14px, 4vw, 18px)',
            borderRadius: 99,
            border: 'none',
            background: '#2E2BFF',
            color: '#fff',
            fontSize: 16,
            fontWeight: 600,
            cursor: isValid && !sending ? 'pointer' : 'not-allowed',
            fontFamily: 'inherit',
            opacity: (!isValid || sending) ? 0.5 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
          <Send size={17} />
          {sending ? 'Sending...' : 'Send Feedback'}
        </button>
      </div>
    </div>
  );
}
