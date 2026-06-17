import type { ReactNode } from "react";
import PlatformShell from "./platform-shell";
import { getUserProfile } from "@/lib/data/server/me";
import { getAuthUser } from "@/lib/data/server/auth";
import FadeContent from "@/components/fade-content";
import { getNavbarRoutes } from "@/lib/data/server/navbarRoutes";
import { PlatformProviders } from "@/providers/platform-providers";

type PlatformLayoutProps = {
  children: ReactNode;
};

export default async function PlatformLayout({
  children,
}: PlatformLayoutProps) {
  const [user, authUser, navbarRoutes] = await Promise.all([
    getUserProfile(),
    getAuthUser(),
    getNavbarRoutes(),
  ]);

  return (
    <FadeContent blur={true} duration={2000} initialOpacity={0}>
      <PlatformProviders
        user={user}
        authUser={authUser}
        navbarRoutes={navbarRoutes ?? []}
      >
        <PlatformShell>{children}</PlatformShell>
      </PlatformProviders>
    </FadeContent>
  );
}
