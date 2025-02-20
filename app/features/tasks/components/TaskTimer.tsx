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
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { ChevronDown, ChevronUp, X } from "lucide-react-native";
import { formatSession, secondsToFormattedTime } from "../utils/formatTime";
import { parseISO } from "date-fns";
import Animated, { LinearTransition } from "react-native-reanimated";
import { useCompleteTaskMutation } from "../hooks/useCompleteTaskMutation";
import { storeData } from "@/app/util/localStorage/setData";
import { useQueryClient } from "@tanstack/react-query";

export default function TaskTimer() {
  const [sessionsVisible, setSessionsVisible] = useState(false);
  const { mutateAsync: completeTask, isPending: isCompleting } =
    useCompleteTaskMutation();
  const queryClient = useQueryClient();
  const {
    activeMission,
    sessions,
    getIsActive,
    toggleIsTaskPaused,
    getTotalSessionsDuration,
    removeSession,
    clearSessions,
  } = useActiveMission();
  const estimatedSeconds = activeMission?.duration?.amount
    ? activeMission.duration.amount * 60
    : 25 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(estimatedSeconds);
  const totalSessionsDuration = getTotalSessionsDuration();

  const handleCompleteTask = async () => {
    try {
      if (!activeMission?.id) throw new Error("No active mission");
      const success = await completeTask({ id: activeMission.id });
      if (success) {
        const savingTaskData = storeData(`completedTasks:${activeMission.id}`, {
          sessions,
        });
        const invalidatingTasks = queryClient.invalidateQueries({
          queryKey: ["tasks"],
        });
        // clearActiveMission();
        clearSessions();
        await Promise.all([savingTaskData, invalidatingTasks]);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  return (
    <VStack className="gap-4">
      <Card className="gap-8">
        <HStack>
          <Text className="text-2xl font-bold">{activeMission?.content}</Text>
        </HStack>
        <Stopwatch
          secondsRemaining={secondsRemaining - totalSessionsDuration}
          setSecondsRemaining={setSecondsRemaining}
          estimatedSeconds={estimatedSeconds}
          isPaused={!getIsActive()}
          onToggleIsPaused={toggleIsTaskPaused}
        />
      </Card>

      <Button size="xl" action="positive" onPress={handleCompleteTask}>
        {isCompleting ? <ButtonSpinner color="white" /> : null}
        <ButtonText>Complete Task</ButtonText>
      </Button>

      <VStack className="gap-2">
        <HStack className="flex justify-between items-center">
          <Heading size="xl">Sessions</Heading>
          <Button
            size="xl"
            variant="link"
            className="rounded-full p-2"
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
          <ButtonText>Cancel Task</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
