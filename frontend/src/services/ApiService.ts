const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem("token");
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data as T;
}

export const api = {
  get<T>(endpoint: string) {
    return request<T>(endpoint, { method: "GET" });
  },
  post<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, { method: "POST", body });
  },
  patch<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, { method: "PATCH", body });
  },
  put<T>(endpoint: string, body: unknown) {
    return request<T>(endpoint, { method: "PUT", body });
  },
  delete<T>(endpoint: string) {
    return request<T>(endpoint, { method: "DELETE" });
  },
};

export { BASE_URL };
