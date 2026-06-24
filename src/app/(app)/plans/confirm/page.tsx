'use client';

  import { Suspense } from 'react';
  import { useRouter, useSearchParams } from 'next/navigation';
  import { ArrowLeft } from 'lucide-react';

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

  function ConfirmContent() {
    const router = useRouter();
    const params = useSearchParams();
    const ref = params.get('ref') || 'CURA-XXXXXXXX';
    const plan = params.get('plan') || 'monthly';
    const url = params.get('url') || '';
    const isAnnual = plan === 'annual';
    const amountFmt = isAnnual ? '₦114,000' : '₦9,500';
    const cycle = isAnnual ? 'Annually' : 'Monthly';
    const nextRenewal = (() => {
      const d = new Date();
      if (isAnnual) d.setFullYear(d.getFullYear() + 1); else d.setMonth(d.getMonth() + 1);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    })();

    const rowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, padding: '56px 20px 24px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><ArrowLeft size={22}/></button>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Confirm Plan</h1>
          </div>

          <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--plan-gradient)' }}>
            <div style={{ padding: 16 }}><CuraProBadge /></div>
          </div>

          <div style={{ background: 'var(--card-bg)', borderRadius: 20, padding: 20 }}>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px' }}>Subscription</p>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 16px' }}>Billing Information</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {([['Plan','Cura Pro'],['Amount',amountFmt],['Billing Cycle',cycle],['Next Renewal',nextRenewal],['Transaction Ref', ref.length > 12 ? ref.substring(0,12)+'XX' : ref]] as const).map(([l,v]) => (
                <div key={l} style={rowStyle}>
                  <span style={{ fontSize: 14, color: 'var(--text-muted)' }}>{l}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px 32px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <button onClick={() => url ? window.location.href = url : router.push('/plans/choose')}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, cursor: 'pointer' }}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  export default function ConfirmPlanPage() {
    return (
      <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)', color: 'var(--text-muted)' }}>Loading…</div>}>
        <ConfirmContent />
      </Suspense>
    );
  }
  