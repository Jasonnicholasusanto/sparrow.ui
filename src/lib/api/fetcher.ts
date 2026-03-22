import { ApiError } from "./errors";

/**
 * A utility function to make API requests with proper error handling and response parsing.
 *
 * @param url - The URL to which the request is sent
 * @param options - Optional fetch options (method, headers, body, etc.)
 * @returns A promise that resolves to the parsed response data of type T
 * @throws ApiError if the response status is not OK (2xx)
 */
export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(options.headers ?? {}),
    },
  });

  const rawBody = await res.text();

  let parsedBody: unknown = null;
  try {
    parsedBody = rawBody ? JSON.parse(rawBody) : null;
  } catch {
    parsedBody = rawBody;
  }

  if (!res.ok) {
    const message =
      (parsedBody as any)?.detail ||
      (parsedBody as any)?.error ||
      (typeof parsedBody === "string" ? parsedBody : null) ||
      `Request failed with status ${res.status}`;

    throw new ApiError(
      message,
      res.status,
      typeof parsedBody === "string" ? parsedBody : JSON.stringify(parsedBody),
    );
  }

  return parsedBody as T;
}
