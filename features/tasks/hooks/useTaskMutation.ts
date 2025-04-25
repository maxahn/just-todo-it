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

type TaskMutationResult = Task | undefined;

export const useTaskMutation = (
  options?: MutationOptions<TaskMutationResult, Error, TaskMutationArgs>,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["task"],
    mutationFn: async ({
      id,
      taskChange,
    }: TaskMutationArgs): Promise<TaskMutationResult> => {
      return await authenticatedPost<Task>(`/tasks/${id}`, {
        body: JSON.stringify(taskChange),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    ...options,
  });
};
