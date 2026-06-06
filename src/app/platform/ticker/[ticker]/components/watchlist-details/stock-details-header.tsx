import { Building2, Clock3, ExternalLink, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { StockInfoResponse } from "@/schemas/stock";
import {
  formatCurrency,
  formatPercent,
  getCompanyLocation,
  hasNumber,
} from "@/lib/utils/stockDetails";

type StockDetailsHeaderProps = {
  stock: StockInfoResponse;
};

export function StockDetailsHeader({ stock }: StockDetailsHeaderProps) {
  const currency = stock.currency ?? stock.financialCurrency ?? "USD";

  const price = stock.currentPrice ?? stock.regularMarketPrice;
  const change = stock.regularMarketChange;
  const changePercent = stock.regularMarketChangePercent;

  const isPositive = hasNumber(change) && change >= 0;
  const location = getCompanyLocation(stock);

  return (
    <div className="rounded-3xl border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-semibold tracking-tight">
              {stock.longName ?? stock.shortName ?? stock.symbol}
            </h1>

            {stock.symbol && (
              <Badge variant="secondary" className="font-mono">
                {stock.symbol}
              </Badge>
            )}

            {stock.marketState && (
              <Badge variant="outline">{stock.marketState}</Badge>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {(stock.fullExchangeName || stock.exchange) && (
              <span className="flex items-center gap-1.5">
                <Building2 className="size-3.5" />
                {stock.fullExchangeName ?? stock.exchange}
              </span>
            )}

            {location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {location}
              </span>
            )}

            {stock.exchangeTimezoneShortName && (
              <span className="flex items-center gap-1.5">
                <Clock3 className="size-3.5" />
                {stock.exchangeTimezoneShortName}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {stock.sector && <Badge variant="outline">{stock.sector}</Badge>}

            {stock.industry && (
              <Badge variant="outline">{stock.industry}</Badge>
            )}

            {stock.typeDisp && (
              <Badge variant="outline">{stock.typeDisp}</Badge>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start lg:items-end">
          <div className="text-3xl font-semibold tracking-tight">
            {formatCurrency(price, currency)}
          </div>

          {(hasNumber(change) || hasNumber(changePercent)) && (
            <div
              className={
                isPositive
                  ? "mt-1 font-medium text-emerald-600 dark:text-emerald-400"
                  : "mt-1 font-medium text-red-600 dark:text-red-400"
              }
            >
              {hasNumber(change) && (
                <span>
                  {change > 0 ? "+" : ""}
                  {formatCurrency(change, currency)}
                </span>
              )}

              {hasNumber(changePercent) && (
                <span className="ml-2">
                  (
                  {formatPercent(changePercent, {
                    alreadyPercentage: true,
                    signed: true,
                  })}
                  )
                </span>
              )}
            </div>
          )}

          {stock.website && (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <a href={stock.website} target="_blank" rel="noopener noreferrer">
                Company website
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
