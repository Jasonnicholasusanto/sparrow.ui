import { Endpoints } from "@/lib/api/endpoints";

export const screenerDataPaths = {
  curated: (assetType: "equity" | "fund", limit = 25) =>
    `${Endpoints.Yfinance.Base}${
      Endpoints.Yfinance.Screener.Base
    }${Endpoints.Yfinance.Screener.Curated(assetType, limit)}`,
};
