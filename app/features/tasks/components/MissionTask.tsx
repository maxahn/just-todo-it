import { Button, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, Icon, RemoveIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import FontAwesome from "@expo/vector-icons/FontAwesome";

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
  anxietyLevel,
  difficultyLevel,
}: MissionTaskProps) {
  return (
    <Card className="rounded-xl p-6 gap-4">
      <Text className="text-2xl font-bold">Current Mission</Text>
      <Card className="rounded-xl p-6 mt-3 bg-blue-100">
        <Text className="text-xl font-bold">{title}</Text>
        {description ? <Text className="text-lg">{description}</Text> : null}
        {due ? <Text className="text-lg">{due?.datetime}</Text> : null}
      </Card>
      <HStack className="justify-between items-center">
        <Text>Time Estimation</Text>
        <HStack className="gap-2 items-center">
          <Button className="rounded-full w-1" onPress={onDecrementDuration}>
            <ButtonIcon as={RemoveIcon} />
          </Button>
          <Text>
            {duration ? `${duration.amount} ${duration.unit}` : "25m"}
          </Text>
          <Button className="rounded-full w-1" onPress={onIncrementDuration}>
            <ButtonIcon as={AddIcon} />
          </Button>
        </HStack>
      </HStack>
    </Card>
  );
}
