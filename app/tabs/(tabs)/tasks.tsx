import React from "react";
import { FlatList } from "react-native";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import useTasksQuery from "@/hooks/useTasksQuery";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const { data, isLoading } = useTasksQuery();
  return (
    <Center className="flex-1">
      {isLoading ? (<Spinner />) :
      <FlatList style={{width: '100%'}} data={data} renderItem={({item: task}) => <Text key={task.id}>{task.content}</Text>} />
      }
    </Center>
  );
}
