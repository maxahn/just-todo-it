import { authenticatedFetch } from "./authenticatedFetch";

export async function authenticatedPost<T>(
  path: string,
  init?: Parameters<typeof fetch>[1],
  token?: string,
) {
  return await authenticatedFetch<T>(
    path,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      ...init,
    },
    token,
  );
}
