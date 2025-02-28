import { parse } from "date-fns";
import { DUE_DATE_FORMAT } from "./FORMAT";

export function parseFromDateString(date: string) {
  return parse(date, DUE_DATE_FORMAT, new Date());
}
