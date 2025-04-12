import { createContext, ProviderProps, useEffect, useState } from "react";
import { getAuthToken } from "../util/getAuthToken";

interface AuthContext {
  isInitialized: boolean;
  isLoggedIn: boolean;
  authToken: string | null;
  initializeAuthState: (token?: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContext>({
  isInitialized: false,
  isLoggedIn: false,
  authToken: null,
  initializeAuthState: async () => {},
});

export default function AuthProvider(
  props: Omit<ProviderProps<AuthContext>, "value">,
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const initializeAuthState = async (initToken?: string) => {
    const token = initToken ? initToken : await getAuthToken();
    setAuthToken(token);
    setIsLoggedIn(Boolean(token));
    setIsInitialized(true);
  };

  useEffect(() => {
    initializeAuthState();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isInitialized,
        isLoggedIn,
        authToken,
        initializeAuthState,
      }}
      {...props}
    />
  );
}
