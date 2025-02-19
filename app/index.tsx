import React from "react";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";

import { Redirect, useRootNavigationState } from "expo-router";
import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";

const FeatureCard = ({ iconSvg: IconSvg, name, desc }: any) => {
  return (
    <Box
      className="flex-column border border-w-1 border-outline-700 md:flex-1 m-2 p-4 rounded"
      key={name}
    >
      <Box className="items-center flex flex-row">
        <Text>
          <IconSvg />
        </Text>
        <Text className="text-typography-white font-medium ml-2 text-xl">
          {name}
        </Text>
      </Box>
      <Text className="text-typography-400 mt-2">{desc}</Text>
    </Box>
  );
};

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
