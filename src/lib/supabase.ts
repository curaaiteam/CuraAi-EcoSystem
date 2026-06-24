import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  tier: 'free' | 'pro';
  plan: 'free' | 'monthly' | 'annual' | 'basic' | 'standard' | 'pro';
  subscription_status: 'active' | 'inactive' | 'cancelled' | null;
  billing_cycle: 'monthly' | 'annual' | null;
  // Ecosystem fields
  username: string | null;
  whatsapp_number: string | null;
  country: string | null;
  goals: string[] | null;
  onboarding_complete: boolean | null;
  ecosystem_plan: 'free' | 'basic' | 'standard' | 'pro' | null;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  session_id: string;
  title: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  file_url?: string | null;
  file_name?: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  paystack_reference: string;
  plan: string;
  tier: string;
  billing_cycle: string;
  amount: number;
  status: string;
  start_date: string;
  next_renewal_date: string | null;
}
