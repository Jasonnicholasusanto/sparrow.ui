"use client";

import { CrosshairCursor } from "@/components/shared-chart-components";
import { formatTooltipLabel, formatXAxisLabel } from "@/lib/utils/chartUtils";
import { HistoryPoint } from "@/schemas/stock";
import { getBrushFill, getBrushStroke, GREEN, RED } from "@/styles/chart";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Brush,
} from "recharts";

interface CandlestickChartProps {
  data: HistoryPoint[];
  symbol?: string;
  period?: string;
  brushRange: {
    startIndex: number;
    endIndex: number;
  };
  onBrushChange: (range: { startIndex: number; endIndex: number }) => void;
}

type CandleDatum = HistoryPoint & {
  isUp: boolean;
};

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
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

function CandleShape(props: any) {
  const { x, y, width, height, payload } = props;
  const fill = payload.close >= payload.open ? GREEN() : RED();

  const cx = x + width / 2;

  const bodyTop = y;
  const bodyBottom = y + height;
  const highEnd = Math.max(payload.open, payload.close);
  const lowEnd = Math.min(payload.open, payload.close);
  const priceRange = highEnd - lowEnd || 1;
  const pxPerUnit = height / priceRange;

  const wickTop = bodyTop - (payload.high - highEnd) * pxPerUnit;
  const wickBottom = bodyBottom + (lowEnd - payload.low) * pxPerUnit;

  return (
    <g>
      <line
        x1={cx}
        y1={wickTop}
        x2={cx}
        y2={wickBottom}
        stroke={fill}
        strokeWidth={1}
      />
      <Rectangle {...props} fill={fill} radius={2} />
    </g>
  );
}

function CustomTooltip({ active, payload, label, symbol, period }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as HistoryPoint | undefined;
  if (!point) return null;

  const isUp = point.close >= point.open;
  const colorClass = isUp ? "text-green-500" : "text-red-500";

  return (
    <div className="rounded-xl border bg-card/95 backdrop-blur-sm p-3 shadow-md text-xs space-y-1.5 min-w-52">
      <div className="font-semibold text-sm">{symbol}</div>
      <div className="text-muted-foreground">
        {formatTooltipLabel(label, period)}
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
        <div>
          Open: <b>{formatPrice(point.open)}</b>
        </div>
        <div>
          High: <b>{formatPrice(point.high)}</b>
        </div>
        <div>
          Low: <b>{formatPrice(point.low)}</b>
        </div>
        <div>
          Close: <b className={colorClass}>{formatPrice(point.close)}</b>
        </div>
        <div className="col-span-2">
          Volume: <b>{point.volume?.toLocaleString()}</b>
        </div>
      </div>
    </div>
  );
}

export default function CandlestickChart({
  data,
  symbol = "STOCK",
  period,
  brushRange,
  onBrushChange,
}: CandlestickChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-75 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const formattedData = useMemo<CandleDatum[]>(
    () =>
      data.map((d) => ({
        ...d,
        isUp: d.close >= d.open,
      })),
    [data],
  );

  const candleBodyDataKey = (entry: HistoryPoint): [number, number] => [
    Math.min(entry.open, entry.close),
    Math.max(entry.open, entry.close),
  ];

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastCommittedRangeRef = useRef<{
    startIndex: number;
    endIndex: number;
  }>({
    startIndex: brushRange.startIndex,
    endIndex: brushRange.endIndex,
  });

  useEffect(() => {
    lastCommittedRangeRef.current = {
      startIndex: brushRange.startIndex,
      endIndex: brushRange.endIndex,
    };
  }, [brushRange.startIndex, brushRange.endIndex]);

  const handleBrushChange = useCallback(
    (range: { startIndex?: number; endIndex?: number }) => {
      if (
        typeof range.startIndex !== "number" ||
        typeof range.endIndex !== "number"
      ) {
        return;
      }

      const nextStart = range.startIndex;
      const nextEnd = range.endIndex;

      const prev = lastCommittedRangeRef.current;

      if (prev.startIndex === nextStart && prev.endIndex === nextEnd) {
        return;
      }

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        lastCommittedRangeRef.current = {
          startIndex: nextStart,
          endIndex: nextEnd,
        };

        onBrushChange({
          startIndex: nextStart,
          endIndex: nextEnd,
        });
      }, 150);
    },
    [onBrushChange],
  );

  return (
    <div className="w-full h-125 lg:h-116">
      <ResponsiveContainer width="100%" height="100%" minHeight={300}>
        <ComposedChart
          data={formattedData}
          margin={{
            top: 10,
            right: 0,
            left: 0,
            bottom: 0,
          }}
          barGap="-100%"
          barCategoryGap={1}
        >
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
            tickCount={6}
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
            content={<CustomTooltip symbol={symbol} period={period} />}
            cursor={<CrosshairCursor />}
            isAnimationActive={false}
          />

          <Bar
            yAxisId="volume"
            dataKey="volume"
            opacity={0.5}
            radius={[2, 2, 0, 0]}
            shape={VolumeShape}
          />

          <Bar
            yAxisId="price"
            dataKey={candleBodyDataKey}
            shape={CandleShape}
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
            onChange={handleBrushChange}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
