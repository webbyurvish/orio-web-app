export type CheckoutProductKind = "credits_pack" | "subscription" | "lifetime";

export type CheckoutProduct = {
  id: string;
  kind: CheckoutProductKind;
  title: string;
  subtitle: string;
  amountInr: string;
  amountUsd: string;
  creditsDelta?: number;
  planShortLabel?: string;
};

export const CHECKOUT_PRODUCTS: Record<string, CheckoutProduct> = {
  credits_basic: {
    id: "credits_basic",
    kind: "credits_pack",
    title: "Basic — call credits",
    subtitle: "3 call credits",
    amountInr: "₹2,650",
    amountUsd: "$29.50",
    creditsDelta: 3,
  },
  credits_plus: {
    id: "credits_plus",
    kind: "credits_pack",
    title: "Plus — call credits",
    subtitle: "6 call credits + 2 free",
    amountInr: "₹5,300",
    amountUsd: "$59.00",
    creditsDelta: 8,
  },
  credits_pro: {
    id: "credits_pro",
    kind: "credits_pack",
    title: "Pro — call credits",
    subtitle: "9 call credits + 6 free",
    amountInr: "₹7,950",
    amountUsd: "$88.50",
    creditsDelta: 15,
  },
  sub_monthly: {
    id: "sub_monthly",
    kind: "subscription",
    title: "Monthly subscription",
    subtitle: "Unlimited calls — billed monthly",
    amountInr: "₹6,730",
    amountUsd: "$74.90 / mo",
    planShortLabel: "Monthly",
  },
  sub_yearly: {
    id: "sub_yearly",
    kind: "subscription",
    title: "Yearly subscription",
    subtitle: "Unlimited calls — billed yearly",
    amountInr: "₹20,190",
    amountUsd: "$224.90 / yr",
    planShortLabel: "Yearly",
  },
  lifetime: {
    id: "lifetime",
    kind: "lifetime",
    title: "Lifetime access",
    subtitle: "Unlimited calls — one-time payment",
    amountInr: "₹40,990",
    amountUsd: "$449.90 once",
  },
};
