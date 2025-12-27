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
import {
  ArrowRight, Sparkles, Zap, Shield, BarChart3, MessageSquare,
  Bot, Megaphone, Play, ChevronRight, Check, Cpu, Workflow, Layers
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



// Process Steps
const processSteps = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Discovery",
    description: "We analyze your workflows to identify high-impact automation opportunities."
  },
  {
    icon: <Workflow className="h-6 w-6" />,
    title: "Strategy",
    description: "We design a custom AI roadmap tailored to your specific business goals."
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Development",
    description: "Our engineers build, train, and integrate your custom AI agents."
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Optimization",
    description: "Continuous monitoring and refinement to ensure maximum ROI."
  }
];

// Tech Stack
const techStack = [
  "OpenAI", "Anthropic", "Google Gemini", "Meta Llama", "LangChain", "Pinecone", "React", "Python"
];


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

      {/* Process Section */}
      <section className="py-32 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <span className="text-sky-400 text-sm font-semibold uppercase tracking-wider mb-4 block">
              How We Work
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Your Path to AI Transformation
            </h2>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <StaggerItem key={index}>
                <div className="relative">
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-sky-500/50 to-transparent -z-10" />
                  )}
                  <GlassCard className="p-6 h-full text-center relative bg-gray-900/50">
                    <div className="w-12 h-12 mx-auto bg-sky-500/20 rounded-full flex items-center justify-center text-sky-400 mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-white/60">{step.description}</p>
                  </GlassCard>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
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
      <section className="py-20 px-4 border-y border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/40 text-sm font-semibold uppercase tracking-wider mb-8">
            Powered by World-Class Technology
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {techStack.map((tech, index) => (
              <span key={index} className="text-xl md:text-2xl font-bold text-white">{tech}</span>
            ))}
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
