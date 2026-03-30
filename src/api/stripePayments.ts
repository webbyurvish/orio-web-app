import axios from "axios";
import apiClient from "./client";

export type StripeCheckoutOptions = {
  checkoutCurrency: "USD" | "INR";
  upiEnabled: boolean;
};

export async function fetchStripeCheckoutOptions(): Promise<StripeCheckoutOptions> {
  const { data } = await apiClient.get<StripeCheckoutOptions>(
    "/payments/stripe/checkout-options",
  );
  return data;
}

export async function createStripeCheckoutSession(
  productId: string,
  billingTab: string,
): Promise<string> {
  const { data } = await apiClient.post<{ url: string }>(
    "/payments/stripe/create-checkout-session",
    { productId, billingTab },
  );
  return data.url;
}

export type VerifyStripeSessionResult = {
  paid: boolean;
  productId?: string;
  sessionId?: string;
};

export async function verifyStripeCheckoutSession(
  sessionId: string,
): Promise<VerifyStripeSessionResult> {
  const { data } = await apiClient.get<VerifyStripeSessionResult>(
    "/payments/stripe/verify-session",
    { params: { sessionId } },
  );
  return data;
}

export function stripeCheckoutErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data as { message?: string } | undefined;
    if (d?.message) return d.message;
    if (err.response?.status === 503)
      return "Stripe is not configured on the server (add Stripe:SecretKey).";
    if (err.response?.status === 401) return "Please sign in again.";
  }
  return "Could not start checkout. Try again or use the demo option below.";
}
