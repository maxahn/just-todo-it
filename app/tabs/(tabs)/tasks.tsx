import { FlatList, RefreshControl } from "react-native";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { useTasksAndSessions } from "@/features/tasks/hooks/useActiveMission";
import { useRouter } from "expo-router";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useSortedIncompleteTasks } from "@/store/hooks/queries/useTasks";

export default function Home() {
  const sortedTaskIds = useSortedIncompleteTasks();

  const { setActiveTaskId, isSyncing, handleFetchAndSyncTasks } =
    useTasksAndSessions();
  const router = useRouter();

  const handleSetActiveTask = (id: string) => {
    setActiveTaskId(id);
    router.push("/");
  };

  return (
    <Center className="flex-1">
      <FlatList
        style={{ width: "100%" }}
        data={sortedTaskIds}
        ItemSeparatorComponent={() => <Box className="h-2" />}
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
    </Center>
  );
}
