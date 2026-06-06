import {
  Activity,
  ArrowLeftRight,
  CalendarDays,
  ChartNoAxesCombined,
} from "lucide-react";

import { convertEpochToShortDate } from "@/lib/utils/formatDates";
import type { StockInfoResponse } from "@/schemas/stock";

import { MetricGrid } from "./metric-grid";
import {
  formatCompactNumber,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatPriceRange,
  getPricePosition,
  hasNumber,
} from "@/lib/utils/stockDetails";
import { DetailsSection } from "./details-section";

type MarketStatisticsTabProps = {
  stock: StockInfoResponse;
};

export function MarketStatisticsTab({ stock }: MarketStatisticsTabProps) {
  const currency = stock.currency ?? "USD";

  const price = stock.currentPrice ?? stock.regularMarketPrice;

  const rangePosition = getPricePosition(
    price,
    stock.fiftyTwoWeekLow,
    stock.fiftyTwoWeekHigh,
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <DetailsSection
        title="Trading session"
        description="Current and latest regular-session information"
        icon={Activity}
      >
        <MetricGrid
          columns={3}
          items={[
            {
              label: "Previous close",
              value: formatCurrency(stock.previousClose, currency),
            },
            {
              label: "Open",
              value: formatCurrency(stock.open, currency),
            },
            {
              label: "Day range",
              value: formatPriceRange(
                stock.dayLow ?? stock.regularMarketDayLow,
                stock.dayHigh ?? stock.regularMarketDayHigh,
                currency,
              ),
            },
            {
              label: "Bid",
              value: formatCurrency(stock.bid, currency),
              description: hasNumber(stock.bidSize)
                ? `${formatNumber(stock.bidSize, 0)} lots`
                : undefined,
            },
            {
              label: "Ask",
              value: formatCurrency(stock.ask, currency),
              description: hasNumber(stock.askSize)
                ? `${formatNumber(stock.askSize, 0)} lots`
                : undefined,
            },
            {
              label: "Market state",
              value: stock.marketState ?? "—",
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Trading volume"
        description="Recent liquidity and activity"
        icon={ChartNoAxesCombined}
      >
        <MetricGrid
          columns={2}
          items={[
            {
              label: "Current volume",
              value: formatCompactNumber(
                stock.regularMarketVolume ?? stock.volume,
              ),
            },
            {
              label: "3-month average",
              value: formatCompactNumber(
                stock.averageDailyVolume3Month ?? stock.averageVolume,
              ),
            },
            {
              label: "10-day average",
              value: formatCompactNumber(
                stock.averageDailyVolume10Day ?? stock.averageVolume10days,
              ),
            },
            {
              label: "Relative volume",
              value:
                hasNumber(stock.regularMarketVolume) &&
                hasNumber(stock.averageDailyVolume3Month) &&
                stock.averageDailyVolume3Month > 0
                  ? `${formatNumber(
                      stock.regularMarketVolume /
                        stock.averageDailyVolume3Month,
                    )}x`
                  : "—",
            },
          ]}
        />
      </DetailsSection>

      <DetailsSection
        title="Price ranges"
        description="Current position against historical price levels"
        icon={ArrowLeftRight}
        className="xl:col-span-2"
      >
        <MetricGrid
          columns={4}
          items={[
            {
              label: "52-week low",
              value: formatCurrency(stock.fiftyTwoWeekLow, currency),
            },
            {
              label: "52-week high",
              value: formatCurrency(stock.fiftyTwoWeekHigh, currency),
            },
            {
              label: "50-day average",
              value: formatCurrency(stock.fiftyDayAverage, currency),
            },
            {
              label: "200-day average",
              value: formatCurrency(stock.twoHundredDayAverage, currency),
            },
            {
              label: "All-time low",
              value: formatCurrency(stock.allTimeLow, currency),
            },
            {
              label: "All-time high",
              value: formatCurrency(stock.allTimeHigh, currency),
            },
            {
              label: "52-week change",
              value: formatPercent(stock.fiftyTwoWeekChangePercent, {
                alreadyPercentage: true,
                signed: true,
              }),
            },
            {
              label: "S&P 500 change",
              value: formatPercent(stock.SandP52WeekChange, {
                alreadyPercentage: true,
                signed: true,
              }),
            },
          ]}
        />

        {rangePosition !== null && (
          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatCurrency(stock.fiftyTwoWeekLow, currency)}</span>
              <span>Current price position</span>
              <span>{formatCurrency(stock.fiftyTwoWeekHigh, currency)}</span>
            </div>

            <div className="relative h-2 rounded-full bg-muted">
              <div
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground shadow"
                style={{ left: `${rangePosition}%` }}
              />
            </div>
          </div>
        )}
      </DetailsSection>

      <DetailsSection
        title="Corporate events"
        description="Upcoming and previous reported events"
        icon={CalendarDays}
        className="xl:col-span-2"
      >
        <MetricGrid
          columns={4}
          items={[
            {
              label: "Earnings date",
              value:
                stock.earningsTimestamp && stock.exchangeTimezoneName
                  ? convertEpochToShortDate(
                      stock.earningsTimestamp,
                      stock.exchangeTimezoneName,
                    )
                  : "—",
            },
            {
              label: "Ex-dividend date",
              value:
                stock.exDividendDate && stock.exchangeTimezoneName
                  ? convertEpochToShortDate(
                      stock.exDividendDate,
                      stock.exchangeTimezoneName,
                    )
                  : "—",
            },
            {
              label: "Last split",
              value: stock.lastSplitFactor ?? "—",
            },
            {
              label: "Fiscal year end",
              value:
                stock.lastFiscalYearEnd && stock.exchangeTimezoneName
                  ? convertEpochToShortDate(
                      stock.lastFiscalYearEnd,
                      stock.exchangeTimezoneName,
                    )
                  : "—",
            },
          ]}
        />
      </DetailsSection>
    </div>
  );
}
