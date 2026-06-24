'use client';

  import { Suspense, useState } from 'react';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { useAuthStore } from '@/store/authStore';
  import { ArrowLeft, Lock } from 'lucide-react';

  const BLUE = '#2E2BFF';
  const PINK = '#FF2BA6';

  function CuraProBadge() {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg viewBox="0 0 32 32" fill="none" style={{ width: 28, height: 28 }}>
          <path d="M16 4 C10 4 6 8 6 13 C6 18 10 22 16 26 C22 22 26 18 26 13 C26 8 22 4 16 4Z" fill={BLUE}/>
          <circle cx="19" cy="13" r="5" fill={PINK}/>
          <circle cx="19" cy="13" r="3" fill="white" opacity="0.9"/>
        </svg>
        <span style={{ color: BLUE, fontWeight: 700, fontSize: 16 }}>Cura Pro</span>
      </div>
    );
  }

  function SwitchContent() {
    const router = useRouter();
    const params = useSearchParams();
    const { user } = useAuthStore();

    const fromCycle = params.get('from') || 'monthly';
    const toPlan = params.get('plan') || 'annual';
    const amount = parseInt(params.get('amount') || '114000', 10);
    const isToAnnual = toPlan === 'annual';

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const newAmountFmt = isToAnnual ? '₦114,000' : '₦9,500';
    const newCycle = isToAnnual ? 'Annually' : 'Monthly';
    const newPeriod = isToAnnual ? '/year' : '/month';
    const nextRenewal = (() => {
      const d = new Date();
      if (isToAnnual) d.setFullYear(d.getFullYear() + 1);
      else d.setMonth(d.getMonth() + 1);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    const handleConfirm = async () => {
      if (!user) { router.push('/sign-in'); return; }
      setLoading(true); setError('');
      try {
        const reference = 'CURA-' + Math.random().toString(36).substring(2, 10).toUpperCase();
        const res = await fetch('/api/paystack/initialize', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email, amount, plan: toPlan, tier: 'pro',
            billing_cycle: toPlan, reference,
            callback_url: `${window.location.origin}/plans/callback?ref=${reference}&plan=${toPlan}&amount=${amount}`,
            metadata: { plan: toPlan, tier: 'pro', billing_cycle: toPlan, user_email: user.email, user_id: user.uid, is_switch: true, from_cycle: fromCycle },
          }),
        });
        const data = await res.json();
        const authUrl = data.data?.authorization_url || data.authorization_url;
        if (authUrl) {
          router.push(`/plans/confirm?ref=${reference}&plan=${toPlan}&amount=${amount}&url=${encodeURIComponent(authUrl)}`);
        } else {
          setError(data.error || 'Failed to initialize. Please try again.');
        }
      } catch { setError('Something went wrong. Please try again.'); }
      finally { setLoading(false); }
    };

    const row = (label: string, value: string) => (
      <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
      </div>
    );

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, padding: '56px 20px 24px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={22}/>
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Switch Billing Cycle</h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                {fromCycle === 'monthly' ? 'Monthly → Annual' : 'Annual → Monthly'}
              </p>
            </div>
          </div>

          {/* From → To comparison */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ flex: 1, background: 'var(--card-bg)', borderRadius: 16, padding: 16, border: '1.5px solid var(--border-light)' }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', margin: '0 0 6px' }}>CURRENT</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>
                {fromCycle === 'monthly' ? 'Monthly' : 'Annual'}
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', margin: '4px 0 0' }}>
                {fromCycle === 'monthly' ? '₦9,500' : '₦114,000'}
              </p>
            </div>
            <div style={{ fontSize: 24, color: BLUE, fontWeight: 700 }}>→</div>
            <div style={{ flex: 1, background: 'var(--plan-gradient)', borderRadius: 16, padding: 16, border: `1.5px solid ${BLUE}` }}>
              <p style={{ fontSize: 11, color: BLUE, margin: '0 0 6px', fontWeight: 600 }}>NEW</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: BLUE, margin: 0 }}>{newCycle}</p>
              <p style={{ fontSize: 18, fontWeight: 700, color: BLUE, margin: '4px 0 0' }}>{newAmountFmt}</p>
            </div>
          </div>

          {/* New plan card */}
          <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--plan-gradient)' }}>
            <div style={{ padding: 16 }}><CuraProBadge /></div>
            <div style={{ background: 'var(--card-bg)', margin: '0 12px 12px', borderRadius: 16, padding: 16 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 14px' }}>New Billing Information</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {row('Plan', 'Cura Pro')}
                {row('New Amount', newAmountFmt + newPeriod)}
                {row('Billing Cycle', newCycle)}
                {row('Next Renewal', nextRenewal)}
              </div>
            </div>
          </div>

          {isToAnnual && (
            <div style={{ background: 'rgba(46,43,255,0.06)', borderRadius: 14, padding: '12px 16px', border: '1px solid rgba(46,43,255,0.12)' }}>
              <p style={{ fontSize: 13, color: BLUE, margin: 0, fontWeight: 500 }}>
                🎉 Switching to annual saves you 2 months — that's ₦19,000 in savings every year.
              </p>
            </div>
          )}

          {error && <p style={{ color: '#ef4444', fontSize: 14, textAlign: 'center' }}>{error}</p>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <Lock size={14}/> Secure Transaction
          </div>
        </div>

        <div style={{ padding: '0 20px 32px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <button onClick={handleConfirm} disabled={loading}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.8 : 1 }}>
            {loading ? 'Processing…' : `Confirm & Pay ${newAmountFmt}`}
          </button>
        </div>
      </div>
    );
  }

  export default function SwitchPlanPage() {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)', color: 'var(--text-muted)' }}>Loading…</div>}>
        <SwitchContent />
      </Suspense>
    );
  }
  