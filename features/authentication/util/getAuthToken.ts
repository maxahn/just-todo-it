import * as SecureStore from "expo-secure-store";

type AuthType = "todoist";

type GetAuthTokenParameters = [authType?: AuthType];
type SetAuthTokenParameters = [value: string, authType?: AuthType];
const KEYS: Record<AuthType, string | undefined> = {
  todoist: "TODOIST_TOKEN",
};

export async function getAuthToken(
  ...[authType = "todoist"]: GetAuthTokenParameters
) {
  const authTypeKey = KEYS[authType];
  if (!authTypeKey) throw new Error(`Invalid auth type of "${authType}" used`);
  return SecureStore.getItemAsync(authTypeKey);
}

export async function setAuthToken(
  ...[value, authType = "todoist"]: SetAuthTokenParameters
) {
  const authTypeKey = KEYS[authType];
  if (!authTypeKey) throw new Error(`Invalid auth type of "${authType}" used`);
  return SecureStore.setItemAsync(authTypeKey, value);
}
