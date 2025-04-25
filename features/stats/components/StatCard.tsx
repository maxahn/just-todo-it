import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

interface StatCardProps extends React.ComponentProps<typeof Card> {
  value: string;
  description: string;
  Icon: React.ReactNode;
}

export function StatCard({
  value,
  description,
  Icon,
  className = "",
  ...props
}: StatCardProps) {
  return (
    <Card
      className={`flex flex-col items-start gap-4 p-5 rounded-xl ${className}`}
      {...props}
    >
      {Icon}
      <VStack className="gap-2">
        <Heading size="3xl">{value}</Heading>
        <Text>{description}</Text>
      </VStack>
    </Card>
  );
}
