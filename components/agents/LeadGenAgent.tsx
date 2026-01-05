import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, MapPin, Building2, Phone, Mail, Globe, Star, 
  Download, Loader2, AlertCircle, CheckCircle2, 
  Sparkles, Target, Users, ArrowRight, RefreshCw,
  ExternalLink, Copy, Filter, Zap, Send, MessageSquare,
  FileSpreadsheet, Bot, User
} from 'lucide-react';

// API endpoints
const SCRAPER_API = 'https://vikasvardhanv--gmaps-lead-scraper-fastapi-app.modal.run';
const EMAIL_API = 'https://vikasvardhanv--lead-gen-email-sender-fastapi-app.modal.run';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface EmailConfig {
  sheetUrl: string;
  subject: string;
  body: string;
  senderName: string;
  senderEmail: string;
}

interface Lead {
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  reviews: number;
  place_id: string;
  types: string[];
  business_status: string;
  latitude?: number;
  longitude?: number;
}

interface SearchRequest {
  query: string;
  location: string;
  radius?: number;
  limit?: number;
}

interface LeadGenAgentProps {
  onBack: () => void;
  onRestart: () => void;
}

const industryPresets = [
  { label: 'Restaurants', query: 'restaurants', icon: '🍽️' },
  { label: 'Real Estate', query: 'real estate agents', icon: '🏠' },
  { label: 'Dentists', query: 'dentists', icon: '🦷' },
  { label: 'Gyms', query: 'gyms fitness', icon: '💪' },
  { label: 'Auto Repair', query: 'auto repair shops', icon: '🔧' },
  { label: 'Salons', query: 'hair salons beauty', icon: '💇' },
  { label: 'Lawyers', query: 'law firms lawyers', icon: '⚖️' },
  { label: 'Hotels', query: 'hotels', icon: '🏨' },
];

// Email chat flow stages
type ChatStage = 'idle' | 'awaiting_subject' | 'awaiting_body' | 'awaiting_sender_name' | 'awaiting_sender_email' | 'confirming' | 'sending' | 'complete';

export const LeadGenAgent: React.FC<LeadGenAgentProps> = ({ onBack, onRestart }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [radius, setRadius] = useState(5000);
  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const resultsRef = useRef<HTMLDivElement>(null);
  
  // Sheet URL and Email Chat State
  const [sheetUrl, setSheetUrl] = useState('');
  const [showEmailChat, setShowEmailChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatStage, setChatStage] = useState<ChatStage>('idle');
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    sheetUrl: '',
    subject: '',
    body: '',
    senderName: '',
    senderEmail: ''
  });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailResult, setEmailResult] = useState<{ success: boolean; message: string } | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (!query.trim() || !location.trim()) {
      setError('Please enter both a business type and location');
      return;
    }

    setIsLoading(true);
    setError('');
    setLeads([]);
    setSelectedLeads(new Set());
    setSheetUrl('');
    setShowEmailChat(false);
    setChatMessages([]);
    setChatStage('idle');

    try {
      const response = await fetch(`${SCRAPER_API}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          location: location.trim(),
          radius: radius,
          limit: limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.leads && Array.isArray(data.leads)) {
        setLeads(data.leads);
        // Check if sheet_url is returned
        if (data.sheet_url) {
          setSheetUrl(data.sheet_url);
          setEmailConfig(prev => ({ ...prev, sheetUrl: data.sheet_url }));
        }
        // Add to search history
        const searchTerm = `${query} in ${location}`;
        setSearchHistory(prev => [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5));
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        setLeads([]);
      }
    } catch (err: any) {
      console.error('Lead scraping error:', err);
      setError(err.message || 'Failed to fetch leads. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Start email chat flow
  const startEmailChat = () => {
    setShowEmailChat(true);
    setChatStage('awaiting_subject');
    const initialMessage: ChatMessage = {
      role: 'assistant',
      content: `📧 Let's set up your email campaign!\n\nI have your leads ready in the spreadsheet. Now I'll help you compose and send personalized emails to all of them.\n\n**What should be the email subject line?**\n\n_Tip: Keep it short and compelling to improve open rates._`,
      timestamp: new Date()
    };
    setChatMessages([initialMessage]);
  };

  // Process chat input based on current stage
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput.trim(),
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    const input = chatInput.trim();
    setChatInput('');

    let assistantResponse = '';

    switch (chatStage) {
      case 'awaiting_subject':
        setEmailConfig(prev => ({ ...prev, subject: input }));
        assistantResponse = `✅ Subject line set: "${input}"\n\n**Now, what should be the email body?**\n\n_You can use placeholders like {name} for the business name. Write your message naturally._`;
        setChatStage('awaiting_body');
        break;

      case 'awaiting_body':
        setEmailConfig(prev => ({ ...prev, body: input }));
        assistantResponse = `✅ Email body saved!\n\n**What's your name?** (This will appear as the sender name)`;
        setChatStage('awaiting_sender_name');
        break;

      case 'awaiting_sender_name':
        setEmailConfig(prev => ({ ...prev, senderName: input }));
        assistantResponse = `✅ Sender name: ${input}\n\n**What's your email address?** (Replies will go to this address)`;
        setChatStage('awaiting_sender_email');
        break;

      case 'awaiting_sender_email':
        if (!input.includes('@')) {
          assistantResponse = `⚠️ That doesn't look like a valid email. Please enter a valid email address.`;
        } else {
          setEmailConfig(prev => ({ ...prev, senderEmail: input }));
          const config = { ...emailConfig, senderEmail: input };
          assistantResponse = `✅ Perfect! Here's your email campaign summary:\n\n📋 **Sheet URL:** ${sheetUrl || 'Loaded from scrape'}\n📧 **Subject:** ${config.subject}\n✉️ **From:** ${config.senderName} <${input}>\n📝 **Body Preview:**\n"${config.body.substring(0, 100)}${config.body.length > 100 ? '...' : ''}"\n\n**Ready to send emails to ${leads.length} leads?**\n\nType **"yes"** to confirm and send, or **"edit"** to start over.`;
          setChatStage('confirming');
        }
        break;

      case 'confirming':
        if (input.toLowerCase() === 'yes' || input.toLowerCase() === 'send') {
          setChatStage('sending');
          assistantResponse = '🚀 Sending emails now...';
          setTimeout(() => sendEmails(), 100);
        } else if (input.toLowerCase() === 'edit' || input.toLowerCase() === 'no') {
          setChatStage('awaiting_subject');
          setEmailConfig({ sheetUrl: sheetUrl, subject: '', body: '', senderName: '', senderEmail: '' });
          assistantResponse = `No problem! Let's start over.\n\n**What should be the email subject line?**`;
        } else {
          assistantResponse = `Please type **"yes"** to send the emails or **"edit"** to start over.`;
        }
        break;

      default:
        assistantResponse = 'Something went wrong. Please try again.';
    }

    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: assistantResponse,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, assistantMessage]);
  };

  // Send emails via API
  const sendEmails = async () => {
    setIsSendingEmail(true);
    try {
      const response = await fetch(`${EMAIL_API}/send-emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sheet_url: sheetUrl || emailConfig.sheetUrl,
          subject: emailConfig.subject,
          body: emailConfig.body,
          sender_name: emailConfig.senderName,
          sender_email: emailConfig.senderEmail,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setEmailResult({ success: true, message: data.message || `Successfully sent emails to ${leads.length} leads!` });
        const successMessage: ChatMessage = {
          role: 'assistant',
          content: `🎉 **Emails sent successfully!**\n\n${data.message || `Sent to ${leads.length} leads.`}\n\nYour campaign is now live. Replies will go to ${emailConfig.senderEmail}.`,
          timestamp: new Date()
        };
        setChatMessages(prev => [...prev, successMessage]);
        setChatStage('complete');
      } else {
        throw new Error(data.error || data.detail || 'Failed to send emails');
      }
    } catch (err: any) {
      console.error('Email sending error:', err);
      setEmailResult({ success: false, message: err.message });
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `❌ **Error sending emails:**\n\n${err.message}\n\nPlease try again or check your configuration.`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, errorMessage]);
      setChatStage('confirming');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handlePresetClick = (preset: typeof industryPresets[0]) => {
    setQuery(preset.query);
  };

  const toggleLeadSelection = (placeId: string) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (newSet.has(placeId)) {
        newSet.delete(placeId);
      } else {
        newSet.add(placeId);
      }
      return newSet;
    });
  };

  const selectAllLeads = () => {
    if (selectedLeads.size === leads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(leads.map(l => l.place_id)));
    }
  };

  const exportLeads = () => {
    const leadsToExport = leads.filter(l => selectedLeads.size === 0 || selectedLeads.has(l.place_id));
    
    const csvContent = [
      ['Name', 'Address', 'Phone', 'Website', 'Rating', 'Reviews', 'Status'].join(','),
      ...leadsToExport.map(lead => [
        `"${lead.name}"`,
        `"${lead.address}"`,
        lead.phone || '',
        lead.website || '',
        lead.rating || '',
        lead.reviews || '',
        lead.business_status || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${query.replace(/\s+/g, '_')}_${location.replace(/\s+/g, '_')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    if (leads.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [leads]);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 rounded-2xl p-6 mb-6 border border-violet-500/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/20 rounded-xl">
              <Target className="w-8 h-8 text-violet-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">AI Lead Generator</h2>
              <p className="text-white/60">Find qualified business leads from Google Maps</p>
            </div>
          </div>
          <button 
            onClick={onBack} 
            className="text-white/40 hover:text-white transition p-2"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Search Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-white/10 mb-6"
      >
        {/* Quick Presets */}
        <div className="mb-6">
          <label className="text-sm text-white/60 mb-3 block">Quick Select Industry</label>
          <div className="flex flex-wrap gap-2">
            {industryPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => handlePresetClick(preset)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  query === preset.query
                    ? 'bg-violet-500 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {preset.icon} {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Main Search Inputs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-white/60 mb-2 block">Business Type / Query</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., restaurants, dentists, gyms..."
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-white/60 mb-2 block">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., San Francisco, CA"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-sm text-white/60 hover:text-white mb-4 transition"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Hide' : 'Show'} Advanced Options
        </button>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid md:grid-cols-2 gap-4 mb-4 p-4 bg-slate-900/30 rounded-xl">
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Search Radius: {(radius / 1000).toFixed(1)} km
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="50000"
                    step="1000"
                    value={radius}
                    onChange={(e) => setRadius(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-white/60 mb-2 block">
                    Max Results: {limit}
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim() || !location.trim()}
          className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scraping Leads...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Leads
            </>
          )}
        </button>
      </motion.div>

      {/* Loading Animation */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-6"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-violet-500/20 border-t-violet-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Target className="w-6 h-6 text-violet-400" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-white font-medium">Scraping Google Maps...</p>
                <p className="text-white/60 text-sm">Finding {query} in {location}</p>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-violet-500 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      {leads.length > 0 && (
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Sheet URL Banner */}
          {sheetUrl && (
            <div className="p-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-emerald-500/30">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-white font-medium">Leads saved to spreadsheet!</p>
                    <a 
                      href={sheetUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                    >
                      Open Google Sheet <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(sheetUrl)}
                  className="flex items-center gap-2 text-sm text-white/70 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
                >
                  <Copy className="w-4 h-4" />
                  Copy Link
                </button>
              </div>
            </div>
          )}

          {/* Results Header */}
          <div className="p-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">Found {leads.length} Leads</h3>
                <p className="text-sm text-white/60">{query} in {location}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={selectAllLeads}
                className="text-sm text-white/60 hover:text-white px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                {selectedLeads.size === leads.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={exportLeads}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              {!showEmailChat && (
                <button
                  onClick={startEmailChat}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <Mail className="w-4 h-4" />
                  Send Emails
                </button>
              )}
            </div>
          </div>

          {/* Leads List */}
          <div className="max-h-[600px] overflow-y-auto">
            {leads.map((lead, index) => (
              <motion.div
                key={lead.place_id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 border-b border-white/5 hover:bg-white/5 transition cursor-pointer ${
                  selectedLeads.has(lead.place_id) ? 'bg-violet-500/10' : ''
                }`}
                onClick={() => toggleLeadSelection(lead.place_id)}
              >
                <div className="flex items-start gap-4">
                  {/* Selection Checkbox */}
                  <div className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-1 flex items-center justify-center transition ${
                    selectedLeads.has(lead.place_id) 
                      ? 'bg-violet-500 border-violet-500' 
                      : 'border-white/30'
                  }`}>
                    {selectedLeads.has(lead.place_id) && (
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    )}
                  </div>

                  {/* Lead Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="font-semibold text-white truncate">{lead.name}</h4>
                      {lead.rating > 0 && (
                        <div className="flex items-center gap-1 text-yellow-400 flex-shrink-0">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-sm">{lead.rating}</span>
                          <span className="text-white/40 text-sm">({lead.reviews})</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-sm">
                      {lead.address && (
                        <div className="flex items-center gap-2 text-white/60">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{lead.address}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span>{lead.phone}</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); copyToClipboard(lead.phone); }}
                            className="p-1 hover:bg-white/10 rounded transition"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      {lead.website && (
                        <div className="flex items-center gap-2 text-white/60">
                          <Globe className="w-4 h-4 flex-shrink-0" />
                          <a 
                            href={lead.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-violet-400 hover:text-violet-300 truncate flex items-center gap-1"
                          >
                            {lead.website.replace(/^https?:\/\//, '').split('/')[0]}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {lead.types && lead.types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lead.types.slice(0, 3).map((type, i) => (
                          <span 
                            key={i}
                            className="px-2 py-0.5 bg-white/5 rounded text-xs text-white/50"
                          >
                            {type.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Results Footer */}
          <div className="p-4 bg-slate-900/50 flex items-center justify-between">
            <p className="text-sm text-white/40">
              {selectedLeads.size > 0 
                ? `${selectedLeads.size} leads selected` 
                : 'Click to select leads for export'}
            </p>
            <button
              onClick={handleSearch}
              className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition"
            >
              <RefreshCw className="w-4 h-4" />
              Search Again
            </button>
          </div>
        </motion.div>
      )}

      {/* Email Chat Interface */}
      <AnimatePresence>
        {showEmailChat && leads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-emerald-500/30 overflow-hidden"
          >
            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border-b border-emerald-500/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Campaign Assistant</h3>
                  <p className="text-sm text-white/60">Let's compose your outreach emails</p>
                </div>
              </div>
              <button
                onClick={() => setShowEmailChat(false)}
                className="text-white/40 hover:text-white p-2 transition"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div 
              ref={chatRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4"
            >
              {chatMessages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'assistant' 
                      ? 'bg-emerald-500/20' 
                      : 'bg-violet-500/20'
                  }`}>
                    {msg.role === 'assistant' 
                      ? <Bot className="w-4 h-4 text-emerald-400" />
                      : <User className="w-4 h-4 text-violet-400" />
                    }
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'assistant'
                      ? 'bg-slate-700/50 text-white'
                      : 'bg-violet-600 text-white'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm" dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/_(.*?)_/g, '<em>$1</em>')
                        .replace(/\n/g, '<br />')
                    }} />
                  </div>
                </motion.div>
              ))}
              
              {/* Sending indicator */}
              {isSendingEmail && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="bg-slate-700/50 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-sm text-white/60">Sending emails...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            {chatStage !== 'complete' && chatStage !== 'sending' && (
              <div className="p-4 border-t border-white/10">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleChatSubmit(); }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder={
                      chatStage === 'awaiting_subject' ? 'Enter email subject...' :
                      chatStage === 'awaiting_body' ? 'Write your email message...' :
                      chatStage === 'awaiting_sender_name' ? 'Your name...' :
                      chatStage === 'awaiting_sender_email' ? 'your@email.com' :
                      chatStage === 'confirming' ? 'Type "yes" to send or "edit" to change...' :
                      'Type your message...'
                    }
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition"
                    disabled={isSendingEmail}
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isSendingEmail}
                    className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl transition flex items-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            )}

            {/* Completed State */}
            {chatStage === 'complete' && (
              <div className="p-4 border-t border-white/10 bg-emerald-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Campaign sent successfully!</span>
                  </div>
                  <button
                    onClick={() => {
                      setShowEmailChat(false);
                      setChatMessages([]);
                      setChatStage('idle');
                      setEmailConfig({ sheetUrl: '', subject: '', body: '', senderName: '', senderEmail: '' });
                    }}
                    className="text-sm text-white/60 hover:text-white transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && leads.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/30 rounded-2xl p-12 border border-white/5 text-center"
        >
          <div className="w-16 h-16 bg-violet-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-violet-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Ready to Find Leads</h3>
          <p className="text-white/60 max-w-md mx-auto">
            Enter a business type and location above to discover qualified leads from Google Maps
          </p>
        </motion.div>
      )}

      {/* Search History */}
      {searchHistory.length > 0 && !isLoading && leads.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-white/5"
        >
          <p className="text-sm text-white/40 mb-2">Recent Searches</p>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((search, i) => (
              <button
                key={i}
                onClick={() => {
                  const [q, loc] = search.split(' in ');
                  setQuery(q);
                  setLocation(loc);
                }}
                className="text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition"
              >
                {search}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};
