import { createClient } from "@/lib/supabase/client";

export async function getClientSession() {
  const supabase = createClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) return null;
  return session;
}

export async function getClientAccessToken() {
  const session = await getClientSession();
  return session?.access_token ?? null;
}
