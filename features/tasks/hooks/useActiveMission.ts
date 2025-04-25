import { useContext } from "react";
import { TasksContext } from "../contexts/TasksContext";

export const useTasksAndSessions = () => {
  const context = useContext(TasksContext);
  if (!context)
    throw new Error(
      "useActiveMission hook must be called within the ActiveTaskProvider",
    );
  return context;
};
