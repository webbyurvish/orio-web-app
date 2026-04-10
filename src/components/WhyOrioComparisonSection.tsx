import { AZURE_SPEECH_STT_LOCALES } from "../constants/azureSpeechSttLocales";
import { RevealOnScroll } from "./RevealOnScroll";

type CellKind = "yes" | "partial" | "no" | "na" | "manual";

type CompareRow = {
  feature: string;
  smeed: CellKind;
  generic: CellKind;
  traditional: CellKind;
};

const LOCALE_COUNT = AZURE_SPEECH_STT_LOCALES.length;

/** Short capability labels (~5–8 words) for the comparison table */
const ROWS: CompareRow[] = [
  {
    feature: "Windows desktop and browser for live interviews",
    smeed: "yes",
    generic: "partial",
    traditional: "no",
  },
  {
    feature: "Resume, company, and job description every session",
    smeed: "yes",
    generic: "partial",
    traditional: "manual",
  },
  {
    feature: `${LOCALE_COUNT}+ locales, accent-tuned Azure Speech and AI`,
    smeed: "yes",
    generic: "partial",
    traditional: "na",
  },
  {
    feature: "Natural Mode for short, speakable answers",
    smeed: "yes",
    generic: "no",
    traditional: "partial",
  },
  {
    feature: "Mic, speaker, auto-answer, screen help on desktop",
    smeed: "yes",
    generic: "partial",
    traditional: "no",
  },
  {
    feature: "Transcripts, session history, optional AI notes",
    smeed: "yes",
    generic: "partial",
    traditional: "manual",
  },
  {
    feature: "Behavioral, technical, and coding interview support",
    smeed: "yes",
    generic: "partial",
    traditional: "yes",
  },
  {
    feature: "Free trial, credits, subscription, or lifetime",
    smeed: "yes",
    generic: "partial",
    traditional: "partial",
  },
];

function Cell({ kind, emphasize }: { kind: CellKind; emphasize?: boolean }) {
  if (kind === "yes") {
    return (
      <div
        className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
          emphasize
            ? "border-teal-400/45 bg-teal-400/15 text-teal-300 shadow-[0_0_14px_rgba(45,212,191,0.18)]"
            : "border-white/10 bg-white/[0.04] text-teal-400/90"
        }`}
        aria-label="Included"
      >
        ✓
      </div>
    );
  }
  if (kind === "no") {
    return (
      <div
        className="mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/[0.07] text-xs font-semibold text-rose-400/75"
        aria-label="Not included"
      >
        ✕
      </div>
    );
  }
  if (kind === "partial") {
    return (
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-amber-200/75">Limited</p>
    );
  }
  if (kind === "manual") {
    return (
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500">Manual</p>
    );
  }
  return (
    <p className="text-center text-[10px] font-medium text-slate-600" aria-label="Not applicable">
      —
    </p>
  );
}

export function WhyOrioComparisonSection() {
  return (
    <RevealOnScroll>
      <section
        id="compare"
        className="relative scroll-mt-24 border-t border-white/[0.05] py-20 md:py-28"
        aria-labelledby="why-smeed-compare-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,rgba(45,212,191,0.07),transparent),radial-gradient(ellipse_50%_35%_at_15%_80%,rgba(167,139,250,0.06),transparent)]"
          aria-hidden
        />

        <div className="saas-container relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.38em] text-violet-400/85">Why teams pick Smeed AI</p>
            <h2
              id="why-smeed-compare-heading"
              className="orio-font-display mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.65rem] lg:leading-[1.12]"
            >
              Built for{" "}
              <span className="bg-gradient-to-r from-teal-300 via-slate-100 to-violet-300 bg-clip-text text-transparent">
                interview reality
              </span>
              , not generic chat
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 md:text-[15px]">
              Smeed AI pairs a web workspace (sessions, resumes, billing) with a{" "}
              <span className="text-slate-300">Windows desktop companion</span> for capture and answers. Below is how
              that stack compares to a typical AI chatbot and old-school prep alone — based on what the product actually
              ships today.
            </p>
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl">
            <div
              className="absolute -inset-1 rounded-[1.35rem] bg-gradient-to-r from-teal-500/20 via-violet-500/15 to-fuchsia-500/20 opacity-70 blur-xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#06060a]/95 shadow-[0_32px_100px_rgba(0,0,0,0.5)] backdrop-blur-xl">
              <div className="border-b border-white/[0.06] bg-gradient-to-r from-white/[0.05] via-transparent to-violet-500/[0.04] px-4 py-2.5 md:px-6">
                <p className="text-center text-[10px] font-medium leading-snug text-slate-500">
                  Generic AI = tools like ChatGPT without interview sessions, desktop capture, and Smeed AI&apos;s lifecycle.
                </p>
              </div>

              <div className="overflow-x-auto overscroll-x-contain">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th
                        scope="col"
                        className="sticky left-0 z-20 w-[min(44vw,280px)] bg-[#06060a] px-3 py-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 md:px-4"
                      >
                        Capability
                      </th>
                      <th
                        scope="col"
                        className="relative bg-gradient-to-b from-teal-500/[0.12] via-teal-500/[0.04] to-violet-500/[0.08] px-2 py-2.5 text-center md:px-4"
                      >
                        <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-teal-200/95">Smeed AI</span>
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 md:px-4"
                      >
                        Generic AI
                      </th>
                      <th
                        scope="col"
                        className="px-2 py-2.5 text-center text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500 md:px-4"
                      >
                        Traditional prep
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {ROWS.map((row, i) => (
                      <tr
                        key={row.feature}
                        className={`border-b border-white/[0.04] transition-colors hover:bg-white/[0.02] ${
                          i % 2 === 0 ? "bg-black/10" : ""
                        }`}
                      >
                        <th
                          scope="row"
                          className="sticky left-0 z-10 max-w-[min(44vw,280px)] bg-[#06060a]/98 px-3 py-2.5 text-left align-middle backdrop-blur-sm md:px-4"
                        >
                          <span className="text-[13px] font-semibold leading-snug text-slate-200">{row.feature}</span>
                        </th>
                        <td className="bg-gradient-to-b from-teal-500/[0.06] to-violet-500/[0.04] px-2 py-2 align-middle md:px-3">
                          <Cell kind={row.smeed} emphasize />
                        </td>
                        <td className="px-2 py-2 align-middle md:px-3">
                          <Cell kind={row.generic} />
                        </td>
                        <td className="px-2 py-2 align-middle md:px-3">
                          <Cell kind={row.traditional} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-white/[0.05] bg-white/[0.02] px-4 py-2 text-center md:px-6">
                <p className="text-[10px] leading-relaxed text-slate-600">
                  Row labels reflect Smeed AI&apos;s documented web + desktop experience. &ldquo;Limited&rdquo; means
                  possible with heavy manual setup or uneven UX, not a specific competitor claim.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </RevealOnScroll>
  );
}
