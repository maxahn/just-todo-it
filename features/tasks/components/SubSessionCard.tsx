import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { Card } from "@/components/ui/card";
import { ButtonIcon } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { parseISO } from "date-fns";
import { X } from "lucide-react-native";
import { useResultRow } from "tinybase/ui-react";
import { SubSession } from "../types";
import { secondsToFormattedTime, formatSession } from "../utils/formatTime";

type SessionCardProps = {
  subSessionId: string;
  queryId: string;
  onRemove: (id: string) => void;
} & React.ComponentProps<typeof Card>;

export function SubSessionCard({
  queryId,
  subSessionId,
  onRemove,
  ...rest
}: SessionCardProps) {
  const subSession = useResultRow(queryId, subSessionId) as SubSession;
  const { start, end } = subSession;
  return (
    <Card key={subSessionId} {...rest}>
      <HStack className="flex justify-between items-center">
        <VStack className="flex align-center">
          {end ? (
            <Text className="text-bold">
              {secondsToFormattedTime(
                Math.floor(
                  (parseISO(end).getTime() - parseISO(start).getTime()) / 1000,
                ),
              )}
            </Text>
          ) : null}
          <Text size="xs" className="inline-block align-middle">
            {formatSession([start, end || null])}
          </Text>
        </VStack>
        <Button
          size="sm"
          variant="link"
          className="rounded-full p-2"
          action="secondary"
          onPress={() => {
            onRemove(subSessionId);
          }}
        >
          <ButtonIcon as={X} />
        </Button>
      </HStack>
    </Card>
  );
}
