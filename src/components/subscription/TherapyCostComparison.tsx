'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { TrendingUp, DollarSign, Clock, Heart, Calculator, Zap } from 'lucide-react';

interface TherapyCostComparisonProps {
  defaultSessionCost?: number;
  defaultSessionsPerMonth?: number;
}

export function TherapyCostComparison({ 
  defaultSessionCost = 150, 
  defaultSessionsPerMonth = 2 
}: TherapyCostComparisonProps) {
  const [sessionCost, setSessionCost] = useState(defaultSessionCost);
  const [sessionsPerMonth, setSessionsPerMonth] = useState(defaultSessionsPerMonth);
  const [timeframe, setTimeframe] = useState(12); // months
  const [animateResults, setAnimateResults] = useState(false);

  const alchm_monthly_cost = 8.33; // $149.94 / 18 months
  const alchm_total_cost = 149.94; // 18-month commitment

  const therapyCostPerMonth = sessionCost * sessionsPerMonth;
  const therapyTotalCost = therapyCostPerMonth * timeframe;
  const alchmTotalCost = Math.min(alchm_monthly_cost * timeframe, alchm_total_cost);
  
  const savings = therapyTotalCost - alchmTotalCost;
  const savingsPercentage = Math.round((savings / therapyTotalCost) * 100);

  useEffect(() => {
    setAnimateResults(true);
    const timer = setTimeout(() => setAnimateResults(false), 1000);
    return () => clearTimeout(timer);
  }, [sessionCost, sessionsPerMonth, timeframe]);

  const timeframeOptions = [
    { value: 6, label: '6 months' },
    { value: 12, label: '1 year' },
    { value: 18, label: '18 months' },
    { value: 24, label: '2 years' }
  ];

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Calculator className="w-5 h-5 text-purple-600" />
            <h2 className="text-xl font-medium text-slate-800">Therapy Cost Calculator</h2>
          </div>
          <p className="text-slate-600">
            Compare your traditional therapy investment with ALCHM's unlimited support
          </p>
        </div>

        {/* Input Controls */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Session Cost */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Cost per therapy session
            </label>
            <div className="space-y-2">
              <Slider
                value={[sessionCost]}
                onValueChange={(value) => setSessionCost(value[0])}
                max={300}
                min={50}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>$50</span>
                <span className="font-medium">${sessionCost}</span>
                <span>$300</span>
              </div>
            </div>
          </div>

          {/* Sessions per Month */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Sessions per month
            </label>
            <div className="space-y-2">
              <Slider
                value={[sessionsPerMonth]}
                onValueChange={(value) => setSessionsPerMonth(value[0])}
                max={8}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>1</span>
                <span className="font-medium">{sessionsPerMonth}</span>
                <span>8</span>
              </div>
            </div>
          </div>

          {/* Timeframe */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Compare over
            </label>
            <div className="grid grid-cols-2 gap-2">
              {timeframeOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={timeframe === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(option.value)}
                  className="text-xs"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Comparison */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Traditional Therapy */}
          <Card className="p-6 bg-red-50 border-red-200">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-red-600" />
                <h3 className="font-medium text-red-800">Traditional Therapy</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-red-700">Per month:</span>
                  <span className="font-medium text-red-800">
                    ${therapyCostPerMonth.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-700">Total ({timeframe} months):</span>
                  <span className={`text-2xl font-bold text-red-800 ${
                    animateResults ? 'animate-pulse' : ''
                  }`}>
                    ${therapyTotalCost.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-xs text-red-600 space-y-1">
                <div>• Limited to scheduled sessions</div>
                <div>• No 24/7 support</div>
                <div>• Cost increases over time</div>
              </div>
            </div>
          </Card>

          {/* ALCHM Premium */}
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-green-800">ALCHM Premium</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-green-700">Per month:</span>
                  <span className="font-medium text-green-800">
                    ${alchm_monthly_cost.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Total ({timeframe} months):</span>
                  <span className={`text-2xl font-bold text-green-800 ${
                    animateResults ? 'animate-pulse' : ''
                  }`}>
                    ${alchmTotalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="text-xs text-green-600 space-y-1">
                <div>• Unlimited daily support</div>
                <div>• 24/7 crisis intervention</div>
                <div>• AI-powered insights</div>
                <div>• Professional reports</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Savings Highlight */}
        {savings > 0 && (
          <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-medium text-purple-800">Your Investment Savings</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className={`text-3xl font-bold text-purple-700 ${
                    animateResults ? 'animate-bounce' : ''
                  }`}>
                    ${savings.toLocaleString()}
                  </div>
                  <div className="text-purple-600">Total saved</div>
                </div>
                <div>
                  <div className={`text-3xl font-bold text-purple-700 ${
                    animateResults ? 'animate-bounce' : ''
                  }`}>
                    {savingsPercentage}%
                  </div>
                  <div className="text-purple-600">Cost reduction</div>
                </div>
              </div>

              <div className="text-sm text-purple-700 bg-white/50 p-3 rounded-lg">
                <strong>What you could do with ${savings.toLocaleString()}:</strong>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>• Emergency fund: ${(savings * 0.3).toFixed(0)}</div>
                  <div>• Self-care budget: ${(savings * 0.2).toFixed(0)}</div>
                  <div>• Additional therapy: ${(savings * 0.3).toFixed(0)}</div>
                  <div>• Wellness activities: ${(savings * 0.2).toFixed(0)}</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* ROI Breakdown */}
        <Card className="p-6 bg-slate-50 border-slate-200">
          <div className="space-y-4">
            <h3 className="font-medium text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-slate-600" />
              Return on Investment Analysis
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-bold text-slate-800">
                  {Math.round(therapyTotalCost / alchmTotalCost)}x
                </div>
                <div className="text-slate-600">More cost-effective</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800">24/7</div>
                <div className="text-slate-600">Availability</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800">
                  {timeframe * 30}
                </div>
                <div className="text-slate-600">Days of support</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-slate-800">∞</div>
                <div className="text-slate-600">Usage limit</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Economic Justice Note */}
        <div className="text-center text-sm text-slate-600 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p>
            <strong>Economic Justice Commitment:</strong> We understand that mental health shouldn't be 
            a luxury. If these costs are still challenging, explore our sliding scale and scholarship 
            options below. Healing is a human right, not a privilege.
          </p>
        </div>
      </div>
    </Card>
  );
}