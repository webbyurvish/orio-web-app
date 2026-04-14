import LandingNavbar from "../components/LandingNavbar";

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-dvh">
      <LandingNavbar theme="dark" hideFeatures hideDesktopApp />

      <main className="saas-container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-indigo-100/55 bg-white/90 backdrop-blur-sm shadow-[0_8px_28px_rgba(79,70,229,0.07)]">
            <div className="px-6 py-8 md:px-10 md:py-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Terms and Conditions
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Last updated: December 16, 2025
              </p>

              <div className="mt-8 space-y-8 text-gray-800">
                <section>
                  <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    By accessing and using Smeed AI (&quot;the Service&quot;), you accept and agree to be
                    bound by the terms and provision of this agreement. If you do not agree to abide by
                    the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">2. Description of Service</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    Smeed AI is an AI-powered interview assistant that provides real-time responses
                    during job interviews. The service includes screen capture analysis, real-time
                    transcription, and AI-generated interview responses.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">3. User Accounts</h2>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>You must provide accurate and complete information when creating an account</li>
                    <li>You are responsible for maintaining the security of your account credentials</li>
                    <li>You must notify us immediately of any unauthorized use of your account</li>
                    <li>One account per person is allowed</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">4. Subscription Plans</h2>
                  <div className="mt-3 space-y-3 text-base text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">Free Tier:</span>{" "}
                      10 minutes of usage with 12-minute reset period after exhaustion
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Starter Plan:</span>{" "}
                      ₹399 ($7) for 45 minutes of Base AI assistance + 1 voice interview session
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Standard Plan:</span>{" "}
                      ₹1199 ($19) for 3 hours of Base AI assistance + 4 voice interview sessions
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">Pro Plan:</span>{" "}
                      ₹1999 ($29) for 7 hours of Base AI assistance + 10 voice interview sessions
                    </p>
                    <p>
                      All paid subscriptions are valid for the purchased time duration and do not
                      expire by date.
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">5. Acceptable Use</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">You agree NOT to use the service for:</p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Illegal activities or purposes</li>
                    <li>Harassing, abusing, or threatening others</li>
                    <li>Violating any laws or regulations</li>
                    <li>Sharing your account with others</li>
                    <li>Attempting to reverse engineer or compromise the service</li>
                    <li>Using the service in ways that could damage our reputation or systems</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">6. Privacy and Data</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    Your privacy is important to us. Please review our Privacy Policy, which also
                    governs your use of the Service, to understand our practices regarding the
                    collection, use, and disclosure of your personal information.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">7. Payment Terms</h2>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>All payments are processed securely through our payment partners</li>
                    <li>Prices are listed in Indian Rupees (INR). 18% GST is applicable on all plans and will be added at checkout.</li>
                    <li>Payment is required before service activation</li>
                    <li>We reserve the right to change pricing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">8. Intellectual Property</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    The service and its original content, features, and functionality are and will
                    remain the exclusive property of Smeed AI and its licensors. The service is
                    protected by copyright, trademark, and other laws.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">9. Limitation of Liability</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    In no event shall Smeed AI, nor its directors, employees, partners, agents,
                    suppliers, or affiliates, be liable for any indirect, incidental, special,
                    consequential, or punitive damages, including without limitation, loss of profits,
                    data, use, goodwill, or other intangible losses, resulting from your use of the
                    service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">10. Termination</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    We may terminate or suspend your account and bar access to the service
                    immediately, without prior notice or liability, under our sole discretion, for any
                    reason whatsoever, including without limitation if you breach the Terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">11. Disclaimer</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    The information on this service is provided on an &quot;as is&quot; basis. To the
                    fullest extent permitted by law, this Company excludes all representations,
                    warranties, conditions and terms whether express or implied.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">12. Governing Law</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    These Terms shall be interpreted and governed by the laws of India, and you submit
                    to the jurisdiction of the courts located in India for the resolution of any
                    disputes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">13. Contact Information</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    If you have any questions about these Terms and Conditions, please contact us at:
                  </p>
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-5 py-4 text-sm text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">Email:</span> support@smeedai.com
                    </p>
                    <p className="mt-1">
                      <span className="font-semibold text-gray-900">Website:</span> www.chiku-ai.in
                    </p>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-gray-500">
            © 2026 Smeed AI. All rights reserved.
          </div>
        </div>
      </main>
    </div>
  );
}

