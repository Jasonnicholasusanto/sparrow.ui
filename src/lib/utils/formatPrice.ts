export const formatPrice = (v?: number) =>
  v == null
    ? ""
    : v.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

export function formatChange(value: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}`;
}

export function formatPercent(value: number | null) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }

  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}
