// import _ from "lodash";
import { MissionTask } from "@/app/features/tasks/components/MissionTask";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { View } from "@/components/ui/view";
import { sortByDueDateAndPriority } from "@/app/features/tasks/utils/sortTasks";
import { useActiveMission } from "@/app/features/tasks/hooks/useActiveMission";
import { useTaskMutation } from "@/app/features/tasks/hooks/useTaskMutation";
import TaskTimer from "@/app/features/tasks/components/TaskTimer";
import { format, isToday } from "date-fns";
import { DUE_DATE_FORMAT } from "@/app/util/date/FORMAT";
import { VStack } from "@/components/ui/vstack";
import { Switch } from "@/components/ui/switch";
import { HStack } from "@/components/ui/hstack";

export default function Home() {
  const [deferOffset, setDeferOffset] = useState(0);
  const [todayOnly, setTodayOnly] = useState(true);
  const { data: tasks } = useTasksQuery();
  const { activeMission, sessions, setActiveMission, toggleIsTaskPaused } =
    useActiveMission();
  const { mutateAsync: updateTask } = useTaskMutation();

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
    initializeActiveMission();
  }, [tasks, todayOnly]);

  return (
    <View className="flex p-4">
      {sessions?.length ? (
        <TaskTimer />
      ) : activeMission ? (
        <VStack className="flex h-full justify-between">
          <MissionTask
            title={activeMission.content}
            description={activeMission?.description}
            due={activeMission.due}
            duration={activeMission?.duration}
            onStart={toggleIsTaskPaused}
            onDefer={handleDefer}
            onDecrementDuration={() => handleIncrementDuration(-5)}
            onIncrementDuration={() => handleIncrementDuration(5)}
          />
          <HStack className="align-center gap-2 justify-end items-center">
            <Text className="font-semibold">Today Only</Text>
            <Switch value={todayOnly} onToggle={setTodayOnly} />
          </HStack>
        </VStack>
      ) : (
        <Text>No tasks</Text>
      )}
    </View>
  );
}
