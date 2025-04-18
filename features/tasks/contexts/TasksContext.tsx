import { syncTasksFromApi } from "@/store/util/syncTasksFromApi";
import { Session, TaskExtraUpdate, TaskUpdate } from "../types";
import { createContext, ProviderProps, useEffect, useState } from "react";
import { useStore, useTable, useValue } from "tinybase/ui-react";
import { SESSION_TABLE_ID, TASK_EXTRA_TABLE_ID, TASK_TABLE_ID } from "@/store";

export interface TasksContextState {
  activeTaskId: string;
  activeSessionId: string;
  isTimerPaused: boolean;
  setActiveTaskId: (id: string) => void;
  setActiveSessionId: (id: string) => void;
  setIsTimerPaused: (paused: boolean) => void;
  updateTask: (id: string, update: TaskUpdate) => void;
  updateTaskExtra: (id: string, update: TaskExtraUpdate) => void;
  startSession: (taskId: string) => void;
  cancelSession: () => void;
  finishSession: () => void;
  getIsActive: () => boolean;
  toggleIsTaskPaused: (taskId: string) => void;
  getTotalSessionsDuration: () => number;
  removeSession: (index: number) => void;
  handleFetchAndSyncTasks: () => Promise<void>;
  isSyncing: boolean;
}

export const TasksContext = createContext<TasksContextState>({
  activeTaskId: "",
  activeSessionId: "",
  isTimerPaused: false,
  setActiveTaskId: () => {},
  setActiveSessionId: () => {},
  setIsTimerPaused: () => {},
  updateTask: () => {},
  updateTaskExtra: () => {},
  startSession: () => {},
  cancelSession: () => {},
  finishSession: () => {},
  getIsActive: () => false,
  toggleIsTaskPaused: () => {},
  getTotalSessionsDuration: () => 0,
  removeSession: () => {},
  handleFetchAndSyncTasks: async () => {},
  isSyncing: false,
});

export function TasksProvider(
  props: Omit<ProviderProps<TasksContextState>, "value">,
) {
  const [isSyncing, setIsSyncing] = useState(false);
  const store = useStore();
  const activeTaskId = useValue("activeTaskId") as string;
  const isTimerPaused = useValue("isTimerPaused") as boolean;
  const activeSessionId = useValue("activeSessionId") as string;
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

  const setIsTimerPaused = (paused: boolean) => {
    store?.setValue("isTimerPaused", paused);
  };

  const updateTask = (id: string, update: TaskUpdate) => {
    store?.setPartialRow(TASK_TABLE_ID, id, update);
  };

  const updateTaskExtra = (id: string, update: TaskExtraUpdate) => {
    store?.setPartialRow(TASK_EXTRA_TABLE_ID, id, update);
  };

  const startSession = (taskId: string) => {
    console.log({ store });
    const sessionId = store?.addRow(SESSION_TABLE_ID, {
      taskId,
      start: new Date().toISOString(),
    });
    if (!sessionId) throw new Error("Failed to start session");
    store?.setValue("activeSessionId", sessionId);
    return sessionId;
  };
  const finishSession = () => {
    if (!activeSessionId) throw new Error("No active session");
    return store?.setPartialRow(SESSION_TABLE_ID, activeSessionId, {
      end: new Date().toISOString(),
    });
  };

  const cancelSession = () => {
    if (!activeSessionId) throw new Error("No active session");
    setActiveSessionId("");
    return store?.delRow(SESSION_TABLE_ID, activeSessionId);
  };

  const toggleIsTaskPaused = (taskId: string) => {
    const isTimerPaused = store?.getValue("isTimerPaused");
    if (isTimerPaused) {
      const sessionId = startSession(taskId);
      if (!sessionId) throw new Error("Failed to start session");
      store?.setValue("isTimerPaused", false);
      store?.setValue("activeSessionId", sessionId);
      return;
    }
    const activeSessionId = store?.getValue("activeSessionId") as string;
    if (!activeSessionId) throw new Error("No active session");
    store?.setPartialRow(SESSION_TABLE_ID, activeSessionId, {
      end: new Date().toISOString(),
    });
    store?.setValue("isTimerPaused", true);
  };

  useEffect(() => {
    handleFetchAndSyncTasks();
  }, [store]);

  return (
    <TasksContext.Provider
      value={{
        isSyncing,
        activeTaskId,
        activeSessionId,
        isTimerPaused,
        setActiveSessionId,
        setIsTimerPaused,
        setActiveTaskId,
        updateTask,
        updateTaskExtra,
        startSession,
        cancelSession,
        finishSession,
        getIsActive: () => false,
        toggleIsTaskPaused,
        getTotalSessionsDuration: () => 0,
        removeSession: () => {},
        handleFetchAndSyncTasks,
      }}
      {...props}
    />
  );
}
