import { ScrollViewScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { AuthTokenForm } from "@/features/authentication/components/AuthTokenForm";
import { getAuthToken } from "@/features/authentication/util/getAuthToken";
import { useEffect, useState } from "react";

export default function Player() {
  const [apiKey, setApiKey] = useState("");

  const loadApiKey = async () => {
    const key = await getAuthToken();
    setApiKey(key || "");
  };

  useEffect(() => {
    loadApiKey();
  }, []);

  return (
    <ScrollViewScreenWrapper>
      <AuthTokenForm value={apiKey} onChangeText={setApiKey} />
    </ScrollViewScreenWrapper>
  );
}
