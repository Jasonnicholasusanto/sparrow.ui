import type { ReactNode } from "react";
import PlatformShell from "./layout-shell";
import { getUserProfile } from "@/lib/data/server/me";
import UserProvider from "@/providers/user-provider";
import { getAuthUser } from "@/lib/data/server/auth";
import { User } from "@supabase/supabase-js";
import FadeContent from "@/components/fade-content";
import { NavbarRoute } from "@/schemas/navbarRoute";
import { getNavbarRoutes } from "@/lib/data/server/navbarRoutes";
import HeaderProvider from "@/providers/header-provider";

type PlatformLayoutProps = {
  children: ReactNode;
};

export default async function PlatformLayout({
  children,
}: PlatformLayoutProps) {
  const user = await getUserProfile();
  const authUser: User | null = await getAuthUser();
  const navbarRoutes: NavbarRoute[] | null = await getNavbarRoutes();

  return (
    <FadeContent blur={true} duration={3000} initialOpacity={0}>
      <UserProvider user={user} authUser={authUser}>
        <HeaderProvider navbarRoutes={navbarRoutes ?? []}>
          <PlatformShell>{children}</PlatformShell>
        </HeaderProvider>
      </UserProvider>
    </FadeContent>
  );
}
