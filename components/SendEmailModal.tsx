import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { GlassCard } from './ui/GlassCard';
import { Button } from './ui/Button';

export type SendEmailModalStatus = 'sending' | 'success' | 'error';

type SendEmailModalProps = {
  isOpen: boolean;
  status: SendEmailModalStatus;
  message: string;
  onClose: () => void;
};

export const SendEmailModal: React.FC<SendEmailModalProps> = ({
  isOpen,
  status,
  message,
  onClose,
}) => {
  if (!isOpen) return null;

  const title =
    status === 'sending' ? 'Sending message…' : status === 'success' ? 'Message sent!' : 'Could not send';

  const icon =
    status === 'sending' ? (
      <Loader2 className="h-8 w-8 text-sky-400 animate-spin" />
    ) : status === 'success' ? (
      <CheckCircle className="h-8 w-8 text-emerald-400" />
    ) : (
      <AlertCircle className="h-8 w-8 text-red-400" />
    );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={status === 'sending' ? undefined : onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <GlassCard className="p-8" tilt={false}>
            <button
              onClick={onClose}
              disabled={status === 'sending'}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-5">
                {icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              <p className="text-white/60">{message}</p>

              <div className="mt-6">
                <Button
                  onClick={onClose}
                  disabled={status === 'sending'}
                  variant={status === 'error' ? 'secondary' : 'secondary'}
                  className="w-full"
                >
                  {status === 'sending' ? 'Sending…' : 'Close'}
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
