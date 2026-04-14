import LandingNavbar from "../components/LandingNavbar";

export default function DeliveryPolicyPage() {
  return (
    <div className="min-h-dvh">
      <LandingNavbar theme="dark" hideFeatures hideDesktopApp />

      <main className="saas-container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-indigo-100/55 bg-white/90 backdrop-blur-sm shadow-[0_8px_28px_rgba(79,70,229,0.07)]">
            <div className="px-6 py-8 md:px-10 md:py-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Shipping Policy
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Last updated: December 16, 2025
              </p>

              <div className="mt-7 rounded-xl bg-sky-50 border border-sky-200 px-6 py-5">
                <div className="border-l-4 border-sky-500 pl-5">
                  <p className="font-semibold text-sky-800">
                    Digital Service Notice
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-sky-700">
                    Smeed AI is a 100% digital service. There are no physical
                    products to ship. All services are delivered electronically
                    through our web platform.
                  </p>
                </div>
              </div>

              <div className="mt-10 space-y-9 text-gray-800">
                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    1. Service Delivery
                  </h2>
                  <p className="mt-3 font-semibold text-gray-900">
                    Immediate Access:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>All Smeed AI services are delivered digitally</li>
                    <li>
                      Access is granted immediately upon successful payment
                    </li>
                    <li>No physical shipping or delivery required</li>
                    <li>
                      Services are accessible through your web browser at
                      www.chiku-ai.in
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    2. Account Activation
                  </h2>
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-6 py-5">
                    <p className="font-semibold text-gray-900">
                      Timeline for Service Activation:
                    </p>
                    <div className="mt-3 space-y-2 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold text-gray-900">
                          Free Tier:
                        </span>{" "}
                        Instant activation upon Google sign-up
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Paid Plans:
                        </span>{" "}
                        Instant activation upon successful payment processing
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Payment Verification:
                        </span>{" "}
                        1-2 minutes for payment gateway confirmation
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Maximum Delay:
                        </span>{" "}
                        15 minutes in rare cases of payment processing delays
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    3. Geographic Availability
                  </h2>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Smeed AI is available globally through internet access</li>
                    <li>No geographic restrictions for service usage</li>
                    <li>
                      Works on any device with internet connection and web
                      browser
                    </li>
                    <li>Optimized for use in any timezone</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    4. Technical Requirements
                  </h2>
                  <p className="mt-3 font-semibold text-gray-900">
                    Minimum Requirements for Service &quot;Delivery&quot;:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>
                      Stable internet connection (minimum 1 Mbps recommended)
                    </li>
                    <li>Modern web browser (Chrome, Firefox, Safari, Edge)</li>
                    <li>
                      Device with microphone access for voice transcription
                    </li>
                    <li>
                      Screen sharing capabilities for AI analysis features
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    5. Service Interruptions
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    In the rare event of service interruptions:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>We strive for 99.9% uptime availability</li>
                    <li>
                      Scheduled maintenance will be announced 24 hours in
                      advance
                    </li>
                    <li>Emergency maintenance may occur with minimal notice</li>
                    <li>
                      Service credits may be provided for extended outages
                    </li>
                    <li>
                      Users will be notified via email of any significant
                      service disruptions
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    6. Data Delivery and Storage
                  </h2>
                  <p className="mt-3 font-semibold text-gray-900">
                    Your Data Access:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>
                      Interview transcripts are available immediately during
                      sessions
                    </li>
                    <li>
                      Session history is accessible through your dashboard
                    </li>
                    <li>
                      Resume data is stored securely and accessible anytime
                    </li>
                    <li>No physical copies or documents are shipped</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    7. Account Portability
                  </h2>
                  <div className="mt-4 rounded-xl bg-orange-50 border border-orange-200 px-6 py-5">
                    <div className="border-l-4 border-orange-500 pl-5">
                      <p className="font-semibold text-orange-800">
                        Device Independence:
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-orange-700">
                        Your Smeed AI account and services are accessible from
                        any device with internet access. Simply log in to your
                        account to access all your purchased minutes and
                        features.
                      </p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    8. Support and Assistance
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    If you experience any issues accessing our digital services:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Check our system status at www.chiku-ai.in</li>
                    <li>Verify your internet connection</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Contact support at support@smeedai.com</li>
                    <li>
                      Include your account email and description of the issue
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    9. Service Limitations
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    While we don&apos;t ship physical products, our digital
                    services have these considerations:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>
                      Requires active internet connection for real-time features
                    </li>
                    <li>
                      Performance may vary based on device capabilities
                    </li>
                    <li>
                      Some features require specific browser permissions
                    </li>
                    <li>
                      Service quality depends on user&apos;s internet speed and
                      stability
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    10. International Access
                  </h2>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>No customs or import duties (digital service)</li>
                    <li>No shipping delays or lost packages</li>
                    <li>Instant access regardless of location</li>
                    <li>Pricing shown includes all applicable taxes</li>
                    <li>Payment processing may vary by country</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    11. Contact Information
                  </h2>
                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-6 py-5 text-sm text-gray-700">
                    <p className="text-gray-700">
                      For any questions about service delivery or access:
                    </p>
                    <div className="mt-4 space-y-2">
                      <p>
                        <span className="font-semibold text-gray-900">
                          Email:
                        </span>{" "}
                        support@smeedai.com
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Subject Line:
                        </span>{" "}
                        &quot;Service Access&quot; or &quot;Technical Support&quot;
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Website:
                        </span>{" "}
                        www.chiku-ai.in
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Response Time:
                        </span>{" "}
                        Within 24 hours
                      </p>
                      <p>
                        <span className="font-semibold text-gray-900">
                          Business Hours:
                        </span>{" "}
                        24/7 service availability, support Mon-Fri 9 AM - 6 PM IST
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

