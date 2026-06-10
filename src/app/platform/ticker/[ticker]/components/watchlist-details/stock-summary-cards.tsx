import { Activity, BarChart3, Building2, Gauge } from "lucide-react";

import type { StockInfoResponse } from "@/schemas/stock";

import { MetricCard } from "./metric-card";
import {
  formatCompactCurrency,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRatio,
  hasNumber,
} from "@/lib/utils/stockDetails";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StockSummaryCardsProps = {
  stock: StockInfoResponse;
};

function getRecommendationBadgeClass(
  recommendation: string | null | undefined,
) {
  if (!recommendation) {
    return "border-muted-foreground/20 bg-muted text-muted-foreground";
  }

  const value = recommendation.toLowerCase();

  if (
    value.includes("buy") ||
    value.includes("outperform") ||
    value.includes("overweight")
  ) {
    return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
  }

  if (
    value.includes("sell") ||
    value.includes("underperform") ||
    value.includes("underweight")
  ) {
    return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";
  }

  return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
}

export function StockSummaryCards({ stock }: StockSummaryCardsProps) {
  const currency = stock.currency ?? stock.financialCurrency ?? "USD";

  const analystUpside =
    hasNumber(stock.currentPrice) &&
    hasNumber(stock.targetMeanPrice) &&
    stock.currentPrice !== 0
      ? (stock.targetMeanPrice - stock.currentPrice) / stock.currentPrice
      : null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-5">
      <MetricCard
        label="Market capitalisation"
        value={formatCompactCurrency(stock.marketCap, currency)}
        description="Total equity market value"
        icon={Building2}
      />

      <MetricCard
        label="P/E ratio (TTM)"
        value={formatRatio(stock.trailingPe)}
        description={
          hasNumber(stock.forwardPe)
            ? `Forward: ${formatRatio(stock.forwardPe)}`
            : undefined
        }
        icon={BarChart3}
      />

      <MetricCard
        label="EPS (TTM)"
        value={formatCurrency(stock.trailingEps ?? stock.epsForward, currency)}
        description={
          hasNumber(stock.forwardEps)
            ? `Forward: ${formatCurrency(stock.forwardEps, currency)}`
            : undefined
        }
        icon={BarChart3}
      />

      <MetricCard
        label="52-week performance"
        value={formatPercent(stock.fiftyTwoWeekChangePercent, {
          alreadyPercentage: true,
          signed: true,
        })}
        description={`Beta: ${formatNumber(stock.beta)}`}
        icon={Activity}
        trend={
          hasNumber(stock.fiftyTwoWeekChangePercent)
            ? stock.fiftyTwoWeekChangePercent >= 0
              ? "positive"
              : "negative"
            : "neutral"
        }
      />

      <MetricCard
        label="Analyst target price"
        value={
          <div className="flex flex-wrap items-center gap-2">
            <span>{formatCurrency(stock.targetMeanPrice, currency)}</span>

            {stock.recommendationKey && (
              <Badge
                variant="outline"
                className={cn(
                  "capitalize",
                  getRecommendationBadgeClass(stock.recommendationKey),
                )}
              >
                {stock.recommendationKey.replaceAll("_", " ")}
              </Badge>
            )}
          </div>
        }
        description={
          hasNumber(analystUpside) ? (
            <p
              className={cn(
                analystUpside >= 0
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-600 dark:text-red-400",
              )}
            >
              {formatPercent(analystUpside, {
                signed: true,
              })}{" "}
              to mean target
            </p>
          ) : hasNumber(stock.numberOfAnalystOpinions) ? (
            <p>
              {formatNumber(stock.numberOfAnalystOpinions, 0)} analyst opinions
            </p>
          ) : null
        }
        icon={Gauge}
        trend={
          hasNumber(analystUpside)
            ? analystUpside >= 0
              ? "positive"
              : "negative"
            : "neutral"
        }
      />
    </div>
  );
}
