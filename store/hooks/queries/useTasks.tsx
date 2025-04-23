import { CompletedTask } from "@/features/tasks/types";
import {
  COMPLETED_TASK_TABLE_ID,
  SUB_SESSION_TABLE_ID,
  SESSION_TABLE_ID,
  TASK_EXTRA_TABLE_ID,
  TASK_TABLE_ID,
} from "@/store";
import { QUERY_ID } from "@/store/queries";
import { isLastWeek, START_OF_WEEK_DAY } from "@/util/date/parseFromDate";
import {
  isThisMonth,
  isThisWeek,
  isThisYear,
  isToday,
  isYesterday,
  parseISO,
} from "date-fns";
import { useEffect, useMemo } from "react";
import { GetTableCell } from "tinybase/queries";
import {
  useQueries,
  useResultSortedRowIds,
  useResultTable,
} from "tinybase/ui-react";

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

export type TimestampFilter =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "thisYear";

const TimestampFilterFunctions: Record<
  TimestampFilter,
  (timestamp: string) => boolean
> = {
  today: (timestamp: string) => isToday(new Date(timestamp)),
  yesterday: (timestamp: string) => isYesterday(new Date(timestamp)),
  thisWeek: (timestamp: string) =>
    isThisWeek(new Date(timestamp), { weekStartsOn: START_OF_WEEK_DAY }),
  lastWeek: (timestamp: string) => isLastWeek(new Date(timestamp)),
  thisMonth: (timestamp: string) => isThisMonth(new Date(timestamp)),
  thisYear: (timestamp: string) => isThisYear(new Date(timestamp)),
};

export function useCompletedTaskSessionsQueryId(filterType?: TimestampFilter) {
  const queries = useQueries();
  const queryId = `${QUERY_ID.tasksCompleted}_${filterType || ""}`;

  useEffect(() => {
    if (!queries)
      throw new Error("Please call within a TinyBaseProvider with queries");
    queries.setQueryDefinition(
      queryId,
      SUB_SESSION_TABLE_ID,
      ({ select, where, join }) => {
        select(COMPLETED_TASK_TABLE_ID, "createdAt");
        select(COMPLETED_TASK_TABLE_ID, "content");
        select(COMPLETED_TASK_TABLE_ID, "description");
        select(COMPLETED_TASK_TABLE_ID, "dueDate");
        select(COMPLETED_TASK_TABLE_ID, "dueIsRecurring");
        select(COMPLETED_TASK_TABLE_ID, "dueTimezone");
        select(COMPLETED_TASK_TABLE_ID, "priority");
        select(COMPLETED_TASK_TABLE_ID, "url");
        select(COMPLETED_TASK_TABLE_ID, "projectId");
        select(COMPLETED_TASK_TABLE_ID, "sectionId");
        select(COMPLETED_TASK_TABLE_ID, "lastCompletedAt");
        select(SUB_SESSION_TABLE_ID, "start");
        select(SUB_SESSION_TABLE_ID, "end");
        select(SUB_SESSION_TABLE_ID, "distractionCount");
        select(SUB_SESSION_TABLE_ID, "taskCompleted");
        select(SUB_SESSION_TABLE_ID, "sessionId");
        select(SESSION_TABLE_ID, "taskId");
        select(SESSION_TABLE_ID, "estimatedDuration");
        select(SESSION_TABLE_ID, "notes");
        select((getTableCell: GetTableCell) => {
          const start = getTableCell(SUB_SESSION_TABLE_ID, "start") as
            | string
            | undefined;
          const end = getTableCell(SUB_SESSION_TABLE_ID, "end") as
            | string
            | undefined;
          if (!end || !start) return 0;
          const msDuration =
            parseISO(end).getTime() - parseISO(start).getTime();
          return Math.floor(msDuration / 1000);
        }).as("durationInSeconds");

        if (filterType && TimestampFilterFunctions[filterType]) {
          where((getTableCell: GetTableCell) => {
            const lastCompletedAt = getTableCell(
              COMPLETED_TASK_TABLE_ID,
              "lastCompletedAt",
            );
            return (
              !!lastCompletedAt &&
              TimestampFilterFunctions[filterType](lastCompletedAt as string)
            );
          });
        }
        join(SESSION_TABLE_ID, "sessionId");
        join(COMPLETED_TASK_TABLE_ID, SESSION_TABLE_ID, "taskId");
      },
    );
  }, [queries, queryId]);

  return queryId;
}

// Grouping by sessionId & aggregating durationInSeconds
// Table: <taskId, CompletedTask>
export const useCompletedTasksTable = (filterType?: TimestampFilter) => {
  const queryId = useCompletedTaskSessionsQueryId(filterType);
  const completedTaskSessionsTable = useResultTable(queryId);
  return useMemo(() => {
    const completedTasks: Record<string, CompletedTask> = {};
    for (const id in completedTaskSessionsTable) {
      const taskSession = completedTaskSessionsTable[id] as CompletedTask;
      const existingSession = completedTasks[taskSession.taskId];
      if (existingSession) {
        const existingDuration = existingSession.durationInSeconds || 0;
        completedTasks[taskSession.taskId] = {
          ...taskSession,
          durationInSeconds:
            existingDuration + (taskSession.durationInSeconds || 0),
        };
        continue;
      }
      completedTasks[taskSession.taskId] = taskSession;
    }
    return completedTasks;
  }, [filterType]);
};

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
