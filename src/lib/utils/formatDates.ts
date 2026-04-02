export const formatDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function convertEpochToDate(epoch: number, timezone: string): string {
  const date = new Date(epoch * 1000);

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
    timeZoneName: "short",
  };

  // Format like: "Fri, 04 Nov 2025, 16:30 AEDT"
  const formatted = new Intl.DateTimeFormat("en-AU", options).format(date);

  // Clean up comma spacing to match "Fri, 04 Nov 2025 16:30 AEDT"
  return formatted.replace(",", "");
}

export function convertEpochToShortDate(
  epoch: number,
  timezone: string,
): string {
  const date = new Date(epoch * 1000);

  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: timezone,
  };

  // Example result: "04 Nov 2025"
  return new Intl.DateTimeFormat("en-AU", options).format(date);
}
