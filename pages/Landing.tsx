import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { BrandLogo, INDUSTRY_AGENTS } from '../constants';
import { openCalendlyWithEmail } from '../utils/calendly';
import { HowWeWorkVideo } from '../components/HowWeWorkVideo';
import { BackgroundVideo } from '../components/BackgroundVideo';
import {
  ArrowRight, Sparkles, Zap, Shield, BarChart3, MessageSquare,
  Bot, Megaphone, Play, ChevronRight, Check
} from 'lucide-react';

// Hero section features
const features = [
  { icon: <Zap className="h-5 w-5" />, text: 'Lightning Fast' },
  { icon: <Shield className="h-5 w-5" />, text: 'Enterprise Security' },
  { icon: <BarChart3 className="h-5 w-5" />, text: 'Advanced Analytics' },
];

// Service highlights
const serviceHighlights = [
  {
    icon: <Bot className="h-8 w-8" />,
    title: 'AI Agents',
    description: 'Industry-specific AI agents for restaurants, clinics, salons, and more.',
    link: '/agents',
    color: 'sky',
  },
  {
    icon: <Megaphone className="h-8 w-8" />,
    title: 'Marketing Hub',
    description: 'Automate content creation, social media, and email campaigns.',
    link: '/marketing',
    color: 'purple',
  },
  {
    icon: <MessageSquare className="h-8 w-8" />,
    title: 'Chatbot Development',
    description: 'Custom AI chatbots that engage customers 24/7.',
    link: '/services/chatbot',
    color: 'emerald',
  },
];



type TechStackItem = {
  name: string;
  category: string;
  accent: string;
  mark: string;
};

// Tech Stack
const techStack: TechStackItem[] = [
  { name: 'OpenAI', category: 'Foundation Models', accent: 'from-emerald-400/40 via-emerald-500/10 to-transparent', mark: 'OA' },
  { name: 'Anthropic', category: 'Constitutional AI', accent: 'from-amber-400/40 via-amber-500/10 to-transparent', mark: 'AN' },
  { name: 'Google Gemini', category: 'Multimodal LLMs', accent: 'from-blue-400/40 via-blue-500/10 to-transparent', mark: 'GG' },
  { name: 'Meta Llama', category: 'Open-Source Models', accent: 'from-sky-400/40 via-sky-500/10 to-transparent', mark: 'ML' },
  { name: 'LangChain', category: 'Agent Orchestration', accent: 'from-teal-400/40 via-teal-500/10 to-transparent', mark: 'LC' },
  { name: 'Pinecone', category: 'Vector Database', accent: 'from-fuchsia-400/40 via-fuchsia-500/10 to-transparent', mark: 'PC' },
  { name: 'React', category: 'Frontend Experience', accent: 'from-cyan-400/40 via-cyan-500/10 to-transparent', mark: 'RE' },
  { name: 'Python', category: 'Automation Core', accent: 'from-yellow-300/40 via-yellow-400/10 to-transparent', mark: 'PY' },
];

const techMarquee = [...techStack, ...techStack];
const techMarqueeReverse = [...techStack].reverse().concat([...techStack].reverse());

const TechBadge: React.FC<{ tech: TechStackItem }> = ({ tech }) => (
  <div className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-sm shadow-lg shadow-black/30 transition-transform duration-300 hover:-translate-y-1 hover:border-white/20">
    <div className="relative">
      <div className={`absolute -inset-1 rounded-xl bg-gradient-to-br ${tech.accent} opacity-70 blur-lg`} />
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900/80 border border-white/10 text-[10px] font-bold tracking-[0.2em] text-white/90">
        {tech.mark}
      </div>
    </div>
    <div className="text-left">
      <div className="text-base font-semibold text-white">{tech.name}</div>
      <div className="text-xs text-white/50">{tech.category}</div>
    </div>
  </div>
);


export const Landing: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Highshift Media | Digital Marketing Agency & AI Automation Services"
        description="Highshift Media is a premier digital marketing agency specializing in AI automation, social media marketing, content marketing, and SEO services. Best digital marketing agency for small businesses with affordable marketing solutions."
        keywords="digital marketing agency, social media marketing agency, content marketing agency, SEO services, AI automation, local digital marketing agency, best digital marketing agency for small businesses, affordable marketing services, marketing automation, business chatbots"
        url="/"
      />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <AnimatedSection delay={0}>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-white/70">AI-Powered Solutions for Modern Business</span>
            </motion.div>
          </AnimatedSection>

          {/* Logo */}
          <AnimatedSection delay={0.1}>
            <motion.div
              className="mb-8 relative inline-block"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <div className="absolute inset-0 bg-sky-500 blur-[80px] opacity-20" />
              <BrandLogo className="h-32 w-32 sm:h-40 sm:w-40 relative z-10" />
            </motion.div>
          </AnimatedSection>

          {/* Headline */}
          <AnimatedSection delay={0.2}>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight mb-6">
              <GradientText gradient="from-white via-white to-white/60">
                The Future of AI
              </GradientText>
              <br />
              <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Is Here
              </span>
            </h1>
          </AnimatedSection>

          {/* Subheadline */}
          <AnimatedSection delay={0.3}>
            <p className="text-xl sm:text-2xl text-white/60 max-w-2xl mx-auto mb-8 leading-relaxed">
              Transform your business with intelligent AI solutions. From chatbots to automation,
              we build the technology that drives growth.
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
          <AnimatedSection delay={0.4}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link to="/demos">
                <Button size="lg" icon={<Play className="h-5 w-5" />}>
                  Try Live Demo
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="secondary" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                  Explore Services
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          {/* Feature badges */}
          <AnimatedSection delay={0.5}>
            <div className="flex flex-wrap items-center justify-center gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-white/50"
                >
                  <span className="text-sky-400">{feature.icon}</span>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-white/60"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Services Overview */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
              Our Solutions
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              AI That Works for You
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              From customer service to marketing automation, our AI solutions are designed
              to scale your business intelligently.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-8">
            {serviceHighlights.map((service, index) => (
              <StaggerItem key={index}>
                <Link to={service.link}>
                  <GlassCard className="p-8 h-full" glowColor={service.color}>
                    <div className={`inline-flex p-3 rounded-xl bg-${service.color}-500/20 text-${service.color}-400 mb-6`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                    <p className="text-white/60 mb-6 leading-relaxed">{service.description}</p>
                    <div className="flex items-center gap-2 text-sky-400 font-medium group-hover:gap-3 transition-all">
                      Learn more <ChevronRight className="h-4 w-4" />
                    </div>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Process Section - Interactive Video Showcase */}
      <section className="py-32 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
              How We Work
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Your Path to AI Transformation
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Click any step to watch a demo video of our process in action
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <HowWeWorkVideo />
          </AnimatedSection>
        </div>
      </section>

      {/* Industry Agents Preview */}
      <section className="py-32 px-4 bg-gradient-to-b from-transparent via-sky-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
              Industry Solutions
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Pre-Built AI Agents
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Ready-to-deploy AI agents tailored for specific industries.
              Start automating in minutes, not months.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {INDUSTRY_AGENTS.map((agent, index) => (
              <StaggerItem key={agent.id}>
                <Link to={`/agents/${agent.id}`}>
                  <GlassCard className="p-6 text-center h-full">
                    <div className="mb-4 flex justify-center">{agent.icon}</div>
                    <h3 className="font-bold text-white mb-1">{agent.name}</h3>
                    <p className="text-xs text-white/50">{agent.industry}</p>
                  </GlassCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <AnimatedSection delay={0.3} className="text-center mt-12">
            <Link to="/agents">
              <Button variant="outline" icon={<ArrowRight className="h-5 w-5" />}>
                View All Agents
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="relative py-24 px-4 border-y border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-950/30 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-3 block">
              Powered by World-Class Technology
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Built on the Best AI Stack
            </h2>
            <p className="text-white/60 mt-4 max-w-2xl mx-auto">
              Foundation models, orchestration, and production-grade engineering tuned for results.
            </p>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute -inset-x-8 top-1/2 h-24 -translate-y-1/2 bg-gradient-to-r from-transparent via-sky-500/10 to-transparent blur-2xl opacity-70" />
            <div className="space-y-6">
              <div className="overflow-hidden">
                <div className="flex w-max gap-6 animate-marquee motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:w-full motion-reduce:justify-center">
                  {techMarquee.map((tech, index) => (
                    <TechBadge key={`${tech.name}-${index}`} tech={tech} />
                  ))}
                </div>
              </div>
              <div className="overflow-hidden">
                <div className="flex w-max gap-6 animate-marquee-reverse motion-reduce:animate-none motion-reduce:flex-wrap motion-reduce:w-full motion-reduce:justify-center">
                  {techMarqueeReverse.map((tech, index) => (
                    <TechBadge key={`${tech.name}-reverse-${index}`} tech={tech} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                Let's discuss how AI can transform your business.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />} onClick={() => openCalendlyWithEmail('landing-cta')}>
                  Schedule Consultation
                </Button>
                <Link to="/demos">
                  <Button variant="ghost" size="lg" icon={<Play className="h-5 w-5" />}>
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
