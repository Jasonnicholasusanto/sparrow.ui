"use server";

import {
  CreatedWatchlistResponse,
  GetMyWatchlistsResponse,
  WatchlistDetailCreateRequest,
} from "@/schemas/watchlist";
import { Endpoints } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server";

export async function getWatchlistTypes(): Promise<string[] | null> {
  return serverApiClient<string[]>(
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.WatchlistTypes}`,
    {
      method: "GET",
      version: Endpoints.Watchlists.BaseVersion,
    },
  );
}

export async function getWatchlistQuantityTypes(): Promise<string[] | null> {
  return serverApiClient<string[]>(
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.WatchlistQuantityTypes}`,
    {
      method: "GET",
      version: Endpoints.Watchlists.BaseVersion,
    },
  );
}

export async function getMyWatchlists(): Promise<GetMyWatchlistsResponse> {
  return serverApiClient<GetMyWatchlistsResponse>(
    `${Endpoints.Watchlists.Base}${Endpoints.Watchlists.MyWatchlists}`,
    {
      method: "GET",
      version: Endpoints.Watchlists.BaseVersion,
    },
  );
}

export async function createWatchlist(
  payload: WatchlistDetailCreateRequest,
): Promise<CreatedWatchlistResponse> {
  return serverApiClient<CreatedWatchlistResponse>(
    `${Endpoints.Watchlists.Base}`,
    {
      method: "POST",
      version: Endpoints.Watchlists.BaseVersion,
      body: JSON.stringify(payload),
    },
  );
}
