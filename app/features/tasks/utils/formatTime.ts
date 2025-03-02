import { format, parseISO } from "date-fns";

const SESSION_DATE_FORMAT = "h:mm a";

export function secondsToFormattedTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const remainingSeconds = String(seconds % 60).padStart(2, "0");
  return `${hours ? String(hours).padStart(2, "0") : ""}:${minutes}:${remainingSeconds}`;
}
export const formatSession = (session: [string, string | null]) => {
  const [start, end] = session;
  const formattedStartDate = format(parseISO(start), "MMM d");
  const formattedEndDate = end ? format(parseISO(end), "MMM d") : "";
  return `${formattedStartDate} ${format(parseISO(start), SESSION_DATE_FORMAT)} - ${
    end
      ? `${formattedStartDate !== formattedEndDate ? formattedEndDate : ""}${format(parseISO(end), SESSION_DATE_FORMAT)}`
      : "In Progress"
  }`;
};
