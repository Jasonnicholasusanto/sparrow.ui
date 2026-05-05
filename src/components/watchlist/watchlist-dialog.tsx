"use client";

import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { z } from "zod";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  GripVertical,
  Binoculars,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DragDropProvider } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import { toast } from "sonner";

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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  quoteResultToWatchlistRowItem,
  screenerTickerInfoToWatchlistRowItem,
  WatchlistItemRow,
} from "./watchlist-item-row";
import { TagInput } from "./tag-input";

import {
  createWatchlistClient,
  getWatchlistQuantityTypesClient,
  getWatchlistTypesClient,
  updateWatchlistClient,
} from "@/lib/data/client/watchlist";
import { fetchCuratedScreensClient } from "@/lib/data/client/screener";
import { WatchlistDetailOut, WatchlistRowItem } from "@/schemas/watchlist";
import { ScreenerTickerInfo } from "@/schemas/screener";
import { QuoteResult, SearchQuotesResponse } from "@/schemas/search";
import { searchQuotesClient } from "@/lib/data/client/search";

const QUANTITY_TYPE_UNIT = "unit";
const QUANTITY_TYPE_PERCENTAGE = "percentage";
const ADDED_ITEMS_GROUP = "watchlist-added-items";

const seedItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  symbol: z.string(),
  displayName: z.string().nullable().optional(),
  longName: z.string().nullable().optional(),
  exchange: z.string().nullable().optional(),
  currency: z.string().nullable().optional(),
  regularMarketPrice: z.number().nullable().optional(),
  regularMarketPreviousClose: z.number().nullable().optional(),
  regularMarketChange: z.number().nullable().optional(),
  regularMarketChangePercent: z.number().nullable().optional(),
  quantity: z.number().nullable().optional(),
  note: z.string().max(300).optional(),
});

const watchlistDialogSchema = z
  .object({
    name: z.string().min(1, "Watchlist name is required"),
    description: z.string().max(2000).optional(),
    tags: z.array(z.string().min(1).max(50)),
    visibility: z.string().min(1, "Please select a visibility"),
    quantityType: z.string().min(1, "Please select a quantity type"),
    isDefault: z.boolean(),
    assetType: z.enum(["equity", "fund"]),
    seedItems: z.array(seedItemSchema),
  })
  .superRefine((data, ctx) => {
    if (data.quantityType === QUANTITY_TYPE_PERCENTAGE) {
      const total = data.seedItems.reduce(
        (sum, item) => sum + (item.quantity ?? 0),
        0,
      );

      if (total > 100) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Total allocation is ${total.toFixed(
            1,
          )}% — cannot exceed 100%`,
          path: ["seedItems"],
        });
      }
    }
  });

type SeedItemFormValue = z.infer<typeof seedItemSchema>;
type WatchlistDialogFormValues = z.infer<typeof watchlistDialogSchema>;

type InitialSeedItem = {
  symbol: string;
  displayName?: string | null;
  longName?: string | null;
  exchange?: string | null;
  currency?: string | null;
  regularMarketPrice?: number | null;
  regularMarketPreviousClose?: number | null;
  regularMarketChange?: number | null;
  regularMarketChangePercent?: number | null;
};

type WatchlistDialogProps = {
  mode?: "create" | "edit";
  watchlist?: WatchlistDetailOut;
  trigger?: ReactNode;
  isIconOnly?: boolean;
  initialSeedItems?: InitialSeedItem[];
  startAtStep?: 1 | 2;
  onSuccess?: () => void | Promise<void>;
};

type SortableAddedWatchlistItemProps = {
  item: WatchlistRowItem;
  index: number;
  quantityType: string;
  allocationValue: string;
  noteValue: string;
  onToggle: (item: WatchlistRowItem) => void;
  onAllocationChange: (symbol: string, rawValue: string) => void;
  onNoteChange: (symbol: string, value: string) => void;
};

function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function dedupeInitialSeedItems(items: InitialSeedItem[]): InitialSeedItem[] {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.symbol.trim().toUpperCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getWatchlistValue<T>(value: T | undefined | null, fallback: T): T {
  return value === undefined || value === null ? fallback : value;
}

function getTickerDetails(item: any) {
  return item?.tickerDetails ?? item?.ticker_details ?? null;
}

function getWatchlistVisibility(watchlist?: any) {
  return watchlist?.visibility ?? "";
}

function getWatchlistAllocationType(watchlist?: any) {
  return watchlist?.allocationType ?? watchlist?.allocation_type ?? "";
}

function getWatchlistIsDefault(watchlist?: any) {
  return Boolean(watchlist?.isDefault ?? watchlist?.is_default ?? false);
}

function toSeedItem(stock: InitialSeedItem): SeedItemFormValue {
  return {
    symbol: stock.symbol,
    displayName: stock.displayName ?? null,
    longName: stock.longName ?? null,
    exchange: stock.exchange ?? null,
    currency: stock.currency ?? null,
    regularMarketPrice: stock.regularMarketPrice ?? null,
    regularMarketPreviousClose: stock.regularMarketPreviousClose ?? null,
    regularMarketChange: stock.regularMarketChange ?? null,
    regularMarketChangePercent: stock.regularMarketChangePercent ?? null,
    quantity: null,
    note: "",
  };
}

function watchlistItemToSeedItem(item: any): SeedItemFormValue {
  const tickerDetails = getTickerDetails(item);

  return {
    id: item.id,
    symbol: item.symbol,
    displayName:
      tickerDetails?.shortName ??
      tickerDetails?.short_name ??
      tickerDetails?.longName ??
      tickerDetails?.long_name ??
      item.displayName ??
      item.display_name ??
      item.longName ??
      item.long_name ??
      item.symbol,
    longName:
      tickerDetails?.longName ??
      tickerDetails?.long_name ??
      item.longName ??
      item.long_name ??
      null,
    exchange: item.exchange ?? tickerDetails?.exchange ?? null,
    currency: item.currency ?? tickerDetails?.currency ?? null,
    regularMarketPrice:
      tickerDetails?.lastPrice ??
      tickerDetails?.last_price ??
      tickerDetails?.regularMarketPrice ??
      tickerDetails?.regular_market_price ??
      null,
    regularMarketPreviousClose:
      tickerDetails?.previousClose ??
      tickerDetails?.previous_close ??
      tickerDetails?.regularMarketPreviousClose ??
      tickerDetails?.regular_market_previous_close ??
      null,
    regularMarketChange:
      tickerDetails?.regularMarketChange ??
      tickerDetails?.regular_market_change ??
      null,
    regularMarketChangePercent:
      tickerDetails?.regularMarketChangePercent ??
      tickerDetails?.regular_market_change_percent ??
      null,
    quantity: item.quantity ?? null,
    note: item.note ?? "",
  };
}

function SortableAddedWatchlistItem({
  item,
  index,
  quantityType,
  allocationValue,
  noteValue,
  onToggle,
  onAllocationChange,
  onNoteChange,
}: SortableAddedWatchlistItemProps) {
  const { ref, handleRef, isDragging } = useSortable({
    id: item.symbol,
    index,
    group: ADDED_ITEMS_GROUP,
  });

  return (
    <div
      ref={ref}
      className={`flex items-start gap-2 ${
        isDragging ? "opacity-60" : "opacity-100"
      }`}
    >
      <button
        type="button"
        ref={handleRef}
        aria-label={`Drag to reorder ${item.symbol}`}
        title="Drag to reorder"
        className="flex h-full w-7 shrink-0 cursor-grab items-center justify-center rounded-xl border bg-background text-muted-foreground transition hover:bg-muted active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="min-w-0 flex-1">
        <WatchlistItemRow
          item={item}
          selected
          quantityType={quantityType}
          allocationValue={allocationValue}
          noteValue={noteValue}
          onToggle={onToggle}
          onAllocationChange={onAllocationChange}
          onNoteChange={onNoteChange}
        />
      </div>
    </div>
  );
}

export function WatchlistDialog({
  mode = "create",
  watchlist,
  trigger,
  isIconOnly = false,
  initialSeedItems = [],
  startAtStep = 1,
  onSuccess,
}: WatchlistDialogProps) {
  const isEditMode = mode === "edit";

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
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const debouncedSearch = useDebouncedValue(search, 500);

  const dialogTitle = isEditMode ? "Edit watchlist" : "Create watchlist";
  const dialogDescription = isEditMode
    ? "Update your watchlist details, tags, items, quantities, notes, and order."
    : "Build your watchlist first, then optionally seed it with curated stocks or funds.";
  const submitLabel = isEditMode ? "Save changes" : "Create watchlist";
  const submittingLabel = isEditMode ? "Saving..." : "Creating...";

  const form = useForm<WatchlistDialogFormValues>({
    resolver: zodResolver(watchlistDialogSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
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

  function getFormDefaults(): WatchlistDialogFormValues {
    if (isEditMode && watchlist) {
      const editSeedItems = watchlist.items?.map(watchlistItemToSeedItem) ?? [];

      return {
        name: watchlist.name ?? "",
        description: watchlist.description ?? "",
        tags: watchlist.tags?.map((tag: any) => tag.name) ?? [],
        visibility: getWatchlistVisibility(watchlist),
        quantityType: getWatchlistAllocationType(watchlist),
        isDefault: getWatchlistIsDefault(watchlist),
        assetType: "equity",
        seedItems: editSeedItems,
      };
    }

    const dedupedSeedInputs = dedupeInitialSeedItems(initialSeedItems);
    const seededItems = dedupedSeedInputs.map(toSeedItem);

    return {
      name: "",
      description: "",
      visibility: "",
      quantityType: "",
      isDefault: false,
      assetType: "equity",
      seedItems: seededItems,
      tags: [],
    };
  }

  function resetDialogState() {
    const defaults = getFormDefaults();

    const seededInputValues = Object.fromEntries(
      defaults.seedItems.map((item) => [
        item.symbol,
        item.quantity === null || item.quantity === undefined
          ? ""
          : String(item.quantity),
      ]),
    );

    setStep(isEditMode ? 1 : startAtStep);
    setSearch("");
    setSearchResults([]);
    setSearchLoading(false);
    setCuratedItems([]);
    setInputValues(seededInputValues);

    form.reset(defaults);
  }

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

        if (!form.getValues("visibility") && nextVisibilityTypes.length > 0) {
          form.setValue("visibility", nextVisibilityTypes[0], {
            shouldValidate: true,
          });
        }

        if (!form.getValues("quantityType") && nextQuantityTypes.length > 0) {
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

    void loadMeta();
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
        if (!cancelled) setSearchLoading(false);
      }
    };

    void runSearch();

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, open, step]);

  useEffect(() => {
    if (!open) return;
    resetDialogState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, startAtStep, mode, watchlist?.id]);

  const normalizedCuratedItems = useMemo(
    () => curatedItems.map(screenerTickerInfoToWatchlistRowItem),
    [curatedItems],
  );

  const normalizedSearchResults = useMemo(
    () => searchResults.map(quoteResultToWatchlistRowItem),
    [searchResults],
  );

  const displayItems = useMemo(
    () =>
      debouncedSearch.trim() ? normalizedSearchResults : normalizedCuratedItems,
    [debouncedSearch, normalizedSearchResults, normalizedCuratedItems],
  );

  function handleToggleSeedItem(item: WatchlistRowItem) {
    const current = form.getValues("seedItems");
    const exists = current.some(
      (x) => x.symbol.toUpperCase() === item.symbol.toUpperCase(),
    );

    if (exists) {
      setInputValues((prev) => {
        const next = { ...prev };
        delete next[item.symbol];
        return next;
      });

      form.setValue(
        "seedItems",
        current.filter(
          (x) => x.symbol.toUpperCase() !== item.symbol.toUpperCase(),
        ),
        { shouldDirty: true, shouldValidate: true },
      );

      return;
    }

    const initialValue = quantityType === QUANTITY_TYPE_PERCENTAGE ? "0" : "1";

    setInputValues((prev) => ({ ...prev, [item.symbol]: initialValue }));

    const nextItem: SeedItemFormValue = {
      symbol: item.symbol,
      displayName: item.displayName ?? null,
      exchange: item.exchange ?? null,
      currency: item.currency ?? null,
      regularMarketPrice: item.marketPrice ?? null,
      regularMarketPreviousClose: null,
      regularMarketChange: item.marketChange ?? null,
      regularMarketChangePercent: item.marketChangePercent ?? null,
      quantity: quantityType === QUANTITY_TYPE_PERCENTAGE ? 0 : 1,
      note: "",
    };

    form.setValue("seedItems", [...current, nextItem], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleAllocationChange(symbol: string, rawValue: string) {
    setInputValues((prev) => ({ ...prev, [symbol]: rawValue }));

    const parsed = parseFloat(rawValue);
    const numericValue = Number.isNaN(parsed) ? null : parsed;

    const nextItems = form.getValues("seedItems").map((item) => {
      if (item.symbol !== symbol) return item;

      return {
        ...item,
        quantity: numericValue,
      };
    });

    form.setValue("seedItems", nextItems, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleNoteChange(symbol: string, value: string) {
    const nextItems = form.getValues("seedItems").map((item) => {
      if (item.symbol !== symbol) return item;

      return {
        ...item,
        note: value,
      };
    });

    form.setValue("seedItems", nextItems, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;

    const currentItems = form.getValues("seedItems");
    const nextItems = [...currentItems];
    const [movedItem] = nextItems.splice(fromIndex, 1);

    if (!movedItem) return;

    nextItems.splice(toIndex, 0, movedItem);

    form.setValue("seedItems", nextItems, {
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
      "tags",
    ]);

    if (!valid) return;

    setStep(2);

    if (curatedItems.length === 0) {
      await handleCategoryChange(form.getValues("assetType"));
    }
  }

  function handleBack() {
    setStep(1);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);

    if (!nextOpen) {
      setTimeout(() => {
        resetDialogState();
      }, 150);
    }
  }

  async function onSubmit(values: WatchlistDialogFormValues) {
    startSubmitting(async () => {
      const toastId = toast.loading(
        isEditMode ? "Updating watchlist..." : "Creating watchlist...",
      );

      try {
        const payload = {
          watchlist_data: {
            name: values.name.trim(),
            description: values.description?.trim() || null,
            visibility: values.visibility,
            allocation_type: values.quantityType,
            is_default: values.isDefault,
          },
          tags: values.tags,
          items: values.seedItems.map((item, index) => ({
            ...(item.id ? { id: item.id } : {}),
            symbol: item.symbol,
            exchange: item.exchange ?? "",
            note: item.note?.trim() || null,
            position: index,
            quantity: item.quantity ?? null,
            reference_price:
              item.regularMarketPrice ??
              item.regularMarketPreviousClose ??
              null,
          })),
        };

        if (isEditMode) {
          if (!watchlist?.id) {
            throw new Error("Missing watchlist id for update.");
          }

          await updateWatchlistClient(watchlist.id, payload);
        } else {
          await createWatchlistClient(payload);
        }

        toast.success(
          isEditMode
            ? "Watchlist updated successfully."
            : "Watchlist created successfully.",
          { id: toastId },
        );

        await onSuccess?.();

        resetDialogState();
        setOpen(false);
      } catch (error) {
        console.error(error);
        toast.error(
          isEditMode
            ? "Failed to update watchlist."
            : "Failed to create watchlist.",
          { id: toastId },
        );
      }
    });
  }

  async function handleCategoryChange(category: "equity" | "fund") {
    try {
      setCuratedLoading(true);
      setSearch("");
      setSearchResults([]);

      form.setValue("assetType", category, {
        shouldDirty: true,
        shouldValidate: true,
      });

      const data = await fetchCuratedScreensClient(category, 25);
      setCuratedItems(Array.isArray(data?.results) ? data.results : []);
    } catch (error) {
      console.error(error);
      setCuratedItems([]);
    } finally {
      setCuratedLoading(false);
    }
  }

  const addedItems = useMemo(() => {
    return selectedSeedItems.map((selectedItem) => ({
      symbol: selectedItem.symbol,
      displayName:
        selectedItem.displayName ||
        selectedItem.longName ||
        selectedItem.symbol,
      longName: selectedItem.longName ?? null,
      exchange: selectedItem.exchange ?? null,
      currency: selectedItem.currency ?? null,
      marketPrice: selectedItem.regularMarketPrice ?? null,
      marketChange: selectedItem.regularMarketChange ?? null,
      marketChangePercent: selectedItem.regularMarketChangePercent ?? null,
    }));
  }, [selectedSeedItems]);

  const suggestedItems = useMemo(() => {
    const selectedSymbols = new Set(
      selectedSeedItems.map((item) => item.symbol.toUpperCase()),
    );

    return displayItems.filter(
      (item) => !selectedSymbols.has(item.symbol.toUpperCase()),
    );
  }, [displayItems, selectedSeedItems]);

  const totalQuantity = useMemo(() => {
    if (quantityType !== QUANTITY_TYPE_PERCENTAGE) return null;

    return selectedSeedItems.reduce(
      (sum, item) => sum + (item.quantity ?? 0),
      0,
    );
  }, [quantityType, selectedSeedItems]);

  const quantityError = form.formState.errors.seedItems?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            {trigger ? (
              trigger
            ) : isIconOnly ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label={isEditMode ? "Edit watchlist" : "Create watchlist"}
              >
                <Binoculars className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="outline"
                className="rounded-xl px-4"
                aria-label={isEditMode ? "Edit watchlist" : "Create watchlist"}
              >
                <Binoculars className="h-5 w-5" />
                <span className="ml-2">
                  {isEditMode ? "Edit watchlist" : "Create watchlist"}
                </span>
              </Button>
            )}
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          {isEditMode ? "Edit this watchlist" : "Create a new watchlist"}
        </TooltipContent>
      </Tooltip>

      <DialogContent className="min-w-3xl max-w-5xl overflow-hidden">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <Separator />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 ? (
            <div className="grid gap-5 pb-5">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="watchlist-name">
                    Name <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    id="watchlist-name"
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
                  <FieldLabel htmlFor="watchlist-description">
                    Description
                  </FieldLabel>
                  <Textarea
                    id="watchlist-description"
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

                <Field>
                  <FieldLabel>Tags</FieldLabel>
                  <TagInput
                    value={form.watch("tags") || []}
                    onChange={(tags) =>
                      form.setValue("tags", tags, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  />

                  {form.formState.errors.tags?.message && (
                    <FieldError>
                      {form.formState.errors.tags.message as string}
                    </FieldError>
                  )}
                </Field>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="watchlist-visibility">
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
                          <SelectTrigger
                            id="watchlist-visibility"
                            className="w-full"
                          >
                            {metaLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <SelectValue placeholder="Select visibility" />
                            )}
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
                    <FieldLabel htmlFor="watchlist-quantity-type">
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
                          <SelectTrigger
                            id="watchlist-quantity-type"
                            className="w-full"
                          >
                            {metaLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <SelectValue placeholder="Select quantity type" />
                            )}
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
            <div className="py-5">
              <div className="mb-4 flex flex-col gap-3 pr-3 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-1 items-center gap-3">
                  <div className="relative w-full max-w-sm">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search stocks or funds"
                      className="pl-9"
                    />
                  </div>

                  <Field className="w-40">
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
                          <SelectTrigger
                            id="watchlist-asset-type"
                            className="w-full"
                          >
                            <SelectValue placeholder="Asset type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equity">Stocks</SelectItem>
                            <SelectItem value="fund">Funds</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </Field>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{selectedSeedItems.length} selected</span>
                  {totalQuantity !== null && (
                    <span
                      className={
                        totalQuantity > 100
                          ? "font-medium text-red-500"
                          : "text-emerald-600"
                      }
                    >
                      {totalQuantity.toFixed(1)}% / 100%
                    </span>
                  )}
                </div>
              </div>

              {quantityError && (
                <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                  {quantityError}
                </div>
              )}

              <div className="mb-4 flex flex-wrap gap-2">
                {selectedSeedItems.map((item) => {
                  const allocation =
                    quantityType === QUANTITY_TYPE_PERCENTAGE
                      ? `${item.quantity ?? 0}%`
                      : `${item.quantity ?? 0} units`;

                  return (
                    <Badge key={item.symbol} variant="secondary">
                      {item.symbol} · {allocation}
                    </Badge>
                  );
                })}
              </div>

              <ScrollArea className="h-90 pr-3">
                <div className="space-y-6">
                  {curatedLoading || searchLoading ? (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading {assetType === "equity" ? "stocks" : "funds"}...
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-semibold">
                              Added{" "}
                              {assetType === "equity" ? "stocks" : "funds"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Please enter the{" "}
                              {quantityType === QUANTITY_TYPE_PERCENTAGE
                                ? "percentage allocation"
                                : "quantity"}{" "}
                              for each item in your watchlist. You can also add
                              an optional note and drag to reorder.
                            </p>
                          </div>
                          <Badge variant="outline">{addedItems.length}</Badge>
                        </div>

                        {addedItems.length === 0 ? (
                          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                            No {assetType === "equity" ? "stocks" : "funds"}{" "}
                            added yet.
                          </div>
                        ) : (
                          <DragDropProvider
                            onDragEnd={(event) => {
                              if (event.canceled) return;

                              const { source } = event.operation;

                              if (!isSortable(source)) return;
                              if (source.group !== ADDED_ITEMS_GROUP) return;

                              handleReorder(source.initialIndex, source.index);
                            }}
                          >
                            <div className="grid gap-3">
                              {addedItems.map((item, index) => {
                                const seedItem = selectedSeedItems[index];

                                return (
                                  <SortableAddedWatchlistItem
                                    key={item.symbol}
                                    item={item}
                                    index={index}
                                    quantityType={quantityType}
                                    allocationValue={
                                      inputValues[item.symbol] ?? ""
                                    }
                                    noteValue={seedItem?.note ?? ""}
                                    onToggle={handleToggleSeedItem}
                                    onAllocationChange={handleAllocationChange}
                                    onNoteChange={handleNoteChange}
                                  />
                                );
                              })}
                            </div>
                          </DragDropProvider>
                        )}
                      </div>

                      <Separator />

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-semibold">
                              Suggested{" "}
                              {assetType === "equity" ? "stocks" : "funds"}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              Browse and add more ideas to your watchlist.
                            </p>
                          </div>
                          <Badge variant="outline">
                            {suggestedItems.length}
                          </Badge>
                        </div>

                        {suggestedItems.length === 0 ? (
                          <div className="flex h-24 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                            No suggested items found.
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {suggestedItems.map((item) => (
                              <WatchlistItemRow
                                key={item.symbol}
                                item={item}
                                selected={false}
                                quantityType={quantityType}
                                allocationValue={undefined}
                                noteValue=""
                                onToggle={handleToggleSeedItem}
                                onAllocationChange={handleAllocationChange}
                                onNoteChange={handleNoteChange}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            {step === 1 ? (
              <div className="flex w-full justify-end gap-2">
                <Button type="button" onClick={handleNext}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ChevronLeft className="mr-1 h-4 w-4" /> Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {submittingLabel}
                    </>
                  ) : (
                    submitLabel
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
