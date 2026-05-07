import { create } from "zustand";
import type { CheckoutProduct } from "../billing/plans";

type BillingState = {
  credits: number;
  unlimitedAccess: boolean;
  planDisplay: string | null;
  setCreditsFromServer: (credits: number) => void;
  setEntitlementsFromServer: (unlimitedAccess: boolean, planDisplay?: string | null) => void;
  applySuccessfulPurchase: (product: CheckoutProduct) => void;
};

export const useBillingStore = create<BillingState>()(
  (set, get) => ({
    credits: 0,
    unlimitedAccess: false,
    planDisplay: null,
    setCreditsFromServer: (credits) =>
      set({ credits: Number.isFinite(credits) ? credits : 0 }),
    setEntitlementsFromServer: (unlimitedAccess, planDisplay) =>
      set({
        unlimitedAccess: !!unlimitedAccess,
        planDisplay: unlimitedAccess ? (planDisplay ?? null) : null,
      }),
    applySuccessfulPurchase: (product) => {
      // Stripe verification now applies credits server-side; keep this as a UI fallback for demo/testing.
      if (product.kind === "credits_pack") {
        const delta = product.creditsDelta ?? 0;
        if (delta > 0) set({ credits: get().credits + delta });
        return;
      }
      if (product.kind === "subscription") {
        set({
          unlimitedAccess: true,
          planDisplay: product.planShortLabel ?? "Subscription",
        });
        return;
      }
    },
  }),
);

export function formatCreditsDisplay(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}
