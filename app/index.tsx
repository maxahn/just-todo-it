import React from "react";

import { Redirect, useRootNavigationState } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";

export default function Home() {
  const rootNavigationState = useRootNavigationState();
  if (!rootNavigationState.key)
    return (
      <VStack className="flex justify-center items-center h-full">
        <Spinner />
      </VStack>
    );

  return <Redirect href="/tabs" />;
}
