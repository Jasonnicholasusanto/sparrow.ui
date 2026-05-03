"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { environment } from "@/lib/utils/env";

export interface LoginState {
  error: string | null;
}

export async function loginGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: environment.googleOAuthRedirectUrl,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    console.error("Google login failed:", error.message);
    return { error: error.message };
  }

  return { url: data?.url ?? null };
}

export async function loginAction(
  prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const supabase = await createClient();
  const loginData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };
  const { error } = await supabase.auth.signInWithPassword(loginData);

  if (error) {
    return { error: error.message };
  }

  redirect("/platform");
  return { error: null };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Logout failed:", error.message);
    return { error };
  }
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${window.location.origin}/platform`,
    },
  };
  const { error } = await supabase.auth.signUp(data);
  if (error) {
    redirect("/error");
  }
  revalidatePath("/", "layout");
  redirect("/");
}

export async function getSessionAction() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    redirect("/auth/sign-in");
  }
  return data.session ?? null;
}

export async function getAccessToken(): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();
  if (error || !data?.session) {
    redirect("/auth/sign-in");
  }
  return data.session?.access_token ?? null;
}
