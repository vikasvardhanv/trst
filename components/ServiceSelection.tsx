
import React, { useRef } from 'react';
import type { Service } from '../types';
import { SERVICES, BrandLogo, TikTokIcon, FacebookIcon, InstagramIcon, YoutubeIcon, XIcon, WhatsAppIcon } from '../constants';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

interface ServiceSelectionProps {
  onSelect: (service: Service) => void;
}

const ROTATION_RANGE = 32.5;
const HALF_ROTATION_RANGE = 32.5 / 2;

const TiltCard: React.FC<{ children: React.ReactNode; onClick?: () => void; href?: string }> = ({ children, onClick, href }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const content = (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-full w-full rounded-xl bg-gradient-to-br from-white/10 to-white/5 p-6 border border-white/10 backdrop-blur-md transition-colors hover:border-sky-500/50 group"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl shadow-lg"
      >
        {/* Icon placeholder or background effect */}
      </div>
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10 h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block h-full w-full no-underline perspective-1000"
      >
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className="block h-full w-full text-left perspective-1000">
      {content}
    </button>
  );
};

const ServiceCard: React.FC<{ service: Service; onClick: () => void }> = ({ service, onClick }) => {
  const content = (
    <>
      <div className="mb-4 text-sky-400 group-hover:text-sky-300 transition-colors">
        {service.icon}
      </div>
      <h3 className="font-bold text-lg text-white mb-2 group-hover:text-sky-200 transition-colors">{service.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed flex-grow group-hover:text-gray-300 transition-colors">{service.description}</p>
      {service.externalUrl && (
        <div className="mt-4 flex items-center gap-2 text-sky-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:gap-3 transition-all duration-300">
          Open Builder
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      )}
    </>
  );

  return (
    <TiltCard onClick={service.externalUrl ? undefined : onClick} href={service.externalUrl}>
      {content}
    </TiltCard>
  );
};

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    aria-label={label}
    className="text-white/40 hover:text-sky-400 transition-all duration-300 p-2 hover:bg-white/5 rounded-full"
  >
    {icon}
  </a>
);

export const ServiceSelection: React.FC<ServiceSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-16 relative">
      {/* Floating WhatsApp FAB */}
      <a 
        href="https://Wa.me/+16307033569" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group flex items-center gap-3"
      >
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-500 ease-in-out font-bold">Chat on WhatsApp</span>
        <WhatsAppIcon />
      </a>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 max-w-4xl flex flex-col items-center"
      >
        <div className="relative mb-10 group">
            <div className="absolute inset-0 bg-sky-500 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            <BrandLogo className="h-40 w-40 sm:h-48 sm:w-48 relative z-10 drop-shadow-2xl transition-transform hover:scale-105 duration-700 ease-out" />
        </div>
        
        <h1 className="text-6xl sm:text-8xl font-black tracking-tighter liquid-text mb-4">
          Highshift Media
        </h1>
        <p className="text-xl sm:text-2xl text-white/70 font-light tracking-wide max-w-2xl">
          The next era of intelligence. Fluid, fast, and bespoke.
        </p>
         <p className="mt-6 text-sm text-sky-400/60 uppercase tracking-[0.2em] font-bold">
          Choose Your Path
        </p>
      </motion.div>
      
      <motion.div 
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl w-full px-4"
      >
        {SERVICES.map((service) => (
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              key={service.id} 
              className={`${service.id === 'snake' || service.id === 'voice_agent' || service.id === 'external_website' ? 'xl:col-span-2' : ''} h-full`}
            >
                <ServiceCard service={service} onClick={() => onSelect(service)} />
            </motion.div>
        ))}
      </motion.div>
      
       <footer className="w-full text-center mt-20 flex flex-col items-center gap-6">
        <div className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <SocialLink href="https://www.tiktok.com/@highshiftmedia?is_from_webapp=1&sender_device=pc" icon={<TikTokIcon />} label="TikTok" />
            <SocialLink href="https://www.facebook.com/profile.php?id=61582587125978" icon={<FacebookIcon />} label="Facebook" />
            <SocialLink href="https://www.instagram.com/highshift_media/" icon={<InstagramIcon />} label="Instagram" />
            <SocialLink href="https://www.youtube.com/@highshiftmedia" icon={<YoutubeIcon />} label="YouTube" />
            <SocialLink href="https://x.com/Highshiftmedia" icon={<XIcon />} label="X" />
        </div>
        <p className="text-xs font-medium tracking-widest text-white/30 uppercase">
          &copy; {new Date().getFullYear()} Highshift Media &bull; Artificial Intelligence Bureau
        </p>
      </footer>
    </div>
  );
};
