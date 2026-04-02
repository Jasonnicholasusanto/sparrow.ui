"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { convertEpochToShortDate } from "@/lib/utils/formatDates";
import { StockInfoResponse } from "@/schemas/stock";
import { motion } from "motion/react";
import { useState } from "react";

interface StockDetailsProps {
  stock: StockInfoResponse;
}

export default function StockDetails({ stock }: StockDetailsProps) {
  const [expanded, setExpanded] = useState(false);

  if (!stock) return null;

  const summary =
    stock.longBusinessSummary || "No company description available.";
  const MAX_CHARS = 250; // adjust as needed

  const isLong = summary.length > MAX_CHARS;
  const displayedText = expanded ? summary : summary.slice(0, MAX_CHARS);

  const fmt = (v: number | undefined | null, decimals = 2) =>
    v !== undefined && v !== null
      ? v.toLocaleString("en-US", { maximumFractionDigits: decimals })
      : "-";

  function StatItem({ label, value }: { label: string; value: any }) {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="text-xs text-muted-foreground font-medium">
          {label}
        </span>
        <span className="text-sm font-semibold">{value ?? "—"}</span>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid md:grid-cols-8 gap-5">
        <Card className="md:col-span-3 p-6 space-y-6 gap-0">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">About</h2>
            <Separator />

            <div>
              <motion.div
                key={expanded ? "expanded" : "collapsed"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                }}
                className="overflow-hidden"
              >
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                  {displayedText}
                  {!expanded && isLong && "…"}
                </p>
              </motion.div>

              {isLong && (
                <button
                  onClick={() => setExpanded((p) => !p)}
                  className="text-xs font-medium text-blue-400 hover:underline"
                >
                  {expanded ? "Show less" : "Show more"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                CEO
              </span>
              <span className="text-sm font-semibold">
                {stock.companyOfficers?.[0]?.name || "—"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                Industry
              </span>
              <span className="text-sm font-semibold">
                {stock.industry ?? "—"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                Sector
              </span>
              <span className="text-sm font-semibold">
                {stock.sector ?? "—"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                Website
              </span>
              <span className="text-sm font-semibold">
                {stock.website ? (
                  <a
                    href={stock.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 text-blue-400 hover:text-blue-300"
                  >
                    {stock.website}
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                Country
              </span>
              <span className="text-sm font-semibold">
                {stock.country ?? "—"}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-xs text-muted-foreground font-medium">
                Employees
              </span>
              <span className="text-sm font-semibold">
                {stock.fullTimeEmployees?.toLocaleString() ?? "—"}
              </span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-5 p-6 gap-6 space-y-0">
          <h2 className="text-xl font-bold">Statistics</h2>
          <Separator />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem
              label="Previous close"
              value={`$${fmt(stock.previousClose)}`}
            />
            <StatItem label="Open" value={`$${fmt(stock.open)}`} />
            <StatItem
              label="Bid"
              value={stock.bid ? `${fmt(stock.bid)} x ${stock.bidSize}00` : "—"}
            />
            <StatItem
              label="Ask"
              value={stock.ask ? `${fmt(stock.ask)} x ${stock.askSize}00` : "—"}
            />
            <StatItem
              label="Day range"
              value={
                stock.regularMarketDayRange
                  ? stock.regularMarketDayRange
                      .split("-")
                      .map((v) => `$${fmt(Number(v.trim()))}`)
                      .join(" - ")
                  : `$${fmt(stock.dayLow)} - $${fmt(stock.dayHigh)}`
              }
            />
            <StatItem
              label="52-Week range"
              value={
                stock.fiftyTwoWeekRange
                  ? stock.fiftyTwoWeekRange
                      .split("-")
                      .map((v) => `$${fmt(Number(v.trim()))}`)
                      .join(" - ")
                  : `$${fmt(stock.fiftyTwoWeekLow)} - $${fmt(
                      stock.fiftyTwoWeekHigh,
                    )}`
              }
            />
            <StatItem
              label="Volume"
              value={stock.regularMarketVolume?.toLocaleString() ?? "—"}
            />
            <StatItem
              label="Avg. volume"
              value={stock.averageDailyVolume3Month?.toLocaleString() ?? "—"}
            />
            <StatItem
              label="Market cap"
              value={stock.marketCap ? `$${fmt(stock.marketCap, 0)}` : "—"}
            />
            <StatItem
              label="EPS (TTM)"
              value={fmt(stock.epsTrailingTwelveMonths)}
            />
            <StatItem
              label="PE ratio (TTM)"
              value={stock.trailingPE ? `${fmt(stock.trailingPE)}` : "—"}
            />
            <StatItem
              label="Earnings date"
              value={
                stock.earningsTimestamp
                  ? `${convertEpochToShortDate(
                      stock.earningsTimestamp,
                      stock.exchangeTimezoneName!,
                    )}`
                  : "—"
              }
            />
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
