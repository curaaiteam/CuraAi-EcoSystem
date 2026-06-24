'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { Eye, EyeOff, ArrowLeft, Mail } from 'lucide-react';

const BG = '#F7F7F7';
const BLUE = '#2E2BFF';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const { user, loading, initialized } = useAuthStore();
  const [step, setStep] = useState<'picker' | 'email'>('picker');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialized && !loading && user) router.replace('/chat');
  }, [user, loading, initialized, router]);

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setIsLoading(true);
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const { user: fu } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      if (fullName) await updateProfile(fu, { displayName: fullName });
      try { await sendEmailVerification(fu); } catch {}
      router.replace('/onboarding');
    } catch (err: any) {
      const map: Record<string, string> = {
        'auth/email-already-in-use': 'An account with this email already exists.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/operation-not-allowed': 'Email sign-up is not enabled.',
      };
      setError(map[err.code] || 'Sign up failed. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.replace('/onboarding');
    } catch (err: any) {
      if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/unauthorized-domain') {
        setError('Google sign-in is not yet enabled for this domain.');
      } else if (err.code !== 'auth/popup-closed-by-user') {
        setError('Google sign-up failed. Please try email sign-up instead.');
      }
    } finally { setIsGoogleLoading(false); }
  };

  const canSubmit = email.trim() && password && !isLoading;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      <div className="flex-1 flex flex-col items-center justify-between px-6 py-10 max-w-sm mx-auto w-full">

        {/* Top section */}
        <div className="w-full">
          {step === 'email' && (
            <button
              onClick={() => { setStep('picker'); setError(''); }}
              className="flex items-center mb-8"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111' }}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src="/logo.png" alt="CuraAI"
              className="object-contain"
              style={{ width: '96px', height: '96px' }}
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.src = '/logo-and-name.png';
                el.style.width = '160px';
                el.style.height = '48px';
              }} />
          </div>

          {/* Heading */}
          <div className="text-center mb-10">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#111' }}>
              Create an Account
            </h1>
            <p className="text-sm" style={{ color: '#999' }}>
              Sign up to enjoy a personalized Cura experience.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl text-sm text-center"
              style={{ background: 'rgba(239,68,68,0.07)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          {/* Email form */}
          {step === 'email' && (
            <form id="signup-form" onSubmit={handleEmailSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Email Address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="james@example.com" required autoComplete="email" autoFocus
                  className="auth-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>First Name</label>
                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                  placeholder="Jamie" autoComplete="given-name" className="auth-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Last Name</label>
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  placeholder="Lewis" autoComplete="family-name" className="auth-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#333' }}>Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••" required autoComplete="new-password"
                    className="auth-input pr-12" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#AAA' }}>
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {password && password.length < 6 && (
                  <p className="mt-1.5 text-xs" style={{ color: '#EF4444' }}>
                    ⓘ Password must be at least 6 characters
                  </p>
                )}
              </div>
            </form>
          )}
        </div>

        {/* Bottom — buttons */}
        <div className="w-full space-y-3 mt-8">
          {step === 'picker' ? (
            <>
              <button
                onClick={() => setStep('email')}
                className="w-full flex items-center justify-center gap-3 font-semibold text-base text-white"
                style={{ background: BLUE, borderRadius: '50px', border: 'none', cursor: 'pointer', padding: '18px 24px' }}>
                <Mail className="w-5 h-5" />
                Continue with mail
              </button>

              <button
                onClick={handleGoogleSignUp}
                disabled={isGoogleLoading}
                className="w-full flex items-center justify-center gap-3 font-medium text-base disabled:opacity-60"
                style={{ background: '#EBEBEB', borderRadius: '50px', border: 'none', color: '#111', cursor: 'pointer', padding: '18px 24px' }}>
                {isGoogleLoading
                  ? <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-700 rounded-full animate-spin" />
                  : <GoogleIcon />}
                {isGoogleLoading ? 'Signing up...' : 'Continue with Google'}
              </button>
            </>
          ) : (
            <button
              type="submit"
              form="signup-form"
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
                : 'Continue'}
            </button>
          )}

          <p className="text-center text-sm pt-2" style={{ color: '#444' }}>
            Already have an account?{' '}
            <Link href="/sign-in" className="font-bold" style={{ color: BLUE }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
