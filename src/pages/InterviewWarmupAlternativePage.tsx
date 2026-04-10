import { Link } from "react-router-dom";

const differenceRows = [
  ["Live real-time assistance", "Yes", "No"],
  ["Behavioral answer quality", "High", "Basic"],
  ["Technical answer depth", "High", "Limited"],
  ["Natural conversational tone", "Yes", "Mostly scripted"],
  ["Follow-up handling", "Yes", "Limited"],
  ["Desktop interview companion", "Yes", "No"],
  ["Pricing flexibility", "Strong", "Free-only scope"],
];

const affordabilityPoints = [
  "You get practical real-time features, not only static practice prompts",
  "Pricing starts low while preserving core interview outcomes",
  "Useful for both behavioral and technical rounds in one place",
  "Supports repeated preparation with better long-term value",
];

const faqs = [
  {
    q: "What is Interview Warmup’s main limitation?",
    a: "It is helpful for basic practice, but it does not provide full real-time interview assistance depth.",
  },
  {
    q: "Can Smeed AI replace Interview Warmup for serious prep?",
    a: "Yes. Smeed AI is designed for practical interview outcomes with stronger live response support.",
  },
  {
    q: "Is Smeed AI expensive?",
    a: "No. Smeed AI is positioned as an affordable option compared to premium interview assistants.",
  },
  {
    q: "Does Smeed AI support both behavioral and technical interviews?",
    a: "Yes, it is built to support both workflows and improve response quality in each.",
  },
];

export default function InterviewWarmupAlternativePage() {
  return (
    <div className="min-h-dvh orio-workspace-bg text-gray-900">
      <section className="py-10">
        <div className="saas-container max-w-5xl">
          <p className="text-sm text-gray-500">
            Home / Alternatives / Interview Warmup
          </p>
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            ✨ Smeed AI adds real-time assistance beyond basic interview practice.
          </div>
          <h1 className="mt-5 text-3xl md:text-4xl font-bold">
            Interview Warmup vs Smeed AI:{" "}
            <span className="text-amber-600">From free practice to real-time assistance</span>
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            Compare both tools and see why Smeed AI is better suited for real
            interview preparation and live response support.
          </p>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card bg-gradient-to-r from-rose-50 to-emerald-50">
            <h2 className="text-xl font-semibold">Understanding the Key Difference</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose-200 bg-white p-4">
                <p className="font-semibold text-rose-700">Interview Warmup limits</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  <li>✕ Mostly static practice flow</li>
                  <li>✕ Limited live interview adaptability</li>
                  <li>✕ Less natural response framing</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <p className="font-semibold text-emerald-700">Smeed AI strengths</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  <li>✓ Real-time interview assistance</li>
                  <li>✓ Natural and structured answer styles</li>
                  <li>✓ Better support for serious preparation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card overflow-x-auto">
            <h2 className="text-xl font-semibold">Feature-by-Feature Comparison</h2>
            <table className="w-full mt-4 text-sm min-w-[680px]">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">Smeed AI</th>
                  <th className="py-2">Interview Warmup</th>
                </tr>
              </thead>
              <tbody>
                {differenceRows.map(([f, orio, warmup]) => (
                  <tr key={f} className="border-b border-gray-100">
                    <td className="py-2.5 pr-3 font-medium">{f}</td>
                    <td className="py-2.5 pr-3 text-emerald-700 font-semibold">{orio}</td>
                    <td className="py-2.5 text-gray-700">{warmup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <h2 className="text-2xl font-bold">When should you use each tool?</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="saas-card">
              <h3 className="font-semibold">Use Interview Warmup when:</h3>
              <ul className="mt-2 text-sm text-gray-700 space-y-2">
                <li>• You only need basic prompt-style practice</li>
                <li>• You are exploring interview prep casually</li>
              </ul>
            </div>
            <div className="saas-card">
              <h3 className="font-semibold">Use Smeed AI when:</h3>
              <ul className="mt-2 text-sm text-gray-700 space-y-2">
                <li>• You need stronger real-time interview guidance</li>
                <li>• You want practical outcomes in actual interviews</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card">
            <h2 className="text-2xl font-bold">
              Why is Smeed AI worth ₹1,199 + GST while Interview Warmup is free?
            </h2>
            <ul className="mt-4 space-y-2 text-gray-700">
              {affordabilityPoints.map((p) => (
                <li key={p}>• {p}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((item) => (
              <div key={item.q} className="saas-card">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <h2 className="text-2xl font-bold">Compare Other AI Interview Assistants</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            {[
              { title: "Smeed AI vs Parakeet AI", href: "/alternatives/parakeet-ai" },
              { title: "Smeed AI vs Final Round AI", href: "/alternatives/final-round-ai" },
              { title: "Smeed AI vs LockedIn AI", href: "/affordable-interview-assistants" },
            ].map((item) => (
              <div key={item.title} className="saas-card">
                <p className="font-semibold">{item.title}</p>
                <a href={item.href} className="mt-2 inline-block text-indigo-700 text-sm font-semibold">
                  View comparison →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="saas-container max-w-5xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="text-2xl font-bold">Ready for real interviews? Get Smeed AI</h2>
            <p className="mt-3 text-gray-600">
              Move beyond basic practice and prepare with confidence.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="saas-btn-primary">
                Start with Smeed AI
              </Link>
              <Link to="/affordable-interview-assistants" className="saas-btn-secondary">
                Try Free Plan
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
