"use client";

import {
  AddWatchlistItem,
  CreatedWatchlistResponse,
  GetMyWatchlistsResponse,
  UpdateWatchlistItem,
  WatchlistDetailCreatePayload,
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

export async function addItemToWatchlistClient(
  watchlistId: number,
  payload: AddWatchlistItem,
): Promise<{ message: string }> {
  return clientApiClient<{ message: string }>(
    watchlistDataPaths.addWatchlistItem(watchlistId),
    {
      method: "POST",
      version: Endpoints.Watchlists.BaseVersion,
      body: JSON.stringify(payload),
    },
  );
}

export async function createWatchlistClient(
  payload: WatchlistDetailCreatePayload,
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

export async function updateWatchlistClient(
  watchlistId: number,
  payload: WatchlistDetailCreatePayload,
): Promise<{ message: string }> {
  return clientApiClient<{ message: string }>(
    watchlistDataPaths.update(watchlistId),
    {
      method: "PATCH",
      version: Endpoints.Watchlists.BaseVersion,
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteWatchlistClient(watchlistId: number) {
  return clientApiClient<{ message: string }>(
    watchlistDataPaths.delete(watchlistId),
    {
      method: "DELETE",
      version: Endpoints.Watchlists.BaseVersion,
    },
  );
}

export async function updateWatchlistItemClient(
  itemId: number,
  payload: UpdateWatchlistItem,
): Promise<{ message: string }> {
  return clientApiClient<{ message: string }>(
    watchlistDataPaths.updateWatchlistItem(itemId),
    {
      method: "PATCH",
      version: Endpoints.Watchlists.BaseVersion,
      body: JSON.stringify(payload),
    },
  );
}

export async function deleteWatchlistItemClient(itemId: number) {
  return clientApiClient<{ message: string }>(
    watchlistDataPaths.deleteItem(itemId),
    {
      method: "DELETE",
      version: Endpoints.Watchlists.BaseVersion,
    },
  );
}
