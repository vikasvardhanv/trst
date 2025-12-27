import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { GlassCard } from '../../components/ui/GlassCard';
import { Link } from 'react-router-dom';
import { Shield, Mail, MapPin } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'December 27, 2025';

  return (
    <Layout>
      <SEO
        title="Privacy Policy | Highshift Media"
        description="Learn how Highshift Media collects, uses, and protects your personal information. Our digital marketing agency is committed to your privacy and data security."
        keywords="privacy policy, data protection, GDPR compliance, digital marketing agency privacy, user data security"
        url="/privacy"
        noindex={false}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex p-4 rounded-2xl bg-sky-500/20 text-sky-400 mb-6">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-white/60">
              Last updated: {lastUpdated}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-8 md:p-12">
              <div className="prose prose-invert prose-lg max-w-none">
                {/* Introduction */}
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  At Highshift Media ("we," "our," or "us"), we are committed to protecting your privacy.
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information
                  when you visit our website highshiftmedia.com and use our AI-powered services.
                </p>

                {/* Section 1 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>

                  <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
                  <p className="text-white/70 mb-4">
                    We may collect personal information that you voluntarily provide, including:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                    <li>Name and contact information (email address, phone number)</li>
                    <li>Company name and job title</li>
                    <li>Account credentials (email and password)</li>
                    <li>Payment information (processed securely through third-party providers)</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">Automatically Collected Information</h3>
                  <p className="text-white/70 mb-4">
                    When you visit our website, we automatically collect certain information:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Device information (browser type, operating system)</li>
                    <li>IP address and general location</li>
                    <li>Pages visited and time spent on our website</li>
                    <li>Referring website or source</li>
                    <li>Interaction with our AI demos and services</li>
                  </ul>
                </section>

                {/* Section 2 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
                  <p className="text-white/70 mb-4">We use the collected information for:</p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Providing and maintaining our services</li>
                    <li>Processing transactions and sending related information</li>
                    <li>Responding to your inquiries and support requests</li>
                    <li>Sending promotional communications (with your consent)</li>
                    <li>Improving our website and services</li>
                    <li>Analyzing usage patterns and trends</li>
                    <li>Protecting against fraudulent or unauthorized activity</li>
                    <li>Complying with legal obligations</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">3. Cookies and Tracking Technologies</h2>
                  <p className="text-white/70 mb-4">
                    We use cookies and similar tracking technologies to enhance your experience.
                    These include:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 mb-4">
                    <li><strong className="text-white">Essential Cookies:</strong> Required for website functionality and authentication</li>
                    <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                    <li><strong className="text-white">Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                    <li><strong className="text-white">Preference Cookies:</strong> Remember your settings and preferences</li>
                  </ul>
                  <p className="text-white/70">
                    You can manage your cookie preferences through our{' '}
                    <Link to="/cookies" className="text-sky-400 hover:underline">Cookie Settings</Link>.
                  </p>
                </section>

                {/* Section 4 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
                  <p className="text-white/70 mb-4">
                    We do not sell your personal information. We may share your data with:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li><strong className="text-white">Service Providers:</strong> Third parties who assist in operating our business (hosting, analytics, payment processing)</li>
                    <li><strong className="text-white">Business Partners:</strong> With your consent, for joint marketing efforts</li>
                    <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong className="text-white">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                  </ul>
                </section>

                {/* Section 5 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights and Choices</h2>

                  <h3 className="text-xl font-semibold text-white mb-3">GDPR Rights (EU/EEA Residents)</h3>
                  <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                    <li>Right to access your personal data</li>
                    <li>Right to rectification of inaccurate data</li>
                    <li>Right to erasure ("right to be forgotten")</li>
                    <li>Right to restrict processing</li>
                    <li>Right to data portability</li>
                    <li>Right to object to processing</li>
                    <li>Right to withdraw consent</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">CCPA Rights (California Residents)</h3>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Right to know what personal information is collected</li>
                    <li>Right to know if personal information is sold or disclosed</li>
                    <li>Right to opt-out of the sale of personal information</li>
                    <li>Right to request deletion of personal information</li>
                    <li>Right to non-discrimination for exercising your rights</li>
                  </ul>
                </section>

                {/* Section 6 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
                  <p className="text-white/70">
                    We implement appropriate technical and organizational measures to protect your personal
                    information, including encryption, secure servers, and access controls. However, no
                    method of transmission over the Internet is 100% secure, and we cannot guarantee
                    absolute security.
                  </p>
                </section>

                {/* Section 7 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
                  <p className="text-white/70">
                    We retain your personal information only for as long as necessary to fulfill the
                    purposes outlined in this policy, unless a longer retention period is required by law.
                    When data is no longer needed, we securely delete or anonymize it.
                  </p>
                </section>

                {/* Section 8 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">8. Children's Privacy</h2>
                  <p className="text-white/70">
                    Our services are not intended for individuals under 18 years of age. We do not
                    knowingly collect personal information from children. If you believe we have
                    collected information from a minor, please contact us immediately.
                  </p>
                </section>

                {/* Section 9 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">9. International Data Transfers</h2>
                  <p className="text-white/70">
                    Your information may be transferred to and processed in countries other than your
                    own. We ensure appropriate safeguards are in place to protect your data in accordance
                    with applicable data protection laws.
                  </p>
                </section>

                {/* Section 10 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                  <p className="text-white/70">
                    We may update this Privacy Policy from time to time. We will notify you of any
                    material changes by posting the new policy on this page and updating the "Last Updated"
                    date. We encourage you to review this policy periodically.
                  </p>
                </section>

                {/* Contact */}
                <section className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-white/70 mb-4">
                    If you have questions about this Privacy Policy or wish to exercise your rights,
                    please contact us:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/70">
                      <Mail className="h-5 w-5 text-sky-400" />
                      <a href="mailto:privacy@highshiftmedia.com" className="hover:text-sky-400">
                        privacy@highshiftmedia.com
                      </a>
                    </div>
                    <div className="flex items-center gap-3 text-white/70">
                      <MapPin className="h-5 w-5 text-sky-400" />
                      <span>Highshift Media, United States</span>
                    </div>
                  </div>
                </section>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
