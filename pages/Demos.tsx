import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { INDUSTRY_AGENTS } from '../constants';
import {
  Play, MessageSquare, Mic, Bot, FileText, Briefcase,
  ArrowLeft, ArrowRight, Sparkles, Network, Wand2,
  BarChart3, Brain, Workflow, Calendar, Target
} from 'lucide-react';

// Demo categories
const demoCategories = [
  {
    id: 'agentic-ai',
    name: 'Agentic AI Services',
    description: 'Next-generation autonomous AI systems',
    icon: <Network className="h-8 w-8" />,
    demos: [
      {
        id: 'agent-orchestration',
        name: 'Multi-Agent Orchestration',
        description: 'Watch AI agents collaborate autonomously on complex tasks',
        icon: <Network className="h-6 w-6 text-violet-400" />,
      },
      {
        id: 'workflow-automation',
        name: 'Workflow Automation',
        description: 'Visual workflow builder with AI-powered automation',
        icon: <Workflow className="h-6 w-6 text-cyan-400" />,
      },
      {
        id: 'data-analytics',
        name: 'Predictive Analytics',
        description: 'Real-time AI-driven business intelligence',
        icon: <BarChart3 className="h-6 w-6 text-emerald-400" />,
      },
      {
        id: 'content-generator',
        name: 'AI Content Generator',
        description: 'Generate marketing copy, social posts, and more',
        icon: <Wand2 className="h-6 w-6 text-pink-400" />,
      },
      {
        id: 'custom-model',
        name: 'Custom Model Training',
        description: 'Train AI models tailored to your business data',
        icon: <Brain className="h-6 w-6 text-amber-400" />,
      },
    ],
  },
  {
    id: 'agents',
    name: 'Industry Agents',
    description: 'Interactive demos of our pre-built AI agents',
    icon: <Bot className="h-8 w-8" />,
    demos: INDUSTRY_AGENTS.map(agent => ({
      id: agent.id,
      name: agent.name,
      description: agent.description,
      icon: agent.icon,
    })),
  },
  {
    id: 'tools',
    name: 'AI Tools',
    description: 'Experience our AI-powered tools in action',
    icon: <Sparkles className="h-8 w-8" />,
    demos: [
      {
        id: 'whatsapp',
        name: 'WhatsApp Bot',
        description: 'AI-powered WhatsApp business assistant',
        icon: <MessageSquare className="h-6 w-6 text-green-400" />,
      },
      {
        id: 'voice',
        name: 'Voice Agent',
        description: 'Real-time voice conversation with AI',
        icon: <Mic className="h-6 w-6 text-purple-400" />,
      },
      {
        id: 'business-plan',
        name: 'Business Plan Generator',
        description: 'Generate comprehensive business plans with AI',
        icon: <Briefcase className="h-6 w-6 text-amber-400" />,
      },
      {
        id: 'lead-gen',
        name: 'AI Lead Generator',
        description: 'Scrape qualified leads from Google Maps instantly',
        icon: <Target className="h-6 w-6 text-violet-400" />,
      },
    ],
  },
];

// All demos flattened
const allDemos = demoCategories.flatMap(cat => cat.demos);

export const Demos: React.FC = () => {
  const navigate = useNavigate();

  const handleDemoClick = (demoId: string) => {
    // Map demo IDs to routes
    const routes: Record<string, string> = {
      restaurant: '/demos/restaurant',
      clinic: '/demos/clinic',
      salon: '/demos/salon',
      dealership: '/demos/dealership',
      construction: '/demos/construction',
      whatsapp: '/demos/whatsapp',
      voice: '/demos/voice',
      'business-plan': '/demos/business-plan',
      real_estate: '/demos/real_estate',
      legal: '/demos/legal',
      ecommerce: '/demos/ecommerce',
      education: '/demos/education',
      recruitment: '/demos/recruitment',
      // Advanced AI Service Demos
      'workflow-automation': '/demos/workflow-automation',
      'data-analytics': '/demos/data-analytics',
      'content-generator': '/demos/content-generator',
      'agent-orchestration': '/demos/agent-orchestration',
      'custom-model': '/demos/custom-model',
      'lead-gen': '/demos/lead-gen',
    };
    navigate(routes[demoId] || '/demos');
  };

  return (
    <Layout>
      <SEO
        title="Try AI Demos | Interactive Chatbot & Voice Agent Demos | Highshift Media"
        description="Experience our AI solutions firsthand. Try interactive demos of AI chatbots, voice agents, WhatsApp bots, and marketing automation. See how our digital marketing agency can transform your business with live demos."
        keywords="AI chatbot demo, voice agent demo, WhatsApp bot demo, marketing automation demo, try AI solutions, interactive AI demos, digital marketing agency demos, business AI demos"
        url="/demos"
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
              <Play className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-white/70">Interactive Demos</span>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6">
              Try Before You Buy
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              Experience our AI solutions firsthand. Each demo showcases real functionality
              you'll get in your custom solution.
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
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

      {/* Demo Categories */}
      {demoCategories.map((category, catIndex) => (
        <section key={category.id} className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-xl bg-white/5 text-sky-400">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{category.name}</h2>
                  <p className="text-white/50">{category.description}</p>
                </div>
              </div>
            </AnimatedSection>

            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.demos.map((demo) => (
                <StaggerItem key={demo.id}>
                  <GlassCard
                    onClick={() => handleDemoClick(demo.id)}
                    className="p-6 h-full cursor-pointer group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                        {demo.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-sky-300 transition-colors">
                          {demo.name}
                        </h3>
                        <p className="text-sm text-white/50 mb-4">{demo.description}</p>
                        <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
                          <Play className="h-4 w-4" />
                          Launch Demo
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center">
              <h2 className="text-4xl font-black text-white mb-4">
                Ready to Build Your Own?
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Let's create a custom AI solution tailored to your business.
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

// Demo wrapper component for individual demos
export const DemoWrapper: React.FC<{ children: React.ReactNode; title: string }> = ({ children, title }) => {
  const navigate = useNavigate();

  return (
    <Layout showFooter={false}>
      <div className="pt-24 pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/demos')}
              icon={<ArrowLeft className="h-4 w-4" />}
            >
              Back to Demos
            </Button>
            <span className="text-white/30">|</span>
            <h1 className="text-xl font-bold text-white">{title}</h1>
          </div>
        </div>
      </div>
      <div className="min-h-[calc(100vh-200px)]">
        {children}
      </div>
    </Layout>
  );
};
