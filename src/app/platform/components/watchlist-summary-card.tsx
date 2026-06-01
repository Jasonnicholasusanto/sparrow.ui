import { ChevronRight, GitFork, Star } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangePill } from "./change-pill";
import { WatchlistSummary } from "@/schemas/dashboardTypes";

type WatchlistSummaryCardProps = {
  watchlist: WatchlistSummary;
  href?: string;
  ctaLabel?: string;
};

function getVisibilityBadgeClass(visibility: WatchlistSummary["visibility"]) {
  if (visibility === "Private") {
    return "bg-slate-500/10 text-slate-600 hover:bg-slate-500/10";
  }

  if (visibility === "Public") {
    return "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10";
  }

  if (visibility === "Forked") {
    return "bg-violet-500/10 text-violet-600 hover:bg-violet-500/10";
  }

  return "bg-blue-500/10 text-blue-600 hover:bg-blue-500/10";
}

export function WatchlistSummaryCard({
  watchlist,
  href = `/watchlists/${watchlist.id}`,
  ctaLabel = "Open watchlist",
}: WatchlistSummaryCardProps) {
  return (
    <Card className="rounded-3xl transition-transform hover:-translate-y-0.5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className={getVisibilityBadgeClass(watchlist.visibility)}
              >
                {watchlist.visibility}
              </Badge>

              <Badge variant="outline" className="rounded-full">
                {watchlist.stocksCount} stocks
              </Badge>
            </div>

            <CardTitle className="truncate text-base">
              {watchlist.name}
            </CardTitle>

            <CardDescription className="mt-1 line-clamp-2">
              {watchlist.description}
            </CardDescription>
          </div>

          <ChangePill value={watchlist.dailyChange} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 p-3 text-sm">
          <div>
            <p className="text-muted-foreground">Top mover</p>
            <div className="mt-1 flex items-center gap-2">
              <p className="font-medium">{watchlist.topTicker}</p>
              <ChangePill value={watchlist.topTickerChange} size="sm" />
            </div>
          </div>

          <div className="text-right">
            <p className="text-muted-foreground">1M performance</p>
            <p
              className={`mt-1 font-medium ${
                watchlist.monthlyChange >= 0
                  ? "text-emerald-600"
                  : "text-rose-600"
              }`}
            >
              {watchlist.monthlyChange >= 0 ? "+" : ""}
              {watchlist.monthlyChange.toFixed(2)}%
            </p>
          </div>
        </div>

        {watchlist.forks || watchlist.bookmarks ? (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {watchlist.forks ? (
              <div className="flex items-center gap-1.5">
                <GitFork className="h-4 w-4" />
                {watchlist.forks}
              </div>
            ) : null}

            {watchlist.bookmarks ? (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4" />
                {watchlist.bookmarks}
              </div>
            ) : null}
          </div>
        ) : null}

        <Button asChild variant="ghost" className="w-full justify-between">
          <Link href={href}>
            {ctaLabel}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
