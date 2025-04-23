import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import {
  COMPLETED_TASK_TABLE_ID,
  SESSION_TABLE_ID,
  SUB_SESSION_TABLE_ID,
  TASK_EXTRA_TABLE_ID,
  TASK_TABLE_ID,
} from "@/store";
import { Box } from "@/components/ui/box";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity } from "react-native";
import {
  useStore,
  useSortedRowIds,
  useRow,
  useResultSortedRowIds,
  useResultRow,
} from "tinybase/ui-react";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { useActiveSessionsQuery } from "@/store/hooks/queries/useActiveSessionsQuery";
import { useTasksAndSessions } from "@/features/tasks/hooks/useActiveMission";
import { VStack } from "@/components/ui/vstack";
import { X } from "lucide-react-native";
import {
  useSortedIncompleteUnskippedTasks,
  useCompletedTaskSessionsQueryId,
} from "@/store/hooks/queries/useTasks";

export default function Summary() {
  const {
    activeSessionId,
    activeSubSessionId,
    activeTaskId,
    isTimerPaused,
    setActiveTaskId,
    setActiveSubSessionId,
    setActiveSessionId,
  } = useTasksAndSessions();
  const [activeTable, setActiveTable] = useState<string>(TASK_TABLE_ID);
  const [selectedTaskId, setSelectedTaskId] = useState<string>(activeTaskId);
  const queryId = useActiveSessionsQuery(selectedTaskId);
  const store = useStore();
  const unskippedTaskQueryId = useSortedIncompleteUnskippedTasks();
  const completedTaskQueryId = useCompletedTaskSessionsQueryId("yesterday");

  const handleItemPress = (id: string) => {
    switch (activeTable) {
      case SESSION_TABLE_ID:
        // setActiveTable(SUB_SESSION_TABLE_ID);
        break;
      case SUB_SESSION_TABLE_ID:
        // setActiveTable(TASK_TABLE_ID);
        break;
      case TASK_TABLE_ID:
        setSelectedTaskId(id);
        break;
      case COMPLETED_TASK_TABLE_ID:
        setSelectedTaskId(id);
        break;
      case unskippedTaskQueryId:
        break;
      case completedTaskQueryId:
        break;
      default:
        break;
    }
  };

  const handleDeleteTable = () => {
    switch (activeTable) {
      case SESSION_TABLE_ID:
        store?.delTable(SESSION_TABLE_ID);
        break;
      case SUB_SESSION_TABLE_ID:
        store?.delTable(SUB_SESSION_TABLE_ID);
        break;
      case TASK_TABLE_ID:
        store?.delTable(TASK_TABLE_ID);
        break;
      case TASK_EXTRA_TABLE_ID:
        store?.delTable(TASK_EXTRA_TABLE_ID);
        break;
      case COMPLETED_TASK_TABLE_ID:
        store?.delTable(COMPLETED_TASK_TABLE_ID);
        break;
      default:
        break;
    }
  };

  let sortField = undefined;
  let desc = true;
  switch (activeTable) {
    case SUB_SESSION_TABLE_ID:
      sortField = "start";
      desc = true;
      break;
    case TASK_TABLE_ID:
      sortField = "order";
      desc = false;
      break;
    case unskippedTaskQueryId:
      sortField = "order";
      desc = false;
      break;
    case completedTaskQueryId:
      sortField = "lastCompletedAt";
      desc = false;
      break;
    default:
      break;
  }

  useEffect(() => {
    if (queryId) {
      setActiveTable(queryId);
    }
  }, [queryId]);

  return (
    <ScreenWrapper>
      <HStack className="justify-between">
        <Heading>{activeTable}</Heading>
        <Button onPress={handleDeleteTable} action="negative">
          <ButtonText>Delete</ButtonText>
        </Button>
      </HStack>
      {activeTable ? (
        <TableList
          tableId={activeTable}
          onItemPress={handleItemPress}
          sortField={sortField}
          desc={desc}
        />
      ) : (
        <VStack className="gap-1">
          <HStack className="justify-between items-center">
            <Text>Active Task ID: {activeTaskId}</Text>
            <Button
              onPress={() => setActiveTaskId("")}
              action="negative"
              variant="link"
            >
              <ButtonIcon as={X} />
            </Button>
          </HStack>
          <HStack className="justify-between items-center">
            <Text>Active Session ID: {activeSessionId}</Text>
            <Button
              onPress={() => setActiveSessionId("")}
              action="negative"
              variant="link"
            >
              <ButtonIcon as={X} />
            </Button>
          </HStack>
          <HStack className="justify-between items-center">
            <Text>Active Sub Session ID: {activeSubSessionId}</Text>
            <Button
              onPress={() => setActiveSubSessionId("")}
              action="negative"
              variant="link"
            >
              <ButtonIcon as={X} />
            </Button>
          </HStack>
          <Text>Is Timer Paused: {isTimerPaused.toString()}</Text>
        </VStack>
      )}
      <ScrollView horizontal contentContainerClassName="gap-2 max-h-15">
        <HStack className="gap-2">
          <Button isDisabled={!activeTable} onPress={() => setActiveTable("")}>
            <ButtonText>Values</ButtonText>
          </Button>
        </HStack>

        <Button
          isDisabled={activeTable === queryId}
          onPress={() => setActiveTable(queryId)}
        >
          <ButtonText>{queryId || "N/A"}</ButtonText>
        </Button>
        <Button
          isDisabled={activeTable === TASK_TABLE_ID}
          onPress={() => setActiveTable(TASK_TABLE_ID)}
        >
          <ButtonText>Tasks</ButtonText>
        </Button>
        <Button
          isDisabled={activeTable === SESSION_TABLE_ID}
          onPress={() => setActiveTable(SESSION_TABLE_ID)}
        >
          <ButtonText>Sessions</ButtonText>
        </Button>
        <Button
          isDisabled={activeTable === SUB_SESSION_TABLE_ID}
          onPress={() => setActiveTable(SUB_SESSION_TABLE_ID)}
        >
          <ButtonText>Sub Sessions</ButtonText>
        </Button>
        <Button
          isDisabled={activeTable === TASK_EXTRA_TABLE_ID}
          onPress={() => setActiveTable(TASK_EXTRA_TABLE_ID)}
        >
          <ButtonText>Task Extra</ButtonText>
        </Button>
        <Button
          isDisabled={activeTable === unskippedTaskQueryId}
          onPress={() => setActiveTable(unskippedTaskQueryId)}
        >
          <ButtonText>Unskipped Tasks</ButtonText>
        </Button>
        <Button
          isDisabled={activeTable === completedTaskQueryId}
          onPress={() => setActiveTable(completedTaskQueryId)}
        >
          <ButtonText>Completed Tasks</ButtonText>
        </Button>
      </ScrollView>
    </ScreenWrapper>
  );
}

function TableList({
  tableId,
  onItemPress,
  sortField,
  desc,
  ...rest
}: {
  tableId: string;
  onItemPress: (id: string) => void;
  sortField?: string;
  desc?: boolean;
} & Partial<React.ComponentProps<typeof FlatList>>) {
  const sortedRowIds = useSortedRowIds(tableId, sortField, desc) as string[];
  const sortedResultRowIds = useResultSortedRowIds(tableId, sortField, desc);
  console.log({ tableId, sortedResultRowIdsLength: sortedResultRowIds.length });

  const isResultTable = sortedResultRowIds.length > 0;

  return (
    <FlatList
      {...rest}
      style={{ width: "100%" }}
      ItemSeparatorComponent={() => <Box className="h-2" />}
      data={isResultTable ? sortedResultRowIds : sortedRowIds}
      renderItem={({ item }) => (
        <RowCard
          tableId={tableId}
          rowId={item as unknown as string}
          onPressRow={onItemPress}
          isResultTable={isResultTable}
        />
      )}
    />
  );
}

function RowCard({
  tableId,
  rowId,
  onPressRow,
  isResultTable,
  ...rest
}: {
  tableId: string;
  rowId: string;
  onPressRow: (id: string) => void;
  isResultTable?: boolean;
} & React.ComponentProps<typeof Card>) {
  const row = useRow(tableId, rowId);
  const resultRow = useResultRow(tableId, rowId);
  return (
    <Card className="flex flex-row flex-wrap p-1" {...rest}>
      <TouchableOpacity onPress={() => onPressRow(rowId)}>
        <Box className="p-1 border border-gray-200 pr-2">
          <Text>ID: {rowId}</Text>
        </Box>
        {Object.entries(isResultTable ? resultRow : row).map(([key, value]) => (
          <Box key={key} className="p-1 border border-gray-200 pr-2">
            <Text>
              {key}: {value?.toString()}
            </Text>
          </Box>
        ))}
      </TouchableOpacity>
    </Card>
  );
}
