import React, { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  videoSrc: string;
  opacity?: number;
  overlay?: boolean;
  className?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
  videoSrc,
  opacity = 0.3,
  overlay = true,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Dark overlay to blend with background */}
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/95 z-10" />
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          opacity: opacity,
          filter: 'brightness(0.6) contrast(1.1)',
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Vignette effect for better blending */}
      <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-transparent to-gray-900 opacity-50 z-20" />
    </div>
  );
};

// Inline video component for sections
export const InlineVideo: React.FC<{
  videoSrc: string;
  className?: string;
  autoPlay?: boolean;
  controls?: boolean;
}> = ({
  videoSrc,
  className = '',
  autoPlay = true,
  controls = false
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    }
  }, [autoPlay]);

  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <video
        ref={videoRef}
        autoPlay={autoPlay}
        loop
        muted
        playsInline
        controls={controls}
        className="w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
