import { RevealOnScroll } from "./RevealOnScroll";

type Accent = "teal" | "violet" | "fuchsia" | "amber";

type QuoteVoice = {
  id: string;
  kind: "quote";
  quote: string;
  name: string;
  role: string;
  company?: string;
  accent: Accent;
  rating?: number;
};

type XVoice = {
  id: string;
  kind: "x";
  displayName: string;
  handle: string;
  text: string;
  timeAgo: string;
  verified?: boolean;
};

type LinkedInVoice = {
  id: string;
  kind: "linkedin";
  text: string;
  name: string;
  role: string;
  headline: string;
};

type G2Voice = {
  id: string;
  kind: "g2";
  quote: string;
  name: string;
  role: string;
  stars: number;
};

type VoiceItem = QuoteVoice | XVoice | LinkedInVoice | G2Voice;

const VOICES: VoiceItem[] = [
  {
    id: "q1",
    kind: "quote",
    quote:
      "The desktop flow is invisible enough that I could focus on the conversation. Answers felt grounded in my resume — not generic ChatGPT fluff.",
    name: "Aarav Patel",
    role: "Frontend Engineer",
    company: "Series B startup",
    accent: "teal",
    rating: 5,
  },
  {
    id: "x1",
    kind: "x",
    displayName: "Nisha V.",
    handle: "nisha_codes",
    text: "Finally something that doesn't sound like I memorized a blog post. Smeed AI's pacing on technical follow-ups actually matches how I explain things on the job.",
    timeAgo: "3d",
    verified: true,
  },
  {
    id: "li1",
    kind: "linkedin",
    headline: "Post on LinkedIn",
    text: "Shared Smeed AI with my study group. We run mock behavioral rounds twice a week now — the natural mode is scary good for sounding human under pressure.",
    name: "Rahul Sharma",
    role: "Backend Engineer · Cloud",
  },
  {
    id: "q2",
    kind: "quote",
    quote:
      "I used credits for a full loop of system-design practice. Having transcripts + suggested answers side by side cut my prep time roughly in half.",
    name: "Daniel M.",
    role: "Data Engineer",
    accent: "violet",
    rating: 5,
  },
  {
    id: "g1",
    kind: "g2",
    quote: "Clean UI, fast responses, and the session setup actually respects interview context. Worth it before onsite loops.",
    name: "Priya K.",
    role: "SDE-2",
    stars: 5,
  },
  {
    id: "x2",
    kind: "x",
    displayName: "Alex · eng",
    handle: "alexbuilds",
    text: "Not posting the company name but we tested Smeed AI against a real panel-style prep. Panel said my answers were 'structured' — I'll take it.",
    timeAgo: "1w",
  },
  {
    id: "q3",
    kind: "quote",
    quote:
      "Multilingual support mattered for my EU interviews. Same calm experience in English and my second language — huge for confidence.",
    name: "Elena R.",
    role: "Full-stack",
    company: "Remote",
    accent: "fuchsia",
    rating: 5,
  },
  {
    id: "li2",
    kind: "linkedin",
    headline: "Comment on a thread",
    text: "Smeed AI doesn't replace prep — it tightens it. I still grind Leetcode; this handles the 'how do I say this out loud' problem.",
    name: "Jordan Lee",
    role: "Staff Engineer",
  },
  {
    id: "q4",
    kind: "quote",
    quote: "Rated 4.8 from our early cohort isn't an accident. The product team clearly ships for people who actually interview.",
    name: "Community",
    role: "Beta feedback",
    accent: "amber",
    rating: 5,
  },
];

const accentRing: Record<Accent, string> = {
  teal: "from-teal-400/50 via-teal-500/20 to-transparent",
  violet: "from-violet-400/50 via-violet-500/20 to-transparent",
  fuchsia: "from-fuchsia-400/45 via-fuchsia-500/15 to-transparent",
  amber: "from-amber-400/45 via-amber-500/15 to-transparent",
};

const accentBorder: Record<Accent, string> = {
  teal: "border-teal-500/25",
  violet: "border-violet-500/25",
  fuchsia: "border-fuchsia-500/25",
  amber: "border-amber-500/25",
};

const accentGlow: Record<Accent, string> = {
  teal: "shadow-[0_0_40px_-8px_rgba(45,212,191,0.35)]",
  violet: "shadow-[0_0_40px_-8px_rgba(167,139,250,0.35)]",
  fuchsia: "shadow-[0_0_40px_-8px_rgba(232,121,249,0.3)]",
  amber: "shadow-[0_0_40px_-8px_rgba(251,191,36,0.25)]",
};

function Stars({ n }: { n: number }) {
  return (
    <span className="text-amber-400/95 tracking-tight" aria-hidden>
      {"★".repeat(n)}
      <span className="sr-only">{n} out of 5 stars</span>
    </span>
  );
}

function XLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

/** Fixed height so every card type aligns in the marquee rows */
const CARD_FRAME =
  "customer-voice-card flex h-[300px] w-[min(100vw-2rem,380px)] shrink-0 flex-col overflow-hidden rounded-2xl";

function VoiceCard({ item }: { item: VoiceItem }) {
  if (item.kind === "quote") {
    return (
      <article
        className={`${CARD_FRAME} relative border bg-gradient-to-br from-white/[0.06] to-transparent p-6 backdrop-blur-sm ${accentBorder[item.accent]} ${accentGlow[item.accent]}`}
      >
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${accentRing[item.accent]} blur-2xl opacity-90`}
          aria-hidden
        />
        <div className="relative flex min-h-0 flex-1 flex-col">
          {item.rating ? (
            <div className="mb-3 flex shrink-0 items-center gap-2">
              <Stars n={item.rating} />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500">Written review</span>
            </div>
          ) : null}
          <blockquote className="min-h-0 flex-1 font-[Georgia,Cambria,serif] text-[16px] leading-relaxed text-slate-100 line-clamp-6">
            &ldquo;{item.quote}&rdquo;
          </blockquote>
        </div>
        <footer className="relative mt-auto flex shrink-0 items-center gap-3 border-t border-white/[0.06] pt-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white ${
              item.accent === "teal"
                ? "from-teal-500/40 to-teal-600/20"
                : item.accent === "violet"
                  ? "from-violet-500/40 to-violet-600/20"
                  : item.accent === "fuchsia"
                    ? "from-fuchsia-500/40 to-fuchsia-600/20"
                    : "from-amber-500/40 to-amber-600/20"
            }`}
            aria-hidden
          >
            {item.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-white">{item.name}</p>
            <p className="truncate text-xs text-slate-500">
              {item.role}
              {item.company ? ` · ${item.company}` : ""}
            </p>
          </div>
        </footer>
      </article>
    );
  }

  if (item.kind === "x") {
    return (
      <article
        className={`${CARD_FRAME} border border-white/[0.08] bg-[#0c0c0f] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_48px_rgba(0,0,0,0.45)] backdrop-blur-md`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 ring-2 ring-white/10">
              <span className="text-sm font-bold text-slate-200">{item.displayName.charAt(0)}</span>
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate font-bold text-white">{item.displayName}</span>
                {item.verified ? (
                  <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white" title="Verified">
                    ✓
                  </span>
                ) : null}
              </div>
              <p className="truncate text-sm text-slate-500">@{item.handle}</p>
            </div>
          </div>
          <XLogo className="h-5 w-5 shrink-0 text-slate-400" />
        </div>
        <p className="mt-3 min-h-0 flex-1 text-[15px] leading-relaxed text-slate-200 line-clamp-6">{item.text}</p>
        <div className="mt-auto flex shrink-0 items-center justify-between border-t border-white/[0.06] pt-3 text-xs text-slate-500">
          <span className="flex items-center gap-4">
            <span className="text-slate-400">♡</span>
            <span className="text-slate-400">↗</span>
          </span>
          <span>{item.timeAgo} ago · X</span>
        </div>
      </article>
    );
  }

  if (item.kind === "linkedin") {
    return (
      <article
        className={`${CARD_FRAME} border border-[#2d64bc]/30 bg-gradient-to-b from-[#0a1628]/95 to-[#060a12] p-5 shadow-[0_0_32px_-10px_rgba(45,100,188,0.35)] backdrop-blur-md`}
      >
        <div className="flex shrink-0 items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#2d64bc]/35 bg-[#2d64bc]/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#70b5f9]">
            <LinkedInLogo className="h-3.5 w-3.5" />
            {item.headline}
          </span>
        </div>
        <p className="mt-3 min-h-0 flex-1 text-[15px] leading-relaxed text-slate-200 line-clamp-6">{item.text}</p>
        <footer className="mt-auto shrink-0 border-t border-white/[0.06] pt-4">
          <p className="font-semibold text-white">{item.name}</p>
          <p className="text-xs text-[#70b5f9]/90">{item.role}</p>
        </footer>
      </article>
    );
  }

  /* g2 */
  return (
    <article
      className={`${CARD_FRAME} relative border border-orange-500/20 bg-gradient-to-br from-orange-950/40 via-[#0c0a0a] to-transparent p-6 shadow-[0_0_36px_-12px_rgba(249,115,22,0.25)] backdrop-blur-sm`}
    >
      <div className="pointer-events-none absolute -right-8 top-0 h-32 w-32 rounded-full bg-orange-500/10 blur-3xl" aria-hidden />
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="mb-3 flex shrink-0 items-center gap-2">
          <span className="rounded-md bg-gradient-to-r from-orange-500 to-rose-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">G2</span>
          <Stars n={item.stars} />
        </div>
        <blockquote className="min-h-0 flex-1 text-[15px] leading-relaxed text-slate-100 line-clamp-6">
          &ldquo;{item.quote}&rdquo;
        </blockquote>
      </div>
      <footer className="relative mt-auto shrink-0 border-t border-white/[0.06] pt-4">
        <p className="font-semibold text-white">{item.name}</p>
        <p className="text-xs text-orange-200/70">{item.role} · Verified review</p>
      </footer>
    </article>
  );
}

function MarqueeRow({ reverse }: { reverse?: boolean }) {
  const doubled = [...VOICES, ...VOICES];
  return (
    <div className="customer-voices-wrap">
      <div className={`customer-voices-track ${reverse ? "customer-voices-track--reverse" : ""}`}>
        {doubled.map((item, i) => (
          <VoiceCard key={`${item.id}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export function CustomerVoicesSection() {
  return (
    <RevealOnScroll>
      <section
        id="reviews"
        className="relative scroll-mt-24 overflow-hidden border-t border-white/[0.06] py-20 md:py-28"
        aria-labelledby="customer-voices-heading"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.12),transparent),radial-gradient(ellipse_50%_40%_at_100%_50%,rgba(167,139,250,0.08),transparent),radial-gradient(ellipse_45%_35%_at_0%_60%,rgba(232,121,249,0.06),transparent)]"
          aria-hidden
        />

        <div className="saas-container relative z-10 mb-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-teal-400/85">Social proof</p>
          <h2 id="customer-voices-heading" className="orio-font-display mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-[2.75rem]">
            What Our <span className="bg-gradient-to-r from-teal-300 via-violet-300 to-fuchsia-300 bg-clip-text text-transparent">Customers Say</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
            Written reviews, posts, and community voices — auto-scrolling so you can soak in the signal without clicking through.
          </p>
        </div>

        <div className="relative z-10 flex flex-col gap-8 md:gap-10">
          <MarqueeRow />
          <MarqueeRow reverse />
        </div>
      </section>
    </RevealOnScroll>
  );
}
