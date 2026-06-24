'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { ChevronLeft } from 'lucide-react';

export default function EditProfilePage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuthStore();
  const [name, setName] = useState(profile?.display_name || user?.displayName || '');
  const [saving, setSaving] = useState(false);
  const initials = (name || user?.email || 'U').slice(0, 2).toUpperCase();

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateProfile(user, { displayName: name });
      await supabase.from('profiles').update({ display_name: name }).eq('id', user.uid);
      await refreshProfile(user.uid);
      router.back();
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: 'inherit', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
          <button onClick={() => router.back()}
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4, touchAction: 'manipulation' }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Edit profile</span>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, maxWidth: 560, margin: '0 auto', width: '100%', padding: 'clamp(24px, 5vw, 40px) clamp(16px, 4vw, 24px)' }}>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'clamp(24px, 5vw, 40px)' }}>
          <div style={{ width: 'clamp(64px, 16vw, 88px)', height: 'clamp(64px, 16vw, 88px)', borderRadius: '50%', background: '#2E2BFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(22px, 5vw, 30px)', fontWeight: 700, color: '#fff' }}>
            {initials}
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>Your name</p>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{
              width: '100%', padding: 'clamp(12px, 3vw, 16px) 16px',
              borderRadius: 12, border: '1.5px solid var(--border-color)',
              fontSize: 15, color: 'var(--text-primary)', fontFamily: 'inherit',
              outline: 'none', background: 'var(--card-bg)', boxSizing: 'border-box',
              WebkitAppearance: 'none', appearance: 'none',
            }}
            placeholder="Your name"
          />
        </div>

        <div style={{ marginBottom: 'clamp(32px, 8vw, 60px)' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>Email Address</p>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            style={{
              width: '100%', padding: 'clamp(12px, 3vw, 16px) 16px',
              borderRadius: 12, border: '1.5px solid var(--border-color)',
              fontSize: 15, fontFamily: 'inherit', outline: 'none',
              background: 'var(--input-bg)', color: 'var(--text-muted)',
              boxSizing: 'border-box', opacity: 0.7,
              WebkitAppearance: 'none', appearance: 'none',
            }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            width: '100%', padding: 'clamp(14px, 4vw, 18px)',
            borderRadius: 99, border: 'none', background: '#2E2BFF',
            color: '#fff', fontSize: 16, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit', opacity: saving ? 0.7 : 1,
            WebkitAppearance: 'none', appearance: 'none',
            touchAction: 'manipulation',
          }}>
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => router.back()}
          style={{
            width: '100%', textAlign: 'center', marginTop: 14,
            fontSize: 15, color: 'var(--text-primary)',
            cursor: 'pointer', background: 'none', border: 'none',
            fontFamily: 'inherit', padding: '8px',
            touchAction: 'manipulation',
          }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
