export type CheckoutProductKind = "credits_pack" | "subscription";

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
    title: "Standard — interviews",
    subtitle: "1 interview credit",
    amountInr: "₹99",
    amountUsd: "$1.10",
    creditsDelta: 1,
  },
  credits_plus: {
    id: "credits_plus",
    kind: "credits_pack",
    title: "Pro — interviews",
    subtitle: "3 interview credits (2 + 1 free)",
    amountInr: "₹199",
    amountUsd: "$2.21",
    creditsDelta: 3,
  },
  credits_pro: {
    id: "credits_pro",
    kind: "credits_pack",
    title: "Pro Max — interviews",
    subtitle: "15 interview credits (10 + 5 free)",
    amountInr: "₹699",
    amountUsd: "$7.77",
    creditsDelta: 15,
  },
  sub_monthly: {
    id: "sub_monthly",
    kind: "subscription",
    title: "Monthly subscription",
    subtitle: "Unlimited calls — billed monthly",
    amountInr: "₹999",
    amountUsd: "$11.10 / mo",
    planShortLabel: "Monthly",
  },
  sub_yearly: {
    id: "sub_yearly",
    kind: "subscription",
    title: "Yearly subscription",
    subtitle: "Unlimited calls — billed yearly",
    amountInr: "₹9,999",
    amountUsd: "$111.10 / yr",
    planShortLabel: "Yearly",
  },
};
