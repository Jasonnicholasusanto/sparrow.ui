"use client";

import { useEffect, useState } from "react";
import {
  Globe,
  Loader2,
  Lock,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WatchlistHistoryTimeline } from "./watchlist-history-timeline";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AddWatchlistItem, WatchlistDetailOut } from "@/schemas/watchlist";
import { WatchlistDetailsItemCard } from "./watchlist-details-items-card";
import { WatchlistDialog } from "@/components/watchlist/watchlist-dialog";
import { useWatchlists } from "@/providers/watchlist-provider";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { QuoteResult, SearchQuotesResponse } from "@/schemas/search";
import { searchQuotesClient } from "@/lib/data/client/search";
import { getLogoUrl } from "@/lib/utils/tickerLogo";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatWatchlistDate } from "@/lib/utils/formatDates";

type WatchlistDetailsDialogProps = {
  trigger: React.ReactNode;
  watchlist: WatchlistDetailOut;
  isOwnProfile: boolean;
  onRefresh: () => void | Promise<void>;
};

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

function getVisibilityIcon(visibility: string) {
  const normalized = visibility.toLowerCase();

  if (normalized === "private") return <Lock className="h-3.5 w-3.5" />;
  if (normalized === "shared") return <Users className="h-3.5 w-3.5" />;
  return <Globe className="h-3.5 w-3.5" />;
}

function AddWatchlistStockDialog({
  open,
  onOpenChange,
  onAdd,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (
    stock: QuoteResult,
    details: {
      quantity: number | null;
      note: string | null;
    },
  ) => Promise<boolean>;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuoteResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingSymbol, setAddingSymbol] = useState<string | null>(null);

  const [selectedStock, setSelectedStock] = useState<QuoteResult | null>(null);
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");

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

  function resetDialogState() {
    setQuery("");
    setResults([]);
    setAddingSymbol(null);
    setSelectedStock(null);
    setQuantity("");
    setNote("");
  }

  function handleOpenChange(nextOpen: boolean) {
    onOpenChange(nextOpen);

    if (!nextOpen) {
      resetDialogState();
    }
  }

  function handleSelectStock(stock: QuoteResult) {
    setSelectedStock(stock);
  }

  async function handleAddSelectedStock() {
    if (!selectedStock) return;

    const parsedQuantity =
      quantity.trim() === "" ? null : Number(quantity.trim());

    if (
      parsedQuantity !== null &&
      (Number.isNaN(parsedQuantity) || parsedQuantity < 0)
    ) {
      toast.error("Quantity must be a valid positive number");
      return;
    }

    try {
      setAddingSymbol(selectedStock.symbol);

      const success = await onAdd(selectedStock, {
        quantity: parsedQuantity,
        note: note.trim() === "" ? null : note.trim(),
      });

      if (success) {
        toast.success(`${selectedStock.symbol} added to watchlist`);
        handleOpenChange(false);
      }
    } catch (error) {
      console.error("Failed to add stock/fund to watchlist:", error);
      toast.error("Failed to add stock/fund to watchlist");
    } finally {
      setAddingSymbol(null);
    }
  }

  const isAdding = selectedStock
    ? addingSymbol === selectedStock.symbol
    : false;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-lg min-w-xl max-w-2xl overflow-hidden rounded-3xl">
        <DialogHeader className="border-b py-4">
          <DialogTitle>Add stocks or funds</DialogTitle>
          <DialogDescription>
            Search for a stock, ETF, or fund, then optionally add quantity and a
            note.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 overflow-y-auto">
          {!selectedStock ? (
            <>
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
                      const logoUrl = getLogoUrl(stock.symbol);

                      return (
                        <button
                          key={`${stock.symbol}-${stock.exchange}`}
                          type="button"
                          onClick={() => handleSelectStock(stock)}
                          className="
                            group flex w-full cursor-pointer items-center justify-between gap-3
                            rounded-2xl border p-3 text-left transition hover:bg-muted/60
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
                            <Plus className="h-4 w-4" />
                          </div>
                        </button>
                      );
                    })
                  : null}
              </div>
            </>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl border bg-muted/30 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 shrink-0 border-2 border-background">
                    <AvatarImage
                      src={getLogoUrl(selectedStock.symbol)}
                      alt={`${selectedStock.symbol} logo`}
                    />
                    <AvatarFallback className="text-[10px] font-medium">
                      {selectedStock.symbol.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="truncate text-lg font-semibold">
                        {selectedStock.symbol}
                      </span>

                      {selectedStock.exchange ? (
                        <span className="shrink-0 rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                          {selectedStock.exchange}
                        </span>
                      ) : null}
                    </div>

                    <p className="truncate text-sm text-muted-foreground">
                      {selectedStock.shortname ??
                        selectedStock.longname ??
                        "Unknown name"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="watchlist-item-quantity">Quantity</Label>
                  <Input
                    id="watchlist-item-quantity"
                    type="number"
                    min="0"
                    step="any"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="Optional"
                    disabled={isAdding}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="watchlist-item-note">Note</Label>
                  <Textarea
                    id="watchlist-item-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    placeholder="Optional note, e.g. long-term AI infrastructure play..."
                    disabled={isAdding}
                    className="min-h-28 resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="border-t bg-muted/20 py-4">
          {selectedStock ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedStock(null);
                setQuantity("");
                setNote("");
              }}
              disabled={isAdding}
            >
              Back
            </Button>
          ) : null}

          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isAdding}
          >
            Cancel
          </Button>

          {selectedStock ? (
            <Button
              type="button"
              onClick={() => void handleAddSelectedStock()}
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add to watchlist
                </>
              )}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WatchlistDetailsDialog({
  trigger,
  watchlist,
  isOwnProfile,
  onRefresh,
}: WatchlistDetailsDialogProps) {
  const {
    addItemToWatchlist,
    deleteWatchlistItem,
    updateWatchlistItem,
    deleteWatchlist,
  } = useWatchlists();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);

  async function handleAddStockToWatchlist(
    stock: QuoteResult,
    details: {
      quantity: number | null;
      note: string | null;
    },
  ) {
    if (!stock.symbol) {
      toast.error("Unable to add stock because the symbol is missing");
      return false;
    }

    const payload: AddWatchlistItem = {
      symbol: stock.symbol,
      exchange: stock.exchange!,
      note: details.note,
      quantity: details.quantity,
      referencePrice: stock.lastPrice,
    };

    const result = await addItemToWatchlist(watchlist.id, payload);

    return result.item !== null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>

        <DialogContent className="min-w-3xl max-w-5xl overflow-hidden">
          <DialogHeader>
            <div className="flex items-center gap-5">
              <DialogTitle>{watchlist.name}</DialogTitle>
              <Badge variant="outline" className="gap-1 rounded-full">
                {getVisibilityIcon(watchlist.visibility)}
                {watchlist.visibility}
              </Badge>
            </div>

            <DialogDescription>
              {watchlist.description || "No description provided."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-wrap gap-2">
            {watchlist.tags?.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="rounded-full">
                {tag.name}
              </Badge>
            ))}
          </div>

          <Separator />

          <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span>
                {watchlist.items?.length
                  ? `${watchlist.items.length} item${
                      watchlist.items.length > 1 ? "s" : ""
                    }`
                  : "No items in this watchlist."}
              </span>

              {watchlist.createdAt && (
                <>
                  <span className="hidden text-border sm:inline">|</span>
                  <span>
                    Created {formatWatchlistDate(new Date(watchlist.createdAt))}
                  </span>
                </>
              )}

              {watchlist.updatedAt && (
                <>
                  <span className="hidden text-border sm:inline">|</span>
                  <span>
                    Last updated{" "}
                    {formatWatchlistDate(new Date(watchlist.updatedAt))}
                  </span>
                </>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => setAddStockOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add stocks or funds
            </Button>
          </div>
          <Tabs defaultValue="items" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 rounded-2xl">
              <TabsTrigger value="items" className="rounded-l-2xl">
                Current holdings
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-r-2xl">
                Lineage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="items" className="mt-0">
              <ScrollArea className="max-h-100 pr-3">
                <div className="space-y-2 max-h-100">
                  {watchlist.items?.length ? (
                    watchlist.items.map((item) => (
                      <WatchlistDetailsItemCard
                        key={item.id}
                        item={item}
                        onRemove={() => deleteWatchlistItem(item.id)}
                        onUpdate={(payload) =>
                          updateWatchlistItem(item.id, payload)
                        }
                        onNavigate={() => setOpen(false)}
                      />
                    ))
                  ) : (
                    <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
                      This watchlist has no items.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <WatchlistHistoryTimeline
                watchlistId={watchlist.id}
                enabled={open}
              />
            </TabsContent>
          </Tabs>

          {isOwnProfile ? (
            <>
              <Separator />
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete watchlist
                </Button>
                <WatchlistDialog
                  mode="edit"
                  watchlist={watchlist}
                  onSuccess={onRefresh}
                  trigger={
                    <Button type="button" variant="outline">
                      Edit watchlist
                    </Button>
                  }
                />
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>

      <AddWatchlistStockDialog
        open={addStockOpen}
        onOpenChange={setAddStockOpen}
        onAdd={handleAddStockToWatchlist}
      />

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{watchlist.name}&quot;? This
              action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={async () => {
                try {
                  setIsDeleting(true);

                  await deleteWatchlist(watchlist.id);

                  setDeleteOpen(false);
                  setOpen(false);
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
