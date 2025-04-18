import { MutationOptions, useMutation } from "@tanstack/react-query";
import { authenticatedPost } from "@/features/authentication/util/authenticatedPost";

type TaskMutationArgs = {
  id: string;
};

type TaskMutationResponse = TaskMutationArgs;

export const useCompleteTaskMutation = (
  options?: MutationOptions<TaskMutationArgs, Error, TaskMutationArgs>,
) => {
  return useMutation({
    mutationKey: ["complete-task"],
    mutationFn: async ({
      id,
    }: TaskMutationArgs): Promise<TaskMutationResponse> => {
      await authenticatedPost(`/tasks/${id}/close`);
      return { id };
    },
    ...options,
  });
};
