import { Card } from "@/components/ui/card";
import { CompletedTask } from "@/features/tasks/types";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { format } from "date-fns";
import { TIME_FORMAT } from "@/util/date/FORMAT";
import { secondsToHoursMinutes } from "@/features/tasks/utils/formatTime";
import AntDesign from "@expo/vector-icons/AntDesign";

interface CompletedTaskCardProps extends React.ComponentProps<typeof Card> {
  task: CompletedTask;
}

export function CompletedTaskCard({
  task,
  className = "",
  ...props
}: CompletedTaskCardProps) {
  const {
    content,
    description,
    lastCompletedAt,
    durationInSeconds,
    estimatedDuration,
  } = task;
  const beatEstimation =
    durationInSeconds && durationInSeconds < estimatedDuration * 60;
  return (
    <Card className={`p-4 gap-2 ${className}`} {...props}>
      <HStack className="justify-between">
        <Heading>{content}</Heading>
        <Heading>{description}</Heading>
        <Text>{format(lastCompletedAt, TIME_FORMAT)}</Text>
      </HStack>
      {durationInSeconds ? (
        <HStack className="gap-2 items-center">
          <AntDesign name="clockcircle" size={16} color="white" />
          <Text className={beatEstimation ? "text-success-500" : ""}>
            {secondsToHoursMinutes(durationInSeconds || 0) ||
              `${durationInSeconds}s`}{" "}
            / {estimatedDuration || 0}m
          </Text>
        </HStack>
      ) : null}
    </Card>
  );
}
