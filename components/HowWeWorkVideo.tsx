import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { MessageSquare, Workflow, Cpu, BarChart3, Play, X } from 'lucide-react';

const processSteps = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Discovery",
    description: "We analyze your workflows to identify high-impact automation opportunities.",
    videoPlaceholder: "/videos/discovery-demo.mp4",
    demoDescription: "Watch how we conduct a comprehensive business analysis",
    gradientFrom: "from-sky-500/20",
    gradientTo: "to-sky-500/5",
    iconBg: "bg-sky-500/10",
    iconText: "text-sky-400",
    playBg: "bg-sky-500/20",
    playBorder: "border-sky-400",
    playText: "text-sky-400"
  },
  {
    icon: <Workflow className="h-6 w-6" />,
    title: "Strategy",
    description: "We design a custom AI roadmap tailored to your specific business goals.",
    videoPlaceholder: "/videos/strategy-demo.mp4",
    demoDescription: "See our AI roadmap planning process in action",
    gradientFrom: "from-purple-500/20",
    gradientTo: "to-purple-500/5",
    iconBg: "bg-purple-500/10",
    iconText: "text-purple-400",
    playBg: "bg-purple-500/20",
    playBorder: "border-purple-400",
    playText: "text-purple-400"
  },
  {
    icon: <Cpu className="h-6 w-6" />,
    title: "Development",
    description: "Our engineers build, train, and integrate your custom AI agents.",
    videoPlaceholder: "/videos/development-demo.mp4",
    demoDescription: "Behind the scenes: Building an AI chatbot",
    gradientFrom: "from-emerald-500/20",
    gradientTo: "to-emerald-500/5",
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    playBg: "bg-emerald-500/20",
    playBorder: "border-emerald-400",
    playText: "text-emerald-400"
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: "Optimization",
    description: "Continuous monitoring and refinement to ensure maximum ROI.",
    videoPlaceholder: "/videos/optimization-demo.mp4",
    demoDescription: "Live dashboard: Tracking AI performance metrics",
    gradientFrom: "from-orange-500/20",
    gradientTo: "to-orange-500/5",
    iconBg: "bg-orange-500/10",
    iconText: "text-orange-400",
    playBg: "bg-orange-500/20",
    playBorder: "border-orange-400",
    playText: "text-orange-400"
  }
];

export const HowWeWorkVideo: React.FC = () => {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <div className="relative">
      {/* Process Steps Grid - Equal width columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {processSteps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onMouseEnter={() => setHoveredStep(index)}
            onMouseLeave={() => setHoveredStep(null)}
            className="flex"
          >
            {/* Step Card */}
            <button
              onClick={() => setSelectedStep(index)}
              className="w-full group"
            >
              <GlassCard className={`p-6 h-full flex flex-col text-center relative transition-all duration-300 ${
                hoveredStep === index ? 'bg-white/[0.08] scale-[1.02] shadow-xl' : 'bg-white/[0.02]'
              }`}>
                {/* Play Button Overlay on Hover */}
                <AnimatePresence>
                  {hoveredStep === index && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-xl z-10"
                    >
                      <div className={`w-16 h-16 rounded-full ${step.playBg} border-2 ${step.playBorder} flex items-center justify-center shadow-lg`}>
                        <Play className={`h-6 w-6 ${step.playText} ml-1`} fill="currentColor" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Step Number Badge */}
                <div className={`absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br ${step.gradientFrom} ${step.gradientTo} border-2 ${step.playBorder} text-white text-sm font-bold flex items-center justify-center shadow-lg`}>
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 mx-auto ${step.iconBg} rounded-full flex items-center justify-center ${step.iconText} mb-4 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-white/70 mb-4 flex-grow leading-relaxed">{step.description}</p>

                {/* Demo Label */}
                <div className={`inline-flex items-center justify-center gap-2 text-xs ${step.playText} font-semibold px-3 py-1.5 rounded-full ${step.iconBg} border ${step.playBorder} border-opacity-30`}>
                  <Play className="h-3 w-3" fill="currentColor" />
                  <span>Watch Demo</span>
                </div>
              </GlassCard>
            </button>
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
                    <div className={`w-12 h-12 ${processSteps[selectedStep].iconBg} rounded-full flex items-center justify-center ${processSteps[selectedStep].iconText}`}>
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
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    src={processSteps[selectedStep].videoPlaceholder}
                  >
                    Your browser does not support the video tag.
                  </video>
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
