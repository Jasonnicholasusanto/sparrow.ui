"use client";

import { useMemo, useState } from "react";
import CandlestickChart from "./candlestick-chart";
import StockAreaLineChart from "./area-line-chart";
import { HistoryPoint } from "@/schemas/stock";

interface SyncedStockChartsProps {
  data: HistoryPoint[];
  symbol?: string;
  period?: string;
  change?: number;
  chartType: "line" | "candle";
}

export default function SyncedStockCharts({
  data,
  symbol,
  period,
  change,
  chartType,
}: SyncedStockChartsProps) {
  const sortedData = useMemo(
    () =>
      [...data].sort(
        (a, b) =>
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      ),
    [data],
  );

  const [brushRange, setBrushRange] = useState({
    startIndex: 0,
    endIndex: sortedData.length - 1,
  });

  const handleBrushChange = (range: {
    startIndex: number;
    endIndex: number;
  }) => {
    setBrushRange((prev) => {
      if (
        prev.startIndex === range.startIndex &&
        prev.endIndex === range.endIndex
      ) {
        return prev;
      }

      return range;
    });
  };

  return (
    <div className="h-125 lg:h-116 flex items-center justify-center rounded-md pt-10">
      {chartType === "line" ? (
        <StockAreaLineChart
          data={sortedData}
          change={change}
          period={period}
          symbol={symbol}
          brushRange={brushRange}
          onBrushChange={handleBrushChange}
        />
      ) : (
        <CandlestickChart
          data={sortedData}
          symbol={symbol}
          brushRange={brushRange}
          onBrushChange={handleBrushChange}
        />
      )}
    </div>
  );
}
