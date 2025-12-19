import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { 
  ArrowRight, Filter, TrendingUp, Clock, DollarSign, 
  CheckCircle2, XCircle, ChevronRight, BarChart3 
} from 'lucide-react';

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

export const CaseStudies: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [toggledCards, setToggledCards] = useState<Record<string, boolean>>({});
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Optionally open the "After" view to show it's active
        setToggledCards(prev => ({ ...prev, [id]: true }));
      }
    }
  }, [location]);

  const filteredCases = activeFilter === 'All' 
    ? CASE_STUDIES 
    : CASE_STUDIES.filter(c => c.industry === activeFilter);

  const toggleCard = (id: string) => {
    setToggledCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Layout>
      <SEO 
        title="AI Case Studies & Success Stories | Highshift Media"
        description="See how Highshift Media's AI agents transform businesses. Real results, metrics, and before/after comparisons for Clinics, Dealerships, and more."
        keywords="AI Case Studies, Business Automation Results, AI ROI, Client Success Stories"
      />

      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6">
              <GradientText>Proven Results</GradientText>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
              Don't just take our word for it. See how our AI agents are delivering real ROI for businesses across industries.
            </p>
          </AnimatedSection>

          {/* Filters */}
          <AnimatedSection delay={0.2}>
            <div className="flex flex-wrap justify-center gap-4 mb-16">
              {INDUSTRIES.map((industry) => (
                <button
                  key={industry}
                  onClick={() => setActiveFilter(industry)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
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

          {/* Case Studies Grid */}
          <StaggerContainer className="grid lg:grid-cols-2 gap-8 text-left">
            {filteredCases.map((study) => (
              <StaggerItem key={study.id}>
                <GlassCard className="h-full overflow-hidden group hover:border-sky-500/30 transition-colors">
                  {/* Header Image */}
                  <div className="h-48 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                    <img 
                      src={study.image} 
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute bottom-4 left-6 z-20">
                      <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md border border-sky-500/20">
                        {study.industry}
                      </span>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{study.title}</h3>
                        <p className="text-white/50 text-sm">{study.client}</p>
                      </div>
                    </div>

                    <p className="text-white/70 mb-8 leading-relaxed">
                      {study.description}
                    </p>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-white/5 border border-white/5">
                      {study.metrics.map((metric, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-lg font-black text-white mb-1">{metric.value}</div>
                          <div className="text-[10px] uppercase tracking-wider text-white/40">{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Toggle Section */}
                    <div className="relative min-h-[200px]">
                      <div className="flex justify-center mb-6">
                        <div className="p-1 rounded-full bg-white/5 border border-white/10 flex gap-1">
                          <button
                            onClick={() => setToggledCards(prev => ({ ...prev, [study.id]: false }))}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                              !toggledCards[study.id] ? 'bg-red-500/20 text-red-400' : 'text-white/40 hover:text-white'
                            }`}
                          >
                            Before AI
                          </button>
                          <button
                            onClick={() => setToggledCards(prev => ({ ...prev, [study.id]: true }))}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                              toggledCards[study.id] ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/40 hover:text-white'
                            }`}
                          >
                            After Highshift
                          </button>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {!toggledCards[study.id] ? (
                          <motion.div
                            key="before"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-3"
                          >
                            {study.before.map((item, i) => (
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
                            {study.after.map((item, i) => (
                              <div key={i} className="flex items-start gap-3 text-white/80 text-sm font-medium">
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                      <div className="flex gap-2">
                        {study.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-1 rounded bg-white/5 text-white/40">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-sky-400 hover:text-sky-300 p-0"
                        onClick={() => {
                          window.location.hash = study.id;
                          setToggledCards(prev => ({ ...prev, [study.id]: !prev[study.id] }));
                        }}
                      >
                        Read Full Story <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
    </Layout>
  );
};
