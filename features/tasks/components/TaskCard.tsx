import { Card, ICardProps } from "@/components/ui/card";
import { Task } from "../types";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { getPriorityColor } from "../utils/getPriorityColor";
import { PlayIcon } from "lucide-react-native";
import { getHumanReadableDate } from "@/util/date/parseFromDate";
import { formatUnit } from "../utils/formatUnit";
import { useRow } from "tinybase/ui-react";
import { TASK_TABLE_ID } from "@/store";

interface TaskCardProps extends ICardProps {
  //   task: Task;
  id: string;
  onPressAction?: (task: Task) => void;
}

export function TaskCard({
  //   task,
  id,
  className,
  onPressAction,
  ...rest
}: TaskCardProps) {
  const task = useRow(TASK_TABLE_ID, id) as Task;
  return (
    <Card
      key={id}
      className={`border-l-4 border-${getPriorityColor(task.priority)} ${className}`}
      {...rest}
    >
      <HStack className="flex justify-between">
        <VStack className="flex-1">
          <Text className=" text-2xl font-bold">{task.content}</Text>
          <Text>{task.dueDate ? getHumanReadableDate(task.dueDate) : ""}</Text>
          {task.durationAmount && task.durationUnit ? (
            <Text>
              Duration: {task.durationAmount}
              {formatUnit(task.durationUnit)}
            </Text>
          ) : null}
        </VStack>
        {onPressAction ? (
          <VStack className="justify-center flex-0">
            <Button action="primary" onPress={() => onPressAction(task)}>
              <ButtonIcon as={PlayIcon} size="lg" color="white" />
            </Button>
          </VStack>
        ) : null}
      </HStack>
    </Card>
  );
}
