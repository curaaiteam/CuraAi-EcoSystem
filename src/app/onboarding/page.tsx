'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import { Heart, Brain, Activity, Smile, ChevronRight, ChevronLeft, Check, AtSign, Phone, AlertCircle } from 'lucide-react';

const GOALS = [
  { id: 'mental_health', label: 'Mental Health', icon: Brain, desc: 'Reduce anxiety and stress' },
  { id: 'physical_wellness', label: 'Physical Wellness', icon: Activity, desc: 'Improve fitness and energy' },
  { id: 'emotional_support', label: 'Emotional Support', icon: Heart, desc: 'Navigate life challenges' },
  { id: 'general_wellbeing', label: 'General Well-being', icon: Smile, desc: 'Holistic health improvements' },
];

const BLUE = '#2E2BFF';
const PINK = '#FF2BA6';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const [step, setStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [saving, setSaving] = useState(false);

  const TOTAL_STEPS = 4;

  useEffect(() => {
    if (!user) router.replace('/sign-in');
  }, [user]);

  const validateUsername = (val: string) => {
    const clean = val.replace(/[^a-z0-9_]/gi, '').toLowerCase();
    return clean;
  };

  const handleUsernameChange = (val: string) => {
    const clean = validateUsername(val);
    setUsername(clean);
    setUsernameError('');
  };

  const checkUsernameAvailable = async (): Promise<boolean> => {
    if (!username || username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }
    if (username.length > 20) {
      setUsernameError('Username must be under 20 characters');
      return false;
    }
    setCheckingUsername(true);
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .neq('id', user?.uid || '')
      .maybeSingle();
    setCheckingUsername(false);
    if (data) {
      setUsernameError('That username is already taken. Try another.');
      return false;
    }
    return true;
  };

  const handleIdentityNext = async () => {
    if (!whatsapp.trim()) {
      setUsernameError('Please enter your WhatsApp number');
      return;
    }
    const ok = await checkUsernameAvailable();
    if (ok) setStep(3);
  };

  const toggleGoal = (id: string) => {
    setSelectedGoals(p => p.includes(id) ? p.filter(g => g !== id) : [...p, id]);
  };

  const handleFinish = async () => {
    setSaving(true);
    if (user) {
      await supabase.from('profiles').update({
        onboarding_complete: true,
        username,
        whatsapp_number: whatsapp,
        goals: selectedGoals,
      }).eq('id', user.uid);
    }
    router.replace('/chat');
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '50px',
    border: '1.5px solid #EFEFEF',
    background: '#F7F7F7',
    fontSize: '15px',
    fontFamily: 'Poppins, sans-serif',
    color: '#1A1A1A',
    outline: 'none',
  };

  const errorInputStyle = { ...inputStyle, border: `1.5px solid ${PINK}` };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-8"
      style={{ background: '#F7F7F7' }}>

      {/* Top accent */}
      <div className="fixed top-0 left-0 right-0 h-1"
        style={{ background: `linear-gradient(90deg, ${BLUE}, ${PINK})` }} />

      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo-and-name.png" alt="Cura" className="h-10 object-contain"
            onError={e => {
              const el = e.target as HTMLImageElement;
              el.src = '/logo.png';
              el.className = 'h-10 w-10 object-contain';
            }} />
        </div>

        {/* Progress dots */}
        <div className="flex items-center gap-2 mb-10 justify-center">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => {
            const s = i + 1;
            return (
              <div key={s} className="rounded-full transition-all duration-300"
                style={{
                  width: step === s ? 32 : 8,
                  height: 8,
                  background: step >= s ? BLUE : '#E0E0E0',
                }} />
            );
          })}
        </div>

        {/* Step 1 — Welcome */}
        {step === 1 && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center"
                  style={{ background: '#EEF0FF' }}>
                  <img src="/logo.png" alt="Cura" className="w-14 h-14 object-contain" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background: BLUE }}>
                  <span style={{ color: 'white', fontSize: 14 }}>✨</span>
                </div>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              Welcome to Cura
            </h1>
            <p className="text-base mb-2 font-medium" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              Hi {profile?.display_name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'there'} 👋
            </p>
            <p className="text-sm mb-3 leading-relaxed" style={{ color: '#888888', fontFamily: 'Poppins, sans-serif' }}>
              I&apos;m Cara, your personal AI companion. Before we begin, let&apos;s set up your identity in the Cura community.
            </p>
            <p className="text-sm font-semibold mb-10" style={{ color: BLUE, fontFamily: 'Poppins, sans-serif' }}>
              "You matter."
            </p>
            <button onClick={() => setStep(2)}
              className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: BLUE, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 15 }}>
              Get Started <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2 — Identity */}
        {step === 2 && (
          <div>
            <div className="text-center mb-7">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: '#EEF0FF' }}>
                <AtSign className="w-8 h-8" style={{ color: BLUE }} />
              </div>
              <h1 className="text-xl font-bold mb-1" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
                Create your identity
              </h1>
              <p className="text-sm" style={{ color: '#888888', fontFamily: 'Poppins, sans-serif' }}>
                Required to join the Cura ecosystem
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {/* Username */}
              <div>
                <label className="block text-xs font-semibold mb-2 px-1"
                  style={{ color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                  Username <span style={{ color: PINK }}>*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 font-semibold"
                    style={{ color: usernameError ? PINK : BLUE, fontFamily: 'Poppins, sans-serif' }}>
                    @
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={e => handleUsernameChange(e.target.value)}
                    placeholder="yourname"
                    maxLength={20}
                    style={{ ...( usernameError && !whatsapp ? errorInputStyle : inputStyle), paddingLeft: '38px' }}
                  />
                </div>
                <p className="text-xs mt-1.5 px-2" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
                  Only letters, numbers, underscores. Globally unique.
                </p>
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-xs font-semibold mb-2 px-1"
                  style={{ color: '#555', fontFamily: 'Poppins, sans-serif' }}>
                  WhatsApp Number <span style={{ color: PINK }}>*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4"
                    style={{ color: usernameError && !username ? PINK : '#AAAAAA' }} />
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={e => { setWhatsapp(e.target.value); setUsernameError(''); }}
                    placeholder="+234 800 000 0000"
                    style={{ ...inputStyle, paddingLeft: '44px' }}
                  />
                </div>
                <p className="text-xs mt-1.5 px-2" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>
                  Used for account recovery and verification.
                </p>
              </div>
            </div>

            {/* Error */}
            {usernameError && (
              <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-2xl"
                style={{ background: '#FFF0F4', border: `1px solid ${PINK}30` }}>
                <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: PINK }} />
                <p className="text-xs" style={{ color: PINK, fontFamily: 'Poppins, sans-serif' }}>
                  {usernameError}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="px-5 py-4 rounded-full border flex items-center justify-center"
                style={{ borderColor: '#EFEFEF', background: 'white', cursor: 'pointer' }}>
                <ChevronLeft className="w-4 h-4" style={{ color: '#888' }} />
              </button>
              <button onClick={handleIdentityNext} disabled={checkingUsername}
                className="flex-1 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: BLUE, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 15, opacity: checkingUsername ? 0.7 : 1 }}>
                {checkingUsername
                  ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <>Continue <ChevronRight className="w-4 h-4" /></>}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Goals */}
        {step === 3 && (
          <div>
            <h1 className="text-xl font-bold mb-1 text-center" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              What are your goals?
            </h1>
            <p className="text-center text-sm mb-6" style={{ color: '#888888', fontFamily: 'Poppins, sans-serif' }}>
              Helps Cara personalize your experience
            </p>
            <div className="grid grid-cols-2 gap-3 mb-7">
              {GOALS.map(goal => {
                const selected = selectedGoals.includes(goal.id);
                return (
                  <button key={goal.id} onClick={() => toggleGoal(goal.id)}
                    className="p-4 rounded-2xl text-left transition-all"
                    style={{
                      background: selected ? '#EEF0FF' : 'white',
                      border: selected ? `2px solid ${BLUE}` : '1.5px solid #EFEFEF',
                      cursor: 'pointer',
                    }}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: selected ? BLUE : '#F7F7F7' }}>
                        <goal.icon className="w-4 h-4" style={{ color: selected ? 'white' : '#888' }} />
                      </div>
                      {selected && (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: BLUE }}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm font-semibold" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>{goal.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#AAAAAA', fontFamily: 'Poppins, sans-serif' }}>{goal.desc}</p>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(2)}
                className="px-5 py-4 rounded-full border flex items-center justify-center"
                style={{ borderColor: '#EFEFEF', background: 'white', cursor: 'pointer' }}>
                <ChevronLeft className="w-4 h-4" style={{ color: '#888' }} />
              </button>
              <button onClick={() => setStep(4)}
                className="flex-1 py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: BLUE, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 15 }}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setStep(4)}
              className="w-full text-sm mt-3 text-center py-2"
              style={{ color: '#BBBBBB', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif' }}>
              Skip for now
            </button>
          </div>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: '#EFFFEF', border: '2px solid #22C55E40' }}>
                <Check className="w-10 h-10" style={{ color: '#22C55E' }} />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ color: '#1A1A1A', fontFamily: 'Poppins, sans-serif' }}>
              You&apos;re all set! 🌟
            </h1>
            <p className="text-sm mb-2 leading-relaxed" style={{ color: '#888888', fontFamily: 'Poppins, sans-serif' }}>
              Welcome to the Cura ecosystem, <strong style={{ color: '#1A1A1A' }}>@{username}</strong>.
            </p>
            <p className="text-sm mb-10 leading-relaxed font-semibold" style={{ color: BLUE, fontFamily: 'Poppins, sans-serif' }}>
              "You matter."
            </p>
            <button onClick={handleFinish} disabled={saving}
              className="w-full py-4 rounded-full font-semibold text-white flex items-center justify-center gap-2"
              style={{ background: BLUE, border: 'none', cursor: 'pointer', fontFamily: 'Poppins, sans-serif', fontSize: 15, opacity: saving ? 0.7 : 1 }}>
              {saving
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Enter Cura <ChevronRight className="w-5 h-5" /></>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
