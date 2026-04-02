"use client";

import { formatTooltipLabel } from "@/lib/utils/chartUtils";
import { HistoryPoint } from "@/schemas/stock";
import { GREEN, RED } from "@/styles/chart";
import { useTheme } from "next-themes";
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
}

type CandleDatum = HistoryPoint & {
  isUp: boolean;
};

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
          hour: "2-digit",
          minute: "2-digit",
        })
        .replace(",", "");

    case "1mo":
    case "3mo":
    case "6mo":
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    case "1y":
    case "2y":
    case "5y":
    case "10y":
    case "max":
      return date.toLocaleDateString("en-GB", {
        month: "short",
        year: "numeric",
      });

    default:
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  }
}

function formatPrice(value: number) {
  return `$${value.toFixed(2)}`;
}

function VolumeShape(props: any) {
  const { x, y, width, height, payload } = props;

  const fill = payload.close > payload.open ? GREEN(0.5) : RED(0.5);

  return (
    <rect x={x} y={y} width={width} height={height} fill={fill} rx={2} ry={2} />
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
      <Rectangle {...props} fill={fill} radius={1} />
    </g>
  );
}

function CustomTooltip({ active, payload, label, symbol }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const point = payload[0]?.payload as HistoryPoint | undefined;
  if (!point) return null;

  const isUp = point.close >= point.open;
  const colorClass = isUp ? "text-green-500" : "text-red-500";

  return (
    <div className="rounded-xl border bg-card/95 backdrop-blur-sm p-3 shadow-md text-xs space-y-1.5 min-w-52">
      <div className="font-semibold text-sm">{symbol}</div>
      <div className="text-muted-foreground">{formatTooltipLabel(label)}</div>
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
  const formattedData: CandleDatum[] = [...data]
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    .map((d) => ({
      ...d,
      isUp: d.close >= d.open,
    }));
  const defaultStartIndex = Math.max(0, formattedData.length - 40);
  const defaultEndIndex = Math.max(0, formattedData.length - 1);

  const candleBodyDataKey = (entry: HistoryPoint): [number, number] => [
    Math.min(entry.open, entry.close),
    Math.max(entry.open, entry.close),
  ];

  const brushStroke = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.18)";
  const brushFill = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.05)";

  return (
    <div className="w-full h-125 lg:h-116">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={formattedData}
          margin={{
            top: 8,
            right: 12,
            left: 12,
            bottom: 0,
          }}
          barGap="-100%"
          barCategoryGap={2}
        >
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.08)" />

          <XAxis
            dataKey="timestamp"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            // minTickGap={24}
            tickFormatter={(iso) => formatXAxisLabel(iso, period)}
          />

          <YAxis
            yAxisId="price"
            domain={([dataMin, dataMax]) => {
              const range = dataMax - dataMin;
              const padding = range * 0.35;
              return [dataMin - padding, dataMax];
            }}
            tickFormatter={(v) => `$${v.toFixed(0)}`}
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            orientation="right"
            type="number"
            allowDecimals={false}
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
            isAnimationActive={false}
          />

          <Bar
            yAxisId="volume"
            dataKey="volume"
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
            startIndex={defaultStartIndex}
            endIndex={defaultEndIndex}
            stroke={brushStroke}
            fill={brushFill}
            tickFormatter={() => ""}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
