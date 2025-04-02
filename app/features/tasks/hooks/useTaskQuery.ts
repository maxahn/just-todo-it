import { useQuery, QueryOptions } from "@tanstack/react-query";
import { Task } from "../types";

type TaskResponse = Task;

const useTaskQuery = (id: string, options?: QueryOptions<TaskResponse>) =>
  useQuery<TaskResponse>({
    queryKey: ["task", id],
    queryFn: async () => {
      const response = await fetch(
        `https://api.todoist.com/rest/v2/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_TODOIST_API_KEY}`,
          },
        },
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<TaskResponse>;
    },
    ...options,
  });

export default useTaskQuery;
