import { isAfter } from "date-fns";
import { Task } from "../types";

export function sortByDueDateAndPriority(tasks: Task[]): Task[] {
  const sortedTasks = tasks.sort((a, b) => {
    const aDue = a.due;
    const bDue = b.due;
    // If both don't have a due date, sort by priority
    if (!aDue && !bDue) {
      return a.priority >= b.priority ? -1 : 1;
    }
    // If one has a due date and the other doesn't, sort by due date
    // TODO: need to have a threshold for this because it may be better to prioritize another task
    // if the due date is too far in the future
    if (aDue && !bDue) {
      return -1;
    } else if (!aDue && bDue) {
      return 1;
    }
    // If both have due dates, sort by due date
    if (aDue?.date && bDue?.date) {
      if (aDue.date === bDue.date) {
        return a.priority >= b.priority ? -1 : 1;
      }
      // console.log({ tasks, a, b });
      const aDueDatetime = aDue?.date;
      const bDueDatetime = bDue?.date;
      return isAfter(bDueDatetime, aDueDatetime) ? -1 : 1;
    }
    return -1;
  });
  return sortedTasks;
}
