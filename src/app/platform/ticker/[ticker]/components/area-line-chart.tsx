"use client";

import { CrosshairCursor } from "@/components/shared-chart-components";
import { formatTooltipLabel } from "@/lib/utils/chartUtils";
import { HistoryPoint } from "@/schemas/stock";
import { getBrushFill, getBrushStroke, GREEN, RED } from "@/styles/chart";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import {
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Brush,
  Rectangle,
} from "recharts";

interface StockAreaLineChartProps {
  data: HistoryPoint[];
  change?: number;
  period?: string;
  symbol?: string;
  brushRange: {
    startIndex: number;
    endIndex: number;
  };
  onBrushChange: (range: { startIndex: number; endIndex: number }) => void;
}

function formatXAxisLabel(iso: string, period?: string) {
  const date = new Date(iso);

  switch (period) {
    case "1d":
    case "5d":
    case "1wk":
    case "1w":
      return date
        .toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", "");

    case "1mo":
    case "3mo":
    case "6mo":
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    case "1y":
    case "2y":
    case "5y":
    case "10y":
    case "max":
      return date.toLocaleString("en-GB", {
        month: "short",
        year: "numeric",
      });

    default:
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  }
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function CustomTooltip({ active, payload, label, symbol }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as HistoryPoint | undefined;
  if (!point) return null;

  return (
    <div className="rounded-xl border bg-card/95 backdrop-blur-sm p-3 shadow-md text-xs space-y-1.5 min-w-52">
      <div className="font-semibold text-sm">{symbol}</div>
      <div className="text-muted-foreground">{formatTooltipLabel(label)}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
        <div>
          Price: <b>{formatPrice(point.close)}</b>
        </div>
        <div className="col-span-2">
          Volume: <b>{point.volume?.toLocaleString()}</b>
        </div>
      </div>
    </div>
  );
}

function VolumeShape(props: any) {
  const { x, y, width, height, payload } = props;
  const fill = payload.close > payload.open ? GREEN(0.5) : RED(0.5);

  return (
    <Rectangle
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      rx={2}
      ry={2}
      radius={2}
    />
  );
}

export default function StockAreaLineChart({
  data,
  change,
  period,
  symbol,
  brushRange,
  onBrushChange,
}: StockAreaLineChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-75 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const selectedData = useMemo(() => {
    const start = Math.max(0, brushRange.startIndex);
    const end = Math.min(data.length - 1, brushRange.endIndex);
    return data.slice(start, end + 1);
  }, [data, brushRange]);

  const isPositive = useMemo(() => {
    if (selectedData.length >= 2) {
      return (
        selectedData[selectedData.length - 1].close >= selectedData[0].close
      );
    }

    if (change !== undefined) {
      return change > 0;
    }

    return true;
  }, [selectedData, change]);

  const areaColor = isPositive ? GREEN() : RED();

  return (
    <div className="w-full h-125 lg:h-116">
      <ResponsiveContainer width="100%" maxHeight={500}>
        <ComposedChart
          data={data}
          responsive
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barGap="-100%"
          barCategoryGap={1}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={areaColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={areaColor} stopOpacity={0} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(iso) => formatXAxisLabel(iso, period)}
          />

          <YAxis
            yAxisId="price"
            domain={([dataMin, dataMax]) => {
              const range = dataMax - dataMin;
              const padding = range * 0.35;
              return [dataMin - padding, dataMax];
            }}
            tickCount={8}
            tickFormatter={(v) => v.toFixed(2)}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            orientation="right"
            type="number"
            allowDecimals={true}
          />

          <YAxis
            yAxisId="volume"
            scale="sqrt"
            domain={([dataMin, dataMax]) => {
              const range = dataMax - dataMin;
              const padding = range * 15;
              return [0, dataMax + padding];
            }}
            hide
          />

          <Tooltip
            content={<CustomTooltip symbol={symbol} />}
            cursor={<CrosshairCursor />}
            isAnimationActive={false}
          />

          <Bar
            yAxisId="volume"
            dataKey="volume"
            opacity={0.5}
            barSize={1000}
            radius={[2, 2, 0, 0]}
            shape={VolumeShape}
          />

          <Area
            yAxisId="price"
            type="bump"
            dataKey="close"
            stroke={areaColor}
            fill="url(#colorPrice)"
            isAnimationActive={true}
          />

          <Brush
            dataKey="timestamp"
            height={13}
            travellerWidth={5}
            startIndex={brushRange.startIndex}
            endIndex={brushRange.endIndex}
            stroke={getBrushStroke(isDark)}
            fill={getBrushFill(isDark)}
            tickFormatter={() => ""}
            onChange={(range) => {
              if (
                !range ||
                typeof range.startIndex !== "number" ||
                typeof range.endIndex !== "number"
              ) {
                return;
              }

              onBrushChange({
                startIndex: range.startIndex,
                endIndex: range.endIndex,
              });
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
