'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  const h2 = { fontSize: 'clamp(13px, 3.5vw, 15px)', fontWeight: 700 as const, color: 'var(--text-primary)', margin: '20px 0 8px' as const };
  const p = { fontSize: 'clamp(13px, 3.5vw, 14px)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 12px' as const };
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--card-bg)', fontFamily: 'inherit' }}>
      <div style={{ borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
          <button onClick={() => router.back()} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4 }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Terms of use</span>
        </div>
      </div>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(16px, 4vw, 28px) clamp(16px, 4vw, 28px)' }}>
        <p style={{ ...p, color: 'var(--text-muted)' }}>Last updated: June 2025</p>
        <h2 style={h2}>1. Acceptance of Terms</h2>
        <p style={p}>By using Cura AI, you agree to these Terms of Use. If you do not agree, please do not use our service.</p>
        <h2 style={h2}>2. Use of Service</h2>
        <p style={p}>Cura AI is designed for emotional support and companionship. It is not a substitute for professional mental health treatment. If you are in crisis, please contact a licensed professional or emergency services.</p>
        <h2 style={h2}>3. Account Responsibility</h2>
        <p style={p}>You are responsible for maintaining the security of your account and for all activity that occurs under your account.</p>
        <h2 style={h2}>4. Subscription &amp; Billing</h2>
        <p style={p}>Pro subscriptions are billed monthly or annually. Cancellations take effect at the end of the current billing period. No refunds are issued for partial periods.</p>
        <h2 style={h2}>5. Prohibited Use</h2>
        <p style={p}>You may not use Cura AI for any unlawful purpose, to harass others, or to attempt to manipulate or extract harmful content from the AI.</p>
      </div>
    </div>
  );
}
