"use server";

import { serverApiClient } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";
import { SearchHistoryEntry, SearchQuotesResponse } from "@/schemas/search";
import {
  buildSearchHistoryPath,
  buildSearchQuotesPath,
  buildSearchTypesPath,
  getDefaultSearchQuotesResponse,
  type SearchQuotesParams,
} from "@/lib/data/shared/search";

export async function searchQuotesServer(
  query: string,
  params: SearchQuotesParams = {},
): Promise<SearchQuotesResponse> {
  if (!query.trim()) {
    return getDefaultSearchQuotesResponse(query);
  }

  return serverApiClient<SearchQuotesResponse>(
    buildSearchQuotesPath(query, params),
    {
      method: "GET",
      version: Endpoints.Yfinance.Stocks.BaseVersion,
    },
  );
}

export async function searchHistoryServer(
  limit: number,
): Promise<SearchHistoryEntry[]> {
  return serverApiClient<SearchHistoryEntry[]>(buildSearchHistoryPath(limit), {
    method: "GET",
    version: Endpoints.SearchHistory.BaseVersion,
  });
}

export async function fetchSearchTypesServer(): Promise<string[]> {
  return serverApiClient<string[]>(buildSearchTypesPath(), {
    method: "GET",
    version: Endpoints.SearchHistory.BaseVersion,
  });
}
