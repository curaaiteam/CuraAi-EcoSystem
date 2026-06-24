'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Globe, Users, Smile, Image, Mic, Lock } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface SolaceMessage {
  id: string;
  author: string;
  initials: string;
  content: string;
  time: string;
  isSystem?: boolean;
}

const DEMO_MESSAGES: SolaceMessage[] = [
  { id: '1', author: 'System', initials: 'S', content: 'Welcome to Nigeria Global Solace 🇳🇬. This is your community.', time: 'Today', isSystem: true },
  { id: '2', author: 'Alasela', initials: 'A', content: 'Hey everyone! Happy to be here 😊', time: '10:22 AM' },
  { id: '3', author: 'Chidi', initials: 'C', content: 'Good morning all 🌅 How\'s everyone doing today?', time: '10:35 AM' },
  { id: '4', author: 'Ngozi', initials: 'N', content: 'Feeling much better after talking to Cura. Highly recommend!', time: '11:02 AM' },
];

export default function GlobalSolacePage() {
  const { user, profile } = useAuthStore();
  const [messages, setMessages] = useState<SolaceMessage[]>(DEMO_MESSAGES);
  const [input, setInput] = useState('');
  const [showLimitInfo, setShowLimitInfo] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const country = 'Nigeria';
  const flag = '🇳🇬';
  const memberCount = '2,481';
  const dailyLimit = 50;
  const used = 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    if (used >= dailyLimit) { setShowLimitInfo(true); return; }

    const initials = (profile?.display_name || user?.email || 'U')[0].toUpperCase();
    const name = profile?.display_name || user?.email?.split('@')[0] || 'You';

    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      author: name,
      initials,
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }]);
    setInput('');
  };

  const remaining = dailyLimit - used;
  const pct = Math.round((used / dailyLimit) * 100);

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 64px)', background: '#F7F7F7' }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-3 flex-shrink-0"
        style={{ background: 'white', borderBottom: '1px solid #EFEFEF' }}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: '#EEF0FF' }}>
            {flag}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-base truncate" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              {country} Global Solace
            </h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Users className="w-3 h-3" style={{ color: '#AAAAAA' }} />
              <span className="text-xs" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
                {memberCount} members
              </span>
              <span style={{ color: '#EFEFEF' }}>·</span>
              <Globe className="w-3 h-3" style={{ color: '#AAAAAA' }} />
              <span className="text-xs" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
                Auto-assigned community
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowLimitInfo(v => !v)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: '#EEF0FF', color: '#2E2BFF', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
            <Lock className="w-3 h-3" />
            {remaining}/{dailyLimit}
          </button>
        </div>

        {/* Daily limit bar */}
        {showLimitInfo && (
          <div className="mt-3 p-3 rounded-xl" style={{ background: '#F7F7F7', border: '1px solid #EFEFEF' }}>
            <div className="flex items-center justify-between text-xs mb-1.5" style={{ color: '#888', fontFamily: 'Poppins, sans-serif' }}>
              <span>Daily community messages</span>
              <span style={{ color: '#2E2BFF', fontWeight: 600 }}>{remaining} remaining</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#EFEFEF' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: pct > 80 ? '#FF2BA6' : '#2E2BFF' }} />
            </div>
            <p className="text-xs mt-2" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
              Upgrade to Basic (₦2,000/mo) for 80 messages/day
            </p>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map(msg => {
          const isMe = msg.author === (profile?.display_name || user?.email?.split('@')[0]);

          if (msg.isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <span className="text-xs px-3 py-1.5 rounded-full"
                  style={{ background: '#EEF0FF', color: '#2E2BFF', fontFamily: 'Poppins, sans-serif' }}>
                  {msg.content}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              {!isMe && (
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: '#2E2BFF' }}>
                  {msg.initials}
                </div>
              )}
              <div className={`max-w-[75%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {!isMe && (
                  <span className="text-xs font-semibold px-1" style={{ color: '#2E2BFF', fontFamily: 'Poppins, sans-serif' }}>
                    {msg.author}
                  </span>
                )}
                <div className="px-4 py-2.5 rounded-2xl"
                  style={{
                    background: isMe ? '#2E2BFF' : 'white',
                    color: isMe ? 'white' : '#1A1A1A',
                    borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    fontFamily: 'Poppins, sans-serif',
                  }}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <span className="text-xs px-1" style={{ color: '#BBBBBB', fontFamily: 'Poppins, sans-serif' }}>
                  {msg.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 py-3" style={{ background: 'white', borderTop: '1px solid #EFEFEF' }}>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full" style={{ color: '#AAAAAA' }}>
            <Smile className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Message the community..."
              className="w-full px-4 py-2.5 rounded-full text-sm outline-none"
              style={{
                background: '#F7F7F7',
                border: '1.5px solid #EFEFEF',
                color: '#1A1A1A',
                fontFamily: 'Poppins, sans-serif',
              }}
            />
          </div>
          <button className="p-2 rounded-full" style={{ color: '#AAAAAA' }}>
            <Image className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full" style={{ color: '#AAAAAA' }}>
            <Mic className="w-5 h-5" />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0"
            style={{
              background: input.trim() ? '#2E2BFF' : '#EFEFEF',
              border: 'none',
              cursor: input.trim() ? 'pointer' : 'default',
            }}>
            <Send className="w-4 h-4" style={{ color: input.trim() ? 'white' : '#AAAAAA' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
