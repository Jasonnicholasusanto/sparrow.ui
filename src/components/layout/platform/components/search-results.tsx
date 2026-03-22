"use client";

import { Loader2, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { QuoteResult } from "@/schemas/search";
import { environment } from "@/lib/utils/env";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SearchResultsProps {
  results: QuoteResult[];
  isLoading: boolean;
  onSelect: (item: QuoteResult) => void | Promise<void>;
}

function SearchResultItem({
  item,
  onSelect,
}: {
  item: QuoteResult;
  onSelect?: (result: QuoteResult) => void;
}) {
  const logoUrl = `${environment.logoKitTickerApiUrl}/${item.symbol}?token=${environment.logoKitTickerApiToken}`;

  return (
    <div
      key={item.symbol}
      className="px-3 py-3 hover:bg-accent cursor-pointer text-sm flex items-center gap-3 transition-colors rounded-lg"
      onMouseDown={(e) => e.preventDefault()}
      onClick={() => onSelect?.(item)}
    >
      <Avatar className="w-8 h-8">
        <AvatarImage
          src={logoUrl}
          alt={`${item.shortname || item.symbol} logo`}
          className="object-cover"
        />
        <AvatarFallback className="text-xs font-medium">
          {item.symbol?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col min-w-0 w-full">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-foreground leading-none">
            {item.symbol}
          </p>
          <div className="flex flex-col items-end gap-1">
            {item.exchange ? (
              <Badge variant="outline" className="rounded-full">
                {item.exchange}
              </Badge>
            ) : null}
          </div>
        </div>
        <p className="text-xs text-muted-foreground truncate min-w-0">
          {item.longname || item.shortname}
        </p>
      </div>
    </div>
  );
}

export function SearchResults({
  results,
  isLoading,
  onSelect,
}: SearchResultsProps) {
  return (
    <>
      <div className="px-3 py-2 text-xs font-medium text-muted-foreground">
        Stock results
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 px-3 py-4 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Searching...
        </div>
      ) : (
        <div className="space-y-1">
          {results.map((item) => (
            <SearchResultItem
              key={item.symbol}
              item={item}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </>
  );
}
