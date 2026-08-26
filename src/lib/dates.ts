export const TIMEZONE = "Africa/Lagos";

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function dayName(index: number) {
  return DAY_NAMES[index] ?? "Sunday";
}

export function formatLongDate(value: string | Date | null | undefined) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  });
}

export function formatShortDate(value: string | Date | null | undefined) {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIMEZONE,
  });
}

export function formatTime(value?: string | null) {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h)) return value;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m || 0).padStart(2, "0")} ${suffix}`;
}

/** Next occurrence (ISO string) of a schedule entry, based on frequency rules. */
export function nextOccurrence(
  schedule: { dayOfWeek: number; startTime: string; frequency: string },
  from = new Date(),
): Date {
  const [hh, mm] = schedule.startTime.split(":").map(Number);
  const matches = (d: Date) => {
    if (d.getDay() !== schedule.dayOfWeek) return false;
    const nth = Math.ceil(d.getDate() / 7);
    const isLast = d.getDate() + 7 > daysInMonth(d.getFullYear(), d.getMonth());
    switch (schedule.frequency) {
      case "weekly":
        return true;
      case "first_dow":
        return nth === 1;
      case "second_last":
        return nth === 2 || isLast;
      case "last_dow":
        return isLast;
      default:
        return true;
    }
  };

  for (let i = 0; i < 400; i++) {
    const d = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i, hh || 0, mm || 0, 0, 0);
    if (d.getTime() <= from.getTime()) continue;
    if (matches(d)) return d;
  }
  return new Date(from.getTime() + 7 * 86400000);
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** DOXA: last Monday of October -> first Friday of December */
export function doxaDates(year = new Date().getFullYear()) {
  const oct = new Date(year, 9, 31);
  while (oct.getDay() !== 1) oct.setDate(oct.getDate() - 1);
  const dec = new Date(year, 11, 1);
  while (dec.getDay() !== 5) dec.setDate(dec.getDate() + 1);
  return { start: oct, end: dec };
}

export function operation77Dates(year = new Date().getFullYear()) {
  return { start: new Date(year, 6, 1), end: new Date(year, 6, 7) };
}

/** Operation Settle Me By Mercy: last day of a month + first two days of next */
export function settleMeDates(year: number, monthIndex: number) {
  const start = new Date(year, monthIndex + 1, 0);
  const end = new Date(year, monthIndex + 1, 2);
  return { start, end };
}

export function toISODate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

export type EventStatusLabel = "Upcoming" | "Happening Today" | "Live Now" | "Completed";

export function classifyEvent(startDate: string, endDate?: string | null): EventStatusLabel {
  const today = toISODate(new Date());
  const end = endDate || startDate;
  if (end < today) return "Completed";
  if (startDate <= today && today <= end) return "Happening Today";
  return "Upcoming";
}
