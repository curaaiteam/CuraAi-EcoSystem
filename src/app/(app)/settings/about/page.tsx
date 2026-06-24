'use client';

  import { useRouter } from 'next/navigation';
  import { ChevronLeft, Mail, Linkedin, Twitter } from 'lucide-react';

  export default function AboutPage() {
    const router = useRouter();
    return (
      <div style={{ minHeight: '100dvh', background: 'var(--color-background)', fontFamily: 'inherit' }}>
        <div style={{ borderBottom: '1px solid var(--border-light)', background: 'var(--card-bg)' }}>
          <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
            <button onClick={() => router.back()} style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4 }}>
              <ChevronLeft size={22} />
            </button>
            <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>About Cura</span>
          </div>
        </div>

        <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(32px, 6vw, 56px) clamp(16px, 4vw, 32px)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src="/logo-icon.png" alt="Cura" style={{ width: 'clamp(140px, 35vw, 180px)', height: 'clamp(140px, 35vw, 180px)', objectFit: 'contain', marginBottom: 16 }} />
          <h2 style={{ fontSize: 'clamp(17px, 4vw, 22px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px', textAlign: 'center' }}>Cura AI</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 clamp(24px, 5vw, 36px)', textAlign: 'center' }}>CuraAi Version 1.0.0</p>
          <p style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.7, textAlign: 'center', margin: '0 0 20px' }}>
            Cura AI is an AI-powered emotional companion built to offer genuine digital friendship through thoughtful, empathetic conversation.
            Cura listens without judgment, responds with care, and adapts to you over time, creating a space where you can talk openly, reflect, and feel understood.
          </p>
          <p style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', color: 'var(--text-secondary)', lineHeight: 1.7, textAlign: 'center', margin: '0 0 clamp(32px, 6vw, 48px)' }}>
            Designed to support moments of loneliness, stress, or simple everyday conversation, Cura isn&apos;t here to replace human connection, but to complement it.
            Whether you need to vent, think out loud, or just have someone with you, Cura shows up consistently, patiently, and with empathy.
          </p>

          {/* Contact & Socials */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
            <a href="mailto:curaai.team@gmail.com"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--card-bg)', borderRadius: 12, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#2E2BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={18} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 2px' }}>Contact Us</p>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>curaai.team@gmail.com</p>
              </div>
            </a>

            <a href="https://ng.linkedin.com/company/curaai-co" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--card-bg)', borderRadius: 12, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Linkedin size={18} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 2px' }}>LinkedIn</p>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>CuraAi Co.</p>
              </div>
            </a>

            <a href="https://x.com/curaaico" target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: 'var(--card-bg)', borderRadius: 12, textDecoration: 'none', border: '1px solid var(--border-light)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Twitter size={18} color="#fff" />
              </div>
              <div>
                <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 2px' }}>X (Twitter)</p>
                <p style={{ fontSize: 14, color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>@curaaico</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
  