import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { MessageSquare, Workflow, Cpu, BarChart3, Play, X } from 'lucide-react';

const processSteps = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Discovery",
    description: "We analyze your workflows to identify high-impact automation opportunities.",
    videoPlaceholder: "/videos/discovery-demo.mp4", // You'll add actual videos
    demoDescription: "Watch how we conduct a comprehensive business analysis",
    color: "sky"
  },
  {
    icon: <Workflow className="h-6 w-6" />,
    title: "Strategy",
    description: "We design a custom AI roadmap tailored to your specific business goals.",
    videoPlaceholder: "/videos/strategy-demo.mp4",
    demoDescription: "See our AI roadmap planning process in action",
    color: "purple"
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Development",
    description: "Our engineers build, train, and integrate your custom AI agents.",
    videoPlaceholder: "/videos/development-demo.mp4",
    demoDescription: "Behind the scenes: Building an AI chatbot",
    color: "emerald"
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Optimization",
    description: "Continuous monitoring and refinement to ensure maximum ROI.",
    videoPlaceholder: "/videos/optimization-demo.mp4",
    demoDescription: "Live dashboard: Tracking AI performance metrics",
    color: "orange"
  }
];

export const HowWeWorkVideo: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="relative">
      {/* Process Steps Grid */}
      <div className="grid md:grid-cols-4 gap-8">
        {processSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            <div className="relative">
              {/* Connecting Line */}
              {index < processSteps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-sky-500/50 to-transparent -z-10" />
              )}

              {/* Step Card */}
              <button
                onClick={() => setSelectedStep(index)}
                className="w-full text-left group"
              >
                <GlassCard className={`p-6 h-full text-center relative transition-all duration-300 ${
                  hoveredStep === index ? 'bg-gray-900/80 scale-105' : 'bg-gray-900/50'
                }`}>
                  {/* Play Button Overlay on Hover */}
                  <AnimatePresence>
                    {hoveredStep === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-xl z-10"
                      >
                        <div className={`w-16 h-16 rounded-full bg-${step.color}-500/20 border-2 border-${step.color}-400 flex items-center justify-center`}>
                          <Play className={`h-6 w-6 text-${step.color}-400 ml-1`} fill="currentColor" />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Step Number Badge */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-sky-500 text-white text-sm font-bold flex items-center justify-center shadow-lg">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-12 h-12 mx-auto bg-${step.color}-500/20 rounded-full flex items-center justify-center text-${step.color}-400 mb-4 transition-transform group-hover:scale-110`}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-white/60 mb-3">{step.description}</p>

                  {/* Demo Label */}
                  <div className="flex items-center justify-center gap-2 text-xs text-sky-400 font-medium">
                    <Play className="h-3 w-3" />
                    <span>Watch Demo</span>
                  </div>
                </GlassCard>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {selectedStep !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setSelectedStep(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedStep(null)}
                className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white z-10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <GlassCard className="overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-${processSteps[selectedStep].color}-500/20 rounded-full flex items-center justify-center text-${processSteps[selectedStep].color}-400`}>
                      {processSteps[selectedStep].icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">
                        {processSteps[selectedStep].title}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {processSteps[selectedStep].demoDescription}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Container */}
                <div className="relative bg-black aspect-video">
                  {/* Placeholder - Replace with actual video */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-sky-500/20 flex items-center justify-center">
                        <Play className="h-10 w-10 text-sky-400" />
                      </div>
                      <p className="text-white/60">Video demo coming soon</p>
                      <p className="text-white/40 text-sm mt-2">
                        Upload your demo video to: {processSteps[selectedStep].videoPlaceholder}
                      </p>
                    </div>
                  </div>

                  {/* Uncomment when you have videos:
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    src={processSteps[selectedStep].videoPlaceholder}
                  >
                    Your browser does not support the video tag.
                  </video>
                  */}
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-900/50">
                  <p className="text-white/70 text-sm">
                    {processSteps[selectedStep].description}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
