import { Card, ICardProps } from "@/components/ui/card";
import { Task } from "../types";
import { Button, ButtonIcon } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { getPriorityColor } from "../utils/getPriorityColor";
import { PlayIcon } from "lucide-react-native";

interface TaskCardProps extends ICardProps {
  task: Task;
  onPressAction?: (task: Task) => void;
}

export function TaskCard({
  task,
  className,
  onPressAction,
  ...rest
}: TaskCardProps) {
  return (
    <Card
      key={task.id}
      className={`border-l-4 border-${getPriorityColor(task.priority)} ${className}`}
      {...rest}
    >
      <HStack className="flex justify-between">
        <VStack className="flex-1">
          <Text className=" text-2xl font-bold">{task.content}</Text>
          <Text>{task.due?.date || ""}</Text>
          <Text>
            Duration:{" "}
            {task.duration
              ? `${task.duration.amount}${task.duration.unit}`
              : "None"}
          </Text>
        </VStack>
        {onPressAction ? (
          <VStack className="justify-center flex-0">
            <Button action="primary" onPress={() => onPressAction(task)}>
              <ButtonIcon as={PlayIcon} size="lg" color="white" />
            </Button>
          </VStack>
        ) : null}
        {/* </VStack> */}
      </HStack>
    </Card>
  );
}
