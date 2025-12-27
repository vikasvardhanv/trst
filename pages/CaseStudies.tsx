import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { ROICalculator } from '../components/tools/ROICalculator';
import {
  ArrowRight, TrendingUp, CheckCircle2, XCircle, X, Star, Quote, HelpCircle, Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: 'Healthcare' | 'Automotive' | 'Retail' | 'Hospitality' | 'Real Estate';
  description: string;
  metrics: {
    label: string;
    value: string;
    trend: 'up' | 'down';
  }[];
  before: string[];
  after: string[];
  image: string;
  tags: string[];
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'dental-clinic-automation',
    title: 'Automating Patient Triage & Scheduling',
    client: 'BrightSmile Dental Group',
    industry: 'Healthcare',
    description: 'Implemented a 24/7 AI voice and chat agent to handle appointment bookings, emergency triage, and insurance verification.',
    metrics: [
      { label: 'Missed Calls Reduced', value: '98%', trend: 'down' },
      { label: 'Booking Increase', value: '45%', trend: 'up' },
      { label: 'Admin Hours Saved', value: '120/mo', trend: 'up' },
    ],
    before: [
      'Receptionist overwhelmed by calls',
      'High rate of missed appointments',
      'Manual insurance verification took 15 mins',
      'No after-hours booking capability'
    ],
    after: [
      'AI handles 100% of initial calls',
      'Automated SMS reminders reduced no-shows',
      'Instant insurance eligibility checks',
      '24/7 booking directly into PMS'
    ],
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=800&auto=format&fit=crop',
    tags: ['Voice Agent', 'Scheduling', 'Healthcare']
  },
  {
    id: 'auto-dealership-leads',
    title: 'Instant Lead Qualification & Test Drives',
    client: 'Metro City Ford',
    industry: 'Automotive',
    description: 'Deployed a multi-channel AI agent (Web + WhatsApp) to qualify inbound leads and schedule test drives automatically.',
    metrics: [
      { label: 'Lead Response Time', value: '< 5s', trend: 'down' },
      { label: 'Test Drives Booked', value: '+300%', trend: 'up' },
      { label: 'Cost Per Lead', value: '-40%', trend: 'down' },
    ],
    before: [
      'Leads waited 4+ hours for a callback',
      'Sales team wasted time on unqualified leads',
      'Manual follow-ups were inconsistent',
      'Lost leads during weekends'
    ],
    after: [
      'Instant 24/7 engagement',
      'AI qualifies budget and timeline',
      'Direct calendar integration for sales',
      'Automated nurturing sequences'
    ],
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop',
    tags: ['Lead Gen', 'WhatsApp Bot', 'Sales']
  },
  {
    id: 'salon-booking-system',
    title: 'Smart Stylist Matching & Retention',
    client: 'Luxe Hair Studio',
    industry: 'Retail',
    description: 'Created a personalized booking assistant that recommends products and matches clients with the perfect stylist based on hair type.',
    metrics: [
      { label: 'Rebooking Rate', value: '85%', trend: 'up' },
      { label: 'Retail Sales', value: '+25%', trend: 'up' },
      { label: 'Phone Volume', value: '-70%', trend: 'down' },
    ],
    before: [
      'Clients booked wrong services',
      'Stylists interrupted by phone calls',
      'Low retail product attachment',
      'Manual waitlist management'
    ],
    after: [
      'AI recommends correct service duration',
      'Stylists focus 100% on clients',
      'Smart product suggestions pre-checkout',
      'Automated waitlist filling'
    ],
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop',
    tags: ['Booking', 'Retail', 'Personalization']
  },
  {
    id: 'hotel-concierge',
    title: 'Smart Hotel Concierge',
    client: 'Grand Horizon Hotels',
    industry: 'Hospitality',
    description: 'Automated guest requests for room service, housekeeping, and local recommendations via WhatsApp.',
    metrics: [
      { label: 'Guest Satisfaction', value: '4.9/5', trend: 'up' },
      { label: 'Service Response', value: '< 2m', trend: 'down' },
      { label: 'Room Service Rev', value: '+18%', trend: 'up' },
    ],
    before: [
      'Front desk overwhelmed at peak hours',
      'Long wait times for simple requests',
      'Missed upsell opportunities',
      'Language barriers with international guests'
    ],
    after: [
      'Instant AI responses in 50+ languages',
      'Automated dispatch to housekeeping',
      'Smart upsells for dining & spa',
      'Zero hold times for guests'
    ],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    tags: ['Hospitality', 'Concierge', 'Multi-lingual']
  },
  {
    id: 'real-estate-virtual-tours',
    title: '24/7 Property Virtual Tours',
    client: 'Summit Realty Group',
    industry: 'Real Estate',
    description: 'AI agent qualifies buyers and schedules in-person viewings after guiding them through virtual tours.',
    metrics: [
      { label: 'Qualified Leads', value: '+45%', trend: 'up' },
      { label: 'Viewing Show Rate', value: '92%', trend: 'up' },
      { label: 'Agent Time Saved', value: '20h/wk', trend: 'up' },
    ],
    before: [
      'Agents wasting time on unqualified leads',
      'No-shows for property viewings',
      'Manual follow-up emails ignored',
      'Limited viewing hours'
    ],
    after: [
      'AI pre-qualifies budget & timeline',
      'Automated reminders reduce no-shows',
      'Instant answers to property FAQs',
      '24/7 virtual tour guidance'
    ],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=800&auto=format&fit=crop',
    tags: ['Real Estate', 'Lead Qual', 'Virtual Tours']
  },
];

const INDUSTRIES = ['All', 'Healthcare', 'Automotive', 'Retail', 'Hospitality', 'Real Estate'];

// Testimonials
const TESTIMONIALS = [
  {
    quote: "Highshift transformed our customer service. Our AI agent handles 80% of inquiries automatically.",
    author: "Sarah Chen",
    role: "CEO, TechFlow Inc",
    rating: 5,
  },
  {
    quote: "The marketing automation saved us 20+ hours per week. ROI was visible within the first month.",
    author: "Michael Rodriguez",
    role: "Marketing Director, GrowthLabs",
    rating: 5,
  },
  {
    quote: "Best AI agency we've worked with. They understand our business and deliver results.",
    author: "Emily Watson",
    role: "Founder, HealthPlus",
    rating: 5,
  },
];

// FAQ
const FAQS = [
  {
    question: "How long does it take to build an AI agent?",
    answer: "Simple agents can be deployed in 1-2 weeks. Complex, custom enterprise solutions typically take 4-8 weeks depending on integration requirements."
  },
  {
    question: "Is my business data secure?",
    answer: "Absolutely. We use enterprise-grade security with private instances, encryption, and strict data governance. Your data never trains public models."
  },
  {
    question: "Do I need technical knowledge to manage the AI?",
    answer: "No. We build user-friendly dashboards and provide full training. Our support team handles all technical maintenance."
  },
  {
    question: "What is the cost structure?",
    answer: "We offer project-based pricing for development and monthly retainers for ongoing support. Custom quotes based on your needs."
  },
  {
    question: "Can the AI integrate with my existing tools?",
    answer: "Yes. We integrate with CRMs, calendars, payment systems, and 100+ popular business tools via APIs and webhooks."
  },
  {
    question: "What happens if the AI can't answer a question?",
    answer: "The AI seamlessly escalates to a human agent with full conversation context. You set the rules for when handoffs occur."
  },
  {
    question: "Can I customize the AI's personality and responses?",
    answer: "Absolutely. We train the AI on your brand voice, FAQs, and business rules. It sounds like your team, not a generic bot."
  },
  {
    question: "Do you offer a trial or demo?",
    answer: "Yes! Book a free consultation and we'll show you a live demo tailored to your industry. No commitment required."
  }
];

export const CaseStudies: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [showAfter, setShowAfter] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const study = CASE_STUDIES.find(s => s.id === id);
      if (study) {
        setSelectedStudy(study);
        setShowAfter(true);
      }
    }
  }, [location]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedStudy(null);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const filteredCases = activeFilter === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.industry === activeFilter);

  const openStudy = (study: CaseStudy) => {
    setSelectedStudy(study);
    setShowAfter(false);
  };

  return (
    <Layout>
      <SEO
        title="Case Studies & Success Stories | Digital Marketing Results | Highshift Media"
        description="See real results from our digital marketing agency. Case studies showing ROI from AI automation, social media marketing, and content marketing campaigns. Best digital marketing agency for small businesses with proven success."
        keywords="digital marketing case studies, AI automation results, social media marketing ROI, content marketing success stories, small business marketing results, marketing agency portfolio, client success stories"
        url="/case-studies"
      />

      <section className="pt-32 pb-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              <GradientText>Proven Results</GradientText>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              See how our AI agents deliver real ROI across industries.
            </p>
          </AnimatedSection>

          {/* CTA Button */}
          <AnimatedSection delay={0.1}>
            <div className="mb-12">
              <Link to="/contact">
                <Button size="lg" icon={<Calendar className="h-5 w-5" />}>
                  Book Free Consultation
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setActiveFilter(industry)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === industry
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25'
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Compact Case Studies Grid */}
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 text-left">
            {filteredCases.map((study) => (
              <StaggerItem key={study.id}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="cursor-pointer"
                  onClick={() => openStudy(study)}
                >
                  <GlassCard className="overflow-hidden group hover:border-sky-500/30 transition-all">
                    {/* Compact Image */}
                    <div className="h-32 w-full relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                      <img
                        src={study.image}
                        alt={study.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 z-20">
                        <span className="px-2 py-1 rounded-full bg-sky-500/20 text-sky-400 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-sky-500/20">
                          {study.industry}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{study.title}</h3>
                      <p className="text-white/50 text-xs mb-3">{study.client}</p>

                      {/* Key Metric */}
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 mb-4">
                        <TrendingUp className="h-4 w-4 text-emerald-400" />
                        <div>
                          <div className="text-lg font-black text-white">{study.metrics[0].value}</div>
                          <div className="text-[10px] text-white/40 uppercase">{study.metrics[0].label}</div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-sky-400 hover:text-sky-300 hover:bg-sky-500/10"
                        icon={<ArrowRight className="h-4 w-4" />}
                      >
                        View Case Study
                      </Button>
                    </div>
                  </GlassCard>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
              Testimonials
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Loved by Businesses
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testimonial, index) => (
              <StaggerItem key={index}>
                <GlassCard className="p-6 h-full relative">
                  <Quote className="absolute top-4 right-4 h-8 w-8 text-sky-500/20" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-white/80 mb-5 leading-relaxed text-sm">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-white text-sm">{testimonial.author}</div>
                    <div className="text-xs text-white/50">{testimonial.role}</div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ROI Calculator & FAQ Combined Section */}
      <section className="py-20 px-4 border-t border-white/10 bg-white/[0.02]">
        {/* ROI Calculator */}
        <AnimatedSection>
          <ROICalculator />
        </AnimatedSection>

        {/* FAQ Section */}
        <div className="max-w-6xl mx-auto mt-20 pt-16 border-t border-white/10">
          <AnimatedSection className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-white/50">Everything you need to know about working with us</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-4">
            {FAQS.map((faq, index) => (
              <AnimatedSection key={index} delay={index * 0.05}>
                <GlassCard className="p-4 h-full">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-start gap-2">
                    <HelpCircle className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
                    {faq.question}
                  </h3>
                  <p className="text-white/50 text-sm ml-6">{faq.answer}</p>
                </GlassCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center">
              <Calendar className="h-12 w-12 text-sky-400 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-white mb-4">
                Ready to Get Similar Results?
              </h2>
              <p className="text-xl text-white/60 mb-8 max-w-xl mx-auto">
                Schedule a free consultation to discuss how we can help transform your business with AI.
              </p>
              <Link to="/contact">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                  Book Free Consultation
                </Button>
              </Link>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedStudy(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 border border-white/10 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header Image */}
              <div className="h-48 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                <img
                  src={selectedStudy.image}
                  alt={selectedStudy.title}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setSelectedStudy(null)}
                  className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="absolute bottom-4 left-6 z-20">
                  <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-sky-500/20">
                    {selectedStudy.industry}
                  </span>
                </div>
              </div>

              <div className="p-8">
                <h2 className="text-2xl font-bold text-white mb-1">{selectedStudy.title}</h2>
                <p className="text-white/50 text-sm mb-4">{selectedStudy.client}</p>
                <p className="text-white/70 mb-6">{selectedStudy.description}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-white/5 border border-white/5">
                  {selectedStudy.metrics.map((metric, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-xl font-black text-white mb-1">{metric.value}</div>
                      <div className="text-[10px] uppercase tracking-wider text-white/40">{metric.label}</div>
                    </div>
                  ))}
                </div>

                {/* Before/After Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="p-1 rounded-full bg-white/5 border border-white/10 flex gap-1">
                    <button
                      onClick={() => setShowAfter(false)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        !showAfter ? 'bg-red-500/20 text-red-400' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      Before AI
                    </button>
                    <button
                      onClick={() => setShowAfter(true)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        showAfter ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white'
                      }`}
                    >
                      After Highshift
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!showAfter ? (
                    <motion.div
                      key="before"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-3"
                    >
                      {selectedStudy.before.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-white/60 text-sm">
                          <XCircle className="h-4 w-4 text-red-500/50 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="after"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-3"
                    >
                      {selectedStudy.after.map((item, i) => (
                        <div key={i} className="flex items-start gap-3 text-white/80 text-sm font-medium">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap gap-2">
                  {selectedStudy.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full bg-white/5 text-white/50">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
