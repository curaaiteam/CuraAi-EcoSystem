'use client';

  import { useEffect } from 'react';
  import { useRouter } from 'next/navigation';
  import { useAuthStore } from '@/store/authStore';
  import { ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

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

  export default function ManageSubscriptionPage() {
    const router = useRouter();
    const { profile, refreshProfile, user } = useAuthStore();

    useEffect(() => { if (user) refreshProfile(user.uid); }, [user]);

    const isPro = profile?.tier === 'pro';
    const isMonthly = profile?.billing_cycle === 'monthly';
    const isAnnual = profile?.billing_cycle === 'annual';
    const amount = isMonthly ? '₦9,500' : isAnnual ? '₦114,000' : '₦0';
    const cycle = isMonthly ? 'Monthly' : isAnnual ? 'Annually' : '—';
    const nextRenewal = (() => {
      const d = new Date();
      if (isMonthly) d.setMonth(d.getMonth() + 1);
      else if (isAnnual) d.setFullYear(d.getFullYear() + 1);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    if (!isPro) {
      router.replace('/plans');
      return null;
    }

    const row = (label: string, value: string) => (
      <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{value}</span>
      </div>
    );

    const switchLabel = isMonthly
      ? 'Switch to Annual — Save ₦0'
      : 'Switch to Monthly — ₦9,500/mo';

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, padding: '56px 20px 24px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <ArrowLeft size={22}/>
            </button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Manage Subscription</h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Make changes to your Cura Pro plan.</p>
            </div>
          </div>

          {/* Current plan card */}
          <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--plan-gradient)' }}>
            <div style={{ padding: 16 }}><CuraProBadge /></div>
            <div style={{ background: 'var(--card-bg)', margin: '0 12px 12px', borderRadius: 16, padding: 16 }}>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 12px' }}>Active Plan</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {row('Plan', 'Cura Pro')}
                {row('Amount', amount)}
                {row('Billing Cycle', cycle)}
                {row('Next Renewal', nextRenewal)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Plan Options</p>

            {/* Switch billing */}
            <button
              onClick={() => router.push(`/plans/manage/switch?from=${profile?.billing_cycle}&amount=${isMonthly ? 114000 : 9500}&plan=${isMonthly ? 'annual' : 'monthly'}`)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                width: '100%', padding: '18px 20px', borderRadius: 18,
                border: `1.5px solid var(--border-color)`,
                background: 'var(--card-bg)', cursor: 'pointer', textAlign: 'left',
              }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--plan-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <RefreshCw size={20} color={BLUE}/>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  {isMonthly ? 'Switch to Annual' : 'Switch to Monthly'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>
                  {isMonthly ? 'Pay ₦114,000/year — save 2 months free' : 'Pay ₦9,500 per month, cancel anytime'}
                </p>
              </div>
            </button>

            {/* Cancel subscription */}
            <button
              onClick={() => router.push('/plans/manage/cancel')}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                width: '100%', padding: '18px 20px', borderRadius: 18,
                border: '1.5px solid rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.04)', cursor: 'pointer', textAlign: 'left',
              }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <XCircle size={20} color="#EF4444"/>
              </div>
              <div>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#EF4444', margin: 0 }}>Cancel Subscription</p>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>You'll keep access until {nextRenewal}</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }
  