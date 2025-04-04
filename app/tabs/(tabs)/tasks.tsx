import React from "react";
import { FlatList } from "react-native";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Spinner } from "@/components/ui/spinner";
import { sortByDueDateAndPriority } from "@/app/features/tasks/utils/sortTasks";
import { Card } from "@/components/ui/card";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Priority, Task } from "@/app/features/tasks/types";
import { isToday } from "@/app/util/date/isToday";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Target } from "lucide-react-native";
import { useActiveMission } from "@/app/features/tasks/hooks/useActiveMission";
import { useRouter } from "expo-router";

function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 1:
      return "bg-transparent";
    case 2:
      return "bg-blue-500";
    case 3:
      return "bg-orange-500";
    case 4:
      return "bg-red-600";
      break;
    default:
      return "bg-white";
  }
}

export default function Home() {
  const { data: tasks, isLoading } = useTasksQuery();

  const sortedTasks = sortByDueDateAndPriority(tasks || []);
  const { setActiveMission } = useActiveMission();
  const router = useRouter();

  const handleSetActiveTask = (task: Task) => {
    setActiveMission(task);
    router.push("/");
  };
  return (
    <Center className="flex-1">
      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          style={{ width: "100%" }}
          data={sortedTasks}
          ItemSeparatorComponent={() => <Box className="h-2" />}
          renderItem={({ item: task }) => {
            const isDueToday = task?.due?.date ? isToday(task.due.date) : false;
            return (
              <Card
                key={task.id}
                className={isDueToday ? `border-l-4 border-orange-500` : ""}
              >
                <HStack className="flex justify-between">
                  <VStack>
                    <Text className="text-2xl font-bold">{task.content}</Text>
                    <Text>{task.due?.date || ""}</Text>
                    <Text>
                      Duration:{" "}
                      {task.duration
                        ? `${task.duration.amount}${task.duration.unit}`
                        : "None"}
                    </Text>
                  </VStack>
                  <VStack className="items-end justify-between">
                    <Box
                      className={`${getPriorityColor(task.priority)} h-2 w-2 rounded-full`}
                    />
                    <Button
                      action="primary"
                      onPress={() => handleSetActiveTask(task)}
                    >
                      <ButtonIcon as={Target} size="lg" color="white" />
                    </Button>
                  </VStack>
                </HStack>
              </Card>
            );
          }}
        />
      )}
    </Center>
  );
}
