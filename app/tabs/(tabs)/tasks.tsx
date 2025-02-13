import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Spinner } from "@/components/ui/spinner";
import { sortByDueDateAndPriority } from "@/app/features/tasks/utils/sortTasks";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { data: tasks, isLoading } = useTasksQuery();

  const sortedTasks = sortByDueDateAndPriority(tasks || []);

  return (
    <Center className="flex-1">
      {isLoading ? (
        <Spinner />
      ) : (
        <FlatList
          style={{ width: "100%" }}
          data={sortedTasks}
          renderItem={({ item: task }) => (
            <Card key={task.id}>
              <Text>{task.content}</Text>
              <Text>{task.due?.date || ""}</Text>
              <Text>{task.priority || ""}</Text>
              <Text>
                Duration:{" "}
                {task.duration
                  ? `${task.duration.amount}${task.duration.unit}`
                  : "None"}
              </Text>
            </Card>
          )}
        />
      )}
    </Center>
  );
}
