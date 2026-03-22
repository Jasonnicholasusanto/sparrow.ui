import { Endpoints } from "@/lib/api/endpoints";

export interface SearchQuotesParams {
  maxResult?: number;
  recommended?: number;
  enableFuzzyQuery?: boolean;
}

export function getDefaultSearchQuotesResponse(query: string) {
  return { query, results: [] };
}

export function buildSearchQuotesPath(
  query: string,
  params: SearchQuotesParams = {},
): string {
  const { maxResult = 8, recommended = 8, enableFuzzyQuery = true } = params;

  return `${Endpoints.Yfinance.Base}${
    Endpoints.Yfinance.Stocks.Base
  }${Endpoints.Yfinance.Stocks.SearchQuotes(
    query,
    maxResult,
    recommended,
    enableFuzzyQuery,
  )}`;
}

export function buildSearchHistoryPath(limit: number): string {
  return `${Endpoints.SearchHistory.Base}/?limit=${limit}`;
}

export function buildSearchTypesPath(): string {
  return `${Endpoints.SearchHistory.Base}/types`;
}
