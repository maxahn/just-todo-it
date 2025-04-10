import { createContext, ProviderProps, useEffect, useState } from "react";
import { getAuthToken } from "../util/getAuthToken";

interface AuthContext {
  isInitialized: boolean;
  isLoggedIn: boolean;
  authToken: string | null;
  initializeAuthState: (token?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContext>({
  isInitialized: false,
  isLoggedIn: false,
  authToken: null,
  initializeAuthState: async () => {},
});

export default function AuthProviderContext(
  props: Omit<ProviderProps<AuthContext>, "value">,
) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  const initializeAuthState = async (initToken?: string) => {
    setIsInitialized(true);
    if (initToken) {
      setAuthToken(initToken);
      setIsLoggedIn(Boolean(initToken));
      return;
    }
    const token = await getAuthToken();
    setAuthToken(token);
    setIsLoggedIn(Boolean(token));
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
