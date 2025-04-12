import { ScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { AuthTokenForm } from "@/features/authentication/components/AuthTokenForm";
import { useRouter } from "expo-router";
import { useState } from "react";

export default function Authenticate() {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <ScreenWrapper>
      <AuthTokenForm
        value={value}
        onChangeText={setValue}
        onSubmit={() => {
          router.push("/");
        }}
      />
    </ScreenWrapper>
  );
}
