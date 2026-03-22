"use server";

import { SearchHistoryEntry } from "@/schemas/search";
import { Endpoints } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server";

export async function addSearchHistoryEntry(
  query: string,
  type: string,
): Promise<SearchHistoryEntry> {
  return serverApiClient<SearchHistoryEntry>(
    `${Endpoints.SearchHistory.Base}/?query=${encodeURIComponent(
      query,
    )}&type=${type}`,
    {
      method: "POST",
      version: Endpoints.SearchHistory.BaseVersion,
      body: JSON.stringify({ query }),
    },
  );
}
