import { syncTasksFromApi } from "@/store/util/syncTasksFromApi";
import { Session, TaskUpdate } from "../types";
import { createContext, ProviderProps, useEffect, useState } from "react";
import { useStore, useValue } from "tinybase/ui-react";
import { TASK_TABLE_ID } from "@/store";

export interface TasksContextState {
  activeTaskId: string;
  setActiveTaskId: (id: string) => void;
  updateTask: (id: string, update: TaskUpdate) => void;
  clearSessions: () => void;
  getIsActive: () => boolean;
  sessions: Session[];
  toggleIsTaskPaused: () => void;
  getTotalSessionsDuration: () => number;
  removeSession: (index: number) => void;
  handleFetchAndSyncTasks: () => Promise<void>;
  isSyncing: boolean;
}

export const TasksContext = createContext<TasksContextState>({
  activeTaskId: "",
  setActiveTaskId: () => {},
  updateTask: () => {},
  clearSessions: () => {},
  getIsActive: () => false,
  sessions: [],
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
  const activeTaskId = useValue("activeTaskId");
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

  const updateTask = (id: string, update: TaskUpdate) => {
    store?.setPartialRow(TASK_TABLE_ID, id, update);
  };

  useEffect(() => {
    handleFetchAndSyncTasks();
  }, [store]);

  return (
    <TasksContext.Provider
      value={{
        isSyncing,
        activeTaskId: activeTaskId as string,
        setActiveTaskId,
        updateTask,
        clearSessions: () => {},
        getIsActive: () => false,
        sessions: [],
        toggleIsTaskPaused: () => {},
        getTotalSessionsDuration: () => 0,
        removeSession: () => {},
        handleFetchAndSyncTasks,
      }}
      {...props}
    />
  );
}
