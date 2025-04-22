import { Card, ICardProps } from "@/components/ui/card";
import { Task, TaskExtra } from "../types";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { getPriorityColor } from "../utils/getPriorityColor";
import { PlayIcon, SkipForwardIcon } from "lucide-react-native";
import { getHumanReadableDate } from "@/util/date/parseFromDate";
import { useRow } from "tinybase/ui-react";
import { TASK_EXTRA_TABLE_ID, TASK_TABLE_ID } from "@/store";
import { useTasksAndSessions } from "../hooks/useActiveMission";

interface TaskCardProps extends ICardProps {
  id: string;
  onPressAction?: (task: Task) => void;
}

export function TaskCard({
  id,
  className,
  onPressAction,
  ...rest
}: TaskCardProps) {
  const task = useRow(TASK_TABLE_ID, id) as Task;
  const taskExtra = useRow(TASK_EXTRA_TABLE_ID, id) as TaskExtra;
  const { updateTaskExtra } = useTasksAndSessions();

  const handleToggleSkip = () => {
    updateTaskExtra(id, {
      skip: !taskExtra.skip,
    });
  };
  const isSkipped = Boolean(taskExtra.skip);

  return (
    <Card
      key={id}
      className={`border-l-4 border-${getPriorityColor(task.priority)} ${isSkipped ? "opacity-50" : ""} ${className}`}
      {...rest}
    >
      <HStack className="flex justify-between border-l-4">
        <VStack className="flex-1">
          <Text className=" text-2xl font-bold">{task.content}</Text>
          <Text>{task.dueDate ? getHumanReadableDate(task.dueDate) : ""}</Text>
          {taskExtra.estimatedDuration ? (
            <Text>Duration: {taskExtra.estimatedDuration}m</Text>
          ) : null}
        </VStack>
        <VStack className="justify-center flex-0 gap-1">
          <Button
            action="negative"
            variant={isSkipped ? "solid" : "outline"}
            onPress={handleToggleSkip}
            size="xs"
          >
            <ButtonIcon as={SkipForwardIcon} size="lg" />
          </Button>
          {onPressAction ? (
            <Button
              action="primary"
              onPress={() => onPressAction(task)}
              size="lg"
            >
              <ButtonIcon as={PlayIcon} size="lg" color="white" />
            </Button>
          ) : null}
        </VStack>
      </HStack>
    </Card>
  );
}
