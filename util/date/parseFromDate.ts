import {
  Day,
  endOfWeek,
  format,
  getDay,
  isThisWeek,
  isToday,
  isTomorrow,
  isWithinInterval,
  parse,
  startOfWeek,
} from "date-fns";
import { DUE_DATE_FORMAT } from "./FORMAT";

export function parseFromDateString(date: string) {
  return parse(date, DUE_DATE_FORMAT, new Date());
}

export function getHumanReadableDate(dateStr: string): string {
  const date = parseFromDateString(dateStr);
  if (isToday(date)) {
    return "Today";
  }
  if (isTomorrow(date)) {
    return "Tomorrow";
  }
  const day = getDay(new Date()) as Day;
  if (isThisWeek(date, { weekStartsOn: day })) {
    return format(date, "EEEE");
  }
  return format(date, "MMM d, yyyy");
}

export const START_OF_WEEK_DAY = 0;
export function isLastWeek(date: Date) {
  const start = startOfWeek(date, { weekStartsOn: START_OF_WEEK_DAY });
  const end = endOfWeek(date, { weekStartsOn: START_OF_WEEK_DAY });
  return isWithinInterval(date, { start, end });
}
