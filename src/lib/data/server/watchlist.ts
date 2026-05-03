"use server";

import {
  CreatedWatchlistResponse,
  GetMyWatchlistsResponse,
  WatchlistDetailCreatePayload,
} from "@/schemas/watchlist";
import { serverApiClient } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";
import { watchlistDataPaths } from "@/lib/data/shared/watchlist";

export async function getWatchlistTypes(): Promise<string[] | null> {
  return serverApiClient<string[]>(watchlistDataPaths.types(), {
    method: "GET",
    version: Endpoints.Watchlists.BaseVersion,
  });
}

export async function getWatchlistQuantityTypes(): Promise<string[] | null> {
  return serverApiClient<string[]>(watchlistDataPaths.quantityTypes(), {
    method: "GET",
    version: Endpoints.Watchlists.BaseVersion,
  });
}

export async function getMyWatchlists(): Promise<GetMyWatchlistsResponse> {
  return serverApiClient<GetMyWatchlistsResponse>(
    watchlistDataPaths.myWatchlists(),
    {
      method: "GET",
      version: Endpoints.Watchlists.BaseVersion,
    },
  );
}

export async function createWatchlist(
  payload: WatchlistDetailCreatePayload,
): Promise<CreatedWatchlistResponse> {
  return serverApiClient<CreatedWatchlistResponse>(
    watchlistDataPaths.create(),
    {
      method: "POST",
      version: Endpoints.Watchlists.BaseVersion,
      body: JSON.stringify(payload),
    },
  );
}
