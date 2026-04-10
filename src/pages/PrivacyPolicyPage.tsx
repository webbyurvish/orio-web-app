import LandingNavbar from "../components/LandingNavbar";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-dvh">
      <LandingNavbar theme="dark" hideFeatures hideDesktopApp />

      <main className="saas-container py-10">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-indigo-100/55 bg-white/90 backdrop-blur-sm shadow-[0_8px_28px_rgba(79,70,229,0.07)]">
            <div className="px-6 py-8 md:px-10 md:py-10">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                Privacy Policy
              </h1>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>Last updated: December 14, 2025</p>
                <p>Effective date: December 14, 2025</p>
              </div>

              <div className="mt-10 space-y-9 text-gray-800">
                <section>
                  <h2 className="text-xl font-bold text-gray-900">Introduction</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    Welcome to Smeed AI. We are committed to protecting your
                    privacy and ensuring the secure handling of your personal
                    information. This Privacy Policy explains how we collect,
                    use, and safeguard your data when you use our AI-powered
                    interview assistance platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    Information We Collect
                  </h2>

                  <h3 className="mt-4 font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Email address and name for account creation</li>
                    <li>Payment information for subscription purchases</li>
                    <li>Resume content when uploaded for AI optimization</li>
                  </ul>

                  <h3 className="mt-6 font-semibold text-gray-900">Usage Data</h3>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Interview session transcripts and audio recordings</li>
                    <li>Screen capture data during interviews</li>
                    <li>AI interaction logs and usage analytics</li>
                    <li>
                      Technical data including IP address, device information,
                      and browser type
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    How We Use Your Information
                  </h2>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>To provide real-time AI assistance during interviews</li>
                    <li>
                      To generate personalized responses based on your resume
                      and experience
                    </li>
                    <li>To improve our AI models and service quality</li>
                    <li>
                      To process payments and manage your subscription
                    </li>
                    <li>
                      To provide customer support and respond to inquiries
                    </li>
                    <li>
                      To send important service updates and notifications
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">Data Security</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    We implement industry-standard security measures to protect
                    your personal information. All data is encrypted in transit
                    and at rest. Access to your data is strictly limited to
                    authorized personnel who need it to provide our services.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-gray-700">
                    However, please note that no method of transmission over
                    the internet or electronic storage is 100% secure, and we
                    cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    User Responsibility and Ethical Use
                  </h2>

                  <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 px-6 py-5">
                    <p className="font-semibold text-amber-900">
                      Important Notice Regarding Interview Ethics
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-amber-900/90">
                      Smeed AI is designed as an interview preparation and
                      assistance tool. While we provide AI-powered support to
                      help users during interviews, we want to emphasize the
                      importance of ethical use and personal responsibility.
                    </p>
                    <p className="mt-5 font-semibold text-amber-900">
                      User Responsibility:
                    </p>
                    <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-amber-900/90">
                      <li>
                        Users are solely responsible for how they use our
                        platform during interviews
                      </li>
                      <li>
                        We encourage honest and ethical participation in all
                        interview processes
                      </li>
                      <li>
                        Users should comply with the policies and expectations
                        of prospective employers
                      </li>
                      <li>
                        Any consequences arising from the use of our platform
                        during interviews are the user&apos;s responsibility
                      </li>
                    </ul>
                  </div>

                  <p className="mt-6 text-base leading-relaxed text-gray-700">
                    <span className="font-semibold text-gray-900">
                      Disclaimer:
                    </span>{" "}
                    Smeed AI is not responsible for any issues, consequences, or
                    ethical concerns that may arise from the use of our platform
                    during actual job interviews. This includes, but is not
                    limited to, cases where interview assistance is considered
                    inappropriate or against company policies. Users must
                    exercise their own judgment and act in accordance with
                    applicable laws, regulations, and ethical standards.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">Data Retention</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    We retain your personal information only for as long as
                    necessary to provide our services and comply with legal
                    obligations. Interview session data is typically retained
                    for 90 days unless you request earlier deletion.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-gray-700">
                    You can request deletion of your account and associated data
                    at any time by contacting us at support@chiku-ai.in.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    Third-Party Services
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    Our platform integrates with third-party AI services
                    (including OpenAI) to provide intelligent responses. These
                    services may have their own privacy policies and data
                    handling practices. We encourage you to review their
                    policies as well.
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-gray-700">
                    We do not sell, trade, or otherwise transfer your personal
                    information to third parties for marketing purposes.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">Your Rights</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    You have the right to:
                  </p>
                  <ul className="mt-3 list-disc pl-6 space-y-2 text-base text-gray-700">
                    <li>Access the personal information we hold about you</li>
                    <li>
                      Request correction of inaccurate or incomplete
                      information
                    </li>
                    <li>Request deletion of your personal information</li>
                    <li>Object to the processing of your personal information</li>
                    <li>Export your data in a portable format</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    Changes to This Policy
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    We may update this Privacy Policy from time to time. We will
                    notify you of any material changes by posting the new
                    Privacy Policy on this page and updating the &quot;Last
                    updated&quot; date. Continued use of our services after such
                    changes constitutes acceptance of the updated policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">
                    Contact Information
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    If you have any questions, concerns, or requests regarding
                    this Privacy Policy or our data practices, please contact us:
                  </p>

                  <div className="mt-4 rounded-xl bg-gray-50 border border-gray-200 px-6 py-5 text-sm text-gray-700">
                    <p className="font-semibold text-gray-900">Smeed AI</p>
                    <p className="mt-2">
                      Email:{" "}
                      <a
                        className="text-blue-600 hover:underline"
                        href="mailto:support@chiku-ai.in"
                      >
                        support@chiku-ai.in
                      </a>
                    </p>
                  </div>
                </section>

                <section>
                  <h2 className="text-xl font-bold text-gray-900">Governing Law</h2>
                  <p className="mt-3 text-base leading-relaxed text-gray-700">
                    This Privacy Policy is governed by and construed in
                    accordance with the laws of India. Any disputes relating to
                    this policy will be subject to the exclusive jurisdiction of
                    the courts in India.
                  </p>
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

