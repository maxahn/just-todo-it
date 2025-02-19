import { MutationOptions, useMutation } from "@tanstack/react-query";

type TaskMutationArgs = {
  id: string;
};

export const useCompleteTaskMutation = (
  options?: MutationOptions<boolean, Error, TaskMutationArgs>,
) => {
  return useMutation({
    mutationKey: ["complete-task"],
    mutationFn: async ({ id }: TaskMutationArgs): Promise<boolean> => {
      const response = await fetch(
        `https://api.todoist.com/rest/v2/tasks/${id}/close`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_TODOIST_API_KEY}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return true;
    },
    ...options,
  });
};
