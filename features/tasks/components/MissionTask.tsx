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
import { TASK_EXTRA_TABLE_ID, TASK_TABLE_ID } from "@/store";
import type { Task, TaskExtra } from "../types";

type MissionTaskProps = {
  id: string;
  onDefer: () => void;
};

export function MissionTask({ id, onDefer }: MissionTaskProps) {
  const task = useRow(TASK_TABLE_ID, id) as Task;
  const taskExtra = useRow(TASK_EXTRA_TABLE_ID, id) as TaskExtra;
  const { content, description } = task;
  const dueDate = task?.dueDate ? parseFromDateString(task.dueDate) : null;
  const overdue = dueDate
    ? isAfter(dueDate, new Date().setHours(0, 0, 0, 0)) || !isToday(dueDate)
    : false;

  const { mutateAsync: completeTask, isPending } = useCompleteTaskMutation();
  const { setActiveTaskId, updateTask, updateTaskExtra, startSession } =
    useActiveMission();

  const handleCompleteTask = async () => {
    try {
      await completeTask({ id });
      // TODO: sync local tasks to todoist
      await updateTask(id, {
        isCompleted: true,
      });
      setActiveTaskId("");
    } catch (error) {
      console.log({ error });
    }
  };

  const handleIncrementDuration = async (amount: number) => {
    try {
      if (!taskExtra) return;
      const updatedDuration = (taskExtra.estimatedDuration || 25) + amount;
      await updateTaskExtra(id, {
        estimatedDuration: updatedDuration,
      });
    } catch (error) {
      console.log({ error });
    }
  };

  const handleStartTask = async () => {
    try {
      await Promise.all([setActiveTaskId(id), startSession(id)]);
    } catch (error) {
      console.log({ error });
    }
  };

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
            {taskExtra?.estimatedDuration
              ? `${taskExtra?.estimatedDuration}m`
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
        <Button size="xl" className="flex-1" onPress={handleStartTask}>
          <ButtonText>Start Task</ButtonText>
        </Button>
        <Button size="xl" action="secondary" onPress={onDefer}>
          <ButtonIcon as={ChevronsRightIcon} />
        </Button>
      </HStack>
    </Card>
  );
}
