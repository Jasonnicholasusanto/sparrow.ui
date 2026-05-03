export function formatTooltipLabel(iso: string, period?: string) {
  const [datePart] = iso.split("T");
  const [year, month, day] = datePart.split("-");

  const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const weekday = d.toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  });

  const formattedDate = formatXAxisLabel(iso, period);

  return `${weekday} ${formattedDate}`;
}

export function formatXAxisLabel(iso: string, period?: string) {
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
