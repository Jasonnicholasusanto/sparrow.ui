"use client";

import { motion } from "motion/react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { Badge } from "@/components/ui/badge";
import { environment } from "@/lib/utils/env";
import { StockInfoResponse } from "@/schemas/stock";
import { convertEpochToDate } from "@/lib/utils/formatDates";
import { formatPrice } from "@/lib/utils/formatPrice";

export default function StockHeader({ stock }: { stock: StockInfoResponse }) {
  const logoUrl = `${environment.logoKitTickerApiUrl}/${stock.symbol}?token=${environment.logoKitTickerApiToken}`;

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <section className="flex flex-col sm:flex-row items-center sm:items-end sm:justify-between gap-4">
        <div className="flex items-center gap-5">
          <Avatar className="w-13 h-13">
            <AvatarImage
              src={logoUrl}
              alt={`${stock.shortName || stock.symbol} logo`}
              loading="lazy"
              // className="object-cover"
            />
            <AvatarFallback className="text-xs font-medium">
              {stock.symbol?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-bold tracking-tight">
              {stock.longName || stock.shortName || stock.symbol}
            </h1>
            <div className="flex items-center gap-1.5">
              <p className="text-muted-foreground text-xs">{stock.symbol}</p>
              <p className="text-muted-foreground text-xs">&bull;</p>
              <p className="text-muted-foreground text-xs">
                {stock.exchange || stock.market}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-right flex flex-row gap-3 items-end">
            <div className="flex items-baseline gap-2 justify-end">
              <p className="text-2xl font-extrabold">
                {formatPrice(stock.currentPrice)
                  ? `${formatPrice(stock.currentPrice)}`
                  : `${formatPrice(stock.regularMarketPrice)}`}
              </p>
              <p className="text-md text-muted-foreground">
                {stock.currency ? ` ${stock.currency}` : ""}
              </p>
            </div>
            {stock.regularMarketChange && (
              <Badge
                variant="ticker"
                className={cn(
                  "px-3 py-1 rounded-3xl",
                  stock.regularMarketChange > 0
                    ? "bg-green-500/10"
                    : "bg-red-500/10",
                )}
              >
                <div className="flex items-center gap-1 justify-end">
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      stock.regularMarketChange! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    {stock.regularMarketChange! >= 0 ? (
                      <BiSolidUpArrow />
                    ) : (
                      <BiSolidDownArrow />
                    )}
                    {Math.abs(stock.regularMarketChange!).toFixed(2)}
                  </p>
                  <p
                    className={cn(
                      "text-md font-bold",
                      stock.regularMarketChangePercent! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    ({stock.regularMarketChangePercent! >= 0 ? "+" : "-"}
                    {Math.abs(stock.regularMarketChangePercent!).toFixed(2)}
                    &#37;)
                  </p>
                  <p
                    className={cn(
                      "text-md",
                      stock.regularMarketChangePercent! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    At close
                  </p>
                </div>
              </Badge>
            )}
            {stock.postMarketChange && (
              <Badge
                variant="ticker"
                className={cn(
                  "px-3 py-1 rounded-3xl",
                  stock.postMarketChange > 0
                    ? "bg-green-500/10"
                    : "bg-red-500/10",
                )}
              >
                <div className="flex items-center gap-1 justify-end">
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      stock.postMarketChange! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    {stock.postMarketChange! >= 0 ? (
                      <BiSolidUpArrow />
                    ) : (
                      <BiSolidDownArrow />
                    )}
                    {Math.abs(stock.postMarketChange!).toFixed(2)}
                  </p>
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      stock.postMarketChangePercent! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    ({stock.postMarketChangePercent! >= 0 ? "+" : "-"}
                    {Math.abs(stock.postMarketChangePercent!).toFixed(2)}&#37;)
                  </p>
                  <p
                    className={cn(
                      "text-md",
                      stock.postMarketChangePercent! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    After hours
                  </p>
                </div>
              </Badge>
            )}
            {stock.preMarketChange && (
              <Badge
                variant="ticker"
                className={cn(
                  "px-3 py-1 rounded-3xl",
                  stock.preMarketChange! > 0
                    ? "bg-green-500/10"
                    : "bg-red-500/10",
                )}
              >
                <div className="flex items-center gap-1 justify-end">
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      stock.preMarketChange! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    {stock.preMarketChange! >= 0 ? (
                      <BiSolidUpArrow />
                    ) : (
                      <BiSolidDownArrow />
                    )}
                    {Math.abs(stock.preMarketChange!).toFixed(2)}
                  </p>
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      stock.preMarketChangePercent! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    ({stock.preMarketChangePercent! >= 0 ? "+" : "-"}
                    {Math.abs(stock.preMarketChangePercent!).toFixed(2)}&#37;)
                  </p>
                  <p
                    className={cn(
                      "text-md",
                      stock.preMarketChange! > 0
                        ? "text-green-500"
                        : "text-red-500",
                    )}
                  >
                    Pre-market
                  </p>
                </div>
              </Badge>
            )}
          </div>
          <div className="flex gap-1.5 items-center">
            <div className="flex gap-1.5 items-center">
              <p className="text-xs text-muted-foreground">Last updated</p>
              <p className="text-xs text-muted-foreground">&bull;</p>
              <p className="text-xs text-muted-foreground">
                {convertEpochToDate(
                  stock.regularMarketTime!,
                  stock.exchangeTimezoneName!,
                ).toLocaleString()}
              </p>
            </div>
            {stock.exchangeDataDelayedBy! > 0 && (
              <div className="flex gap-1.5 items-center">
                <p className="text-muted-foreground text-xs">&bull;</p>
                <p className="text-muted-foreground text-xs">
                  Delayed Quote ({stock.exchangeDataDelayedBy} min)
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Separator />
    </motion.div>
  );
}
