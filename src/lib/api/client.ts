import { apiFetch } from "@/lib/api/fetcher";
import { getClientAccessToken } from "@/lib/auth/client";
import { buildApiUrl } from "./utils";

interface ClientApiOptions extends RequestInit {
  version?: string;
  requireAuth?: boolean;
}

/**
 * Client-side API client for making authenticated requests to the server.
 * Automatically includes the access token in the Authorization header if required.
 *
 * @param path - The API endpoint path (e.g., "/users/me")
 * @param options - Additional fetch options, including version and auth requirement
 * @returns The response data from the API
 */
export async function clientApiClient<T>(
  path: string,
  options: ClientApiOptions = {},
): Promise<T> {
  const { version, requireAuth = true, headers, ...rest } = options;

  const token = requireAuth ? await getClientAccessToken() : null;

  return apiFetch<T>(buildApiUrl(path, version), {
    ...rest,
    headers: {
      ...(headers ?? {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
