// HTTP 客户端封装
// 当前为 mock 实现，后续替换为真实 API 调用

type RequestOptions = {
  headers?: Record<string, string>;
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export const http = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { method: "DELETE", ...options }),
};
