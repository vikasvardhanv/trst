Skip to content
Navigation Menu
highshiftmedia
Highshift-media-bot
 
Type / to search
Code
Issues
Pull requests
Actions
Projects
Security
Insights
Settings
fixed all #1
✨ 
 Merged
vikasvardhanv merged 2 commits into highshiftmedia:main from vikasvardhanv:main  4 hours ago
+7,317 −47 
 Conversation 7
 Commits 2
 Checks 0
 Files changed 15
  
File filter  
 
0 / 15 files viewed
 
  5 changes: 5 additions & 0 deletions 5  
.gitignore
 Viewed

Original file line number	Diff line number	Diff line change
@@ -22,3 +22,8 @@ dist-ssr
*.njsproj
*.sln
*.sw?
node_modules
.env
.env.test
todo.md
.env.local 
  97 changes: 83 additions & 14 deletions 97  
App.tsx
 Viewed

Original file line number	Diff line number	Diff line change
@@ -5,6 +5,14 @@ import { Chatbot } from './components/Chatbot';
import { SnakeGame } from './components/SnakeGame';
import { BusinessPlanner } from './components/BusinessPlanner';
import { VoiceAgent } from './components/VoiceAgent';
import { IndustryAgentHub } from './components/IndustryAgentHub';
import { RestaurantAgent } from './components/agents/RestaurantAgent';
import { ClinicAgent } from './components/agents/ClinicAgent';
import { SalonAgent } from './components/agents/SalonAgent';
import { DealershipAgent } from './components/agents/DealershipAgent';
import { ConstructionAgent } from './components/agents/ConstructionAgent';
import { MarketingHub } from './components/MarketingHub';
import { WhatsAppBot } from './components/WhatsAppBot';
import type { Service, ChatMessage, Question } from './types';
import { AppState } from './types';
import { QUESTIONS } from './constants';
@@ -20,21 +28,30 @@ function App() {

  const handleServiceSelect = useCallback((service: Service) => {
    setSelectedService(service);
    if (service.id === 'snake') {
      setAppState(AppState.SNAKE_GAME);
      return;
    }

    if (service.id === 'business_plan') {
      setAppState(AppState.BUSINESS_PLAN);
      return;
    }

    if (service.id === 'voice_agent') {
    // Handle special navigation cases
    switch (service.id) {
      case 'snake':
        setAppState(AppState.SNAKE_GAME);
        return;
      case 'business_plan':
        setAppState(AppState.BUSINESS_PLAN);
        return;
      case 'voice_agent':
        setAppState(AppState.VOICE_AGENT);
        return;
      case 'industry_agents':
        setAppState(AppState.INDUSTRY_AGENTS);
        return;
      case 'marketing_hub':
        setAppState(AppState.MARKETING_HUB);
        return;
      case 'whatsapp_bot':
        setAppState(AppState.WHATSAPP_BOT);
        return;
    }

    // Default chat flow for other services
    const firstQuestion = QUESTIONS[service.id]?.[0]?.text;
    if (firstQuestion) {
      setChatHistory([
@@ -47,6 +64,26 @@ function App() {
    setAppState(AppState.CHAT);
  }, []);

  const handleIndustryAgentSelect = useCallback((agentId: string) => {
    switch (agentId) {
      case 'restaurant':
        setAppState(AppState.RESTAURANT_AGENT);
        break;
      case 'clinic':
        setAppState(AppState.CLINIC_AGENT);
        break;
      case 'salon':
        setAppState(AppState.SALON_AGENT);
        break;
      case 'dealership':
        setAppState(AppState.DEALERSHIP_AGENT);
        break;
      case 'construction':
        setAppState(AppState.CONSTRUCTION_AGENT);
        break;
    }
  }, []);

  const handleSendMessage = useCallback(async (message: string) => {
    if (!selectedService) return;

@@ -59,12 +96,12 @@ function App() {
    const nextQuestionIndex = currentQuestionIndex + 1;
    const serviceQuestions = QUESTIONS[selectedService.id];

    if (nextQuestionIndex < serviceQuestions.length) {
    if (serviceQuestions && nextQuestionIndex < serviceQuestions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
      setChatHistory(prev => [...prev, { sender: 'bot', text: serviceQuestions[nextQuestionIndex].text }]);
    } else {
      setIsLoading(true);
      setAppState(AppState.BOOKING); // Change state to prevent user input while summarizing
      setAppState(AppState.BOOKING);

      const summary = await generateSummary(selectedService.id, selectedService.name, newAnswers);

@@ -86,16 +123,48 @@ function App() {
    setIsLoading(false);
  };

  const handleBackToIndustryHub = () => {
    setAppState(AppState.INDUSTRY_AGENTS);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.SERVICE_SELECTION:
        return <ServiceSelection onSelect={handleServiceSelect} />;

      // Existing features
      case AppState.SNAKE_GAME:
        return <SnakeGame onRestart={handleRestart} />;
      case AppState.BUSINESS_PLAN:
        return <BusinessPlanner onRestart={handleRestart} />;
      case AppState.VOICE_AGENT:
          return <VoiceAgent onRestart={handleRestart} />;
        return <VoiceAgent onRestart={handleRestart} />;

      // Industry Agents Hub
      case AppState.INDUSTRY_AGENTS:
        return <IndustryAgentHub onSelectAgent={handleIndustryAgentSelect} onRestart={handleRestart} />;

      // Individual Industry Agents
      case AppState.RESTAURANT_AGENT:
        return <RestaurantAgent onBack={handleBackToIndustryHub} onRestart={handleRestart} />;
      case AppState.CLINIC_AGENT:
        return <ClinicAgent onBack={handleBackToIndustryHub} onRestart={handleRestart} />;
      case AppState.SALON_AGENT:
        return <SalonAgent onBack={handleBackToIndustryHub} onRestart={handleRestart} />;
      case AppState.DEALERSHIP_AGENT:
        return <DealershipAgent onBack={handleBackToIndustryHub} onRestart={handleRestart} />;
      case AppState.CONSTRUCTION_AGENT:
        return <ConstructionAgent onBack={handleBackToIndustryHub} onRestart={handleRestart} />;

      // Marketing Hub
      case AppState.MARKETING_HUB:
        return <MarketingHub onRestart={handleRestart} />;

      // WhatsApp Bot
      case AppState.WHATSAPP_BOT:
        return <WhatsAppBot onRestart={handleRestart} />;

      // Chat flow
      case AppState.CHAT:
      case AppState.BOOKING:
        if (selectedService) {
@@ -111,9 +180,9 @@ function App() {
                    currentQuestion={currentQuestion}
                 />;
        }
        // Fallback to service selection if service is null
        handleRestart();
        return <ServiceSelection onSelect={handleServiceSelect} />;

      default:
        return <ServiceSelection onSelect={handleServiceSelect} />;
    }
 128 changes: 128 additions & 0 deletions 128  
components/IndustryAgentHub.tsx
 Viewed

Original file line number	Diff line number	Diff line change
@@ -0,0 +1,128 @@
import React from 'react';
import { BrandLogo, INDUSTRY_AGENTS } from '../constants';
import type { IndustryAgent } from '../types';

interface IndustryAgentHubProps {
  onSelectAgent: (agentId: string) => void;
  onRestart: () => void;
}

const AgentCard: React.FC<{ agent: IndustryAgent; onClick: () => void }> = ({ agent, onClick }) => (
  <button
    onClick={onClick}
    className="glass-card p-6 rounded-2xl text-left w-full h-full flex flex-col group overflow-hidden relative hover:scale-[1.02] transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10">
      <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {agent.icon}
      </div>
      <span className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 block">{agent.industry}</span>
      <h3 className="font-bold text-lg text-white mb-2">{agent.name}</h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{agent.description}</p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {agent.features.slice(0, 3).map((feature, idx) => (
          <span key={idx} className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded-full border border-white/10">
            {feature}
          </span>
        ))}
        {agent.features.length > 3 && (
          <span className="text-xs text-white/40">+{agent.features.length - 3} more</span>
        )}
      </div>

      {agent.demoAvailable && (
        <div className="mt-4 flex items-center gap-2">
          <span className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></span>
          <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Live Demo Available</span>
        </div>
      )}
    </div>
  </button>
);

export const IndustryAgentHub: React.FC<IndustryAgentHubProps> = ({ onSelectAgent, onRestart }) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 sm:p-10 lg:p-16 relative">
      <div className="w-full max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <BrandLogo className="h-12 w-12" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Industry AI Agents</h1>
              <p className="text-sm text-white/50">Pre-built solutions for every business</p>
            </div>
          </div>
          <button 
            onClick={onRestart}
            className="text-xs font-bold text-white/40 hover:text-white transition uppercase tracking-widest flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Description */}
        <div className="glass-panel rounded-2xl p-8 mb-12 border-white/5">
          <h2 className="text-xl font-bold text-white mb-4">Intelligent Automation for Every Industry</h2>
          <p className="text-white/60 leading-relaxed">
            Our AI agents are purpose-built for specific industries, handling everything from customer inquiries 
            and appointment booking to order management and reporting. Each agent integrates seamlessly with 
            your existing systems and can be customized to match your brand.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-400">24/7</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Availability</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">95%</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Query Resolution</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">60%</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">&lt;2min</div>
              <div className="text-xs text-white/40 uppercase tracking-widest mt-1">Response Time</div>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {INDUSTRY_AGENTS.map((agent) => (
            <AgentCard 
              key={agent.id} 
              agent={agent} 
              onClick={() => onSelectAgent(agent.id)} 
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-white/40 mb-4">Don't see your industry? We build custom agents too.</p>
          <a 
            href="mailto:info@highshiftmedia.com?subject=Custom AI Agent Inquiry"
            className="inline-flex items-center gap-2 bg-sky-500 text-white font-bold py-3 px-6 rounded-xl hover:bg-sky-400 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Contact Us for Custom Solutions
          </a>
        </div>
      </div>

      <footer className="w-full text-center mt-20 p-4 text-xs font-medium tracking-widest text-white/30 uppercase">
        &copy; {new Date().getFullYear()} Highshift Media &bull; Industry AI Agents
      </footer>
    </div>
  );
};
Loading
Footer
© 2025 GitHub, Inc.
Footer navigation
Terms
Privacy
Security
Status
Community
Docs
Contact
Manage cookies
Do not share my personal information
