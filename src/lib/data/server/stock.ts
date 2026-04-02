"use server";

import { StockHistoryResponse, StockInfoResponse } from "@/schemas/stock";
import { Endpoints } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server";
import { stockDataPaths } from "../shared/stock";

export async function getStockInfo(ticker: string) {
  return serverApiClient<StockInfoResponse>(stockDataPaths.info(ticker), {
    method: "GET",
    version: Endpoints.Yfinance.Stocks.BaseVersion,
  });
}

export async function getStockHistory(
  ticker: string,
  interval: string,
  period: string,
) {
  return serverApiClient<StockHistoryResponse>(
    `${Endpoints.Yfinance.Base}${
      Endpoints.Yfinance.Stocks.Base
    }${Endpoints.Yfinance.Stocks.SimpleHistory(ticker, interval, period)}`,
    {
      method: "GET",
      version: Endpoints.Yfinance.Stocks.BaseVersion,
    },
  );
}
