export function formatTooltipLabel(iso: string) {
  const [datePart, timeAndOffset] = iso.split("T");
  const [timePart] = timeAndOffset.split(/[+-]/); // strip timezone offset
  const [year, month, day] = datePart.split("-");
  const [hour, minute] = timePart.split(":");

  const d = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  const weekday = d.toLocaleDateString("en-GB", {
    weekday: "short",
    timeZone: "UTC",
  });
  const monthShort = d.toLocaleDateString("en-GB", {
    month: "short",
    timeZone: "UTC",
  });

  return `${weekday} ${Number(day)} ${monthShort} ${year} ${hour}:${minute}`;
}
