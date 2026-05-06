"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import type { FavouriteStockResponse } from "@/schemas/favouriteStock";
import {
  addFavouriteStock,
  clearFavouriteStocks,
  deleteFavouriteStock,
  fetchFavouriteStocks,
  updateFavouriteStock,
} from "@/lib/data/client/favouriteStocks";

type FavouriteStocksContextValue = {
  favouriteStocks: FavouriteStockResponse[];
  loading: boolean;
  refreshFavouriteStocks: () => Promise<void>;
  addFavourite: (
    symbol: string,
    exchange: string,
    note?: string | null,
  ) => Promise<void>;
  deleteFavourite: (id: number) => Promise<void>;
  updateFavourite: (id: number, note: string | null) => Promise<void>;
  clearFavourites: () => Promise<void>;
  isFavourite: (symbol: string) => boolean;
};

const FavouriteStocksContext =
  createContext<FavouriteStocksContextValue | null>(null);

type FavouriteStocksProviderProps = {
  children: ReactNode;
  initialFavouriteStocks?: FavouriteStockResponse[];
};

export function FavouriteStocksProvider({
  children,
  initialFavouriteStocks = [],
}: FavouriteStocksProviderProps) {
  const [favouriteStocks, setFavouriteStocks] = useState<
    FavouriteStockResponse[]
  >(initialFavouriteStocks);

  const [loading, setLoading] = useState(false);

  async function refreshFavouriteStocks() {
    try {
      setLoading(true);
      const data = await fetchFavouriteStocks();
      setFavouriteStocks(data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh favourite stocks");
    } finally {
      setLoading(false);
    }
  }

  async function addFavourite(
    symbol: string,
    exchange: string,
    note?: string | null,
  ) {
    const created = await addFavouriteStock(symbol, exchange, note);

    setFavouriteStocks((prev) => {
      const exists = prev.some(
        (stock) => stock.symbol.toUpperCase() === created.symbol.toUpperCase(),
      );

      if (exists) return prev;

      return [created, ...prev];
    });
  }

  async function deleteFavourite(id: number) {
    await deleteFavouriteStock(id);

    setFavouriteStocks((prev) => prev.filter((stock) => stock.id !== id));
  }

  async function updateFavourite(id: number, note: string | null) {
    const updated = await updateFavouriteStock(id, note);

    setFavouriteStocks((prev) =>
      prev.map((stock) => (stock.id === id ? updated : stock)),
    );
  }

  async function clearFavourites() {
    await clearFavouriteStocks();
    setFavouriteStocks([]);
  }

  function isFavourite(symbol: string) {
    return favouriteStocks.some(
      (stock) => stock.symbol.toUpperCase() === symbol.toUpperCase(),
    );
  }

  const value = useMemo(
    () => ({
      favouriteStocks,
      loading,
      refreshFavouriteStocks,
      addFavourite,
      deleteFavourite,
      updateFavourite,
      clearFavourites,
      isFavourite,
    }),
    [favouriteStocks, loading],
  );

  return (
    <FavouriteStocksContext.Provider value={value}>
      {children}
    </FavouriteStocksContext.Provider>
  );
}

export function useFavouriteStocks() {
  const context = useContext(FavouriteStocksContext);

  if (!context) {
    throw new Error(
      "useFavouriteStocks must be used within FavouriteStocksProvider",
    );
  }

  return context;
}
