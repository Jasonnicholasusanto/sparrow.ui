import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { WatchlistAuditEventOut } from "@/schemas/watchlistHistory";

export async function getMyWatchlistHistory(): Promise<
  WatchlistAuditEventOut[]
> {
  return clientApiClient<WatchlistAuditEventOut[]>(
    Endpoints.WatchlistHistory.MyWatchlistHistory,
    {
      method: "GET",
      version: Endpoints.WatchlistHistory.BaseVersion,
    },
  );
}

export async function getWatchlistHistory(
  watchlistId: number,
): Promise<WatchlistAuditEventOut[]> {
  return clientApiClient<WatchlistAuditEventOut[]>(
    Endpoints.WatchlistHistory.WatchlistHistoryById(watchlistId),
    {
      method: "GET",
      version: Endpoints.WatchlistHistory.BaseVersion,
    },
  );
}
