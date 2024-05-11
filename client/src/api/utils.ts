import { AxiosError } from "axios";

export function getErrorMessages(error: Error | null): string[] {
  if (error && error instanceof AxiosError && error.response?.data.message) {
    const messages = error.response.data.message;
    if (typeof messages === "string") {
      return [messages];
    }

    return messages;
  }

  return [];
}
