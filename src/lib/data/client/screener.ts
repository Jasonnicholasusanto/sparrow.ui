"use client";

import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { ScreenerCuratedResult } from "@/schemas/screener";
import { screenerDataPaths } from "../shared/screener";

export async function fetchCuratedScreensClient(
  assetType: "equity" | "fund",
  limit = 25,
): Promise<ScreenerCuratedResult> {
  try {
    return clientApiClient<ScreenerCuratedResult>(
      screenerDataPaths.curated(assetType, limit),
      {
        method: "GET",
        version: Endpoints.Yfinance.Screener.BaseVersion,
      },
    );
  } catch (error) {
    console.error("Error fetching curated screens:", error);
    throw error;
  }
}
