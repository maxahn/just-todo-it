import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTasksAndSessions } from "../hooks/useActiveMission";
import Stopwatch from "./Stopwatch";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
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
import useAppState from "@/hooks/useAppStateChange";
import { TASK_EXTRA_TABLE_ID, TASK_TABLE_ID } from "@/store";
import { useResultSortedRowIds, useRow } from "tinybase/ui-react";
import { Task, TaskExtra } from "../types";
import { QUERY_ID } from "@/store/queries";
import { useActiveTaskSessionsTable } from "@/store/hooks/queries/useActiveSessionsQuery";
import { sumSessionsDurationTable } from "../utils/sumSessionsDurationMs";
import { Redirect } from "expo-router";

const DEFAULT_ESTIMATE_SECONDS = 25 * 60;
function getEstimateSeconds(duration: number | undefined) {
  return duration ? duration * 60 : DEFAULT_ESTIMATE_SECONDS;
}

interface TaskTimerProps {
  id: string;
}

export default function TaskTimer({ id }: TaskTimerProps) {
  const task = useRow(TASK_TABLE_ID, id) as Task;
  const taskExtra = useRow(TASK_EXTRA_TABLE_ID, id) as TaskExtra;
  const sessions = useResultSortedRowIds(
    QUERY_ID.activeTaskSessions,
    "start",
    false,
  );
  const sessionsTable = useActiveTaskSessionsTable(id);

  const [sessionsVisible, setSessionsVisible] = useState(false);
  const [offset, setOffset] = useState(0);
  const {
    isTimerPaused,
    completeTask,
    toggleIsTaskPaused,
    activeSessionId,
    removeSession,
    cancelSession,
    activeTaskId,
  } = useTasksAndSessions();
  const appState = useAppState();
  const estimatedSeconds = getEstimateSeconds(taskExtra?.estimatedDuration);

  const handleCompleteTask = async () => {
    try {
      if (!id) throw new Error("No active task");
      await completeTask(id);
    } catch (error) {
      console.log({ error });
    }
  };

  const handleCancelSession = () => {
    cancelSession();
  };

  useEffect(() => {
    if (appState === "active" && id) {
      const totalSessionsDuration = sumSessionsDurationTable(sessionsTable); // getTotalSessionsDuration();
      setOffset(-totalSessionsDuration);
    }
  }, [appState, sessionsTable]);

  if (!activeSessionId || !activeTaskId)
    return <Redirect href="/tabs/(tabs)/current-task" />;

  return (
    <VStack className="flex items-center gap-6 py-5">
      <VStack className="flex gap-3 items-center">
        <Heading size="xl">{task?.content}</Heading>
        <Heading size="lg" className="text-primary-300">
          {task?.description}
        </Heading>
      </VStack>
      <Stopwatch
        offset={offset}
        estimatedSeconds={estimatedSeconds}
        isPaused={isTimerPaused}
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
            as={isTimerPaused ? PlayIcon : PauseIcon}
          />
        </Button>

        <Button
          size="lg"
          action="positive"
          className="rounded-full w-16 h-16"
          onPress={handleCompleteTask}
        >
          <ButtonIcon className="w-7 h-7" as={CheckIcon} />
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
        <Button
          variant="outline"
          action="negative"
          onPress={handleCancelSession}
        >
          <ButtonText>Cancel Session</ButtonText>
        </Button>
      </VStack>
    </VStack>
  );
}
