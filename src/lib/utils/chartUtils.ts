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
  const [datePart, timePartWithOffset] = iso.split("T");

  if (!datePart || !timePartWithOffset) {
    return iso;
  }

  const [year, month, day] = datePart.split("-");
  const timePart = timePartWithOffset.slice(0, 5);

  const monthLabel = new Intl.DateTimeFormat("en-GB", {
    month: "short",
  }).format(new Date(Number(year), Number(month) - 1, Number(day)));

  switch (period) {
    case "1d":
    case "5d":
    case "1wk":
    case "1w":
      return `${day} ${monthLabel} ${timePart}`;

    case "1mo":
    case "3mo":
    case "6mo":
      return `${day} ${monthLabel} ${year}`;

    case "1y":
    case "2y":
    case "5y":
    case "10y":
    case "max":
      return `${monthLabel} ${year}`;

    default:
      return `${day} ${monthLabel} ${year}`;
  }
}
