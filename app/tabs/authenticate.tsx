import { ScrollViewScreenWrapper } from "@/components/ui/wrapper/ScreenWrapper";
import { AuthTokenForm } from "@/features/authentication/components/AuthTokenForm";
import { useState } from "react";

export default function Authenticate() {
  const [value, setValue] = useState("");

  return (
    <ScrollViewScreenWrapper>
      <AuthTokenForm value={value} onChangeText={setValue} />
    </ScrollViewScreenWrapper>
  );
}
