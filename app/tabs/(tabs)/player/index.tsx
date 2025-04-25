import { Button, ButtonText } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { ScrollViewScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { AuthTokenForm } from "@/features/authentication/components/AuthTokenForm";
import { getAuthToken } from "@/features/authentication/util/getAuthToken";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { useEffect, useState } from "react";

export default function Player() {
  const [apiKey, setApiKey] = useState("");
  const router = useRouter();

  const loadApiKey = async () => {
    const key = await getAuthToken();
    setApiKey(key || "");
  };

  useEffect(() => {
    loadApiKey();
  }, []);

  return (
    <ScrollViewScreenWrapper className="flex flex-col justify-end">
      <Box>
        <Text>Expo Build Number: 0.1.3</Text>
      </Box>
      <Box className="flex-1" />
      <Button
        className="mb-8"
        variant="outline"
        onPress={() => router.push("/tabs/player/debug-tinybase")}
      >
        <ButtonText>Debug Tinybase DB</ButtonText>
      </Button>
      <AuthTokenForm
        value={apiKey}
        onChangeText={setApiKey}
        containerProps={{ className: "flex-0 pb-16" }}
      />
    </ScrollViewScreenWrapper>
  );
}
