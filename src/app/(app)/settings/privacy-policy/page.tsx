'use client';
  import { useRouter } from 'next/navigation';

  const BLUE = '#2E2BFF';
  const EMAIL = 'curaai.team@gmail.com';

  export default function PrivacyPolicyPage() {
    const router = useRouter();

    const h2Style: React.CSSProperties = { fontSize: 'clamp(14px, 3.5vw, 16px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 10px' };
    const pStyle: React.CSSProperties = { fontSize: 'clamp(13px, 3vw, 14px)', color: 'var(--text-secondary)', lineHeight: 1.75, margin: '0 0 8px' };
    const bulletStyle: React.CSSProperties = { ...pStyle, margin: '0 0 6px', paddingLeft: 16 };

    return (
      <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: 'inherit' }}>
        {/* Header */}
        <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 18px) 20px', position: 'relative', minHeight: 56 }}>
            <button
              onClick={() => router.back()}
              style={{ position: 'absolute', left: 20, background: 'var(--input-bg)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span style={{ fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>Privacy Policy</span>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 640, margin: '0 auto', padding: 'clamp(20px, 5vw, 36px) clamp(16px, 4vw, 24px) 60px' }}>
          <p style={{ ...pStyle, color: 'var(--text-muted)', marginBottom: 4 }}>Last Updated: November 2025</p>
          <p style={{ ...pStyle, marginBottom: 28 }}>
            We at CuraAi respect your privacy and are committed to protecting the personal data we collect from or about you.
            This Privacy Policy describes our practices regarding Personal Data when you use our mobile application, website, and associated features.
          </p>
          <p style={{ ...pStyle, marginBottom: 28 }}>
            For questions or data requests, contact us at{' '}
            <a href={`mailto:${EMAIL}`} style={{ color: BLUE, fontWeight: 600 }}>{EMAIL}</a>
          </p>

          {/* Section 1 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>1. Personal Data We Collect</h2>

            <p style={{ ...pStyle, fontWeight: 600, color: 'var(--text-primary)' }}>Personal Data You Provide:</p>
            <p style={bulletStyle}>• <strong>Account Information:</strong> Your name, email address, password, country, age, and optional demographic information (such as gender or wellness goals).</p>
            <p style={bulletStyle}>• <strong>User Wellness Inputs:</strong> Data you enter into the app, such as mood tracking, journaling notes, hydration logs, sleep entries, stress level check-ins, or other wellness-related inputs.</p>
            <p style={bulletStyle}>• <strong>Communication Information:</strong> If you contact us via email or support channels, we may collect your name, email address, and the content of your message.</p>
            <p style={{ ...bulletStyle, marginBottom: 16 }}>• <strong>Other Information You Provide:</strong> Survey responses, feature requests, feedback submissions, beta-program participation, and any information voluntarily shared.</p>

            <p style={{ ...pStyle, fontWeight: 600, color: 'var(--text-primary)' }}>Personal Data from Your Use of the Services:</p>
            <p style={bulletStyle}>• <strong>Log Data:</strong> IP address, app navigation activity, timestamps, session duration, error logs, and crash reports.</p>
            <p style={bulletStyle}>• <strong>Usage Data:</strong> Features you interact with, frequency of app use, habits such as reminder interactions and notification engagement.</p>
            <p style={bulletStyle}>• <strong>Device Information:</strong> Device model, operating system, device identifiers, and mobile network.</p>
            <p style={bulletStyle}>• <strong>Location Information:</strong> General region or city-level location from your IP address. The app does not request precise GPS location unless you explicitly enable location-based wellness features.</p>
            <p style={{ ...bulletStyle, marginBottom: 16 }}>• <strong>Cookies (Web Only):</strong> Used to remember preferences, improve performance, and analyze usage. You may disable cookies through browser settings.</p>

            <p style={{ ...pStyle, fontWeight: 600, color: 'var(--text-primary)' }}>Personal Data from Other Sources:</p>
            <p style={bulletStyle}>• Third-party platforms when you choose to link an account (e.g., health data providers, wearable device platforms).</p>
            <p style={bulletStyle}>• Security partners, to prevent fraud, abuse, or high-risk log-ins.</p>
            <p style={bulletStyle}>• Marketing and referral partners, when users sign up through promotional campaigns.</p>
            <p style={{ ...pStyle, fontStyle: 'italic', color: 'var(--text-muted)' }}>We do not purchase personal data from data brokers.</p>
          </div>

          {/* Section 2 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>2. How We Use Your Personal Data</h2>
            <p style={bulletStyle}>• To operate, maintain, and provide the Services, including creating your account and enabling wellness insights.</p>
            <p style={bulletStyle}>• To personalize wellness guidance — tailoring mood check-ins, habit-building reminders, and wellness recommendations.</p>
            <p style={bulletStyle}>• To improve and develop features, including refining personalization models based on aggregate, de-identified data.</p>
            <p style={bulletStyle}>• To communicate with you: service updates, wellness tips (optional), reminders, security notices, and support responses.</p>
            <p style={bulletStyle}>• To ensure platform safety and integrity: monitoring for unauthorized use, suspicious activity, and fraud prevention.</p>
            <p style={{ ...bulletStyle, marginBottom: 16 }}>• To comply with law and protect user rights, including responding to valid regulatory or legal requests.</p>
            <p style={{ ...pStyle, fontStyle: 'italic', color: 'var(--text-muted)' }}>
              We do not use your identifiable wellness entries to train AI models. You may opt-out of contributing anonymized usage data by contacting{' '}
              <a href={`mailto:${EMAIL}`} style={{ color: BLUE }}>{EMAIL}</a>
            </p>
          </div>

          {/* Section 3 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>3. Disclosure of Personal Data</h2>
            <p style={bulletStyle}>• <strong>Vendors and Service Providers:</strong> Cloud hosting, analytics, IT infrastructure partners, and customer support platforms. They process Personal Data only under our instructions and under confidentiality obligations.</p>
            <p style={bulletStyle}>• <strong>Business Transfers:</strong> If CuraAi is involved in a merger, acquisition, or sale, Personal Data may be transferred as part of the transaction, subject to strict protections.</p>
            <p style={bulletStyle}>• <strong>Legal and Safety Requirements:</strong> We may disclose Personal Data if required by applicable law or necessary to protect the safety, rights, or property of users or the public.</p>
            <p style={{ ...bulletStyle, marginBottom: 8 }}>• <strong>Affiliates:</strong> We may share Personal Data with corporate affiliates only where consistent with this Policy.</p>
            <p style={{ ...pStyle, fontStyle: 'italic', color: 'var(--text-muted)' }}>We do not sell Personal Data. We do not share Personal Data for cross-platform behavioral advertising.</p>
          </div>

          {/* Section 4 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>4. Retention</h2>
            <p style={pStyle}>We retain Personal Data only as long as necessary to provide the Services, resolve disputes, prevent fraud, and comply with legal obligations.</p>
            <p style={pStyle}>When your account is deleted, associated Personal Data is permanently removed or anonymized, unless retention is required by law.</p>
            <p style={pStyle}>You can delete your data at any time through <strong>Settings → Data Control</strong>.</p>
          </div>

          {/* Section 5 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>5. Your Rights</h2>
            <p style={pStyle}>Depending on your location, you may have the right to:</p>
            <p style={bulletStyle}>• Access your Personal Data</p>
            <p style={bulletStyle}>• Request deletion</p>
            <p style={bulletStyle}>• Correct inaccuracies</p>
            <p style={bulletStyle}>• Transfer your data (data portability)</p>
            <p style={bulletStyle}>• Restrict or object to processing</p>
            <p style={bulletStyle}>• Withdraw consent at any time</p>
            <p style={{ ...bulletStyle, marginBottom: 16 }}>• File a complaint with your data protection authority</p>
            <p style={pStyle}>
              To exercise your rights, send your request to{' '}
              <a href={`mailto:${EMAIL}`} style={{ color: BLUE, fontWeight: 600 }}>{EMAIL}</a>{' '}
              with the subject: <em>Data Request – [Your Name]</em>
            </p>
          </div>

          {/* Section 6 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>6. Security</h2>
            <p style={pStyle}>We implement administrative, technical, and organizational safeguards, including:</p>
            <p style={bulletStyle}>• Secure code review</p>
            <p style={bulletStyle}>• Encryption in transit (TLS/SSL) and at rest (AES-256)</p>
            <p style={bulletStyle}>• Secure cloud deployment practices</p>
            <p style={bulletStyle}>• Role-based access control</p>
            <p style={{ ...bulletStyle, marginBottom: 8 }}>• Logging and monitoring for unauthorized access attempts</p>
            <p style={{ ...pStyle, color: 'var(--text-muted)', fontStyle: 'italic' }}>No system is perfectly secure. Exercise caution when sharing Personal Data online.</p>
          </div>

          {/* Section 7 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>7. Changes to This Privacy Policy</h2>
            <p style={pStyle}>We may update this Policy from time to time. We will notify you of material changes before they take effect.</p>
          </div>

          {/* Section 8 */}
          <div style={{ background: 'var(--card-bg)', borderRadius: 16, padding: 'clamp(16px, 4vw, 22px)', border: '1px solid var(--border-light)', marginBottom: 16 }}>
            <h2 style={h2Style}>8. How to Contact Us</h2>
            <p style={pStyle}><strong>CuraAi Privacy Team</strong></p>
            <p style={pStyle}>Email: <a href={`mailto:${EMAIL}`} style={{ color: BLUE, fontWeight: 600 }}>{EMAIL}</a></p>
            <p style={pStyle}>Location: Lagos, Nigeria</p>
          </div>

          <div style={{ background: 'rgba(46,43,255,0.05)', borderRadius: 16, padding: 'clamp(14px, 3vw, 18px)', border: '1px solid rgba(46,43,255,0.12)', marginTop: 8 }}>
            <p style={{ ...pStyle, margin: 0, fontStyle: 'italic', color: 'var(--text-muted)', textAlign: 'center' }}>
              CuraAi provides general wellness guidance. It is <strong>NOT</strong> a substitute for medical diagnosis or treatment.
            </p>
          </div>
        </div>
      </div>
    );
  }
  