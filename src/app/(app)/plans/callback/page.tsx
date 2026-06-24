'use client';

  import { useEffect, useState, Suspense } from 'react';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { useAuthStore } from '@/store/authStore';

  const BLUE = '#2E2BFF';
  const PINK = '#FF2BA6';

  function SuccessIcon() {
    return (
      <svg width="140" height="130" viewBox="0 0 140 130" fill="none">
        <circle cx="22" cy="65" r="4" fill={BLUE} opacity="0.7"/>
        <circle cx="38" cy="28" r="3" fill={PINK} opacity="0.7"/>
        <circle cx="112" cy="32" r="4" fill={PINK} opacity="0.5"/>
        <circle cx="126" cy="72" r="3" fill={BLUE} opacity="0.5"/>
        <circle cx="108" cy="90" r="2.5" fill={BLUE} opacity="0.4"/>
        <circle cx="32" cy="95" r="3" fill={PINK} opacity="0.4"/>
        <path d="M42 58 Q36 47 44 39" stroke="var(--border-color)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <path d="M98 58 Q106 47 98 39" stroke="var(--border-color)" strokeWidth="2" fill="none" strokeLinecap="round"/>
        <polygon points="70,12 53,54 87,54" fill="var(--text-secondary)" stroke="var(--text-muted)" strokeWidth="1"/>
        <line x1="58" y1="44" x2="82" y2="44" stroke="white" strokeWidth="2"/>
        <circle cx="70" cy="12" r="5" fill="var(--text-muted)"/>
        <circle cx="70" cy="82" r="24" fill={BLUE}/>
        <polyline points="58,82 67,91 84,70" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
    );
  }

  function FailIcon() {
    return (
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 112, height: 112 }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--input-bg)' }}/>
        <div style={{ position: 'absolute', width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#EF4444' }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <line x1="7" y1="7" x2="21" y2="21" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            <line x1="21" y1="7" x2="7" y2="21" stroke="white" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
    );
  }

  function Spinner() {
    return (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
        <style>{'@keyframes spin { to { transform: rotate(360deg) } }'}</style>
        <circle cx="24" cy="24" r="20" stroke="var(--border-light)" strokeWidth="4"/>
        <path d="M44 24 A20 20 0 0 0 24 4" stroke={BLUE} strokeWidth="4" strokeLinecap="round"/>
      </svg>
    );
  }

  type ViewState = 'redirecting' | 'processing' | 'success' | 'failed';

  function CallbackContent() {
    const router = useRouter();
    const params = useSearchParams();
    const { user, refreshProfile } = useAuthStore();

    const ref = params.get('ref') || params.get('trxref') || params.get('reference') || '';
    const plan = params.get('plan') || 'monthly';
    const isAnnual = plan === 'annual';
    const amountFmt = isAnnual ? '₦114,000' : '₦9,500';
    const cycle = isAnnual ? 'Annually' : 'Monthly';
    const nextRenewal = (() => {
      const d = new Date();
      if (isAnnual) d.setFullYear(d.getFullYear() + 1); else d.setMonth(d.getMonth() + 1);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    const [view, setView] = useState<ViewState>('redirecting');
    const [txRef, setTxRef] = useState(ref);

    useEffect(() => {
      const paystackRef = params.get('trxref') || params.get('reference');
      if (paystackRef) {
        setTxRef(paystackRef);
        setView('processing');
        verifyPayment(paystackRef);
      } else if (ref) {
        setTimeout(() => setView('processing'), 1500);
      }
    }, []);

    const verifyPayment = async (reference: string) => {
      try {
        const res = await fetch('/api/paystack/verify', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference, user_id: user?.uid, user_email: user?.email }),
        });
        const data = await res.json();
        if (data.success) { if (user) await refreshProfile(user.uid); setView('success'); }
        else setView('failed');
      } catch { setView('failed'); }
    };

    const centerStyle: React.CSSProperties = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 24px', background: 'var(--page-bg)', position: 'relative' };
    const decoFigure = (
      <div style={{ position: 'absolute', bottom: 40, opacity: 0.2 }}>
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
          <path d="M50 10 C30 10 15 25 15 45 C15 65 25 80 40 88 L40 100 L60 100 L60 88 C75 80 85 65 85 45 C85 25 70 10 50 10Z" stroke={PINK} strokeWidth="1.5" fill="none"/>
          <path d="M30 45 Q30 35 40 32" stroke={PINK} strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
    );

    if (view === 'redirecting') return (
      <div style={centerStyle}>
        <Spinner />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Redirecting to secure checkout…</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Secured by Paystack. Please don't close this page.</p>
        </div>
        {decoFigure}
      </div>
    );

    if (view === 'processing') return (
      <div style={centerStyle}>
        <Spinner />
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Processing your upgrade…</p>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 6 }}>Please wait while we upgrade your account.</p>
        </div>
        {decoFigure}
      </div>
    );

    const displayRef = txRef.length > 12 ? txRef.substring(0,12)+'XX' : txRef;
    const rowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

    if (view === 'success') return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '56px 20px 24px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <button onClick={() => router.push('/plans')} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 15 }}>←</button>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center', marginTop: 16 }}>
            <SuccessIcon />
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Welcome to Cura Pro</h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }}>Your upgrade was successful. You now have<br/>full access to premium features.</p>
            </div>
          </div>
          <div style={{ width: '100%', background: 'var(--card-bg)', borderRadius: 20, padding: 20 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Billing Information</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([['Plan','Cura Pro'],['Amount',amountFmt],['Billing Cycle',cycle],['Next Renewal',nextRenewal],['Transaction Ref',displayRef]] as const).map(([l,v]) => (
                <div key={l} style={rowStyle}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '0 20px 32px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <button onClick={() => router.push('/chat')}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
            Continue chatting
          </button>
        </div>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)', position: 'relative' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 32, padding: '0 20px' }}>
          <button onClick={() => router.push('/plans')} style={{ position: 'absolute', top: 56, left: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 15 }}>←</button>
          <FailIcon />
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Payment Not Completed</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.6 }}>We couldn't confirm your payment.<br/>Please try again.</p>
          </div>
        </div>
        <div style={{ padding: '0 20px 32px', maxWidth: 420, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => router.push('/plans/choose')}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
            Try Again
          </button>
          <button onClick={() => router.push('/plans')}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: '1.5px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
            View My Plans
          </button>
        </div>
      </div>
    );
  }

  export default function CallbackPage() {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)', color: 'var(--text-muted)' }}>Loading…</div>}>
        <CallbackContent />
      </Suspense>
    );
  }
  