'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'How do I export my data?', a: 'Go to Settings → Data Control → Export Data. Your chat history will be downloaded as a JSON file to your device.' },
  { q: 'How do I clear chat history?', a: 'Go to Settings → Data Control → Clear Chat History. This permanently removes all your conversations and cannot be undone.' },
  { q: 'Is my data safe?', a: 'Yes. Your conversations are encrypted and stored securely. We never share your personal data with third parties.' },
  { q: 'How do I upgrade to Pro?', a: 'Go to Settings and tap "Get Cura Pro". Choose a monthly or annual plan and complete checkout through our secure payment processor.' },
  { q: 'What happens when I reach my message limit?', a: 'Free users have a daily message limit. Once reached, you can upgrade to Pro for unlimited chatting, or wait until the next day.' },
  { q: 'Can I change my email address?', a: 'Currently, email addresses cannot be changed. Contact our support team if you need help with your account.' },
];

export default function FAQPage() {
  const router = useRouter();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: 'inherit' }}>
      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
          <button onClick={() => router.back()} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4 }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>FAQ</span>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px)' }}>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>Find answers, tips, and guidance to make the most of Cura AI.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {FAQS.map((faq, i) => (
            <button key={i} onClick={() => setOpen(open === i ? null : i)}
              style={{ background: 'var(--card-bg)', borderRadius: 12, border: 'none', cursor: 'pointer', padding: 'clamp(14px, 4vw, 18px)', width: '100%', textAlign: 'left', fontFamily: 'inherit' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <span style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: 'var(--text-primary)', fontWeight: 500 }}>{faq.q}</span>
                <ChevronDown size={18} color="#C7C7CC" style={{ transform: open === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
              </div>
              {open === i && <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, margin: '12px 0 0' }}>{faq.a}</p>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
