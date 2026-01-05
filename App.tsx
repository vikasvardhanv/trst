import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import { AuthModal } from './components/auth/AuthModal';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { CookieBanner, CookiePreferences } from './components/CookieConsent';

// Lazy load all pages for faster initial load
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Agents = lazy(() => import('./pages/Agents').then(m => ({ default: m.Agents })));
const DemoForm = lazy(() => import('./pages/DemoForm').then(m => ({ default: m.DemoForm })));
const Marketing = lazy(() => import('./pages/Marketing').then(m => ({ default: m.Marketing })));
const Demos = lazy(() => import('./pages/Demos').then(m => ({ default: m.Demos })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const CaseStudies = lazy(() => import('./pages/CaseStudies').then(m => ({ default: m.CaseStudies })));
const Careers = lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const AuthPage = lazy(() => import('./pages/AuthPage').then(m => ({ default: m.AuthPage })));

// Legal pages - lazy loaded
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/legal/TermsOfService').then(m => ({ default: m.TermsOfService })));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy').then(m => ({ default: m.CookiePolicy })));

// Demo pages - lazy loaded
const RestaurantDemo = lazy(() => import('./pages/demos/RestaurantDemo').then(m => ({ default: m.RestaurantDemo })));
const ClinicDemo = lazy(() => import('./pages/demos/ClinicDemo').then(m => ({ default: m.ClinicDemo })));
const SalonDemo = lazy(() => import('./pages/demos/SalonDemo').then(m => ({ default: m.SalonDemo })));
const DealershipDemo = lazy(() => import('./pages/demos/DealershipDemo').then(m => ({ default: m.DealershipDemo })));
const ConstructionDemo = lazy(() => import('./pages/demos/ConstructionDemo').then(m => ({ default: m.ConstructionDemo })));
const WhatsAppDemo = lazy(() => import('./pages/demos/WhatsAppDemo').then(m => ({ default: m.WhatsAppDemo })));
const VoiceDemo = lazy(() => import('./pages/demos/VoiceDemo').then(m => ({ default: m.VoiceDemo })));
const BusinessPlanDemo = lazy(() => import('./pages/demos/BusinessPlanDemo').then(m => ({ default: m.BusinessPlanDemo })));
const RealEstateDemo = lazy(() => import('./pages/demos/RealEstateDemo').then(m => ({ default: m.RealEstateDemo })));
const LegalDemo = lazy(() => import('./pages/demos/LegalDemo').then(m => ({ default: m.LegalDemo })));
const EcommerceDemo = lazy(() => import('./pages/demos/EcommerceDemo').then(m => ({ default: m.EcommerceDemo })));
const EducationDemo = lazy(() => import('./pages/demos/EducationDemo').then(m => ({ default: m.EducationDemo })));
const RecruitmentDemo = lazy(() => import('./pages/demos/RecruitmentDemo').then(m => ({ default: m.RecruitmentDemo })));
const LeadGenDemo = lazy(() => import('./pages/demos/LeadGenDemo').then(m => ({ default: m.LeadGenDemo })));

// Advanced AI Service Demos - lazy loaded
const WorkflowAutomationDemo = lazy(() => import('./pages/demos/WorkflowAutomationDemo').then(m => ({ default: m.WorkflowAutomationDemo })));
const DataAnalyticsDemo = lazy(() => import('./pages/demos/DataAnalyticsDemo').then(m => ({ default: m.DataAnalyticsDemo })));
const ContentGeneratorDemo = lazy(() => import('./pages/demos/ContentGeneratorDemo').then(m => ({ default: m.ContentGeneratorDemo })));
const AgentOrchestrationDemo = lazy(() => import('./pages/demos/AgentOrchestrationDemo').then(m => ({ default: m.AgentOrchestrationDemo })));
const CustomModelDemo = lazy(() => import('./pages/demos/CustomModelDemo').then(m => ({ default: m.CustomModelDemo })));

// Legacy components - lazy loaded
const MarketingHub = lazy(() => import('./components/MarketingHub').then(m => ({ default: m.MarketingHub })));
const SnakeGame = lazy(() => import('./components/SnakeGame').then(m => ({ default: m.SnakeGame })));

// Loading spinner for lazy loaded components
const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="relative">
      <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-sky-500 animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-sky-500/20 animate-pulse" />
      </div>
    </div>
  </div>
);

// Optimized page transition with reduced motion support
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -20 }}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.3, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const GoogleSignInWarmup: React.FC = () => {
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as any).google?.accounts?.id) return;

    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) return;

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  return null;
};

// Animated routes wrapper
const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Main pages */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/services/:serviceId" element={<PageTransition><Services /></PageTransition>} />
        <Route path="/agents" element={<PageTransition><Agents /></PageTransition>} />
        <Route path="/agents/:agentId" element={<PageTransition><Agents /></PageTransition>} />
        <Route path="/marketing" element={<PageTransition><Marketing /></PageTransition>} />
        <Route path="/case-studies" element={<PageTransition><CaseStudies /></PageTransition>} />
        <Route path="/demos" element={<PageTransition><Demos /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/careers" element={<PageTransition><Careers /></PageTransition>} />
        <Route path="/demo-form" element={<PageTransition><DemoForm /></PageTransition>} />
        <Route path="/login" element={<PageTransition><AuthPage mode="login" /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><AuthPage mode="signup" /></PageTransition>} />

        {/* Legal pages */}
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><CookiePolicy /></PageTransition>} />

        {/* Protected Demo routes - require login */}
        <Route path="/demos/restaurant" element={<PageTransition><ProtectedRoute><RestaurantDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/clinic" element={<PageTransition><ProtectedRoute><ClinicDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/salon" element={<PageTransition><ProtectedRoute><SalonDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/dealership" element={<PageTransition><ProtectedRoute><DealershipDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/construction" element={<PageTransition><ProtectedRoute><ConstructionDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/whatsapp" element={<PageTransition><ProtectedRoute><WhatsAppDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/voice" element={<PageTransition><ProtectedRoute><VoiceDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/business-plan" element={<PageTransition><ProtectedRoute><BusinessPlanDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/real_estate" element={<PageTransition><ProtectedRoute><RealEstateDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/legal" element={<PageTransition><ProtectedRoute><LegalDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/ecommerce" element={<PageTransition><ProtectedRoute><EcommerceDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/education" element={<PageTransition><ProtectedRoute><EducationDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/recruitment" element={<PageTransition><ProtectedRoute><RecruitmentDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/lead-gen" element={<PageTransition><ProtectedRoute><LeadGenDemo /></ProtectedRoute></PageTransition>} />

        {/* Advanced AI Service Demos - Protected */}
        <Route path="/demos/workflow-automation" element={<PageTransition><ProtectedRoute><WorkflowAutomationDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/data-analytics" element={<PageTransition><ProtectedRoute><DataAnalyticsDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/content-generator" element={<PageTransition><ProtectedRoute><ContentGeneratorDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/agent-orchestration" element={<PageTransition><ProtectedRoute><AgentOrchestrationDemo /></ProtectedRoute></PageTransition>} />
        <Route path="/demos/custom-model" element={<PageTransition><ProtectedRoute><CustomModelDemo /></ProtectedRoute></PageTransition>} />

        {/* Fun extras */}
        <Route
          path="/snake"
          element={
            <PageTransition>
              <div className="min-h-screen bg-gray-900">
                <SnakeGame onRestart={() => window.location.href = '/'} />
              </div>
            </PageTransition>
          }
        />

        {/* Legacy marketing hub route */}
        <Route
          path="/marketing-hub"
          element={
            <PageTransition>
              <div className="min-h-screen bg-gray-900">
                <MarketingHub onRestart={() => window.location.href = '/'} />
              </div>
            </PageTransition>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<PageTransition><Landing /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CookieConsentProvider>
          <ScrollToTop />
          <GoogleSignInWarmup />
          <div className="w-full min-h-screen bg-gray-900 text-white">
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoutes />
            </Suspense>
          </div>
          <AuthModal />
          <CookieBanner />
          <CookiePreferences />
        </CookieConsentProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
