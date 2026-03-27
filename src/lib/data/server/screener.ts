"use server";

import { ScreenerCuratedResult } from "@/schemas/screener";
import { serverApiClient } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";

export async function fetchCuratedScreens(
  assetType: "equity" | "fund",
  limit = 25,
): Promise<ScreenerCuratedResult> {
  return serverApiClient<ScreenerCuratedResult>(
    `${Endpoints.Yfinance.Base}${
      Endpoints.Yfinance.Screener.Base
    }${Endpoints.Yfinance.Screener.Curated(assetType, limit)}`,
    { method: "GET", version: Endpoints.Yfinance.Screener.BaseVersion },
  );
}
