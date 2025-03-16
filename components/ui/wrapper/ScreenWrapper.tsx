import { SafeAreaView } from "react-native";
import { VStack } from "../vstack";

export function ScreenWrapper({
  className,
  children,
  ...rest
}: React.ComponentProps<typeof SafeAreaView>) {
  return (
    <SafeAreaView
      className={`flex flex-1 bg-background-100 p-3 ${className}`}
      {...rest}
    >
      <VStack className="flex h-full justify-between px-4">{children}</VStack>
    </SafeAreaView>
  );
}
