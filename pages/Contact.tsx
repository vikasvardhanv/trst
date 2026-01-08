import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { SchedulingModal } from '../components/SchedulingModal';
import { SendEmailModal, SendEmailModalStatus } from '../components/SendEmailModal';
import {
  Mail, Phone, MapPin, Send, MessageSquare, Calendar,
  Clock, CheckCircle, ArrowRight, BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Contact methods
const contactMethods = [
  {
    icon: <Mail className="h-6 w-6" />,
    title: 'Email Us',
    value: 'info@highshiftmedia.com',
    href: 'mailto:info@highshiftmedia.com',
    color: 'sky',
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: 'Call Us',
    value: '+1 (320) 361-6525',
    href: 'tel:+13203616525',
    color: 'emerald',
  },
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://Wa.me/+13203616525',
    color: 'green',
  },
];

// FAQ items
const faqs = [
  {
    question: 'How long does it take to implement an AI solution?',
    answer: 'Most of our pre-built agents can be deployed within 1-2 weeks. Custom solutions typically take 4-8 weeks depending on complexity.',
  },
  {
    question: 'Do you offer ongoing support?',
    answer: 'Yes! All our solutions come with dedicated support. We offer various support tiers to match your needs.',
  },
  {
    question: 'Can I try before I commit?',
    answer: 'Absolutely. We offer live demos of all our solutions and can provide a proof-of-concept for custom projects.',
  },
  {
    question: 'What industries do you serve?',
    answer: 'We serve all industries but have specialized solutions for restaurants, healthcare, salons, automotive, and construction.',
  },
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isSchedulingOpen, setIsSchedulingOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [sendModalStatus, setSendModalStatus] = useState<SendEmailModalStatus>('sending');
  const [sendModalMessage, setSendModalMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setIsSendModalOpen(true);
    setSendModalStatus('sending');
    setSendModalMessage('Submitting your message to our team…');

    try {
      // @ts-ignore - Vite env
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${API_URL}/contact/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setFormData({ name: '', email: '', company: '', service: '', message: '' });
        setSendModalStatus('success');
        setSendModalMessage(data.message || "Message sent. We'll get back to you within 24 hours.");
      } else {
        setError(data.message || 'Failed to send message. Please try again.');
        setSendModalStatus('error');
        setSendModalMessage(data.message || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again or email us directly at info@highshiftmedia.com');
      setSendModalStatus('error');
      setSendModalMessage('Network error. Please try again or email us directly at info@highshiftmedia.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <Layout>
      <SchedulingModal
        isOpen={isSchedulingOpen}
        onClose={() => setIsSchedulingOpen(false)}
        source="contact-page"
      />
      <SendEmailModal
        isOpen={isSendModalOpen}
        status={sendModalStatus}
        message={sendModalMessage}
        onClose={() => setIsSendModalOpen(false)}
      />
      <SEO
        title="Contact Us | Get a Free Consultation | Highshift Media"
        description="Contact Highshift Media for AI automation and digital marketing services. Book a free consultation to discuss your business needs. Best digital marketing agency for small businesses - get affordable marketing solutions today."
        keywords="contact digital marketing agency, free marketing consultation, AI automation consultation, small business marketing help, affordable marketing agency, get a quote, book consultation, digital marketing services"
        url="/contact"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <AnimatedSection>
            <h1 className="text-5xl sm:text-7xl font-black text-white mb-6">
              Let's Build Something
              <span className="bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent"> Amazing</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              Ready to transform your business with AI? Get in touch and let's discuss
              how we can help you achieve your goals.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Book Consultation - Special Card */}
            <StaggerItem>
              <button onClick={() => setIsSchedulingOpen(true)} className="w-full h-full text-left">
                <GlassCard className="p-6 text-center h-full group border-sky-500/30 hover:border-sky-500/50 bg-gradient-to-br from-sky-500/10 to-purple-500/10">
                  <div className="inline-flex p-3 rounded-xl bg-sky-500/20 text-sky-400 mb-4 group-hover:scale-110 transition-transform">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-white mb-1">Book Consultation</h3>
                  <p className="text-white/60 text-sm">Schedule a call</p>
                </GlassCard>
              </button>
            </StaggerItem>

            {contactMethods.map((method, index) => (
              <StaggerItem key={index}>
                <a href={method.href} target={method.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="block h-full">
                  <GlassCard className="p-6 text-center h-full group">
                    <div className={`inline-flex p-3 rounded-xl bg-${method.color}-500/20 text-${method.color}-400 mb-4 group-hover:scale-110 transition-transform`}>
                      {method.icon}
                    </div>
                    <h3 className="font-bold text-white mb-1">{method.title}</h3>
                    <p className="text-white/60 text-sm">{method.value}</p>
                  </GlassCard>
                </a>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <AnimatedSection>
              <GlassCard className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Send us a message</h2>

                  {error && (
                    <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500 transition-colors"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500 transition-colors"
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500 transition-colors"
                      placeholder="Your Company"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      What are you interested in?
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-sky-500 transition-colors"
                    >
                      <option value="" className="bg-gray-900">Select a service</option>
                      <option value="ai-agents" className="bg-gray-900">AI Agents</option>
                      <option value="chatbot" className="bg-gray-900">Chatbot Development</option>
                      <option value="marketing" className="bg-gray-900">Marketing Automation</option>
                      <option value="custom" className="bg-gray-900">Custom AI Solution</option>
                      <option value="other" className="bg-gray-900">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                      placeholder="Tell us about your project..."
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={isSubmitting}
                    icon={<Send className="h-4 w-4" />}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              </GlassCard>
            </AnimatedSection>

            {/* Info */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                {/* Response time */}
                <GlassCard className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-sky-500/20 text-sky-400">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-1">Quick Response</h3>
                      <p className="text-white/60 text-sm">
                        We typically respond within 24 hours. For urgent inquiries,
                        reach out via WhatsApp.
                      </p>
                    </div>
                  </div>
                </GlassCard>

                {/* FAQ */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
                  <div className="space-y-4">
                    {faqs.map((faq, index) => (
                      <GlassCard key={index} className="p-6">
                        <h4 className="font-semibold text-white mb-2">{faq.question}</h4>
                        <p className="text-white/60 text-sm">{faq.answer}</p>
                      </GlassCard>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection>
            <GlassCard className="p-12 text-center">
              <BarChart3 className="h-12 w-12 text-sky-400 mx-auto mb-6" />
              <h2 className="text-3xl font-black text-white mb-4">
                See Our Results First
              </h2>
              <p className="text-xl text-white/60 mb-8 max-w-xl mx-auto">
                Check out our case studies to see how we've helped businesses like yours achieve amazing results.
              </p>
              <Link to="/case-studies">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                  View Case Studies
                </Button>
              </Link>
            </GlassCard>
          </AnimatedSection>
        </div>
      </section>
    </Layout>
  );
};
