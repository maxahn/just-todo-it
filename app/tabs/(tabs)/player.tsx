import EditScreenInfo from "@/components/EditScreenInfo";
import { Center } from "@/components/ui/center";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

export default function Player() {
  return (
    <Center className="flex-1 p-8">
      <VStack>
        <Text className="text-xl font-bold">
          TODOIST KEY: {process.env.EXPO_PUBLIC_TODOIST_API_KEY}
        </Text>
      </VStack>
    </Center>
  );
}
