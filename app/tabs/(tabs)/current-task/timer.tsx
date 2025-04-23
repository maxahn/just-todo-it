import { useKeepAwake } from "expo-keep-awake";
import { useTasksAndSessions } from "@/features/tasks/hooks/useActiveMission";
import TaskTimer from "@/features/tasks/components/TaskTimer";
import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { VStack } from "@/components/ui/vstack";

export default function Timer() {
  const { activeTaskId, activeSessionId } = useTasksAndSessions();
  useKeepAwake();

  return (
    <ScreenWrapper>
      <VStack className="flex flex-1 justify-center">
        <TaskTimer taskId={activeTaskId} sessionId={activeSessionId} />
      </VStack>
    </ScreenWrapper>
  );
}
