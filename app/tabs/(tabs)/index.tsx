import _ from "lodash";
import { MissionTask } from "@/app/features/tasks/components/MissionTask";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Task } from "@/app/features/tasks/types";
import { View } from "@/components/ui/view";
import { sortByDueDateAndPriority } from "@/app/features/tasks/utils/sortTasks";
import { useActiveMission } from "@/app/features/tasks/hooks/useActiveMission";
import { useTaskMutation } from "@/app/features/tasks/hooks/useTaskMutation";

export default function Home() {
  const { data: tasks } = useTasksQuery();
  const { activeMission, setActiveMission } = useActiveMission();
  const { mutateAsync: updateTask } = useTaskMutation();

  async function handleIncrementDuration(amount: number) {
    try {
      if (!activeMission) return;
      console.log({ activeMissionDuration: activeMission?.duration?.amount });
      const updatedDuration = (activeMission?.duration?.amount || 25) + amount;
      const updatedMission = await updateTask({
        id: activeMission.id,
        taskChange: {
          duration: updatedDuration,
          duration_unit: "minute",
        },
      });
      setActiveMission(updatedMission);
    } catch (error) {
      console.log({ error });
    }
  }

  const debouncedIncrementDuration = _.debounce(handleIncrementDuration, 500);

  function initializeActiveMission() {
    if (!tasks || !tasks.length || activeMission) {
      return;
    }
    const sortedTasks = sortByDueDateAndPriority(tasks);
    setActiveMission(sortedTasks[0]);
  }

  useEffect(() => {
    initializeActiveMission();
  }, [tasks]);

  return (
    <View className="flex p-4">
      {activeMission ? (
        <MissionTask
          title={activeMission.content}
          description={activeMission?.description}
          due={activeMission.due}
          duration={activeMission?.duration}
          onDecrementDuration={() => debouncedIncrementDuration(-5)}
          onIncrementDuration={() => debouncedIncrementDuration(5)}
        />
      ) : (
        <Text>No tasks</Text>
      )}
    </View>
  );
}
