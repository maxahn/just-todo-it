// import _ from "lodash";
import { MissionTask } from "@/app/features/tasks/components/MissionTask";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Text } from "@/components/ui/text";
import { useEffect } from "react";
import { View } from "@/components/ui/view";
import { sortByDueDateAndPriority } from "@/app/features/tasks/utils/sortTasks";
import { useActiveMission } from "@/app/features/tasks/hooks/useActiveMission";
import { useTaskMutation } from "@/app/features/tasks/hooks/useTaskMutation";
import TaskTimer from "@/app/features/tasks/components/TaskTimer";

export default function Home() {
  const { data: tasks } = useTasksQuery();
  const { activeMission, setActiveMission, progress, startTask, pauseTask } =
    useActiveMission();
  const { mutateAsync: updateTask } = useTaskMutation();
  console.log({ progress });

  async function handleIncrementDuration(amount: number) {
    const oldActiveMission = activeMission;
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
      setActiveMission(oldActiveMission);
    }
  }

  // const debouncedIncrementDuration = _.debounce(handleIncrementDuration, 500);

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
      {progress ? (
        <TaskTimer />
      ) : activeMission ? (
        <MissionTask
          title={activeMission.content}
          description={activeMission?.description}
          due={activeMission.due}
          duration={activeMission?.duration}
          onDecrementDuration={() => handleIncrementDuration(-5)}
          onIncrementDuration={() => handleIncrementDuration(5)}
          onStart={startTask}
        />
      ) : (
        <Text>No tasks</Text>
      )}
    </View>
  );
}
