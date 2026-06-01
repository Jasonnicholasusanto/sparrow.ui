"use client";

import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import UserProvider from "@/providers/user-provider";
import HeaderProvider from "@/providers/header-provider";
import WatchlistProvider from "./watchlist-provider";
import { FavouriteStocksProvider } from "@/providers/favourite-stocks-provider";

import type { NavbarRoute } from "@/schemas/navbarRoute";
import type { UserResponse } from "@/schemas/user";

type PlatformProvidersProps = {
  children: ReactNode;
  user: UserResponse | null;
  authUser: User | null;
  navbarRoutes: NavbarRoute[];
};

export function PlatformProviders({
  children,
  user,
  authUser,
  navbarRoutes,
}: PlatformProvidersProps) {
  return (
    <UserProvider user={user} authUser={authUser}>
      <HeaderProvider navbarRoutes={navbarRoutes}>
        <WatchlistProvider>
          <FavouriteStocksProvider>{children}</FavouriteStocksProvider>
        </WatchlistProvider>
      </HeaderProvider>
    </UserProvider>
  );
}
