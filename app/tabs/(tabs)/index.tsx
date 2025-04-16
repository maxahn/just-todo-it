import { useEffect, useState } from "react";
import { useSortedRowIds } from "tinybase/ui-react";
import { MissionTask } from "@/features/tasks/components/MissionTask";
import { Text } from "@/components/ui/text";
import { useActiveMission } from "@/features/tasks/hooks/useActiveMission";
import TaskTimer from "@/features/tasks/components/TaskTimer";
import { Switch } from "@/components/ui/switch";
import { HStack } from "@/components/ui/hstack";
import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { VStack } from "@/components/ui/vstack";
import { TASK_TABLE_ID } from "@/store";

export default function Home() {
  const [deferOffset, setDeferOffset] = useState(0);
  const [todayOnly, setTodayOnly] = useState(true);
  const sortedTaskIds = useSortedRowIds(TASK_TABLE_ID, "order", false);
  const {
    isSyncing,
    handleFetchAndSyncTasks,
    activeTaskId,
    sessions,
    setActiveTaskId,
    toggleIsTaskPaused,
  } = useActiveMission();

  function initializeActiveMission() {
    if (!sortedTaskIds?.length || (activeTaskId && sessions.length)) {
      return;
    }
    const nextActiveTaskId = sortedTaskIds[0 + deferOffset];
    setActiveTaskId(nextActiveTaskId);
  }

  function handleDefer() {
    if (!activeTaskId) return;
    setDeferOffset((prev) => prev + 1);
    initializeActiveMission();
  }

  useEffect(() => {
    if (activeTaskId) return;
    initializeActiveMission();
  }, [sortedTaskIds, todayOnly, activeTaskId]);

  const handleRefetchTasks = async () => {
    await handleFetchAndSyncTasks;
    initializeActiveMission();
  };

  return (
    <ScreenWrapper
      refreshControlProps={{
        refreshing: isSyncing,
        onRefresh: handleRefetchTasks,
      }}
    >
      <VStack className="flex flex-1 justify-center">
        {sessions?.length ? (
          <TaskTimer />
        ) : activeTaskId ? (
          <MissionTask
            id={activeTaskId}
            onStart={toggleIsTaskPaused}
            onDefer={handleDefer}
          />
        ) : (
          <Text>No Active Task</Text>
        )}
      </VStack>
      <HStack className="flex-0 align-center gap-2 justify-end items-center py-3">
        <Text className="font-semibold">Today Only</Text>
        <Switch value={todayOnly} onToggle={setTodayOnly} />
      </HStack>
    </ScreenWrapper>
  );
}
