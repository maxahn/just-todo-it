import { MissionTask } from "@/app/features/tasks/components/MissionTask";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Task } from "@/app/features/tasks/types";
import { View } from "@/components/ui/view";
import { sortByDueDateAndPriority } from "@/app/features/tasks/utils/sortTasks";
import { useActiveMission } from "@/app/features/tasks/hooks/useActiveMission";

export default function Home() {
  const { data: tasks, isLoading } = useTasksQuery();
  const { activeMission, setActiveMission } = useActiveMission();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

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
      {activeTask ? (
        <MissionTask
          title={activeTask.content}
          description={activeTask?.description}
          due={activeTask.due}
          duration={activeTask?.duration}
        />
      ) : (
        <Text>No tasks</Text>
      )}
    </View>
  );
}
