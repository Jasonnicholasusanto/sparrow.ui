"use client";

import type { ReactNode } from "react";
import UserProvider from "@/providers/user-provider";
import HeaderProvider from "@/providers/header-provider";
import { FavouriteStocksProvider } from "@/providers/favourite-stocks-provider";

import type { User } from "@supabase/supabase-js";
import type { NavbarRoute } from "@/schemas/navbarRoute";
import type { GetMyWatchlistsResponse } from "@/schemas/watchlist";
import type { FavouriteStockResponse } from "@/schemas/favouriteStock";
import WatchlistProvider from "./watchlist-provider";
import { UserResponse } from "@/schemas/user";

type PlatformProvidersProps = {
  children: ReactNode;
  user: UserResponse | null;
  authUser: User | null;
  navbarRoutes: NavbarRoute[];
  watchlistsResponse: GetMyWatchlistsResponse | null;
  favouriteStocks?: FavouriteStockResponse[];
};

export function PlatformProviders({
  children,
  user,
  authUser,
  navbarRoutes,
  watchlistsResponse,
  favouriteStocks = [],
}: PlatformProvidersProps) {
  return (
    <UserProvider user={user} authUser={authUser}>
      <HeaderProvider navbarRoutes={navbarRoutes}>
        <WatchlistProvider initialWatchlistsResponse={watchlistsResponse}>
          <FavouriteStocksProvider initialFavouriteStocks={favouriteStocks}>
            {children}
          </FavouriteStocksProvider>
        </WatchlistProvider>
      </HeaderProvider>
    </UserProvider>
  );
}
