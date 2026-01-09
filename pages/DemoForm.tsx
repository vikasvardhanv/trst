import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SEO } from '../components/ui/SEO';
import { BrandLogo } from '../constants';
import {
  ArrowRight, CheckCircle, Zap, Target, Gift,
  MessageSquare, Mic, Video, Building2, TrendingUp, Settings,
  Loader2, AlertCircle, Rocket, Phone, Mail, LinkIcon, Home, ArrowLeft
} from 'lucide-react';

// API endpoint for demo creation
const API_ENDPOINT = 'https://vikasvardhanv--one-click-demo-agent-fastapi-app.modal.run/create-demo';

// Stats data
const stats = [
  { value: '10+', label: 'Industries' },
  { value: '24/7', label: 'AI Support' },
  { value: '30s', label: 'Setup Time' },
];

// Features for info panel
const features = [
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'AI Chat Agents',
    description: 'Smart chatbots that handle customer inquiries, book appointments, and qualify leads.',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Marketing Hub',
    description: 'Automate content creation, social media, and multi-channel campaigns.',
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    title: 'Industry Solutions',
    description: 'Pre-built AI agents for restaurants, clinics, salons, dealerships, and more.',
  },
  {
    icon: <Settings className="h-5 w-5" />,
    title: 'End-to-End Development',
    description: 'From SaaS products to web apps, we build AI-powered solutions at scale.',
  },
];

// Services for the bottom section
const services = [
  { icon: <MessageSquare className="h-4 w-4" />, name: 'AI Chat Agents', href: '/services#chatbot' },
  { icon: <Mic className="h-4 w-4" />, name: 'Voice Agents', href: '/services#voice_agent' },
  { icon: <Video className="h-4 w-4" />, name: 'Video Agents', href: '/services#video_agent' },
  { icon: <Building2 className="h-4 w-4" />, name: 'Industry Agents', href: '/agents' },
  { icon: <TrendingUp className="h-4 w-4" />, name: 'Marketing Hub', href: '/marketing' },
  { icon: <Settings className="h-4 w-4" />, name: 'Automation', href: '/services#automation' },
];

// Use case options
const useCases = [
  { value: 'customer_support', label: '🎧 Customer Support Chatbot' },
  { value: 'appointment_scheduling', label: '📅 Appointment Scheduling' },
  { value: 'lead_generation', label: '🎯 Lead Generation & Qualification' },
  { value: 'product_info', label: '📦 Product Information & FAQ' },
  { value: 'sales_assistant', label: '💼 Sales Assistant' },
  { value: 'custom', label: '✨ Custom / Other' },
];

// Delivery options
const deliveryOptions = [
  { id: 'sms', value: 'sms', icon: <Phone className="h-5 w-5" />, label: 'SMS' },
  { id: 'email', value: 'email', icon: <Mail className="h-5 w-5" />, label: 'Email', defaultChecked: true },
  { id: 'link', value: 'link', icon: <LinkIcon className="h-5 w-5" />, label: 'Link', defaultChecked: true },
];

// Benefits
const benefits = [
  { icon: <Zap className="h-5 w-5" />, text: '30 Seconds' },
  { icon: <Target className="h-5 w-5" />, text: 'Personalized' },
  { icon: <Gift className="h-5 w-5" />, text: '100% Free' },
];

export const DemoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company_name: '',
    website_url: '',
    use_case: '',
  });
  const [delivery, setDelivery] = useState<string[]>(['email', 'link']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [demoLink, setDemoLink] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeliveryChange = (value: string) => {
    setDelivery(prev => 
      prev.includes(value) 
        ? prev.filter(d => d !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const data = {
      ...formData,
      phone: formData.phone || null,
      company_name: formData.company_name || null,
      website_url: formData.website_url || null,
      delivery: delivery.length > 0 ? delivery : ['link'],
    };

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setDemoLink(result.demo_link);
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create demo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO 
        title="Get Your Free AI Demo | HighShift Media"
        description="Experience a personalized AI assistant for your business in under 30 seconds. Transform your business with intelligent AI solutions from HighShift Media."
      />
      
      <div className="min-h-screen bg-gray-900 relative overflow-hidden flex items-center justify-center p-4 md:p-8">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/10 to-sky-500/10 rounded-full blur-3xl" />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-sky-400/40 rounded-full"
              initial={{ 
                x: `${10 + i * 12}%`, 
                y: `${20 + (i % 3) * 30}%`,
                opacity: 0.3 
              }}
              animate={{ 
                y: [`${20 + (i % 3) * 30}%`, `${10 + (i % 3) * 25}%`, `${20 + (i % 3) * 30}%`],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 8 + i, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>

        {/* Main container */}
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 z-10">
          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl"
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent" />

            {/* Logo and Navigation */}
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="flex items-center gap-3">
                <BrandLogo className="h-12 w-12" />
                <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  HighShift Media
                </span>
              </Link>
              <Link 
                to="/" 
                className="flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </div>

            {!isSuccess ? (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  Get Your <span className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">Free AI Demo</span>
                </h1>
                <p className="text-gray-400 mb-6">
                  Experience a personalized AI assistant for your business in under 30 seconds. No commitment required.
                </p>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-4 mb-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Your Name <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone Number <span className="text-gray-500">(for SMS demo)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleInputChange}
                      placeholder="Acme Corp"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  {/* Website URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      name="website_url"
                      value={formData.website_url}
                      onChange={handleInputChange}
                      placeholder="https://acme.com"
                      className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>

                  {/* Use Case */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      What are you looking for? <span className="text-purple-400">*</span>
                    </label>
                    <select
                      name="use_case"
                      value={formData.use_case}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-900/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all appearance-none cursor-pointer"
                      style={{ 
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 1rem center',
                        backgroundSize: '1.5rem'
                      }}
                    >
                      <option value="" disabled className="bg-gray-900 text-gray-400">Select your primary use case</option>
                      {useCases.map(uc => (
                        <option key={uc.value} value={uc.value} className="bg-gray-900 text-white py-2">
                          {uc.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      How would you like to receive your demo?
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {deliveryOptions.map(option => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => handleDeliveryChange(option.value)}
                          className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all ${
                            delivery.includes(option.value)
                              ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                              : 'bg-gray-900/30 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                        >
                          {option.icon}
                          <span className="text-xs font-medium">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Creating your demo...</span>
                      </>
                    ) : (
                      <>
                        <span>Create My AI Demo</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Benefits */}
                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 text-center">
                      <div className="text-purple-400">{benefit.icon}</div>
                      <span className="text-xs text-gray-400 font-medium">{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* Success State */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-sky-500 rounded-full mb-6"
                >
                  <Rocket className="h-10 w-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-3">Demo Created!</h2>
                <p className="text-gray-400 mb-8">
                  Your personalized AI assistant is ready. Check your phone/email for the magic link, or click below to start your journey.
                </p>
                <a
                  href={demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-sky-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
                >
                  <span>Start Your Demo</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </motion.div>
            )}
          </motion.div>

          {/* Info Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative bg-gray-800/50 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl flex flex-col lg:order-none order-first"
          >
            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sky-500 to-transparent" />

            {/* Header */}
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                Why Choose <span className="bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">HighShift Media</span>?
              </h2>
              <p className="text-gray-400 text-sm">
                We're not just another AI company. We build intelligent solutions that transform how businesses connect with customers and automate operations.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center p-4 bg-gradient-to-br from-purple-500/10 to-sky-500/10 rounded-2xl border border-purple-500/10"
                >
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-400 to-sky-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4 flex-grow">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500/20 to-sky-500/20 rounded-xl flex items-center justify-center text-purple-400">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{feature.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <h5 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Our Services
              </h5>
              <div className="grid grid-cols-2 gap-2">
                {services.map((service, index) => (
                  <Link
                    key={index}
                    to={service.href}
                    className="flex items-center gap-2 p-3 bg-white/5 rounded-xl text-gray-400 hover:bg-purple-500/10 hover:text-white hover:border-purple-500/50 border border-transparent transition-all group"
                  >
                    <span className="text-purple-400 group-hover:text-purple-300">{service.icon}</span>
                    <span className="text-xs font-medium">{service.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 right-0 text-center text-gray-500 text-sm z-10">
          <p>
            © 2026 <Link to="/" className="text-purple-400 hover:text-purple-300 transition-colors">Highshift Media LLC</Link>. All rights reserved. | 
            <Link to="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors ml-1">Privacy</Link> · 
            <Link to="/terms" className="text-purple-400 hover:text-purple-300 transition-colors ml-1">Terms</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default DemoForm;
