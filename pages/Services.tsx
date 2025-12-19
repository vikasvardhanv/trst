import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ROICalculator } from '../components/tools/ROICalculator';
import { SERVICES } from '../constants';
import {
  ArrowRight, Bot, Megaphone, MessageSquare, Globe, Settings,
  FileText, Box, Briefcase, Mic, ChevronRight, Check, Sparkles
} from 'lucide-react';

// Map service IDs to routes
const serviceRoutes: Record<string, string> = {
  industry_agents: '/agents',
  marketing_hub: '/marketing',
  whatsapp_bot: '/demos/whatsapp',
  chatbot: '/services/chatbot',
  voice_agent: '/demos/voice',
  business_plan: '/demos/business-plan',
  website_creation: '/services/website',
  content: '/marketing',
  automation: '/services/automation',
  model: '/services/custom-model',
};

// Service categories
const categories = [
  { id: 'all', name: 'All Services' },
  { id: 'industry', name: 'Industry Solutions' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'automation', name: 'Automation' },
  { id: 'communication', name: 'Communication' },
];

// Benefits
const benefits = [
  { title: '24/7 Availability', description: 'AI never sleeps. Your business runs round the clock.' },
  { title: 'Cost Effective', description: 'Reduce operational costs by up to 60% with automation.' },
  { title: 'Scalable', description: 'Handle 10 or 10,000 customers with the same efficiency.' },
  { title: 'Custom Solutions', description: 'Tailored AI that fits your specific business needs.' },
];

export const Services: React.FC = () => {
  const { serviceId } = useParams();
  const [activeCategory, setActiveCategory] = React.useState('all');

  const filteredServices = SERVICES.filter(service => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  }).filter(service => service.id !== 'snake' && service.id !== 'external_website');

  useEffect(() => {
    if (serviceId) {
      const element = document.getElementById(serviceId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight effect
          element.classList.add('ring-2', 'ring-sky-500', 'ring-offset-4', 'ring-offset-black');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-sky-500', 'ring-offset-4', 'ring-offset-black');
          }, 2000);
        }, 500);
      }
    }
  }, [serviceId, filteredServices]);

  return (
    <Layout>
      <SEO 
        title="AI Services & Solutions | Highshift Media"
        description="Explore our comprehensive AI services: Custom Chatbots, Marketing Automation, Voice Agents, and Industry-Specific AI Solutions."
        keywords="AI Services, Chatbot Development, Marketing Automation, Voice AI, Business Automation"
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
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-white/70">Comprehensive AI Solutions</span>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6">
              Our Services
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
              From intelligent chatbots to complete business automation, we offer
              AI solutions that transform how you operate.
            </p>
          </AnimatedSection>

          {/* Category Filter */}
          <AnimatedSection delay={0.3}>
            <div className="flex flex-wrap items-center justify-center gap-2 mb-16">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === category.id
                      ? 'bg-sky-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-32 px-4">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <StaggerItem key={service.id}>
                <div id={service.id} className="h-full transition-all duration-500 rounded-[2.5rem]">
                  <Link to={serviceRoutes[service.id] || `/services/${service.id}`}>
                    <GlassCard className="p-8 h-full group">
                      <div className="text-sky-400 mb-6 group-hover:text-sky-300 transition-colors">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-sky-200 transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-white/60 mb-6 leading-relaxed group-hover:text-white/70 transition-colors">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-2 text-sky-400 font-medium">
                        Learn more
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </Link>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-transparent via-sky-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Why Choose AI?
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              AI-powered solutions deliver measurable results for your business.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <StaggerItem key={index}>
                <GlassCard className="p-6 text-center h-full">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-500/20 text-sky-400 mb-4">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-sm text-white/60">{benefit.description}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
        <AnimatedSection>
          <ROICalculator />
        </AnimatedSection>
      </section>

      {/* Process Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              How We Work
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A simple, streamlined process to get your AI solution up and running.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'We learn about your business and identify opportunities.' },
              { step: '02', title: 'Design', desc: 'Custom solution architecture tailored to your needs.' },
              { step: '03', title: 'Develop', desc: 'Build and test your AI solution with precision.' },
              { step: '04', title: 'Deploy', desc: 'Launch your solution with full support and training.' },
            ].map((item, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-6xl font-black text-sky-500/20 mb-4">{item.step}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white/60">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center">
              <h2 className="text-4xl font-black text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Let's discuss how AI can transform your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                    Contact Us
                  </Button>
                </Link>
                <Link to="/demos">
                  <Button variant="secondary" size="lg">
                    Try Live Demos
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
