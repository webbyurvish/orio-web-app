import { Link } from "react-router-dom";

const comparisonRows = [
  ["Monthly pricing", "₹1,199", "₹8,188"],
  ["Yearly equivalent", "₹11,988", "₹98,000+"],
  ["Behavioral + technical support", "Yes", "Yes"],
  ["Natural response style", "Yes", "Moderate"],
  ["Real-time guidance quality", "High", "High"],
  ["Desktop companion", "Yes", "No"],
  ["Indian interview context", "Yes", "Limited"],
  ["Best for budget-conscious users", "Excellent", "Low"],
];

const reasons = [
  "Lower monthly cost without removing practical interview features",
  "Natural, human-like answer style for real interview conversations",
  "Better value for candidates preparing over multiple months",
  "Supports both behavioral and technical interview workflows",
];

const differences = [
  {
    left: "High recurring subscription cost",
    right: "Affordable pricing designed for long-term prep",
  },
  {
    left: "Less focus on natural local communication style",
    right: "Answer style tuned for natural interview conversation",
  },
  {
    left: "Limited support for budget-conscious users",
    right: "Practical feature set with better price-performance ratio",
  },
];

const faqs = [
  {
    q: "Is Orio AI cheaper than Final Round AI?",
    a: "Yes. Orio AI is significantly more affordable while still covering key interview prep and real-time assistance features.",
  },
  {
    q: "Can Orio AI replace expensive interview assistant subscriptions?",
    a: "For most candidates, yes. Orio AI focuses on core outcomes with strong feature coverage and better pricing.",
  },
  {
    q: "Does Orio AI support both behavioral and technical interview prep?",
    a: "Yes. It is designed to help with both question types and practical response framing.",
  },
  {
    q: "Who should choose Orio AI over Final Round AI?",
    a: "Candidates who want high-quality assistance with a lower monthly cost and better long-term affordability.",
  },
];

export default function FinalRoundAlternativePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <section className="py-10">
        <div className="saas-container max-w-5xl">
          <p className="text-sm text-gray-500">
            Home / Alternatives / Final Round AI
          </p>
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            🏆 Orio AI is a cost-effective and practical alternative for interview preparation.
          </div>
          <h1 className="mt-5 text-3xl md:text-4xl font-bold">
            Final Round AI Alternative: <span className="text-amber-600">Save 55%</span>{" "}
            with Orio AI
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            Compare Orio AI and Final Round AI side by side across pricing,
            usability, and real interview support quality.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <div className="saas-card text-center">
              <p className="text-sm text-gray-500">Potential savings</p>
              <p className="text-2xl font-bold text-amber-600">55%</p>
            </div>
            <div className="saas-card text-center">
              <p className="text-sm text-gray-500">Starting at</p>
              <p className="text-2xl font-bold text-indigo-700">₹1,199</p>
            </div>
            <div className="saas-card text-center">
              <p className="text-sm text-gray-500">Candidates helped</p>
              <p className="text-2xl font-bold text-indigo-700">5000+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card overflow-x-auto">
            <h2 className="text-xl font-semibold">
              Final Round AI vs Orio AI: Detailed Comparison
            </h2>
            <table className="w-full mt-4 text-sm min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-left">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">Orio AI</th>
                  <th className="py-2">Final Round AI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, orio, finalRound]) => (
                  <tr key={feature} className="border-b border-gray-100">
                    <td className="py-2.5 pr-3 font-medium">{feature}</td>
                    <td className="py-2.5 pr-3 text-emerald-700 font-semibold">{orio}</td>
                    <td className="py-2.5 text-gray-700">{finalRound}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card">
            <h2 className="text-2xl font-bold">
              Why is Orio AI more affordable than Final Round AI?
            </h2>
            <ul className="mt-4 space-y-2 text-gray-700">
              {reasons.map((r) => (
                <li key={r}>• {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card bg-gradient-to-r from-rose-50 to-emerald-50">
            <h2 className="text-2xl font-bold">Key Differences: Final Round AI vs Orio AI</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose-200 bg-white p-4">
                <p className="font-semibold text-rose-700">Final Round AI concerns</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  {differences.map((d) => (
                    <li key={d.left}>✕ {d.left}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <p className="font-semibold text-emerald-700">Orio AI advantages</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  {differences.map((d) => (
                    <li key={d.right}>✓ {d.right}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <h2 className="text-2xl font-bold">What users say after switching</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="saas-card">
              <p className="text-amber-500">★★★★★</p>
              <p className="mt-2 text-sm text-gray-700">
                “I got similar support quality but saved a lot monthly after switching to Orio AI.”
              </p>
              <p className="mt-2 text-xs text-gray-500">— Product Engineer</p>
            </div>
            <div className="saas-card">
              <p className="text-amber-500">★★★★★</p>
              <p className="mt-2 text-sm text-gray-700">
                “Orio AI gave me practical interview support without heavy subscription pressure.”
              </p>
              <p className="mt-2 text-xs text-gray-500">— Full-Stack Candidate</p>
            </div>
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
              { title: "Orio AI vs Parakeet AI", href: "/alternatives/parakeet-ai" },
              { title: "Orio AI vs LockedIn AI", href: "/affordable-interview-assistants" },
              { title: "Orio AI vs Interview Warmup", href: "/affordable-interview-assistants" },
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
            <h2 className="text-2xl font-bold">Ready to Save on AI Interview Assistance?</h2>
            <p className="mt-3 text-gray-600">
              Start with Orio AI today and prepare with confidence at a better cost.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="saas-btn-primary">
                Start with Orio AI
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
