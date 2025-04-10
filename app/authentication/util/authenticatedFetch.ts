export async function authenticatedFetch<T>(
  path: string,
  init: Parameters<typeof fetch>[1],
  token: string,
) {
  const response = await fetch(
    `https://api.todoist.com/rest/v2/tasks/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      ...init,
    },
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<T>;
}
