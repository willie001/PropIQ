import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  // This helps catch env issues early during dev
  // (Will show up in your terminal if env vars are missing)
  console.warn('Supabase env vars are missing. Check .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
