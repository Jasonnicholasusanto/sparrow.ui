import type { ReactNode } from "react";
import PlatformShell from "./layout-shell";
import { getUserProfile } from "@/lib/data/me";
import UserProvider from "@/providers/user-provider";
import { getAuthUser } from "@/lib/data/auth";
import { User } from "@supabase/supabase-js";

type PlatformLayoutProps = {
  children: ReactNode;
};

export default async function PlatformLayout({
  children,
}: PlatformLayoutProps) {
  const user = await getUserProfile();
  const authUser: User | null = await getAuthUser();

  return (
    <UserProvider user={user} authUser={authUser}>
      <PlatformShell>{children}</PlatformShell>
    </UserProvider>
  );
}
