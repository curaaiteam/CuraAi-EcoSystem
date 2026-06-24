import { create } from 'zustand';
import { User } from 'firebase/auth';
import { Profile, supabase } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  setInitialized: (initialized: boolean) => void;
  fetchProfile: (uid: string) => Promise<Profile | null>;
  createProfile: (user: User) => Promise<Profile | null>;
  refreshProfile: (uid: string) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  setInitialized: (initialized) => set({ initialized }),

  fetchProfile: async (uid: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();

    if (error) return null;
    set({ profile: data as Profile });
    return data as Profile;
  },

  createProfile: async (user: User) => {
    const profileData = {
      id: user.uid,
      email: user.email || '',
      display_name: user.displayName || user.email?.split('@')[0] || 'User',
      avatar_url: user.photoURL || null,
      tier: 'free',
      plan: 'free',
      subscription_status: null,
      billing_cycle: null,
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    set({ profile: data as Profile });
    return data as Profile;
  },

  refreshProfile: async (uid: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .single();
    if (data) set({ profile: data as Profile });
  },

  signOut: () => {
    set({ user: null, profile: null });
  },
}));
