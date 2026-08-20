import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn("Supabase env vars missing — set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}

// Keep public routes available when the optional admin integration has not
// been configured. createClient throws on empty credentials during startup.
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
