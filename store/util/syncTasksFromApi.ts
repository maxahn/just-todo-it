import { fetchAndFormatTasksFromApi } from "./fetchAndFormatTasksFromApi";
import { TASK_TABLE_ID } from "../index";
import { Store } from "tinybase/store";
import { sortByDueDateAndPriority } from "@/features/tasks/utils/sortTasks";

export async function syncTasksFromApi(store: Store) {
  const tasks = await fetchAndFormatTasksFromApi(sortByDueDateAndPriority);
  store.setTable(TASK_TABLE_ID, tasks);
}
