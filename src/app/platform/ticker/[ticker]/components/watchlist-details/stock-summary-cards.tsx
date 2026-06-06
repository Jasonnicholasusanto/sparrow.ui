import { Activity, BarChart3, Building2, Gauge } from "lucide-react";

import type { StockInfoResponse } from "@/schemas/stock";

import { MetricCard } from "./metric-card";
import {
  formatCompactCurrency,
  formatNumber,
  formatPercent,
  formatRatio,
  hasNumber,
} from "@/lib/utils/stockDetails";

type StockSummaryCardsProps = {
  stock: StockInfoResponse;
};

export function StockSummaryCards({ stock }: StockSummaryCardsProps) {
  const currency = stock.currency ?? stock.financialCurrency ?? "USD";

  const analystUpside =
    hasNumber(stock.currentPrice) &&
    hasNumber(stock.targetMeanPrice) &&
    stock.currentPrice !== 0
      ? (stock.targetMeanPrice - stock.currentPrice) / stock.currentPrice
      : null;

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Market capitalisation"
        value={formatCompactCurrency(stock.marketCap, currency)}
        description="Total equity market value"
        icon={Building2}
      />

      <MetricCard
        label="Trailing P/E"
        value={formatRatio(stock.trailingPe)}
        description={
          hasNumber(stock.forwardPe)
            ? `Forward: ${formatRatio(stock.forwardPe)}`
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
        label="Analyst consensus"
        value={
          stock.recommendationKey
            ? stock.recommendationKey.replaceAll("_", " ")
            : "—"
        }
        description={
          hasNumber(analystUpside)
            ? `${formatPercent(analystUpside, {
                signed: true,
              })} to mean target`
            : `${formatNumber(
                stock.numberOfAnalystOpinions,
                0,
              )} analyst opinions`
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
