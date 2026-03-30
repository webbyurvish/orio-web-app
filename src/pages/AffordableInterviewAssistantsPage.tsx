import { Link } from "react-router-dom";

const toolRows = [
  { name: "Orio AI", price: "₹1,199", note: "Best overall value", highlight: true },
  { name: "Parakeet AI", price: "₹2,650", note: "Higher pricing" },
  { name: "Final Round AI", price: "₹8,188", note: "Premium tier" },
  { name: "LockedIn AI", price: "₹6,213", note: "Subscription-heavy" },
  { name: "Interview Warmup", price: "Free", note: "Practice only" },
];

const featureRows = [
  ["Real-time interview help", true, true, true, true, false],
  ["Behavioral + technical support", true, true, true, true, false],
  ["Natural answer style", true, false, false, false, false],
  ["Desktop companion", true, true, false, false, false],
  ["Affordable pricing", true, false, false, false, true],
  ["Cancel anytime", true, true, true, true, true],
];

const faqs = [
  {
    q: "Which is the most affordable AI interview assistant?",
    a: "Orio AI is one of the most budget-friendly options while still offering real-time assistance and structured interview support.",
  },
  {
    q: "Can I use Orio AI in live interviews?",
    a: "Yes. Orio AI is designed for real-time interview scenarios and works with common interview platforms.",
  },
  {
    q: "Is there a free option?",
    a: "Yes. You can start with free usage and then upgrade based on your interview preparation needs.",
  },
  {
    q: "How is this different from simple practice tools?",
    a: "Practice tools simulate questions. Orio AI additionally helps during live conversation flow and follow-up response framing.",
  },
];

function cell(ok: boolean) {
  return ok ? (
    <span className="text-emerald-600 font-semibold">✓</span>
  ) : (
    <span className="text-rose-500 font-semibold">✕</span>
  );
}

export default function AffordableInterviewAssistantsPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-gray-900">
      <section className="py-12 md:py-16">
        <div className="saas-container max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            Best Affordable AI Interview Assistants in 2026
          </h1>
          <p className="mt-4 text-center text-gray-600 max-w-3xl mx-auto">
            Compare pricing, features, and real interview usability to choose
            the right assistant for your preparation.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link to="/signup" className="saas-btn-primary">
              Start with Orio AI
            </Link>
            <Link to="/#pricing" className="saas-btn-secondary">
              View Plans
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card">
            <h2 className="text-xl font-semibold">
              What is an affordable AI interview assistant?
            </h2>
            <ul className="mt-3 space-y-2 text-gray-700 text-sm md:text-base">
              <li>• Helps you answer clearly in behavioral + technical rounds</li>
              <li>• Reduces preparation time with guided response structure</li>
              <li>• Offers practical value without expensive subscriptions</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card overflow-x-auto">
            <h2 className="text-xl font-semibold">Pricing Comparison at a Glance</h2>
            <table className="w-full mt-4 text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-3">Tool</th>
                  <th className="py-2 pr-3">Pricing</th>
                  <th className="py-2">Summary</th>
                </tr>
              </thead>
              <tbody>
                {toolRows.map((row) => (
                  <tr
                    key={row.name}
                    className={`border-b border-gray-100 ${
                      row.highlight ? "bg-indigo-50/70" : ""
                    }`}
                  >
                    <td className="py-2.5 pr-3 font-medium">{row.name}</td>
                    <td className="py-2.5 pr-3 font-semibold">{row.price}</td>
                    <td className="py-2.5 text-gray-600">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card overflow-x-auto">
            <h2 className="text-xl font-semibold">Detailed Feature Comparison</h2>
            <table className="w-full mt-4 text-sm min-w-[760px]">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-200">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">Orio AI</th>
                  <th className="py-2 pr-3">Parakeet</th>
                  <th className="py-2 pr-3">Final Round</th>
                  <th className="py-2 pr-3">LockedIn</th>
                  <th className="py-2">Warmup</th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((r) => (
                  <tr key={r[0] as string} className="border-b border-gray-100">
                    <td className="py-2.5 pr-3 font-medium">{r[0] as string}</td>
                    <td className="py-2.5 pr-3">{cell(r[1] as boolean)}</td>
                    <td className="py-2.5 pr-3">{cell(r[2] as boolean)}</td>
                    <td className="py-2.5 pr-3">{cell(r[3] as boolean)}</td>
                    <td className="py-2.5 pr-3">{cell(r[4] as boolean)}</td>
                    <td className="py-2.5">{cell(r[5] as boolean)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <h2 className="text-2xl font-bold">Why Should You Use Affordable AI Tools?</h2>
          <div className="mt-4 grid md:grid-cols-3 gap-4">
            <div className="saas-card">
              <h3 className="font-semibold">Cost Efficiency</h3>
              <p className="mt-2 text-sm text-gray-600">
                Avoid overpaying for features you do not use daily.
              </p>
            </div>
            <div className="saas-card">
              <h3 className="font-semibold">Better Practice Rhythm</h3>
              <p className="mt-2 text-sm text-gray-600">
                Prepare more often with lower cost per session.
              </p>
            </div>
            <div className="saas-card">
              <h3 className="font-semibold">Real Outcomes</h3>
              <p className="mt-2 text-sm text-gray-600">
                Focus on actual interview clarity, not feature overload.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card">
            <h2 className="text-2xl font-bold">How to Choose the Right Assistant</h2>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li>1. Compare monthly or yearly spend</li>
              <li>2. Verify real-time interview support quality</li>
              <li>3. Check response style and naturalness</li>
              <li>4. Choose based on value, not only brand name</li>
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
          <h2 className="text-2xl font-bold">Detailed Tool Comparison</h2>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {toolRows.slice(0, 4).map((t) => (
              <div key={t.name} className="saas-card">
                <p className="font-semibold">{t.name}</p>
                <p className="mt-2 text-indigo-700 font-bold">{t.price}</p>
                <p className="mt-2 text-sm text-gray-600">{t.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="saas-container max-w-5xl">
          <div className="saas-card">
            <h2 className="text-2xl font-bold">Related Resources</h2>
            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Behavioral Interview Questions Guide</li>
              <li>• Technical Interview Framework</li>
              <li>• Resume-driven Interview Prep Checklist</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="saas-container max-w-5xl">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              Ready to Start with the Best Affordable Option?
            </h2>
            <p className="mt-3 text-gray-600">
              Join Orio AI and practice interviews with clarity, confidence, and better value.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Link to="/signup" className="saas-btn-primary">
                Start with Orio AI
              </Link>
              <Link to="/" className="saas-btn-secondary">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
