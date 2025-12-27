import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrandLogo, TikTokIcon, FacebookIcon, InstagramIcon, YoutubeIcon, XIcon, WhatsAppIcon } from '../../constants';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

const footerLinks = {
  services: [
    { name: 'AI Agents', path: '/agents' },
    { name: 'Marketing Hub', path: '/marketing' },
    { name: 'Chatbot Development', path: '/services/chatbot' },
    { name: 'Voice AI', path: '/demos/voice' },
    { name: 'WhatsApp Bot', path: '/demos/whatsapp' },
  ],
  company: [
    { name: 'About Us', path: '/about' },
    { name: 'Case Studies', path: '/cases' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ],
  resources: [
    { name: 'Documentation', path: '/docs' },
    { name: 'API Reference', path: '/api' },
    { name: 'Blog', path: '/blog' },
    { name: 'Support', path: '/support' },
  ],
};

const socialLinks = [
  { icon: <TikTokIcon />, href: 'https://www.tiktok.com/@highshiftmedia', label: 'TikTok' },
  { icon: <FacebookIcon />, href: 'https://www.facebook.com/profile.php?id=61582587125978', label: 'Facebook' },
  { icon: <InstagramIcon />, href: 'https://www.instagram.com/highshift_media/', label: 'Instagram' },
  { icon: <YoutubeIcon />, href: 'https://www.youtube.com/@highshiftmedia', label: 'YouTube' },
  { icon: <XIcon />, href: 'https://x.com/Highshiftmedia', label: 'X' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gray-900/50 border-t border-white/10">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <BrandLogo className="h-12 w-12" />
              <span className="text-2xl font-bold text-white">Highshift Media</span>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm leading-relaxed">
              The next era of intelligence. We build AI solutions that transform businesses and create
              exceptional customer experiences.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a href="mailto:info@highshiftmedia.com" className="flex items-center gap-3 text-white/60 hover:text-sky-400 transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@highshiftmedia.com</span>
              </a>
              <a href="tel:+16307033569" className="flex items-center gap-3 text-white/60 hover:text-sky-400 transition-colors">
                <Phone className="h-4 w-4" />
                <span>+1 (630) 703-3569</span>
              </a>
            </div>
          </div>

          {/* Links sections */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/60 hover:text-white transition-colors flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 text-white/40 hover:text-white hover:bg-white/10 rounded-full transition-all"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} Highshift Media. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className="text-white/40 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-white/40 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-white/40 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
