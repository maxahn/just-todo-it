import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useActiveMission } from "../hooks/useActiveMission";
import Stopwatch from "./Stopwatch";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { VStack } from "@/components/ui/vstack";
import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { X } from "lucide-react-native";
import { formatSession, secondsToFormattedTime } from "../utils/formatTime";
import { parseISO } from "date-fns";

export default function TaskTimer() {
  const {
    activeMission,
    sessions,
    getIsActive,
    toggleIsTaskPaused,
    getTotalSessionsDuration,
    removeSession,
  } = useActiveMission();
  const estimatedSeconds = activeMission?.duration?.amount
    ? activeMission.duration.amount * 60
    : 25 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(estimatedSeconds);
  const totalSessionsDuration = getTotalSessionsDuration();

  console.log({ totalSessionsDuration, estimatedSeconds, sessions });

  return (
    <VStack className="gap-4">
      <Card className="bg-blue-100 gap-8">
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
      <Button size="xl" action="positive">
        <ButtonText>Complete Task</ButtonText>
      </Button>

      <VStack className="gap-2">
        <Heading size="xl">Sessions</Heading>
        {sessions
          ?.map(([start, end], index) => (
            <Card key={`${start}`}>
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
                  <Text size="sm" className="inline-block align-middle">
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
          ))
          .toReversed()}
      </VStack>
    </VStack>
  );
}
