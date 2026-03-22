import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { SearchHistoryEntry, SearchQuotesResponse } from "@/schemas/search";
import {
  buildSearchHistoryPath,
  buildSearchQuotesPath,
  buildSearchTypesPath,
  getDefaultSearchQuotesResponse,
  type SearchQuotesParams,
} from "@/lib/data/shared/search";

export async function searchQuotesClient(
  query: string,
  params: SearchQuotesParams = {},
): Promise<SearchQuotesResponse> {
  if (!query.trim()) {
    return getDefaultSearchQuotesResponse(query);
  }

  return clientApiClient<SearchQuotesResponse>(
    buildSearchQuotesPath(query, params),
    {
      method: "GET",
      version: Endpoints.Yfinance.Stocks.BaseVersion,
    },
  );
}

export async function searchHistoryClient(
  limit: number,
): Promise<SearchHistoryEntry[]> {
  return clientApiClient<SearchHistoryEntry[]>(buildSearchHistoryPath(limit), {
    method: "GET",
    version: Endpoints.SearchHistory.BaseVersion,
  });
}

export async function fetchSearchTypesClient(): Promise<string[]> {
  return clientApiClient<string[]>(buildSearchTypesPath(), {
    method: "GET",
    version: Endpoints.SearchHistory.BaseVersion,
  });
}
