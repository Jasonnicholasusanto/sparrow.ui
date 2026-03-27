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

import { WatchlistItemRow, type WatchlistSeedItem } from "./watchlist-item-row";

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
      name: z.string(),
      exchange: z.string().nullable().optional(),
      quoteType: z.string().nullable().optional(),
      price: z.number().nullable().optional(),
      changePercent: z.number().nullable().optional(),
      currency: z.string().nullable().optional(),
      logoUrl: z.string().nullable().optional(),
    }),
  ),
});

type CreateWatchlistFormValues = z.infer<typeof createWatchlistSchema>;

type CreateWatchlistDialogProps = {
  isIconOnly?: boolean;
};

type MetaResponse = {
  visibilityTypes: string[];
  quantityTypes: string[];
};

type CuratedResponse = {
  items: WatchlistSeedItem[];
};

export function CreateWatchlistDialog({
  isIconOnly = false,
}: CreateWatchlistDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [metaLoading, setMetaLoading] = useState(false);
  const [visibilityTypes, setVisibilityTypes] = useState<string[]>([]);
  const [quantityTypes, setQuantityTypes] = useState<string[]>([]);
  const [curatedLoading, setCuratedLoading] = useState(false);
  const [curatedItems, setCuratedItems] = useState<WatchlistSeedItem[]>([]);
  const [search, setSearch] = useState("");
  const [isSubmitting, startSubmitting] = useTransition();

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

  useEffect(() => {
    if (!open) return;

    const loadMeta = async () => {
      try {
        setMetaLoading(true);

        const res = await fetch("/api/watchlists/meta", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load watchlist options.");
        }

        const data: MetaResponse = await res.json();

        setVisibilityTypes(data.visibilityTypes ?? []);
        setQuantityTypes(data.quantityTypes ?? []);

        const currentVisibility = form.getValues("visibility");
        const currentQuantityType = form.getValues("quantityType");

        if (!currentVisibility && data.visibilityTypes?.length) {
          form.setValue("visibility", data.visibilityTypes[0], {
            shouldValidate: true,
          });
        }

        if (!currentQuantityType && data.quantityTypes?.length) {
          form.setValue("quantityType", data.quantityTypes[0], {
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

    const loadCurated = async () => {
      try {
        setCuratedLoading(true);

        const res = await fetch(
          `/api/yfinance/screener/curated?assetType=${assetType}&limit=25`,
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!res.ok) {
          throw new Error("Failed to load curated screen.");
        }

        const data: CuratedResponse = await res.json();
        setCuratedItems(data.items ?? []);
      } catch (error) {
        console.error(error);
        setCuratedItems([]);
      } finally {
        setCuratedLoading(false);
      }
    };

    loadCurated();
  }, [open, step, assetType]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return curatedItems;

    return curatedItems.filter((item) => {
      return (
        item.symbol.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.exchange?.toLowerCase().includes(q)
      );
    });
  }, [curatedItems, search]);

  function handleToggleSeedItem(item: WatchlistSeedItem) {
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

    form.setValue("seedItems", [...current, item], {
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
    setStep(2);
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
        const res = await fetch("/api/watchlists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!res.ok) {
          throw new Error("Failed to create watchlist.");
        }

        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    });
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

      <DialogContent className="min-w-3xl max-w-5xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex items-center justify-between gap-4">
            <div>
              <DialogTitle>Create watchlist</DialogTitle>
              <DialogDescription>
                Build your watchlist first, then optionally seed it with curated
                stocks or funds.
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={step === 1 ? "default" : "secondary"}>
                Step 1 · Details
              </Badge>
              <Badge variant={step === 2 ? "default" : "secondary"}>
                Step 2 · Seed items
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === 1 ? (
            <div className="grid gap-5 px-6 py-5">
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

                  <Field className="w-[160px]">
                    <FieldLabel htmlFor="assetType">Asset type</FieldLabel>

                    <Controller
                      control={form.control}
                      name="assetType"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
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

              <div className="mb-4 flex flex-wrap gap-2">
                {selectedSeedItems.map((item) => (
                  <Badge key={item.symbol} variant="secondary">
                    {item.symbol}
                  </Badge>
                ))}
              </div>

              <ScrollArea className="h-[360px] pr-4">
                <div className="grid gap-3">
                  {curatedLoading ? (
                    <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading curated{" "}
                      {assetType === "equity" ? "stocks" : "funds"}...
                    </div>
                  ) : filteredItems.length === 0 ? (
                    <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-sm text-muted-foreground">
                      No curated items found.
                    </div>
                  ) : (
                    filteredItems.map((item) => {
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

          <Separator />

          <DialogFooter className="px-6 py-4 sm:justify-between">
            {step === 1 ? (
              <>
                <div />
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
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
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
