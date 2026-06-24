'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { Check, Crown, Menu, X, Sparkles } from 'lucide-react';

const PLANS = [
  {
    id: 'free', name: 'Free', tier: 'free' as const, billing: 'free' as const,
    price: 0, currency: '₦', period: '',
    description: 'Get started with Cara',
    badge: null, highlight: false,
    features: [
      '50 messages per day',
      'Access to Cara AI companion',
      'Basic health & wellness support',
      'Chat history (7 days)',
      'Standard response speed',
    ],
    cta: 'Current Plan',
  },
  {
    id: 'monthly', name: 'Pro', tier: 'pro' as const, billing: 'monthly' as const,
    price: 5000, currency: '₦', period: '/month',
    description: 'Unlimited AI wellness support',
    badge: 'Most Popular', highlight: true,
    features: [
      'Unlimited messages',
      'Advanced AI model',
      'File & image uploads',
      'Priority response speed',
      'Full chat history',
      'Detailed health insights',
      'Personalized wellness plans',
      'Early access to new features',
    ],
    cta: 'Get Pro Monthly',
  },
  {
    id: 'annual', name: 'Pro Annual', tier: 'pro' as const, billing: 'annual' as const,
    price: 50000, currency: '₦', period: '/year',
    description: 'Best value — save 2 months',
    badge: 'Best Value', highlight: false,
    features: [
      'Everything in Pro Monthly',
      'Save ₦10,000 vs monthly',
      '2 months free',
      'Priority customer support',
      'Exclusive annual features',
      'Early beta access',
    ],
    cta: 'Get Pro Annual',
  },
];

export default function PlansPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSelectPlan = async (plan: typeof PLANS[0]) => {
    if (!user) { router.push('/sign-in'); return; }
    if (plan.id === 'free') return;
    if (profile?.tier === 'pro' && profile?.plan === plan.id) return;

    setLoadingPlan(plan.id);
    setErrorMsg('');

    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: plan.price,
          plan: plan.id,
          tier: plan.tier,
          billing_cycle: plan.billing === 'free' ? null : plan.billing,
          user_id: user.uid,
        }),
      });
      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else {
        setErrorMsg(data.error || 'Failed to initialize payment. Please try again.');
      }
    } catch {
      setErrorMsg('Payment initialization failed. Please try again.');
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentPlan = profile?.plan || 'free';

  return (
    <div className="h-screen-safe flex overflow-hidden" style={{ background: 'var(--color-dark-bg)' }}>
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentSessionId={null} onNewChat={() => router.push('/chat')} onSelectConversation={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 h-14 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-dark-border)', background: 'var(--color-dark-surface)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl"
            style={{ color: '#9090c0', border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold text-white">Plans</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">

            {/* Header section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4"
                style={{ background: 'rgba(255,59,142,0.15)', border: '1px solid rgba(255,59,142,0.3)' }}>
                <Crown className="w-4 h-4" style={{ color: 'var(--color-accent)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>Unlock Full Access</span>
              </div>
              <h1 className="text-3xl font-bold mb-3 text-white">Choose your plan</h1>
              <p className="text-sm" style={{ color: '#9090c0' }}>
                Start free. Upgrade anytime for unlimited AI wellness support.
              </p>
            </div>

            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl flex items-center justify-between"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171' }}>
                <span className="text-sm">{errorMsg}</span>
                <button onClick={() => setErrorMsg('')}><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Plans grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {PLANS.map(plan => {
                const isCurrent = plan.id === 'free'
                  ? profile?.tier !== 'pro'
                  : profile?.tier === 'pro' && profile?.plan === plan.id;

                return (
                  <div key={plan.id}
                    className="relative flex flex-col rounded-2xl p-6 transition-all"
                    style={{
                      background: plan.highlight ? 'var(--color-accent)' : 'var(--color-dark-surface)',
                      border: plan.highlight ? 'none' : '1px solid var(--color-dark-border)',
                      transform: plan.highlight ? 'scale(1.02)' : 'scale(1)',
                    }}>

                    {plan.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-white"
                          style={{ background: plan.highlight ? '#c1185b' : 'var(--color-primary)' }}>
                          {plan.badge}
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className="font-bold text-lg text-white mb-1">{plan.name}</h3>
                      <p className="text-sm" style={{ color: plan.highlight ? 'rgba(255,255,255,0.8)' : '#9090c0' }}>
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-end gap-1">
                        <span className="text-3xl font-bold text-white">
                          {plan.price === 0 ? 'Free' : `${plan.currency}${plan.price.toLocaleString()}`}
                        </span>
                        {plan.period && (
                          <span className="text-sm mb-1" style={{ color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#6060a0' }}>
                            {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {plan.features.map(f => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5"
                            style={{ color: plan.highlight ? 'white' : 'var(--color-primary-light)' }} />
                          <span className="text-sm" style={{ color: plan.highlight ? 'rgba(255,255,255,0.9)' : '#c0c0e0' }}>
                            {f}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handleSelectPlan(plan)}
                      disabled={isCurrent || loadingPlan === plan.id}
                      className="w-full py-3 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{
                        background: isCurrent ? 'rgba(255,255,255,0.15)' : plan.highlight ? 'white' : 'var(--color-primary)',
                        color: isCurrent ? 'rgba(255,255,255,0.6)' : plan.highlight ? 'var(--color-accent)' : 'white',
                        border: 'none',
                        cursor: isCurrent ? 'not-allowed' : 'pointer',
                      }}>
                      {loadingPlan === plan.id
                        ? <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                        : isCurrent ? 'Current Plan' : plan.cta}
                    </button>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-xs mt-8" style={{ color: '#6060a0' }}>
              All plans include a 7-day money-back guarantee. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
