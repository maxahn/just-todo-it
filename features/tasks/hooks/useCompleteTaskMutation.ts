import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useActiveMission } from "./useActiveMission";
import { storeData } from "@/util/localStorage/setData";
import { authenticatedPost } from "@/features/authentication/util/authenticatedPost";

type TaskMutationArgs = {
  id: string;
};

type TaskMutationResponse = TaskMutationArgs;

export const useCompleteTaskMutation = (
  options?: MutationOptions<TaskMutationArgs, Error, TaskMutationArgs>,
) => {
  const queryClient = useQueryClient();
  const { sessions, clearSessions } = useActiveMission();

  return useMutation({
    mutationKey: ["complete-task"],
    mutationFn: async ({
      id,
    }: TaskMutationArgs): Promise<TaskMutationResponse> => {
      await authenticatedPost(
        `https://api.todoist.com/rest/v2/tasks/${id}/close`,
      );
      return { id };
    },
    onSuccess: async (data) => {
      const savingTaskData = storeData(`completedTasks:${data.id}`, {
        sessions,
      });
      const invalidatingTasks = queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      await Promise.all([savingTaskData, invalidatingTasks]);
      clearSessions();
    },
    ...options,
  });
};
