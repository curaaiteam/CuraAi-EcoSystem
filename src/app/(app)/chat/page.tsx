'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import {
  Send, Paperclip, X, Image, MoreVertical,
  Heart, Brain, Activity, Zap, Plus, Trash2,
  ChevronLeft, MessageCircle, Search,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  file_name?: string;
  created_at: string;
  isStreaming?: boolean;
}

interface Conversation {
  id: string;
  session_id: string;
  title: string | null;
  created_at: string;
}

const WELCOME_PROMPTS = [
  { icon: Heart, text: 'How can I improve my mental health?' },
  { icon: Brain, text: 'Help me build a meditation routine' },
  { icon: Activity, text: 'Create a wellness plan for me' },
  { icon: Zap, text: 'Tips for better sleep quality' },
];

function formatDateLabel(dateStr: string) {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { label: string; messages: Message[] }[] = [];
  let currentLabel = '';
  for (const msg of messages) {
    const label = formatDateLabel(msg.created_at);
    if (label !== currentLabel) {
      currentLabel = label;
      groups.push({ label, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }
  return groups;
}

export default function ChatPage() {
  const { user, profile } = useAuthStore();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [historySearch, setHistorySearch] = useState('');
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);
  const [capError, setCapError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    checkBackendHealth();
    startNewChat();
  }, []);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 140) + 'px';
    }
  }, [input]);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch('/api/health');
      const data = await res.json();
      setBackendOnline(data.status === 'ok');
    } catch { setBackendOnline(false); }
  };

  const fetchConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('conversations').select('*').eq('user_id', user.uid)
      .order('created_at', { ascending: false }).limit(50);
    if (data) setConversations(data);
  };

  const startNewChat = () => {
    setSessionId(uuidv4());
    setConversationId(null);
    setMessages([]);
    setCapError('');
    setFile(null);
    setInput('');
    setHistoryOpen(false);
  };

  const ensureConversation = async (sid: string): Promise<string> => {
    if (conversationId) return conversationId;
    if (!user) return '';
    const { data } = await supabase.from('conversations')
      .insert({ user_id: user.uid, session_id: sid, title: null })
      .select().single();
    if (data) { setConversationId(data.id); return data.id; }
    return '';
  };

  const saveMessage = async (convId: string, role: 'user' | 'assistant', content: string, fileName?: string) => {
    await supabase.from('messages').insert({ conversation_id: convId, role, content, file_name: fileName || null });
  };

  const updateTitle = async (convId: string, firstMsg: string) => {
    const title = firstMsg.slice(0, 60) + (firstMsg.length > 60 ? '...' : '');
    await supabase.from('conversations').update({ title }).eq('id', convId);
  };

  const handleSend = async () => {
    if ((!input.trim() && !file) || isLoading || !sessionId) return;
    if (!backendOnline) { setCapError('AI service is currently unavailable.'); return; }

    const userMessage = input.trim();
    setInput('');
    setCapError('');
    setIsLoading(true);

    const userMsg: Message = {
      id: uuidv4(), role: 'user',
      content: file ? `${userMessage}${userMessage ? '\n' : ''}[File: ${file.name}]` : userMessage,
      file_name: file?.name, created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    const convId = await ensureConversation(sessionId);
    if (convId) {
      await saveMessage(convId, 'user', userMsg.content, file?.name);
      if (messages.length === 0) await updateTitle(convId, userMessage || file?.name || 'New conversation');
    }

    const typingId = uuidv4();
    setMessages(prev => [...prev, { id: typingId, role: 'assistant', content: '', created_at: new Date().toISOString(), isStreaming: true }]);

    try {
      let reply = '';
      if (file) {
        const formData = new FormData();
        formData.append('email_id', user?.email || '');
        formData.append('tier', profile?.tier || 'free');
        formData.append('plan', profile?.plan || 'free');
        formData.append('session_id', sessionId);
        formData.append('file', file);
        formData.append('text', userMessage);
        const res = await fetch('/api/multimodal', { method: 'POST', body: formData });
        const data = await res.json();
        reply = data.reply || data.error || 'Sorry, I could not process that file.';
        setFile(null);
      } else {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email_id: user?.email || '', tier: profile?.tier || 'free', plan: profile?.plan || 'free', session_id: sessionId, query: userMessage }),
        });
        const data = await res.json();
        reply = data.reply || data.error || 'Sorry, I had trouble responding.';
      }

      if (reply.toLowerCase().includes('limit') || reply.toLowerCase().includes('cap') || reply.toLowerCase().includes('exceeded')) {
        setCapError(reply);
      }

      const assistantMsg: Message = { id: uuidv4(), role: 'assistant', content: reply, created_at: new Date().toISOString() };
      setMessages(prev => prev.filter(m => m.id !== typingId).concat(assistantMsg));
      if (convId) await saveMessage(convId, 'assistant', reply);
    } catch {
      setMessages(prev => prev.filter(m => m.id !== typingId).concat({
        id: uuidv4(), role: 'assistant',
        content: 'Something went wrong. Please check your connection and try again.',
        created_at: new Date().toISOString(),
      }));
    } finally {
      setIsLoading(false);
      fetchConversations();
    }
  };

  const loadConversation = async (sid: string) => {
    if (!user) return;
    setSessionId(sid); setMessages([]); setCapError('');
    const { data: conv } = await supabase.from('conversations').select('*').eq('session_id', sid).eq('user_id', user.uid).single();
    if (conv) {
      setConversationId(conv.id);
      const { data: msgs } = await supabase.from('messages').select('*').eq('conversation_id', conv.id).order('created_at', { ascending: true });
      if (msgs) setMessages(msgs);
    }
    setHistoryOpen(false);
  };

  const handleDeleteConversation = async (convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await supabase.from('messages').delete().eq('conversation_id', convId);
    await supabase.from('conversations').delete().eq('id', convId);
    fetchConversations();
    const deleted = conversations.find(c => c.id === convId);
    if (deleted?.session_id === sessionId) startNewChat();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      if (f.size > 10 * 1024 * 1024) { setCapError('File too large. Maximum 10MB.'); return; }
      setFile(f);
    }
    e.target.value = '';
  };

  const displayName = profile?.display_name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there';
  const messageGroups = groupMessagesByDate(messages.filter(m => !m.isStreaming));
  const streamingMsg = messages.find(m => m.isStreaming);
  const canSend = (input.trim() || file) && !isLoading;

  const filteredConvs = conversations.filter(c =>
    !historySearch || (c.title || 'New conversation').toLowerCase().includes(historySearch.toLowerCase())
  );

  return (
    <div style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--color-background-warm)' }}>

      {/* Header */}
      <header className="flex items-center justify-between px-4 flex-shrink-0"
        style={{ height: '56px', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border-lighter)' }}>
        <div className="flex items-center gap-2.5">
          <img
            src="/logo-icon.png" alt="Cura"
            className="w-7 h-7 object-contain"
            onError={e => { (e.target as HTMLImageElement).src = '/logo.png'; }}
          />
          <div>
            <span className="font-bold text-base" style={{ color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif' }}>Cura AI</span>
            <div className="flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full ${backendOnline === false ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ animation: backendOnline !== false ? 'pulse 2s ease-in-out infinite' : 'none' }} />
              <span className="text-xs" style={{ color: 'var(--color-text-dim)' }}>
                {backendOnline === false ? 'Offline' : backendOnline === null ? 'Connecting...' : 'Online'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={profile?.tier === 'pro' ? 'badge-pro' : 'badge-free'}>
            {profile?.tier === 'pro' ? 'Pro' : 'Free'}
          </span>
          <button
            onClick={startNewChat}
            className="p-2 rounded-xl btn-ghost" title="New chat">
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="p-2 rounded-xl btn-ghost" title="Chat history">
            <MessageCircle className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto chat-bg-pattern">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center px-4 py-12">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'rgba(255,255,255,0.8)', boxShadow: '0 4px 20px rgba(22,23,245,0.12)' }}>
              <img src="/logo.png" alt="Cura" className="w-12 h-12 object-contain" />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif' }}>
              Hi {displayName}! 👋
            </h2>
            <p className="text-sm text-center mb-2 max-w-xs" style={{ color: 'var(--color-text-muted)', fontFamily: 'Poppins, sans-serif' }}>
              I&apos;m Cara, your AI wellness companion.
            </p>
            <p className="text-sm font-semibold text-center mb-8" style={{ color: '#2E2BFF', fontFamily: 'Poppins, sans-serif' }}>
              "You matter."
            </p>
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-sm">
              {WELCOME_PROMPTS.map(p => (
                <button key={p.text} onClick={() => { setInput(p.text); textareaRef.current?.focus(); }}
                  className="p-3.5 rounded-2xl text-left transition-all"
                  style={{ background: 'rgba(255,255,255,0.9)', border: '1.5px solid var(--color-border-lighter)', backdropFilter: 'blur(4px)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.9)')}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
                    style={{ background: 'var(--color-primary-pale)' }}>
                    <p.icon className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <p className="text-xs font-medium leading-snug" style={{ color: 'var(--color-text)', fontFamily: 'Poppins, sans-serif' }}>{p.text}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 max-w-xl mx-auto w-full">
            {messageGroups.map((group) => (
              <div key={group.label}>
                <div className="flex justify-center my-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: 'rgba(0,0,0,0.08)', color: 'var(--color-text-muted)' }}>
                    {group.label}
                  </span>
                </div>
                <div className="space-y-3">
                  {group.messages.map(msg => (
                    <div key={msg.id}
                      className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
                      <div className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}>
                        <p style={{ whiteSpace: 'pre-wrap', fontFamily: 'Poppins, sans-serif' }}>{msg.content}</p>
                        {msg.file_name && (
                          <p className="text-xs mt-1.5 opacity-70">📎 {msg.file_name}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {streamingMsg && (
              <div className="flex justify-start mt-3 fade-in">
                <div className="message-assistant px-4 py-3">
                  <div className="flex gap-1.5 items-center py-0.5">
                    <span className="typing-dot w-2 h-2 rounded-full bg-white/60" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-white/60" />
                    <span className="typing-dot w-2 h-2 rounded-full bg-white/60" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Cap error */}
      {capError && (
        <div className="px-4 py-2.5 mx-4 mb-2 rounded-xl text-sm flex items-center justify-between flex-shrink-0"
          style={{ background: 'rgba(255,59,142,0.08)', color: 'var(--color-accent)', border: '1px solid rgba(255,59,142,0.2)' }}>
          <span style={{ fontFamily: 'Poppins, sans-serif' }}>{capError}</span>
          <button onClick={() => setCapError('')} className="ml-3 opacity-60 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input area */}
      <div className="flex-shrink-0 px-4 pb-4 pt-2"
        style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border-lighter)' }}>
        {file && (
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm flex-1"
              style={{ background: 'var(--color-primary-pale)', color: 'var(--color-primary)' }}>
              <Paperclip className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate text-xs">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="btn-ghost p-1.5">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <input ref={fileInputRef} type="file" onChange={handleFileChange}
          className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />
        <div className="chat-input-area flex items-end gap-2 px-4 py-2.5">
          <button onClick={() => fileInputRef.current?.click()}
            className="flex-shrink-0 mb-1 opacity-60 hover:opacity-100 transition-opacity"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}>
            <Image className="w-5 h-5" />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Talk to me..."
            rows={1}
            className="flex-1 resize-none outline-none text-sm leading-relaxed bg-transparent"
            style={{ color: 'var(--color-text)', maxHeight: '140px', fontFamily: 'Poppins, sans-serif' }}
          />
          <button
            onClick={handleSend}
            disabled={!canSend}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all mb-0.5"
            style={{
              background: canSend ? 'var(--color-primary)' : 'var(--color-surface-3)',
              color: canSend ? 'white' : 'var(--color-text-dim)',
              border: 'none',
              cursor: canSend ? 'pointer' : 'not-allowed',
              boxShadow: canSend ? '0 2px 8px rgba(22,23,245,0.4)' : 'none',
            }}>
            {isLoading
              ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: 'var(--color-text-dim)', fontFamily: 'Poppins, sans-serif' }}>
          Cara can make mistakes. Always verify important health advice.
        </p>
      </div>

      {/* History drawer */}
      {historyOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }}
            onClick={() => setHistoryOpen(false)} />
          <div className="fixed left-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: '300px', background: 'white', boxShadow: '4px 0 24px rgba(0,0,0,0.12)' }}>
            <div className="flex items-center justify-between px-4 py-4"
              style={{ borderBottom: '1px solid #EFEFEF' }}>
              <span className="font-bold text-base" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>Chat History</span>
              <button onClick={() => setHistoryOpen(false)} className="p-1.5 rounded-lg btn-ghost">
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
            <div className="px-3 py-2" style={{ borderBottom: '1px solid #EFEFEF' }}>
              <button onClick={startNewChat}
                className="w-full py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm"
                style={{ background: '#2E2BFF', color: 'white', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
                <Plus className="w-4 h-4" /> New Chat
              </button>
            </div>
            <div className="px-3 py-2" style={{ borderBottom: '1px solid #EFEFEF' }}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#AAAAAA' }} />
                <input
                  type="text"
                  value={historySearch}
                  onChange={e => setHistorySearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-sm outline-none"
                  style={{ background: '#F7F7F7', border: '1.5px solid #EFEFEF', fontFamily: 'Poppins, sans-serif', color: '#1A1A1A' }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              {filteredConvs.length === 0 ? (
                <p className="text-center text-sm py-8" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
                  No conversations yet
                </p>
              ) : (
                filteredConvs.map(conv => (
                  <div key={conv.id}
                    onClick={() => loadConversation(conv.session_id)}
                    className="group flex items-center justify-between px-4 py-3 cursor-pointer transition-colors"
                    style={{ background: conv.session_id === sessionId ? '#EEF0FF' : 'white' }}
                    onMouseEnter={e => { if (conv.session_id !== sessionId) (e.currentTarget as HTMLElement).style.background = '#F7F7F7'; }}
                    onMouseLeave={e => { if (conv.session_id !== sessionId) (e.currentTarget as HTMLElement).style.background = 'white'; }}>
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageCircle className="w-4 h-4 flex-shrink-0" style={{ color: conv.session_id === sessionId ? '#2E2BFF' : '#AAAAAA' }} />
                      <span className="text-sm truncate" style={{ color: conv.session_id === sessionId ? '#2E2BFF' : '#1A1A1A', fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                        {conv.title || 'New conversation'}
                      </span>
                    </div>
                    <button
                      onClick={e => handleDeleteConversation(conv.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity flex-shrink-0"
                      style={{ color: '#EF4444' }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
