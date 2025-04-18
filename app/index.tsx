import React from "react";

import { Redirect, useRootNavigationState } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "../features/authentication/hooks/useAuth";

export default function Home() {
  const rootNavigationState = useRootNavigationState();
  const { isInitialized, isLoggedIn } = useAuth();

  if (!isInitialized || !rootNavigationState.key) {
    return (
      <VStack className="flex justify-center items-center h-full">
        <Spinner />
      </VStack>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="./authenticate" />;
  }

  return <Redirect href="/tabs/(tabs)/current-task" />;
}
