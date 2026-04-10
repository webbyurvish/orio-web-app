import apiClient from "./client";

export async function submitFeedback(message: string): Promise<void> {
  await apiClient.post("/feedback", { message });
}
