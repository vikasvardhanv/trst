import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import {
  ArrowRight, Megaphone, FileText, Mail, Calendar, BarChart3,
  Instagram, Facebook, Linkedin, Twitter, Youtube, Share2,
  Sparkles, Check, Play, Zap, Target, TrendingUp, TrendingUp as CaseStudyIcon
} from 'lucide-react';

// Marketing tools
const marketingTools = [
  {
    id: 'content',
    name: 'Content Generation',
    icon: <FileText className="h-8 w-8" />,
    description: 'AI-powered content creation for blogs, social media, and marketing copy.',
    features: ['Blog posts', 'Social captions', 'Ad copy', 'Email content'],
    color: 'sky',
  },
  {
    id: 'social',
    name: 'Social Media Automation',
    icon: <Share2 className="h-8 w-8" />,
    description: 'Schedule and automate posts across all major social platforms.',
    features: ['Multi-platform posting', 'Best time scheduling', 'Analytics', 'Hashtag optimization'],
    color: 'purple',
  },
  {
    id: 'email',
    name: 'Email Campaigns',
    icon: <Mail className="h-8 w-8" />,
    description: 'Create and automate email marketing campaigns with AI.',
    features: ['Template generation', 'A/B testing', 'Personalization', 'Analytics'],
    color: 'emerald',
  },
  {
    id: 'analytics',
    name: 'Marketing Analytics',
    icon: <BarChart3 className="h-8 w-8" />,
    description: 'Track performance and get AI-powered insights.',
    features: ['ROI tracking', 'Audience insights', 'Trend analysis', 'Reports'],
    color: 'amber',
  },
];

// Supported platforms
const platforms = [
  { name: 'Instagram', icon: <Instagram className="h-6 w-6" /> },
  { name: 'Facebook', icon: <Facebook className="h-6 w-6" /> },
  { name: 'LinkedIn', icon: <Linkedin className="h-6 w-6" /> },
  { name: 'Twitter/X', icon: <Twitter className="h-6 w-6" /> },
  { name: 'YouTube', icon: <Youtube className="h-6 w-6" /> },
];

// Demo content generation
const demoContent = {
  topic: 'AI in Business',
  platforms: {
    linkedin: "🚀 AI isn't just the future—it's NOW.\n\nBusinesses leveraging AI are seeing:\n✅ 40% faster customer response times\n✅ 60% reduction in operational costs\n✅ 3x increase in lead conversion\n\nThe question isn't IF you should adopt AI, but HOW FAST.\n\n#AI #BusinessGrowth #Innovation",
    instagram: "The future is automated ✨\n\nSwipe to see how AI is transforming businesses in 2024 →\n\n📊 40% faster responses\n💰 60% cost reduction\n🎯 3x more conversions\n\nReady to transform your business?\n\n#AIBusiness #Automation #TechTrends #BusinessTips",
    twitter: "AI in business isn't optional anymore—it's essential.\n\n📈 40% faster response times\n💰 60% lower costs\n🎯 3x better conversions\n\nThe data speaks for itself. Are you ready?",
  },
};

export const Marketing: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'linkedin' | 'instagram' | 'twitter'>('linkedin');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 1500);
  };

  return (
    <Layout>
      <SEO
        title="Social Media Marketing & Content Automation | Highshift Media"
        description="Leading social media marketing agency offering content marketing, email automation, and AI-powered marketing solutions. Affordable social media marketing services for small businesses. Boost engagement 10x with our marketing automation platform."
        keywords="social media marketing agency, content marketing agency, email marketing automation, AI marketing, social media automation, affordable social media marketing services, content generation AI, marketing analytics, digital marketing services"
        url="/marketing"
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
              <Megaphone className="h-4 w-4 text-purple-400" />
              <span className="text-sm text-white/70">Marketing & Automation Hub</span>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6">
              Marketing on
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"> Autopilot</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
              Create content, schedule posts, and run email campaigns—all powered by AI.
              Save hours every week while improving engagement.
            </p>
          </AnimatedSection>

          {/* Platform icons */}
          <AnimatedSection delay={0.3}>
            <div className="flex items-center justify-center gap-4 mb-8">
              {platforms.map((platform) => (
                <motion.div
                  key={platform.name}
                  whileHover={{ scale: 1.1, y: -4 }}
                  className="p-3 rounded-xl bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title={platform.name}
                >
                  {platform.icon}
                </motion.div>
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
                <Button variant="secondary" size="lg" icon={<BarChart3 className="h-5 w-5" />}>
                  View Case Studies
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Try It Now</h2>
                <p className="text-white/60">See AI-powered content generation in action</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={demoContent.topic}
                      readOnly
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Platform
                    </label>
                    <div className="flex gap-2">
                      {(['linkedin', 'instagram', 'twitter'] as const).map((platform) => (
                        <button
                          key={platform}
                          onClick={() => setSelectedPlatform(platform)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            selectedPlatform === platform
                              ? 'bg-sky-500 text-white'
                              : 'bg-white/5 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    loading={isGenerating}
                    icon={<Sparkles className="h-4 w-4" />}
                    className="w-full"
                  >
                    Generate Content
                  </Button>
                </div>

                {/* Output Section */}
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Generated Content
                  </label>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPlatform}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-white/5 border border-white/10 rounded-xl min-h-[200px]"
                    >
                      <pre className="whitespace-pre-wrap text-sm text-white/80 font-sans">
                        {demoContent.platforms[selectedPlatform]}
                      </pre>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-6">
              Complete Marketing Suite
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Everything you need to run successful marketing campaigns.
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {marketingTools.map((tool) => (
              <StaggerItem key={tool.id}>
                <GlassCard className="p-8 h-full" glowColor={tool.color}>
                  <div className={`inline-flex p-3 rounded-xl bg-${tool.color}-500/20 text-${tool.color}-400 mb-6`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{tool.name}</h3>
                  <p className="text-white/60 mb-6">{tool.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {tool.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                        <Check className="h-4 w-4 text-emerald-400" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-purple-950/20 to-transparent">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid sm:grid-cols-3 gap-8 text-center">
            <StaggerItem>
              <div className="text-5xl font-black text-white mb-2">10x</div>
              <div className="text-white/50">Faster Content Creation</div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-5xl font-black text-white mb-2">50%</div>
              <div className="text-white/50">Higher Engagement</div>
            </StaggerItem>
            <StaggerItem>
              <div className="text-5xl font-black text-white mb-2">20+</div>
              <div className="text-white/50">Hours Saved Weekly</div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center">
              <Zap className="h-12 w-12 text-purple-400 mx-auto mb-6" />
              <h2 className="text-4xl font-black text-white mb-4">
                Ready to Automate Your Marketing?
              </h2>
              <p className="text-xl text-white/60 mb-8">
                Start generating content and growing your audience today.
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
