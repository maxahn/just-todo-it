import { FlatList, RefreshControl } from "react-native";
import { Box } from "@/components/ui/box";
import { useTasksAndSessions } from "@/features/tasks/hooks/useActiveMission";
import { useRouter } from "expo-router";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useSortedIncompleteTaskIds } from "@/store/hooks/queries/useTasks";
import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";

export default function TasksListScreen() {
  const sortedTaskIds = useSortedIncompleteTaskIds();

  const { setActiveTaskId, isSyncing, handleFetchAndSyncTasks } =
    useTasksAndSessions();
  const router = useRouter();

  const handleSetActiveTask = (id: string) => {
    setActiveTaskId(id);
    router.push("/");
  };

  return (
    <ScreenWrapper containerClassName="p-0">
      <FlatList
        style={{ width: "100%" }}
        data={sortedTaskIds}
        ItemSeparatorComponent={() => <Box className="h-2" />}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl
            refreshing={isSyncing}
            onRefresh={handleFetchAndSyncTasks}
          />
        }
        renderItem={({ item: id }) => (
          <TaskCard id={id} onPressAction={() => handleSetActiveTask(id)} />
        )}
      />
    </ScreenWrapper>
  );
}
