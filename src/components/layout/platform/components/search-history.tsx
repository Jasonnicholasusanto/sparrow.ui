"use client";

import { Clock, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SearchHistoryEntry } from "@/schemas/search";

interface SearchHistoryProps {
  history: SearchHistoryEntry[];
  isLoading: boolean;
  onSelect: (item: SearchHistoryEntry) => void | Promise<void>;
}

export function SearchHistory({
  history,
  isLoading,
  onSelect,
}: SearchHistoryProps) {
  return (
    <>
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
        Recent searches
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading history...
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left hover:bg-accent"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {item.query}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.type}
                  </div>
                </div>
              </div>

              <Badge variant="secondary" className="rounded-full">
                Recent
              </Badge>
            </button>
          ))}
        </div>
      )}
    </>
  );
}
