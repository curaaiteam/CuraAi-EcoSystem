'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { ChevronLeft, Database, Ban, Trash2 } from 'lucide-react';

function Modal({ icon, title, desc, cancelLabel, confirmLabel, confirmDanger, onCancel, onConfirm, children }: {
  icon?: React.ReactNode; title: string; desc?: string; cancelLabel: string; confirmLabel: string;
  confirmDanger?: boolean; onCancel: () => void; onConfirm: () => void; children?: React.ReactNode;
}) {
  return (
    <div style={{ position: 'fixed', inset: 0, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 'clamp(16px, 5vw, 32px)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: 'var(--card-bg)', borderRadius: 20, padding: 'clamp(20px, 5vw, 28px)', width: '100%', maxWidth: 340, textAlign: 'center' }}>
        {icon && <div style={{ marginBottom: 14 }}>{icon}</div>}
        <h3 style={{ fontSize: 'clamp(15px, 4vw, 17px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px' }}>{title}</h3>
        {desc && <p style={{ fontSize: 14, color: 'var(--text-secondary)', margin: '0 0 20px', lineHeight: 1.5 }}>{desc}</p>}
        {children}
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: 99, border: '1.5px solid var(--border-color)', background: 'var(--card-bg)', color: 'var(--text-primary)', fontSize: 15, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', touchAction: 'manipulation' }}>{cancelLabel}</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: '12px', borderRadius: 99, border: 'none', background: confirmDanger ? '#FF3B30' : '#2E2BFF', color: '#fff', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', touchAction: 'manipulation' }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

export default function DataControlPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [modal, setModal] = useState<'export' | 'clear' | 'delete' | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(false);
  const [exported, setExported] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: convs } = await supabase.from('conversations').select('id, title, created_at').eq('user_id', user.uid);
      const allData: object[] = [];
      if (convs) {
        for (const c of convs) {
          const { data: msgs } = await supabase.from('messages').select('role, content, created_at').eq('conversation_id', c.id).order('created_at');
          allData.push({ conversation: (c as { id: string; title?: string; created_at: string }).title || (c as { id: string }).id, messages: msgs || [] });
        }
      }
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'cura-chat-history.json'; a.click();
      URL.revokeObjectURL(url);
      setExported(true);
      setTimeout(() => { setExported(false); setModal(null); }, 1500);
    } finally { setLoading(false); }
  };

  const handleClear = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: convs } = await supabase.from('conversations').select('id').eq('user_id', user.uid);
      if (convs) {
        for (const c of convs) await supabase.from('messages').delete().eq('conversation_id', (c as { id: string }).id);
        await supabase.from('conversations').delete().eq('user_id', user.uid);
      }
      try { localStorage.removeItem(`cura-history-${user.uid}`); } catch {}
      setModal(null);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!user?.email) return;
    setDeleteError(''); setLoading(true);
    try {
      if (user.providerData[0]?.providerId !== 'google.com') {
        const cred = EmailAuthProvider.credential(user.email, deletePassword);
        await reauthenticateWithCredential(user, cred);
      }
      const { data: convs } = await supabase.from('conversations').select('id').eq('user_id', user.uid);
      if (convs) {
        for (const c of convs) await supabase.from('messages').delete().eq('conversation_id', (c as { id: string }).id);
        await supabase.from('conversations').delete().eq('user_id', user.uid);
      }
      await supabase.from('profiles').delete().eq('id', user.uid);
      await deleteUser(user);
      router.replace('/sign-in');
    } catch (e: unknown) {
      const err = e as { code?: string };
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setDeleteError('Incorrect password.');
      else setDeleteError('Failed. Please try again.');
    } finally { setLoading(false); }
  };

  const rows = [
    { label: 'Export Data', action: () => setModal('export'), danger: false },
    { label: 'Clear Chat History', action: () => setModal('clear'), danger: false },
    { label: 'Delete Account', action: () => setModal('delete'), danger: true },
  ];

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--page-bg)', fontFamily: 'inherit' }}>

      <div style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px, 3vw, 20px) 20px', position: 'relative', minHeight: 56 }}>
          <button onClick={() => router.back()}
            style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#2E2BFF', fontFamily: 'inherit', padding: 4, touchAction: 'manipulation' }}>
            <ChevronLeft size={22} />
          </button>
          <span style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)' }}>Data Control</span>
        </div>
      </div>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: 'clamp(16px, 4vw, 24px) clamp(12px, 3vw, 20px)' }}>
        <div style={{ background: 'var(--card-bg)', borderRadius: 12, overflow: 'hidden' }}>
          {rows.map((item, i) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                display: 'flex', alignItems: 'center', padding: '16px',
                width: '100%', background: 'none', border: 'none',
                borderBottom: i < rows.length - 1 ? '1px solid var(--border-light)' : 'none',
                cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
                touchAction: 'manipulation',
              }}>
              <span style={{ fontSize: 15, color: item.danger ? '#FF3B30' : 'var(--text-primary)' }}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {modal === 'export' && (
        <Modal icon={<Database size={32} color="#2E2BFF" />} title="Export Data"
          desc="Your data will be prepared and downloaded as a file."
          cancelLabel="Cancel" confirmLabel={loading ? '...' : exported ? 'Done!' : 'Confirm'}
          onCancel={() => setModal(null)} onConfirm={handleExport} />
      )}
      {modal === 'clear' && (
        <Modal icon={<Ban size={32} color="#2E2BFF" />} title="Clear Chat History"
          desc="This will permanently remove your chat history from this device."
          cancelLabel="Cancel" confirmLabel={loading ? 'Clearing...' : 'Clear history'}
          onCancel={() => setModal(null)} onConfirm={handleClear} />
      )}
      {modal === 'delete' && (
        <Modal icon={<Trash2 size={32} color="#FF3B30" />} title="Delete Account?"
          desc="Deleting your account will permanently remove your data and access. This action can't be undone."
          cancelLabel="Cancel" confirmLabel={loading ? 'Deleting...' : 'Delete'}
          confirmDanger onCancel={() => { setModal(null); setDeletePassword(''); setDeleteError(''); }}
          onConfirm={handleDelete}>
          {user?.providerData[0]?.providerId !== 'google.com' && (
            <div style={{ textAlign: 'left', marginBottom: 16 }}>
              <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                placeholder="Enter your password to confirm"
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 10,
                  border: '1.5px solid var(--border-color)', fontSize: 14,
                  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
                  background: 'var(--input-bg)', color: 'var(--text-primary)',
                  WebkitAppearance: 'none', appearance: 'none',
                }} />
              {deleteError && <p style={{ fontSize: 12, color: '#FF3B30', marginTop: 6 }}>{deleteError}</p>}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}
