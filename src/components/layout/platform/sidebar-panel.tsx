"use client";

import { Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";
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
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarFavouriteStockTableRow } from "./components/sidebar-favourite-stock-table-row";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { QuoteResult, SearchQuotesResponse } from "@/schemas/search";
import { searchQuotesClient } from "@/lib/data/client/search";
import { getLogoUrl } from "@/lib/utils/tickerLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function SidebarSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between px-4 py-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        {action}
      </div>

      <div className="min-h-0 flex-1 px-2 pb-2">
        <ScrollArea className="h-full pr-2">{children}</ScrollArea>
      </div>
    </div>
  );
}

function useDebouncedValue<T>(value: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function AddFavouriteStockDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (stock: QuoteResult) => Promise<void>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuoteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingSymbol, setAddingSymbol] = useState<string | null>(null);

  const debouncedQuery = useDebouncedValue(query, 500);
  const trimmedQuery = debouncedQuery.trim();

  useEffect(() => {
    async function runSearch() {
      if (!open) return;

      if (!trimmedQuery) {
        setResults([]);
        return;
      }

      try {
        setLoading(true);

        const res: SearchQuotesResponse = await searchQuotesClient(
          trimmedQuery,
          {
            maxResult: 8,
            recommended: 8,
            enableFuzzyQuery: true,
          },
        );

        setResults(res.results ?? []);
      } catch (error) {
        console.error("Failed to search quotes:", error);
        setResults([]);
        toast.error("Failed to search stocks/funds");
      } finally {
        setLoading(false);
      }
    }

    void runSearch();
  }, [open, trimmedQuery]);

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      setQuery("");
      setResults([]);
      setAddingSymbol(null);
    }
  }

  async function handleAdd(stock: QuoteResult) {
    try {
      setAddingSymbol(stock.symbol);

      await onAdd(stock);

      toast.success(`${stock.symbol} added to favourites`);
      handleOpenChange(false);
    } catch (error) {
      console.error("Failed to add favourite stock:", error);
      toast.error("Failed to add favourite stock");
    } finally {
      setAddingSymbol(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-2xl min-w-xl max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Add stock or fund</DialogTitle>
          <DialogDescription>
            Search for a stock, ETF, or fund and add it to your favourites.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by symbol or company name..."
              className="h-11 rounded-2xl pl-9"
              autoFocus
            />
          </div>

          <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
            {loading ? (
              <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : null}

            {!loading && query.trim() && results.length === 0 ? (
              <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                No stocks or funds found.
              </div>
            ) : null}

            {!loading
              ? results.map((stock) => {
                  const isAdding = addingSymbol === stock.symbol;
                  const logoUrl = getLogoUrl(stock.symbol);

                  return (
                    <button
                      key={`${stock.symbol}-${stock.exchange}`}
                      type="button"
                      onClick={() => void handleAdd(stock)}
                      disabled={isAdding}
                      className="
                        flex w-full items-center justify-between gap-3 rounded-2xl border p-3
                        text-left transition hover:bg-muted/60 disabled:cursor-not-allowed
                        disabled:opacity-60 cursor-pointer
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0 border-2 border-background">
                          <AvatarImage
                            src={logoUrl}
                            alt={`${stock.symbol} logo`}
                          />
                          <AvatarFallback className="text-[10px] font-medium">
                            {stock.symbol.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0 flex-1">
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="truncate font-semibold">
                              {stock.symbol}
                            </span>

                            {stock.exchange ? (
                              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {stock.exchange}
                              </span>
                            ) : null}
                          </div>

                          <p className="truncate text-sm text-muted-foreground">
                            {stock.shortname ??
                              stock.longname ??
                              "Unknown name"}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-center rounded-full bg-muted p-2 text-muted-foreground transition group-hover:bg-background">
                        {isAdding ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  );
                })
              : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
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

function FavouriteStocksTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-25">Symbol</TableHead>
        <TableHead className="text-right">Last</TableHead>
        <TableHead className="text-right">Change</TableHead>
        <TableHead className="text-right">Change %</TableHead>
      </TableRow>
    </TableHeader>
  );
}

function FavouriteStocksTable({
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

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading favourite stocks...
      </div>
    );
  }

  if (!favouriteStocks.length) {
    return (
      <div className="rounded-2xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        No favourite stocks yet.
      </div>
    );
  }

  return (
    <Table>
      <FavouriteStocksTableHeader />
      <TableBody>
        {favouriteStocks.map((stock) => (
          <SidebarFavouriteStockTableRow
            key={stock.id}
            stock={stock}
            onRemove={handleRemove}
            isRemoving={removingId === stock.id}
          />
        ))}
      </TableBody>
    </Table>
  );
}

function SidebarWatchlistsList({
  watchlists,
  loading,
  onRefresh,
  onRemove,
}: {
  watchlists: WatchlistDetailOut[];
  loading: boolean;
  onRefresh: () => void | Promise<void>;
  onRemove: (watchlistId: number) => void | Promise<void>;
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
          onRemove={handleRemove}
          isRemoving={removingId === watchlist.id}
        />
      ))}
    </div>
  );
}

export function SidebarPanel() {
  const [addFavouriteOpen, setAddFavouriteOpen] = useState(false);

  const {
    watchlists,
    loading: watchlistsLoading,
    refreshWatchlists,
    deleteWatchlist,
  } = useWatchlists();

  const {
    favouriteStocks,
    loading: favouriteStocksLoading,
    deleteFavourite,
    addFavourite,
  } = useFavouriteStocks();

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

  async function handleAddFavouriteStock(stock: QuoteResult) {
    await addFavourite(stock.symbol, stock.exchange!, null);
  }

  return (
    <Card className="flex h-full min-h-0 flex-col rounded-3xl p-0">
      <CardContent className="min-h-0 flex-1 p-0">
        <ResizablePanelGroup orientation="vertical" className="h-full min-h-0">
          <ResizablePanel defaultSize={favouritePanelSize} minSize={30}>
            <SidebarSection
              title="Favourites"
              action={
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="h-8 rounded-full px-2"
                  onClick={() => setAddFavouriteOpen(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add
                </Button>
              }
            >
              <FavouriteStocksTable
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
                onRemove={deleteWatchlist}
              />
            </SidebarSection>
          </ResizablePanel>
        </ResizablePanelGroup>
      </CardContent>
      <AddFavouriteStockDialog
        open={addFavouriteOpen}
        onOpenChange={setAddFavouriteOpen}
        onAdd={handleAddFavouriteStock}
      />
    </Card>
  );
}
