import { format } from "date-fns";
import { DUE_DATE_FORMAT } from "./FORMAT";

export function isToday(date: string) {
  const today = format(new Date(), DUE_DATE_FORMAT);
  return date === today;
}
