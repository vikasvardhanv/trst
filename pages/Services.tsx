import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { SERVICES } from '../constants';
import { Service } from '../types';
import {
  ArrowRight, ChevronRight, Zap, TrendingUp, Clock, Shield, Users,
  MessageSquare, Mic, Video, Mail, Building2, Megaphone, Settings, Lightbulb,
  CheckCircle2, Phone, Calendar, Bot, X, Play, ExternalLink, Check
} from 'lucide-react';

// Map service IDs to routes
const serviceRoutes: Record<string, string> = {
  industry_agents: '/agents',
  automotive_ai: '/agents',
  realestate_ai: '/agents',
  hospitality_ai: '/agents',
  ecommerce_ai: '/agents',
  marketing_hub: '/marketing',
  whatsapp_bot: '/demos/whatsapp',
  chatbot: '/contact',
  voice_agent: '/demos/voice',
  video_agent: '/contact',
  email_agent: '/contact',
  support_agent: '/contact',
  business_plan: '/demos/business-plan',
  website_creation: '/marketing',
  content: '/marketing',
  seo_aeo: '/marketing',
  social_automation: '/marketing',
  lead_generation: '/demos/lead-gen',
  automation: '/contact',
  crm_automation: '/contact',
  integrations: '/contact',
  model: '/contact',
  data_analytics: '/contact',
  business_intelligence: '/contact',
  ai_consulting: '/contact',
  ai_audit: '/contact',
  ai_training: '/contact',
};

// Service categories with icons and descriptions
const categories = [
  { id: 'all', name: 'All Services', icon: <Zap className="h-4 w-4" />, count: 0 },
  { id: 'agents', name: 'AI Agents', icon: <Bot className="h-4 w-4" />, desc: 'Chat, Voice, Video & Messaging' },
  { id: 'industry', name: 'Industries', icon: <Building2 className="h-4 w-4" />, desc: 'Sector-specific solutions' },
  { id: 'marketing', name: 'Marketing', icon: <Megaphone className="h-4 w-4" />, desc: 'Growth & content automation' },
  { id: 'automation', name: 'Automation', icon: <Settings className="h-4 w-4" />, desc: 'Workflows & integrations' },
  { id: 'consulting', name: 'Consulting', icon: <Lightbulb className="h-4 w-4" />, desc: 'Strategy & training' },
];

// Hero stats
const heroStats = [
  { value: '50+', label: 'AI Solutions Deployed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '2 Weeks', label: 'Avg. Deployment' },
];

// Detailed process steps
const processSteps = [
  {
    step: '01',
    title: 'Discovery Call',
    desc: 'We learn about your business, challenges, and goals. Identify high-impact AI opportunities.',
    duration: '30 min call',
    icon: <Phone className="h-6 w-6" />,
    details: ['Business analysis', 'Pain point mapping', 'Opportunity assessment', 'ROI estimation']
  },
  {
    step: '02',
    title: 'Solution Design',
    desc: 'Our team architects a custom AI solution tailored to your specific workflows and systems.',
    duration: '3-5 days',
    icon: <Lightbulb className="h-6 w-6" />,
    details: ['Technical architecture', 'Integration planning', 'UX/conversation design', 'Security review']
  },
  {
    step: '03',
    title: 'Build & Train',
    desc: 'We develop your AI agents, train them on your data, and integrate with your existing tools.',
    duration: '1-4 weeks',
    icon: <Settings className="h-6 w-6" />,
    details: ['Agent development', 'Knowledge base setup', 'API integrations', 'Testing & QA']
  },
  {
    step: '04',
    title: 'Launch & Optimize',
    desc: 'Go live with full support. We monitor performance and continuously improve your AI.',
    duration: 'Ongoing',
    icon: <TrendingUp className="h-6 w-6" />,
    details: ['Deployment', 'Team training', 'Performance monitoring', 'Continuous optimization']
  },
];

// What's included
const included = [
  'Custom AI agent development',
  'Integration with your existing tools',
  'Dedicated project manager',
  'Training for your team',
  '24/7 monitoring & support',
  'Regular performance reports',
  'Continuous optimization',
  'Scalable infrastructure',
];

// Tech partners
const techStack = [
  'OpenAI', 'Anthropic', 'Google Gemini', 'Meta Llama', 'LangChain',
  'Pinecone', 'Twilio', 'SendGrid', 'Salesforce', 'HubSpot', 'Zapier', 'Make'
];

// Service Detail Modal Component
const ServiceDetailModal: React.FC<{
  service: Service | null;
  onClose: () => void;
  onDemo: (demoId: string) => void;
  onContact: () => void;
}> = ({ service, onClose, onDemo, onContact }) => {
  if (!service) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 border border-white/10 rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between p-6 border-b border-white/10 bg-gray-900/95 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="text-sky-400 mt-1">
              {service.icon}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-2xl font-bold text-white">{service.name}</h2>
                {service.highlight && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    service.highlight === 'New'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {service.highlight}
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm">{service.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Long Description */}
          {service.longDescription && (
            <div>
              <p className="text-white/70 text-lg leading-relaxed">
                {service.longDescription}
              </p>
            </div>
          )}

          {/* Benefits & Features Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Benefits */}
            {service.benefits && service.benefits.length > 0 && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  Key Benefits
                </h3>
                <ul className="space-y-3">
                  {service.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-white/70">
                      <Check className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Features */}
            {service.features && service.features.length > 0 && (
              <div className="bg-sky-500/5 border border-sky-500/20 rounded-xl p-5">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-sky-400" />
                  Features Included
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-white/70 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Use Cases */}
          {service.useCases && service.useCases.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-400" />
                Perfect For
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.useCases.map((useCase, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Integrations */}
          {service.integrations && service.integrations.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-amber-400" />
                Integrates With
              </h3>
              <div className="flex flex-wrap gap-2">
                {service.integrations.map((integration, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 text-sm"
                  >
                    {integration}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTAs */}
        <div className="sticky bottom-0 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-white/10 bg-gray-900/95 backdrop-blur-sm">
          <p className="text-white/50 text-sm">
            Ready to get started? Let's discuss your needs.
          </p>
          <div className="flex items-center gap-3">
            {service.demoId && (
              <Button
                variant="secondary"
                icon={<Play className="h-4 w-4" />}
                onClick={() => onDemo(service.demoId!)}
              >
                Try Demo
              </Button>
            )}
            <Button
              icon={<ArrowRight className="h-4 w-4" />}
              onClick={onContact}
            >
              Get Quote
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Services: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Calculate category counts
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return SERVICES.filter(s => s.id !== 'snake' && s.id !== 'external_website').length;
    }
    return SERVICES.filter(s => s.category === categoryId).length;
  };

  const filteredServices = SERVICES.filter(service => {
    if (activeCategory === 'all') return true;
    return service.category === activeCategory;
  }).filter(service => service.id !== 'snake' && service.id !== 'external_website');

  // Handle modal close with escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedService(null);
      }
    };
    if (selectedService) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [selectedService]);

  // Handle URL-based service selection
  useEffect(() => {
    if (serviceId) {
      const service = SERVICES.find(s => s.id === serviceId);
      if (service) {
        setSelectedService(service);
      } else {
        const element = document.getElementById(serviceId);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('ring-2', 'ring-sky-500', 'ring-offset-4', 'ring-offset-black');
            setTimeout(() => {
              element.classList.remove('ring-2', 'ring-sky-500', 'ring-offset-4', 'ring-offset-black');
            }, 2000);
          }, 500);
        }
      }
    }
  }, [serviceId]);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
  };

  const handleDemo = (demoId: string) => {
    setSelectedService(null);
    navigate(`/demos/${demoId}`);
  };

  const handleContact = () => {
    setSelectedService(null);
    navigate('/contact');
  };

  return (
    <Layout>
      <SEO
        title="Digital Marketing Services & AI Solutions | Highshift Media"
        description="Full-service digital marketing agency offering AI chatbots, voice agents, social media marketing, content marketing, SEO services, and marketing automation. Affordable solutions for small businesses. Get custom AI solutions for your industry."
        keywords="digital marketing services, AI chatbot services, voice AI solutions, social media marketing services, content marketing services, SEO services, marketing automation, small business marketing, affordable digital marketing"
        url="/services"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <AnimatedSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-sky-500/10 border border-sky-500/20">
                <Zap className="h-4 w-4 text-sky-400" />
                <span className="text-sm text-sky-300">Full-Service AI Agency</span>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <h1 className="text-5xl sm:text-7xl font-black text-white mb-6">
                <GradientText>AI Solutions That</GradientText>
                <br />
                <span className="text-white">Actually Work</span>
              </h1>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <p className="text-xl text-white/60 max-w-3xl mx-auto mb-10">
                From intelligent agents that handle your customers 24/7 to automation that eliminates repetitive work.
                We build AI that delivers real ROI.
              </p>
            </AnimatedSection>

            {/* Hero Stats */}
            <AnimatedSection delay={0.3}>
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {heroStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-black text-white">{stat.value}</div>
                    <div className="text-sm text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection delay={0.4}>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/contact">
                  <Button size="lg" icon={<Calendar className="h-5 w-5" />}>
                    Book Free Consultation
                  </Button>
                </Link>
                <Link to="/case-studies">
                  <Button variant="secondary" size="lg">
                    View Case Studies
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {category.icon}
                  <span>{category.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-xs ${
                    activeCategory === category.id ? 'bg-white/20' : 'bg-white/10'
                  }`}>
                    {getCategoryCount(category.id)}
                  </span>
                </button>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
              <StaggerItem key={service.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="h-full"
                >
                  <div
                    id={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="block h-full cursor-pointer"
                  >
                    <GlassCard className="p-5 h-full group hover:border-sky-500/30 transition-all relative overflow-hidden">
                      {/* Highlight Badge */}
                      {service.highlight && (
                        <div className="absolute top-3 right-3">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            service.highlight === 'New'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}>
                            {service.highlight}
                          </span>
                        </div>
                      )}

                      {/* Icon */}
                      <div className="text-sky-400 mb-4 group-hover:text-sky-300 transition-colors">
                        {service.icon}
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-200 transition-colors">
                        {service.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-white/50 mb-4 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-sky-400 text-sm font-medium group-hover:text-sky-300">
                        Learn more
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </GlassCard>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How We Work - Detailed */}
      <section className="py-20 px-4 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
              Our Process
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              How We Build Your AI
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A proven process that takes you from idea to deployed AI in weeks, not months.
            </p>
          </AnimatedSection>

          <div className="space-y-6">
            {processSteps.map((step, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <GlassCard className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Step Number & Icon */}
                    <div className="flex md:flex-col items-center gap-4 md:w-24 shrink-0">
                      <div className="text-5xl font-black text-sky-500/20">{step.step}</div>
                      <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
                        {step.icon}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                        <span className="px-3 py-1 rounded-full bg-white/5 text-white/50 text-xs">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-white/60 mb-4">{step.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {step.details.map((detail, i) => (
                          <span key={i} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-white/70 text-sm">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                            {detail}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
                What's Included
              </span>
              <h2 className="text-4xl font-black text-white mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-white/60 mb-8">
                Every engagement includes comprehensive support to ensure your AI solution delivers results.
              </p>
              <div className="grid sm:grid-cols-2 gap-3">
                {included.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-white/80">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <GlassCard className="p-8">
                <h3 className="text-xl font-bold text-white mb-6">Technologies We Use</h3>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Why Businesses Choose Highshift
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <Clock className="h-6 w-6" />, title: 'Fast Deployment', desc: 'Go live in 2-4 weeks, not months', metric: '2-4 Weeks' },
              { icon: <Shield className="h-6 w-6" />, title: 'Enterprise Security', desc: 'SOC 2 compliant, encrypted, GDPR ready', metric: '100% Secure' },
              { icon: <TrendingUp className="h-6 w-6" />, title: 'Proven ROI', desc: 'Average 300% return on investment', metric: '300% ROI' },
              { icon: <Users className="h-6 w-6" />, title: 'Dedicated Support', desc: '24/7 monitoring and optimization', metric: '24/7 Support' },
            ].map((item, index) => (
              <StaggerItem key={index}>
                <GlassCard className="p-6 h-full text-center">
                  <div className="inline-flex p-3 rounded-xl bg-sky-500/10 text-sky-400 mb-4">
                    {item.icon}
                  </div>
                  <div className="text-2xl font-black text-white mb-2">{item.metric}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50">{item.desc}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-[100px] rounded-full" />
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white mb-4">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                  Book a free 30-minute consultation. We'll analyze your business and show you exactly how AI can help.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/contact">
                    <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                      Book Free Consultation
                    </Button>
                  </Link>
                  <Link to="/demos">
                    <Button variant="secondary" size="lg">
                      Try Live Demos
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-white/40 mt-6">No commitment required. See real results in action.</p>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
            onDemo={handleDemo}
            onContact={handleContact}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};
