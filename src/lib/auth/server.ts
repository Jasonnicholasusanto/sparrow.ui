import "server-only";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getServerSession() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return null;
  }

  return data.session;
}

export async function requireServerSession() {
  const session = await getServerSession();
  if (!session) redirect("/auth/login");
  return session;
}

export async function getServerAccessToken() {
  const session = await requireServerSession();
  return session.access_token;
}
