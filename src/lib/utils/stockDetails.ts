import type { StockInfoResponse } from "@/schemas/stock";

type NullableNumber = number | null | undefined;

export function hasNumber(value: NullableNumber): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function formatNumber(value: NullableNumber, maximumFractionDigits = 2) {
  if (!hasNumber(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits,
  }).format(value);
}

export function formatCurrency(
  value: NullableNumber,
  currency = "USD",
  maximumFractionDigits = 2,
) {
  if (!hasNumber(value)) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits,
    }).format(value);
  } catch {
    return `${currency} ${formatNumber(value, maximumFractionDigits)}`;
  }
}

export function formatCompactCurrency(value: NullableNumber, currency = "USD") {
  if (!hasNumber(value)) return "—";

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      notation: "compact",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${formatCompactNumber(value)}`;
  }
}

export function formatCompactNumber(value: NullableNumber) {
  if (!hasNumber(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Yahoo Finance generally provides ratio-style percentages as decimal values:
 * 0.153 becomes 15.30%.
 */
export function formatPercent(
  value: NullableNumber,
  options?: {
    alreadyPercentage?: boolean;
    signed?: boolean;
  },
) {
  if (!hasNumber(value)) return "—";

  const percentage = options?.alreadyPercentage ? value : value * 100;
  const sign = options?.signed && percentage > 0 ? "+" : "";

  return `${sign}${percentage.toFixed(2)}%`;
}

export function formatRatio(value: NullableNumber, maximumFractionDigits = 2) {
  if (!hasNumber(value)) return "—";

  return `${formatNumber(value, maximumFractionDigits)}x`;
}

export function formatPriceRange(
  low: NullableNumber,
  high: NullableNumber,
  currency = "USD",
) {
  if (!hasNumber(low) || !hasNumber(high)) return "—";

  return `${formatCurrency(low, currency)} – ${formatCurrency(high, currency)}`;
}

export function getCompanyLocation(stock: StockInfoResponse) {
  return [stock.city, stock.state, stock.country].filter(Boolean).join(", ");
}

export function getChiefExecutive(stock: StockInfoResponse) {
  const officers = stock.companyOfficers ?? [];

  return (
    officers.find((officer) =>
      officer.title?.toLowerCase().includes("chief executive"),
    ) ??
    officers.find((officer) => officer.title?.toLowerCase().includes("ceo")) ??
    officers[0]
  );
}

export function getPricePosition(
  currentPrice: NullableNumber,
  low: NullableNumber,
  high: NullableNumber,
) {
  if (
    !hasNumber(currentPrice) ||
    !hasNumber(low) ||
    !hasNumber(high) ||
    high <= low
  ) {
    return null;
  }

  return Math.min(
    100,
    Math.max(0, ((currentPrice - low) / (high - low)) * 100),
  );
}
