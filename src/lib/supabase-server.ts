import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client authenticated with the given access token.
 * Use this in Server Actions by passing the token from the client.
 */
export function createServerSupabaseClient(accessToken: string) {
    const url = process.env["NEXT_PUBLIC_SUPABASE_URL"]!;
    const anonKey = process.env["NEXT_PUBLIC_SUPABASE_ANON_KEY"]!;

    return createClient(url, anonKey, {
        global: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false,
            detectSessionInUrl: false,
        },
    });
}
