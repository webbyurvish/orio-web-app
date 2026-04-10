import { Link } from "react-router-dom";

const comparisonRows = [
  ["Monthly pricing", "₹1,199", "₹2,650"],
  ["Yearly equivalent", "₹11,988", "₹31,800+"],
  ["Real-time interview support", "Yes", "Yes"],
  ["Natural response style", "Yes", "Limited"],
  ["Behavioral + technical coverage", "Yes", "Yes"],
  ["Desktop companion app", "Yes", "No"],
  ["Trial availability", "Yes", "Limited"],
  ["Best for budget-conscious users", "Excellent", "Moderate"],
];

const reasons = [
  "Affordable pricing without removing core interview features",
  "Natural, direct responses that sound conversational in interviews",
  "Balanced support for behavioral and technical rounds",
  "Designed for real-world interview usage with practical UX",
];

const faqs = [
  {
    q: "Is Smeed AI cheaper than Parakeet AI?",
    a: "Yes, Smeed AI is positioned as a significantly more affordable option for candidates who still want core interview assistance features.",
  },
  {
    q: "Can I switch from Parakeet AI to Smeed AI easily?",
    a: "Yes. You can start using Smeed AI immediately and continue interview prep with no complicated setup.",
  },
  {
    q: "Why is Smeed AI cost-effective?",
    a: "Smeed AI focuses on practical interview features and streamlined product design, which keeps plans budget-friendly.",
  },
  {
    q: "Does Smeed AI include live interview support?",
    a: "Yes, Smeed AI supports real-time interview workflows, including structured and natural answer styles.",
  },
];

export default function ParakeetAlternativePage() {
  return (
    <div className="min-h-dvh orio-workspace-bg text-gray-900">
      <section className="py-10">
        <div className="saas-container max-w-5xl">
          <p className="text-sm text-gray-500">
            Home / Alternatives / Parakeet AI
          </p>
          <div className="mt-4 rounded-2xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
            🏆 Smeed AI is an affordable and practical alternative for interview prep.
          </div>
          <h1 className="mt-5 text-3xl md:text-4xl font-bold">
            Parakeet AI Alternative: <span className="text-amber-600">Save 55%</span>{" "}
            with Smeed AI
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl">
            Compare Smeed AI and Parakeet AI side by side across pricing, interview
            support, and practical usability.
          </p>
          <div className="mt-5 grid sm:grid-cols-3 gap-3">
            <div className="saas-card text-center">
              <p className="text-sm text-gray-500">Save up to</p>
              <p className="text-2xl font-bold text-amber-600">55%</p>
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
            <h2 className="text-xl font-semibold">
              Parakeet AI vs Smeed AI: Detailed Comparison
            </h2>
            <table className="w-full mt-4 text-sm min-w-[680px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500 text-left">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">Smeed AI</th>
                  <th className="py-2">Parakeet AI</th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, orio, para]) => (
                  <tr key={feature} className="border-b border-gray-100">
                    <td className="py-2.5 pr-3 font-medium">{feature}</td>
                    <td className="py-2.5 pr-3 text-emerald-700 font-semibold">{orio}</td>
                    <td className="py-2.5 text-gray-700">{para}</td>
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
              Why is Smeed AI more affordable than Parakeet AI?
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
          <h2 className="text-2xl font-bold">What users say after switching</h2>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="saas-card">
              <p className="text-amber-500">★★★★★</p>
              <p className="mt-2 text-sm text-gray-700">
                “I reduced my prep cost and still got better quality answer framing.”
              </p>
              <p className="mt-2 text-xs text-gray-500">— SDE Candidate</p>
            </div>
            <div className="saas-card">
              <p className="text-amber-500">★★★★★</p>
              <p className="mt-2 text-sm text-gray-700">
                “Smeed AI felt more practical during live interview simulations.”
              </p>
              <p className="mt-2 text-xs text-gray-500">— Backend Engineer</p>
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
              "Smeed AI vs Final Round AI",
              "Smeed AI vs LockedIn AI",
              "Smeed AI vs Interview Warmup",
            ].map((title) => (
              <div key={title} className="saas-card">
                <p className="font-semibold">{title}</p>
                <a href="/affordable-interview-assistants" className="mt-2 inline-block text-indigo-700 text-sm font-semibold">
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
            <h2 className="text-2xl font-bold">Ready to Save on Interview Assistance?</h2>
            <p className="mt-3 text-gray-600">
              Start with Smeed AI and prepare with confidence at a better price.
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
