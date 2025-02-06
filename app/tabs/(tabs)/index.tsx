import { MissionTask } from "@/app/features/tasks/components/MissionTask";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { Task } from "@/app/features/tasks/types";
import { View } from "@/components/ui/view";

export default function Home() {
  const { data: tasks, isLoading } = useTasksQuery();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!tasks || !tasks.length) {
      return;
    }
    const sortedTasks = tasks.sort((a, b) => {
      const aDue = a.due;
      const bDue = b.due;
      if (!aDue && !bDue) {
        return a.priority > b.order ? -1 : 1;
      }
      const aDueDatetime = aDue?.date;
      const bDueDatetime = bDue?.date;
      if (aDueDatetime && bDueDatetime) {
        return aDueDatetime > bDueDatetime ? -1 : 1;
      }
      if (aDueDatetime) {
        return -1;
      }
      return 1;
    });

    console.log({ tasks, sortedTasks });
    setActiveTask(sortedTasks[0]);
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
