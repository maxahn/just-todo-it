import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react-native";
import { useEffect } from "react";
import { secondsToFormattedTime } from "../utils/formatTime";

type StopwatchProps = {
  estimatedSeconds: number;
  isPaused: boolean;
  onToggleIsPaused: () => void;
  secondsRemaining: number;
  setSecondsRemaining: React.Dispatch<React.SetStateAction<number>>;
};

export default function Stopwatch({
  isPaused,
  onToggleIsPaused,
  secondsRemaining,
  setSecondsRemaining,
  estimatedSeconds,
}: StopwatchProps) {
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      if (isPaused) return;
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, [isPaused]);

  return (
    <VStack className="flex justify-center gap-3">
      <VStack className="flex justify-center">
        <Text className="text-6xl font-bold text-center">
          {secondsRemaining < 0 ? "-" : ""}
          {secondsToFormattedTime(Math.abs(secondsRemaining))}
        </Text>
        <Text className="text-center">
          Estimated: {secondsToFormattedTime(estimatedSeconds)}
        </Text>
      </VStack>
      <HStack className="flex justify-center">
        <Button
          size="xl"
          className="rounded-full p-3.5"
          onPress={onToggleIsPaused}
        >
          <ButtonIcon as={isPaused ? PlayIcon : PauseIcon} />
        </Button>
      </HStack>
    </VStack>
  );
}
