import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, DollarSign, Clock, Users, ArrowRight, RefreshCw } from 'lucide-react';
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
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          <GradientText>AI ROI Calculator</GradientText>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Estimate how much your business could save by implementing Highshift AI agents for customer support and operations.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Inputs */}
        <GlassCard className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-lg bg-sky-500/20 text-sky-400">
              <Calculator className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Input Your Metrics</h3>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Monthly Support Tickets
              </label>
              <div className="flex items-center gap-4">
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
                <span className="w-20 text-right text-white font-mono">{inputs.supportTickets}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Avg. Resolution Time (Minutes)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="avgResolutionTime"
                  min="1"
                  max="60"
                  value={inputs.avgResolutionTime}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <span className="w-20 text-right text-white font-mono">{inputs.avgResolutionTime}m</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Support Agent Hourly Cost ($)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="agentHourlyRate"
                  min="10"
                  max="100"
                  value={inputs.agentHourlyRate}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <span className="w-20 text-right text-white font-mono">${inputs.agentHourlyRate}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Target Automation Rate (%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  name="automationRate"
                  min="10"
                  max="100"
                  value={inputs.automationRate}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
                <span className="w-20 text-right text-white font-mono">{inputs.automationRate}%</span>
              </div>
              <p className="text-xs text-white/40 mt-1">
                *Highshift agents typically automate 70-90% of routine inquiries.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Results */}
        <div className="space-y-6">
          <GlassCard className="p-8 h-full flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />
            
            <h3 className="text-xl font-bold text-white mb-8 relative z-10">Estimated Savings</h3>

            <div className="grid gap-6 relative z-10">
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Monthly Savings</span>
                </div>
                <div className="text-4xl font-black text-white">
                  ${results.monthlySavings.toLocaleString()}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <div className="flex items-center gap-3 text-blue-400 mb-2">
                  <Clock className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Hours Saved / Month</span>
                </div>
                <div className="text-4xl font-black text-white">
                  {results.hoursSaved.toLocaleString()} <span className="text-lg text-white/40 font-normal">hrs</span>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-600/20 to-purple-600/20 border border-sky-500/30">
                <div className="flex items-center gap-3 text-sky-300 mb-2">
                  <RefreshCw className="h-5 w-5" />
                  <span className="text-sm font-medium uppercase tracking-wider">Annual ROI</span>
                </div>
                <div className="text-5xl font-black text-white">
                  ${results.annualSavings.toLocaleString()}
                </div>
                <p className="text-sm text-white/60 mt-2">
                  That's equivalent to hiring <span className="text-white font-bold">{Math.round(results.hoursSaved / 160)} full-time employees</span>.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <Button className="w-full" size="lg" icon={<ArrowRight className="h-5 w-5" />}>
                Get Your Custom AI Plan
              </Button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
