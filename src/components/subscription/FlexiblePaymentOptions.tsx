'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Heart, Shield, DollarSign, Users, GraduationCap, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';

interface FlexiblePaymentOptionsProps {
  userIncomeLevel?: 'low' | 'medium' | 'high' | null;
  onPaymentOptionSelect?: (optionId: string) => void;
}

interface PaymentOption {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  discountedPrice?: number;
  features: string[];
  eligibility: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  popular?: boolean;
  specialNote?: string;
}

export function FlexiblePaymentOptions({ 
  userIncomeLevel, 
  onPaymentOptionSelect 
}: FlexiblePaymentOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [showIncomeVerification, setShowIncomeVerification] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(50000);
  const [householdSize, setHouseholdSize] = useState(1);
  const [studentStatus, setStudentStatus] = useState(false);
  const [showScholarshipForm, setShowScholarshipForm] = useState(false);

  // Calculate sliding scale based on income and household size
  const calculateSlidingScale = () => {
    const perPersonIncome = annualIncome / householdSize;
    
    // Sliding scale tiers based on federal poverty guidelines
    if (perPersonIncome <= 15000) return 0.2; // 80% discount
    if (perPersonIncome <= 25000) return 0.3; // 70% discount
    if (perPersonIncome <= 35000) return 0.5; // 50% discount
    if (perPersonIncome <= 50000) return 0.7; // 30% discount
    if (perPersonIncome <= 75000) return 0.85; // 15% discount
    return 1.0; // Full price
  };

  const slidingScaleMultiplier = calculateSlidingScale();
  const basePrice = 149.94;
  const slidingScalePrice = basePrice * slidingScaleMultiplier;

  const paymentOptions: PaymentOption[] = [
    {
      id: 'standard',
      name: 'Standard Investment',
      description: 'Full sanctuary access for 18 months',
      originalPrice: 149.94,
      features: [
        'Unlimited AI-powered insights',
        '24/7 crisis support',
        'Professional progress reports',
        'Advanced emotional analytics',
        'Export capabilities'
      ],
      eligibility: 'Available to everyone',
      icon: <Star className="w-6 h-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      popular: true
    },
    {
      id: 'sliding-scale',
      name: 'Economic Justice Pricing',
      description: 'Sliding scale based on income and household size',
      originalPrice: 149.94,
      discountedPrice: slidingScalePrice,
      features: [
        'Same features as standard',
        'Income-based pricing',
        'No verification judgment',
        'Honor system respect',
        'Community solidarity'
      ],
      eligibility: 'Self-reported income verification',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      specialNote: 'Mental health is a human right, not a privilege'
    },
    {
      id: 'student',
      name: 'Student Sanctuary',
      description: 'Supporting the next generation of healers',
      originalPrice: 149.94,
      discountedPrice: 74.97, // 50% discount
      features: [
        'All premium features',
        '50% student discount',
        'Academic research participation',
        'Peer support groups',
        'Career wellness tools'
      ],
      eligibility: 'Current student enrollment verification',
      icon: <GraduationCap className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'community-scholarship',
      name: 'Community Scholarship',
      description: 'Funded by our healing community',
      originalPrice: 149.94,
      discountedPrice: 0,
      features: [
        'Fully funded by community',
        'All premium features',
        'Mentorship opportunities',
        'Giving back when able',
        'Healing justice in action'
      ],
      eligibility: 'Application-based for financial hardship',
      icon: <Users className="w-6 h-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      specialNote: 'Our community believes everyone deserves healing'
    }
  ];

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    
    if (optionId === 'sliding-scale') {
      setShowIncomeVerification(true);
    } else if (optionId === 'community-scholarship') {
      setShowScholarshipForm(true);
    } else {
      setShowIncomeVerification(false);
      setShowScholarshipForm(false);
    }
    
    if (onPaymentOptionSelect) {
      onPaymentOptionSelect(optionId);
    }
  };

  const getPovertyLevel = () => {
    const perPersonIncome = annualIncome / householdSize;
    const federalPovertyLine = 14580 + (5140 * (householdSize - 1)); // 2024 guidelines
    const povertyPercentage = (annualIncome / federalPovertyLine) * 100;
    
    if (povertyPercentage <= 100) return 'Below poverty line';
    if (povertyPercentage <= 200) return 'Low income';
    if (povertyPercentage <= 400) return 'Moderate income';
    return 'Higher income';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-medium text-slate-800">
            Economic Justice Payment Options
          </h2>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Healing is a human right. Choose the option that honors your economic reality 
          while supporting our community's commitment to universal access.
        </p>
      </div>

      {/* Payment Options Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {paymentOptions.map((option) => (
          <Card
            key={option.id}
            className={`p-6 cursor-pointer transition-all duration-300 ${option.bgColor} ${option.borderColor} ${
              selectedOption === option.id 
                ? 'ring-2 ring-offset-2 ring-purple-500 scale-105' 
                : 'hover:scale-102'
            } ${option.popular ? 'relative' : ''}`}
            onClick={() => handleOptionSelect(option.id)}
          >
            {option.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                  Most Popular
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={option.color}>
                      {option.icon}
                    </div>
                    <h3 className="text-lg font-medium text-slate-800">
                      {option.name}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600">
                    {option.description}
                  </p>
                </div>

                <div className="text-right">
                  {option.discountedPrice !== undefined ? (
                    <div>
                      <div className="text-sm text-slate-500 line-through">
                        ${option.originalPrice}
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        ${option.discountedPrice.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-slate-800">
                      ${option.originalPrice}
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                {option.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Eligibility */}
              <div className="text-xs text-slate-500 bg-white/50 p-2 rounded">
                <strong>Eligibility:</strong> {option.eligibility}
              </div>

              {/* Special Note */}
              {option.specialNote && (
                <div className="text-xs italic text-slate-600 bg-white/70 p-2 rounded border-l-2 border-current">
                  "{option.specialNote}"
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Income Verification (for sliding scale) */}
      {showIncomeVerification && (
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-green-800">
                Economic Justice Calculator
              </h3>
              <p className="text-sm text-green-700">
                We trust you to set a price that honors your economic reality. 
                No judgment, no verification required.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Annual Income */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-green-700">
                  Annual Household Income
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[annualIncome]}
                    onValueChange={(value) => setAnnualIncome(value[0])}
                    max={150000}
                    min={0}
                    step={1000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-green-600">
                    <span>$0</span>
                    <span className="font-medium">${annualIncome.toLocaleString()}</span>
                    <span>$150,000+</span>
                  </div>
                </div>
              </div>

              {/* Household Size */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-green-700">
                  Household Size
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[householdSize]}
                    onValueChange={(value) => setHouseholdSize(value[0])}
                    max={8}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-green-600">
                    <span>1</span>
                    <span className="font-medium">{householdSize} people</span>
                    <span>8+</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="bg-white/70 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-green-700">Income level:</span>
                <span className="font-medium text-green-800">{getPovertyLevel()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-green-700">Your sanctuary investment:</span>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-800">
                    ${slidingScalePrice.toFixed(2)}
                  </div>
                  <div className="text-xs text-green-600">
                    {Math.round((1 - slidingScaleMultiplier) * 100)}% community discount
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-green-600 text-center bg-white/50 p-3 rounded">
              This pricing honors your economic reality while sustaining our mission. 
              You're helping create a world where healing isn't limited by wealth.
            </div>
          </div>
        </Card>
      )}

      {/* Scholarship Application */}
      {showScholarshipForm && (
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-medium text-orange-800">
                Community Scholarship Application
              </h3>
              <p className="text-sm text-orange-700">
                Our community funds scholarships because we believe healing shouldn't 
                depend on economic privilege.
              </p>
            </div>

            <div className="space-y-4">
              <div className="bg-white/70 p-4 rounded-lg space-y-3">
                <h4 className="font-medium text-orange-800">How it works:</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• No complex forms or invasive questions</li>
                  <li>• Tell us briefly about your situation</li>
                  <li>• Community members fund scholarships</li>
                  <li>• When you're able, consider supporting others</li>
                </ul>
              </div>

              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => {
                  // In real implementation, would open scholarship form
                  alert('Scholarship application form would open here');
                }}
              >
                Apply for Community Scholarship
              </Button>
            </div>

            <div className="text-xs text-orange-600 text-center bg-white/50 p-3 rounded">
              Scholarships are funded by premium members who believe in economic justice. 
              Applications are reviewed with compassion, not judgment.
            </div>
          </div>
        </Card>
      )}

      {/* Community Commitment */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <div className="text-center space-y-4">
          <h3 className="text-lg font-medium text-purple-800">
            Our Economic Justice Commitment
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <AlertCircle className="w-6 h-6 text-purple-600 mx-auto" />
              <div className="font-medium text-purple-700">No One Left Behind</div>
              <div className="text-purple-600">
                Financial hardship will never prevent access to healing support
              </div>
            </div>
            <div className="space-y-2">
              <Heart className="w-6 h-6 text-purple-600 mx-auto" />
              <div className="font-medium text-purple-700">Honor System</div>
              <div className="text-purple-600">
                We trust you to choose what you can afford without shame or judgment
              </div>
            </div>
            <div className="space-y-2">
              <Users className="w-6 h-6 text-purple-600 mx-auto" />
              <div className="font-medium text-purple-700">Community Solidarity</div>
              <div className="text-purple-600">
                Those who can afford more help make healing accessible for all
              </div>
            </div>
          </div>

          <div className="text-xs text-purple-600 bg-white/50 p-3 rounded-lg">
            <strong>Payment Protection:</strong> No hidden fees, no automatic renewals, 
            no penalty for financial crises. Your healing journey should never create 
            additional stress about money.
          </div>
        </div>
      </Card>

      {/* Selected Option Summary */}
      {selectedOption && (
        <Card className="p-6 bg-white border-2 border-purple-200">
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium text-slate-800">
              Ready to Invest in Your Healing Journey?
            </h3>
            
            <div className="text-sm text-slate-600">
              Selected: <strong>{paymentOptions.find(o => o.id === selectedOption)?.name}</strong>
            </div>

            <Button 
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              <Heart className="w-5 h-5 mr-2" />
              Begin Your Sanctuary Journey
            </Button>
            
            <div className="text-xs text-slate-500">
              You can change your plan or cancel anytime. No penalties, no judgment.
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}