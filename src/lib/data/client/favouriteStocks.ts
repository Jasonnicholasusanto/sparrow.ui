"use client";

import { clientApiClient } from "@/lib/api/client";
import { Endpoints } from "@/lib/api/endpoints";
import { FavouriteStockResponse } from "@/schemas/favouriteStock";

export async function fetchFavouriteStocks(): Promise<
  FavouriteStockResponse[]
> {
  try {
    return clientApiClient<FavouriteStockResponse[]>(
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

export async function addFavouriteStock(
  symbol: string,
  exchange: string,
  note?: string | null,
): Promise<FavouriteStockResponse> {
  try {
    return clientApiClient<FavouriteStockResponse>(
      Endpoints.FavouriteStocks.Base,
      {
        method: "POST",
        version: Endpoints.FavouriteStocks.BaseVersion,
        body: JSON.stringify({ symbol, exchange, note }),
      },
    );
  } catch (error) {
    console.error("Error adding favourite stock:", error);
    throw error;
  }
}

export async function deleteFavouriteStock(id: number): Promise<void> {
  try {
    await clientApiClient(
      `${Endpoints.FavouriteStocks.Base}${Endpoints.FavouriteStocks.Delete(id)}`,
      {
        method: "DELETE",
        version: Endpoints.FavouriteStocks.BaseVersion,
      },
    );
  } catch (error) {
    console.error("Error deleting favourite stock:", error);
    throw error;
  }
}

export async function clearFavouriteStocks(): Promise<void> {
  try {
    await clientApiClient(`${Endpoints.FavouriteStocks.Base}`, {
      method: "DELETE",
      version: Endpoints.FavouriteStocks.BaseVersion,
    });
  } catch (error) {
    console.error("Error clearing favourite stocks:", error);
    throw error;
  }
}

export async function updateFavouriteStock(
  id: number,
  note: string | null,
): Promise<FavouriteStockResponse> {
  try {
    return clientApiClient<FavouriteStockResponse>(
      `${Endpoints.FavouriteStocks.Base}/${id}`,
      {
        method: "PUT",
        version: Endpoints.FavouriteStocks.BaseVersion,
        body: JSON.stringify({ note }),
      },
    );
  } catch (error) {
    console.error("Error updating favourite stock:", error);
    throw error;
  }
}
