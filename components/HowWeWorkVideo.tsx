import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { MessageSquare, Workflow, Cpu, BarChart3, Play, X } from 'lucide-react';

// Helper function to detect video type and get embed URL
const getVideoInfo = (url: string) => {
  if (!url) return { type: 'none', embedUrl: '' };

  // YouTube
  const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&rel=0&playsinline=1`
    };
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&playsinline=1`
    };
  }

  // Direct video file (MP4, WebM, etc.)
  if (url.match(/\.(mp4|webm|ogg|mov)(\?|$)/i) || url.startsWith('/videos/')) {
    return { type: 'direct', embedUrl: url };
  }

  // Default to direct for any other URL
  return { type: 'direct', embedUrl: url };
};

// Get video URLs from environment variables with fallbacks
const getVideoUrls = () => ({
  discovery: import.meta.env.VITE_VIDEO_DISCOVERY || '/videos/discovery-demo.mp4',
  strategy: import.meta.env.VITE_VIDEO_STRATEGY || '/videos/strategy-demo.mp4',
  development: import.meta.env.VITE_VIDEO_DEVELOPMENT || '/videos/development-demo.mp4',
  optimization: import.meta.env.VITE_VIDEO_OPTIMIZATION || '/videos/optimization-demo.mp4',
});

const videoUrls = getVideoUrls();

const processSteps = [
  {
    icon: <MessageSquare className="h-6 w-6" />,
    title: "Discovery",
    description: "We analyze your workflows to identify high-impact automation opportunities.",
    videoUrl: videoUrls.discovery,
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
    videoUrl: videoUrls.strategy,
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
    videoUrl: videoUrls.development,
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
    videoUrl: videoUrls.optimization,
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

// Video Player Component that handles different video types
const VideoPlayer: React.FC<{ url: string }> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoInfo = getVideoInfo(url);

  useEffect(() => {
    if (videoInfo.type === 'direct' && videoRef.current) {
      const video = videoRef.current;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('x5-playsinline', 'true');
      video.play().catch(console.log);
    }
  }, [videoInfo.type]);

  if (videoInfo.type === 'youtube' || videoInfo.type === 'vimeo') {
    return (
      <iframe
        className="w-full h-full"
        src={videoInfo.embedUrl}
        title="Video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  if (videoInfo.type === 'direct') {
    return (
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        autoPlay
        loop
        muted
        playsInline
        src={videoInfo.embedUrl}
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="flex items-center justify-center h-full text-white/60">
      <p>Video not available</p>
    </div>
  );
};

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
                  <VideoPlayer url={processSteps[selectedStep].videoUrl} />
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
