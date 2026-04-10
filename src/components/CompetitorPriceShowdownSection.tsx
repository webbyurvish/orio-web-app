import type { MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { RevealOnScroll } from "./RevealOnScroll";

/**
 * Competitor figures (~₹) are rounded from the same internal comparison copy used on
 * alternatives / affordable pages; Smeed AI numbers match the live landing pricing config.
 * Footnote instructs users to verify current prices on each vendor’s site.
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
    bullets: ["Real-time help", "Mostly subscription cadence", "No Windows desktop companion in our checks"],
  },
  {
    id: "lockedin",
    name: "LockedIn AI",
    shortName: "LockedIn",
    anchorInr: "~₹6,213",
    anchorNote: "typical monthly-style tier*",
    tone: "slate",
    bullets: ["Full interview focus", "Higher recurring positioning*", "Lifetime rarely advertised"],
  },
  {
    id: "chiku",
    name: "Chiku AI",
    shortName: "Chiku",
    anchorInr: "~₹1,199",
    anchorNote: "advertised entry packs*",
    tone: "rose",
    bullets: ["Pack-based minutes", "India-first positioning", "Verify limits & GST on their site"],
  },
];

const VALUE_ROWS: { label: string; smeed: string; parakeet: string; lockedin: string; chiku: string }[] = [
  {
    label: "Free trial before you pay",
    smeed: "Yes",
    parakeet: "Limited",
    lockedin: "Varies",
    chiku: "Check site",
  },
  {
    label: "Credit packs + subscription + lifetime",
    smeed: "All three",
    parakeet: "Mostly sub / credits",
    lockedin: "Sub-forward*",
    chiku: "Packs",
  },
  {
    label: "30-day money-back (paid)",
    smeed: "Yes",
    parakeet: "—",
    lockedin: "—",
    chiku: "—",
  },
  {
    label: "Windows desktop interview window",
    smeed: "Yes",
    parakeet: "No*",
    lockedin: "Varies",
    chiku: "Varies",
  },
];

function toneBorder(t: Rival["tone"]) {
  if (t === "violet") return "border-violet-500/20 hover:border-violet-400/35";
  if (t === "rose") return "border-rose-500/15 hover:border-rose-400/30";
  return "border-white/[0.08] hover:border-white/15";
}

function toneGlow(t: Rival["tone"]) {
  if (t === "violet") return "from-violet-600/10 to-transparent";
  if (t === "rose") return "from-rose-600/10 to-transparent";
  return "from-slate-500/10 to-transparent";
}

const PRICING_SECTION_ID = "pricing";

function scrollToPricingSection(): boolean {
  const el = document.getElementById(PRICING_SECTION_ID);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function CompetitorPriceShowdownSection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const tryForFreeRoute = isAuthenticated ? "/dashboard" : "/login";
  const navigate = useNavigate();
  const location = useLocation();

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
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-amber-400/35 bg-gradient-to-r from-amber-500/15 to-teal-500/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-amber-200/95 shadow-[0_0_40px_rgba(251,191,36,0.12)]">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]" aria-hidden />
              Value that shows up on the receipt
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
              Smeed AI is priced for candidates who want{" "}
              <span className="text-slate-300">credits, unlimited, and lifetime</span> in one place — not a single
              locked-in subscription story. Here&apos;s how we stack next to names you already know.
            </p>
          </div>

          {/* Card grid */}
          <div className="mx-auto mt-14 grid max-w-6xl gap-5 lg:grid-cols-4 lg:items-stretch">
            {/* Smeed AI — hero column */}
            <div className="relative lg:col-span-1 lg:-my-3 lg:scale-[1.03] lg:shadow-2xl">
              <div
                className="absolute -inset-[1px] rounded-[1.35rem] bg-gradient-to-b from-teal-400/50 via-violet-500/35 to-fuchsia-500/40 opacity-90 blur-[2px]"
                aria-hidden
              />
              <article className="relative flex h-full flex-col overflow-hidden rounded-[1.25rem] border border-teal-400/30 bg-[#040408] shadow-[0_0_0_1px_rgba(45,212,191,0.12),0_32px_80px_rgba(0,0,0,0.55)]">
                <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl" aria-hidden />
                <div className="relative border-b border-teal-500/20 bg-gradient-to-r from-teal-500/15 via-transparent to-violet-500/10 px-5 py-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-lg font-bold tracking-tight text-white">Smeed AI</p>
                    <span className="rounded-full bg-teal-400/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-teal-200">
                      Best value
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] font-medium text-teal-200/70">Your plans on this site</p>
                </div>
                <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Start</p>
                  <p className="mt-1 text-2xl font-extrabold text-white">Free trial</p>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate-500">Then credit packs from</p>
                  <p className="mt-0.5 text-xl font-bold text-white">
                    ₹{SMEED_PRICING.creditsInr}
                    <span className="text-sm font-semibold text-slate-500"> · ${SMEED_PRICING.creditsUsd}</span>
                  </p>
                  <div className="mt-4 space-y-2 border-t border-white/[0.06] pt-4 text-[11px] text-slate-400">
                    <p>
                      <span className="text-slate-300">Unlimited</span> · ₹{SMEED_PRICING.monthlyInr}/mo · ${SMEED_PRICING.monthlyUsd}
                    </p>
                    <p>
                      <span className="text-slate-300">Yearly</span> · ₹{SMEED_PRICING.yearlyInr} · ${SMEED_PRICING.yearlyUsd}
                    </p>
                    <p>
                      <span className="text-slate-300">Lifetime</span> · ₹{SMEED_PRICING.lifetimeInr} · ${SMEED_PRICING.lifetimeUsd}
                    </p>
                  </div>
                  <ul className="mt-4 flex-1 space-y-2 text-[11px] leading-snug text-slate-400">
                    <li className="flex gap-2">
                      <span className="text-teal-400" aria-hidden>
                        ✓
                      </span>
                      30-day money-back on paid plans
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal-400" aria-hidden>
                        ✓
                      </span>
                      Credits never expire (as stated on plans)
                    </li>
                    <li className="flex gap-2">
                      <span className="text-teal-400" aria-hidden>
                        ✓
                      </span>
                      Web dashboard + Windows desktop companion
                    </li>
                  </ul>
                  <Link
                    to={tryForFreeRoute}
                    className="orio-btn-aurora mt-5 w-full justify-center py-3 text-xs font-semibold"
                  >
                    Start free
                  </Link>
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
                className={`relative flex h-full flex-col overflow-hidden rounded-2xl border bg-[#07070c]/95 backdrop-blur-sm transition-colors duration-300 ${toneBorder(r.tone)}`}
              >
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br ${toneGlow(r.tone)} blur-2xl`}
                  aria-hidden
                />
                <div className="relative border-b border-white/[0.06] px-5 py-4">
                  <p className="text-base font-bold text-slate-200">{r.name}</p>
                  <p className="mt-0.5 text-[10px] text-slate-600">Public positioning*</p>
                </div>
                <div className="relative flex flex-1 flex-col px-5 pb-5 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">Typical anchor</p>
                  <p className="mt-1.5 text-xl font-bold text-slate-300">{r.anchorInr}</p>
                  <p className="mt-1 text-[10px] leading-snug text-slate-600">{r.anchorNote}</p>
                  <ul className="mt-5 flex-1 space-y-2.5 text-[11px] leading-snug text-slate-500">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex gap-2 border-l border-white/[0.06] pl-3">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          {/* Matrix */}
          <div className="relative mx-auto mt-12 max-w-6xl">
            <div
              className="absolute -inset-px rounded-2xl bg-gradient-to-r from-teal-500/15 via-transparent to-violet-500/15 opacity-60 blur-sm"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#050508]/90 backdrop-blur-md">
              <div className="border-b border-white/[0.06] px-4 py-3 text-center md:px-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Why teams shortlist Smeed AI first
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-left text-[11px] md:text-xs">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                      <th className="sticky left-0 z-10 bg-[#050508] px-3 py-2.5 md:px-4">Capability</th>
                      <th className="bg-teal-500/10 px-2 py-2.5 text-center text-teal-200/95 md:px-3">Smeed AI</th>
                      <th className="px-2 py-2.5 text-center md:px-3">Parakeet</th>
                      <th className="px-2 py-2.5 text-center md:px-3">LockedIn</th>
                      <th className="px-2 py-2.5 text-center md:px-3">Chiku</th>
                    </tr>
                  </thead>
                  <tbody>
                    {VALUE_ROWS.map((row) => (
                      <tr key={row.label} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <th
                          scope="row"
                          className="sticky left-0 z-10 max-w-[200px] bg-[#050508]/98 px-3 py-2.5 font-medium text-slate-300 md:px-4"
                        >
                          {row.label}
                        </th>
                        <td className="bg-teal-500/[0.06] px-2 py-2.5 text-center font-semibold text-teal-100 md:px-3">
                          {row.smeed}
                        </td>
                        <td className="px-2 py-2.5 text-center text-slate-500 md:px-3">{row.parakeet}</td>
                        <td className="px-2 py-2.5 text-center text-slate-500 md:px-3">{row.lockedin}</td>
                        <td className="px-2 py-2.5 text-center text-slate-500 md:px-3">{row.chiku}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <p className="mx-auto mt-6 max-w-3xl text-center text-[10px] leading-relaxed text-slate-600">
            *Competitor prices and policies are <span className="text-slate-500">rounded approximations</span> from
            common public tiers (and our alternatives pages). Brands compared are independent companies — always confirm
            live checkout, GST, and trial rules on their official sites before you buy.
          </p>
        </div>
      </section>
    </RevealOnScroll>
  );
}
