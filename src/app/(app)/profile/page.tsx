'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  Settings, CreditCard, Info, LogOut, ChevronRight,
  Edit3, Flame, MessageCircle, Users, X,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [showLogout, setShowLogout] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    router.replace('/sign-in');
  };

  const initials = (profile?.display_name || user?.email || 'U')[0].toUpperCase();
  const displayName = profile?.display_name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const username = (profile as any)?.username || null;
  const whatsapp = (profile as any)?.whatsapp_number || null;
  const plan = profile?.plan || 'free';

  const planLabel: Record<string, { label: string; color: string; bg: string }> = {
    free: { label: 'Free', color: '#888888', bg: '#F0F0F0' },
    monthly: { label: 'Pro Monthly', color: '#2E2BFF', bg: '#EEF0FF' },
    annual: { label: 'Pro Annual', color: '#FF2BA6', bg: '#FFF0F8' },
    basic: { label: 'Basic', color: '#2E2BFF', bg: '#EEF0FF' },
    standard: { label: 'Standard', color: '#8B5CF6', bg: '#F5F0FF' },
    pro: { label: 'Pro', color: '#FF2BA6', bg: '#FFF0F8' },
  };
  const planInfo = planLabel[plan] || planLabel.free;

  const menuItems = [
    { icon: Edit3, label: 'Edit Profile', sub: 'Name, photo, bio', action: () => router.push('/settings') },
    { icon: CreditCard, label: 'Subscription', sub: planInfo.label + ' plan', action: () => router.push('/plans') },
    { icon: Settings, label: 'Settings', sub: 'Preferences & privacy', action: () => router.push('/settings') },
    { icon: Info, label: 'About Cura', sub: 'Version & information', action: () => router.push('/chat/about') },
  ];

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 64px)', background: '#F7F7F7' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between"
        style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}>
        <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>Profile</h1>
        <button
          onClick={() => router.push('/settings')}
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#F7F7F7', border: '1.5px solid #EFEFEF' }}>
          <Settings className="w-5 h-5" style={{ color: '#666' }} />
        </button>
      </div>

      {/* Avatar + Name */}
      <div className="flex flex-col items-center px-5 py-8" style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}>
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-md"
            style={{ background: 'linear-gradient(135deg, #2E2BFF, #FF2BA6)' }}>
            {initials}
          </div>
          <button
            onClick={() => router.push('/settings')}
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white"
            style={{ background: '#2E2BFF' }}>
            <Edit3 className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-1" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
          {displayName}
        </h2>

        {username ? (
          <p className="text-sm font-medium mb-2" style={{ color: '#2E2BFF', fontFamily: 'Poppins, sans-serif' }}>
            @{username}
          </p>
        ) : (
          <button
            onClick={() => router.push('/onboarding')}
            className="text-sm font-medium mb-2 underline"
            style={{ color: '#FF2BA6', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            + Set username
          </button>
        )}

        <span className="text-xs px-3 py-1 rounded-full font-semibold"
          style={{ background: planInfo.bg, color: planInfo.color, fontFamily: 'Poppins, sans-serif' }}>
          {planInfo.label}
        </span>

        {whatsapp && (
          <p className="text-xs mt-3" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
            📱 {whatsapp}
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-0 mx-4 my-4 rounded-2xl overflow-hidden"
        style={{ border: '1.5px solid #EFEFEF', background: 'white' }}>
        {[
          { icon: Flame, label: 'Streak', value: '0', color: '#FF2BA6' },
          { icon: MessageCircle, label: 'Messages', value: '0', color: '#2E2BFF' },
          { icon: Users, label: 'Friends', value: '0', color: '#8B5CF6' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <div key={label} className="flex flex-col items-center py-5"
            style={{
              borderRight: i < 2 ? '1px solid #EFEFEF' : undefined,
            }}>
            <Icon className="w-5 h-5 mb-1.5" style={{ color }} />
            <p className="text-xl font-bold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>{value}</p>
            <p className="text-xs" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Menu */}
      <div className="mx-4 rounded-2xl overflow-hidden mb-4" style={{ border: '1.5px solid #EFEFEF', background: 'white' }}>
        {menuItems.map(({ icon: Icon, label, sub, action }, i) => (
          <button
            key={label}
            onClick={action}
            className="w-full flex items-center gap-4 px-5 py-4 transition-colors text-left"
            style={{
              background: 'white',
              border: 'none',
              borderBottom: i < menuItems.length - 1 ? '1px solid #EFEFEF' : 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
            onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: '#F7F7F7' }}>
              <Icon className="w-5 h-5" style={{ color: '#555' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>{label}</p>
              <p className="text-xs mt-0.5" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>{sub}</p>
            </div>
            <ChevronRight className="w-4 h-4" style={{ color: '#CCCCCC' }} />
          </button>
        ))}
      </div>

      {/* Sign out */}
      <div className="mx-4 mb-6">
        <button
          onClick={() => setShowLogout(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-sm"
          style={{
            background: '#FFF0F0',
            color: '#EF4444',
            border: '1.5px solid #FEE2E2',
            cursor: 'pointer',
            fontFamily: 'Poppins, sans-serif',
          }}>
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      <p className="text-center text-xs pb-6" style={{ color: '#CCCCCC', fontFamily: 'Poppins, sans-serif' }}>
        "You matter." · Cura
      </p>

      {/* Logout modal */}
      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-6"
          style={{ background: 'rgba(0,0,0,0.45)' }}
          onClick={() => setShowLogout(false)}>
          <div className="w-full max-w-xs rounded-3xl p-6" style={{ background: 'white' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>Sign out?</h3>
              <button onClick={() => setShowLogout(false)} className="p-1" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X className="w-5 h-5" style={{ color: '#999' }} />
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: '#888', fontFamily: 'Poppins, sans-serif' }}>
              You&apos;ll need to sign in again to access Cura.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm"
                style={{ background: '#F7F7F7', color: '#555', border: '1.5px solid #EFEFEF', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                Cancel
              </button>
              <button onClick={handleSignOut}
                className="flex-1 py-3 rounded-2xl font-semibold text-sm"
                style={{ background: '#EF4444', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
