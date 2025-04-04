import { useKeepAwake } from "expo-keep-awake";
import { MissionTask } from "@/app/features/tasks/components/MissionTask";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { sortByDueDateAndPriority } from "@/app/features/tasks/utils/sortTasks";
import { useActiveMission } from "@/app/features/tasks/hooks/useActiveMission";
import { useTaskMutation } from "@/app/features/tasks/hooks/useTaskMutation";
import TaskTimer from "@/app/features/tasks/components/TaskTimer";
import { format } from "date-fns";
import { DUE_DATE_FORMAT } from "@/app/util/date/FORMAT";
import { Switch } from "@/components/ui/switch";
import { HStack } from "@/components/ui/hstack";
import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { VStack } from "@/components/ui/vstack";

export default function Home() {
  const [deferOffset, setDeferOffset] = useState(0);
  const [todayOnly, setTodayOnly] = useState(true);
  const { data: tasks, isLoading: isLoadingTasks, refetch } = useTasksQuery();
  const { activeMission, sessions, setActiveMission, toggleIsTaskPaused } =
    useActiveMission();
  const { mutateAsync: updateTask } = useTaskMutation();
  useKeepAwake();

  async function handleIncrementDuration(amount: number) {
    // const oldActiveMission = activeMission;
    try {
      if (!activeMission) return;
      const updatedDuration = (activeMission?.duration?.amount || 25) + amount;
      setActiveMission({
        ...activeMission,
        duration: {
          amount: updatedDuration,
          unit: activeMission?.duration?.unit || "minute",
        },
      });
      await updateTask({
        id: activeMission.id,
        taskChange: {
          duration: updatedDuration,
          duration_unit: "minute",
        },
      });
      // setActiveMission(updatedMission);
    } catch (error) {
      console.log({ error });
      // setActiveMission(oldActiveMission);
    }
  }
  // const debouncedIncrementDuration = _.debounce(handleIncrementDuration, 500);

  function initializeActiveMission() {
    if (!tasks || !tasks.length || (activeMission && sessions.length)) {
      return;
    }
    const sortedTasks = sortByDueDateAndPriority(tasks);
    const today = format(new Date(), DUE_DATE_FORMAT);
    const filteredTasks = todayOnly
      ? sortedTasks.filter((task) => {
          return task.due?.date === today;
        })
      : sortedTasks;
    setActiveMission(filteredTasks[0 + deferOffset]);
  }

  function handleDefer() {
    if (!activeMission) return;
    setDeferOffset((prev) => prev + 1);
    initializeActiveMission();
  }

  useEffect(() => {
    if (!activeMission) {
      initializeActiveMission();
    }
  }, [tasks, todayOnly]);

  const handleRefetchTasks = async () => {
    await refetch();
    initializeActiveMission();
  };

  return (
    <ScreenWrapper
      refreshControlProps={{
        refreshing: isLoadingTasks,
        onRefresh: handleRefetchTasks,
      }}
    >
      <VStack className="flex flex-1 justify-center">
        {sessions?.length ? (
          <TaskTimer />
        ) : activeMission ? (
          <>
            <MissionTask
              id={activeMission.id}
              title={activeMission.content}
              description={activeMission?.description}
              due={activeMission.due}
              duration={activeMission?.duration}
              onStart={toggleIsTaskPaused}
              onDefer={handleDefer}
              onDecrementDuration={() => handleIncrementDuration(-5)}
              onIncrementDuration={() => handleIncrementDuration(5)}
            />
          </>
        ) : (
          <Text>No tasks</Text>
        )}
      </VStack>
      <HStack className="flex-0 align-center gap-2 justify-end items-center py-3">
        <Text className="font-semibold">Today Only</Text>
        <Switch value={todayOnly} onToggle={setTodayOnly} />
      </HStack>
    </ScreenWrapper>
  );
}
