import LandingNavbar from "../components/LandingNavbar";

export default function RefundsCancellationPage() {
  return (
    <div className="min-h-dvh">
      <LandingNavbar theme="dark" hideFeatures hideDesktopApp />

      <main className="saas-container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-indigo-100/55 bg-white/90 backdrop-blur-sm shadow-[0_8px_28px_rgba(79,70,229,0.07)]">
            <div className="px-6 py-8 md:px-10 md:py-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Cancellation and Refunds Policy
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Last updated: December 16, 2025
              </p>

              <div className="mt-10 space-y-9 text-gray-800">
                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    1. Refund Eligibility
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    At Smeed AI, we strive to provide excellent service. You may
                    be eligible for a refund under the following circumstances:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Technical issues preventing you from using the service</li>
                    <li>Service not working as described</li>
                    <li>Accidental duplicate purchases</li>
                    <li>Billing errors on our part</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    2. Refund Timeline
                  </h2>

                  <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-6 py-5">
                    <div className="border-l-4 border-amber-500 pl-5">
                      <p className="text-sm text-amber-800">
                        <span className="font-semibold">Important:</span> Refund
                        requests must be made within 7 days of purchase.
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>
                      <span className="font-semibold text-gray-900">
                        Within 24 hours:
                      </span>{" "}
                      Full refund eligible if no service usage
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">
                        1-3 days:
                      </span>{" "}
                      Partial refund based on usage (minimum 50% refund)
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">
                        4-7 days:
                      </span>{" "}
                      Case-by-case review, typically 25-50% refund
                    </li>
                    <li>
                      <span className="font-semibold text-gray-900">
                        After 7 days:
                      </span>{" "}
                      No refunds available except for technical issues caused by
                      us
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    3. Non-Refundable Situations
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    We cannot provide refunds in the following cases:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Change of mind after using the service</li>
                    <li>Failure to achieve desired interview outcomes</li>
                    <li>User error or misunderstanding of service features</li>
                    <li>Internet connectivity issues on the user&apos;s end</li>
                    <li>
                      Device compatibility issues disclosed in our requirements
                    </li>
                    <li>Violation of our Terms of Service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    4. Usage-Based Refunds
                  </h2>
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-6 py-5">
                    <p className="font-semibold text-gray-900">
                      How we calculate partial refunds:
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold text-gray-900">
                          Starter Plan (₹399):
                        </span>{" "}
                        ₹8.87 per minute used will be deducted (45 mins Base AI +
                        1 Voice Session)
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Standard Plan (₹1199):
                        </span>{" "}
                        ₹6.66 per minute used will be deducted (3 hrs Base AI + 4
                        Voice Sessions)
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Pro Plan (₹1999):
                        </span>{" "}
                        ₹4.76 per minute used will be deducted (7 hrs Base AI +
                        10 Voice Sessions)
                      </p>
                      <p className="mt-4 text-xs text-gray-600">
                        * Minimum refund amount is 25% of the original purchase
                        price
                        <br />
                        * 18% GST is applicable on all plans and is added at
                        checkout.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    5. How to Request a Refund
                  </h2>
                  <div className="mt-4 space-y-4 text-base text-gray-700">
                    <p>
                      <span className="font-semibold text-gray-900">
                        1. Contact Support:
                      </span>{" "}
                      Email us at{" "}
                      <span className="text-orange-600">support@smeedai.com</span>{" "}
                      with the subject line &quot;Refund Request&quot;
                    </p>

                    <div>
                      <p className="font-semibold text-gray-900">
                        2. Provide Information:
                      </p>
                      <ul className="mt-2 list-disc pl-6 space-y-2 text-base text-gray-700">
                        <li>Your registered email address</li>
                        <li>Purchase date and transaction ID</li>
                        <li>Reason for refund request</li>
                        <li>Any supporting documentation</li>
                      </ul>
                    </div>

                    <p>
                      <span className="font-semibold text-gray-900">
                        3. Review Process:
                      </span>{" "}
                      Our team will review your request within 2-3 business days
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        4. Decision Communication:
                      </span>{" "}
                      We&apos;ll email you our decision with reasoning
                    </p>
                    <p>
                      <span className="font-semibold text-gray-900">
                        5. Processing:
                      </span>{" "}
                      If approved, refunds are processed within 5-7 business
                      days
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    6. Refund Methods
                  </h2>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Refunds will be processed to the original payment method</li>
                    <li>Bank transfers may take 5-7 business days to reflect</li>
                    <li>Credit card refunds typically appear within 3-5 business days</li>
                    <li>Digital wallet refunds are usually instant to 1 business day</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    7. Cancellation Policy
                  </h2>

                  <p className="mt-3 font-semibold text-gray-900">
                    Immediate Cancellation:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>You can cancel your subscription at any time</li>
                    <li>Cancellation is effective immediately</li>
                    <li>No future charges will occur</li>
                    <li>Remaining time/minutes will remain available until exhausted</li>
                  </ul>

                  <p className="mt-6 font-semibold text-gray-900">Account Closure:</p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>You can request complete account deletion</li>
                    <li>All data will be permanently removed within 30 days</li>
                    <li>This action cannot be undone</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    8. Dispute Resolution
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    If you&apos;re not satisfied with our refund decision, you may:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>
                      Escalate to our management team via{" "}
                      <span className="text-orange-600">support@smeedai.com</span>
                    </li>
                    <li>Contact your bank or payment provider for a chargeback</li>
                    <li>Seek resolution through consumer protection authorities</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    9. Free Tier Policy
                  </h2>
                  <div className="mt-4 rounded-xl bg-sky-50 border border-sky-200 px-6 py-5">
                    <div className="border-l-4 border-sky-500 pl-5">
                      <p className="text-sm leading-relaxed text-sky-700">
                        <span className="font-semibold text-sky-800">
                          Free Tier Users:
                        </span>{" "}
                        Since the free tier doesn&apos;t involve payment, there are
                        no refunds applicable. However, if you experience technical
                        issues, we&apos;re happy to help resolve them or provide
                        additional free credits when appropriate.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    10. Policy Changes
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    We reserve the right to modify this refund policy at any time.
                    Changes will be communicated via email and posted on our website.
                    Continued use of the service after changes constitutes acceptance
                    of the new policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    11. Contact Information
                  </h2>
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-6 py-5 text-sm text-gray-700">
                    <p className="text-gray-700">
                      For any questions about refunds or cancellations:
                    </p>
                    <div className="mt-4 space-y-2">
                      <p>
                        <span className="font-semibold text-gray-900">Email:</span>{" "}
                        support@smeedai.com
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Subject Line:
                        </span>{" "}
                        &quot;Refund Request&quot; or &quot;Cancellation Request&quot;
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Response Time:
                        </span>{" "}
                        24-48 hours
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Business Hours:
                        </span>{" "}
                        Monday to Friday, 9 AM - 6 PM IST
                      </p>
                    </div>
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

