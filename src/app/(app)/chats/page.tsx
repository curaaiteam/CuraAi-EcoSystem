'use client';

import { useState } from 'react';
import { Search, Plus, Bot, MessageCircle, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  time: string;
  unread?: number;
  isGroup?: boolean;
  isAI?: boolean;
  online?: boolean;
}

const PLACEHOLDER_CHATS: Chat[] = [];

export default function ChatsPage() {
  const { user, profile } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'groups'>('all');

  const firstName = profile?.display_name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there';

  const aiChat: Chat = {
    id: 'ai',
    name: 'Cura AI',
    lastMessage: 'Your personal AI companion',
    time: '',
    isAI: true,
    online: true,
  };

  const filtered = PLACEHOLDER_CHATS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  ).filter(c => tab === 'groups' ? c.isGroup : true);

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)]" style={{ background: '#F7F7F7' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between" style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>Chats</h1>
          <p className="text-xs mt-0.5" style={{ color: '#AAAAAA' }}>Messages &amp; Groups</p>
        </div>
        <button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#2E2BFF' }}>
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 py-3" style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#AAAAAA' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: '#F7F7F7',
              border: '1.5px solid #EFEFEF',
              color: '#1A1A1A',
              fontFamily: 'Poppins, sans-serif',
            }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 py-2 gap-2" style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}>
        {(['all', 'groups'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all"
            style={{
              background: tab === t ? '#2E2BFF' : '#F7F7F7',
              color: tab === t ? 'white' : '#888888',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
            }}>
            {t === 'all' ? 'All Chats' : 'Groups'}
          </button>
        ))}
      </div>

      {/* Pinned: Cura AI */}
      <div
        onClick={() => router.push('/chat')}
        className="flex items-center gap-3.5 px-5 py-4 cursor-pointer transition-colors"
        style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}
        onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
        onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
        <div className="relative flex-shrink-0">
          <div className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2E2BFF, #FF2BA6)' }}>
            <Bot className="w-6 h-6 text-white" />
          </div>
          <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
            style={{ background: '#22C55E' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <span className="font-semibold text-sm" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              Cura AI
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: '#EEF0FF', color: '#2E2BFF', fontSize: '10px' }}>
              AI
            </span>
          </div>
          <p className="text-xs truncate" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
            Your personal companion · Always here
          </p>
        </div>
      </div>

      {/* Chat list or Empty */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-20 px-8 text-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
              style={{ background: '#EEF0FF' }}>
              <MessageCircle className="w-9 h-9" style={{ color: '#2E2BFF' }} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              No chats yet
            </h3>
            <p className="text-sm leading-relaxed mb-6" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
              Start a conversation with a friend or create a group. Just tap the{' '}
              <span style={{ color: '#2E2BFF', fontWeight: 600 }}>+</span> button above.
            </p>
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <button
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm"
                style={{ background: '#2E2BFF', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                <Plus className="w-4 h-4" />
                New Message
              </button>
              <button
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-semibold text-sm"
                style={{ background: '#F7F7F7', color: '#1A1A1A', border: '1.5px solid #EFEFEF', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                <Users className="w-4 h-4" />
                Create Group
              </button>
            </div>
          </div>
        ) : (
          filtered.map(chat => (
            <div key={chat.id} className="flex items-center gap-3.5 px-5 py-4 cursor-pointer border-b"
              style={{ borderColor: '#EFEFEF', background: 'white' }}>
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ background: '#2E2BFF', fontSize: 18 }}>
                  {chat.name[0]}
                </div>
                {chat.online && (
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                    style={{ background: '#22C55E' }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-sm truncate" style={{ color: '#1A1A1A' }}>{chat.name}</span>
                  <span className="text-xs flex-shrink-0" style={{ color: '#AAAAAA' }}>{chat.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs truncate flex-1 mr-2" style={{ color: '#AAAAAA' }}>{chat.lastMessage}</p>
                  {chat.unread && (
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-white flex-shrink-0"
                      style={{ background: '#2E2BFF', fontSize: 10 }}>
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
