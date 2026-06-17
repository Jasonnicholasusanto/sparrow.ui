"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";

import {
  addItemToWatchlistClient,
  createWatchlistClient,
  deleteWatchlistClient,
  deleteWatchlistItemClient,
  getMyWatchlistsClient,
  updateWatchlistClient,
  updateWatchlistItemClient,
} from "@/lib/data/client/watchlist";

import type {
  AddWatchlistItem,
  CreatedWatchlistResponse,
  GetMyWatchlistsResponse,
  WatchlistDetailCreatePayload,
  WatchlistDetailOut,
  UpdateWatchlistItem,
  WatchlistItemApiResponse,
} from "@/schemas/watchlist";

type WatchlistContextValue = {
  watchlistsResponse: GetMyWatchlistsResponse | null;
  watchlists: WatchlistDetailOut[];
  loading: boolean;
  hasLoaded: boolean;

  refreshWatchlists: () => Promise<void>;

  createWatchlist: (
    payload: WatchlistDetailCreatePayload,
  ) => Promise<CreatedWatchlistResponse | null>;

  updateWatchlist: (
    watchlistId: number,
    payload: WatchlistDetailCreatePayload,
  ) => Promise<WatchlistDetailOut | null>;

  addItemToWatchlist: (
    watchlistId: number,
    payload: AddWatchlistItem,
  ) => Promise<WatchlistItemApiResponse>;

  updateWatchlistItem: (
    itemId: number,
    payload: UpdateWatchlistItem,
  ) => Promise<WatchlistItemApiResponse>;

  deleteWatchlist: (watchlistId: number) => Promise<void>;
  deleteWatchlistItem: (itemId: number) => Promise<WatchlistItemApiResponse>;

  setWatchlistsResponse: React.Dispatch<
    React.SetStateAction<GetMyWatchlistsResponse | null>
  >;
};

const WatchlistContext = createContext<WatchlistContextValue | null>(null);

type WatchlistProviderProps = {
  children: ReactNode;
  initialWatchlistsResponse?: GetMyWatchlistsResponse | null;
};

export default function WatchlistProvider({
  children,
  initialWatchlistsResponse = null,
}: WatchlistProviderProps) {
  const [watchlistsResponse, setWatchlistsResponse] =
    useState<GetMyWatchlistsResponse | null>(initialWatchlistsResponse);

  const [loading, setLoading] = useState(false);

  const [hasLoaded, setHasLoaded] = useState(
    initialWatchlistsResponse !== null,
  );

  const refreshWatchlists = useCallback(async () => {
    try {
      setLoading(true);

      const res = await getMyWatchlistsClient();

      setWatchlistsResponse(res);
      setHasLoaded(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to refresh watchlists");
    } finally {
      setLoading(false);
    }
  }, []);

  const createWatchlist = useCallback(
    async (
      payload: WatchlistDetailCreatePayload,
    ): Promise<CreatedWatchlistResponse | null> => {
      try {
        const res = await createWatchlistClient(payload);

        await refreshWatchlists();

        toast.success("Watchlist created");

        return res;
      } catch (error) {
        console.error(error);
        toast.error("Failed to create watchlist");
        return null;
      }
    },
    [refreshWatchlists],
  );

  const updateWatchlist = useCallback(
    async (
      watchlistId: number,
      payload: WatchlistDetailCreatePayload,
    ): Promise<WatchlistDetailOut | null> => {
      try {
        const res = await updateWatchlistClient(watchlistId, payload);

        await refreshWatchlists();

        toast.success("Watchlist updated");

        return res;
      } catch (error) {
        console.error(error);
        toast.error("Failed to update watchlist");
        return null;
      }
    },
    [refreshWatchlists],
  );

  const addItemToWatchlist = useCallback(
    async (
      watchlistId: number,
      payload: AddWatchlistItem,
    ): Promise<WatchlistItemApiResponse> => {
      try {
        const res = await addItemToWatchlistClient(watchlistId, payload);

        await refreshWatchlists();

        toast.success("Added to watchlist");

        return res;
      } catch (error) {
        console.error(error);
        toast.error("Failed to add item to watchlist");
        return { message: "error", item: null };
      }
    },
    [refreshWatchlists],
  );

  const updateWatchlistItem = useCallback(
    async (
      itemId: number,
      payload: UpdateWatchlistItem,
    ): Promise<WatchlistItemApiResponse> => {
      try {
        const res = await updateWatchlistItemClient(itemId, payload);

        await refreshWatchlists();

        toast.success("Watchlist item updated");
        return res;
      } catch (error) {
        console.error(error);
        toast.error("Failed to update watchlist item");
        return { message: "error", item: null };
      }
    },
    [refreshWatchlists],
  );

  const deleteWatchlist = useCallback(
    async (watchlistId: number) => {
      try {
        await deleteWatchlistClient(watchlistId);

        await refreshWatchlists();

        toast.success("Watchlist deleted");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete watchlist");
      }
    },
    [refreshWatchlists],
  );

  const deleteWatchlistItem = useCallback(
    async (itemId: number): Promise<WatchlistItemApiResponse> => {
      try {
        const res = await deleteWatchlistItemClient(itemId);

        setWatchlistsResponse((current) => {
          if (!current?.results) return current;

          const removeItemFromWatchlist = (
            watchlist: WatchlistDetailOut,
          ): WatchlistDetailOut => {
            return {
              ...watchlist,
              items:
                watchlist.items?.filter((item) => item.id !== itemId) ?? [],
            };
          };

          return {
            ...current,
            results: {
              ...current.results,
              created: current.results.created?.map(removeItemFromWatchlist),
              forked: current.results.forked?.map(removeItemFromWatchlist),
              shared: current.results.shared?.map(removeItemFromWatchlist),
              bookmarked: current.results.bookmarked?.map(
                removeItemFromWatchlist,
              ),
            },
          };
        });

        toast.success("Removed from watchlist");
        return res;
      } catch (error) {
        console.error(error);
        toast.error("Failed to remove item from watchlist");
        return { message: "error", item: null };
      }
    },
    [],
  );

  useEffect(() => {
    if (!hasLoaded) {
      void refreshWatchlists();
    }
  }, [hasLoaded, refreshWatchlists]);

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

  const value = useMemo(
    () => ({
      watchlistsResponse,
      watchlists,
      loading,
      hasLoaded,

      refreshWatchlists,

      createWatchlist,
      updateWatchlist,
      addItemToWatchlist,
      updateWatchlistItem,

      deleteWatchlist,
      deleteWatchlistItem,

      setWatchlistsResponse,
    }),
    [
      watchlistsResponse,
      watchlists,
      loading,
      hasLoaded,

      refreshWatchlists,

      createWatchlist,
      updateWatchlist,
      addItemToWatchlist,
      updateWatchlistItem,

      deleteWatchlist,
      deleteWatchlistItem,

      setWatchlistsResponse,
    ],
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
