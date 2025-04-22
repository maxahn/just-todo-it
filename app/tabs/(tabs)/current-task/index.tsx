import { useEffect, useState } from "react";
import { MissionTask } from "@/features/tasks/components/MissionTask";
import { Text } from "@/components/ui/text";
import { useTasksAndSessions } from "@/features/tasks/hooks/useActiveMission";
import { Switch } from "@/components/ui/switch";
import { HStack } from "@/components/ui/hstack";
import { ScrollViewScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { VStack } from "@/components/ui/vstack";
import { Redirect } from "expo-router";
import { useSortedIncompleteTasks } from "@/store/hooks/queries/useTasks";
import { SUB_SESSION_TABLE_ID } from "@/store";
import { useRow } from "tinybase/ui-react";
import _ from "lodash";

export default function CurrentTask() {
  const [deferOffset, setDeferOffset] = useState(0);
  const [todayOnly, setTodayOnly] = useState(true);
  const sortedIncompleteTaskIds = useSortedIncompleteTasks();
  const {
    isSyncing,
    handleFetchAndSyncTasks,
    activeTaskId,
    activeSessionId,
    activeSubSessionId,
    setActiveTaskId,
  } = useTasksAndSessions();
  const activeSubSession = useRow(SUB_SESSION_TABLE_ID, activeSubSessionId);

  function initializeActiveMission() {
    const isTimerActive = Boolean(activeTaskId) && Boolean(activeSessionId);
    if (!sortedIncompleteTaskIds?.length || isTimerActive) {
      return;
    }
    const nextActiveTaskId = sortedIncompleteTaskIds[0 + deferOffset];
    setActiveTaskId(nextActiveTaskId);
  }

  function handleDefer() {
    if (!activeTaskId) return;
    setDeferOffset((prev) => prev + 1);
    initializeActiveMission();
  }

  useEffect(() => {
    const sortedListIncludesTaskId =
      sortedIncompleteTaskIds.includes(activeTaskId);
    if (activeTaskId && sortedListIncludesTaskId) return;
    initializeActiveMission();
  }, [sortedIncompleteTaskIds, todayOnly, activeTaskId]);

  const handleRefetchTasks = async () => {
    await handleFetchAndSyncTasks;
    initializeActiveMission();
  };

  if (activeTaskId && !_.isEmpty(activeSubSession)) {
    return <Redirect href="./current-task/timer" />;
  }

  return (
    <ScrollViewScreenWrapper
      refreshControlProps={{
        refreshing: isSyncing,
        onRefresh: handleRefetchTasks,
      }}
    >
      <VStack className="flex flex-1 justify-center">
        <MissionTask id={activeTaskId} onDefer={handleDefer} />
      </VStack>
      <HStack className="flex-0 align-center gap-2 justify-end items-center py-3">
        <Text className="font-semibold">Today Only</Text>
        <Switch value={todayOnly} onToggle={setTodayOnly} />
      </HStack>
    </ScrollViewScreenWrapper>
  );
}
