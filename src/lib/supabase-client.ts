/**
 * Shared Supabase browser client — singleton to avoid Multiple GoTrueClient warnings.
 * Import this instead of calling createClient() directly in components.
 */
import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
    if (!client) {
        client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
    }
    return client;
}
