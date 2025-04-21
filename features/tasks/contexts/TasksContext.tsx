import { syncTasksFromApi } from "@/store/util/syncTasksFromApi";
import { createContext, ProviderProps, useEffect, useState } from "react";
import { useStore, useValue } from "tinybase/ui-react";
import {
  SESSION_TABLE_ID,
  SUB_SESSION_TABLE_ID,
  TASK_EXTRA_TABLE_ID,
  TASK_TABLE_ID,
} from "@/store";
import { useCompleteTaskMutation } from "../hooks/useCompleteTaskMutation";
import type { TaskExtraUpdate, TaskUpdate } from "../types";
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
  startSession: (taskId: string) => void;
  startTask: (taskId: string) => void;
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
  startSession: () => {},
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
    store?.setPartialRow(TASK_EXTRA_TABLE_ID, id, update);
  };

  const startSession = (taskId: string) => {
    const sessionId = store?.addRow(SESSION_TABLE_ID, {
      taskId,
    });
    if (!sessionId) throw new Error("Failed to start session");
    setActiveSessionId(sessionId);
    startSubSession(sessionId);
    return sessionId;
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

  const finishSession = () => {
    if (!activeSessionId) throw new Error("No active session");
    if (!activeSubSessionId) throw new Error("No active sub session");
    setActiveSessionId("");
    finishSubSession();
  };

  const finishSubSession = () => {
    if (!activeSubSessionId) throw new Error("No active sub session");
    store?.setPartialRow(SUB_SESSION_TABLE_ID, activeSubSessionId, {
      end: new Date().toISOString(),
    });
    setActiveSubSessionId("");
  };

  const removeSubSession = (subSessionId: string) => {
    store?.delRow(SUB_SESSION_TABLE_ID, subSessionId);
  };

  const startTask = (taskId: string) => {
    setActiveTaskId(taskId);
    startSession(taskId);
  };

  const completeTask = async (id: string) => {
    const completeTaskPromise = completeTaskAsync({ id });
    const updateTaskPromise = updateTask(id, { isCompleted: true });
    if (activeSessionId) {
      finishSession();
    }
    setActiveTaskId("");
    await Promise.all([completeTaskPromise, updateTaskPromise]);
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
