'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { ArrowLeft } from 'lucide-react';

const BG = '#F7F7F7';
const BLUE = '#2E2BFF';

function EnvelopeIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="25" width="100" height="65" rx="6" fill="white" stroke="#E0E0E0" strokeWidth="2"/>
      <path d="M10 31L60 62L110 31" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 90L42 62" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round"/>
      <path d="M110 90L78 62" stroke="#E0E0E0" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="90" cy="22" r="18" fill={BLUE}/>
      <path d="M83 22L88 27L97 17" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function SuccessIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="36" fill={BLUE}/>
      <path d="M26 40L35 49L54 30" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="20" cy="18" r="3" fill="#FF2BA6" opacity="0.7"/>
      <circle cx="62" cy="14" r="2" fill={BLUE} opacity="0.5"/>
      <circle cx="68" cy="50" r="3" fill="#FF2BA6" opacity="0.5"/>
      <circle cx="14" cy="55" r="2" fill={BLUE} opacity="0.4"/>
      <rect x="58" y="8" width="3" height="10" rx="1.5" fill="#333" opacity="0.3" transform="rotate(15 58 8)"/>
    </svg>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setSent(true);
      } else {
        const map: Record<string, string> = {
          'auth/invalid-email': 'Please enter a valid email address.',
          'auth/too-many-requests': 'Too many requests. Please wait a few minutes.',
          'auth/network-request-failed': 'Network error. Check your connection.',
        };
        setError(map[err.code] || 'Failed to send reset email. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = email.trim() && !isLoading;

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: BG }}>
        <div className="flex-1 flex flex-col items-center justify-between px-6 py-10 max-w-sm mx-auto w-full">
          <div className="w-full flex flex-col items-center text-center flex-1 justify-center">
            <div className="mb-8">
              <EnvelopeIllustration />
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: '#111' }}>Check your mail</h1>
            <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
              We&apos;ve sent a password reset link to{' '}
              <span style={{ color: '#444', fontWeight: 600 }}>
                {email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + '*'.repeat(Math.min(b.length, 4)) + c)}
              </span>
              . Click the link in your email to reset your password.
            </p>
            <p className="text-xs mt-3" style={{ color: '#AAA' }}>
              Check your spam folder if you don&apos;t see it.
            </p>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={() => router.replace('/sign-in')}
              className="w-full font-semibold text-base text-white"
              style={{ background: BLUE, borderRadius: '50px', border: 'none', cursor: 'pointer', padding: '18px 24px' }}>
              Back to Sign In
            </button>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="w-full text-sm text-center"
              style={{ color: '#999', background: 'none', border: 'none', cursor: 'pointer', padding: '12px' }}>
              Try a different email
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-10 max-w-sm mx-auto w-full">

        <div className="w-full">
          <button
            onClick={() => router.back()}
            className="flex items-center mb-10"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}>
            <ArrowLeft className="w-5 h-5" />
          </button>

          <h1 className="text-2xl font-bold mb-2" style={{ color: '#111' }}>
            Forgot your password?
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#666' }}>
            That&apos;s okay. Enter your email and we&apos;ll send you a code to reset your password.
          </p>

          {error && (
            <div className="mt-5 px-4 py-3 rounded-2xl text-sm"
              style={{ background: 'rgba(239,68,68,0.07)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form id="forgot-form" onSubmit={handleSubmit} className="mt-8">
            <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              required
              autoComplete="email"
              autoFocus
              className="auth-input"
            />
          </form>
        </div>

        <div className="w-full space-y-3">
          <button
            type="submit"
            form="forgot-form"
            disabled={!canSubmit}
            className="w-full font-semibold text-base text-white transition-colors"
            style={{
              background: canSubmit ? BLUE : '#C8C8C8',
              borderRadius: '50px',
              border: 'none',
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              padding: '18px 24px',
            }}>
            {isLoading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
              : 'Send Code'}
          </button>

          <p className="text-center text-sm" style={{ color: '#666' }}>
            Have trouble Signing in?{' '}
            <Link href="/sign-in" style={{ color: BLUE, fontWeight: 600 }}>Get Help</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
