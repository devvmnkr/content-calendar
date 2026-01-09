import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/index.js";

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(
      env.SUPABASE_PROJECT_URL,
      env.SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabase;
}

export { supabase };
