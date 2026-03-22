"use server";

import { getServerAccessToken } from "@/lib/auth/server";
import { apiFetch } from "./fetcher";
import { buildApiUrl } from "./utils";

interface ServerApiOptions extends RequestInit {
  version?: string;
  requireAuth?: boolean;
}

/**
 * Server-side API client for making authenticated requests to the backend FastAPI application.
 * Automatically includes the access token if required.
 *
 * @param path - The API endpoint path (relative to the base URL).
 * @param options - Additional request options, including version and auth requirements.
 * @returns A promise that resolves with the response data of type T.
 */
export async function serverApiClient<T>(
  path: string,
  options: ServerApiOptions = {},
): Promise<T> {
  const { version, requireAuth = true, headers, ...rest } = options;

  const token = requireAuth ? await getServerAccessToken() : null;

  return apiFetch<T>(buildApiUrl(path, version), {
    ...rest,
    headers: {
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: rest.cache ?? "no-store",
  });
}
