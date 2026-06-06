import {
  ChartSpline,
  CircleDollarSign,
  Landmark,
  TrendingUp,
} from "lucide-react";

import type { StockInfoResponse } from "@/schemas/stock";

import { DetailsSection } from "./details-section";
import { MetricGrid } from "./metric-grid";
import {
  formatCompactCurrency,
  formatNumber,
  formatPercent,
  formatRatio,
} from "@/lib/utils/stockDetails";

type FinancialsTabProps = {
  stock: StockInfoResponse;
};

export function FinancialsTab({ stock }: FinancialsTabProps) {
  const currency = stock.financialCurrency ?? stock.currency ?? "USD";

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <DetailsSection
        title="Income and profitability"
        description="Trailing reported financial performance"
        icon={CircleDollarSign}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Revenue",
              value: formatCompactCurrency(stock.totalRevenue, currency),
            },
            {
              label: "Gross profit",
              value: formatCompactCurrency(stock.grossProfits, currency),
            },
            {
              label: "EBITDA",
              value: formatCompactCurrency(stock.ebitda, currency),
            },
            {
              label: "Profit margin",
              value: formatPercent(stock.profitMargins),
            },
            {
              label: "Operating margin",
              value: formatPercent(stock.operatingMargins),
            },
            {
              label: "Revenue growth",
              value: formatPercent(stock.revenueGrowth, {
                signed: true,
              }),
            },
            {
              label: "Earnings growth",
              value: formatPercent(stock.earningsQuarterlyGrowth, {
                signed: true,
              }),
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Returns and balance sheet"
        description="Capital efficiency and short-term financial health"
        icon={Landmark}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Return on equity",
              value: formatPercent(stock.returnOnEquity),
            },
            {
              label: "Return on assets",
              value: formatPercent(stock.returnOnAssets),
            },
            {
              label: "Current ratio",
              value: formatRatio(stock.currentRatio),
            },
            {
              label: "Debt to equity",
              value: formatPercent(stock.debtToEquity, {
                alreadyPercentage: true,
              }),
            },
            {
              label: "Total cash",
              value: formatCompactCurrency(stock.totalCash, currency),
            },
            {
              label: "Total debt",
              value: formatCompactCurrency(stock.totalDebt, currency),
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Cash flow"
        description="Operating and levered free cash flow"
        icon={ChartSpline}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Operating cash flow",
              value: formatCompactCurrency(stock.operatingCashflow, currency),
            },
            {
              label: "Free cash flow",
              value: formatCompactCurrency(stock.freeCashflow, currency),
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Risk profile"
        description="Market sensitivity and share information"
        icon={TrendingUp}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Beta",
              value: formatNumber(stock.beta),
            },
            {
              label: "Shares outstanding",
              value: formatNumber(stock.sharesOutstanding, 0),
            },
            {
              label: "Floating shares",
              value: formatNumber(stock.floatShares, 0),
            },
            {
              label: "Shares sold short",
              value: formatNumber(stock.sharesShort, 0),
            },
          ]}
        />
      </DetailsSection>
    </div>
  );
}
