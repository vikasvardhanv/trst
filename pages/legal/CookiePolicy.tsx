import React from 'react';
import { Layout } from '../../components/layout/Layout';
import { SEO } from '../../components/ui/SEO';
import { AnimatedSection } from '../../components/ui/AnimatedSection';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { Link } from 'react-router-dom';
import { Cookie, Settings, Mail, Shield, BarChart3, Target } from 'lucide-react';

export const CookiePolicy: React.FC = () => {
  const { openPreferences } = useCookieConsent();
  const lastUpdated = 'December 27, 2025';

  const cookieTable = [
    {
      category: 'Necessary',
      cookies: [
        { name: 'highshift_auth_token', purpose: 'User authentication', duration: '7 days', provider: 'Highshift Media' },
        { name: 'highshift_user', purpose: 'User session data', duration: '7 days', provider: 'Highshift Media' },
        { name: 'highshift_cookie_consent', purpose: 'Store cookie preferences', duration: '1 year', provider: 'Highshift Media' },
      ],
    },
    {
      category: 'Analytics',
      cookies: [
        { name: '_ga', purpose: 'Distinguish users', duration: '2 years', provider: 'Google Analytics' },
        { name: '_gid', purpose: 'Distinguish users', duration: '24 hours', provider: 'Google Analytics' },
        { name: '_gat', purpose: 'Throttle request rate', duration: '1 minute', provider: 'Google Analytics' },
      ],
    },
    {
      category: 'Marketing',
      cookies: [
        { name: '_fbp', purpose: 'Facebook advertising', duration: '3 months', provider: 'Facebook (if enabled)' },
        { name: '_gcl_au', purpose: 'Google Ads conversion', duration: '3 months', provider: 'Google Ads (if enabled)' },
      ],
    },
    {
      category: 'Preferences',
      cookies: [
        { name: 'theme_preference', purpose: 'Remember theme setting', duration: '1 year', provider: 'Highshift Media' },
        { name: 'language', purpose: 'Remember language preference', duration: '1 year', provider: 'Highshift Media' },
      ],
    },
  ];

  return (
    <Layout>
      <SEO
        title="Cookie Policy | Highshift Media"
        description="Learn about the cookies we use on Highshift Media and how to manage your preferences. Understand our cookie categories and control your privacy settings."
        keywords="cookie policy, cookie preferences, website cookies, privacy settings, GDPR cookies, digital marketing agency cookies"
        url="/cookies"
        noindex={false}
      />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex p-4 rounded-2xl bg-amber-500/20 text-amber-400 mb-6">
              <Cookie className="h-8 w-8" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
              Cookie Policy
            </h1>
            <p className="text-white/60 mb-6">
              Last updated: {lastUpdated}
            </p>
            <Button onClick={openPreferences} icon={<Settings className="h-4 w-4" />}>
              Manage Cookie Preferences
            </Button>
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
                  This Cookie Policy explains what cookies are, how Highshift Media uses cookies and
                  similar technologies on our website, and how you can control them.
                </p>

                {/* Section 1 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
                  <p className="text-white/70 mb-4">
                    Cookies are small text files that are stored on your device (computer, tablet, or mobile)
                    when you visit a website. They are widely used to make websites work more efficiently
                    and provide information to website owners.
                  </p>
                  <p className="text-white/70">
                    Cookies can be "persistent" (remain on your device until deleted) or "session"
                    (deleted when you close your browser).
                  </p>
                </section>

                {/* Section 2 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">2. Types of Cookies We Use</h2>

                  <div className="grid gap-4 mb-6">
                    {/* Necessary */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Shield className="h-5 w-5 text-emerald-400" />
                        <h3 className="text-lg font-semibold text-white">Necessary Cookies</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-400">
                          Always Active
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">
                        Essential for the website to function. These cookies enable core functionality
                        like user authentication and security. They cannot be disabled.
                      </p>
                    </div>

                    {/* Analytics */}
                    <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <BarChart3 className="h-5 w-5 text-sky-400" />
                        <h3 className="text-lg font-semibold text-white">Analytics Cookies</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-sky-500/20 text-sky-400">
                          Optional
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">
                        Help us understand how visitors interact with our website by collecting
                        anonymous information. We use Google Analytics for this purpose.
                      </p>
                    </div>

                    {/* Marketing */}
                    <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Target className="h-5 w-5 text-purple-400" />
                        <h3 className="text-lg font-semibold text-white">Marketing Cookies</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-purple-500/20 text-purple-400">
                          Optional
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">
                        Used to track visitors across websites to display relevant advertisements.
                        These may be set by our advertising partners.
                      </p>
                    </div>

                    {/* Preferences */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-3 mb-2">
                        <Settings className="h-5 w-5 text-amber-400" />
                        <h3 className="text-lg font-semibold text-white">Preference Cookies</h3>
                        <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-400">
                          Optional
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">
                        Allow the website to remember your preferences like language or theme
                        for a more personalized experience.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Section 3 - Cookie Table */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">3. Cookies We Use</h2>
                  <p className="text-white/70 mb-6">
                    Below is a detailed list of cookies used on our website:
                  </p>

                  {cookieTable.map((category) => (
                    <div key={category.category} className="mb-6">
                      <h3 className="text-lg font-semibold text-white mb-3">{category.category} Cookies</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-white/50 font-medium">Cookie Name</th>
                              <th className="text-left py-3 px-4 text-white/50 font-medium">Purpose</th>
                              <th className="text-left py-3 px-4 text-white/50 font-medium">Duration</th>
                              <th className="text-left py-3 px-4 text-white/50 font-medium">Provider</th>
                            </tr>
                          </thead>
                          <tbody>
                            {category.cookies.map((cookie) => (
                              <tr key={cookie.name} className="border-b border-white/5">
                                <td className="py-3 px-4 text-white font-mono text-xs">{cookie.name}</td>
                                <td className="py-3 px-4 text-white/70">{cookie.purpose}</td>
                                <td className="py-3 px-4 text-white/70">{cookie.duration}</td>
                                <td className="py-3 px-4 text-white/70">{cookie.provider}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </section>

                {/* Section 4 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">4. Third-Party Cookies</h2>
                  <p className="text-white/70 mb-4">
                    Some cookies on our website are set by third parties, including:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li><strong className="text-white">Google Analytics:</strong> For website analytics and performance monitoring</li>
                    <li><strong className="text-white">Calendly:</strong> For scheduling consultations</li>
                    <li><strong className="text-white">Google Ads:</strong> For advertising (if enabled)</li>
                    <li><strong className="text-white">Social Media:</strong> If you interact with social sharing features</li>
                  </ul>
                  <p className="text-white/70 mt-4">
                    These third parties have their own privacy policies governing their use of cookies.
                  </p>
                </section>

                {/* Section 5 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">5. Managing Your Preferences</h2>
                  <p className="text-white/70 mb-4">
                    You have several options for managing cookies:
                  </p>

                  <h3 className="text-xl font-semibold text-white mb-3">On Our Website</h3>
                  <p className="text-white/70 mb-4">
                    Use our cookie preference center to customize which optional cookies you allow:
                  </p>
                  <div className="mb-6">
                    <Button onClick={openPreferences} variant="secondary" icon={<Settings className="h-4 w-4" />}>
                      Open Cookie Settings
                    </Button>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-3">In Your Browser</h3>
                  <p className="text-white/70 mb-4">
                    Most browsers allow you to manage cookies through their settings:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li><strong className="text-white">Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                    <li><strong className="text-white">Firefox:</strong> Settings → Privacy & Security → Cookies</li>
                    <li><strong className="text-white">Safari:</strong> Preferences → Privacy → Cookies</li>
                    <li><strong className="text-white">Edge:</strong> Settings → Cookies and Site Permissions</li>
                  </ul>
                  <p className="text-white/70 mt-4">
                    Note: Blocking all cookies may impact website functionality.
                  </p>
                </section>

                {/* Section 6 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">6. Do Not Track</h2>
                  <p className="text-white/70">
                    We respect the Do Not Track (DNT) browser setting. If you have DNT enabled,
                    we will not load analytics or marketing cookies, even if you have previously
                    consented.
                  </p>
                </section>

                {/* Section 7 */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">7. Changes to This Policy</h2>
                  <p className="text-white/70">
                    We may update this Cookie Policy from time to time to reflect changes in our
                    practices or for legal reasons. We will notify you of significant changes by
                    updating the "Last Updated" date and, if appropriate, through a notice on our website.
                  </p>
                </section>

                {/* More Info */}
                <section className="mb-10">
                  <h2 className="text-2xl font-bold text-white mb-4">8. More Information</h2>
                  <p className="text-white/70 mb-4">
                    For more information about how we handle your data, please see our:
                  </p>
                  <ul className="list-disc list-inside text-white/70 space-y-2">
                    <li>
                      <Link to="/privacy" className="text-sky-400 hover:underline">Privacy Policy</Link>
                    </li>
                    <li>
                      <Link to="/terms" className="text-sky-400 hover:underline">Terms of Service</Link>
                    </li>
                  </ul>
                </section>

                {/* Contact */}
                <section className="mt-12 p-6 rounded-xl bg-white/5 border border-white/10">
                  <h2 className="text-2xl font-bold text-white mb-4">Questions?</h2>
                  <p className="text-white/70 mb-4">
                    If you have questions about our use of cookies, please contact us:
                  </p>
                  <div className="flex items-center gap-3 text-white/70">
                    <Mail className="h-5 w-5 text-sky-400" />
                    <a href="mailto:privacy@highshiftmedia.com" className="hover:text-sky-400">
                      privacy@highshiftmedia.com
                    </a>
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
