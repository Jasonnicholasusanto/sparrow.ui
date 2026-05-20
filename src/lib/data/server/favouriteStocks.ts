import { Endpoints } from "@/lib/api/endpoints";
import { serverApiClient } from "@/lib/api/server";
import { FavouriteStockResponse } from "@/schemas/favouriteStock";

export async function getFavouriteStocks(): Promise<FavouriteStockResponse[]> {
  try {
    return serverApiClient<FavouriteStockResponse[]>(
      Endpoints.FavouriteStocks.Base,
      {
        method: "GET",
        version: Endpoints.FavouriteStocks.BaseVersion,
      },
    );
  } catch (error) {
    console.error("Error fetching favourite stocks:", error);
    throw error;
  }
}
