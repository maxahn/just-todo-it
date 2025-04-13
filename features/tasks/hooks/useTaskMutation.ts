import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { Task, TaskUpdate } from "../types";
import { authenticatedPost } from "@/features/authentication/util/authenticatedPost";

type TaskMutationArgs = {
  id: string;
  taskChange: Partial<TaskUpdate>;
};
export const useTaskMutation = (
  options?: MutationOptions<Task, Error, TaskMutationArgs>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["task"],
    mutationFn: async ({ id, taskChange }: TaskMutationArgs): Promise<Task> => {
      return await authenticatedPost<Task>(
        `https://api.todoist.com/rest/v2/tasks/${id}`,
        {
          body: JSON.stringify(taskChange),
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    ...options,
  });
};
