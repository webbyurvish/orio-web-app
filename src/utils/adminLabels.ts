import { CHECKOUT_PRODUCTS } from "../billing/plans";

/** Turn snake_case, kebab-case, or SCREAMING_SNAKE into Title Case words. */
export function humanizeAdminIdentifier(raw: string | null | undefined): string {
  if (raw == null) return "";
  const s = String(raw).trim();
  if (!s) return "";

  return s
    .split(/[_\s-]+/g)
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (lower === "ai") return "AI";
      if (lower === "api") return "API";
      if (lower === "id") return "ID";
      if (lower === "usd") return "USD";
      if (lower === "mrr") return "MRR";
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    })
    .join(" ");
}

/** Empty / missing → em dash (for KPIs). */
export function formatAdminDisplayValue(raw: string | null | undefined): string {
  const s = raw == null ? "" : String(raw).trim();
  if (!s) return "—";
  return humanizeAdminIdentifier(s);
}

/** Stripe / catalog product id → checkout title when known, else humanized id. */
export function formatAdminProductId(id: string | null | undefined): string {
  if (id == null) return "—";
  const k = String(id).trim();
  if (!k) return "—";
  const p = CHECKOUT_PRODUCTS[k];
  if (p?.title) return p.title;
  return humanizeAdminIdentifier(k);
}

/** Analytics event type → readable label. */
export function formatAdminEventType(eventType: string): string {
  return humanizeAdminIdentifier(eventType);
}

/** Optional comma-separated or JSON-ish tags from feedback. */
export function formatAdminSentimentTags(tags: string | null | undefined): string | null {
  if (tags == null) return null;
  const t = String(tags).trim();
  if (!t) return null;
  try {
    const parsed = JSON.parse(t) as unknown;
    if (Array.isArray(parsed)) {
      return parsed.map((x) => humanizeAdminIdentifier(String(x))).join(" · ");
    }
  } catch {
    /* fall through */
  }
  return t
    .split(/[,;|]/g)
    .map((x) => humanizeAdminIdentifier(x.trim()))
    .filter(Boolean)
    .join(" · ");
}

const ADMIN_ROUTE_TITLES: Record<string, string> = {
  "": "Overview",
  users: "Users",
  subscriptions: "Subscriptions",
  usage: "Usage",
  ai: "AI metrics",
  funnel: "Funnel",
  feedback: "Feedback",
  system: "System",
};

export function adminPageTitleFromPath(pathname: string): string {
  const segment = pathname.replace(/^\/?admin\/?/, "").split("/").filter(Boolean)[0] ?? "";
  return ADMIN_ROUTE_TITLES[segment] ?? (humanizeAdminIdentifier(segment) || "Overview");
}
