import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { StockHistoryResponse } from "@/schemas/stock";
import { stockDataPaths } from "../shared/stock";

export async function getStockHistoryClient(
  ticker: string,
  interval: string,
  period: string,
): Promise<StockHistoryResponse> {
  return clientApiClient<StockHistoryResponse>(
    stockDataPaths.history(ticker, interval, period),
    {
      method: "GET",
      version: Endpoints.Yfinance.Stocks.BaseVersion,
    },
  );
}
