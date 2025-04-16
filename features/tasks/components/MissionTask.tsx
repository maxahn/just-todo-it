import {
  getHumanReadableDate,
  parseFromDateString,
} from "@/util/date/parseFromDate";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, RemoveIcon, ChevronsRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { isToday } from "date-fns";
import { isAfter } from "date-fns/isAfter";
import { CheckIcon } from "lucide-react-native";
import { useCompleteTaskMutation } from "../hooks/useCompleteTaskMutation";
import { useActiveMission } from "../hooks/useActiveMission";
import { useRow } from "tinybase/ui-react";
import { TASK_TABLE_ID } from "@/store";
import type { Task } from "../types";

type MissionTaskProps = {
  id: string;
  onStart: () => void;
  onDefer: () => void;
};

export function MissionTask({ id, onStart, onDefer }: MissionTaskProps) {
  const task = useRow(TASK_TABLE_ID, id) as Task;
  console.log({ task });
  const { content, description, durationAmount, durationUnit } = task;
  const dueDate = task?.dueDate ? parseFromDateString(task.dueDate) : null;
  const overdue = dueDate
    ? isAfter(dueDate, new Date().setHours(0, 0, 0, 0)) || !isToday(dueDate)
    : false;

  const { mutateAsync: completeTask, isPending } = useCompleteTaskMutation();
  const { setActiveTaskId, updateTask } = useActiveMission();

  const handleCompleteTask = async () => {
    try {
      await completeTask({ id });
      setActiveTaskId(null);
    } catch (error) {
      console.log({ error });
    }
  };
  async function handleIncrementDuration(amount: number) {
    try {
      if (!task) return;
      const updatedDuration = (durationAmount || 25) + amount;
      await updateTask(id, {
        durationAmount: updatedDuration,
      });
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <Card className="rounded-xl p-6 gap-4" variant="filled">
      <HStack className="justify-between items-center">
        <Text className="text-2xl font-bold">Current Task</Text>
        <Button
          action="positive"
          variant="outline"
          size="sm"
          className="rounded-full h-8 w-8"
          isDisabled={isPending}
          onPress={handleCompleteTask}
        >
          <ButtonIcon as={CheckIcon} />
        </Button>
      </HStack>
      <Card className="rounded-xl p-6 mt-3 ">
        <Text className="text-xl font-bold">{content}</Text>
        {task?.dueDate ? (
          <HStack className="gap-2">
            <Text
              size="sm"
              className={`text-right font-bold mt-2 ${overdue ? "text-error-600" : "text-success-500"} `}
            >
              {getHumanReadableDate(task.dueDate)}
            </Text>
          </HStack>
        ) : null}
        {description ? (
          <Text size="md" className="text-typography-500 mt-2">
            {description}
          </Text>
        ) : null}
      </Card>
      <HStack className="justify-between items-center">
        <Text>Time Estimation</Text>
        <HStack className="gap-2 items-center">
          <Button
            className="rounded-full w-1"
            onPress={() => handleIncrementDuration(-5)}
            action="tertiary"
          >
            <ButtonIcon as={RemoveIcon} />
          </Button>
          <Text className="font-bold">
            {durationAmount && durationUnit
              ? `${durationAmount} ${durationUnit}`
              : "25m"}
          </Text>
          <Button
            className="rounded-full w-1"
            onPress={() => handleIncrementDuration(5)}
            action="tertiary"
          >
            <ButtonIcon as={AddIcon} />
          </Button>
        </HStack>
      </HStack>
      <HStack className="flex gap-2">
        <Button size="xl" className="flex-1" onPress={onStart}>
          <ButtonText>Start Task</ButtonText>
        </Button>
        <Button size="xl" action="secondary" onPress={onDefer}>
          <ButtonIcon as={ChevronsRightIcon} />
        </Button>
      </HStack>
    </Card>
  );
}
