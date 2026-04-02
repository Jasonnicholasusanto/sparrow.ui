"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockAreaLineChart from "./area-line-chart";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { Skeleton } from "@/components/ui/skeleton";
import { DotWave } from "ldrs/react";
import CandlestickChart from "./candlestick-chart";
import {
  LuChartArea,
  LuChartCandlestick,
  LuEye,
  LuHeart,
} from "react-icons/lu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { HistoryPoint } from "@/schemas/stock";
import { formatPrice } from "@/lib/utils/formatPrice";
import { stockDataPeriods } from "@/lib/options/stockDataOptions";
import { getStockHistoryClient } from "@/lib/data/client/stock";

interface StockChartProps {
  symbol: string;
}

export default function StockChartBody({ symbol }: StockChartProps) {
  const [history, setHistory] = useState<HistoryPoint[]>([]);
  const [change, setChange] = useState(0);
  const [percentChange, setPercentChange] = useState(0);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState<"line" | "candle">("line");
  const [interval, setInterval] = useState("30m");
  const [period, setPeriod] = useState("1mo");

  async function fetchHistory() {
    setLoading(true);

    try {
      const data = await getStockHistoryClient(symbol, interval, period);

      const sorted = (data.history || []).sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );

      setHistory(sorted);
      setChange(data.change || 0);
      setPercentChange(data.change_percentage || 0);
    } catch (err) {
      console.error("Failed to fetch ticker history:", err);
    } finally {
      setLoading(false);
    }
  }

  function getPeriodDescription(period: string) {
    return stockDataPeriods.find((p) => p.period === period)?.description || "";
  }

  useEffect(() => {
    fetchHistory();
  }, [symbol, interval, period]);

  function getIntervalForPeriod(period: string): string | undefined {
    return stockDataPeriods.find((p) => p.period === period)?.interval;
  }

  function handleStockDataPeriodChange(newPeriod: string) {
    setPeriod(newPeriod);
    const nextInterval = getIntervalForPeriod(newPeriod);
    if (nextInterval) setInterval(nextInterval);
  }

  function handleChartTypeChange(newType: string) {
    if (newType === "line" || newType === "candle") {
      setChartType(newType);
    }
  }

  return (
    <div>
      <div className="flex flex-end justify-between items-center mb-5">
        <div className="flex items-center gap-3">
          <Tabs value={period} onValueChange={handleStockDataPeriodChange}>
            <TabsList className="bg-muted gap-1 rounded-xl h-9.5">
              {stockDataPeriods.map((p) => (
                <TabsTrigger
                  key={p.period}
                  value={p.period}
                  className={cn(
                    "rounded-lg cursor-pointer px-3 flex items-center justify-center h-full transition-all",
                    "data-[state=active]:border data-[state=active]:border-primary data-[state=active]:bg-background",
                    "data-[state=inactive]:opacity-50",
                  )}
                >
                  {p.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Tabs value={chartType} onValueChange={handleChartTypeChange}>
                <TabsList className="bg-muted gap-1 rounded-xl h-9.5">
                  <TabsTrigger
                    className={cn(
                      "rounded-lg cursor-pointer px-3 flex items-center justify-center h-full transition-all",
                      "data-[state=active]:border data-[state=active]:border-primary data-[state=active]:bg-background",
                      "data-[state=inactive]:opacity-50",
                    )}
                    value="line"
                  >
                    <LuChartArea />
                  </TabsTrigger>

                  <TabsTrigger
                    value="candle"
                    className={cn(
                      "rounded-lg cursor-pointer px-3 transition-all",
                      "data-[state=active]:border data-[state=active]:border-primary data-[state=active]:bg-background",
                      "data-[state=inactive]:opacity-50",
                    )}
                  >
                    <LuChartCandlestick />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </TooltipTrigger>
            <TooltipContent side="bottom">Toggle chart</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button variant="default" className="rounded-xl p-2">
                <LuEye />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add to watchlist</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={500}>
            <TooltipTrigger asChild>
              <Button variant="secondary" className="rounded-xl p-2">
                <LuHeart />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Add to favourites</TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-end justify-end items-center">
          {loading ? (
            <div className="text-right flex flex-row gap-5 items-end">
              <Badge
                variant="ticker"
                className="px-3 py-1 rounded-3xl min-w-50"
              >
                <Skeleton className="h-3 w-full rounded-full" />
              </Badge>
            </div>
          ) : (
            <div className="text-right flex flex-row gap-5 items-end">
              <Badge
                variant="ticker"
                className={cn(
                  "px-3 py-1 rounded-3xl",
                  change > 0 ? "bg-green-500/10" : "bg-red-500/10",
                )}
              >
                <div className="flex items-center gap-2 justify-end">
                  <p
                    className={cn(
                      "text-md font-bold flex flex-row items-center gap-0.5",
                      change > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {change! >= 0 ? <BiSolidUpArrow /> : <BiSolidDownArrow />}
                    {formatPrice(Math.abs(change))}
                  </p>
                  <p
                    className={cn(
                      "text-md font-bold",
                      percentChange > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    ({percentChange > 0 ? "+" : "-"}
                    {Math.abs(percentChange).toFixed(2)}&#37;)
                  </p>
                  <p
                    className={cn(
                      "text-md",
                      percentChange > 0 ? "text-green-500" : "text-red-500",
                    )}
                  >
                    {getPeriodDescription(period)}
                  </p>
                </div>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="h-125 lg:h-116 rounded-lg flex bg-muted-foreground/3 items-center justify-center">
          <DotWave size="50" speed="1" color="white" />
        </div>
      ) : (
        <div className="h-125 lg:h-116 flex items-center justify-center rounded-md pt-10">
          {chartType === "line" ? (
            <StockAreaLineChart
              data={history}
              change={change}
              period={period}
              symbol={symbol}
            />
          ) : (
            <CandlestickChart data={history} symbol={symbol} />
          )}
        </div>
      )}
    </div>
  );
}
