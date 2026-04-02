import { Endpoints } from "@/lib/api/endpoints";
import { info } from "node:console";

export const stockDataPaths = {
  info: (ticker: string) =>
    `${Endpoints.Yfinance.Base}${
      Endpoints.Yfinance.Stocks.Base
    }${Endpoints.Yfinance.Stocks.Info(ticker)}`,
  history: (ticker: string, interval: string, period: string) =>
    `${Endpoints.Yfinance.Base}${
      Endpoints.Yfinance.Stocks.Base
    }${Endpoints.Yfinance.Stocks.SimpleHistory(ticker, interval, period)}`,
};
