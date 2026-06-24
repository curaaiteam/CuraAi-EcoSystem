'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Privacy Policy</h1>
        </div>
        <div className="card space-y-5">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>Last updated: June 2025</p>
          {[
            ['Data We Collect', 'We collect your email address, display name, and conversation data to provide and improve our service.'],
            ['How We Use Data', 'Your data is used to provide personalized AI responses, maintain your conversation history, and improve our service.'],
            ['Data Security', 'All data is encrypted in transit and at rest. We use Firebase Authentication and Supabase for secure data storage.'],
            ['Third Parties', 'We do not sell or share your personal data with third parties. We use Firebase (Google) for authentication and Supabase for data storage.'],
            ['Your Rights', 'You can delete your account and all associated data at any time from the Settings page.'],
            ['Contact', 'For privacy concerns, contact us at privacy@curaai.app'],
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
