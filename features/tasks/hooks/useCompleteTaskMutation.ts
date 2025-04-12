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
      // const response = await fetch(
      //   `https://api.todoist.com/rest/v2/tasks/${id}/close`,
      //   {
      //     method: "POST",
      //     headers: {
      //       Authorization: `Bearer ${process.env.EXPO_PUBLIC_TODOIST_API_KEY}`,
      //       "Content-Type": "application/json",
      //     },
      //   },
      // );
      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }

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
