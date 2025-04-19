import { SESSION_TABLE_ID, SUB_SESSION_TABLE_ID } from "@/store";
import { QUERY_ID } from "@/store/queries";
import { useMemo } from "react";
import {
  useQueries,
  useResultSortedRowIds,
  useResultTable,
  useRow,
  useStore,
} from "tinybase/ui-react";

export function useActiveSessionsQuery(taskId: string) {
  const queries = useQueries();
  if (!queries)
    throw new Error("Please call within a TinyBaseProvider with queries");
  return useMemo(() => {
    const queryId = `${QUERY_ID.activeTaskSessions}_${taskId}`;
    queries.setQueryDefinition(
      queryId,
      SUB_SESSION_TABLE_ID,
      ({ select, where, join }) => {
        select(SUB_SESSION_TABLE_ID, "start");
        select(SUB_SESSION_TABLE_ID, "end");
        select(SUB_SESSION_TABLE_ID, "sessionId");
        select(SUB_SESSION_TABLE_ID, "distractionCount");
        select(SUB_SESSION_TABLE_ID, "taskCompleted");
        select(SESSION_TABLE_ID, "taskId");
        join(SESSION_TABLE_ID, "sessionId");
        where(SESSION_TABLE_ID, "taskId", taskId);
      },
    );
    return queryId;
  }, [queries, taskId]);
}

export function useActiveSubSessionsQuery(sessionId: string) {
  const queries = useQueries();
  if (!queries)
    throw new Error("Please call within a TinyBaseProvider with queries");
  return useMemo(() => {
    const queryId = `${QUERY_ID.activeTaskSubSessions}_${sessionId}`;
    queries.setQueryDefinition(
      queryId,
      SUB_SESSION_TABLE_ID,
      ({ select, where }) => {
        select("id");
        select("start");
        select("end");
        select("distractionCount");
        select("taskCompleted");
        where("sessionId", sessionId);
      },
    );
    return queryId;
  }, [queries, sessionId]);
}

export function useActiveTaskSessionsTable(taskId: string) {
  const activeTaskSessionsQueryId = useActiveSessionsQuery(taskId);
  const activeTaskSessions = useResultTable(activeTaskSessionsQueryId);
  //   const activeTaskSubSessionsQueryId = useActiveSubSessionsQuery(taskId);
  //   const activeTaskSubSessions = useResultTable(activeTaskSubSessionsQueryId);
  console.log({
    activeTaskSessionsQueryId,
    activeTaskSessions,
    // activeTaskSubSessions,
  });
  //   return activeTaskSubSessions;
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

export function useDeleteSubSessions(sessionId: string) {
  const subSessions = useActiveSubSessionsQuery(sessionId);
  const store = useStore();
  const subSessionsTable = useResultTable(subSessions);

  function deleteSubSessions() {
    for (const subSessionId in subSessionsTable) {
      store?.delRow(SUB_SESSION_TABLE_ID, subSessionId);
    }
  }
  return deleteSubSessions;
}
