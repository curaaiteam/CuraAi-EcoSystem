'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateProfile, updatePassword, deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { User, Lock, CreditCard, Shield, Trash2, LogOut, ChevronRight, Menu, Check, X, AlertTriangle } from 'lucide-react';

type Tab = 'profile' | 'security' | 'subscription' | 'privacy';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tab, setTab] = useState<Tab>('profile');

  const [displayName, setDisplayName] = useState(profile?.display_name || user?.displayName || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Shield },
  ];

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      await updateProfile(user, { displayName });
      await supabase.from('profiles').update({ display_name: displayName }).eq('id', user.uid);
      if (user) await refreshProfile(user.uid);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) { console.error(err); } finally { setSavingProfile(false); }
  };

  const handleChangePassword = async () => {
    setPasswordError('');
    if (newPassword !== confirmNewPassword) { setPasswordError('New passwords do not match.'); return; }
    if (newPassword.length < 8) { setPasswordError('Password must be at least 8 characters.'); return; }
    if (!user?.email) return;
    setSavingPassword(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('');
      setPasswordSaved(true); setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setPasswordError('Current password is incorrect.');
      else setPasswordError('Failed to update password. Please try again.');
    } finally { setSavingPassword(false); }
  };

  const handleClearHistory = async () => {
    if (!user) return;
    setClearingHistory(true);
    try {
      const { data: convs } = await supabase.from('conversations').select('id').eq('user_id', user.uid);
      if (convs) {
        for (const c of convs) await supabase.from('messages').delete().eq('conversation_id', c.id);
        await supabase.from('conversations').delete().eq('user_id', user.uid);
      }
      setShowClearConfirm(false);
    } finally { setClearingHistory(false); }
  };

  const handleDeleteAccount = async () => {
    if (!user?.email) return;
    setDeleteError(''); setDeletingAccount(true);
    try {
      const cred = EmailAuthProvider.credential(user.email, deletePassword);
      await reauthenticateWithCredential(user, cred);
      const { data: convs } = await supabase.from('conversations').select('id').eq('user_id', user.uid);
      if (convs) {
        for (const c of convs) await supabase.from('messages').delete().eq('conversation_id', c.id);
        await supabase.from('conversations').delete().eq('user_id', user.uid);
      }
      await supabase.from('subscriptions').delete().eq('user_id', user.uid);
      await supabase.from('profiles').delete().eq('id', user.uid);
      await deleteUser(user);
      router.replace('/sign-in');
    } catch (err: any) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') setDeleteError('Incorrect password.');
      else setDeleteError('Failed to delete account. Please try again.');
    } finally { setDeletingAccount(false); }
  };

  const handleSignOut = async () => { await signOut(auth); router.replace('/sign-in'); };

  const initials = (profile?.display_name || user?.email || 'U')[0].toUpperCase();

  return (
    <div className="h-screen-safe flex overflow-hidden" style={{ background: 'var(--color-background)' }}>
      <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentSessionId={null} onNewChat={() => router.push('/chat')} onSelectConversation={() => {}} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center gap-3 px-4 h-14 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border-lighter)', background: 'var(--color-surface)' }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-xl btn-ghost">
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="font-semibold" style={{ color: 'var(--color-text)' }}>Settings</h1>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6">

            {/* Profile header card */}
            <div className="flex items-center gap-4 mb-6 p-5 rounded-2xl"
              style={{ background: 'var(--color-surface)', border: '1.5px solid var(--color-border-lighter)' }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{ background: 'var(--color-primary)', color: 'white' }}>{initials}</div>
              <div>
                <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  {profile?.display_name || user?.displayName || user?.email?.split('@')[0]}
                </p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{user?.email}</p>
                <span className={profile?.tier === 'pro' ? 'badge-pro' : 'badge-free'}
                  style={{ marginTop: 4, display: 'inline-block' }}>
                  {profile?.tier === 'pro' ? 'Pro' : 'Free Plan'}
                </span>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium flex-shrink-0 transition-all"
                  style={{
                    background: tab === t.id ? 'var(--color-primary)' : 'var(--color-surface)',
                    color: tab === t.id ? 'white' : 'var(--color-text-muted)',
                    border: tab === t.id ? 'none' : '1.5px solid var(--color-border-lighter)',
                  }}>
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="card">
              {tab === 'profile' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>Profile</h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage your account information</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Display Name</label>
                    <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                      className="input-field" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>Email Address</label>
                    <input type="email" value={user?.email || ''} disabled className="input-field opacity-50 cursor-not-allowed" />
                    <p className="text-xs mt-1" style={{ color: 'var(--color-text-dim)' }}>Email cannot be changed</p>
                  </div>
                  <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary disabled:opacity-50">
                    {savingProfile
                      ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : profileSaved ? <><Check className="w-4 h-4" /> Saved!</> : 'Save Changes'}
                  </button>
                </div>
              )}

              {tab === 'security' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>Security</h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage your password and security</p>
                  </div>
                  {user?.providerData[0]?.providerId === 'google.com' ? (
                    <div className="p-4 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-lighter)' }}>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        You signed in with Google. Password management is handled by Google.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { label: 'Current Password', value: currentPassword, setter: setCurrentPassword, placeholder: '••••••••' },
                        { label: 'New Password', value: newPassword, setter: setNewPassword, placeholder: 'Min 8 characters' },
                        { label: 'Confirm New Password', value: confirmNewPassword, setter: setConfirmNewPassword, placeholder: '••••••••' },
                      ].map(f => (
                        <div key={f.label}>
                          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>{f.label}</label>
                          <input type="password" value={f.value} onChange={e => f.setter(e.target.value)}
                            className="input-field" placeholder={f.placeholder} />
                        </div>
                      ))}
                      {passwordError && <p className="text-sm" style={{ color: 'var(--color-error)' }}>{passwordError}</p>}
                      <button onClick={handleChangePassword}
                        disabled={savingPassword || !currentPassword || !newPassword || !confirmNewPassword}
                        className="btn-primary disabled:opacity-50">
                        {savingPassword
                          ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : passwordSaved ? <><Check className="w-4 h-4" /> Updated!</> : 'Update Password'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {tab === 'subscription' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>Subscription</h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Manage your plan and billing</p>
                  </div>
                  <div className="p-4 rounded-2xl"
                    style={{
                      background: profile?.tier === 'pro' ? 'var(--color-primary-pale)' : 'var(--color-surface-2)',
                      border: '1.5px solid var(--color-border-lighter)',
                    }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold" style={{ color: 'var(--color-text)' }}>
                          {profile?.plan === 'free' ? 'Free Plan' : profile?.plan === 'monthly' ? 'Pro Monthly' : 'Pro Annual'}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                          {profile?.plan === 'free' ? '50 messages/day' : 'Unlimited messages'}
                        </p>
                      </div>
                      <span className={profile?.tier === 'pro' ? 'badge-pro' : 'badge-free'}>
                        {profile?.tier === 'pro' ? 'Pro' : 'Free'}
                      </span>
                    </div>
                  </div>
                  {profile?.tier !== 'pro' && (
                    <button onClick={() => router.push('/plans')} className="btn-primary w-full">
                      Upgrade to Pro <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}

              {tab === 'privacy' && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-bold text-lg mb-1" style={{ color: 'var(--color-text)' }}>Privacy & Data</h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Control your data and account</p>
                  </div>
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl flex items-center justify-between"
                      style={{ background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-lighter)' }}>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Clear Chat History</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Delete all your conversations permanently</p>
                      </div>
                      <button onClick={() => setShowClearConfirm(true)} className="btn-secondary text-sm py-2 px-3">Clear</button>
                    </div>
                    <div className="p-4 rounded-2xl flex items-center justify-between"
                      style={{ background: 'rgba(239,68,68,0.04)', border: '1.5px solid rgba(239,68,68,0.15)' }}>
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--color-error)' }}>Delete Account</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Permanently delete your account and all data</p>
                      </div>
                      <button onClick={() => setShowDeleteConfirm(true)}
                        className="text-sm py-2 px-3 rounded-xl font-medium"
                        style={{ background: 'var(--color-error)', color: 'white', border: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </div>
                    <button onClick={() => setShowLogoutConfirm(true)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl"
                      style={{ background: 'var(--color-surface-2)', border: '1.5px solid var(--color-border-lighter)', cursor: 'pointer' }}>
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                        <span className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>Sign Out</span>
                      </div>
                      <ChevronRight className="w-4 h-4" style={{ color: 'var(--color-text-dim)' }} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Clear history modal */}
      {showClearConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>Clear chat history?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              This will permanently delete all your conversations. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleClearHistory} disabled={clearingHistory}
                className="flex-1 rounded-xl py-3 font-semibold text-sm disabled:opacity-50"
                style={{ background: 'var(--color-error)', color: 'white', border: 'none', cursor: clearingHistory ? 'not-allowed' : 'pointer' }}>
                {clearingHistory ? 'Clearing...' : 'Clear All'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete account modal */}
      {showDeleteConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(239,68,68,0.1)' }}>
                <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-error)' }} />
              </div>
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Delete account?</h3>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              This will permanently delete your account and all your data. This cannot be undone.
            </p>
            {user?.providerData[0]?.providerId !== 'google.com' && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                  Confirm with your password
                </label>
                <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)}
                  className="input-field" placeholder="Your password" />
                {deleteError && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{deleteError}</p>}
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }}
                className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleDeleteAccount} disabled={deletingAccount}
                className="flex-1 rounded-xl py-3 font-semibold text-sm disabled:opacity-50"
                style={{ background: 'var(--color-error)', color: 'white', border: 'none', cursor: deletingAccount ? 'not-allowed' : 'pointer' }}>
                {deletingAccount ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>Sign out?</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              You&apos;ll need to sign in again to access your account.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSignOut}
                className="flex-1 rounded-xl py-3 font-semibold text-sm"
                style={{ background: 'var(--color-error)', color: 'white', border: 'none', cursor: 'pointer' }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
