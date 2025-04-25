import { authenticatedFetch } from "@/features/authentication/util/authenticatedFetch";
import type { Task, TodoistTask } from "@/features/tasks/types";
import { Row, Table } from "tinybase/store";

function formatTask(task: TodoistTask): Task {
  return {
    id: task.id,
    content: task.content,
    description: task.description,
    isCompleted: task.is_completed,
    dueDate: task.due?.date,
    dueIsRecurring: task.due?.is_recurring ?? false,
    dueTimezone: task.due?.timezone,
    priority: task.priority,
    url: task.url,
    createdAt: task.created_at,
    projectId: task.project_id,
    sectionId: task.section_id ?? undefined,
    parentId: task.parent_id ?? undefined,
    order: task.order,
    assigneeId: task.assignee_id ?? undefined,
    assignerId: task.assigner_id ?? undefined,
    commentCount: task.comment_count,
  };
}

export async function fetchAndFormatTasksFromApi(
  sort?: (tasks: TodoistTask[]) => TodoistTask[],
) {
  const tasks = (await authenticatedFetch<TodoistTask[]>(`/tasks`)) ?? [];
  const sortedTasks = sort ? sort(tasks) : tasks;
  const rows: Table = sortedTasks.reduce((acc, task, index) => {
    const formattedTask = formatTask(task);
    acc[formattedTask.id] = formattedTask as Row;
    acc[formattedTask.id].order = index;
    return acc;
  }, {} as Table);
  return rows;
}
