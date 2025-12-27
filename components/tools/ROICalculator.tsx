import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, Users, ArrowRight, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import { Button } from '../ui/Button';
import { GlassCard } from '../ui/GlassCard';
import { GradientText } from '../ui/FloatingElements';

export const ROICalculator: React.FC = () => {
  const [inputs, setInputs] = useState({
    supportTickets: 1000,
    avgResolutionTime: 15, // minutes
    agentHourlyRate: 25, // dollars
    automationRate: 80, // percentage
  });

  const [results, setResults] = useState({
    monthlySavings: 0,
    hoursSaved: 0,
    annualSavings: 0,
    currentMonthlyCost: 0,
  });

  useEffect(() => {
    const totalHours = (inputs.supportTickets * inputs.avgResolutionTime) / 60;
    const currentCost = totalHours * inputs.agentHourlyRate;

    const automatedTickets = inputs.supportTickets * (inputs.automationRate / 100);
    const automatedHours = (automatedTickets * inputs.avgResolutionTime) / 60;
    const monthlySavings = automatedHours * inputs.agentHourlyRate;

    setResults({
      monthlySavings: Math.round(monthlySavings),
      hoursSaved: Math.round(automatedHours),
      annualSavings: Math.round(monthlySavings * 12),
      currentMonthlyCost: Math.round(currentCost),
    });
  }, [inputs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 mb-6">
          <TrendingUp className="h-4 w-4 text-sky-400" />
          <span className="text-sm text-sky-300">See Your Potential Savings</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          <GradientText>Calculate Your AI Savings</GradientText>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto text-lg">
          Find out how much time and money you could save by letting AI handle your routine customer inquiries.
        </p>
      </div>

      {/* Current Cost Summary */}
      <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 max-w-2xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Zap className="h-5 w-5 text-amber-400" />
            <span className="text-white/80">Your current monthly support cost:</span>
          </div>
          <span className="text-2xl font-bold text-white">${results.currentMonthlyCost.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-lg bg-sky-500/20 text-sky-400">
              <Calculator className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Your Current Numbers</h3>
              <p className="text-sm text-white/50">Adjust the sliders to match your business</p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/80">
                  Customer Inquiries per Month
                </label>
                <span className="text-lg font-bold text-sky-400">{inputs.supportTickets.toLocaleString()}</span>
              </div>
              <input
                type="range"
                name="supportTickets"
                min="100"
                max="10000"
                step="100"
                value={inputs.supportTickets}
                onChange={handleInputChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <p className="text-xs text-white/40 mt-1">Emails, chats, calls, or tickets your team handles</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/80">
                  Time to Resolve Each Inquiry
                </label>
                <span className="text-lg font-bold text-sky-400">{inputs.avgResolutionTime} min</span>
              </div>
              <input
                type="range"
                name="avgResolutionTime"
                min="1"
                max="60"
                value={inputs.avgResolutionTime}
                onChange={handleInputChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <p className="text-xs text-white/40 mt-1">Average time your team spends on each request</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/80">
                  Your Team's Hourly Rate
                </label>
                <span className="text-lg font-bold text-sky-400">${inputs.agentHourlyRate}/hr</span>
              </div>
              <input
                type="range"
                name="agentHourlyRate"
                min="10"
                max="100"
                value={inputs.agentHourlyRate}
                onChange={handleInputChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <p className="text-xs text-white/40 mt-1">What you pay your support staff per hour</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-white/80">
                  AI Automation Target
                </label>
                <span className="text-lg font-bold text-sky-400">{inputs.automationRate}%</span>
              </div>
              <input
                type="range"
                name="automationRate"
                min="10"
                max="100"
                value={inputs.automationRate}
                onChange={handleInputChange}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <p className="text-xs text-white/40 mt-1">Percentage of inquiries AI can handle (typically 70-90%)</p>
            </div>
          </div>
        </GlassCard>

        {/* Results */}
        <div className="space-y-6">
          <GlassCard className="p-8 h-full flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="relative z-10">
              <h3 className="text-xl font-bold text-white mb-2">With Highshift AI</h3>
              <p className="text-white/50 text-sm mb-6">Here's what you could save</p>
            </div>

            <div className="grid gap-4 relative z-10">
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-sm font-medium">Monthly Savings</span>
                  </div>
                  <div className="text-3xl font-black text-emerald-400">
                    ${results.monthlySavings.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-blue-400">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">Team Hours Freed Up</span>
                  </div>
                  <div className="text-3xl font-black text-blue-400">
                    {results.hoursSaved.toLocaleString()}<span className="text-lg font-normal">/mo</span>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600/20 to-purple-600/20 border border-sky-500/30">
                <div className="flex items-center gap-3 text-sky-300 mb-3">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Total Annual Savings</span>
                </div>
                <div className="text-5xl font-black text-white mb-2">
                  ${results.annualSavings.toLocaleString()}
                </div>
                <p className="text-sm text-white/60">
                  {results.hoursSaved > 160 ? (
                    <>That's like having <span className="text-white font-bold">{Math.round(results.hoursSaved / 160)} extra team members</span> working for free.</>
                  ) : (
                    <>Your team can focus on high-value work instead of repetitive tasks.</>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <Button className="w-full" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                Start Saving Today
              </Button>
              <p className="text-xs text-white/40 text-center mt-3">Free consultation. No commitment required.</p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
