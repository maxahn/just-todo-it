import { useEffect, useState } from "react";
import { AppState } from "react-native";

const useAppState = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppState["currentState"]) => {
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    return () => subscription.remove();
  }, []);

  return appState; // Returns 'active', 'background', or 'inactive', 'unknown', 'extension'
};

export default useAppState;
