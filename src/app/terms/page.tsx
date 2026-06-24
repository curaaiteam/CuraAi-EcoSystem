'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm mb-6"
          style={{ color: 'var(--color-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.png" alt="CuraAi" className="w-8 h-8 object-contain" />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Terms of Use</h1>
        </div>
        <div className="card space-y-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>Last updated: June 2025</p>
          {[
            ['Acceptance', 'By using CuraAi, you agree to these Terms of Use. If you do not agree, please do not use our service.'],
            ['AI Disclaimer', 'Cara is an AI assistant and is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for any medical concerns.'],
            ['User Responsibilities', 'You agree to provide accurate information, maintain the security of your account, and use the service responsibly and legally.'],
            ['Privacy', 'Your use of CuraAi is also governed by our Privacy Policy, which is incorporated into these terms.'],
            ['Changes', 'We may update these terms from time to time. Continued use of the service constitutes acceptance of the updated terms.'],
          ].map(([title, text]) => (
            <div key={title as string}>
              <h2 className="font-semibold mb-1.5" style={{ color: 'var(--color-text)' }}>{title as string}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{text as string}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
