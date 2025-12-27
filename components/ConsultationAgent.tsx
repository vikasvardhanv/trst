import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';
import {
  X, Calendar, Mail, MessageSquare, ArrowRight, Bot,
  Clock, CheckCircle, Send, Loader2, ExternalLink
} from 'lucide-react';

interface ConsultationAgentProps {
  isOpen: boolean;
  onClose: () => void;
}

type AgentStep = 'options' | 'book' | 'email' | 'success';

export const ConsultationAgent: React.FC<ConsultationAgentProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AgentStep>('options');
  const [isLoading, setIsLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('options');
    setEmailData({ name: '', email: '', message: '' });
    onClose();
  };

  const handleBookConsultation = () => {
    // Open Calendly or booking link
    window.open('https://calendly.com/highshiftmedia/30min', '_blank');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="p-8" tilt={false}>
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Agent Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-sky-500/20">
                <Bot className="h-6 w-6 text-sky-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Consultation Assistant</h2>
                <p className="text-sm text-white/50">How can I help you today?</p>
              </div>
            </div>

            {/* Options Step */}
            {step === 'options' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-white/70 mb-6">
                  Choose how you'd like to connect with our team:
                </p>

                {/* Book Consultation Option */}
                <button
                  onClick={handleBookConsultation}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-sky-500/20 to-purple-500/20 border border-sky-500/30 hover:border-sky-500/50 transition-all group text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-sky-500/20 text-sky-400 group-hover:scale-110 transition-transform">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                        Book a Consultation
                        <ExternalLink className="h-4 w-4 text-white/40" />
                      </h3>
                      <p className="text-sm text-white/50">
                        Schedule a 30-min call with our AI experts
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-sky-400">
                        <Clock className="h-3 w-3" />
                        <span>Usually responds within 24 hours</span>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </button>

                {/* Send Email Option */}
                <button
                  onClick={() => setStep('email')}
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">Send us a Message</h3>
                      <p className="text-sm text-white/50">
                        Tell us about your project and we'll get back to you
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </button>

                {/* WhatsApp Option */}
                <a
                  href="https://wa.me/+16307033569"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group text-left flex"
                >
                  <div className="flex items-start gap-4 w-full">
                    <div className="p-2 rounded-lg bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
                        Chat on WhatsApp
                        <ExternalLink className="h-4 w-4 text-white/40" />
                      </h3>
                      <p className="text-sm text-white/50">
                        Get instant replies via WhatsApp
                      </p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-white/30 group-hover:text-white/60 transition-colors" />
                  </div>
                </a>
              </motion.div>
            )}

            {/* Email Step */}
            {step === 'email' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={() => setStep('options')}
                  className="text-sm text-white/50 hover:text-white mb-4 flex items-center gap-1"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Back
                </button>

                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={emailData.name}
                      onChange={(e) => setEmailData({ ...emailData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={emailData.email}
                      onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50"
                      placeholder="john@company.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      How can we help?
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={emailData.message}
                      onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/50 resize-none"
                      placeholder="Tell us about your project or ask any questions..."
                    />
                  </div>

                  <Button
                    type="submit"
                    loading={isLoading}
                    icon={isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    className="w-full"
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Success Step */}
            {step === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                <p className="text-white/60 mb-6">
                  We'll get back to you within 24 hours.
                </p>
                <Button onClick={handleClose} variant="secondary">
                  Close
                </Button>
              </motion.div>
            )}
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
