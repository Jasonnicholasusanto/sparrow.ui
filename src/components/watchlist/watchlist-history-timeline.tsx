"use client";

import { useEffect, useMemo, useState } from "react";
import {
  GitCommit,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  RotateCcw,
  Clock,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { WatchlistAuditEventOut } from "@/schemas/watchlistHistory";
import { getWatchlistHistory } from "@/lib/data/client/watchlistHistory";
import { formatWatchlistDateTime } from "@/lib/utils/formatDates";

type WatchlistHistoryTimelineProps = {
  watchlistId: number;
  enabled?: boolean;
};

function getActionLabel(action: string) {
  const normalized = action.toLowerCase();

  if (normalized.includes("create")) return "Created watchlist";
  if (normalized.includes("add")) return "Added item";
  if (normalized.includes("remove") || normalized.includes("delete"))
    return "Removed item";
  if (normalized.includes("update") || normalized.includes("edit"))
    return "Updated watchlist";
  if (normalized.includes("fork")) return "Forked watchlist";

  return action
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getActionIcon(action: string) {
  const normalized = action.toLowerCase();

  if (normalized.includes("create")) return <Plus className="h-4 w-4" />;
  if (normalized.includes("add")) return <Plus className="h-4 w-4" />;
  if (normalized.includes("remove") || normalized.includes("delete"))
    return <Trash2 className="h-4 w-4" />;
  if (normalized.includes("update") || normalized.includes("edit"))
    return <Pencil className="h-4 w-4" />;
  if (normalized.includes("fork")) return <RotateCcw className="h-4 w-4" />;

  return <GitCommit className="h-4 w-4" />;
}

function getSymbolFromEvent(event: WatchlistAuditEventOut) {
  const afterSymbol = event.afterData?.symbol;
  const beforeSymbol = event.beforeData?.symbol;
  const metaSymbol = event.metaData?.symbol;

  if (typeof afterSymbol === "string") return afterSymbol;
  if (typeof beforeSymbol === "string") return beforeSymbol;
  if (typeof metaSymbol === "string") return metaSymbol;

  return null;
}

function getChangedFields(event: WatchlistAuditEventOut) {
  if (!event.beforeData || !event.afterData) return [];

  const keys = new Set([
    ...Object.keys(event.beforeData),
    ...Object.keys(event.afterData),
  ]);

  return Array.from(keys).filter((key) => {
    return event.beforeData?.[key] !== event.afterData?.[key];
  });
}

export function WatchlistHistoryTimeline({
  watchlistId,
  enabled = true,
}: WatchlistHistoryTimelineProps) {
  const [events, setEvents] = useState<WatchlistAuditEventOut[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (!enabled || hasLoaded) return;

    async function loadHistory() {
      try {
        setLoading(true);
        const result = await getWatchlistHistory(watchlistId);
        setEvents(result);
        setHasLoaded(true);
      } finally {
        setLoading(false);
      }
    }

    void loadHistory();
  }, [enabled, hasLoaded, watchlistId]);

  const sortedEvents = useMemo(() => {
    return [...events].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [events]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Loading watchlist history...
      </div>
    );
  }

  if (!sortedEvents.length) {
    return (
      <div className="rounded-xl border border-dashed px-6 py-10 text-center text-sm text-muted-foreground">
        No history has been recorded for this watchlist yet.
      </div>
    );
  }

  return (
    <ScrollArea className="max-h-112 pr-3">
      <div className="relative space-y-0 pl-6">
        <div className="absolute left-2 top-2 h-full w-px bg-border" />

        {sortedEvents.map((event) => {
          const symbol = getSymbolFromEvent(event);
          const changedFields = getChangedFields(event);

          return (
            <div key={event.id} className="relative pb-6">
              <div className="absolute -left-6 top-1 flex h-4 w-4 items-center justify-center rounded-full border bg-background">
                <div className="h-2 w-2 rounded-full bg-foreground" />
              </div>

              <div className="rounded-2xl border bg-card p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {getActionIcon(event.action)}
                      <p className="font-medium">
                        {getActionLabel(event.action)}
                      </p>

                      {symbol ? (
                        <Badge variant="secondary" className="rounded-full">
                          {symbol}
                        </Badge>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatWatchlistDateTime(event.createdAt)}
                    </div>
                  </div>

                  <Badge variant="outline" className="rounded-full">
                    {event.action}
                  </Badge>
                </div>

                {changedFields.length ? (
                  <div className="mt-4 space-y-2">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Changed fields
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {changedFields.map((field) => (
                        <Badge key={field} variant="outline">
                          {field}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* {event.itemId ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Item ID: {event.itemId}
                  </p>
                ) : null} */}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
