import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  RefreshControlProps,
} from "react-native";
import { VStack } from "../vstack";

interface ScreenWrapperProps extends React.ComponentProps<typeof SafeAreaView> {
  refreshControlProps?: RefreshControlProps;
}

export function ScreenWrapper({
  className,
  children,
  refreshControlProps,
  ...rest
}: ScreenWrapperProps) {
  return (
    <SafeAreaView
      className={`flex flex-1 bg-background-100 p-3 ${className}`}
      {...rest}
    >
      <VStack className="flex h-full justify-between px-4">
        <ScrollView
          className="flex"
          contentContainerClassName="grow"
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={() => {}}
              {...refreshControlProps}
            />
          }
        >
          {children}
        </ScrollView>
      </VStack>
    </SafeAreaView>
  );
}
