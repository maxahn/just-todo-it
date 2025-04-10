import { Input, InputField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";

export default function TodoistAuth() {
  return (
    <VStack>
      <Input variant="outline" size="md">
        <InputField placeholder="Enter Todoist API token here" />
      </Input>
    </VStack>
  );
}
