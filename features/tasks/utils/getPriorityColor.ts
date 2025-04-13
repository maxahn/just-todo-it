import type { Priority } from "../types";

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 1:
      return "transparent";
    case 2:
      return "blue-500";
    case 3:
      return "orange-500";
    case 4:
      return "red-600";
      break;
    default:
      return "white";
  }
}
