import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CheckoutProduct } from "../billing/plans";

type BillingState = {
  credits: number;
  unlimitedAccess: boolean;
  planDisplay: string | null;
  applySuccessfulPurchase: (product: CheckoutProduct) => void;
};

const INITIAL_CREDITS = 2.5;

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      credits: INITIAL_CREDITS,
      unlimitedAccess: false,
      planDisplay: null,
      applySuccessfulPurchase: (product) => {
        if (product.kind === "credits_pack") {
          const delta = product.creditsDelta ?? 0;
          if (delta > 0) {
            set({ credits: get().credits + delta });
          }
          return;
        }
        if (product.kind === "subscription") {
          set({
            unlimitedAccess: true,
            planDisplay: product.planShortLabel ?? "Subscription",
          });
          return;
        }
        if (product.kind === "lifetime") {
          set({
            unlimitedAccess: true,
            planDisplay: "Lifetime",
          });
        }
      },
    }),
    {
      name: "orio-billing-demo",
      partialize: (s) => ({
        credits: s.credits,
        unlimitedAccess: s.unlimitedAccess,
        planDisplay: s.planDisplay,
      }),
    },
  ),
);

export function formatCreditsDisplay(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
