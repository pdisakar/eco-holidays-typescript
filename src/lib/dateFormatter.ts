type FormatOption =
  | "dd-mm-yy"
  | "dd-mm-yyyy"
  | "Do, MMM, YYYY"
  | "YYYY-mm-dd"
  | "YYYY-MM-DD"
  | "MMM Do YYYY"
  | "custom";

export function formatDate(
  inputDate: string | number | Date,
  format: FormatOption | string = "dd-mm-yy"
): string {
  const date = new Date(inputDate);
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = date.getDate();
  const month = date.getMonth(); // 0-indexed
  const year = date.getFullYear();

  const pad = (n: number) => String(n).padStart(2, "0");

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  const getOrdinal = (n: number): string => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const map: Record<string, string> = {
    "dd": pad(day),
    "DD": pad(day),
    "mm": pad(month + 1),
    "MM": pad(month + 1),
    "yy": String(year).slice(-2),
    "yyyy": String(year),
    "Do": getOrdinal(day),
    "MMM": months[month],
    "YYYY": String(year),
  };

  const replaceTokens = (fmt: string): string =>
    fmt.replace(/\b(dd|DD|mm|MM|yy|yyyy|Do|MMM|YYYY)\b/g, (match) => map[match]);

  return replaceTokens(format);
}

export function adjustDate(date: Date, days: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + days);
  return newDate;
}
