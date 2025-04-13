import { ButtonText, ButtonSpinner } from "@/components/ui/button";
import { IInputFieldProps, ToggleSecureTextField } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { setAuthToken } from "../util/getAuthToken";
import { useState } from "react";
import { Link } from "@/components/ui/link";

interface AuthTokenFormProps extends IInputFieldProps {
  onSubmit?: () => void;
}

export function AuthTokenForm({
  onSubmit,
  value,
  ...rest
}: AuthTokenFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async () => {
    try {
      if (!value) throw new Error("Please enter a value");
      setIsSaving(true);
      await setAuthToken(value);
      if (onSubmit) onSubmit();
    } catch (error: any) {
      console.log({ error });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <VStack className="h-full flex justify-center" space="xl">
      <VStack space="xs">
        <Link href="https://www.todoist.com/help/articles/find-your-api-token-Jpzx9IIlB">
          <Text className="text-info-400">
            Instructions to get Todoist API key here
          </Text>
        </Link>
        <Text className="text-typography-500">API Key</Text>
        <ToggleSecureTextField
          variant="outline"
          size="md"
          inputFieldProps={{
            placeholder: "Enter Todoist API token here",
            value,
            ...rest,
          }}
        />
      </VStack>
      <Button onPress={handleSubmit}>
        <ButtonText>Save</ButtonText>
        {isSaving ? <ButtonSpinner /> : null}
      </Button>
    </VStack>
  );
}
