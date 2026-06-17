import { BadgeDollarSign, Coins, Scale } from "lucide-react";

import type { StockInfoResponse } from "@/schemas/stock";

import { DetailsSection } from "./details-section";
import { MetricGrid } from "./metric-grid";
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
  formatRatio,
  hasNumber,
} from "@/lib/utils/stockDetails";

type ValuationTabProps = {
  stock: StockInfoResponse;
};

export function ValuationTab({ stock }: ValuationTabProps) {
  const currency = stock.currency ?? stock.financialCurrency ?? "USD";

  const enterpriseToRevenue =
    hasNumber(stock.enterpriseValue) &&
    hasNumber(stock.totalRevenue) &&
    stock.totalRevenue !== 0
      ? stock.enterpriseValue / stock.totalRevenue
      : null;

  const enterpriseToEbitda =
    hasNumber(stock.enterpriseValue) &&
    hasNumber(stock.ebitda) &&
    stock.ebitda !== 0
      ? stock.enterpriseValue / stock.ebitda
      : null;

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <DetailsSection
        title="Valuation multiples"
        description="Market valuation relative to earnings and assets"
        icon={Scale}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Trailing P/E",
              value: formatRatio(stock.trailingPe),
            },
            {
              label: "Forward P/E",
              value: formatRatio(stock.forwardPe),
            },
            {
              label: "Price to book",
              value: formatRatio(stock.priceToBook),
            },
            {
              label: "Price / current-year EPS",
              value: formatRatio(stock.priceEpsCurrentYear),
            },
            {
              label: "Enterprise value / revenue",
              value: formatRatio(enterpriseToRevenue),
            },
            {
              label: "Enterprise value / EBITDA",
              value: formatRatio(enterpriseToEbitda),
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Per-share metrics"
        description="Earnings, revenue, cash and book value per share"
        icon={Coins}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Trailing EPS (TTM)",
              value: formatCurrency(
                stock.trailingEps ?? stock.epsTrailingTwelveMonths,
                currency,
              ),
            },
            {
              label: "Forward EPS",
              value: formatCurrency(
                stock.forwardEps ?? stock.epsForward,
                currency,
              ),
            },
            {
              label: "Current-year EPS",
              value: formatCurrency(stock.epsCurrentYear, currency),
            },
            {
              label: "Revenue per share",
              value: formatCurrency(stock.revenuePerShare, currency),
            },
            {
              label: "Book value per share",
              value: formatCurrency(stock.bookValue, currency),
            },
            {
              label: "Cash per share",
              value: formatCurrency(stock.totalCashPerShare, currency),
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Capitalisation"
        description="Enterprise and equity valuation"
        icon={BadgeDollarSign}
        className="xl:col-span-2"
      >
        <MetricGrid
          columns={4}
          items={[
            {
              label: "Market capitalisation",
              value: formatCompactCurrency(stock.marketCap, currency),
            },
            {
              label: "Enterprise value",
              value: formatCompactCurrency(stock.enterpriseValue, currency),
            },
            {
              label: "Total cash",
              value: formatCompactCurrency(stock.totalCash, currency),
            },
            {
              label: "Total debt",
              value: formatCompactCurrency(stock.totalDebt, currency),
            },
            {
              label: "Dividend yield",
              value: formatPercent(stock.dividendYield),
            },
            {
              label: "Payout ratio",
              value: formatPercent(stock.payoutRatio),
            },
            {
              label: "Dividend rate",
              value: formatCurrency(stock.dividendRate, currency),
            },
            {
              label: "Five-year average yield",
              value: formatPercent(stock.fiveYearAvgDividendYield, {
                alreadyPercentage: true,
              }),
            },
          ]}
        />
      </DetailsSection>
    </div>
  );
}
