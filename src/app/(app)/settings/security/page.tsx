'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { ChevronLeft, Lock, ChevronRight } from 'lucide-react';

export default function SecurityPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isGoogle = user?.providerData[0]?.providerId === 'google.com';

  const handleChange = async () => {
    setError('');
    if (newPw !== confirmPw) { setError('New passwords do not match.'); return; }
    if (newPw.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!user?.email) return;
    setSaving(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPw);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPw);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setSaved(true); setShowForm(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setError('Current password is incorrect.');
      else setError('Failed to update password.');
    } finally { setSaving(false); }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', borderRadius: 10,
    border: '1.5px solid var(--border-color)', fontSize: 15,
    fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
    background: 'var(--input-bg)', color: 'var(--text-primary)',
    WebkitAppearance: 'none', appearance: 'none',
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: 'inherit' }}>

      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
          <button onClick={() => router.back()}
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4, touchAction: 'manipulation' }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Security</span>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px)' }}>
        {saved && <p style={{ fontSize: 13, color: '#34C759', marginBottom: 12, textAlign: 'center' }}>Password updated successfully!</p>}

        <div style={{ background: 'var(--card-bg)', borderRadius: 12, overflow: 'hidden' }}>
          {isGoogle ? (
            <div style={{ padding: 'clamp(14px, 4vw, 20px)' }}>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                You signed in with Google. Password management is handled by Google.
              </p>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowForm(v => !v)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', touchAction: 'manipulation' }}>
                <Lock size={18} color="#8E8E93" />
                <span style={{ flex: 1, fontSize: 15, color: 'var(--text-primary)', textAlign: 'left' }}>Change Login Password</span>
                <ChevronRight size={18} color="var(--text-dim)" style={{ transform: showForm ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {showForm && (
                <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid var(--border-light)' }}>
                  {[
                    { label: 'Current Password', val: currentPw, set: setCurrentPw },
                    { label: 'New Password', val: newPw, set: setNewPw },
                    { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw },
                  ].map(f => (
                    <div key={f.label} style={{ marginTop: 12 }}>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{f.label}</p>
                      <input
                        type="password"
                        value={f.val}
                        onChange={e => f.set(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  {error && <p style={{ fontSize: 13, color: '#FF3B30' }}>{error}</p>}
                  <button
                    onClick={handleChange}
                    disabled={saving || !currentPw || !newPw || !confirmPw}
                    style={{
                      padding: '14px', borderRadius: 99, border: 'none',
                      background: '#2E2BFF', color: '#fff', fontWeight: 600,
                      fontSize: 15, cursor: 'pointer', fontFamily: 'inherit',
                      opacity: (saving || !currentPw || !newPw || !confirmPw) ? 0.5 : 1,
                      marginTop: 4, touchAction: 'manipulation',
                      WebkitAppearance: 'none', appearance: 'none',
                    }}>
                    {saving ? 'Saving...' : 'Update Password'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
