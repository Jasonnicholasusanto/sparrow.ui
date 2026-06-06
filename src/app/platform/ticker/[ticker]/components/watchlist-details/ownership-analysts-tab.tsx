import { Building, Crosshair, UsersRound } from "lucide-react";

import type { StockInfoResponse } from "@/schemas/stock";

import { DetailsSection } from "./details-section";
import { MetricGrid } from "./metric-grid";
import {
  formatCurrency,
  formatNumber,
  formatPercent,
  hasNumber,
} from "@/lib/utils/stockDetails";

type OwnershipAnalystsTabProps = {
  stock: StockInfoResponse;
};

export function OwnershipAnalystsTab({ stock }: OwnershipAnalystsTabProps) {
  const currency = stock.currency ?? "USD";

  const meanTargetUpside =
    hasNumber(stock.currentPrice) &&
    hasNumber(stock.targetMeanPrice) &&
    stock.currentPrice !== 0
      ? (stock.targetMeanPrice - stock.currentPrice) / stock.currentPrice
      : null;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <DetailsSection
        title="Ownership"
        description="Reported institutional and insider ownership"
        icon={UsersRound}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Institutional ownership",
              value: formatPercent(stock.heldPercentInstitutions),
            },
            {
              label: "Insider ownership",
              value: formatPercent(stock.heldPercentInsiders),
            },
            {
              label: "Shares outstanding",
              value: formatNumber(stock.sharesOutstanding, 0),
            },
            {
              label: "Free Float shares",
              value: formatNumber(stock.floatShares, 0),
            },
            {
              label: "Short interest",
              value: formatNumber(stock.sharesShort, 0),
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Analyst consensus"
        description="Reported recommendations and coverage"
        icon={Building}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Recommendation",
              value:
                stock.recommendationKey
                  ?.replaceAll("_", " ")
                  .replace(/\b\w/g, (letter) => letter.toUpperCase()) ?? "—",
            },
            {
              label: "Average rating",
              value: stock.averageAnalystRating ?? "—",
            },
            {
              label: "Recommendation score",
              value: formatNumber(stock.recommendationMean),
            },
            {
              label: "Analyst opinions",
              value: formatNumber(stock.numberOfAnalystOpinions, 0),
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Price targets"
        description="Analyst target-price range and implied upside"
        icon={Crosshair}
        className="xl:col-span-2"
      >
        <MetricGrid
          columns={4}
          items={[
            {
              label: "Low target",
              value: formatCurrency(stock.targetLowPrice, currency),
            },
            {
              label: "Mean target",
              value: formatCurrency(stock.targetMeanPrice, currency),
              description: hasNumber(meanTargetUpside)
                ? `${formatPercent(meanTargetUpside, {
                    signed: true,
                  })} implied return`
                : undefined,
            },
            {
              label: "Median target",
              value: formatCurrency(stock.targetMedianPrice, currency),
            },
            {
              label: "High target",
              value: formatCurrency(stock.targetHighPrice, currency),
            },
          ]}
        />
      </DetailsSection>
    </div>
  );
}
