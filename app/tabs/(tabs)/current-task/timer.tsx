import { useTasksAndSessions } from "@/features/tasks/hooks/useActiveMission";
import TaskTimer from "@/features/tasks/components/TaskTimer";
import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { VStack } from "@/components/ui/vstack";

export default function Timer() {
  const { activeTaskId } = useTasksAndSessions();

  return (
    <ScreenWrapper>
      <VStack className="flex flex-1 justify-center">
        <TaskTimer id={activeTaskId} />
      </VStack>
    </ScreenWrapper>
  );
}
