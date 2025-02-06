import React, { useEffect } from "react";
import { FlatList } from "react-native";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import useTasksQuery from "@/app/features/tasks/hooks/useTasksQuery";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { data: tasks, isLoading } = useTasksQuery();

  const sortedTasks = tasks?.sort((a, b) => {
    const aDueDatetime = a.due?.datetime;
    const bDueDatetime = b.due?.datetime;
    if (!aDueDatetime && !bDueDatetime) {
      return a.priority > b.order ? -1 : 1;
    }
    if (aDueDatetime && bDueDatetime) { 
      return aDueDatetime > bDueDatetime ? -1 : 1;
    }
    if (aDueDatetime) {
      return -1;
    }
      return 1;
  });

  return (
    <Center className="flex-1">
      {isLoading ? (<Spinner />) :
      <FlatList style={{width: '100%'}} data={sortedTasks} renderItem={({item: task}) => <Text key={task.id}>{task.content}</Text>} />
      }
    </Center>
  );
}
