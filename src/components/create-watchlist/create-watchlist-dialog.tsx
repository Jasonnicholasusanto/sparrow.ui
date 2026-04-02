"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { z } from "zod";
import { Star, Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import {
  quoteResultToWatchlistRowItem,
  screenerTickerInfoToWatchlistRowItem,
  WatchlistItemRow,
} from "./watchlist-item-row";
import {
  createWatchlistClient,
  getWatchlistQuantityTypesClient,
  getWatchlistTypesClient,
} from "@/lib/data/client/watchlist";
import { fetchCuratedScreensClient } from "@/lib/data/client/screener";
import { WatchlistDetailCreateRequest } from "@/schemas/watchlist";
import { ScreenerTickerInfo } from "@/schemas/screener";
import { QuoteResult, SearchQuotesResponse } from "@/schemas/search";
import { searchQuotesClient } from "@/lib/data/client/search";

const createWatchlistSchema = z.object({
  name: z.string().min(1, "Watchlist name is required"),
  description: z.string().max(2000).optional(),
  visibility: z.string().min(1, "Please select a visibility"),
  quantityType: z.string().min(1, "Please select a quantity type"),
  isDefault: z.boolean(),
  assetType: z.enum(["equity", "fund"]),
  seedItems: z.array(
    z.object({
      symbol: z.string(),
      displayName: z.string().nullable().optional(),
      longName: z.string().nullable().optional(),
      exchange: z.string().nullable().optional(),
      currency: z.string().nullable().optional(),
      regularMarketPrice: z.number().nullable().optional(),
      regularMarketPreviousClose: z.number().nullable().optional(),
      regularMarketChange: z.number().nullable().optional(),
    }),
  ),
});

type SeedItemFormValue = z.infer<
  typeof createWatchlistSchema
>["seedItems"][number];

type CreateWatchlistFormValues = z.infer<typeof createWatchlistSchema>;

type CreateWatchlistDialogProps = {
  isIconOnly?: boolean;
};

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export function CreateWatchlistDialog({
  isIconOnly = false,
}: CreateWatchlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [metaLoading, setMetaLoading] = useState(false);
  const [visibilityTypes, setVisibilityTypes] = useState<string[]>([]);
  const [quantityTypes, setQuantityTypes] = useState<string[]>([]);
  const [curatedLoading, setCuratedLoading] = useState(false);
  const [curatedItems, setCuratedItems] = useState<ScreenerTickerInfo[]>([]);
  const [search, setSearch] = useState("");
  const [isSubmitting, startSubmitting] = useTransition();
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<QuoteResult[]>([]);
  const debouncedSearch = useDebouncedValue(search, 500);

  const form = useForm<CreateWatchlistFormValues>({
    resolver: zodResolver(createWatchlistSchema),
    defaultValues: {
      name: "",
      description: "",
      visibility: "",
      quantityType: "",
      isDefault: false,
      assetType: "equity",
      seedItems: [],
    },
  });

  const assetType = form.watch("assetType");
  const selectedSeedItems = form.watch("seedItems");
  const quantityType = form.watch("quantityType");

  useEffect(() => {
    if (!open) return;

    const loadMeta = async () => {
      try {
        setMetaLoading(true);

        const [visibilityRes, quantityRes] = await Promise.all([
          getWatchlistTypesClient(),
          getWatchlistQuantityTypesClient(),
        ]);

        const nextVisibilityTypes = visibilityRes ?? [];
        const nextQuantityTypes = quantityRes ?? [];

        setVisibilityTypes(nextVisibilityTypes);
        setQuantityTypes(nextQuantityTypes);

        const currentVisibility = form.getValues("visibility");
        const currentQuantityType = form.getValues("quantityType");

        if (!currentVisibility && nextVisibilityTypes.length > 0) {
          form.setValue("visibility", nextVisibilityTypes[0], {
            shouldValidate: true,
          });
        }

        if (!currentQuantityType && nextQuantityTypes.length > 0) {
          form.setValue("quantityType", nextQuantityTypes[0], {
            shouldValidate: true,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setMetaLoading(false);
      }
    };

    loadMeta();
  }, [open, form]);

  useEffect(() => {
    if (!open || step !== 2) return;

    const query = debouncedSearch.trim();

    if (!query) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    let cancelled = false;

    const runSearch = async () => {
      try {
        setSearchLoading(true);

        const res: SearchQuotesResponse = await searchQuotesClient(query, {
          maxResult: 8,
          recommended: 8,
          enableFuzzyQuery: true,
        });

        if (cancelled) return;

        const nextResults = Array.isArray(res?.results)
          ? res.results
          : Array.isArray((res as any)?.quotes)
            ? (res as any).quotes
            : Array.isArray((res as any)?.items)
              ? (res as any).items
              : [];

        setSearchResults(nextResults);
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setSearchLoading(false);
        }
      }
    };

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, open, step]);

  const normalizedCuratedItems = useMemo(
    () => curatedItems.map(screenerTickerInfoToWatchlistRowItem),
    [curatedItems],
  );

  const normalizedSearchResults = useMemo(
    () => searchResults.map(quoteResultToWatchlistRowItem),
    [searchResults],
  );

  // const displayItems = useMemo(() => {
  //   return debouncedSearch.trim() ? searchResults : curatedItems;
  // }, [debouncedSearch, searchResults, curatedItems]);

  const displayItems = useMemo(() => {
    return debouncedSearch.trim()
      ? normalizedSearchResults
      : normalizedCuratedItems;
  }, [debouncedSearch, normalizedSearchResults, normalizedCuratedItems]);

  function handleToggleSeedItem(item: ScreenerTickerInfo) {
    const current = form.getValues("seedItems");
    const exists = current.some((x) => x.symbol === item.symbol);

    if (exists) {
      form.setValue(
        "seedItems",
        current.filter((x) => x.symbol !== item.symbol),
        { shouldDirty: true, shouldValidate: true },
      );
      return;
    }

    const nextItem: SeedItemFormValue = {
      symbol: item.symbol,
      displayName: item.displayName ?? null,
      longName: item.longName ?? null,
      exchange: item.exchange ?? null,
      currency: item.currency ?? null,
      regularMarketPrice: item.regularMarketPrice ?? null,
      regularMarketPreviousClose: item.regularMarketPreviousClose ?? null,
      regularMarketChange: item.regularMarketChange ?? null,
    };

    form.setValue("seedItems", [...current, nextItem], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  async function handleNext() {
    const valid = await form.trigger([
      "name",
      "description",
      "visibility",
      "quantityType",
      "isDefault",
    ]);

    if (!valid) return;

    const selectedAssetType = form.getValues("assetType");
    setStep(2);
    await handleCategoryChange(selectedAssetType);
  }

  function handleBack() {
    setStep(1);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setTimeout(() => {
        setStep(1);
        setSearch("");
        setSearchResults([]);
        setSearchLoading(false);
        setCuratedItems([]);
        form.reset({
          name: "",
          description: "",
          visibility: "",
          quantityType: "",
          isDefault: false,
          assetType: "equity",
          seedItems: [],
        });
      }, 150);
    }
  }

  async function onSubmit(values: CreateWatchlistFormValues) {
    startSubmitting(async () => {
      try {
        const allocationType = values.quantityType;

        const payload: WatchlistDetailCreateRequest = {
          watchlist_data: {
            name: values.name.trim(),
            description: values.description?.trim() || "",
            visibility: values.visibility,
            allocation_type: allocationType,
            is_default: values.isDefault,
          },
          items:
            values.seedItems.length > 0
              ? values.seedItems.map((item, index) => ({
                  symbol: item.symbol,
                  exchange: item.exchange ?? "",
                  note: "",
                  position: index,
                  purchase_price: item.regularMarketPrice ?? 0,
                  percentage:
                    allocationType === "percentage"
                      ? Number((100 / values.seedItems.length).toFixed(2))
                      : 0,
                  quantity: allocationType === "quantity" ? 1 : 0,
                }))
              : [],
        };

        await createWatchlistClient(payload);
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    });
  }

  async function handleCategoryChange(category: "equity" | "fund") {
    try {
      setCuratedLoading(true);

      form.setValue("assetType", category, {
        shouldDirty: true,
        shouldValidate: true,
      });

      const data = await fetchCuratedScreensClient(category, 25);
      console.log("Raw curated data:", data);

      setCuratedItems(Array.isArray(data?.results) ? data.results : []);
    } catch (error) {
      console.error(error);
      setCuratedItems([]);
    } finally {
      setCuratedLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {isIconOnly ? (
          <Button variant="ghost" size="icon" aria-label="Create watchlist">
            <Star className="h-5 w-5" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Star className="h-5 w-5" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="min-w-3xl max-w-5xl overflow-hidden">
        <DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <DialogTitle>Create watchlist</DialogTitle>
              <DialogDescription>
                Build your watchlist first, then optionally seed it with curated
                stocks or funds.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 ? (
            <div className="grid gap-5 pb-5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">
                    Name <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Input
                    id="name"
                    placeholder="e.g. AI Compounders"
                    {...form.register("name")}
                  />

                  {form.formState.errors.name?.message && (
                    <FieldError>
                      {form.formState.errors.name.message}
                    </FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="description">Description</FieldLabel>

                  <Textarea
                    id="description"
                    placeholder="What is this watchlist for?"
                    className="min-h-28 resize-none"
                    maxLength={2000}
                    {...form.register("description")}
                  />

                  <FieldDescription>
                    {form.watch("description")?.length ?? 0}/2000 characters
                  </FieldDescription>

                  {form.formState.errors.description?.message && (
                    <FieldError>
                      {form.formState.errors.description.message}
                    </FieldError>
                  )}
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="visibility">
                      Visibility <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name="visibility"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={metaLoading}
                        >
                          <SelectTrigger id="visibility" className="w-full">
                            <SelectValue placeholder="Select visibility" />
                          </SelectTrigger>

                          <SelectContent>
                            {visibilityTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {form.formState.errors.visibility?.message && (
                      <FieldError>
                        {form.formState.errors.visibility.message}
                      </FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="quantityType">
                      Quantity type <span className="text-red-500">*</span>
                    </FieldLabel>

                    <Controller
                      control={form.control}
                      name="quantityType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={metaLoading}
                        >
                          <SelectTrigger id="quantityType" className="w-full">
                            <SelectValue placeholder="Select quantity type" />
                          </SelectTrigger>

                          <SelectContent>
                            {quantityTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {form.formState.errors.quantityType?.message && (
                      <FieldError>
                        {form.formState.errors.quantityType.message}
                      </FieldError>
                    )}
                  </Field>
                </div>

                <Field>
                  <div className="flex flex-row items-start gap-3 rounded-xl border p-4">
                    <Controller
                      control={form.control}
                      name="isDefault"
                      render={({ field }) => (
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) =>
                            field.onChange(Boolean(checked))
                          }
                        />
                      )}
                    />

                    <div className="space-y-1">
                      <FieldLabel>Make this your default watchlist?</FieldLabel>
                      <FieldDescription>
                        Your default watchlist can be used as the primary one
                        across the app.
                      </FieldDescription>
                    </div>
                  </div>

                  {form.formState.errors.isDefault?.message && (
                    <FieldError>
                      {form.formState.errors.isDefault.message}
                    </FieldError>
                  )}
                </Field>
              </FieldGroup>
            </div>
          ) : (
            <div className="px-6 py-5">
              <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search curated items"
                      className="pl-9"
                    />
                  </div>

                  <Field className="w-40">
                    {/* <FieldLabel htmlFor="assetType">Asset type</FieldLabel> */}

                    <Controller
                      control={form.control}
                      name="assetType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(value: "equity" | "fund") => {
                            void handleCategoryChange(value);
                          }}
                        >
                          <SelectTrigger id="assetType" className="w-full">
                            <SelectValue placeholder="Asset type" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="equity">Stocks</SelectItem>
                            <SelectItem value="fund">Funds</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                    {form.formState.errors.assetType?.message && (
                      <FieldError>
                        {form.formState.errors.assetType.message}
                      </FieldError>
                    )}
                  </Field>
                </div>

                <div className="text-sm text-muted-foreground">
                  {selectedSeedItems.length} selected
                </div>
              </div>

              {/* <div className="mb-2 text-sm text-muted-foreground">
                Allocation type:{" "}
                <span className="font-medium">{quantityType}</span>
              </div> */}

              <div className="mb-4 flex flex-wrap gap-2">
                {selectedSeedItems.map((item) => (
                  <Badge key={item.symbol} variant="secondary">
                    {item.symbol}
                  </Badge>
                ))}
              </div>

              <ScrollArea className="h-90 pr-4">
                <div className="grid gap-3">
                  {curatedLoading || searchLoading ? (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading curated{" "}
                      {assetType === "equity" ? "stocks" : "funds"}...
                    </div>
                  ) : displayItems.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                      No curated items found.
                    </div>
                  ) : (
                    displayItems.map((item) => {
                      const selected = selectedSeedItems.some(
                        (x) => x.symbol === item.symbol,
                      );

                      return (
                        <WatchlistItemRow
                          key={item.symbol}
                          item={item}
                          selected={selected}
                          onToggle={handleToggleSeedItem}
                        />
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            {step === 1 ? (
              <div className="flex w-full justify-end gap-2">
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Back
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create watchlist"
                  )}
                </Button>
              </div>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
