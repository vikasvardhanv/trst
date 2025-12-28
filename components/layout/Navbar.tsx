import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { BrandIcon } from '../../constants';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/services' },
  { name: 'AI Agents', path: '/agents' },
  { name: 'Case Studies', path: '/case-studies' },
  { name: 'Marketing', path: '/marketing' },
  { name: 'Demos', path: '/demos' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user, logout, setShowAuthModal, setAuthModalMode } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-gray-900/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <BrandIcon className="h-12 w-12" />
              </motion.div>
              <span className="text-xl font-bold text-white group-hover:text-sky-400 transition-colors">
                Highshift
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors group"
                >
                  {location.pathname === item.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-sky-400" />
                    </div>
                    <span className="text-sm font-medium text-white/80">
                      {user?.fullName?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-white/60 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>

                  {/* User dropdown menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-48 py-2 bg-gray-900/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-sm"
                      >
                        <div className="px-4 py-2 border-b border-white/10">
                          <p className="text-sm font-medium text-white truncate">{user?.fullName}</p>
                          <p className="text-xs text-white/50 truncate">{user?.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setShowAuthModal(true);
                  }}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  Sign In
                </button>
              )}
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    // Go to contact page if already logged in
                    window.location.href = '/contact';
                  } else {
                    setAuthModalMode('signup');
                    setShowAuthModal(true);
                  }
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl hover:from-sky-400 hover:to-blue-500 transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl" />
            <div className="relative pt-24 px-6">
              <div className="flex flex-col gap-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className={`block px-4 py-3 text-lg font-medium rounded-xl transition-colors ${
                        location.pathname === item.path
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  className="mt-4 space-y-3"
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-3 bg-white/5 rounded-xl">
                        <p className="text-sm font-medium text-white">{user?.fullName}</p>
                        <p className="text-xs text-white/50">{user?.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-lg font-medium text-white/70 hover:text-white border border-white/10 rounded-xl"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setAuthModalMode('login');
                          setShowAuthModal(true);
                        }}
                        className="w-full px-4 py-3 text-center text-lg font-medium text-white/70 hover:text-white border border-white/10 rounded-xl"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setAuthModalMode('signup');
                          setShowAuthModal(true);
                        }}
                        className="block w-full px-4 py-3 text-center text-lg font-semibold text-white bg-gradient-to-r from-sky-500 to-blue-600 rounded-xl"
                      >
                        Get Started
                      </button>
                    </>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
