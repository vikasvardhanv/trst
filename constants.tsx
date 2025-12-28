
import React from 'react';
import type { Service, Question } from './types';
import { IndustryAgentsIcon } from './components/icons/IndustryAgentsIcon';
import { MarketingHubIcon } from './components/icons/MarketingHubIcon';
import { ClinicIcon, ConstructionIcon, DealershipIcon, RestaurantIcon, SalonIcon, RealEstateIcon, LegalIcon, EcommerceIcon, EducationIcon, RecruitmentIcon } from './components/icons/AgentIcons';
import { EmailIcon, SocialMediaIcon } from './components/icons/MarketingIcons';
import type { IndustryAgent } from './types';
import {
  MessageSquare, FileText, Settings, Globe, Box, Gamepad2, Briefcase, Mic, Video,
  Mail, Phone, Users, Search, BarChart3, Zap, Database, Link, Lightbulb, GraduationCap,
  Target, TrendingUp, Share2, Megaphone, ShoppingCart, Building2, Stethoscope, Car, Home,
  UtensilsCrossed, Scissors, BookOpen, HeadphonesIcon, Layers, Bot, Workflow, PieChart
} from 'lucide-react';

export { IndustryAgentsIcon, MarketingHubIcon, ClinicIcon, ConstructionIcon, DealershipIcon, RestaurantIcon, SalonIcon, RealEstateIcon, LegalIcon, EcommerceIcon, EducationIcon, RecruitmentIcon, EmailIcon, SocialMediaIcon };


export const BrandLogo = ({ className = "h-32 w-32" }: { className?: string }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video loops continuously
    video.loop = true;

    // Start playing
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Video autoplay prevented:', error);
      });
    }

    // Extra safeguard: restart on ended event (though loop should handle this)
    const handleEnded = () => {
      video.currentTime = 0;
      video.play().catch(console.log);
    };

    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className={`${className} relative rounded-full overflow-hidden shadow-2xl`}>
      {/* Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src="/videos/inline.mp4" type="video/mp4" />
      </video>

      {/* Subtle border */}
      <div className="absolute inset-0 border-2 border-white/10 rounded-full pointer-events-none" />
    </div>
  );
};

export const BrandIcon = ({ className = "h-12 w-12" }: { className?: string }) => (
  <img
    src="/highshift-icon.svg"
    alt="Highshift Media"
    className={`shrink-0 ${className}`}
    loading="eager"
    decoding="async"
  />
);

// Service Icons
const ChatbotIcon = () => <MessageSquare className="h-10 w-10 mb-4 text-sky-400" />;

const ContentIcon = () => <FileText className="h-10 w-10 mb-4 text-sky-400" />;

const AutomationIcon = () => <Settings className="h-10 w-10 mb-4 text-sky-400" />;

const WebsiteIcon = () => <Globe className="h-10 w-10 mb-4 text-sky-400" />;

const ModelIcon = () => <Box className="h-10 w-10 mb-4 text-sky-400" />;

const GameIcon = () => <Gamepad2 className="h-10 w-10 mb-4 text-sky-400" />;

const BusinessIcon = () => <Briefcase className="h-10 w-10 mb-4 text-sky-400" />;

const VoiceIcon = () => <Mic className="h-10 w-10 mb-4 text-sky-400" />;

const VideoIcon = () => <Video className="h-10 w-10 mb-4 text-sky-400" />;

const EmailAgentIcon = () => <Mail className="h-10 w-10 mb-4 text-sky-400" />;

const PhoneIcon = () => <Phone className="h-10 w-10 mb-4 text-sky-400" />;

const SEOIcon = () => <Search className="h-10 w-10 mb-4 text-sky-400" />;

const AnalyticsIcon = () => <BarChart3 className="h-10 w-10 mb-4 text-sky-400" />;

const IntegrationIcon = () => <Link className="h-10 w-10 mb-4 text-sky-400" />;

const ConsultingIcon = () => <Lightbulb className="h-10 w-10 mb-4 text-sky-400" />;

const TrainingIcon = () => <GraduationCap className="h-10 w-10 mb-4 text-sky-400" />;

const LeadGenIcon = () => <Target className="h-10 w-10 mb-4 text-sky-400" />;

const SocialIcon = () => <Share2 className="h-10 w-10 mb-4 text-sky-400" />;

const CRMIcon = () => <Users className="h-10 w-10 mb-4 text-sky-400" />;

const DataIcon = () => <Database className="h-10 w-10 mb-4 text-sky-400" />;

const SupportIcon = () => <HeadphonesIcon className="h-10 w-10 mb-4 text-sky-400" />;

const WorkflowIcon = () => <Workflow className="h-10 w-10 mb-4 text-sky-400" />;

const ReportIcon = () => <PieChart className="h-10 w-10 mb-4 text-sky-400" />;

// Social Media Icons
export const TikTokIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47-1.26-.88-2.22-2.19-2.68-3.6-.03 3.14-.04 6.28-.04 9.42 0 1.05-.1 2.13-.42 3.13-.36 1.25-1.14 2.39-2.21 3.12-1.27.87-2.88 1.29-4.41 1.14-1.63-.16-3.18-.94-4.22-2.21-1.16-1.41-1.63-3.27-1.32-5.07.28-1.57 1.16-3.03 2.47-3.95 1.48-1.04 3.4-1.44 5.19-1.07.02 1.48.01 2.97.02 4.45-.63-.2-1.31-.22-1.95-.08-.63.14-1.21.5-1.61 1.02-.4.5-.62 1.14-.61 1.78.01.63.22 1.26.59 1.77.38.52.95.89 1.57 1.04.65.17 1.36.14 1.99-.07.69-.22 1.29-.68 1.67-1.3.36-.6.49-1.3.48-2.01-.01-4.76-.01-9.51-.01-14.27z"/>
  </svg>
);

export const FacebookIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
  </svg>
);

export const InstagramIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export const YoutubeIcon = () => (
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 4-8 4z"/>
  </svg>
);

export const XIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298l13.312 17.404z"/>
  </svg>
);

export const WhatsAppIcon = () => (
  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

export const SERVICES: Service[] = [
  // ============ AI AGENTS ============
  {
    id: 'chatbot',
    name: 'AI Chat Agents',
    description: 'Intelligent chatbots for websites and apps that handle inquiries, qualify leads, book appointments, and provide 24/7 support.',
    icon: <ChatbotIcon />,
    category: 'agents',
    highlight: 'Most Popular',
    longDescription: 'Our AI Chat Agents are intelligent conversational systems that integrate seamlessly with your website, mobile app, or customer portal. They understand context, remember conversation history, and provide human-like responses that delight customers while reducing your support burden.',
    benefits: [
      '24/7 instant responses - never miss a lead',
      'Reduce support tickets by up to 70%',
      'Qualify leads automatically before handoff',
      'Multilingual support in 50+ languages',
      'Seamless handoff to human agents when needed',
    ],
    features: [
      'Natural language understanding',
      'Context-aware conversations',
      'Lead capture & qualification forms',
      'Appointment scheduling integration',
      'Knowledge base integration',
      'Analytics & conversation insights',
      'Custom branding & personality',
      'Human handoff with full context',
    ],
    useCases: [
      'Customer support automation',
      'Lead qualification & nurturing',
      'Appointment booking',
      'Product recommendations',
      'FAQ automation',
      'Order status inquiries',
    ],
    integrations: ['Zendesk', 'Intercom', 'HubSpot', 'Salesforce', 'Slack', 'Calendly', 'Shopify'],
    demoId: 'chatbot',
  },
  {
    id: 'voice_agent',
    name: 'AI Voice Agents',
    description: 'Human-like phone agents that answer calls instantly, handle support tickets, schedule appointments, and never put customers on hold.',
    icon: <VoiceIcon />,
    category: 'agents',
    longDescription: 'AI Voice Agents handle inbound and outbound calls with natural, human-like conversation. They can answer customer queries, book appointments, qualify leads, and provide support—all without putting customers on hold or requiring human intervention.',
    benefits: [
      'Answer 100% of calls instantly',
      'Reduce call center costs by 60%',
      'No hold times or missed calls',
      'Consistent quality 24/7/365',
      'Scale infinitely during peak times',
    ],
    features: [
      'Natural speech synthesis',
      'Real-time transcription',
      'Intent recognition',
      'Call routing & transfers',
      'CRM integration',
      'Call recording & analytics',
      'Custom voice & personality',
      'Multi-language support',
    ],
    useCases: [
      'Inbound call handling',
      'Appointment scheduling',
      'Lead qualification calls',
      'Order status updates',
      'Payment reminders',
      'Survey & feedback collection',
    ],
    integrations: ['Twilio', 'RingCentral', 'Aircall', 'Salesforce', 'HubSpot', 'Google Calendar'],
    demoId: 'voice',
  },
  {
    id: 'video_agent',
    name: 'AI Video Agents',
    description: 'Lifelike AI avatars for video calls, personalized video outreach, training content, and virtual receptionists.',
    icon: <VideoIcon />,
    category: 'agents',
    highlight: 'New',
    longDescription: 'Create engaging, personalized video content at scale using AI-powered avatars. From personalized sales outreach to training videos and virtual receptionists, our video agents bring a human touch to automated interactions.',
    benefits: [
      'Create personalized videos at scale',
      'Reduce video production costs by 90%',
      'Increase engagement with face-to-face content',
      'Available in 100+ languages',
      'No studio or actors required',
    ],
    features: [
      'Lifelike AI avatars',
      'Custom avatar creation',
      'Script-to-video generation',
      'Personalization tokens',
      'Multi-language dubbing',
      'Interactive video responses',
      'Virtual reception desk',
      'Video analytics',
    ],
    useCases: [
      'Personalized sales outreach',
      'Training & onboarding videos',
      'Virtual receptionist',
      'Product demos',
      'Customer success videos',
      'Marketing campaigns',
    ],
    integrations: ['HeyGen', 'Synthesia', 'Loom', 'Vidyard', 'Salesforce', 'HubSpot'],
  },
  {
    id: 'whatsapp_bot',
    name: 'WhatsApp & SMS Agents',
    description: 'Conversational AI for WhatsApp, SMS, and Messenger that qualifies leads, sends reminders, and automates follow-ups.',
    icon: <WhatsAppIcon />,
    category: 'agents',
    longDescription: 'Meet customers where they already are—on messaging apps. Our WhatsApp and SMS agents handle conversations on the platforms your customers prefer, from lead qualification to appointment reminders and order updates.',
    benefits: [
      '98% open rates on messaging',
      'Instant two-way conversations',
      'Automated appointment reminders',
      'Reduce no-shows by 40%',
      'Scale personal conversations',
    ],
    features: [
      'WhatsApp Business API integration',
      'SMS campaigns & automation',
      'Rich media messages',
      'Quick reply buttons',
      'Broadcast messaging',
      'Conversation flows',
      'Template management',
      'Analytics dashboard',
    ],
    useCases: [
      'Appointment reminders',
      'Lead qualification',
      'Order confirmations',
      'Delivery updates',
      'Customer support',
      'Promotional campaigns',
    ],
    integrations: ['WhatsApp Business', 'Twilio', 'MessageBird', 'Meta Messenger', 'Shopify', 'WooCommerce'],
    demoId: 'whatsapp',
  },
  {
    id: 'email_agent',
    name: 'AI Email Agents',
    description: 'Automated email responses, lead nurturing sequences, and intelligent inbox management that sounds human.',
    icon: <EmailAgentIcon />,
    category: 'agents',
    longDescription: 'AI Email Agents automate your inbox while maintaining the personal touch. From instant responses to complex nurturing sequences, our email agents handle it all—drafting, sending, and following up without human intervention.',
    benefits: [
      'Respond to emails in seconds',
      'Increase reply rates by 3x',
      'Automate follow-up sequences',
      'Maintain consistent brand voice',
      'Handle unlimited email volume',
    ],
    features: [
      'AI email drafting',
      'Intent classification',
      'Smart routing',
      'Personalization at scale',
      'A/B testing',
      'Sequence automation',
      'Sentiment analysis',
      'Reply detection',
    ],
    useCases: [
      'Lead nurturing',
      'Customer support responses',
      'Sales outreach',
      'Onboarding sequences',
      'Re-engagement campaigns',
      'Inbox zero automation',
    ],
    integrations: ['Gmail', 'Outlook', 'Mailchimp', 'SendGrid', 'HubSpot', 'Salesforce'],
  },
  {
    id: 'support_agent',
    name: 'AI Support Desk',
    description: 'Omnichannel support automation with ticket routing, escalation rules, and seamless human handoff.',
    icon: <SupportIcon />,
    category: 'agents',
    longDescription: 'Unify all your support channels into one intelligent system. Our AI Support Desk handles tickets from email, chat, phone, and social media—routing, responding, and escalating based on your rules.',
    benefits: [
      'Reduce first response time by 80%',
      'Resolve 60% of tickets automatically',
      'Unified view of all channels',
      'Smart escalation to right agent',
      'Consistent support quality 24/7',
    ],
    features: [
      'Omnichannel inbox',
      'AI-powered responses',
      'Ticket classification',
      'Priority scoring',
      'SLA management',
      'Agent assist',
      'Knowledge base integration',
      'Performance analytics',
    ],
    useCases: [
      'Technical support',
      'Billing inquiries',
      'Product questions',
      'Returns & refunds',
      'Account management',
      'Escalation handling',
    ],
    integrations: ['Zendesk', 'Freshdesk', 'Intercom', 'Help Scout', 'Salesforce Service Cloud', 'Jira'],
  },

  // ============ INDUSTRY SOLUTIONS ============
  {
    id: 'industry_agents',
    name: 'Healthcare AI',
    description: 'Patient scheduling, triage automation, appointment reminders, insurance verification, and HIPAA-compliant solutions.',
    icon: <IndustryAgentsIcon />,
    category: 'industry',
    longDescription: 'Purpose-built AI solutions for healthcare providers. Our HIPAA-compliant agents handle patient scheduling, symptom triage, insurance verification, and follow-up care—letting your staff focus on what matters most: patient care.',
    benefits: [
      'HIPAA-compliant infrastructure',
      'Reduce no-shows by 50%',
      'Handle after-hours inquiries',
      'Automate insurance verification',
      'Improve patient satisfaction scores',
    ],
    features: [
      'Patient scheduling',
      'Symptom pre-screening',
      'Insurance verification',
      'Prescription refill requests',
      'Appointment reminders',
      'Post-visit follow-up',
      'Patient FAQs',
      'EHR integration',
    ],
    useCases: [
      'Medical clinics',
      'Dental practices',
      'Physical therapy',
      'Mental health providers',
      'Specialty practices',
      'Urgent care centers',
    ],
    integrations: ['Epic', 'Cerner', 'athenahealth', 'Zocdoc', 'DrChrono', 'Kareo'],
    demoId: 'clinic',
  },
  {
    id: 'automotive_ai',
    name: 'Automotive AI',
    description: 'Lead qualification, test drive scheduling, inventory inquiries, service reminders, and dealership automation.',
    icon: <IndustryAgentsIcon />,
    category: 'industry',
    longDescription: 'Transform your dealership with AI that qualifies leads, schedules test drives, answers inventory questions, and books service appointments—24/7. Never miss a hot lead again.',
    benefits: [
      'Capture leads after hours',
      'Qualify before sales handoff',
      'Instant inventory answers',
      'Increase test drive bookings',
      'Automated service reminders',
    ],
    features: [
      'Lead qualification',
      'Test drive scheduling',
      'Inventory search',
      'Trade-in estimates',
      'Financing pre-qualification',
      'Service appointment booking',
      'Parts inquiries',
      'DMS integration',
    ],
    useCases: [
      'New car dealerships',
      'Used car dealers',
      'Service departments',
      'Parts departments',
      'Multi-location groups',
      'OEM programs',
    ],
    integrations: ['DealerSocket', 'CDK Global', 'Reynolds & Reynolds', 'VinSolutions', 'AutoTrader'],
    demoId: 'dealership',
  },
  {
    id: 'realestate_ai',
    name: 'Real Estate AI',
    description: 'Property inquiries, virtual tour scheduling, buyer qualification, and automated listing updates.',
    icon: <IndustryAgentsIcon />,
    category: 'industry',
    longDescription: 'AI assistants that handle property inquiries, qualify buyers, schedule viewings, and keep leads warm while you close deals. Perfect for agents, teams, and brokerages.',
    benefits: [
      'Respond to leads in seconds',
      'Qualify buyers 24/7',
      'Schedule showings automatically',
      'Nurture cold leads',
      'More time for closings',
    ],
    features: [
      'Property inquiries',
      'Buyer qualification',
      'Showing scheduling',
      'Virtual tour booking',
      'MLS integration',
      'Mortgage calculator',
      'Neighborhood info',
      'Follow-up automation',
    ],
    useCases: [
      'Individual agents',
      'Real estate teams',
      'Brokerages',
      'Property management',
      'New construction',
      'Commercial real estate',
    ],
    integrations: ['Zillow', 'Realtor.com', 'BoomTown', 'Follow Up Boss', 'Dotloop', 'Calendly'],
    demoId: 'real_estate',
  },
  {
    id: 'hospitality_ai',
    name: 'Hospitality AI',
    description: 'Guest services, booking management, room service automation, and multilingual concierge support.',
    icon: <IndustryAgentsIcon />,
    category: 'industry',
    longDescription: 'Elevate guest experience with AI concierge services. Handle bookings, room service orders, local recommendations, and guest requests in any language—all while reducing staff workload.',
    benefits: [
      'Instant guest responses 24/7',
      '50+ language support',
      'Upsell amenities automatically',
      'Reduce front desk calls',
      'Improve guest satisfaction',
    ],
    features: [
      'Reservation management',
      'Room service orders',
      'Concierge services',
      'Local recommendations',
      'Housekeeping requests',
      'Check-in/out assistance',
      'Amenity bookings',
      'Guest feedback',
    ],
    useCases: [
      'Hotels & resorts',
      'Vacation rentals',
      'Restaurants',
      'Spas & wellness',
      'Event venues',
      'Tour operators',
    ],
    integrations: ['Opera PMS', 'Cloudbeds', 'Guesty', 'Toast', 'OpenTable', 'TripAdvisor'],
    demoId: 'restaurant',
  },
  {
    id: 'ecommerce_ai',
    name: 'E-commerce AI',
    description: 'Product recommendations, order tracking, returns automation, abandoned cart recovery, and customer support.',
    icon: <IndustryAgentsIcon />,
    category: 'industry',
    longDescription: 'Boost conversions and customer satisfaction with AI that helps shoppers find products, tracks orders, handles returns, and recovers abandoned carts—all automatically.',
    benefits: [
      'Increase conversions by 20%',
      'Recover abandoned carts',
      'Reduce support tickets',
      'Personalized recommendations',
      '24/7 shopping assistance',
    ],
    features: [
      'Product recommendations',
      'Size & fit guidance',
      'Order tracking',
      'Returns processing',
      'Cart recovery',
      'Inventory alerts',
      'Comparison shopping',
      'Review integration',
    ],
    useCases: [
      'Online stores',
      'Marketplaces',
      'D2C brands',
      'Subscription boxes',
      'Dropshipping',
      'B2B commerce',
    ],
    integrations: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce', 'Klaviyo', 'Gorgias'],
    demoId: 'ecommerce',
  },

  // ============ MARKETING & GROWTH ============
  {
    id: 'marketing_hub',
    name: 'AI Marketing Suite',
    description: 'End-to-end marketing automation with content creation, campaign management, and performance optimization.',
    icon: <MarketingHubIcon />,
    category: 'marketing',
    longDescription: 'A complete AI-powered marketing platform that handles everything from content creation to campaign execution and optimization. Unify your marketing efforts with intelligent automation.',
    benefits: [
      'Create content 10x faster',
      'Optimize campaigns in real-time',
      'Personalize at scale',
      'Reduce marketing costs by 40%',
      'Data-driven decisions',
    ],
    features: [
      'Content generation',
      'Campaign automation',
      'A/B testing',
      'Audience segmentation',
      'Performance analytics',
      'Multi-channel publishing',
      'Brand voice consistency',
      'ROI tracking',
    ],
    useCases: [
      'Content marketing',
      'Email campaigns',
      'Social media management',
      'Paid advertising',
      'SEO optimization',
      'Lead nurturing',
    ],
    integrations: ['HubSpot', 'Mailchimp', 'Google Ads', 'Meta Ads', 'Hootsuite', 'SEMrush'],
  },
  {
    id: 'content',
    name: 'AI Content Generation',
    description: 'Blog posts, ad copy, product descriptions, email sequences, and social media content at scale.',
    icon: <ContentIcon />,
    category: 'marketing',
    longDescription: 'Generate high-quality content at scale while maintaining your brand voice. From blog posts to ad copy, product descriptions to social media—create weeks of content in hours.',
    benefits: [
      'Create content 10x faster',
      'Maintain brand consistency',
      'Scale content production',
      'Reduce writer costs',
      'SEO-optimized output',
    ],
    features: [
      'Blog post generation',
      'Ad copy creation',
      'Product descriptions',
      'Email sequences',
      'Social media posts',
      'Video scripts',
      'Brand voice training',
      'SEO optimization',
    ],
    useCases: [
      'Blog marketing',
      'E-commerce descriptions',
      'Ad campaigns',
      'Email marketing',
      'Social media',
      'Landing pages',
    ],
    integrations: ['WordPress', 'Shopify', 'HubSpot', 'Mailchimp', 'Buffer', 'Canva'],
    demoId: 'content-generator',
  },
  {
    id: 'seo_aeo',
    name: 'AI SEO & AEO',
    description: 'Search engine optimization plus Answer Engine Optimization for ChatGPT, Perplexity, and AI search.',
    icon: <SEOIcon />,
    category: 'marketing',
    highlight: 'New',
    longDescription: 'Get found on Google AND in AI search results. Our SEO & AEO services optimize your content for traditional search engines and emerging AI platforms like ChatGPT, Perplexity, and Google AI Overviews.',
    benefits: [
      'Rank in AI search results',
      'Improve organic visibility',
      'Future-proof your SEO',
      'Increase qualified traffic',
      'Competitive advantage',
    ],
    features: [
      'Keyword research',
      'On-page optimization',
      'Technical SEO audit',
      'Content optimization',
      'AI answer optimization',
      'Schema markup',
      'Link building',
      'Rank tracking',
    ],
    useCases: [
      'Brand visibility',
      'Lead generation',
      'E-commerce SEO',
      'Local SEO',
      'B2B marketing',
      'Content marketing',
    ],
    integrations: ['Ahrefs', 'SEMrush', 'Moz', 'Google Search Console', 'Screaming Frog', 'Surfer SEO'],
  },
  {
    id: 'social_automation',
    name: 'Social Media Automation',
    description: 'AI-powered posting, engagement tracking, trend analysis, and cross-platform content scheduling.',
    icon: <SocialIcon />,
    category: 'marketing',
    longDescription: 'Automate your social media presence without losing authenticity. Our AI creates, schedules, and optimizes posts across all platforms while analyzing trends and engagement.',
    benefits: [
      'Save 10+ hours per week',
      'Consistent posting schedule',
      'Trend-aware content',
      'Cross-platform management',
      'Data-driven optimization',
    ],
    features: [
      'AI content creation',
      'Multi-platform scheduling',
      'Hashtag optimization',
      'Best time posting',
      'Engagement tracking',
      'Trend analysis',
      'Competitor monitoring',
      'Performance reports',
    ],
    useCases: [
      'Brand awareness',
      'Community building',
      'Influencer coordination',
      'Product launches',
      'Event promotion',
      'Customer engagement',
    ],
    integrations: ['Instagram', 'LinkedIn', 'Twitter/X', 'Facebook', 'TikTok', 'YouTube', 'Hootsuite', 'Buffer'],
    demoId: 'social-scheduler',
  },
  {
    id: 'lead_generation',
    name: 'AI Lead Generation',
    description: 'Automated lead capture, scoring, qualification, and nurturing sequences that convert.',
    icon: <LeadGenIcon />,
    category: 'marketing',
    longDescription: 'Turn website visitors into qualified leads automatically. Our AI captures, scores, qualifies, and nurtures leads through personalized sequences until they are ready to buy.',
    benefits: [
      'Capture more leads',
      'Prioritize hot prospects',
      'Automate follow-up',
      'Increase conversion rates',
      'Shorter sales cycles',
    ],
    features: [
      'Lead capture forms',
      'AI lead scoring',
      'Qualification workflows',
      'Nurturing sequences',
      'CRM sync',
      'Intent data',
      'Enrichment',
      'Pipeline analytics',
    ],
    useCases: [
      'B2B lead gen',
      'SaaS demos',
      'Service businesses',
      'Real estate',
      'Financial services',
      'Education',
    ],
    integrations: ['HubSpot', 'Salesforce', 'Pipedrive', 'Clearbit', 'ZoomInfo', 'LinkedIn'],
  },
  {
    id: 'website_creation',
    name: 'AI-Powered Websites',
    description: 'High-converting websites with built-in AI chat, analytics, A/B testing, and conversion optimization.',
    icon: <WebsiteIcon />,
    category: 'marketing',
    longDescription: 'Launch beautiful, high-converting websites in days, not months. Our AI-powered websites come with built-in chat, analytics, A/B testing, and continuous optimization.',
    benefits: [
      'Launch in days, not months',
      'Built-in AI chat support',
      'Continuous optimization',
      'Mobile-first design',
      'SEO-ready structure',
    ],
    features: [
      'AI-assisted design',
      'Conversion optimization',
      'Built-in chatbot',
      'A/B testing',
      'Analytics dashboard',
      'Lead capture',
      'CMS integration',
      'Performance optimization',
    ],
    useCases: [
      'Business websites',
      'Landing pages',
      'E-commerce',
      'SaaS marketing',
      'Portfolio sites',
      'Lead gen pages',
    ],
    integrations: ['Webflow', 'WordPress', 'Shopify', 'Google Analytics', 'Hotjar', 'HubSpot'],
  },

  // ============ AUTOMATION & INTEGRATION ============
  {
    id: 'automation',
    name: 'Workflow Automation',
    description: 'Connect 100+ tools and automate repetitive tasks. Triggers, actions, and conditional logic without code.',
    icon: <WorkflowIcon />,
    category: 'automation',
    longDescription: 'Eliminate manual work by connecting your tools and automating workflows. No coding required—just define triggers, actions, and conditions to automate any process.',
    benefits: [
      'Save 20+ hours per week',
      'Eliminate human error',
      'Connect 100+ tools',
      'No coding required',
      'Scale operations easily',
    ],
    features: [
      'Visual workflow builder',
      'Multi-step automations',
      'Conditional logic',
      'Error handling',
      'Scheduling',
      'Webhook triggers',
      'Data transformation',
      'Audit logs',
    ],
    useCases: [
      'Lead routing',
      'Data sync',
      'Onboarding flows',
      'Reporting',
      'Inventory management',
      'HR processes',
    ],
    integrations: ['Zapier', 'Make', 'n8n', 'Slack', 'Google Workspace', 'Microsoft 365', 'Notion'],
    demoId: 'workflow-automation',
  },
  {
    id: 'crm_automation',
    name: 'CRM Automation',
    description: 'Automated data entry, lead routing, follow-up sequences, and pipeline management for Salesforce, HubSpot, and more.',
    icon: <CRMIcon />,
    category: 'automation',
    longDescription: 'Keep your CRM clean and your pipeline moving. Automate data entry, lead routing, follow-ups, and reporting so your sales team can focus on closing.',
    benefits: [
      'Clean CRM data',
      'Faster lead response',
      'Automated follow-ups',
      'Better pipeline visibility',
      'More selling time',
    ],
    features: [
      'Auto data entry',
      'Lead enrichment',
      'Round-robin routing',
      'Follow-up sequences',
      'Deal stage automation',
      'Activity logging',
      'Duplicate detection',
      'Pipeline reports',
    ],
    useCases: [
      'Sales automation',
      'Lead management',
      'Account management',
      'Customer success',
      'Partner management',
      'Territory management',
    ],
    integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM', 'Monday.com', 'Copper'],
  },
  {
    id: 'integrations',
    name: 'API Integrations',
    description: 'Connect your existing tools with custom API integrations, webhooks, and data synchronization.',
    icon: <IntegrationIcon />,
    category: 'automation',
    longDescription: 'Build custom integrations between any tools in your stack. Our team develops robust API connections, webhooks, and data pipelines to unify your systems.',
    benefits: [
      'Connect any system',
      'Real-time data sync',
      'Eliminate manual work',
      'Unified data view',
      'Custom solutions',
    ],
    features: [
      'Custom API development',
      'Webhook management',
      'Data mapping',
      'Error handling',
      'Rate limiting',
      'Authentication',
      'Logging & monitoring',
      'Documentation',
    ],
    useCases: [
      'System integration',
      'Data migration',
      'Third-party connections',
      'Custom workflows',
      'Legacy system bridges',
      'Real-time sync',
    ],
    integrations: ['REST APIs', 'GraphQL', 'Webhooks', 'OAuth', 'AWS', 'Google Cloud'],
  },
  {
    id: 'model',
    name: 'Custom AI Models',
    description: 'Fine-tuned LLMs trained on your data for specialized tasks, brand voice, and domain expertise.',
    icon: <ModelIcon />,
    category: 'automation',
    longDescription: 'Go beyond generic AI with models trained specifically on your data. Fine-tuned LLMs that understand your industry, speak your brand voice, and excel at your unique tasks.',
    benefits: [
      'Domain-specific accuracy',
      'Consistent brand voice',
      'Proprietary advantage',
      'Better task performance',
      'Data privacy control',
    ],
    features: [
      'LLM fine-tuning',
      'RAG implementation',
      'Knowledge base training',
      'Prompt engineering',
      'Model evaluation',
      'Continuous learning',
      'Version management',
      'Performance monitoring',
    ],
    useCases: [
      'Industry expertise',
      'Brand voice',
      'Technical support',
      'Document analysis',
      'Code generation',
      'Content creation',
    ],
    integrations: ['OpenAI', 'Anthropic', 'Google Vertex AI', 'AWS Bedrock', 'Hugging Face', 'Pinecone'],
  },
  {
    id: 'data_analytics',
    name: 'AI Data Analytics',
    description: 'Automated data processing, predictive analytics, and real-time insights from your business data.',
    icon: <DataIcon />,
    category: 'automation',
    longDescription: 'Transform raw data into actionable insights with AI-powered analytics. Automate data processing, discover patterns, and predict trends to drive better business decisions.',
    benefits: [
      'Faster insights',
      'Predictive capabilities',
      'Automated reporting',
      'Data-driven decisions',
      'Competitive intelligence',
    ],
    features: [
      'Data processing',
      'Predictive modeling',
      'Anomaly detection',
      'Trend analysis',
      'Natural language queries',
      'Automated reports',
      'Data visualization',
      'Alert systems',
    ],
    useCases: [
      'Sales forecasting',
      'Customer analytics',
      'Operational efficiency',
      'Risk assessment',
      'Market analysis',
      'Performance tracking',
    ],
    integrations: ['Snowflake', 'BigQuery', 'Tableau', 'Power BI', 'Looker', 'Databricks'],
    demoId: 'data-analytics',
  },
  {
    id: 'business_intelligence',
    name: 'Business Intelligence',
    description: 'Automated reporting dashboards, KPI tracking, market research, and competitor analysis.',
    icon: <ReportIcon />,
    category: 'automation',
    longDescription: 'Get the insights you need without the manual work. AI-powered BI that automatically generates reports, tracks KPIs, monitors competitors, and surfaces opportunities.',
    benefits: [
      'Automated reporting',
      'Real-time KPI tracking',
      'Competitive insights',
      'Market intelligence',
      'Strategic planning',
    ],
    features: [
      'Dashboard creation',
      'KPI monitoring',
      'Competitor tracking',
      'Market research',
      'Trend identification',
      'Executive summaries',
      'Custom alerts',
      'Data storytelling',
    ],
    useCases: [
      'Executive reporting',
      'Sales analytics',
      'Marketing performance',
      'Financial analysis',
      'Competitive analysis',
      'Strategic planning',
    ],
    integrations: ['Salesforce', 'HubSpot', 'Google Analytics', 'Mixpanel', 'Amplitude', 'Stripe'],
  },

  // ============ CONSULTING & STRATEGY ============
  {
    id: 'ai_consulting',
    name: 'AI Strategy Consulting',
    description: 'Expert guidance on AI adoption, roadmap planning, vendor selection, and implementation strategy.',
    icon: <ConsultingIcon />,
    category: 'consulting',
    longDescription: 'Navigate AI adoption with expert guidance. Our consultants help you identify opportunities, evaluate solutions, build roadmaps, and implement AI successfully.',
    benefits: [
      'Expert AI guidance',
      'Avoid costly mistakes',
      'Faster implementation',
      'ROI-focused approach',
      'Change management support',
    ],
    features: [
      'AI readiness assessment',
      'Opportunity identification',
      'Roadmap development',
      'Vendor evaluation',
      'Business case building',
      'Implementation planning',
      'Risk assessment',
      'Change management',
    ],
    useCases: [
      'AI strategy development',
      'Digital transformation',
      'Process automation',
      'Technology selection',
      'Team building',
      'AI governance',
    ],
    integrations: [],
  },
  {
    id: 'ai_audit',
    name: 'AI Audit & Assessment',
    description: 'Comprehensive evaluation of your current processes to identify high-impact AI automation opportunities.',
    icon: <AnalyticsIcon />,
    category: 'consulting',
    longDescription: 'Discover where AI can have the biggest impact in your organization. Our comprehensive audit evaluates your processes, data, and infrastructure to identify and prioritize automation opportunities.',
    benefits: [
      'Find quick wins',
      'Prioritize investments',
      'Understand readiness',
      'Build business cases',
      'Roadmap development',
    ],
    features: [
      'Process analysis',
      'Data assessment',
      'Technology review',
      'Opportunity scoring',
      'ROI estimation',
      'Readiness evaluation',
      'Recommendation report',
      'Implementation roadmap',
    ],
    useCases: [
      'Pre-implementation review',
      'Digital maturity assessment',
      'Process optimization',
      'Cost reduction analysis',
      'Competitive analysis',
      'Compliance review',
    ],
    integrations: [],
  },
  {
    id: 'ai_training',
    name: 'AI Training & Workshops',
    description: 'Team training on AI tools, prompt engineering, and best practices for AI-powered workflows.',
    icon: <TrainingIcon />,
    category: 'consulting',
    longDescription: 'Empower your team to leverage AI effectively. Our training programs cover AI fundamentals, prompt engineering, tool mastery, and best practices for AI-augmented work.',
    benefits: [
      'Team AI fluency',
      'Improved productivity',
      'Better AI adoption',
      'Reduced resistance',
      'Internal champions',
    ],
    features: [
      'AI fundamentals',
      'Prompt engineering',
      'Tool-specific training',
      'Hands-on workshops',
      'Use case development',
      'Best practices',
      'Certification paths',
      'Ongoing support',
    ],
    useCases: [
      'Team enablement',
      'Leadership education',
      'Department rollouts',
      'New hire training',
      'Power user development',
      'AI champions program',
    ],
    integrations: [],
  },

  // ============ HIDDEN/OTHER ============
  {
    id: 'external_website',
    name: 'Instant Website Builder',
    description: 'Launch a professional website in minutes with our AI-powered website builder.',
    icon: <WebsiteIcon />,
    externalUrl: 'https://megan-ai-theta.vercel.app/',
    category: 'other',
  },
  {
    id: 'snake',
    name: 'Just for Fun: Snake',
    description: 'Take a break and play a classic game of Snake.',
    icon: <GameIcon />,
    category: 'other',
  },
];

const GENERAL_QUESTIONS: Question[] = [
  {
    text: "First, could you describe your business or industry? This helps us understand your unique landscape.",
    options: ["E-commerce", "SaaS / Technology", "Healthcare", "Finance & Fintech", "Education", "Other"]
  },
  {
    text: "What specific challenge or opportunity are you hoping to address with AI?",
    options: ["Improve Customer Support", "Automate Content Creation", "Streamline Business Processes", "Data Analysis & Insights", "Lead Generation & Sales", "Other"]
  },
  {
    text: "What does a successful outcome look like for you?",
    options: ["Increase Revenue", "Reduce Operational Costs", "Improve Team Efficiency", "Enhance Customer Satisfaction", "Gain a Competitive Edge", "Other"]
  },
  {
    text: "What's your current experience level with AI solutions?",
    options: ["Just starting to explore", "We use some basic AI tools", "We have an in-house team", "Actively researching vendors", "Other"]
  },
  {
    text: "Finally, what is your estimated budget and timeline for this project? This helps us scope the solution.",
    options: ["<$5k, 1-3 months", "$5k-$15k, 1-3 months", "$15k-$50k, 3-6 months", ">$50k, 6+ months", "Flexible / Undecided"]
  }
];

const WEBSITE_QUESTIONS: Question[] = [
  {
    text: "Let's build your presence. What is your brand name?",
    options: []
  },
  {
    text: "What is your specific niche or industry?",
    options: []
  },
  {
    text: "Which color palette fits your brand best?",
    options: [
        "Midnight: Navy Blue, Electric Cyan, Slate Grey",
        "Creative: Deep Purple, Vivid Magenta, Gold",
        "Nature: Forest Green, Emerald, Warm Sand"
    ]
  },
  {
    text: "Do you have any specific color suggestions or hex codes in mind?",
    options: []
  },
  {
    text: "What is the primary goal of your website? (e.g., Sell products, Professional Portfolio, Informational Blog)",
    options: ["E-commerce", "Portfolio", "Landing Page", "Lead Generation", "Corporate Site"]
  }
];

export const QUESTIONS: Record<string, Question[]> = {
  chatbot: GENERAL_QUESTIONS,
  content: GENERAL_QUESTIONS,
  automation: GENERAL_QUESTIONS,
  model: GENERAL_QUESTIONS,
  website_creation: WEBSITE_QUESTIONS,
  whatsapp_bot: [
    {
      text: "What type of business do you operate?",
      options: ["E-commerce", "Service Business", "Restaurant/Food", "Healthcare", "Real Estate", "Other"]
    },
    {
      text: "What's the primary use case for your WhatsApp bot?",
      options: ["Customer Support", "Lead Qualification", "Order Taking", "Appointment Booking", "FAQ Automation", "All of the above"]
    },
    {
      text: "Do you need integration with existing systems (CRM, POS, etc.)?",
      options: ["Yes, CRM", "Yes, POS", "Yes, Booking System", "No, standalone is fine", "Not sure yet"]
    },
    {
      text: "What is your estimated monthly message volume?",
      options: ["< 1,000", "1,000 - 10,000", "10,000 - 50,000", "50,000+", "Not sure"]
    }
  ],
};

export const BUSINESS_PLAN_QUESTIONS: string[] = [
  "What industry or market will your business operate in? (e.g., 'Gourmet Coffee Shops', 'Sustainable Fashion E-commerce')",
  "Describe the primary product or service you will offer. What makes it unique?",
  "Who is your target customer? Be as specific as possible. (e.g., 'Urban professionals aged 25-40', 'Eco-conscious families')",
  "What is the primary goal of your business for the first year? (e.g., 'Reach $100k in revenue', 'Acquire 1,000 paying customers')",
  "What is your proposed business name? (This will be used to personalize your plan)"
];

// ===== RESTAURANT MENU (for demo) =====
export const SAMPLE_MENU = {
  categories: [
    {
      name: 'Starters',
      items: [
        { id: 's1', name: 'Garlic Bread', price: 5.99, description: 'Crispy bread with garlic butter' },
        { id: 's2', name: 'Caesar Salad', price: 8.99, description: 'Fresh romaine with caesar dressing' },
        { id: 's3', name: 'Soup of the Day', price: 6.99, description: 'Ask about today\'s special' },
      ]
    },
    {
      name: 'Main Courses',
      items: [
        { id: 'm1', name: 'Grilled Salmon', price: 22.99, description: 'Atlantic salmon with seasonal vegetables' },
        { id: 'm2', name: 'Chicken Parmesan', price: 18.99, description: 'Breaded chicken with marinara sauce' },
        { id: 'm3', name: 'Beef Burger', price: 15.99, description: 'Angus beef with all the fixings' },
        { id: 'm4', name: 'Pasta Primavera', price: 14.99, description: 'Fresh vegetables in creamy sauce' },
      ]
    },
    {
      name: 'Desserts',
      items: [
        { id: 'd1', name: 'Chocolate Cake', price: 7.99, description: 'Rich chocolate layer cake' },
        { id: 'd2', name: 'Cheesecake', price: 8.99, description: 'New York style cheesecake' },
        { id: 'd3', name: 'Ice Cream', price: 5.99, description: 'Three scoops of your choice' },
      ]
    }
  ]
};

// ===== SAMPLE SERVICES (for Salon demo) =====
export const SALON_SERVICES = [
  { id: 'haircut', name: 'Haircut', duration: 30, price: 35 },
  { id: 'coloring', name: 'Hair Coloring', duration: 90, price: 85 },
  { id: 'styling', name: 'Styling', duration: 45, price: 50 },
  { id: 'manicure', name: 'Manicure', duration: 30, price: 25 },
  { id: 'pedicure', name: 'Pedicure', duration: 45, price: 35 },
  { id: 'facial', name: 'Facial Treatment', duration: 60, price: 65 },
];

// ===== SAMPLE DOCTORS (for Clinic demo) =====
export const CLINIC_DOCTORS = [
  { id: 'dr1', name: 'Dr. Sarah Johnson', specialty: 'General Practice', available: ['Mon', 'Wed', 'Fri'] },
  { id: 'dr2', name: 'Dr. Michael Chen', specialty: 'Pediatrics', available: ['Tue', 'Thu', 'Sat'] },
  { id: 'dr3', name: 'Dr. Emily Williams', specialty: 'Dermatology', available: ['Mon', 'Tue', 'Wed'] },
  { id: 'dr4', name: 'Dr. James Brown', specialty: 'Cardiology', available: ['Wed', 'Thu', 'Fri'] },
];

// ===== SAMPLE VEHICLES (for Dealership demo) =====
export const DEALERSHIP_VEHICLES = [
  { id: 'v1', make: 'Toyota', model: 'Camry', year: 2024, price: 28500, type: 'Sedan', available: true },
  { id: 'v2', make: 'Honda', model: 'CR-V', year: 2024, price: 32000, type: 'SUV', available: true },
  { id: 'v3', make: 'Ford', model: 'F-150', year: 2024, price: 45000, type: 'Truck', available: true },
  { id: 'v4', make: 'Tesla', model: 'Model 3', year: 2024, price: 42000, type: 'Electric', available: false },
  { id: 'v5', make: 'BMW', model: 'X5', year: 2024, price: 65000, type: 'Luxury SUV', available: true },
];

export const INDUSTRY_AGENTS: IndustryAgent[] = [
  {
    id: 'clinic',
    name: 'Clinic Agent',
    industry: 'Healthcare',
    description: 'Automated patient scheduling, triage, and FAQs for medical clinics.',
    icon: <ClinicIcon className="w-8 h-8 text-rose-400" />,
    features: ['Appointment Booking', 'Symptom Triage', 'Patient FAQs', 'Prescription Refills'],
    demoAvailable: true
  },
  {
    id: 'construction',
    name: 'Construction Agent',
    industry: 'Construction',
    description: 'Project management, safety compliance, and resource allocation assistant.',
    icon: <ConstructionIcon className="w-8 h-8 text-amber-400" />,
    features: ['Project Tracking', 'Safety Checklists', 'Resource Management', 'Daily Reports'],
    demoAvailable: true
  },
  {
    id: 'dealership',
    name: 'Dealership Agent',
    industry: 'Automotive',
    description: 'Vehicle inventory, test drive scheduling, and service appointments.',
    icon: <DealershipIcon className="w-8 h-8 text-blue-400" />,
    features: ['Inventory Search', 'Test Drive Booking', 'Service Scheduling', 'Financing Calc'],
    demoAvailable: true
  },
  {
    id: 'restaurant',
    name: 'Restaurant Agent',
    industry: 'Hospitality',
    description: 'Table reservations, menu inquiries, and order management.',
    icon: <RestaurantIcon className="w-8 h-8 text-emerald-400" />,
    features: ['Table Reservations', 'Menu Q&A', 'Order Taking', 'Event Booking'],
    demoAvailable: true
  },
  {
    id: 'salon',
    name: 'Salon Agent',
    industry: 'Beauty & Wellness',
    description: 'Appointment booking, stylist selection, and service consultations.',
    icon: <SalonIcon className="w-8 h-8 text-purple-400" />,
    features: ['Appointment Booking', 'Stylist Selection', 'Service Menu', 'Reminders'],
    demoAvailable: true
  },
  {
    id: 'real_estate',
    name: 'Real Estate Agent',
    industry: 'Real Estate',
    description: 'Lead qualification, property viewings, and listing inquiries.',
    icon: <RealEstateIcon className="w-8 h-8 text-indigo-400" />,
    features: ['Lead Qualification', 'Schedule Viewings', 'Property Search', 'Mortgage Calc'],
    demoAvailable: true
  },
  {
    id: 'legal',
    name: 'Legal Intake Agent',
    industry: 'Legal',
    description: 'Client intake, case screening, and consultation scheduling.',
    icon: <LegalIcon className="w-8 h-8 text-slate-400" />,
    features: ['Case Screening', 'Client Intake', 'FAQ Automation', 'Consultation Booking'],
    demoAvailable: true
  },
  {
    id: 'ecommerce',
    name: 'E-commerce Support',
    industry: 'Retail',
    description: 'Order tracking, product recommendations, and returns processing.',
    icon: <EcommerceIcon className="w-8 h-8 text-pink-400" />,
    features: ['Order Tracking', 'Product Recommender', 'Returns & Refunds', '24/7 Support'],
    demoAvailable: true
  },
  {
    id: 'education',
    name: 'Education Agent',
    industry: 'Education',
    description: 'Student enrollment, course inquiries, and campus support.',
    icon: <EducationIcon className="w-8 h-8 text-yellow-400" />,
    features: ['Course Info', 'Enrollment Help', 'Student Support', 'Campus Guide'],
    demoAvailable: true
  },
  {
    id: 'recruitment',
    name: 'Recruitment Agent',
    industry: 'HR & Staffing',
    description: 'Candidate screening, interview scheduling, and job FAQs.',
    icon: <RecruitmentIcon className="w-8 h-8 text-cyan-400" />,
    features: ['Resume Screening', 'Interview Scheduling', 'Job FAQs', 'Application Status'],
    demoAvailable: true
  }
];
