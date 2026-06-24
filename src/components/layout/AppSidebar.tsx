'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import {
  MessageCircle, Settings, CreditCard, LogOut, Plus,
  Search, ChevronLeft, Trash2, X, Info,
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface Conversation { id: string; session_id: string; title: string | null; created_at: string; }

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectConversation: (sid: string) => void;
}

export function AppSidebar({ isOpen, onToggle, currentSessionId, onNewChat, onSelectConversation }: AppSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, profile } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => { if (user) fetchConversations(); }, [user]);

  const fetchConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('conversations').select('*').eq('user_id', user.uid)
      .order('created_at', { ascending: false }).limit(50);
    if (data) setConversations(data);
  };

  const handleNewChat = () => { onNewChat(); fetchConversations(); };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('messages').delete().eq('conversation_id', convId);
    await supabase.from('conversations').delete().eq('id', convId);
    fetchConversations();
    if (conversations.find(c => c.id === convId)?.session_id === currentSessionId) onNewChat();
  };

  const handleSignOut = async () => { await signOut(auth); router.replace('/sign-in'); };

  const filtered = conversations.filter(c =>
    !searchQuery || (c.title || 'New conversation').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navItems = [
    { icon: MessageCircle, label: 'Chat', href: '/chat' },
    { icon: CreditCard, label: 'Plans', href: '/plans' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: Info, label: 'About Cura', href: '/chat/about' },
  ];

  const initials = (profile?.display_name || user?.email || 'U')[0].toUpperCase();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.35)' }}
          onClick={onToggle} />
      )}

      <aside
        className={`fixed lg:relative z-40 lg:z-auto flex flex-col h-full flex-shrink-0 transition-all duration-300 ${
          isOpen ? 'w-72 translate-x-0' : 'w-72 -translate-x-full lg:w-16 lg:translate-x-0'
        }`}
        style={{ background: 'var(--color-surface)', borderRight: '1px solid var(--color-border-lighter)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--color-border-lighter)' }}>
          {isOpen ? (
            <>
              <img src="/logo-and-name.png" alt="CuraAi" className="h-8 object-contain"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                }} />
              <button onClick={onToggle} className="p-1.5 rounded-lg btn-ghost">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button onClick={onToggle} className="mx-auto p-1.5 rounded-lg btn-ghost">
              <img src="/logo.png" alt="CuraAi" className="w-8 h-8 object-contain" />
            </button>
          )}
        </div>

        {/* New Chat */}
        <div className="p-3 flex-shrink-0">
          <button onClick={handleNewChat}
            className={`btn-primary w-full text-sm py-2.5 ${!isOpen ? 'px-0 justify-center' : ''}`}>
            <Plus className="w-4 h-4 flex-shrink-0" />
            {isOpen && <span>New Chat</span>}
          </button>
        </div>

        {/* Search */}
        {isOpen && (
          <div className="px-3 pb-3 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--color-text-dim)' }} />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="input-field text-sm pl-9 py-2.5" />
            </div>
          </div>
        )}

        {/* Conversations list */}
        {isOpen && (
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {filtered.length === 0 ? (
              <p className="text-center text-xs py-8" style={{ color: 'var(--color-text-dim)' }}>
                {searchQuery ? 'No results found' : 'No conversations yet'}
              </p>
            ) : (
              <div className="space-y-0.5">
                {filtered.map(conv => (
                  <div key={conv.id}
                    onClick={() => onSelectConversation(conv.session_id)}
                    className="group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors"
                    style={{
                      background: conv.session_id === currentSessionId ? 'var(--color-primary-pale)' : undefined,
                    }}
                    onMouseEnter={e => {
                      if (conv.session_id !== currentSessionId)
                        (e.currentTarget as HTMLElement).style.background = 'var(--color-surface-3)';
                    }}
                    onMouseLeave={e => {
                      if (conv.session_id !== currentSessionId)
                        (e.currentTarget as HTMLElement).style.background = '';
                    }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageCircle className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: conv.session_id === currentSessionId ? 'var(--color-primary)' : 'var(--color-text-dim)' }} />
                      <span className="text-sm truncate"
                        style={{ color: conv.session_id === currentSessionId ? 'var(--color-primary)' : 'var(--color-text)' }}>
                        {conv.title || 'New conversation'}
                      </span>
                    </div>
                    <button onClick={e => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity flex-shrink-0"
                      style={{ color: 'var(--color-error)' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bottom nav */}
        <div className="flex-shrink-0 p-3 space-y-0.5"
          style={{ borderTop: '1px solid var(--color-border-lighter)' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link key={item.href} href={item.href}
                className={`sidebar-item ${isActive ? 'active' : ''} ${!isOpen ? 'justify-center' : ''}`}>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* User row */}
          <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1 ${!isOpen ? 'justify-center' : ''}`}
            style={{ background: 'var(--color-surface-2)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{ background: 'var(--color-primary)', color: 'white' }}>
              {initials}
            </div>
            {isOpen && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text)' }}>
                    {profile?.display_name || user?.email?.split('@')[0]}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                    {profile?.plan === 'free' ? 'Free Plan' : profile?.plan === 'monthly' ? 'Pro Monthly' : 'Pro Annual'}
                  </p>
                </div>
                <button onClick={() => setShowLogoutConfirm(true)}
                  className="p-1.5 rounded-lg btn-ghost" title="Sign out">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Logout modal */}
      {showLogoutConfirm && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>Sign out?</h3>
              <button onClick={() => setShowLogoutConfirm(false)} className="btn-ghost p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
              You&apos;ll need to sign in again to access your conversations.
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
    </>
  );
}
