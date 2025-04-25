import FontAwesome from "@expo/vector-icons/FontAwesome";
import { StatusBar } from "expo-status-bar";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useLayoutEffect, useState } from "react";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/components/useColorScheme";
import { Slot } from "expo-router";
import { Provider as TinyBaseProvider } from "tinybase/ui-react";

import "../global.css";
import AuthProvider from "../features/authentication/contexts/AuthProvider";
import { store } from "@/store";
import { queries } from "@/store/queries";
import { useAndStartPersister } from "@/store/hooks/useAndStartPersister";
import { TasksProvider } from "@/features/tasks/contexts/TasksContext";

const queryClient = new QueryClient();
export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "gluestack",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const [styleLoaded, setStyleLoaded] = useState(false);
  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useLayoutEffect(() => {
    setStyleLoaded(true);
  }, [styleLoaded]);

  if (!loaded || !styleLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  useAndStartPersister(store);

  return (
    <AuthProvider>
      <TinyBaseProvider store={store} queries={queries}>
        <QueryClientProvider client={queryClient}>
          <TasksProvider>
            <GluestackUIProvider mode={"dark"}>
              <ThemeProvider
                value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
              >
                <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
                <Slot />
              </ThemeProvider>
            </GluestackUIProvider>
          </TasksProvider>
        </QueryClientProvider>
      </TinyBaseProvider>
    </AuthProvider>
  );
}
