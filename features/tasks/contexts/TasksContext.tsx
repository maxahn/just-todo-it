import { syncTasksFromApi } from "@/store/util/syncTasksFromApi";
import { createContext, ProviderProps, useEffect, useState } from "react";
import { useStore, useValue } from "tinybase/ui-react";
import {
  COMPLETED_TASK_TABLE_ID,
  SESSION_TABLE_ID,
  SUB_SESSION_TABLE_ID,
  TASK_EXTRA_TABLE_ID,
  TASK_TABLE_ID,
} from "@/store";
import { useCompleteTaskMutation } from "../hooks/useCompleteTaskMutation";
import type {
  CompletedTask,
  Task,
  TaskExtraUpdate,
  TaskUpdate,
} from "../types";
import { useDeleteSubSessions } from "@/store/hooks/queries/useActiveSessionsQuery";

export interface TasksContextState {
  activeTaskId: string;
  activeSessionId: string;
  activeSubSessionId: string;
  isTimerPaused: boolean;
  setActiveTaskId: (id: string) => void;
  setActiveSessionId: (id: string) => void;
  setActiveSubSessionId: (id: string) => void;
  updateTask: (id: string, update: TaskUpdate) => void;
  updateTaskExtra: (id: string, update: TaskExtraUpdate) => void;
  completeTask: (id: string) => Promise<void>;
  startSession: (taskId: string, estimatedDuration?: number) => string[];
  startTask: (taskId: string, estimatedDuration?: number) => void;
  cancelSession: () => void;
  finishSession: () => void;
  getIsActive: () => boolean;
  toggleIsTaskPaused: () => void;
  getTotalSessionsDuration: () => number;
  removeSubSession: (id: string) => void;
  handleFetchAndSyncTasks: () => Promise<void>;
  isSyncing: boolean;
  isCompleting: boolean;
}

export const TasksContext = createContext<TasksContextState>({
  activeTaskId: "",
  activeSessionId: "",
  activeSubSessionId: "",
  isTimerPaused: false,
  setActiveTaskId: () => {},
  setActiveSessionId: () => {},
  setActiveSubSessionId: () => {},
  updateTask: () => {},
  updateTaskExtra: () => {},
  startSession: () => ["", ""],
  startTask: () => {},
  completeTask: async () => {},
  cancelSession: () => {},
  finishSession: () => {},
  getIsActive: () => false,
  toggleIsTaskPaused: () => {},
  getTotalSessionsDuration: () => 0,
  removeSubSession: () => {},
  handleFetchAndSyncTasks: async () => {},
  isSyncing: false,
  isCompleting: false,
});

export function TasksProvider(
  props: Omit<ProviderProps<TasksContextState>, "value">,
) {
  const [isSyncing, setIsSyncing] = useState(false);
  const store = useStore();
  const activeTaskId = useValue("activeTaskId") as string;
  // const isTimerPaused = useValue("isTimerPaused") as boolean;
  const activeSessionId = useValue("activeSessionId") as string;
  const activeSubSessionId = useValue("activeSubSessionId") as string;
  const { mutateAsync: completeTaskAsync, isPending: isCompleting } =
    useCompleteTaskMutation();
  const deleteSubSessions = useDeleteSubSessions(activeSessionId);

  const isTimerPaused = Boolean(activeSessionId) && !activeSubSessionId;
  // const tasksTable = useTable(TASK_TABLE_ID)

  const handleFetchAndSyncTasks = async () => {
    try {
      if (store) syncTasksFromApi(store);
    } finally {
      setIsSyncing(false);
    }
  };

  const setActiveTaskId = (id: string) => {
    store?.setValue("activeTaskId", id);
  };

  const setActiveSessionId = (id: string) => {
    store?.setValue("activeSessionId", id);
  };

  const setActiveSubSessionId = (id: string) => {
    store?.setValue("activeSubSessionId", id);
  };

  const updateTask = (id: string, update: TaskUpdate) => {
    store?.setPartialRow(TASK_TABLE_ID, id, update);
  };

  const updateTaskExtra = (id: string, update: TaskExtraUpdate) => {
    store?.setPartialRow(TASK_EXTRA_TABLE_ID, id, {
      taskId: id,
      ...update,
    });
  };

  const startSession = (taskId: string, estimatedDuration?: number) => {
    const sessionId = store?.addRow(SESSION_TABLE_ID, {
      taskId,
      estimatedDuration: estimatedDuration || 25,
    });
    if (!sessionId) throw new Error("Failed to start session");
    setActiveSessionId(sessionId);
    const subSessionId = startSubSession(sessionId);
    return [sessionId, subSessionId];
  };

  const startSubSession = (sessionId: string) => {
    const subSessionId = store?.addRow(SUB_SESSION_TABLE_ID, {
      sessionId,
      start: new Date().toISOString(),
    });
    if (!subSessionId) throw new Error("Failed to start sub session");
    setActiveSubSessionId(subSessionId);
    return subSessionId;
  };

  const finishSession = (subSessionId?: string) => {
    setActiveSessionId("");
    if (subSessionId || activeSubSessionId) {
      finishSubSession(subSessionId || activeSubSessionId);
    }
  };

  const finishSubSession = (subSessionId?: string) => {
    if (!activeSubSessionId && !subSessionId)
      throw new Error("No active sub session");
    store?.setPartialRow(
      SUB_SESSION_TABLE_ID,
      subSessionId || activeSubSessionId,
      {
        end: new Date().toISOString(),
      },
    );
    setActiveSubSessionId("");
  };

  const removeSubSession = (subSessionId: string) => {
    store?.delRow(SUB_SESSION_TABLE_ID, subSessionId);
  };

  const startTask = (taskId: string, estimatedDuration?: number) => {
    setActiveTaskId(taskId);
    startSession(taskId, estimatedDuration);
  };

  const completeTask = async (id: string) => {
    const completeTaskPromise = completeTaskAsync({ id });
    const updateTaskPromise = updateTask(id, { isCompleted: true });
    // TODO: create sub session on completeTask even if no session is active
    if (activeSessionId) {
      finishSession();
    } else {
      const [, subSessionId] = await startSession(id);
      finishSession(subSessionId);
    }
    const taskExtra = store?.getRow(TASK_EXTRA_TABLE_ID, id);
    const task: Partial<CompletedTask> = {
      ...(store?.getRow(TASK_TABLE_ID, id) as Task),
      lastCompletedAt: new Date().toISOString(),
    };
    if (taskExtra?.estimatedDuration) {
      task.estimatedDuration = taskExtra.estimatedDuration as number;
    }
    const addCompletedTaskPromise = store?.setPartialRow(
      COMPLETED_TASK_TABLE_ID,
      id,
      task,
    );
    setActiveTaskId("");
    await Promise.all([
      completeTaskPromise,
      updateTaskPromise,
      addCompletedTaskPromise,
    ]);
  };

  const cancelSession = () => {
    if (!activeSessionId) throw new Error("No active session");
    setActiveSessionId("");
    setActiveSubSessionId("");
    deleteSubSessions();
    store?.delRow(SESSION_TABLE_ID, activeSessionId);
  };

  const toggleIsTaskPaused = () => {
    if (!activeSessionId) throw new Error("No active session");
    if (isTimerPaused) {
      startSubSession(activeSessionId);
      return;
    }
    finishSubSession();
  };

  useEffect(() => {
    handleFetchAndSyncTasks();
  }, [store]);

  return (
    <TasksContext.Provider
      value={{
        isSyncing,
        isCompleting,
        activeTaskId,
        activeSessionId,
        activeSubSessionId,
        isTimerPaused,
        setActiveSessionId,
        setActiveTaskId,
        setActiveSubSessionId,
        updateTask,
        updateTaskExtra,
        startTask,
        completeTask,
        startSession,
        cancelSession,
        finishSession,
        getIsActive: () => false,
        toggleIsTaskPaused,
        getTotalSessionsDuration: () => 0,
        removeSubSession,
        handleFetchAndSyncTasks,
      }}
      {...props}
    />
  );
}
