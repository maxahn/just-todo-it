import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon } from "@/components/ui/button";
import { PauseIcon, PlayIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { secondsToFormattedTime } from "../utils/formatTime";

type StopwatchProps = {
  offset?: number;
  isPaused: boolean;
  onToggleIsPaused: () => void;
  estimatedSeconds: number;
  hideControls?: boolean;
};

export default function Stopwatch({
  isPaused,
  onToggleIsPaused,
  estimatedSeconds,
  offset = 0,
  hideControls = false,
}: StopwatchProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(
    estimatedSeconds + offset,
  );

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      if (isPaused) return;
      setSecondsRemaining((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(countdownTimer);
  }, [isPaused]);

  // On Android, timer pauses when app goes to background
  // So this re-syncs when app is active again
  useEffect(() => {
    console.log({ estimatedSeconds, offset });
    setSecondsRemaining(estimatedSeconds + offset);
  }, [estimatedSeconds, offset]);

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
        {!hideControls ? (
          <Button
            size="xl"
            className="rounded-full p-3.5"
            onPress={onToggleIsPaused}
          >
            <ButtonIcon as={isPaused ? PlayIcon : PauseIcon} />
          </Button>
        ) : null}
      </HStack>
    </VStack>
  );
}
