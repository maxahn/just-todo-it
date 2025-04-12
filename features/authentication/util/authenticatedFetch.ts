import { getAuthToken } from "./getAuthToken";

export async function authenticatedFetch<T>(
  path: string,
  init?: Parameters<typeof fetch>[1],
  token?: string,
) {
  const authToken = !token ? await getAuthToken() : token;
  console.log({ authToken });
  if (!authToken) throw new Error("Auth token not provided.");
  const response = await fetch(`https://api.todoist.com/rest/v2${path}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      ...init?.headers,
    },
    ...init,
  });
  console.log({ response });
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<T>;
}
