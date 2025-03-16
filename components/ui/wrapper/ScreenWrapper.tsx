import { SafeAreaView } from "react-native";

export function ScreenWrapper({
  className,
  ...rest
}: React.ComponentProps<typeof SafeAreaView>) {
  return (
    <SafeAreaView
      className={`flex flex-1 bg-background-100 ${className}`}
      {...rest}
    />
  );
}
