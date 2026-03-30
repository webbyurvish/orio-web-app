import { Link } from "react-router-dom";

const comparisonRows = [
  ["Monthly pricing", "₹1,199", "₹6,213"],
  ["Yearly equivalent", "₹11,988", "₹74,000+"],
  ["Behavioral + technical support", "Yes", "Yes"],
  ["Natural response style", "High", "Moderate"],
  ["Real-time interview guidance", "Yes", "Yes"],
  ["Desktop companion app", "Yes", "No"],
  ["Best for long-term prep", "Excellent", "Costly"],
  ["Price-to-value ratio", "Strong", "Average"],
];

const reasons = [
  "Lower recurring cost with practical interview-ready features",
  "Balanced support for both technical and behavioral rounds",
  "Natural response style that sounds conversational",
  "Designed for consistent prep without premium subscription pressure",
];

const faqs = [
  {
    q: "Is Orio AI cheaper than LockedIn AI?",
    a: "Yes. Orio AI is significantly more affordable while still covering core interview assistance features.",
  },
  {
    q: "Can Orio AI be used for real interviews?",
    a: "Yes. Orio AI is built for practical interview scenarios and real-time answer support.",
  },
  {
    q: "What is the main advantage of Orio AI vs LockedIn AI?",
    a: "Better affordability with strong practical value for regular interview preparation.",
  },
  {
    q: "Is Orio AI suitable for both freshers and experienced candidates?",
    a: "Yes. It supports structured prep for candidates across different experience levels.",
  },
];

export default function LockedInAlternativePage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <section className="py-10">
        <div className="saas-container max-w-5xl">
          <p className="text-sm text-gray-500">Home / Alternatives / LockedIn AI</p>
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            🏆 Orio AI is a budget-friendly alternative with strong interview outcomes.
          </div>
          <h1 className="mt-5 text-3xl md:text-4xl font-bold">
            LockedIn AI Alternative: <span className="text-amber-600">Save 81%</span> with Orio AI
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            Compare Orio AI and LockedIn AI across pricing, usability, and real interview support.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <div className="saas-card text-center">
              <p className="text-sm text-gray-500">Save up to</p>
              <p className="text-2xl font-bold text-amber-600">81%</p>
            </div>
            <div className="saas-card text-center">
              <p className="text-sm text-gray-500">Starting at</p>
              <p className="text-2xl font-bold text-indigo-700">₹1,199</p>
            </div>
            <div className="saas-card text-center">
              <p className="text-sm text-gray-500">Users helped</p>
              <p className="text-2xl font-bold text-indigo-700">5000+</p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card overflow-x-auto">
            <h2 className="text-xl font-semibold">LockedIn AI vs Orio AI: Detailed Comparison</h2>
            <table className="w-full mt-4 text-sm min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-left">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">Orio AI</th>
                  <th className="py-2">LockedIn AI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, orio, locked]) => (
                  <tr key={feature} className="border-b border-gray-100">
                    <td className="py-2.5 pr-3 font-medium">{feature}</td>
                    <td className="py-2.5 pr-3 text-emerald-700 font-semibold">{orio}</td>
                    <td className="py-2.5 text-gray-700">{locked}</td>
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
            <h2 className="text-2xl font-bold">Why is Orio AI cheaper than LockedIn AI?</h2>
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
            <h2 className="text-2xl font-bold">Key Differences: LockedIn AI vs Orio AI</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose-200 bg-white p-4">
                <p className="font-semibold text-rose-700">LockedIn AI concerns</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  <li>✕ Higher recurring subscription cost</li>
                  <li>✕ Less cost-effective for long prep timelines</li>
                  <li>✕ Lower value for budget-focused candidates</li>
                </ul>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-white p-4">
                <p className="font-semibold text-emerald-700">Orio AI advantages</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-700">
                  <li>✓ Strong feature coverage at lower cost</li>
                  <li>✓ Better price-to-value ratio</li>
                  <li>✓ Designed for practical interview outcomes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card">
            <h2 className="text-2xl font-bold">Real Cost Comparison: 3-Month Job Search</h2>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                <p className="font-semibold text-rose-700">With LockedIn AI</p>
                <p className="mt-2 text-sm text-gray-700">Estimated total: ₹18,000+</p>
              </div>
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="font-semibold text-emerald-700">With Orio AI</p>
                <p className="mt-2 text-sm text-gray-700">Estimated total: ₹3,597</p>
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
                “Orio AI gave me the same confidence boost with much better affordability.”
              </p>
              <p className="mt-2 text-xs text-gray-500">— Data Analyst Candidate</p>
            </div>
            <div className="saas-card">
              <p className="text-amber-500">★★★★★</p>
              <p className="mt-2 text-sm text-gray-700">
                “I switched to Orio AI and reduced prep cost without losing quality.”
              </p>
              <p className="mt-2 text-xs text-gray-500">— SWE Candidate</p>
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
              { title: "Orio AI vs Final Round AI", href: "/alternatives/final-round-ai" },
              { title: "Orio AI vs Interview Warmup", href: "/alternatives/interview-warmup" },
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
            <h2 className="text-2xl font-bold">Ready to save on AI interview assistance?</h2>
            <p className="mt-3 text-gray-600">
              Start with Orio AI and prepare with confidence at a smarter cost.
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
