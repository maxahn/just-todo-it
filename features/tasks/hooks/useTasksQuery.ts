import { useQuery, QueryOptions } from "@tanstack/react-query";
import { Task } from "../types";
import { authenticatedFetch } from "@/features/authentication/util/authenticatedFetch";

type TasksResponse = Task[];

const useTasksQuery = (options?: QueryOptions<TasksResponse>) =>
  useQuery<TasksResponse>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const result = await authenticatedFetch<TasksResponse>(`/tasks`);
      console.log({ result });
      return result;
    },
    ...options,
  });

export default useTasksQuery;
