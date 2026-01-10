import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "../config/index.js";

let supabase: SupabaseClient | null = null;
let supabaseAdmin: SupabaseClient | null = null;

/**
 * Get Supabase client with anon key (for regular operations with RLS)
 */
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

/**
 * Get Supabase admin client with service role key (bypasses RLS)
 * Use this for storage operations and admin tasks
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(
      env.SUPABASE_PROJECT_URL,
      env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return supabaseAdmin;
}

export { supabase };
