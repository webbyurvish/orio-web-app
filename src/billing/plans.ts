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
    amountInr: "₹899",
    amountUsd: "$9.99",
    creditsDelta: 3,
  },
  credits_plus: {
    id: "credits_plus",
    kind: "credits_pack",
    title: "Plus — call credits",
    subtitle: "6 call credits + 2 free",
    amountInr: "₹1,499",
    amountUsd: "$16.65",
    creditsDelta: 8,
  },
  credits_pro: {
    id: "credits_pro",
    kind: "credits_pack",
    title: "Pro — call credits",
    subtitle: "9 call credits + 4 free",
    amountInr: "₹2,499",
    amountUsd: "$27.77",
    creditsDelta: 13,
  },
  sub_monthly: {
    id: "sub_monthly",
    kind: "subscription",
    title: "Monthly subscription",
    subtitle: "Unlimited calls — billed monthly",
    amountInr: "₹1,999",
    amountUsd: "$22.21 / mo",
    planShortLabel: "Monthly",
  },
  sub_yearly: {
    id: "sub_yearly",
    kind: "subscription",
    title: "Yearly subscription",
    subtitle: "Unlimited calls — billed yearly",
    amountInr: "₹12,999",
    amountUsd: "$144.43 / yr",
    planShortLabel: "Yearly",
  },
  lifetime: {
    id: "lifetime",
    kind: "lifetime",
    title: "Lifetime access",
    subtitle: "Unlimited calls — one-time payment",
    amountInr: "₹19,999",
    amountUsd: "$222.21 once",
  },
};
