import type { ReactNode } from "react";
import PlatformShell from "./platform-shell";
import { getUserProfile } from "@/lib/data/server/me";
import { getAuthUser } from "@/lib/data/server/auth";
import FadeContent from "@/components/fade-content";
import { getNavbarRoutes } from "@/lib/data/server/navbarRoutes";
import { getMyWatchlists } from "@/lib/data/server/watchlist";
import { PlatformProviders } from "@/providers/platform-providers";
import { getFavouriteStocks } from "@/lib/data/server/favouriteStocks";

type PlatformLayoutProps = {
  children: ReactNode;
};

export default async function PlatformLayout({
  children,
}: PlatformLayoutProps) {
  const [user, authUser, navbarRoutes, watchlistsResponse, favouriteStocks] =
    await Promise.all([
      getUserProfile(),
      getAuthUser(),
      getNavbarRoutes(),
      getMyWatchlists(),
      getFavouriteStocks(),
    ]);

  return (
    <FadeContent blur={true} duration={2000} initialOpacity={0}>
      <PlatformProviders
        user={user}
        authUser={authUser}
        navbarRoutes={navbarRoutes ?? []}
        watchlistsResponse={watchlistsResponse}
        favouriteStocks={favouriteStocks}
      >
        <PlatformShell>{children}</PlatformShell>
      </PlatformProviders>
    </FadeContent>
  );
}
