import React from "react";
import { FlatList, RefreshControl } from "react-native";
import { Center } from "@/components/ui/center";
import useTasksQuery from "@/features/tasks/hooks/useTasksQuery";
import { Spinner } from "@/components/ui/spinner";
import { sortByDueDateAndPriority } from "@/features/tasks/utils/sortTasks";
import { Box } from "@/components/ui/box";
import { Task } from "@/features/tasks/types";
import { useActiveMission } from "@/features/tasks/hooks/useActiveMission";
import { useRouter } from "expo-router";
import { TaskCard } from "@/features/tasks/components/TaskCard";

export default function Home() {
  const { data: tasks, isLoading, refetch } = useTasksQuery();
  console.log({ tasks });

  const sortedTasks = sortByDueDateAndPriority(tasks || []);
  const { setActiveMission } = useActiveMission();
  const router = useRouter();

  const handleSetActiveTask = (task: Task) => {
    setActiveMission(task);
    router.push("/");
  };
  return (
    <Center className="flex-1">
      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          style={{ width: "100%" }}
          data={sortedTasks}
          ItemSeparatorComponent={() => <Box className="h-2" />}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refetch} />
          }
          renderItem={({ item: task }) => (
            <TaskCard
              task={task}
              onPressAction={() => handleSetActiveTask(task)}
            />
          )}
        />
      )}
    </Center>
  );
}
