"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import { getMyWatchlistsClient } from "@/lib/data/client/watchlist";
import type {
  GetMyWatchlistsResponse,
  WatchlistDetailOut,
} from "@/schemas/watchlist";

type WatchlistContextValue = {
  watchlistsResponse: GetMyWatchlistsResponse | null;
  watchlists: WatchlistDetailOut[];
  loading: boolean;
  refreshWatchlists: () => Promise<void>;
  setWatchlistsResponse: React.Dispatch<
    React.SetStateAction<GetMyWatchlistsResponse | null>
  >;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

type WatchlistProviderProps = {
  children: ReactNode;
  initialWatchlistsResponse: GetMyWatchlistsResponse | null;
};

export default function WatchlistProvider({
  children,
  initialWatchlistsResponse,
}: WatchlistProviderProps) {
  const [watchlistsResponse, setWatchlistsResponse] =
    useState<GetMyWatchlistsResponse | null>(initialWatchlistsResponse);

  const [loading, setLoading] = useState(false);

  const watchlists = useMemo(() => {
    const grouped = watchlistsResponse?.results;
    if (!grouped) return [];

    const merged = [
      ...(grouped.created ?? []),
      ...(grouped.forked ?? []),
      ...(grouped.shared ?? []),
      ...(grouped.bookmarked ?? []),
    ];

    return Array.from(
      new Map(merged.map((watchlist) => [watchlist.id, watchlist])).values(),
    ) as WatchlistDetailOut[];
  }, [watchlistsResponse]);

  async function refreshWatchlists() {
    try {
      setLoading(true);
      const res = await getMyWatchlistsClient();
      setWatchlistsResponse(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh watchlists");
    } finally {
      setLoading(false);
    }
  }

  const value = useMemo(
    () => ({
      watchlistsResponse,
      watchlists,
      loading,
      refreshWatchlists,
      setWatchlistsResponse,
    }),
    [watchlistsResponse, watchlists, loading],
  );

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlists() {
  const context = useContext(WatchlistContext);

  if (!context) {
    throw new Error("useWatchlists must be used within WatchlistProvider");
  }

  return context;
}
