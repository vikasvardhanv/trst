import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, Send, Bot, User, RefreshCw, Loader2
} from 'lucide-react';
import { generateAgentResponse } from '../../services/geminiService';

// API URL for leads proxy
const API_URL = import.meta.env.VITE_API_URL || '/api';

interface LeadGenAgentProps {
  onBack: () => void;
  onRestart: () => void;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  actions?: { label: string; action: string; data?: any }[];
  leads?: Lead[];
}

interface Lead {
  id: string;
  name: string;
  address?: string;
  industry: string;
  location: string;
  phone?: string;
  email?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  description?: string;
  place_id?: string;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
}

interface LeadCriteria {
  industry: string;
  location: string;
  radius?: number;
}

// Sample leads database for demo
const SAMPLE_LEADS: Record<string, Lead[]> = {
  'restaurants': [
    { id: '1', name: 'The Golden Fork', industry: 'Restaurant', location: 'San Francisco, CA', phone: '(415) 555-0101', website: 'goldenfork.com', rating: 4.5, description: 'Fine dining restaurant, 50+ employees', status: 'new' },
    { id: '2', name: 'Bella Italia', industry: 'Restaurant', location: 'San Francisco, CA', phone: '(415) 555-0102', website: 'bellaitalia.com', rating: 4.3, description: 'Italian cuisine, family-owned', status: 'new' },
    { id: '3', name: 'Sushi Master', industry: 'Restaurant', location: 'San Francisco, CA', phone: '(415) 555-0103', website: 'sushimaster.com', rating: 4.7, description: 'Japanese restaurant, 3 locations', status: 'new' },
    { id: '4', name: 'Taco Paradise', industry: 'Restaurant', location: 'San Francisco, CA', phone: '(415) 555-0104', website: 'tacoparadise.com', rating: 4.2, description: 'Mexican fast-casual', status: 'new' },
    { id: '5', name: 'The Breakfast Club', industry: 'Restaurant', location: 'San Francisco, CA', phone: '(415) 555-0105', website: 'breakfastclub.com', rating: 4.6, description: 'Brunch spot, high traffic weekends', status: 'new' },
  ],
  'real estate': [
    { id: '6', name: 'Bay Area Realty', industry: 'Real Estate', location: 'San Francisco, CA', phone: '(415) 555-0201', email: 'info@bayarearealty.com', website: 'bayarearealty.com', rating: 4.8, description: 'Luxury homes specialist', status: 'new' },
    { id: '7', name: 'Golden Gate Properties', industry: 'Real Estate', location: 'San Francisco, CA', phone: '(415) 555-0202', email: 'contact@ggproperties.com', website: 'ggproperties.com', rating: 4.5, description: 'Commercial & residential', status: 'new' },
    { id: '8', name: 'SF Home Finders', industry: 'Real Estate', location: 'San Francisco, CA', phone: '(415) 555-0203', email: 'team@sfhomefinders.com', website: 'sfhomefinders.com', rating: 4.4, description: 'First-time buyers specialist', status: 'new' },
  ],
  'dentists': [
    { id: '9', name: 'Smile Dental Care', industry: 'Dental', location: 'San Francisco, CA', phone: '(415) 555-0301', website: 'smiledentalcare.com', rating: 4.9, description: 'General & cosmetic dentistry', status: 'new' },
    { id: '10', name: 'Bay Dental Group', industry: 'Dental', location: 'San Francisco, CA', phone: '(415) 555-0302', website: 'baydentalgroup.com', rating: 4.6, description: 'Multi-location practice', status: 'new' },
    { id: '11', name: 'Family Dentistry Plus', industry: 'Dental', location: 'San Francisco, CA', phone: '(415) 555-0303', website: 'familydentistryplus.com', rating: 4.7, description: 'Pediatric & family focus', status: 'new' },
  ],
  'gyms': [
    { id: '12', name: 'FitLife Gym', industry: 'Fitness', location: 'San Francisco, CA', phone: '(415) 555-0401', website: 'fitlifegym.com', rating: 4.4, description: '24/7 access, 2000+ members', status: 'new' },
    { id: '13', name: 'CrossFit Bay', industry: 'Fitness', location: 'San Francisco, CA', phone: '(415) 555-0402', website: 'crossfitbay.com', rating: 4.8, description: 'CrossFit affiliate, group classes', status: 'new' },
    { id: '14', name: 'Yoga & Wellness Center', industry: 'Fitness', location: 'San Francisco, CA', phone: '(415) 555-0403', website: 'yogawellnesssf.com', rating: 4.7, description: 'Yoga, pilates, meditation', status: 'new' },
  ],
  'salons': [
    { id: '15', name: 'Glamour Hair Studio', industry: 'Salon', location: 'San Francisco, CA', phone: '(415) 555-0501', website: 'glamourhairstudio.com', rating: 4.6, description: 'Full-service salon, 10 stylists', status: 'new' },
    { id: '16', name: 'The Beauty Bar', industry: 'Salon', location: 'San Francisco, CA', phone: '(415) 555-0502', website: 'thebeautybar.com', rating: 4.5, description: 'Hair, nails, spa services', status: 'new' },
  ],
  'lawyers': [
    { id: '17', name: 'Bay Legal Partners', industry: 'Legal', location: 'San Francisco, CA', phone: '(415) 555-0601', email: 'info@baylegal.com', website: 'baylegal.com', rating: 4.7, description: 'Business & corporate law', status: 'new' },
    { id: '18', name: 'SF Immigration Law', industry: 'Legal', location: 'San Francisco, CA', phone: '(415) 555-0602', email: 'help@sfimmigration.com', website: 'sfimmigrationlaw.com', rating: 4.8, description: 'Immigration specialists', status: 'new' },
  ],
};

const industryPresets = [
  { label: 'Restaurants', query: 'restaurants', icon: '🍽️' },
  { label: 'Real Estate', query: 'real estate', icon: '🏠' },
  { label: 'Dentists', query: 'dentists', icon: '🦷' },
  { label: 'Gyms', query: 'gyms', icon: '💪' },
  { label: 'Salons', query: 'salons', icon: '💇' },
  { label: 'Lawyers', query: 'lawyers', icon: '⚖️' },
];

export const LeadGenAgent: React.FC<LeadGenAgentProps> = ({ onBack, onRestart }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Welcome to AI Lead Generator! 🎯 I can help you find and qualify business leads. I can assist with:\n\n• Finding leads by industry & location\n• Qualifying and scoring leads\n• Creating outreach templates\n• Building email campaigns\n• Exporting lead lists\n\nWhat type of businesses are you looking for?",
      timestamp: new Date(),
      actions: [
        { label: '🍽️ Restaurants', action: 'search_leads', data: { industry: 'restaurants' } },
        { label: '🏠 Real Estate', action: 'search_leads', data: { industry: 'real estate' } },
        { label: '🦷 Dentists', action: 'search_leads', data: { industry: 'dentists' } },
        { label: '💪 Gyms', action: 'search_leads', data: { industry: 'gyms' } },
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentLeads, setCurrentLeads] = useState<Lead[]>([]);
  const [leadCriteria, setLeadCriteria] = useState<LeadCriteria>({ industry: '', location: '', radius: 32000 });
  const [sheetUrl, setSheetUrl] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (sender: 'user' | 'bot', text: string, actions?: Message['actions'], leads?: Lead[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      sender,
      text,
      timestamp: new Date(),
      actions,
      leads
    }]);
  };

  // Fetch leads from backend API (which proxies to Modal)
  const fetchLeadsFromAPI = async (query: string, location: string, radius: number = 32000): Promise<Lead[]> => {
    try {
      const response = await fetch(`${API_URL}/leads/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          location: location.trim(),
          radius,
          limit: 20,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.leads && Array.isArray(data.leads)) {
        // Save sheet URL if available
        if (data.sheet_url) {
          setSheetUrl(data.sheet_url);
        }
        
        // Transform API leads to our format
        return data.leads.map((lead: any, idx: number) => ({
          id: lead.place_id || `lead-${idx}`,
          name: lead.name,
          address: lead.address,
          industry: query,
          location: location,
          phone: lead.phone,
          website: lead.website,
          rating: lead.rating,
          reviews: lead.reviews,
          description: lead.types?.join(', ') || lead.business_status,
          place_id: lead.place_id,
          status: 'new' as const,
        }));
      }
      
      return [];
    } catch (error) {
      console.error('API fetch error:', error);
      throw error;
    }
  };

  // Fallback to sample data if API fails
  const searchLeads = (industry: string, location: string = 'San Francisco, CA') => {
    const industryKey = industry.toLowerCase();
    let leads: Lead[] = [];
    
    // Find matching leads from sample database
    Object.keys(SAMPLE_LEADS).forEach(key => {
      if (key.includes(industryKey) || industryKey.includes(key)) {
        leads = [...leads, ...SAMPLE_LEADS[key]];
      }
    });

    // If no exact match, return a mix
    if (leads.length === 0) {
      leads = Object.values(SAMPLE_LEADS).flat().slice(0, 5);
    }

    // Update location in leads
    leads = leads.map(lead => ({ ...lead, location }));
    
    return leads;
  };

  const handleAction = async (action: string, data?: any) => {
    switch (action) {
      case 'search_leads':
        const industry = data?.industry || leadCriteria.industry;
        const location = data?.location || 'Westmont, Chicago, IL';
        const radius = data?.radius || 32000; // ~20 miles
        setLeadCriteria({ industry, location, radius });
        
        // Show searching message
        addMessage('bot', `🔍 Searching for **${industry}** in **${location}**...\n\n_Fetching real-time data from Google Maps..._`);
        setIsLoading(true);
        
        try {
          // Try to fetch from real API
          const apiLeads = await fetchLeadsFromAPI(industry, location, radius);
          
          if (apiLeads.length > 0) {
            setCurrentLeads(apiLeads);
            
            let leadsText = `✅ **Found ${apiLeads.length} leads for "${industry}" in ${location}:**\n\n`;
            apiLeads.forEach((lead, idx) => {
              leadsText += `**${idx + 1}. ${lead.name}**\n`;
              if (lead.address) leadsText += `   📍 ${lead.address}\n`;
              if (lead.phone) leadsText += `   📞 ${lead.phone}\n`;
              if (lead.website) leadsText += `   🌐 ${lead.website}\n`;
              if (lead.rating) leadsText += `   ⭐ ${lead.rating}/5${lead.reviews ? ` (${lead.reviews} reviews)` : ''}\n`;
              leadsText += '\n';
            });
            leadsText += `What would you like to do with these leads?`;
            
            // Remove the searching message and add results
            setMessages(prev => prev.slice(0, -1));
            addMessage('bot', leadsText, [
              { label: '📧 Create Email Template', action: 'create_email' },
              { label: '📊 Score Leads', action: 'score_leads' },
              { label: '📥 Export to CSV', action: 'export_leads' },
              { label: '🔄 New Search', action: 'new_search' },
            ], apiLeads);
          } else {
            // No leads found
            setMessages(prev => prev.slice(0, -1));
            addMessage('bot', `❌ No leads found for "${industry}" in ${location}. Try:\n\n• A different industry\n• A broader location\n• Increasing the search radius`, [
              { label: '🔄 Try Again', action: 'new_search' },
            ]);
          }
        } catch (error) {
          console.error('API error, falling back to sample data:', error);
          // Fallback to sample data
          const fallbackLeads = searchLeads(industry, location);
          setCurrentLeads(fallbackLeads);
          
          let leadsText = `⚠️ **Using demo data** (API temporarily unavailable)\n\n🔍 **Found ${fallbackLeads.length} sample leads for "${industry}":**\n\n`;
          fallbackLeads.forEach((lead, idx) => {
            leadsText += `**${idx + 1}. ${lead.name}**\n`;
            leadsText += `   📍 ${lead.location}\n`;
            if (lead.phone) leadsText += `   📞 ${lead.phone}\n`;
            if (lead.rating) leadsText += `   ⭐ ${lead.rating}/5\n`;
            if (lead.description) leadsText += `   💼 ${lead.description}\n`;
            leadsText += '\n';
          });
          leadsText += `What would you like to do with these leads?`;
          
          setMessages(prev => prev.slice(0, -1));
          addMessage('bot', leadsText, [
            { label: '📧 Create Email Template', action: 'create_email' },
            { label: '📊 Score Leads', action: 'score_leads' },
            { label: '📥 Export to CSV', action: 'export_leads' },
            { label: '🔄 New Search', action: 'new_search' },
          ], fallbackLeads);
        } finally {
          setIsLoading(false);
        }
        break;

      case 'create_email':
        if (currentLeads.length === 0) {
          addMessage('bot', "You don't have any leads yet. Let's find some first!", [
            { label: 'Search Leads', action: 'new_search' },
          ]);
          return;
        }
        const emailTemplate = `📧 **Email Template for ${leadCriteria.industry} Outreach:**\n\n---\n\n**Subject:** Grow Your ${leadCriteria.industry} Business with AI Automation\n\nHi [Name],\n\nI noticed [Company Name] has been serving ${leadCriteria.location} and wanted to reach out.\n\nWe help ${leadCriteria.industry} businesses:\n• Save 10+ hours/week on repetitive tasks\n• Increase customer engagement by 40%\n• Automate booking & follow-ups\n\nWould you be open to a quick 15-minute call this week?\n\nBest regards,\n[Your Name]\n\n---\n\n*This template can be personalized for each lead automatically.*`;
        
        addMessage('bot', emailTemplate, [
          { label: '📋 Copy Template', action: 'copy_template', data: emailTemplate },
          { label: '✉️ Send to All Leads', action: 'send_campaign' },
          { label: '✏️ Customize More', action: 'customize_email' },
        ]);
        break;

      case 'score_leads':
        if (currentLeads.length === 0) {
          addMessage('bot', "You don't have any leads to score. Let's find some first!", [
            { label: 'Search Leads', action: 'new_search' },
          ]);
          return;
        }
        let scoredText = `📊 **Lead Scoring Results:**\n\n`;
        currentLeads.forEach((lead) => {
          const score = Math.floor(Math.random() * 30) + 70; // Random score 70-100 for demo
          const grade = score >= 90 ? 'A' : score >= 80 ? 'B' : 'C';
          const emoji = score >= 90 ? '🔥' : score >= 80 ? '✅' : '📌';
          scoredText += `${emoji} **${lead.name}** - Score: ${score}/100 (Grade ${grade})\n`;
          scoredText += `   ${lead.description || 'Local business'}\n\n`;
        });
        scoredText += `\n💡 **Tip:** Focus on A-grade leads first for highest conversion rates.`;
        
        addMessage('bot', scoredText, [
          { label: '📧 Email High-Score Leads', action: 'create_email' },
          { label: '📥 Export Scored List', action: 'export_leads' },
        ]);
        break;

      case 'export_leads':
        if (currentLeads.length === 0) {
          addMessage('bot', "You don't have any leads to export. Let's find some first!", [
            { label: 'Search Leads', action: 'new_search' },
          ]);
          return;
        }
        
        // Generate CSV
        const csvContent = [
          ['Name', 'Industry', 'Location', 'Phone', 'Website', 'Rating', 'Description'].join(','),
          ...currentLeads.map(lead => [
            `"${lead.name}"`,
            `"${lead.industry}"`,
            `"${lead.location}"`,
            lead.phone || '',
            lead.website || '',
            lead.rating || '',
            `"${lead.description || ''}"`
          ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${leadCriteria.industry.replace(/\s+/g, '_')}_${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        addMessage('bot', `✅ **CSV Downloaded!**\n\nExported ${currentLeads.length} leads to your downloads folder.\n\n📁 File: leads_${leadCriteria.industry.replace(/\s+/g, '_')}.csv\n\nYou can import this into:\n• HubSpot\n• Salesforce\n• Google Sheets\n• Any CRM`, [
          { label: '🔄 New Search', action: 'new_search' },
          { label: '📧 Create Email Campaign', action: 'create_email' },
        ]);
        break;

      case 'new_search':
        setCurrentLeads([]);
        setLeadCriteria({ industry: '', location: '' });
        addMessage('bot', "Let's find more leads! 🎯\n\nWhat industry are you targeting?", [
          { label: '🍽️ Restaurants', action: 'search_leads', data: { industry: 'restaurants' } },
          { label: '🏠 Real Estate', action: 'search_leads', data: { industry: 'real estate' } },
          { label: '🦷 Dentists', action: 'search_leads', data: { industry: 'dentists' } },
          { label: '💪 Gyms', action: 'search_leads', data: { industry: 'gyms' } },
          { label: '💇 Salons', action: 'search_leads', data: { industry: 'salons' } },
          { label: '⚖️ Lawyers', action: 'search_leads', data: { industry: 'lawyers' } },
        ]);
        break;

      case 'send_campaign':
        addMessage('bot', `🚀 **Email Campaign Ready!**\n\nTo send emails to ${currentLeads.length} leads:\n\n1. Connect your email service (Gmail, Outlook, SendGrid)\n2. Customize the template for each lead\n3. Schedule or send immediately\n\n📧 **Preview Recipients:**\n${currentLeads.slice(0, 3).map(l => `• ${l.name}`).join('\n')}\n${currentLeads.length > 3 ? `...and ${currentLeads.length - 3} more` : ''}\n\n*In production, this would integrate with your email service.*`, [
          { label: '✅ Confirm Send', action: 'confirm_send' },
          { label: '✏️ Edit Template', action: 'create_email' },
        ]);
        break;

      case 'confirm_send':
        addMessage('bot', `✅ **Campaign Scheduled!**\n\n📬 ${currentLeads.length} emails queued for delivery\n⏰ Estimated completion: 2-3 minutes\n📊 Track opens and clicks in your dashboard\n\n*This is a demo. In production, emails would be sent via your connected email service.*`, [
          { label: '📊 View Dashboard', action: 'view_dashboard' },
          { label: '🔄 New Search', action: 'new_search' },
        ]);
        break;

      case 'view_dashboard':
        addMessage('bot', `📊 **Campaign Dashboard (Demo)**\n\n📧 **Emails Sent:** ${currentLeads.length}\n📬 **Delivered:** ${currentLeads.length}\n👀 **Opens:** ${Math.floor(currentLeads.length * 0.45)} (45%)\n🖱️ **Clicks:** ${Math.floor(currentLeads.length * 0.12)} (12%)\n↩️ **Replies:** ${Math.floor(currentLeads.length * 0.08)} (8%)\n\n🏆 **Top Performers:**\n${currentLeads.slice(0, 2).map(l => `• ${l.name} - Opened, Clicked`).join('\n')}\n\n*Real-time tracking available with full integration.*`, [
          { label: '🔄 New Campaign', action: 'new_search' },
          { label: '📧 Follow-up Emails', action: 'create_email' },
        ]);
        break;

      case 'copy_template':
        navigator.clipboard.writeText(data.replace(/\*\*/g, '').replace(/---/g, '').trim());
        addMessage('bot', "✅ Template copied to clipboard!", [
          { label: '✉️ Send to All Leads', action: 'send_campaign' },
          { label: '🔄 New Search', action: 'new_search' },
        ]);
        break;

      case 'customize_email':
        addMessage('bot', "Tell me how you'd like to customize the email template. For example:\n\n• Change the tone (more formal/casual)\n• Add specific value propositions\n• Include a special offer\n• Modify the call-to-action");
        break;

      default:
        break;
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      // Check if user is searching for leads - parse industry, location, and radius
      const industryMatch = userMessage.toLowerCase().match(/(restaurants?|real estate|dentists?|gyms?|salons?|lawyers?|fitness|dental|legal|clinics?|doctors?|plumbers?|electricians?|contractors?|auto|car\s*dealers?|mechanics?)/);
      const locationMatch = userMessage.match(/(?:in|near|around|at)\s+([A-Za-z\s,]+?)(?:\s+(?:with|within|radius)|\s*$)/i);
      const radiusMatch = userMessage.match(/(?:with|within|radius)\s*(\d+)\s*(?:miles?|mi)?/i);
      
      if (industryMatch || locationMatch) {
        const industry = industryMatch ? industryMatch[1] : 'businesses';
        const location = locationMatch ? locationMatch[1].trim() : 'Chicago, IL';
        const radius = radiusMatch ? parseInt(radiusMatch[1]) : 10;
        
        handleAction('search_leads', { industry, location, radius });
        setIsLoading(false);
        return;
      }

      // Use AI for general questions
      const context = `You are an AI lead generation assistant for Highshift Media.
      Current leads: ${currentLeads.length > 0 ? JSON.stringify(currentLeads.slice(0, 3)) : 'None yet'}
      Current search criteria: ${JSON.stringify(leadCriteria)}
      
      Help with: finding business leads, qualifying leads, creating outreach emails, understanding lead generation strategies.
      Be helpful, concise, and action-oriented. Suggest next steps.`;

      const response = await generateAgentResponse('lead_gen', userMessage, context);
      addMessage('bot', response, [
        { label: 'Search Leads', action: 'new_search' },
        { label: 'Create Email Template', action: 'create_email' },
      ]);
    } catch (error) {
      addMessage('bot', "I can help you find and qualify leads! Here are some quick actions:", [
        { label: '🔍 Search Leads', action: 'new_search' },
        { label: '📧 Create Email Template', action: 'create_email' },
        { label: '📊 Score Leads', action: 'score_leads' },
      ]);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-4xl h-[90vh] max-h-[900px] glass-panel rounded-[2.5rem] shadow-2xl flex flex-col border-white/10 overflow-hidden bg-gray-900/80 backdrop-blur-xl">
        {/* Header */}
        <header className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-violet-500/20 border border-violet-500/20">
              <Target className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Lead Generation AI</h2>
              <p className="text-[11px] font-bold text-violet-400/80 uppercase tracking-widest">Find & Qualify Leads Demo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentLeads.length > 0 && (
              <div className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium">
                {currentLeads.length} leads
              </div>
            )}
            <button onClick={onRestart} className="p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white">
              <RefreshCw className="w-5 h-5" />
            </button>
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white text-xl">
              ✕
            </button>
          </div>
        </header>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-violet-500/20 text-violet-400' 
                      : 'bg-white/10 text-white/80'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  {/* Message Content */}
                  <div className="space-y-2">
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.sender === 'user'
                        ? 'bg-violet-500/20 text-white border border-violet-500/30'
                        : 'bg-white/5 text-white/90 border border-white/10'
                    }`}>
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.text.split('\n').map((line, i) => (
                          <span key={i}>
                            {line.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                              }
                              return part;
                            })}
                            {i < message.text.split('\n').length - 1 && <br />}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {message.actions && message.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {message.actions.map((action, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleAction(action.action, action.data)}
                            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white/80" />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-sm text-white/50">Searching...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Search for leads, ask questions, or type a command..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-violet-500 transition"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-5 py-3 bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-medium transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
          
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mt-3">
            {industryPresets.slice(0, 4).map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setInput(`Find ${preset.query} leads`)}
                className="px-3 py-1.5 text-xs rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 transition"
              >
                {preset.icon} {preset.label}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};
