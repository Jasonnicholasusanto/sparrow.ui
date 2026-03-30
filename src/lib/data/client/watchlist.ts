"use client";

import {
  CreatedWatchlistResponse,
  GetMyWatchlistsResponse,
  WatchlistDetailCreateRequest,
} from "@/schemas/watchlist";
import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { watchlistDataPaths } from "@/lib/data/shared/watchlist";

export async function getWatchlistTypesClient(): Promise<string[] | null> {
  return clientApiClient<string[]>(watchlistDataPaths.types(), {
    method: "GET",
    version: Endpoints.Watchlists.BaseVersion,
  });
}

export async function getWatchlistQuantityTypesClient(): Promise<
  string[] | null
> {
  return clientApiClient<string[]>(watchlistDataPaths.quantityTypes(), {
    method: "GET",
    version: Endpoints.Watchlists.BaseVersion,
  });
}

export async function getMyWatchlistsClient(): Promise<GetMyWatchlistsResponse> {
  return clientApiClient<GetMyWatchlistsResponse>(
    watchlistDataPaths.myWatchlists(),
    {
      method: "GET",
      version: Endpoints.Watchlists.BaseVersion,
    },
  );
}

export async function createWatchlistClient(
  payload: WatchlistDetailCreateRequest,
): Promise<CreatedWatchlistResponse> {
  return clientApiClient<CreatedWatchlistResponse>(
    watchlistDataPaths.create(),
    {
      method: "POST",
      version: Endpoints.Watchlists.BaseVersion,
      body: JSON.stringify(payload),
    },
  );
}
