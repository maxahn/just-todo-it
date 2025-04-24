import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { Tag } from "@/features/stats/components/Tag";
import { FULL_DATE_FORMAT } from "@/util/date/FORMAT";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { FlatList, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Box } from "@/components/ui/box";
import { StatCard } from "@/features/stats/components/StatCard";
import { TimestampFilter } from "@/store/hooks/queries/useTasks";
import { secondsToHoursMinutes } from "@/features/tasks/utils/formatTime";
import { CompletedTaskCard } from "@/features/stats/components/CompletedTaskCard";
import { useCompletedTasksTable } from "@/store/hooks/queries/useTasks";
import { VStack } from "@/components/ui/vstack";

type RangeFilter = TimestampFilter;

const RangeFilters: { label: string; value: RangeFilter }[] = [
  { label: "Yesterday", value: "yesterday" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "lastWeek" },
  { label: "This Month", value: "thisMonth" },
];

const RangeFilterLabels: Record<RangeFilter, { label: string; value: string }> =
  {
    today: {
      label: "Today's Work",
      value: format(new Date(), FULL_DATE_FORMAT),
    },
    yesterday: {
      label: "Yesterday's Work",
      value: format(
        new Date().setDate(new Date().getDate() - 1),
        FULL_DATE_FORMAT,
      ),
    },
    lastWeek: { label: "Last Week's Work", value: "" },
    thisWeek: { label: "This Week's Work", value: "" },
    thisMonth: { label: "This Month's Work", value: "" },
    thisYear: { label: "This Year's Work", value: "" },
  };

export default function Summary() {
  const [selectedRangeFilter, setSelectedRangeFilter] =
    useState<RangeFilter>("today");

  const completedTasksTable = useCompletedTasksTable(selectedRangeFilter);

  const completedTasks = Object.entries(completedTasksTable)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, task]) => task)
    .sort((a, b) =>
      b.lastCompletedAt > a.lastCompletedAt
        ? 1
        : b.lastCompletedAt < a.lastCompletedAt
          ? -1
          : 0,
    );

  const totalTimeSpent = useMemo(() => {
    let sum = 0;
    for (const taskId in completedTasksTable) {
      const task = completedTasksTable[taskId];
      console.log(task);
      sum += task?.durationInSeconds || 0;
    }
    return sum;
  }, [completedTasksTable]);

  return (
    <ScreenWrapper containerClassName="gap-4 pt-6 justify-start">
      <HStack className="justify-between items-end">
        <Heading size="2xl">
          {RangeFilterLabels[selectedRangeFilter]?.label}
        </Heading>
        <Text className="mb-1">
          {RangeFilterLabels[selectedRangeFilter]?.value}
        </Text>
      </HStack>
      <VStack className="flex-0 ">
        <ScrollView horizontal contentContainerClassName="gap-2">
          {RangeFilters.map((filter) => (
            <Tag
              key={filter.value}
              isActive={selectedRangeFilter === filter.value}
              onPress={() => setSelectedRangeFilter(filter.value)}
              label={filter.label}
            />
          ))}
        </ScrollView>
      </VStack>
      <HStack className="gap-2">
        <StatCard
          value={`${Object.values(completedTasksTable).length || 0}`}
          description="Tasks Completed"
          Icon={<AntDesign name="checkcircle" size={24} color="white" />}
          className="flex-1"
        />
        <StatCard
          value={secondsToHoursMinutes(totalTimeSpent) || "0m"}
          description="Time Spent"
          Icon={<AntDesign name="clockcircle" size={24} color="white" />}
          className="flex-1"
        />
      </HStack>
      <VStack className="flex-1 gap-4">
        <Heading>COMPLETED TASKS</Heading>
        <FlatList
          data={completedTasks}
          contentContainerClassName="pb-4"
          ItemSeparatorComponent={() => <Box className="h-2" />}
          renderItem={({ item }) => <CompletedTaskCard task={item} />}
        />
      </VStack>
    </ScreenWrapper>
  );
}
