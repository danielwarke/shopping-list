import { Api } from "@/api/client-sdk/Api";

export const apiClient = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
});

apiClient.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
