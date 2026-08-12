const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

type ApiRequestOptions = RequestInit & {
  token?: string;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { token, ...requestOptions } = options;

  const headers = new Headers(requestOptions.headers);

  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...requestOptions,
    headers,
  });

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}