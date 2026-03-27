"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TraderProfileTabsProps = {
  isOwnProfile: boolean;
};

export function TraderProfileTabs({ isOwnProfile }: TraderProfileTabsProps) {
  const [watchlistVisibility, setWatchlistVisibility] = useState<
    "public" | "shared" | "private"
  >("public");

  const visibilityOptions = useMemo(() => {
    if (isOwnProfile) {
      return [
        { label: "Public", value: "public" },
        { label: "Shared", value: "shared" },
        { label: "Private", value: "private" },
      ] as const;
    }

    return [{ label: "Public", value: "public" }] as const;
  }, [isOwnProfile]);

  const tabs = [
    { label: "Watchlists", active: true, disabled: false },
    { label: "Posts", active: false, disabled: true },
    { label: "Activity", active: false, disabled: true },
  ] as const;

  return (
    <section className="rounded-2xl border bg-card shadow-sm p-5 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              disabled={tab.disabled}
              className={cn(
                "rounded-xl px-4 py-2 text-sm transition-colors",
                tab.active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
                tab.disabled && "cursor-not-allowed opacity-60",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full md:w-55">
          <Select
            value={watchlistVisibility}
            onValueChange={(value) =>
              setWatchlistVisibility(value as "public" | "shared" | "private")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter watchlists" />
            </SelectTrigger>

            <SelectContent>
              {visibilityOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="px-1 pt-3 text-xs text-muted-foreground">
        {isOwnProfile
          ? "Filter your watchlists by Public, Shared, or Private. Posts and Activity are coming later."
          : "You can currently view public watchlists here. Posts and Activity are coming later."}
      </p>
    </section>
  );
}
