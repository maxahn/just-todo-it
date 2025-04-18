import { parseISO } from "date-fns";
import type { Session } from "../types";
import { Table } from "tinybase/store";

export function sumSessionsDurationTable(table: Table): number {
  let totalDuration = 0;
  for (const rowId in table) {
    const session = table[rowId] as Session;
    const { start, end } = session;
    const workingEnd = end || new Date().toISOString();
    const msDuration =
      parseISO(workingEnd).getTime() - parseISO(start).getTime();
    totalDuration += msDuration;
  }
  return Math.floor(totalDuration / 1000);
}

export function sumSessionsDuration(sessions: Session[]): number {
  return sessions.reduce((acc, session) => {
    const { start, end } = session;
    const workingEnd = end || new Date().toISOString();
    const msDuration =
      parseISO(workingEnd).getTime() - parseISO(start).getTime();
    return Math.floor((acc + msDuration) / 1000);
  }, 0);
}
