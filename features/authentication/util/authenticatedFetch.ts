import { getAuthToken } from "./getAuthToken";

export async function authenticatedFetch<T>(
  path: string,
  init?: Parameters<typeof fetch>[1],
  token?: string,
) {
  const authToken = !token ? await getAuthToken() : token;
  if (!authToken) throw new Error("Auth token not provided.");
  const response = await fetch(`https://api.todoist.com/rest/v2${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText || "Network response was not ok");
  }

  const status = response.status;
  // Status codes that never have a body
  if (status === 204 || status === 205 || status === 304) {
    return;
  }
  return response.json() as Promise<T>;
}
