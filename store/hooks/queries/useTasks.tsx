import { TASK_TABLE_ID } from "@/store";
import { QUERY_ID } from "@/store/queries";
import { useMemo } from "react";
import { useQueries, useResultSortedRowIds } from "tinybase/ui-react";

export function useIncompleteTasksQuery() {
  const queries = useQueries();
  if (!queries)
    throw new Error("Please call within a TinyBaseProvider with queries");
  return useMemo(() => {
    const queryId = QUERY_ID.incompleteTasks;
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
    return queryId;
  }, [queries]);
}

export const useSortedIncompleteTasks = () => {
  const queryId = useIncompleteTasksQuery();
  const sortedTaskIds = useResultSortedRowIds(queryId, "order", false);
  return sortedTaskIds;
};
