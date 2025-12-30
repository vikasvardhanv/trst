import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import {
  Briefcase, MapPin, Clock, DollarSign, Users, Rocket,
  Heart, Zap, TrendingUp, ArrowRight, Code, Sparkles,
  MessageSquare, Target, Award, Globe, Palette, Megaphone,
  HeadphonesIcon, PenTool, Server, Settings
} from 'lucide-react';

const openPositions = [
  {
    title: 'Senior AI Engineer',
    department: 'Engineering',
    location: 'Remote / Chicago, IL',
    type: 'Full-time',
    salary: '$120k - $180k',
    description: 'Build cutting-edge AI solutions using LLMs, LangChain, and modern ML frameworks. Lead the development of AI agents and automation systems.',
    requirements: ['5+ years Python/ML experience', 'LLM integration experience (OpenAI, Anthropic, etc.)', 'Strong system design skills', 'Experience with vector databases (Pinecone, Weaviate)'],
  },
  {
    title: 'Full Stack Developer',
    department: 'Engineering',
    location: 'Remote / Chicago, IL',
    type: 'Full-time',
    salary: '$90k - $140k',
    description: 'Develop scalable web applications and SaaS products using React, TypeScript, Node.js, and PostgreSQL.',
    requirements: ['3+ years full-stack experience', 'React & TypeScript proficiency', 'API design & database optimization', 'Experience with cloud platforms (AWS/GCP)'],
  },
  {
    title: 'AI Solutions Architect',
    department: 'Product',
    location: 'Remote / Chicago, IL',
    type: 'Full-time',
    salary: '$130k - $170k',
    description: 'Design and implement AI solutions for enterprise clients across healthcare, legal, real estate, and other industries.',
    requirements: ['AI/ML architecture experience', 'Client-facing skills', 'System design expertise', 'Experience with enterprise integrations'],
  },
  {
    title: 'Backend Developer (Python)',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$85k - $130k',
    description: 'Build robust backend systems and APIs that power our AI agents and automation workflows.',
    requirements: ['3+ years Python experience', 'FastAPI/Django expertise', 'Database design (PostgreSQL, Redis)', 'Experience with message queues'],
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    salary: '$100k - $150k',
    description: 'Manage infrastructure, CI/CD pipelines, and ensure high availability of our AI-powered services.',
    requirements: ['AWS/GCP expertise', 'Docker & Kubernetes', 'Infrastructure as Code (Terraform)', 'Monitoring & logging systems'],
  },
  {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    salary: '$80k - $120k',
    description: 'Design intuitive user interfaces for AI-powered applications, chatbots, and SaaS products.',
    requirements: ['3+ years product design experience', 'Figma proficiency', 'User research experience', 'Understanding of AI/ML interfaces'],
  },
  {
    title: 'Digital Marketing Specialist',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time',
    salary: '$60k - $90k',
    description: 'Drive growth through SEO, content marketing, social media strategies, and paid advertising campaigns.',
    requirements: ['3+ years digital marketing', 'SEO & content strategy', 'Google Analytics & Ads proficiency', 'B2B marketing experience'],
  },
  {
    title: 'Sales Development Representative',
    department: 'Sales',
    location: 'Remote / Chicago, IL',
    type: 'Full-time',
    salary: '$50k - $80k + Commission',
    description: 'Generate and qualify leads for our AI automation solutions. Be the first point of contact for potential clients.',
    requirements: ['1+ years sales experience', 'Excellent communication skills', 'Tech-savvy & self-motivated', 'CRM experience (HubSpot, Salesforce)'],
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    salary: '$70k - $100k',
    description: 'Ensure client satisfaction and retention. Help customers get maximum value from our AI solutions.',
    requirements: ['2+ years customer success experience', 'Technical aptitude', 'Excellent communication', 'Experience with SaaS products'],
  },
  {
    title: 'Content Writer (AI/Tech)',
    department: 'Marketing',
    location: 'Remote',
    type: 'Full-time / Contract',
    salary: '$50k - $75k',
    description: 'Create compelling content about AI, automation, and technology. Write blogs, case studies, and marketing copy.',
    requirements: ['Strong writing portfolio', 'Understanding of AI/ML concepts', 'SEO knowledge', 'B2B content experience'],
  },
];

const benefits = [
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Remote First',
    description: 'Work from anywhere in the world with flexible hours',
  },
  {
    icon: <DollarSign className="h-6 w-6" />,
    title: 'Competitive Salary',
    description: 'Top market rates plus equity and performance bonuses',
  },
  {
    icon: <Heart className="h-6 w-6" />,
    title: 'Health & Wellness',
    description: 'Comprehensive health insurance and wellness programs',
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Latest Tech',
    description: 'Work with cutting-edge AI tools and technologies',
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: 'Growth & Learning',
    description: 'Unlimited learning budget and conference attendance',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Amazing Team',
    description: 'Collaborate with world-class engineers and innovators',
  },
];

const values = [
  {
    icon: <Rocket className="h-8 w-8" />,
    title: 'Innovation First',
    description: 'We push boundaries and embrace new technologies to solve real problems.',
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: 'Customer Obsessed',
    description: 'Our clients\' success is our success. We go above and beyond.',
  },
  {
    icon: <Award className="h-8 w-8" />,
    title: 'Excellence',
    description: 'We deliver world-class solutions and maintain the highest standards.',
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: 'Continuous Learning',
    description: 'We invest in growth, learning, and staying at the forefront of AI.',
  },
];

export const Careers: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);

  const handleApply = (position: string) => {
    const subject = `Application: ${position}`;
    const body = `Hi Highshift Media,\n\nI'm interested in applying for the ${position} position.\n\n[Please attach your resume and tell us about yourself]`;
    window.location.href = `mailto:careers@highshiftmedia.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <SEO
        title="Careers at Highshift Media | Join Our AI Team"
        description="Join Highshift Media's team and help build the future of AI automation. Remote-first company with competitive salaries, amazing benefits, and cutting-edge technology."
        keywords="AI careers, remote jobs, machine learning jobs, software engineer jobs, AI startup careers, work at AI company"
        url="/careers"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-sky-500/10 border border-sky-500/20"
            >
              <Briefcase className="h-4 w-4 text-sky-400" />
              <span className="text-sm text-sky-400 font-medium">We're Hiring!</span>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6">
              Build the Future of
              <span className="block bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
                AI with Us
              </span>
            </h1>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-8">
              Join our remote-first team of innovators building AI solutions that transform businesses worldwide
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#positions">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                  View Open Positions
                </Button>
              </a>
              <a href="mailto:careers@highshiftmedia.com">
                <Button size="lg" variant="secondary" icon={<MessageSquare className="h-5 w-5" />}>
                  Get in Touch
                </Button>
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Our Values</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <StaggerItem key={index}>
                <GlassCard className="p-6 h-full">
                  <div className="w-14 h-14 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400 mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-white/60 text-sm">{value.description}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Why Join Us?</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We offer more than just a job – we offer a career-defining opportunity
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <StaggerItem key={index}>
                <GlassCard className="p-6 h-full hover:scale-105 transition-transform">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                  <p className="text-white/60 text-sm">{benefit.description}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Open Positions</h2>
            <p className="text-white/60">
              Find your perfect role and start making an impact
            </p>
          </AnimatedSection>

          <StaggerContainer className="space-y-6">
            {openPositions.map((position, index) => (
              <StaggerItem key={index}>
                <GlassCard className="p-6 hover:bg-white/5 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400 flex-shrink-0">
                          <Code className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{position.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
                            <span className="flex items-center gap-1">
                              <Briefcase className="h-4 w-4" />
                              {position.department}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {position.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {position.type}
                            </span>
                            <span className="flex items-center gap-1 text-emerald-400">
                              <DollarSign className="h-4 w-4" />
                              {position.salary}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-white/70 mb-3">{position.description}</p>

                      {selectedPosition === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-white/10"
                        >
                          <h4 className="text-sm font-semibold text-white mb-2">Key Requirements:</h4>
                          <ul className="space-y-1">
                            {position.requirements.map((req, i) => (
                              <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                                <div className="w-1 h-1 rounded-full bg-sky-400" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleApply(position.title)}
                        icon={<ArrowRight className="h-4 w-4" />}
                      >
                        Apply Now
                      </Button>
                      <button
                        onClick={() => setSelectedPosition(selectedPosition === index ? null : index)}
                        className="text-sm text-white/60 hover:text-white transition-colors"
                      >
                        {selectedPosition === index ? 'Hide Details' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Don't see your role? */}
          <AnimatedSection delay={0.6} className="mt-12">
            <GlassCard className="p-8 text-center bg-gradient-to-br from-sky-500/5 to-purple-500/5 border-sky-500/20">
              <Sparkles className="h-12 w-12 text-sky-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Don't See Your Role?</h3>
              <p className="text-white/60 mb-6 max-w-xl mx-auto">
                We're always looking for talented people. Send us your resume and let us know how you can contribute!
              </p>
              <a href="mailto:careers@highshiftmedia.com">
                <Button icon={<MessageSquare className="h-4 w-4" />}>
                  Send Us Your Resume
                </Button>
              </a>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
