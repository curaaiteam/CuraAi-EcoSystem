'use client';

  import { useState } from 'react';
  import { useRouter } from 'next/navigation';
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

  const PLANS = [
    { id: 'monthly', label: 'Monthly', price: '₦ 9,500', sub: 'NGN /Month', note: 'Cancel anytime, no refund', amount: 9500 },
    { id: 'annual',  label: 'Annually', price: '₦ 114,000', sub: 'NGN /Year', note: 'Cancel anytime, no refund', amount: 114000 },
  ];

  export default function ChoosePlanPage() {
    const router = useRouter();
    const { user } = useAuthStore();
    const [selected, setSelected] = useState<'monthly'|'annual'>('annual');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const selectedPlan = PLANS.find(p => p.id === selected)!;

    const handleContinue = async () => {
      if (!user) { router.push('/sign-in'); return; }
      setLoading(true); setError('');
      try {
        const reference = 'CURA-' + Math.random().toString(36).substring(2,10).toUpperCase();
        const res = await fetch('/api/paystack/initialize', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email, amount: selectedPlan.amount, plan: selected, tier: 'pro',
            billing_cycle: selected, reference,
            callback_url: `${window.location.origin}/plans/callback?ref=${reference}&plan=${selected}&amount=${selectedPlan.amount}`,
            metadata: { plan: selected, tier: 'pro', billing_cycle: selected, user_email: user.email, user_id: user.uid },
          }),
        });
        const data = await res.json();
        const authUrl = data.data?.authorization_url || data.authorization_url;
        if (authUrl) {
          router.push(`/plans/confirm?ref=${reference}&plan=${selected}&amount=${selectedPlan.amount}&url=${encodeURIComponent(authUrl)}`);
        } else {
          setError(data.error || 'Failed to initialize payment. Please try again.');
        }
      } catch { setError('Payment initialization failed. Please try again.'); }
      finally { setLoading(false); }
    };

    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--page-bg)' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 24, padding: '56px 20px 24px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', marginTop: 2 }}><ArrowLeft size={22}/></button>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Choose the plan that fits you</h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '2px 0 0' }}>Your plan, your pace, keep the conversation going.</p>
            </div>
          </div>

          {/* Pro header card */}
          <div style={{ borderRadius: 20, overflow: 'hidden', background: 'var(--plan-gradient)' }}>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <CuraProBadge />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Keep chatting with Cura</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[['😊','Unlimited Chatting'],['🔄','No Cooldowns'],['🛡️','Priority Response']].map(([icon,text]) => (
                  <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                    <span>{icon}</span><span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Plan selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Choose a subscription</p>
            {PLANS.map(plan => (
              <button key={plan.id} onClick={() => setSelected(plan.id as 'monthly'|'annual')}
                style={{
                  width: '100%', textAlign: 'left', borderRadius: 20, padding: 16, cursor: 'pointer',
                  border: `2px solid ${selected === plan.id ? BLUE : 'var(--border-color)'}`,
                  background: selected === plan.id ? 'var(--plan-gradient)' : 'var(--card-bg)',
                  transition: 'all 0.2s',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 4px' }}>{plan.label}</p>
                    <p style={{ fontSize: 24, fontWeight: 700, color: selected === plan.id ? BLUE : 'var(--text-primary)', margin: 0 }}>
                      {plan.price} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)' }}>{plan.sub}</span>
                    </p>
                    <p style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 4 }}>{plan.note} ⓘ</p>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${selected === plan.id ? BLUE : 'var(--border-color)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4, flexShrink: 0 }}>
                    {selected === plan.id && <div style={{ width: 12, height: 12, borderRadius: '50%', background: BLUE }}/>}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {error && <p style={{ color: '#ef4444', fontSize: 14, textAlign: 'center' }}>{error}</p>}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 14 }}>
            <Lock size={14}/> Secure Transaction
          </div>
        </div>

        <div style={{ padding: '0 20px 32px', maxWidth: 420, margin: '0 auto', width: '100%' }}>
          <button onClick={handleContinue} disabled={loading}
            style={{ width: '100%', padding: '16px', borderRadius: 999, border: 'none', background: BLUE, color: 'white', fontWeight: 600, fontSize: 16, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.8 : 1 }}>
            {loading ? 'Processing…' : 'Continue'}
          </button>
        </div>
      </div>
    );
  }
  