import { syncTasksFromApi } from "@/store/util/syncTasksFromApi";
import { createContext, ProviderProps, useEffect, useState } from "react";
import { useStore, useValue } from "tinybase/ui-react";
import { SESSION_TABLE_ID, TASK_EXTRA_TABLE_ID, TASK_TABLE_ID } from "@/store";
import { useCompleteTaskMutation } from "../hooks/useCompleteTaskMutation";
import type { TaskExtraUpdate, TaskUpdate } from "../types";

export interface TasksContextState {
  activeTaskId: string;
  activeSessionId: string;
  isTimerPaused: boolean;
  setActiveTaskId: (id: string) => void;
  setActiveSessionId: (id: string) => void;
  setIsTimerPaused: (paused: boolean) => void;
  updateTask: (id: string, update: TaskUpdate) => void;
  updateTaskExtra: (id: string, update: TaskExtraUpdate) => void;
  completeTask: (id: string) => Promise<void>;
  startSession: (taskId: string) => void;
  cancelSession: () => void;
  finishSession: () => void;
  getIsActive: () => boolean;
  toggleIsTaskPaused: (taskId: string) => void;
  getTotalSessionsDuration: () => number;
  removeSession: (index: number) => void;
  handleFetchAndSyncTasks: () => Promise<void>;
  isSyncing: boolean;
  isCompleting: boolean;
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
  completeTask: async () => {},
  cancelSession: () => {},
  finishSession: () => {},
  getIsActive: () => false,
  toggleIsTaskPaused: () => {},
  getTotalSessionsDuration: () => 0,
  removeSession: () => {},
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
  const isTimerPaused = useValue("isTimerPaused") as boolean;
  const activeSessionId = useValue("activeSessionId") as string;
  const { mutateAsync: completeTaskAsync, isPending: isCompleting } =
    useCompleteTaskMutation();
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

  const completeTask = async (id: string) => {
    if (!id) throw new Error("No active task");
    // TODO: refactor to sync local and remote data
    const completeTaskPromise = completeTaskAsync({ id });
    const updateTaskPromise = updateTask(id, { isCompleted: true });
    if (activeSessionId) {
      finishSession();
    }
    setActiveTaskId("");
    setActiveSessionId("");
    await Promise.all([completeTaskPromise, updateTaskPromise]);
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
        isCompleting,
        activeTaskId,
        activeSessionId,
        isTimerPaused,
        setActiveSessionId,
        setIsTimerPaused,
        setActiveTaskId,
        updateTask,
        updateTaskExtra,
        completeTask,
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
