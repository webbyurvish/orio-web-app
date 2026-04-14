import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { RevealOnScroll } from "./RevealOnScroll";

/**
 * Competitor figures (~₹) are rounded from the same internal comparison copy used on
 * alternatives / affordable pages; Smeed AI numbers match the live landing pricing config.
 */
const SMEED_PRICING = {
  creditsInr: "899",
  creditsUsd: "9.99",
  monthlyInr: "1,999",
  monthlyUsd: "22.21",
  yearlyInr: "12,999",
  yearlyUsd: "144.43",
  lifetimeInr: "19,999",
  lifetimeUsd: "222.21",
} as const;

type Rival = {
  id: string;
  name: string;
  shortName: string;
  /** Typical advertised tier — approximate */
  anchorInr: string;
  anchorNote: string;
  tone: "violet" | "slate" | "rose";
  bullets: string[];
};

const RIVALS: Rival[] = [
  {
    id: "parakeet",
    name: "Parakeet AI",
    shortName: "Parakeet",
    anchorInr: "~₹2,650",
    anchorNote: "typical monthly-style tier*",
    tone: "violet",
    bullets: ["Real-time help", "Mostly subscription-based", "No flexible credit system"],
  },
  {
    id: "lockedin",
    name: "LockedIn AI",
    shortName: "LockedIn",
    anchorInr: "~₹6,000/mo",
    anchorNote: "typical monthly-style tier*",
    tone: "slate",
    bullets: ["Expensive monthly plans", "Focused on subscriptions", "Lifetime rarely offered"],
  },
  {
    id: "chiku",
    name: "Chiku AI",
    shortName: "Chiku",
    anchorInr: "~₹1,199",
    anchorNote: "advertised entry packs*",
    tone: "rose",
    bullets: ["Pack-based usage", "Limited flexibility", "Feature restrictions on lower plans"],
  },
];

/** Comparison matrix: optional check prefix for positive / affirmative cells */
type ComparisonRow = {
  label: string;
  smeed: string;
  smeedCheck?: boolean;
  smeedBold?: boolean;
  parakeet: string;
  parakeetCheck?: boolean;
  lockedin: string;
  lockedinCheck?: boolean;
  chiku: string;
  chikuCheck?: boolean;
};

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: "Free trial / free credits",
    smeed: "2 Free Credits",
    smeedCheck: true,
    smeedBold: true,
    parakeet: "Limited",
    lockedin: "Yes",
    lockedinCheck: true,
    chiku: "Limited / demo",
  },
  {
    label: "Pricing model",
    smeed: "Credits + Subscription + Lifetime",
    parakeet: "Credits",
    lockedin: "Subscription",
    chiku: "Credits",
  },
  {
    label: "Starting price",
    smeed: "₹899",
    parakeet: "~₹2,650",
    lockedin: "~₹6,000/month",
    chiku: "~₹1,199",
  },
  {
    label: "Unlimited usage",
    smeed: "Yes (subscription)",
    smeedCheck: true,
    parakeet: "No",
    lockedin: "Yes",
    lockedinCheck: true,
    chiku: "No",
  },
  {
    label: "Automation level",
    smeed: "Smart + Assisted",
    parakeet: "Semi-manual",
    lockedin: "Fully automated",
    chiku: "Assisted",
  },
  {
    label: "Real-time response speed",
    smeed: "Fast",
    parakeet: "Fast",
    lockedin: "Very fast",
    chiku: "Fast",
  },
  {
    label: "Coding interview support",
    smeed: "Yes",
    smeedCheck: true,
    parakeet: "Yes",
    parakeetCheck: true,
    lockedin: "Yes",
    lockedinCheck: true,
    chiku: "Yes",
    chikuCheck: true,
  },
  {
    label: "Credits expiry",
    smeed: "Never expire",
    smeedCheck: true,
    parakeet: "Never expire",
    parakeetCheck: true,
    lockedin: "N/A",
    chiku: "Never expire",
    chikuCheck: true,
  },
  {
    label: "Platform compatibility",
    smeed: "All major platforms",
    parakeet: "Major platforms",
    lockedin: "All platforms",
    chiku: "Major platforms",
  },
];

function MatrixCell({
  value,
  check,
  bold,
  variant,
}: {
  value: string;
  check?: boolean;
  bold?: boolean;
  variant: "smeed" | "rival";
}) {
  const checkClass = variant === "smeed" ? "text-teal-400" : "text-slate-500/75";
  const inner =
    bold && variant === "smeed" ? (
      <span className="font-bold text-teal-50">{value}</span>
    ) : variant === "rival" ? (
      <span className="text-slate-500/90 opacity-[0.92]">{value}</span>
    ) : (
      value
    );
  if (check) {
    return (
      <span className="inline-flex items-center justify-center gap-1.5">
        <span className={checkClass} aria-hidden>
          ✓
        </span>
        {inner}
      </span>
    );
  }
  if (variant === "rival") {
    return <span className="text-slate-500/90 opacity-[0.92]">{value}</span>;
  }
  return <>{inner}</>;
}

function toneBorder(t: Rival["tone"]) {
  if (t === "violet") return "border-violet-500/15 hover:border-violet-400/25";
  if (t === "rose") return "border-rose-500/12 hover:border-rose-400/22";
  return "border-white/[0.06] hover:border-white/12";
}

function toneGlow(t: Rival["tone"]) {
  if (t === "violet") return "from-violet-600/8 to-transparent";
  if (t === "rose") return "from-rose-600/8 to-transparent";
  return "from-slate-500/8 to-transparent";
}

const PRICING_SECTION_ID = "pricing";

function scrollToPricingSection(): boolean {
  const el = document.getElementById(PRICING_SECTION_ID);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

const SMEED_VALUE_BULLETS = [
  "2 Full Interview Sessions",
  "Real-time AI responses",
  "No credit card required",
  "Credits never expire",
] as const;

function readLg() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(min-width: 1024px)").matches;
}

export function CompetitorPriceShowdownSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const tryForFreeRoute = isAuthenticated ? "/dashboard" : "/login";
  const navigate = useNavigate();
  const location = useLocation();
  const [isLg, setIsLg] = useState(readLg);
  const [matrixOpen, setMatrixOpen] = useState(readLg);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => {
      const lg = mq.matches;
      setIsLg(lg);
      setMatrixOpen(lg);
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const showMatrix = isLg || matrixOpen;

  const onPlanMatrixClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === "/") {
      void navigate({ pathname: "/", hash: "pricing" });
      let attempts = 0;
      const maxAttempts = 80;
      const tick = () => {
        if (scrollToPricingSection()) return;
        if (attempts < maxAttempts) {
          attempts += 1;
          requestAnimationFrame(tick);
        } else {
          window.setTimeout(() => scrollToPricingSection(), 200);
        }
      };
      requestAnimationFrame(tick);
      return;
    }
    void navigate({ pathname: "/", hash: "pricing" });
  };

  return (
    <RevealOnScroll>
      <section
        id="pricing-showdown"
        className="relative scroll-mt-24 overflow-hidden py-20 md:py-28"
        aria-labelledby="price-showdown-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_50%_at_50%_-10%,rgba(45,212,191,0.14),transparent_55%),radial-gradient(ellipse_55%_45%_at_100%_40%,rgba(167,139,250,0.12),transparent_50%),radial-gradient(ellipse_50%_40%_at_0%_70%,rgba(232,121,249,0.08),transparent_48%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" aria-hidden />

        <div className="saas-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-teal-200/90">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.85)]" aria-hidden />
              Compare at a glance
            </div>
            <h2
              id="price-showdown-heading"
              className="orio-font-display mt-5 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
            >
              Same interview.{" "}
              <span className="bg-gradient-to-r from-teal-300 via-amber-200 to-violet-300 bg-clip-text text-transparent">
                Smarter spend.
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-400 md:text-[15px]">
              Compare pricing and capabilities — see why candidates choose Smeed AI.
            </p>
          </div>

          {/* Card grid — bottom padding absorbs lg:scale overflow so the matrix isn’t covered */}
          <div className="mx-auto mt-14 grid max-w-6xl gap-5 pb-4 lg:grid-cols-4 lg:items-stretch lg:pb-12">
            {/* Smeed AI — hero column (no negative margin: it pulled the table up under the card) */}
            <div className="relative z-[1] lg:col-span-1 lg:scale-[1.05] lg:transition-transform lg:duration-300 lg:ease-out motion-safe:lg:hover:scale-[1.06]">
              <div
                className="motion-safe:animate-orio-showdown-hero-ring absolute -inset-[1px] rounded-[1.35rem] bg-gradient-to-b from-teal-400/55 via-violet-500/4 to-fuchsia-500/45 opacity-95 blur-[2px]"
                aria-hidden
              />
              <div className="relative mb-3 rounded-xl border border-amber-400/35 bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-teal-500/15 px-3 py-2 text-center shadow-[0_0_28px_rgba(251,191,36,0.12)]">
                <p className="text-[11px] font-bold leading-snug text-amber-100 md:text-xs">
                  <span aria-hidden>🔥</span> Limited time: Get 2 free credits{" "}
                  <span className="text-amber-200/80">(early users only)</span>
                </p>
              </div>
              <article className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-teal-400/35 bg-[#040408] shadow-[0_0_0_1px_rgba(45,212,191,0.18),0_32px_90px_rgba(0,0,0,0.55)]">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/25 blur-3xl" aria-hidden />
                <div className="relative border-b border-teal-500/25 bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-violet-500/10 px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold tracking-tight text-white">Smeed AI</p>
                    <span className="rounded-full bg-gradient-to-r from-teal-400/35 to-emerald-400/25 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-100 ring-1 ring-teal-400/30">
                      Best Value
                    </span>
                  </div>
                </div>
                <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-teal-300/90">
                    <span aria-hidden>🎁</span> Get 2 Free Interview Credits
                  </p>
                  <p className="mt-2 text-[12px] font-medium text-slate-400">
                    Start free <span className="text-slate-600">•</span> Paid plans from ₹{SMEED_PRICING.creditsInr}
                  </p>
                  <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4 text-[11px] leading-snug text-slate-300">
                    {SMEED_VALUE_BULLETS.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="shrink-0 text-teal-400" aria-hidden>
                          ✓
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-4 text-[11px] text-slate-400">
                    <p>
                      <span className="font-semibold text-slate-300">Unlimited:</span> ₹{SMEED_PRICING.monthlyInr}
                      /month
                    </p>
                    <p>
                      <span className="font-semibold text-slate-300">Yearly:</span> ₹{SMEED_PRICING.yearlyInr}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-300">Lifetime:</span> ₹{SMEED_PRICING.lifetimeInr}
                    </p>
                  </div>
                  <p className="mt-3 text-[11px] font-medium text-amber-200/85">
                    <span aria-hidden>⏳</span> Early user pricing — increasing soon
                  </p>
                  <Link
                    to={tryForFreeRoute}
                    className="orio-btn-aurora motion-safe:animate-orio-showdown-cta-glow mt-5 w-full justify-center rounded-xl py-3.5 text-xs font-bold shadow-lg"
                  >
                    <span aria-hidden>🚀</span> Start Free Interview
                  </Link>
                  <div className="mt-3 space-y-1 text-center text-[10px] leading-relaxed text-slate-500">
                    <p>
                      <span aria-hidden>🔒</span> No credit card required
                    </p>
                    <p>
                      <span aria-hidden>💯</span> 30-day money-back guarantee
                    </p>
                  </div>
                  <p className="mt-3 text-center text-[10px] font-medium text-slate-500">
                    Join 1,000+ candidates already using Smeed AI
                  </p>
                  <a
                    href="/#pricing"
                    onClick={onPlanMatrixClick}
                    className="mt-2 block text-center text-[10px] font-semibold text-teal-400/80 underline-offset-2 hover:text-teal-300 hover:underline"
                  >
                    See full plan matrix →
                  </a>
                </div>
              </article>
            </div>

            {RIVALS.map((r) => (
              <article
                key={r.id}
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#07070c]/90 opacity-[0.88] backdrop-blur-sm transition-all duration-300 contrast-[0.96] saturate-[0.95] hover:opacity-[0.93] motion-reduce:opacity-90 ${toneBorder(r.tone)}`}
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${toneGlow(r.tone)} blur-2xl`}
                  aria-hidden
                />
                <div className="relative border-b border-white/[0.05] px-5 py-4">
                  <p className="text-base font-bold text-slate-300">{r.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-600">Public positioning*</p>
                </div>
                <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Typical anchor</p>
                  <p className="mt-1.5 text-xl font-bold text-slate-400">{r.anchorInr}</p>
                  <p className="mt-1 text-[10px] leading-snug text-slate-600">{r.anchorNote}</p>
                  <ul className="mt-5 flex-1 space-y-2.5 text-[11px] leading-snug text-slate-500">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex gap-2 border-l border-white/[0.05] pl-3">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Transition: quick cards → detailed matrix */}
          <div className="relative z-10 mx-auto mt-12 max-w-2xl lg:mt-14">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/[0.12] to-transparent" aria-hidden />
            <p className="mt-5 text-center text-[12px] font-medium leading-relaxed text-slate-500 md:text-[13px]">
              Still comparing? Here&apos;s a detailed breakdown{" "}
              <span className="whitespace-nowrap text-slate-400" aria-hidden>
                ↓
              </span>
            </p>
          </div>

          {!isLg && !showMatrix ? (
            <div className="relative z-10 mx-auto mt-6 flex max-w-6xl justify-center">
              <button
                type="button"
                onClick={() => {
                  setMatrixOpen(true);
                  requestAnimationFrame(() => {
                    document.getElementById("pricing-showdown-matrix")?.scrollIntoView({
                      behavior: "smooth",
                      block: "nearest",
                    });
                  });
                }}
                className="rounded-full border border-white/[0.1] bg-white/[0.04] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-300 transition-colors hover:border-teal-400/30 hover:bg-teal-500/[0.08] hover:text-teal-100"
              >
                View full comparison
              </button>
            </div>
          ) : null}

          {/* Matrix — collapsible on small screens; always open on lg+ */}
          <div id="pricing-showdown-matrix" className="relative z-10 mx-auto mt-8 max-w-6xl lg:mt-10">
            <div
              className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                showMatrix ? "grid-rows-[1fr]" : "grid-rows-[0fr] lg:grid-rows-[1fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden lg:overflow-visible">
                <div className="relative">
                  <div
                    className="absolute -inset-px rounded-2xl bg-gradient-to-r from-teal-500/15 via-transparent to-violet-500/15 opacity-60 blur-sm"
                    aria-hidden
                  />
                  <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050508]/90 backdrop-blur-md">
                    <div className="border-b border-white/[0.06] px-4 py-3 text-center md:px-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        <span className="normal-case tracking-normal" aria-hidden>
                          🔍{" "}
                        </span>
                        Detailed comparison
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] border-collapse text-left text-[11px] md:text-xs">
                        <thead>
                          <tr className="border-b border-white/[0.06] text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                            <th className="sticky left-0 z-10 bg-[#050508] px-3 py-2.5 md:px-4">Capability</th>
                            <th className="relative bg-teal-500/[0.12] px-2 py-2.5 text-center text-teal-100 shadow-[inset_0_0_40px_rgba(45,212,191,0.12),inset_0_1px_0_rgba(45,212,191,0.2)] md:px-3">
                              <span className="relative z-10">Smeed AI</span>
                            </th>
                            <th className="px-2 py-2.5 text-center text-slate-500/90 opacity-[0.88] md:px-3">
                              Parakeet
                            </th>
                            <th className="px-2 py-2.5 text-center text-slate-500/90 opacity-[0.88] md:px-3">
                              LockedIn
                            </th>
                            <th className="px-2 py-2.5 text-center text-slate-500/90 opacity-[0.88] md:px-3">Chiku</th>
                          </tr>
                        </thead>
                        <tbody>
                          {COMPARISON_ROWS.map((row) => (
                            <tr key={row.label} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                              <th
                                scope="row"
                                className="sticky left-0 z-10 max-w-[220px] bg-[#050508]/98 px-3 py-2.5 font-medium text-slate-300 md:max-w-[240px] md:px-4"
                              >
                                {row.label}
                              </th>
                              <td className="bg-teal-500/[0.08] px-2 py-2.5 text-center font-semibold text-teal-100 shadow-[inset_0_0_28px_rgba(45,212,191,0.08)] md:px-3">
                                <MatrixCell
                                  variant="smeed"
                                  value={row.smeed}
                                  check={row.smeedCheck}
                                  bold={row.smeedBold}
                                />
                              </td>
                              <td className="px-2 py-2.5 text-center md:px-3">
                                <MatrixCell variant="rival" value={row.parakeet} check={row.parakeetCheck} />
                              </td>
                              <td className="px-2 py-2.5 text-center md:px-3">
                                <MatrixCell variant="rival" value={row.lockedin} check={row.lockedinCheck} />
                              </td>
                              <td className="px-2 py-2.5 text-center md:px-3">
                                <MatrixCell variant="rival" value={row.chiku} check={row.chikuCheck} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {!isLg && showMatrix ? (
            <div className="relative z-10 mx-auto mt-4 flex max-w-6xl justify-center lg:hidden">
              <button
                type="button"
                onClick={() => setMatrixOpen(false)}
                className="text-[11px] font-medium text-slate-500 underline-offset-2 hover:text-slate-400 hover:underline"
              >
                Hide comparison
              </button>
            </div>
          ) : null}

          {/* Final CTA — after proof */}
          <div className="relative z-10 mx-auto mt-12 max-w-xl text-center lg:mt-14">
            <p className="text-sm font-medium leading-relaxed text-slate-100 md:text-[15px]">
              <span aria-hidden>🎁 </span>
              Start free with 2 interview credits — no payment required
            </p>
            <Link
              to={tryForFreeRoute}
              className="orio-btn-aurora mx-auto mt-5 inline-flex items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-xs font-bold shadow-lg"
            >
              <span aria-hidden>🚀</span>
              Start Free Interview
            </Link>
            <div className="mt-4 space-y-1 text-[11px] leading-relaxed text-slate-500">
              <p>
                <span aria-hidden>🔒 </span>
                No credit card required
              </p>
              <p>
                <span aria-hidden>💯 </span>
                30-day money-back guarantee
              </p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-3xl text-center text-[10px] leading-relaxed text-slate-600">
            Competitor pricing based on publicly available plans. Always verify final pricing at checkout.
          </p>
        </div>
      </section>
    </RevealOnScroll>
  );
}
