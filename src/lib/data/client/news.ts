import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { StockNewsResponse } from "@/schemas/news";

export async function fetchStockNews(
  symbol: string,
): Promise<StockNewsResponse> {
  try {
    return clientApiClient<StockNewsResponse>(
      Endpoints.Yfinance.News.StockNews(symbol),
      {
        method: "GET",
        version: Endpoints.Yfinance.News.BaseVersion,
      },
    );
  } catch (error) {
    console.error("Error fetching stock news:", error);
    throw error;
  }
}
