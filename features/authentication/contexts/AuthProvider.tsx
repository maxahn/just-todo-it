import { createContext, ProviderProps, useEffect, useState } from "react";
import {
  getAuthToken,
  setAuthToken as saveAuthToken,
} from "../util/getAuthToken";
import { usePathname, useRouter } from "expo-router";

interface AuthContext {
  isInitialized: boolean;
  isLoggedIn: boolean;
  authToken: string | null;
  initializeAuthState: (token?: string) => Promise<void>;
  setAuthToken: (token: string) => void;
}

export const AuthContext = createContext<AuthContext>({
  isInitialized: false,
  isLoggedIn: false,
  authToken: null,
  initializeAuthState: async () => {},
  setAuthToken: () => {},
});

export default function AuthProvider(
  props: Omit<ProviderProps<AuthContext>, "value">,
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [authToken, setToken] = useState<string | null>(null);
  const isLoggedIn = Boolean(authToken);
  const router = useRouter();
  const pathname = usePathname();

  const initializeAuthState = async (initToken?: string) => {
    const token = initToken ? initToken : await getAuthToken();
    setToken(token);
    setIsInitialized(true);
  };

  const setAuthToken = async (token: string) => {
    await saveAuthToken(token);
    setToken(token);
  };

  const redirectUser = () => {
    if (!isInitialized) return;
    const isAuthenticatedPath =
      !pathname.includes("/authenticate") && pathname.includes("/tabs");
    // If user is not logged in and is on an authenticated path, redirect to login
    if (!isLoggedIn && isAuthenticatedPath) {
      router.push("/tabs/authenticate");
      return;
    }
    // If user is logged in and is on the login page, redirect to the home page
    if (isLoggedIn && !isAuthenticatedPath) {
      router.push("/tabs/(tabs)/current-task");
      return;
    }
  };

  useEffect(() => {
    initializeAuthState();
  }, []);

  useEffect(() => {
    redirectUser();
  }, [authToken, isInitialized]);

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isLoggedIn,
        authToken,
        initializeAuthState,
        setAuthToken,
      }}
      {...props}
    />
  );
}
