'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAuthStore } from '@/store/authStore';
  import { AlertCircle, CheckCircle } from 'lucide-react';

  const BLUE = '#2E2BFF';

  export default function CancelSubscriptionPage() {
    const router = useRouter();
    const { user, profile, refreshProfile } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [cancelled, setCancelled] = useState(false);

    const nextRenewal = (() => {
      const d = new Date();
      const isMonthly = profile?.billing_cycle === 'monthly';
      const isAnnual = profile?.billing_cycle === 'annual';
      if (isMonthly) d.setMonth(d.getMonth() + 1);
      else if (isAnnual) d.setFullYear(d.getFullYear() + 1);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    const handleCancel = async () => {
      if (!user) return;
      setLoading(true); setError('');
      try {
        const res = await fetch('/api/paystack/cancel', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: user.uid, user_email: user.email }),
        });
        const data = await res.json();
        if (data.success) {
          await refreshProfile(user.uid);
          setCancelled(true);
        } else {
          setError(data.error || 'Cancellation failed. Please try again.');
        }
      } catch { setError('Something went wrong. Please try again.'); }
      finally { setLoading(false); }
    };

    // ── Success state ──
    if (cancelled) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24, padding: '0 24px' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={40} color="#22C55E" strokeWidth={1.5}/>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Subscription Cancelled</h1>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
                Your cancellation has been processed.<br/>
                You'll keep full Pro access until<br/>
                <strong style={{ color: 'var(--text-primary)' }}>{nextRenewal}</strong>.
              </p>
            </div>
            <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 16, width: '100%', maxWidth: 360 }}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0, lineHeight: 1.6 }}>
                After that date, your account will move to the Free plan (50 messages/day). You can resubscribe anytime from My Plans.
              </p>
            </div>
          </div>
          <div style={{ padding: '0 20px 32px', maxWidth: 420, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button onClick={() => router.push('/chat')}
              style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
              Continue chatting
            </button>
            <button onClick={() => router.push('/plans')}
              style={{ width: '100%', padding: '16px', borderRadius: 999, border: '1.5px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
              View My Plans
            </button>
          </div>
        </div>
      );
    }

    // ── Confirm cancel state ──
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 28, padding: '0 24px' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(239,68,68,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <AlertCircle size={40} color="#EF4444" strokeWidth={1.5}/>
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Cancel Subscription?</h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.6 }}>
              You'll lose access to these Pro benefits<br/>after <strong style={{ color: 'var(--text-primary)' }}>{nextRenewal}</strong>:
            </p>
          </div>

          {/* What they'll lose */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 18, padding: 20, width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['😊', 'Unlimited chatting', 'Back to 50 messages/day'],
              ['🔄', 'No cooldowns', 'Cooldowns will apply again'],
              ['🛡️', 'Priority response', 'Standard response speed'],
            ].map(([icon, title, sub]) => (
              <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>{title}</p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{sub}</p>
                </div>
                <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <line x1="2" y1="2" x2="8" y2="8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="8" y1="2" x2="2" y2="8" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 14, textAlign: 'center' }}>{error}</p>}
        </div>

        <div style={{ padding: '0 20px 32px', maxWidth: 420, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => router.back()}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
            Keep My Plan
          </button>
          <button onClick={handleCancel} disabled={loading}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: '1.5px solid rgba(239,68,68,0.35)', background: 'rgba(239,68,68,0.06)', color: '#EF4444', fontWeight: 600, fontSize: 16, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Cancelling…' : 'Cancel Subscription'}
          </button>
        </div>
      </div>
    );
  }
  