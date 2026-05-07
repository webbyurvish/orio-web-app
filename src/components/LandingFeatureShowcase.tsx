import { useId, useState, type ReactElement } from "react";

type FeatureId = "notes" | "resumes" | "desktop" | "autoAnswer" | "multilang" | "answers" | "coding";

const FEATURES: {
  id: FeatureId;
  title: string;
  description: string;
  Icon: () => ReactElement;
}[] = [
  {
    id: "notes",
    title: "AI notes & transcript summaries",
    description:
      "Capture key moments, action items, and a readable recap from every conversation.",
    Icon: IconNotes,
  },
  {
    id: "resumes",
    title: "AI Resume Builder",
    description: "Build and refine your resume with AI, upload PDFs, and power resume-aware answers.",
    Icon: IconFile,
  },
  {
    id: "desktop",
    title: "Desktop companion",
    description: "A focused window beside Zoom, Meet, or Teams for real interviews.",
    Icon: IconMonitor,
  },
  {
    id: "autoAnswer",
    title: "Smart Auto Answer Mode",
    description: "Auto-detects interview questions and responds instantly in real time.",
    Icon: IconBolt,
  },
  {
    id: "multilang",
    title: "Multi-language & Accent Support",
    description: "Works across different languages and understands varied accents.",
    Icon: IconGlobe,
  },
  {
    id: "answers",
    title: "Natural Mode",
    description: "Behavioral and technical tone that sounds human — not scripted.",
    Icon: IconSparkle,
  },
  {
    id: "coding",
    title: "Live coding interview support",
    description:
      "DSA, debugging, and complexity — language-aware guidance while you code in real interviews.",
    Icon: IconCode,
  },
];

function IconNotes() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );
}

function IconFile() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function IconMonitor() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function IconSparkle() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function IconCode() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

function IconBolt() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function PreviewNotes() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/80">After your session</p>
        <div className="flex rounded-lg border border-white/[0.1] bg-black/30 p-0.5">
          <span className="rounded-md bg-teal-500/25 px-2.5 py-1 text-[10px] font-semibold text-teal-100 ring-1 ring-teal-400/35">
            AI summary
          </span>
          <span className="px-2.5 py-1 text-[10px] font-medium text-slate-500">Transcript</span>
        </div>
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Session recap · Google L5</p>
        <ul className="mt-3 space-y-2 text-sm text-slate-300">
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" aria-hidden />
            <span>Discussed scaling read paths, cache invalidation, and on-call tradeoffs.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" aria-hidden />
            <span>Follow-up: be ready to sketch a failure-mode story for your last outage.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400/90" aria-hidden />
            <span>Strong signal on ownership — reinforce with one more metrics example.</span>
          </li>
        </ul>
      </div>
      <div className="rounded-xl border border-dashed border-white/[0.12] bg-black/25 p-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Transcript excerpt</p>
        <p className="mt-2 text-left text-[11px] leading-relaxed text-slate-500">
          <span className="text-slate-400">Interviewer:</span> How would you reduce p99 on a hot read path?
          <br />
          <span className="text-teal-400/90">You:</span> I&apos;d measure first — then layer cache…
        </p>
        <p className="mt-2 text-[10px] text-slate-600">Full transcript searchable in the app</p>
      </div>
    </div>
  );
}

function PreviewResumes() {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/80">AI Resume Builder</p>
      <div className="space-y-2">
        {[
          { name: "Alex_Kumar_Senior_BE.pdf", tag: "PDF" },
          { name: "Resume_v3_structured", tag: "Editor" },
        ].map((f) => (
          <div
            key={f.name}
            className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-500/20 to-violet-500/20 text-lg">
              📄
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{f.name}</p>
              <p className="text-[11px] text-slate-500">AI builder · {f.tag}</p>
            </div>
            <span className="shrink-0 rounded-md border border-teal-400/30 bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-teal-200">
              AI
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewAutoAnswer() {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/80">Smart Auto Answer</p>
      <div className="rounded-xl border border-amber-400/25 bg-amber-500/[0.06] px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-wider text-amber-200/90">Question detected</p>
        <p className="mt-1 text-sm text-slate-200">
          &ldquo;Tell me about a time you had to push back on a deadline.&rdquo;
        </p>
      </div>
      <div className="rounded-xl border border-teal-500/25 bg-gradient-to-br from-teal-500/[0.1] to-violet-600/[0.06] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300/90">Suggested reply · ready to speak</p>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">
          I aligned expectations early, showed tradeoffs with data, and proposed a smaller slice we could ship on time —
          then negotiated scope with stakeholders.
        </p>
      </div>
      <p className="text-center text-[11px] text-slate-500">Keeps pace with live conversation — you stay in control</p>
    </div>
  );
}

function PreviewMultilang() {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/80">Languages &amp; accents</p>
      <div className="flex flex-wrap gap-2">
        {["English", "Hindi", "Spanish", "More"].map((lang, i) => (
          <span
            key={lang}
            className={`rounded-full border px-3 py-1 text-[11px] font-medium ${
              i === 0
                ? "border-teal-400/40 bg-teal-500/15 text-teal-100"
                : "border-white/[0.1] bg-white/[0.04] text-slate-400"
            }`}
          >
            {lang}
          </span>
        ))}
      </div>
      <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Session language</p>
        <p className="mt-2 text-sm text-slate-300">
          Pick one language per session so listening and answers stay in sync — tuned for real-world accents.
        </p>
      </div>
      <p className="text-center text-[11px] text-slate-500">Switch when your interview language changes</p>
    </div>
  );
}

function PreviewDesktop() {
  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="w-full max-w-sm rounded-t-xl border border-b-0 border-white/[0.12] bg-[#12121a] shadow-2xl">
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 flex-1 truncate text-center text-[10px] text-slate-500">Smeed AI — Interview</span>
        </div>
        <div className="space-y-3 p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Suggested reply</p>
          <div className="rounded-lg border border-teal-500/25 bg-gradient-to-br from-teal-500/[0.08] to-violet-600/[0.06] p-3 text-[13px] leading-relaxed text-slate-200">
            I&apos;d align the team on success metrics first, then break the work into weekly milestones so we can
            ship incrementally.
          </div>
          <div className="flex gap-2">
            <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[10px] text-slate-400">Headphones</span>
            <span className="rounded-md bg-white/[0.06] px-2 py-1 text-[10px] text-slate-400">Push to talk</span>
          </div>
        </div>
      </div>
      <div className="mt-3 text-center text-[11px] text-slate-500">Stays beside your meeting window</div>
    </div>
  );
}

function PreviewAnswers() {
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/80">Natural Mode</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-teal-400/35 bg-gradient-to-b from-teal-500/12 to-transparent p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-300/90">Behavioral</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            Conversational, story-driven — like how you&apos;d actually explain it in a call.
          </p>
        </div>
        <div className="rounded-xl border border-violet-400/30 bg-gradient-to-b from-violet-500/12 to-transparent p-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300/90">Technical</p>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">
            Clear tradeoffs, diagrams-friendly structure, without sounding like a textbook.
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {["Resume context", "Role target", "Company tone"].map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-white/[0.1] bg-white/[0.04] px-3 py-1 text-[11px] text-slate-400"
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}

function PreviewCoding() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-teal-400/80">Coding interview</p>
        <div className="flex gap-1">
          {["Python", "Java", "C++"].map((lang, i) => (
            <span
              key={lang}
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                i === 0
                  ? "bg-teal-500/25 text-teal-200 ring-1 ring-teal-400/40"
                  : "bg-white/[0.06] text-slate-500"
              }`}
            >
              {lang}
            </span>
          ))}
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-[1fr_minmax(0,11rem)]">
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/40 font-mono text-[11px] leading-relaxed text-slate-300">
          <div className="flex border-b border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[10px] text-slate-500">
            <span>solution.py</span>
          </div>
          <pre className="max-h-[200px] overflow-auto p-3 text-left">
            <code>
              <span className="text-slate-600">1</span>{"  "}
              <span className="text-violet-300">def</span> two_sum(nums, target):
              {"\n"}
              <span className="text-slate-600">2</span>{"    "}
              <span className="text-violet-300">seen</span> = {"{}"}
              {"\n"}
              <span className="text-slate-600">3</span>{"    "}
              <span className="text-violet-300">for</span> i, n <span className="text-violet-300">in</span>{" "}
              <span className="text-amber-200/90">enumerate</span>(nums):
              {"\n"}
              <span className="text-slate-600">4</span>{"        "}
              <span className="text-violet-300">if</span> target - n <span className="text-violet-300">in</span> seen:
              {"\n"}
              <span className="text-slate-600">5</span>{"            "}
              <span className="text-violet-300">return</span> [seen[target - n], i]
              {"\n"}
              <span className="text-slate-600">6</span>{"        "}
              seen[n] = i
            </code>
          </pre>
        </div>
        <div className="flex flex-col gap-2 rounded-xl border border-violet-400/25 bg-gradient-to-b from-violet-500/[0.12] to-transparent p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300/90">Smeed AI hint</p>
          <p className="text-xs leading-snug text-slate-300">Hash map for O(n) time, O(n) space — avoid nested loop.</p>
          <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
            {["Complexity", "Edge cases", "Tests"].map((chip) => (
              <span
                key={chip}
                className="rounded border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[9px] font-medium text-slate-400"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-center text-[11px] text-slate-500">Works alongside LeetCode, HackerRank, and shared editors</p>
    </div>
  );
}

function FeaturePreview({ id }: { id: FeatureId }) {
  switch (id) {
    case "notes":
      return <PreviewNotes />;
    case "resumes":
      return <PreviewResumes />;
    case "desktop":
      return <PreviewDesktop />;
    case "autoAnswer":
      return <PreviewAutoAnswer />;
    case "multilang":
      return <PreviewMultilang />;
    case "answers":
      return <PreviewAnswers />;
    case "coding":
      return <PreviewCoding />;
    default:
      return null;
  }
}

type LandingFeatureShowcaseProps = {
  title: string;
  subtitle: string;
};

export function LandingFeatureShowcase({ title, subtitle }: LandingFeatureShowcaseProps) {
  const [active, setActive] = useState<FeatureId>("notes");
  const baseId = useId();
  const panelId = `${baseId}-panel`;
  const tabId = (i: number) => `${baseId}-tab-${i}`;

  return (
    <section id="features" className="relative scroll-mt-24 py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.12),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_30%,rgba(167,139,250,0.1),transparent_50%)]"
        aria-hidden
      />
      <div className="saas-container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-teal-400/80">Product tour</p>
          <h2 className="orio-font-display mt-3 text-3xl font-bold text-white md:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">{subtitle}</p>
        </div>

        <div className="mx-auto mt-14 grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:items-stretch lg:gap-12">
          <div className="flex flex-col gap-2" role="tablist" aria-label="Product features">
            {FEATURES.map((f, i) => {
              const selected = active === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  id={tabId(i)}
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={0}
                  onClick={() => setActive(f.id)}
                  className={`group flex w-full gap-4 rounded-2xl border px-4 py-4 text-left transition-all duration-300 md:px-5 md:py-4 ${
                    selected
                      ? "border-teal-400/45 bg-gradient-to-r from-teal-500/[0.14] via-teal-500/[0.06] to-violet-600/[0.12] shadow-[0_0_40px_-8px_rgba(45,212,191,0.25)]"
                      : "border-white/[0.08] bg-white/[0.02] hover:border-teal-400/25 hover:bg-white/[0.04]"
                  }`}
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                      selected
                        ? "border-teal-400/40 bg-teal-500/20 text-teal-200"
                        : "border-white/10 bg-gradient-to-br from-teal-400/10 to-violet-500/10 text-teal-200/80 group-hover:border-teal-400/30"
                    }`}
                  >
                    <f.Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold text-white">{f.title}</span>
                    <span className="mt-1 block text-sm leading-snug text-slate-400">{f.description}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId(Math.max(0, FEATURES.findIndex((f) => f.id === active)))}
            className="relative min-h-[420px] lg:min-h-[520px]"
          >
            <div className="pointer-events-none absolute -inset-[1px] rounded-[1.35rem] bg-gradient-to-b from-teal-400/35 via-violet-500/25 to-fuchsia-500/30 opacity-80 blur-[1px]" aria-hidden />
            <div className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[1.25rem] border border-white/[0.1] bg-[#06060c] shadow-[0_32px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] lg:min-h-[520px]">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(45,212,191,0.08),transparent_50%),radial-gradient(ellipse_60%_50%_at_100%_100%,rgba(139,92,246,0.1),transparent_45%)]"
                aria-hidden
              />
              <div className="relative flex flex-1 flex-col p-6 md:p-8">
                <div className="mb-4 flex items-center gap-2 border-b border-white/[0.06] pb-4">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                    <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                  </div>
                  <span className="ml-3 text-[11px] font-medium text-slate-500">orioai.app</span>
                </div>
                <div key={active} className="min-h-0 flex-1 orio-feature-preview-enter">
                  <FeaturePreview id={active} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
