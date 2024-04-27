import { Api } from "@/api/client-sdk/Api";

export const apiClient = new Api({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
});
