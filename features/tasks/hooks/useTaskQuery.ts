import { useQuery, QueryOptions } from "@tanstack/react-query";
import { Task } from "../types";
import { authenticatedFetch } from "@/features/authentication/util/authenticatedFetch";

type TaskResponse = Task;

const useTaskQuery = (id: string, options?: QueryOptions<TaskResponse>) =>
  useQuery<TaskResponse>({
    queryKey: ["task", id],
    queryFn: async () => {
      return await authenticatedFetch<TaskResponse>(`/tasks/${id}`);
    },
    ...options,
  });

export default useTaskQuery;
