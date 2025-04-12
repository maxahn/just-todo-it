import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useActiveMission } from "../hooks/useActiveMission";
import Stopwatch from "./Stopwatch";
import { HStack } from "@/components/ui/hstack";
import {
  Button,
  ButtonIcon,
  ButtonSpinner,
  ButtonText,
} from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import {
  CheckIcon,
  ChevronDown,
  ChevronUp,
  PauseIcon,
  PlayIcon,
  X,
} from "lucide-react-native";
import { formatSession, secondsToFormattedTime } from "../utils/formatTime";
import { parseISO } from "date-fns";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useCompleteTaskMutation } from "../hooks/useCompleteTaskMutation";
import useAppState from "@/hooks/useAppStateChange";

const DEFAULT_ESTIMATE_SECONDS = 25 * 60;
function getEstimateSeconds(
  duration: { amount: number; unit: string } | undefined | null,
) {
  return duration?.amount ? duration.amount * 60 : DEFAULT_ESTIMATE_SECONDS;
}

export default function TaskTimer() {
  const [sessionsVisible, setSessionsVisible] = useState(false);
  const [offset, setOffset] = useState(0);
  const { mutateAsync: completeTask, isPending: isCompleting } =
    useCompleteTaskMutation();
  const {
    activeMission,
    setActiveMission,
    sessions,
    getIsActive,
    toggleIsTaskPaused,
    getTotalSessionsDuration,
    removeSession,
    clearSessions,
  } = useActiveMission();
  const appState = useAppState();
  const estimatedSeconds = getEstimateSeconds(activeMission?.duration);

  const handleCompleteTask = async () => {
    try {
      if (!activeMission?.id) throw new Error("No active mission");
      await completeTask({ id: activeMission.id });
      setActiveMission(null);
    } catch (error) {
      console.log({ error });
    }
  };

  useEffect(() => {
    if (appState === "active" && activeMission) {
      const totalSessionsDuration = getTotalSessionsDuration();
      setOffset(-totalSessionsDuration);
    }
  }, [appState]);

  const isPaused = !getIsActive();
  return (
    <VStack className="flex items-center gap-6 py-5">
      <VStack className="flex gap-3 items-center">
        <Heading size="xl">Current Task</Heading>
        <Heading size="lg" className="text-primary-300">
          {activeMission?.content}
        </Heading>
      </VStack>
      <Stopwatch
        offset={offset}
        estimatedSeconds={estimatedSeconds}
        isPaused={isPaused}
        onToggleIsPaused={toggleIsTaskPaused}
        hideControls
      />

      <HStack className="justify-center gap-4 ">
        <Button
          size="lg"
          action="negative"
          className="rounded-full w-16 h-16"
          onPress={toggleIsTaskPaused}
        >
          <ButtonIcon
            className="w-7 h-7"
            as={isPaused ? PlayIcon : PauseIcon}
          />
        </Button>

        <Button
          size="lg"
          action="positive"
          className="rounded-full w-16 h-16"
          onPress={handleCompleteTask}
          isDisabled={isCompleting}
        >
          {isCompleting ? (
            <ButtonSpinner color="white" />
          ) : (
            <ButtonIcon className="w-7 h-7" as={CheckIcon} />
          )}
        </Button>
      </HStack>

      <VStack className="gap-2 w-full">
        <HStack className="flex justify-between items-center">
          <Heading size="md">Sessions</Heading>
          <Button
            size="xl"
            variant="link"
            className="rounded-full p-2"
            action="secondary"
            onPress={() => setSessionsVisible((prev) => !prev)}
          >
            <ButtonIcon as={sessionsVisible ? ChevronDown : ChevronUp} />
          </Button>
        </HStack>
        {sessionsVisible ? (
          <Animated.FlatList
            data={sessions}
            itemLayoutAnimation={LinearTransition}
            inverted
            keyExtractor={(item) => item[0]}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item, index }) => {
              const [start, end] = item;
              return (
                <Card>
                  <HStack className="flex justify-between items-center">
                    <VStack className="flex align-center">
                      {end ? (
                        <Text className="text-bold">
                          {secondsToFormattedTime(
                            Math.floor(
                              (parseISO(end).getTime() -
                                parseISO(start).getTime()) /
                                1000,
                            ),
                          )}
                        </Text>
                      ) : null}
                      <Text size="xs" className="inline-block align-middle">
                        {formatSession([start, end])}
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      variant="link"
                      className="rounded-full p-2"
                      action="secondary"
                      onPress={() => {
                        removeSession(index);
                      }}
                    >
                      <ButtonIcon as={X} />
                    </Button>
                  </HStack>
                </Card>
              );
            }}
          />
        ) : null}
        <Button variant="outline" action="negative" onPress={clearSessions}>
          <ButtonText>Cancel Session</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
