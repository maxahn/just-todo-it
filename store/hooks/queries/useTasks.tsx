import { TASK_EXTRA_TABLE_ID, TASK_TABLE_ID } from "@/store";
import { QUERY_ID } from "@/store/queries";
import { useEffect } from "react";
import { GetTableCell } from "tinybase/queries";
import { useQueries, useResultSortedRowIds } from "tinybase/ui-react";

export function useIncompleteTasksQuery() {
  const queries = useQueries();

  const queryId = QUERY_ID.incompleteTasks;

  useEffect(() => {
    if (!queries)
      throw new Error("Please call within a TinyBaseProvider with queries");
    queries.setQueryDefinition(queryId, TASK_TABLE_ID, ({ select, where }) => {
      select("id");
      select("order");
      select("content");
      select("description");
      select("dueDate");
      select("dueIsRecurring");
      select("dueTimezone");
      select("priority");
      select("url");
      select("createdAt");
      select("projectId");
      select("sectionId");
      select("parentId");
      select("assigneeId");
      select("assignerId");
      where("isCompleted", false);
    });
  }, [queries, queryId]);

  return queryId;
}

export function useSortedIncompleteUnskippedTasks() {
  const queries = useQueries();

  const queryId = QUERY_ID.incompleteUnskippedTasks;

  useEffect(() => {
    if (!queries)
      throw new Error("Please call within a TinyBaseProvider with queries");
    queries.setQueryDefinition(
      queryId,
      TASK_TABLE_ID,
      ({ select, where, join }) => {
        select(TASK_EXTRA_TABLE_ID, "skip");
        select(TASK_EXTRA_TABLE_ID, "taskId");
        select(TASK_TABLE_ID, "id");
        select(TASK_TABLE_ID, "order");
        select(TASK_TABLE_ID, "isCompleted");
        join(TASK_EXTRA_TABLE_ID, "id");
        where(TASK_TABLE_ID, "isCompleted", false);
        where((getTableCell: GetTableCell) => {
          const skip = getTableCell(TASK_EXTRA_TABLE_ID, "skip");
          return !skip;
        });
      },
    );
  }, [queries, queryId]);

  return queryId;
}

export const useSortedIncompleteTaskIds = () => {
  const queryId = useIncompleteTasksQuery();
  const sortedTaskIds = useResultSortedRowIds(queryId, "order", false);
  return sortedTaskIds;
};

export const useSortedIncompleteUnskippedTaskIds = () => {
  const queryId = useSortedIncompleteUnskippedTasks();
  const sortedTaskIds = useResultSortedRowIds(queryId, "order", false);
  return sortedTaskIds;
};
