import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Pages
import {
  Landing,
  Services,
  Agents,
  Marketing,
  Demos,
  Contact,
  CaseStudies,
  ClientLogin,
  RestaurantDemo,
  ClinicDemo,
  SalonDemo,
  DealershipDemo,
  ConstructionDemo,
  WhatsAppDemo,
  VoiceDemo,
  BusinessPlanDemo,
  RealEstateDemo,
  LegalDemo,
  EcommerceDemo,
  EducationDemo,
  RecruitmentDemo,
} from './pages';

// Legacy components for backward compatibility
import { MarketingHub } from './components/MarketingHub';
import { SnakeGame } from './components/SnakeGame';

// Page transition wrapper
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.25, 0.4, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
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
        <Route path="/marketing" element={<PageTransition><Marketing /></PageTransition>} />        <Route path="/case-studies" element={<PageTransition><CaseStudies /></PageTransition>} />
        <Route path="/login" element={<PageTransition><ClientLogin /></PageTransition>} />        <Route path="/demos" element={<PageTransition><Demos /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />

        {/* Demo routes */}
        <Route path="/demos/restaurant" element={<PageTransition><RestaurantDemo /></PageTransition>} />
        <Route path="/demos/clinic" element={<PageTransition><ClinicDemo /></PageTransition>} />
        <Route path="/demos/salon" element={<PageTransition><SalonDemo /></PageTransition>} />
        <Route path="/demos/dealership" element={<PageTransition><DealershipDemo /></PageTransition>} />
        <Route path="/demos/construction" element={<PageTransition><ConstructionDemo /></PageTransition>} />
        <Route path="/demos/whatsapp" element={<PageTransition><WhatsAppDemo /></PageTransition>} />
        <Route path="/demos/voice" element={<PageTransition><VoiceDemo /></PageTransition>} />
        <Route path="/demos/business-plan" element={<PageTransition><BusinessPlanDemo /></PageTransition>} />
        <Route path="/demos/real_estate" element={<PageTransition><RealEstateDemo /></PageTransition>} />
        <Route path="/demos/legal" element={<PageTransition><LegalDemo /></PageTransition>} />
        <Route path="/demos/ecommerce" element={<PageTransition><EcommerceDemo /></PageTransition>} />
        <Route path="/demos/education" element={<PageTransition><EducationDemo /></PageTransition>} />
        <Route path="/demos/recruitment" element={<PageTransition><RecruitmentDemo /></PageTransition>} />

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
      <div className="w-full min-h-screen bg-gray-900 text-white">
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App;
