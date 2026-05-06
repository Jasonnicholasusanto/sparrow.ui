"use client";

import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useWatchlists } from "@/providers/watchlist-provider";
import { useFavouriteStocks } from "@/providers/favourite-stocks-provider";
import { SidebarWatchlistCard } from "./components/sidebar-watchlist-card";
import type { WatchlistDetailOut } from "@/schemas/watchlist";
import type { FavouriteStockResponse } from "@/schemas/favouriteStock";
import { SidebarFavouriteStockCard } from "./components/sidebar-favourite-stock-card";
import { useState } from "react";

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <div className="min-h-0 flex-1 px-2 pb-2">
        <ScrollArea className="h-full pr-2">{children}</ScrollArea>
      </div>
    </div>
  );
}

function SidebarStateMessage({
  loading,
  loadingText,
  emptyText,
}: {
  loading: boolean;
  loadingText: string;
  emptyText: string;
}) {
  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        {loadingText}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
      {emptyText}
    </div>
  );
}

function FavouriteStocksList({
  favouriteStocks,
  loading,
  onRemove,
}: {
  favouriteStocks: FavouriteStockResponse[];
  loading: boolean;
  onRemove: (id: number) => Promise<void>;
}) {
  const [removingId, setRemovingId] = useState<number | null>(null);

  async function handleRemove(id: number) {
    try {
      setRemovingId(id);
      await onRemove(id);
    } finally {
      setRemovingId(null);
    }
  }

  if (!favouriteStocks.length) {
    return (
      <SidebarStateMessage
        loading={loading}
        loadingText="Loading favourite stocks..."
        emptyText="No favourite stocks yet."
      />
    );
  }

  return (
    <div className="space-y-1">
      {favouriteStocks.map((stock) => (
        <SidebarFavouriteStockCard
          key={stock.id}
          stock={stock}
          onRemove={handleRemove}
          isRemoving={removingId === stock.id}
        />
      ))}
    </div>
  );
}

function SidebarWatchlistsList({
  watchlists,
  loading,
  onRefresh,
}: {
  watchlists: WatchlistDetailOut[];
  loading: boolean;
  onRefresh: () => void | Promise<void>;
}) {
  if (!watchlists.length) {
    return (
      <SidebarStateMessage
        loading={loading}
        loadingText="Loading watchlists..."
        emptyText="No watchlists yet."
      />
    );
  }

  return (
    <div className="space-y-2">
      {watchlists.map((watchlist) => (
        <SidebarWatchlistCard
          key={watchlist.id}
          watchlist={watchlist}
          isOwnProfile={true}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

export function SidebarPanel() {
  const {
    watchlists,
    loading: watchlistsLoading,
    refreshWatchlists,
  } = useWatchlists();

  const {
    favouriteStocks,
    loading: favouriteStocksLoading,
    deleteFavourite,
  } = useFavouriteStocks();

  console.log(favouriteStocks);

  const favouriteCount = favouriteStocks.length;
  const watchlistCount = watchlists.length;

  let favouritePanelSize = 50;
  let watchlistPanelSize = 50;

  if (favouriteCount === 0 && watchlistCount > 0) {
    favouritePanelSize = 30;
    watchlistPanelSize = 70;
  } else if (favouriteCount > 0 && watchlistCount === 0) {
    favouritePanelSize = 70;
    watchlistPanelSize = 30;
  } else if (favouriteCount > watchlistCount) {
    favouritePanelSize = 60;
    watchlistPanelSize = 40;
  } else if (favouriteCount < watchlistCount) {
    favouritePanelSize = 40;
    watchlistPanelSize = 60;
  }

  return (
    <Card className="flex h-full min-h-0 flex-col rounded-3xl p-0">
      <CardContent className="min-h-0 flex-1 p-0">
        <ResizablePanelGroup orientation="vertical" className="h-full min-h-0">
          <ResizablePanel defaultSize={favouritePanelSize} minSize={30}>
            <SidebarSection title="Favourite Stocks">
              <FavouriteStocksList
                favouriteStocks={favouriteStocks}
                loading={favouriteStocksLoading}
                onRemove={deleteFavourite}
              />
            </SidebarSection>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={watchlistPanelSize} minSize={25}>
            <SidebarSection title="Watchlists">
              <SidebarWatchlistsList
                watchlists={watchlists}
                loading={watchlistsLoading}
                onRefresh={refreshWatchlists}
              />
            </SidebarSection>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
    </Card>
  );
}
