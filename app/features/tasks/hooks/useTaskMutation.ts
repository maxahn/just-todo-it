import { MutationOptions, useMutation } from "@tanstack/react-query";
import { Task, TaskUpdate } from "../types";

type TaskMutationArgs = {
  id: string;
  taskChange: Partial<TaskUpdate>;
};
export const useTaskMutation = (
  options?: MutationOptions<Task, Error, TaskMutationArgs>,
) => {
  return useMutation({
    mutationKey: ["task"],
    mutationFn: async ({ id, taskChange }: TaskMutationArgs): Promise<Task> => {
      const response = await fetch(
        `https://api.todoist.com/rest/v2/tasks/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_TODOIST_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(taskChange),
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<Task>;
    },
    ...options,
  });
};
