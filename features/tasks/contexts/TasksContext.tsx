import { syncTasksFromApi } from "@/store/util/syncTasksFromApi";
import { Session } from "../types";
import { createContext, ProviderProps, useEffect, useState } from "react";
import { useStore } from "tinybase/ui-react";

export interface TasksContextState {
  activeTaskId: string | undefined;
  setActiveTaskId: (id: string | undefined) => void;
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
  activeTaskId: undefined,
  setActiveTaskId: () => {},
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

  const activeTaskId = store?.getValue("activeTaskId") as string | undefined;

  const handleFetchAndSyncTasks = async () => {
    try {
      if (store) syncTasksFromApi(store);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    handleFetchAndSyncTasks();
  }, [store]);

  return (
    <TasksContext.Provider
      value={{
        isSyncing,
        activeTaskId,
        setActiveTaskId: () => {},
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
