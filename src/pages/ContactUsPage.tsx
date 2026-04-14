import { useMemo, useState } from "react";
import LandingNavbar from "../components/LandingNavbar";

type SubjectOption = { value: string; label: string };

export default function ContactUsPage() {
  const subjects: SubjectOption[] = useMemo(
    () => [
      { value: "", label: "Select a subject" },
      { value: "Payment Issues", label: "Payment Issues" },
      { value: "Technical Support", label: "Technical Support" },
      { value: "Account Issues", label: "Account Issues" },
      { value: "Other", label: "Other" },
    ],
    []
  );

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    subject.trim().length > 0 &&
    message.trim().length > 0;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!canSubmit) {
      setError("Please fill in all required fields.");
      return;
    }

    // No backend wiring requested; submit via mailto for now.
    const to = "support@smeedai.com";
    const mailSubject = `[Contact] ${subject.trim()}`;
    const body = [
      `Full Name: ${fullName.trim()}`,
      `Email: ${email.trim()}`,
      `Subject: ${subject.trim()}`,
      "",
      message.trim(),
    ].join("\n");

    const href =
      `mailto:${encodeURIComponent(to)}` +
      `?subject=${encodeURIComponent(mailSubject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = href;
  };

  return (
    <div className="min-h-dvh">
      <LandingNavbar theme="dark" hideFeatures hideDesktopApp />

      <main className="saas-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-2 text-sm text-gray-600 max-w-lg">
              We&apos;re here to help! Reach out to us with any questions,
              concerns, or feedback about Smeed AI.
            </p>

            <div className="mt-7 rounded-2xl border border-gray-200 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Get in Touch
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-semibold text-gray-900">
                      support@smeedai.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm font-semibold text-gray-900">India</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 1a11 11 0 1011 11A11 11 0 0012 1zm1 11.41V6h-2v7l6.2 3.6 1-1.73z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Response Time</p>
                    <p className="text-sm font-semibold text-gray-900">
                      Within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Quick Help
              </h2>

              <div className="mt-5 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Payment Issues
                  </p>
                  <p className="text-xs text-gray-500">
                    Contact us immediately if you face any payment-related
                    problems.
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Technical Support
                  </p>
                  <p className="text-xs text-gray-500">
                    Having trouble with the AI responses or screen capture?
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Account Issues
                  </p>
                  <p className="text-xs text-gray-500">
                    Problems with login, subscription, or account settings.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_6px_18px_rgba(0,0,0,0.06)] p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Send us a Message
            </h2>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  type="email"
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Subject <span className="text-red-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                >
                  {subjects.map((s) => (
                    <option key={s.value || "__empty"} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your issue or question in detail..."
                  rows={7}
                  className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 resize-none"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600">{error}</div>
              )}

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-lg py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        <footer className="mt-14 text-center text-xs text-gray-500">
          <div className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 text-gray-500"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.8A3.95 3.95 0 0 0 3.8 7.75v8.5a3.95 3.95 0 0 0 3.95 3.95h8.5a3.95 3.95 0 0 0 3.95-3.95v-8.5a3.95 3.95 0 0 0-3.95-3.95h-8.5zm8.95 1.35a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4z" />
            </svg>
            <a
              href="https://www.instagram.com/smeedai"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-gray-700 hover:text-indigo-600 hover:underline"
            >
              @smeedai
            </a>
          </div>
          <div className="mt-2">
            Smeed AI is a trademark of Smeed AI.
            <br />© 2026 Smeed AI. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}

