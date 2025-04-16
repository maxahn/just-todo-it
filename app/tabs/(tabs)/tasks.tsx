import { FlatList, RefreshControl } from "react-native";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { useActiveMission } from "@/features/tasks/hooks/useActiveMission";
import { useRouter } from "expo-router";
import { TaskCard } from "@/features/tasks/components/TaskCard";
import { useSortedRowIds } from "tinybase/ui-react";
import { TASK_TABLE_ID } from "@/store";

export default function Home() {
  const sortedTaskIds = useSortedRowIds(TASK_TABLE_ID, "order", false);
  const { setActiveTaskId, isSyncing, handleFetchAndSyncTasks } =
    useActiveMission();
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
