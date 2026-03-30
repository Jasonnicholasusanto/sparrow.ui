"use server";

import { serverApiClient } from "@/lib/api/server";
import { Endpoints } from "@/lib/api/endpoints";
import { ScreenerCuratedResult } from "@/schemas/screener";
import { screenerDataPaths } from "../shared/screener";

export async function fetchCuratedScreens(
  assetType: "equity" | "fund",
  limit = 25,
): Promise<ScreenerCuratedResult> {
  return serverApiClient<ScreenerCuratedResult>(
    screenerDataPaths.curated(assetType, limit),
    {
      method: "GET",
      version: Endpoints.Yfinance.Screener.BaseVersion,
    },
  );
}
