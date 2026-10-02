import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Use this in "use client" components.
 * Reads credentials from NEXT_PUBLIC_ env vars — never exposes secret keys.
 */
export function createClient() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const supabaseUrl = envUrl.startsWith("http") ? envUrl : `https://${envUrl}`;

  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "dummy-key";

  return createBrowserClient(supabaseUrl, anonKey);
}
