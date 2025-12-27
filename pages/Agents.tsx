import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { INDUSTRY_AGENTS } from '../constants';
import {
  ArrowRight, Bot, Play, Check, Sparkles, MessageSquare,
  Calendar, ShoppingCart, Stethoscope, Scissors, Car, HardHat, ChevronRight, BarChart3
} from 'lucide-react';

// Extended agent details
const agentDetails: Record<string, {
  benefits: string[];
  useCases: string[];
  integrations: string[];
}> = {
  restaurant: {
    benefits: ['Reduce wait times by 50%', 'Handle 1000+ orders/day', 'Zero missed reservations'],
    useCases: ['Table reservations', 'Menu inquiries', 'Order taking', 'Event bookings'],
    integrations: ['POS Systems', 'Reservation Platforms', 'Delivery Apps'],
  },
  clinic: {
    benefits: ['Cut no-shows by 40%', '24/7 appointment booking', 'Intelligent triage'],
    useCases: ['Appointment scheduling', 'Symptom pre-screening', 'Prescription refills', 'FAQs'],
    integrations: ['EHR Systems', 'Practice Management', 'Telehealth'],
  },
  salon: {
    benefits: ['Double booking capacity', 'Smart stylist matching', 'Automated reminders'],
    useCases: ['Service booking', 'Stylist selection', 'Product recommendations', 'Waitlist management'],
    integrations: ['Salon Software', 'Payment Systems', 'CRM'],
  },
  dealership: {
    benefits: ['Qualify leads 24/7', 'Instant inventory search', 'Schedule test drives'],
    useCases: ['Vehicle search', 'Test drive booking', 'Service appointments', 'Financing inquiries'],
    integrations: ['DMS Systems', 'Inventory Management', 'CRM'],
  },
  construction: {
    benefits: ['Real-time project tracking', 'Safety compliance alerts', 'Resource optimization'],
    useCases: ['Project updates', 'Safety checklists', 'Equipment tracking', 'Daily reports'],
    integrations: ['Project Management', 'Time Tracking', 'Safety Systems'],
  },
  real_estate: {
    benefits: ['Qualify leads instantly', '24/7 property inquiries', 'Automated viewing scheduling'],
    useCases: ['Property search', 'Mortgage estimation', 'Neighborhood info', 'Agent handoff'],
    integrations: ['MLS Feeds', 'CRM Systems', 'Calendar Apps'],
  },
  legal: {
    benefits: ['Filter unqualified leads', 'Automate intake forms', 'Reduce non-billable hours'],
    useCases: ['Case evaluation', 'Legal FAQs', 'Consultation booking', 'Document collection'],
    integrations: ['Practice Management', 'Document Systems', 'Calendar Apps'],
  },
  ecommerce: {
    benefits: ['Reduce support tickets by 70%', 'Increase conversion rates', 'Instant order status'],
    useCases: ['Order tracking', 'Product recommendations', 'Return processing', 'Gift finding'],
    integrations: ['Shopify/WooCommerce', 'Helpdesk Software', 'Inventory Systems'],
  },
  education: {
    benefits: ['Boost enrollment rates', '24/7 student support', 'Streamline admissions'],
    useCases: ['Course selection', 'Application help', 'Campus FAQs', 'Tuition info'],
    integrations: ['Student Information Systems', 'LMS', 'CRM'],
  },
  recruitment: {
    benefits: ['Screen candidates faster', 'Automate interview scheduling', 'Improve candidate experience'],
    useCases: ['Resume screening', 'Job description Q&A', 'Interview coordination', 'Onboarding'],
    integrations: ['ATS Systems', 'HRIS', 'Calendar Apps'],
  },
};

export const Agents: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <SEO
        title="AI Agents for Business | Industry-Specific Automation | Highshift Media"
        description="Deploy AI agents for restaurants, clinics, salons, dealerships & construction. Our digital marketing agency builds custom chatbots and automation solutions for small businesses. Best AI marketing solutions for your industry."
        keywords="AI agents for business, restaurant AI chatbot, clinic booking automation, salon AI assistant, dealership AI, construction automation, digital marketing agency, small business AI, industry-specific chatbots"
        url="/agents"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 border border-white/10"
            >
              <Bot className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-white/70">Industry-Specific AI Agents</span>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6">
              AI Agents
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              Pre-built AI agents designed for specific industries. Deploy in days, not months.
              Each agent is trained on industry best practices.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button size="lg" icon={<Calendar className="h-5 w-5" />}>
                  Book Free Consultation
                </Button>
              </Link>
              <Link to="/case-studies">
                <Button variant="secondary" size="lg" icon={<BarChart3 className="h-5 w-5" />}>
                  View Case Studies
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="space-y-8">
            {INDUSTRY_AGENTS.map((agent, index) => {
              const details = agentDetails[agent.id];
              return (
                <StaggerItem key={agent.id}>
                  <GlassCard className="p-8 lg:p-12">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                      {/* Left: Agent Info */}
                      <div>
                        <div className="flex items-start gap-4 mb-6">
                          <div className="p-4 rounded-2xl bg-white/5">{agent.icon}</div>
                          <div>
                            <h2 className="text-2xl font-bold text-white">{agent.name}</h2>
                            <p className="text-sky-400">{agent.industry}</p>
                          </div>
                        </div>

                        <p className="text-white/70 mb-6 leading-relaxed">{agent.description}</p>

                        {/* Features */}
                        <div className="mb-6">
                          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                            Key Features
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {agent.features.map((feature, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-sm bg-white/5 text-white/70 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-wrap gap-3">
                          <Link to={`/demos/${agent.id}`}>
                            <Button icon={<Play className="h-4 w-4" />}>
                              Try Demo
                            </Button>
                          </Link>
                          <Link to="/contact">
                            <Button variant="secondary">
                              Get Quote
                            </Button>
                          </Link>
                        </div>
                      </div>

                      {/* Right: Benefits & Use Cases */}
                      <div className="space-y-6">
                        {/* Benefits */}
                        <div>
                          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                            Benefits
                          </h3>
                          <div className="space-y-2">
                            {details?.benefits.map((benefit, i) => (
                              <div key={i} className="flex items-center gap-3 text-white/80">
                                <Check className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                                <span>{benefit}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Use Cases */}
                        <div>
                          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                            Use Cases
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {details?.useCases.map((useCase, i) => (
                              <div
                                key={i}
                                className="px-3 py-2 text-sm bg-sky-500/10 text-sky-300 rounded-lg"
                              >
                                {useCase}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Integrations */}
                        <div>
                          <h3 className="text-sm font-semibold text-white/50 uppercase tracking-wider mb-3">
                            Integrations
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {details?.integrations.map((integration, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs bg-purple-500/10 text-purple-300 rounded-full"
                              >
                                {integration}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* Custom Agent CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-sky-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">
                Need a Custom Agent?
              </h2>
              <p className="text-xl text-white/60 mb-8 max-w-xl mx-auto">
                Don't see your industry? We build custom AI agents tailored to your specific
                business requirements.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" icon={<Calendar className="h-5 w-5" />}>
                    Book Free Consultation
                  </Button>
                </Link>
                <Link to="/case-studies">
                  <Button variant="secondary" size="lg" icon={<BarChart3 className="h-5 w-5" />}>
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
