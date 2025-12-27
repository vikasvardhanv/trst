import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { GlassCard } from '../../components/ui/GlassCard';
import { Link } from 'react-router-dom';
import { FileText, Mail, MapPin } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  const lastUpdated = 'December 27, 2025';

  return (
    <Layout>
      <SEO
        title="Terms of Service | Highshift Media"
        description="Read the terms and conditions governing your use of Highshift Media's AI services, digital marketing solutions, and website."
        keywords="terms of service, terms and conditions, AI services terms, digital marketing agency terms, service agreement"
        url="/terms"
        noindex={false}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex p-4 rounded-2xl bg-purple-500/20 text-purple-400 mb-6">
              <FileText className="h-8 w-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Terms of Service
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
                  Welcome to Highshift Media. These Terms of Service ("Terms") govern your access to and
                  use of our website, products, and services. By accessing or using our services, you
                  agree to be bound by these Terms. If you do not agree, please do not use our services.
                </p>

                {/* Section 1 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                  <p className="text-white/70 mb-4">
                    By accessing our website at highshiftmedia.com or using any of our services, you
                    acknowledge that you have read, understood, and agree to be bound by these Terms
                    and our <Link to="/privacy" className="text-sky-400 hover:underline">Privacy Policy</Link>.
                  </p>
                  <p className="text-white/70">
                    We reserve the right to modify these Terms at any time. Continued use of our services
                    after changes constitutes acceptance of the modified Terms.
                  </p>
                </section>

                {/* Section 2 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">2. Description of Services</h2>
                  <p className="text-white/70 mb-4">
                    Highshift Media provides AI-powered solutions including:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Custom AI agent development and deployment</li>
                    <li>Industry-specific chatbot solutions</li>
                    <li>Marketing automation tools</li>
                    <li>Voice AI and conversational interfaces</li>
                    <li>WhatsApp and messaging integrations</li>
                    <li>AI consulting and implementation services</li>
                  </ul>
                </section>

                {/* Section 3 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>

                  <h3 className="text-xl font-semibold text-white mb-3">Registration</h3>
                  <p className="text-white/70 mb-4">
                    Some features require account registration. You agree to:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2 mb-6">
                    <li>Provide accurate and complete information</li>
                    <li>Maintain the security of your account credentials</li>
                    <li>Promptly update any changes to your information</li>
                    <li>Accept responsibility for all activities under your account</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-white mb-3">Account Termination</h3>
                  <p className="text-white/70">
                    We reserve the right to suspend or terminate accounts that violate these Terms
                    or engage in fraudulent, abusive, or illegal activities.
                  </p>
                </section>

                {/* Section 4 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Acceptable Use Policy</h2>
                  <p className="text-white/70 mb-4">
                    When using our services, you agree NOT to:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights of others</li>
                    <li>Transmit malicious code, viruses, or harmful content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Use our AI services to generate harmful, misleading, or illegal content</li>
                    <li>Resell or redistribute our services without authorization</li>
                    <li>Interfere with or disrupt the integrity of our services</li>
                    <li>Collect user data without proper consent</li>
                    <li>Use automated systems to scrape or extract data</li>
                  </ul>
                </section>

                {/* Section 5 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>

                  <h3 className="text-xl font-semibold text-white mb-3">Our Property</h3>
                  <p className="text-white/70 mb-4">
                    All content, features, and functionality of our services, including but not limited
                    to text, graphics, logos, icons, images, audio, video, software, and AI models, are
                    owned by Highshift Media and protected by intellectual property laws.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3">Your Content</h3>
                  <p className="text-white/70 mb-4">
                    You retain ownership of content you submit to our services. By submitting content,
                    you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce,
                    and display such content for the purpose of providing our services.
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3">AI-Generated Content</h3>
                  <p className="text-white/70">
                    Content generated by our AI services for you may be used for your business purposes.
                    However, we make no guarantees regarding originality, and you are responsible for
                    ensuring compliance with applicable laws.
                  </p>
                </section>

                {/* Section 6 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Payment Terms</h2>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Pricing for services is provided in project proposals or on our website</li>
                    <li>Payment is due according to the agreed-upon schedule</li>
                    <li>All fees are non-refundable unless otherwise specified</li>
                    <li>We reserve the right to change pricing with 30 days' notice</li>
                    <li>Late payments may result in service suspension</li>
                  </ul>
                </section>

                {/* Section 7 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">7. Service Level and Support</h2>
                  <p className="text-white/70 mb-4">
                    We strive to maintain high availability of our services. However:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Services may be temporarily unavailable for maintenance</li>
                    <li>We do not guarantee 100% uptime</li>
                    <li>Support is provided according to your service tier</li>
                    <li>Response times vary based on issue severity and support level</li>
                  </ul>
                </section>

                {/* Section 8 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimers</h2>
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 mb-4">
                    <p className="text-amber-200 text-sm">
                      <strong>IMPORTANT:</strong> Our services are provided "AS IS" and "AS AVAILABLE"
                      without warranties of any kind, either express or implied.
                    </p>
                  </div>
                  <p className="text-white/70 mb-4">
                    We disclaim all warranties including, but not limited to:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Merchantability and fitness for a particular purpose</li>
                    <li>Accuracy, reliability, or completeness of AI-generated content</li>
                    <li>Uninterrupted or error-free operation</li>
                    <li>Security or freedom from viruses or harmful components</li>
                  </ul>
                </section>

                {/* Section 9 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">9. Limitation of Liability</h2>
                  <p className="text-white/70 mb-4">
                    To the maximum extent permitted by law, Highshift Media shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>Indirect, incidental, special, consequential, or punitive damages</li>
                    <li>Loss of profits, revenue, data, or business opportunities</li>
                    <li>Damages resulting from unauthorized access to your data</li>
                    <li>Damages exceeding the amount paid by you in the past 12 months</li>
                  </ul>
                </section>

                {/* Section 10 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">10. Indemnification</h2>
                  <p className="text-white/70">
                    You agree to indemnify and hold harmless Highshift Media, its officers, directors,
                    employees, and agents from any claims, damages, losses, or expenses arising from
                    your use of our services, violation of these Terms, or infringement of any rights
                    of a third party.
                  </p>
                </section>

                {/* Section 11 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
                  <p className="text-white/70 mb-4">
                    Either party may terminate the service relationship:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>With 30 days' written notice for convenience</li>
                    <li>Immediately for material breach of these Terms</li>
                    <li>Immediately if required by law</li>
                  </ul>
                  <p className="text-white/70 mt-4">
                    Upon termination, your access to services will cease, and we may delete your data
                    after a reasonable retention period.
                  </p>
                </section>

                {/* Section 12 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
                  <p className="text-white/70">
                    These Terms shall be governed by and construed in accordance with the laws of the
                    State of Illinois, United States, without regard to its conflict of law provisions.
                    Any disputes shall be resolved in the courts located in Illinois.
                  </p>
                </section>

                {/* Section 13 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">13. Miscellaneous</h2>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li><strong className="text-white">Entire Agreement:</strong> These Terms constitute the entire agreement between you and Highshift Media</li>
                    <li><strong className="text-white">Severability:</strong> If any provision is found invalid, the remaining provisions remain in effect</li>
                    <li><strong className="text-white">Waiver:</strong> Failure to enforce any right does not waive that right</li>
                    <li><strong className="text-white">Assignment:</strong> You may not assign these Terms without our consent</li>
                  </ul>
                </section>

                {/* Contact */}
                <section className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                  <p className="text-white/70 mb-4">
                    If you have questions about these Terms of Service, please contact us:
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-white/70">
                      <Mail className="h-5 w-5 text-sky-400" />
                      <a href="mailto:legal@highshiftmedia.com" className="hover:text-sky-400">
                        legal@highshiftmedia.com
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
