import {
  getHumanReadableDate,
  parseFromDateString,
} from "@/app/util/date/parseFromDate";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, RemoveIcon, ChevronsRightIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { isToday } from "date-fns";
import { isAfter } from "date-fns/isAfter";

type MissionTaskProps = {
  title: string;
  description: string;
  due?: {
    date: string;
    is_recurring: boolean;
    datetime?: string;
    string?: string;
    timezone?: string;
  } | null;
  duration?: {
    amount: number;
    unit: string;
  } | null;
  anxietyLevel?: number;
  difficultyLevel?: number;
  onStart: () => void;
  onDefer: () => void;
  onIncrementDuration: () => Promise<void> | undefined;
  onDecrementDuration: () => Promise<void> | undefined;
};

export function MissionTask({
  title,
  description,
  due,
  duration,
  onIncrementDuration,
  onDecrementDuration,
  onStart,
  onDefer,
  anxietyLevel,
  difficultyLevel,
}: MissionTaskProps) {
  const dueDate = due?.date ? parseFromDateString(due.date) : null;
  const overdue = dueDate
    ? isAfter(dueDate, new Date().setHours(0, 0, 0, 0)) || !isToday(dueDate)
    : false;

  return (
    <Card className="rounded-xl p-6 gap-4" variant="filled">
      <HStack className="justify-between items-center">
        <Text className="text-2xl font-bold">Current Task</Text>
        {/* <Button size="lg" action="positive" variant="outline">
          <ButtonText className="0">Complete</ButtonText>
        </Button> */}
      </HStack>
      <Card className="rounded-xl p-6 mt-3 ">
        <Text className="text-xl font-bold">{title}</Text>
        {due ? (
          <HStack className="gap-2">
            <Text
              size="sm"
              className={`text-right font-bold mt-2 ${overdue ? "text-red-600" : "text-green-500"}`}
            >
              {getHumanReadableDate(due.date)}
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
            onPress={onDecrementDuration}
            action="tertiary"
          >
            <ButtonIcon as={RemoveIcon} />
          </Button>
          <Text className="font-bold">
            {duration ? `${duration.amount} ${duration.unit}` : "25m"}
          </Text>
          <Button
            className="rounded-full w-1"
            onPress={onIncrementDuration}
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
