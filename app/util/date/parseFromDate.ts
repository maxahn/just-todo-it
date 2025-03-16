import { format, isThisWeek, isToday, isTomorrow, parse } from "date-fns";
import { DUE_DATE_FORMAT } from "./FORMAT";

export function parseFromDateString(date: string) {
  return parse(date, DUE_DATE_FORMAT, new Date());
}

export function getHumanReadableDate(dateStr: string): string {
  const date = parseFromDateString(dateStr);
  console.log({
    date,
    isToday: isToday(date),
    isTomorrow: isTomorrow(date),
    isThisWeek: isThisWeek(date),
  });
  if (isToday(date)) {
    return "Today";
  }
  if (isTomorrow(date)) {
    return "Tomorrow";
  }
  if (isThisWeek(date)) {
    return format(date, "EEEE");
  }
  return format(date, "MMM d, yyyy");
}
