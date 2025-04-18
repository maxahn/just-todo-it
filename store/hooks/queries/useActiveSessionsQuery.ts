import { SESSION_TABLE_ID } from "@/store";
import { QUERY_ID } from "@/store/queries";
import { useMemo } from "react";
import {
  useQueries,
  useResultSortedRowIds,
  useResultTable,
  useRow,
} from "tinybase/ui-react";

export function useActiveSessionsQuery(taskId: string) {
  const queries = useQueries();
  if (!queries)
    throw new Error("Please call within a TinyBaseProvider with queries");
  return useMemo(() => {
    const queryId = `${QUERY_ID.activeTaskSessions}_${taskId}`;
    queries.setQueryDefinition(
      queryId,
      SESSION_TABLE_ID,
      ({ select, where }) => {
        select("taskId");
        select("start");
        select("end");
        select("distractionCount");
        where("taskId", taskId);
      },
    );
    return queryId;
  }, [queries, taskId]);
}

export function useActiveTaskSessionsTable(taskId: string) {
  const activeTaskSessionsQueryId = useActiveSessionsQuery(taskId);
  const activeTaskSessions = useResultTable(activeTaskSessionsQueryId);
  return activeTaskSessions;
}

export function useActiveTaskSessionIds(taskId: string) {
  const activeTaskSessionsQueryId = useActiveSessionsQuery(taskId);
  const activeTaskSessionIds = useResultSortedRowIds(
    activeTaskSessionsQueryId,
    "start",
    false,
  );
  return activeTaskSessionIds;
}

export function useLatestActiveTaskSession(taskId: string) {
  const activeTaskSessionIds = useActiveTaskSessionIds(taskId);
  const activeTaskSession = useRow(SESSION_TABLE_ID, activeTaskSessionIds[0]);
  return activeTaskSession;
}
