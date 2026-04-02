"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  CandlestickSeries,
  UTCTimestamp,
  HistogramSeries,
  type ISeriesApi,
} from "lightweight-charts";
import { HistoryPoint } from "@/schemas/stock";
import { PageMotion } from "@/components/layout/motion-wrapper";

interface CandlestickChartProps {
  data: HistoryPoint[];
  symbol?: string; // optional
}

export default function CandlestickChart({
  data,
  symbol = "STOCK",
}: CandlestickChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // -----------------------------
    // Create Chart
    // -----------------------------
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#ccc",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(197,203,206,0.2)" },
        horzLines: { color: "rgba(197,203,206,0.2)" },
      },
      timeScale: {
        borderColor: "#444",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
      },
    });

    chartRef.current = chart;

    // -----------------------------
    // Candlestick Series
    // -----------------------------
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "rgb(34, 195, 93)",
      borderUpColor: "rgb(34, 195, 93)",
      wickUpColor: "rgb(34, 195, 93)",
      downColor: "rgb(221, 60, 60)",
      borderDownColor: "rgb(221, 60, 60)",
      wickDownColor: "rgb(221, 60, 60)",
      borderVisible: false,
    });

    candleSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.2, bottom: 0.25 },
    });

    candleSeriesRef.current = candleSeries;

    // -----------------------------
    // Volume Series
    // -----------------------------
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
    });

    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.75, bottom: 0 },
    });

    // -----------------------------
    // Format Data
    // -----------------------------
    const candleData = data.map((d) => ({
      time: Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp,
      open: d.open,
      high: d.high,
      low: d.low,
      close: d.close,
    }));

    const volumeData = data.map((d) => ({
      time: Math.floor(new Date(d.timestamp).getTime() / 1000) as UTCTimestamp,
      value: d.volume,
      color: d.close >= d.open ? "rgba(34,195,93,0.5)" : "rgba(221,60,60,0.5)",
    }));

    candleSeries.setData(candleData);
    volumeSeries.setData(volumeData);

    // --------------------
    // Legend Setup
    // --------------------
    let legend = legendRef.current;

    if (!legend) {
      legend = document.createElement("div");
      legend.style.position = "absolute";
      legend.style.left = "12px";
      legend.style.top = "12px";
      legend.style.zIndex = "10";
      legend.style.pointerEvents = "none";
      legend.style.color = "white";
      legend.style.fontSize = "14px";
      legend.style.fontFamily = "Inter, sans-serif";
      legend.style.lineHeight = "18px";

      chartContainerRef.current.appendChild(legend);
      legendRef.current = legend; // store so it's only created once
    }

    // Used everywhere else
    const setLegend = (html: string) => {
      if (legendRef.current) {
        legendRef.current.innerHTML = html;
      }
    };

    // Helpers
    const formatPrice = (p: number) => p.toFixed(2);
    const formatDate = (utc: number) =>
      new Date(utc * 1000).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

    const getLastBar = () => candleData[candleData.length - 1];

    const renderLegend = (bar: any) => {
      const date = formatDate(bar.time);
      const price = bar.close;

      setLegend(`
            <div style="font-size: 20px; font-weight: 800; padding-bottom: 4px;">
                ${symbol}
            </div>
            <div style="font-size: 22px; margin: 4px 0; padding-bottom: 4px;">
                $${formatPrice(price)}
            </div>
            <div style="opacity: 0.8;">${date}</div>
        `);
    };

    // Initial legend on load
    renderLegend(getLastBar());

    // --------------------
    // Crosshair Legend Logic
    // --------------------
    chart.subscribeCrosshairMove((param: any) => {
      const insideChart =
        param?.point && param.point.x >= 0 && param.point.y >= 0;

      const candleAtCursor = param?.seriesData?.get(candleSeries);

      if (insideChart && candleAtCursor) {
        renderLegend(candleAtCursor);
      } else {
        renderLegend(getLastBar());
      }
    });

    // -----------------------------
    // Resize Listener
    // -----------------------------
    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({ width: chartContainerRef.current.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [data, symbol]);

  return (
    <div ref={chartContainerRef} className="relative w-full h-125 lg:h-116" />
  );
}
