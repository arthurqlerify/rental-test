const BASE_URL = "/api/v1";

interface ApiResponse<T> {
  data: T;
  error: string | null;
}

const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
    return { data: null as T, error: errorData.message || response.statusText };
  }
  return { data: await response.json(), error: null };
};

export const api = {
  get: async <T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });
    return handleResponse(response);
  },

  post: async <T>(path: string, body: unknown, options?: RequestInit): Promise<ApiResponse<T>> => {
    const response = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...options,
    });
    return handleResponse(response);
  },
};