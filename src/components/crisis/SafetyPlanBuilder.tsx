'use client';

import React, { useState, useEffect } from 'react';
import { Plus, X, Save, Shield, AlertCircle, Users, Phone, Heart, CheckCircle } from 'lucide-react';
import { crisisMonitoring, SafetyPlan } from '@/lib/crisisMonitoring';

interface SafetyPlanBuilderProps {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
  initialPlan?: SafetyPlan;
}

export default function SafetyPlanBuilder({ 
  userId, 
  isOpen, 
  onClose, 
  initialPlan 
}: SafetyPlanBuilderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [safetyPlan, setSafetyPlan] = useState<SafetyPlan>({
    warningSigns: [''],
    copingStrategies: [''],
    supportContacts: [{ name: '', phone: '', relationship: '' }],
    professionalContacts: [{ name: '', phone: '', type: '' }],
    environmentSafety: [''],
    reasonsToLive: [''],
    lastUpdated: new Date()
  });

  useEffect(() => {
    if (initialPlan) {
      setSafetyPlan(initialPlan);
    }
  }, [initialPlan]);

  if (!isOpen) return null;

  const steps = [
    { title: 'Warning Signs', icon: AlertCircle, description: 'Recognize when you need help' },
    { title: 'Coping Strategies', icon: Shield, description: 'What helps you feel better' },
    { title: 'Support Network', icon: Users, description: 'People you can reach out to' },
    { title: 'Professional Help', icon: Phone, description: 'Mental health professionals' },
    { title: 'Safe Environment', icon: Shield, description: 'Make your space safer' },
    { title: 'Reasons to Live', icon: Heart, description: 'What keeps you going' }
  ];

  const addItem = (field: keyof SafetyPlan) => {
    if (field === 'supportContacts') {
      setSafetyPlan(prev => ({
        ...prev,
        supportContacts: [...prev.supportContacts, { name: '', phone: '', relationship: '' }]
      }));
    } else if (field === 'professionalContacts') {
      setSafetyPlan(prev => ({
        ...prev,
        professionalContacts: [...prev.professionalContacts, { name: '', phone: '', type: '' }]
      }));
    } else {
      setSafetyPlan(prev => ({
        ...prev,
        [field]: [...(prev[field] as string[]), '']
      }));
    }
  };

  const removeItem = (field: keyof SafetyPlan, index: number) => {
    if (field === 'supportContacts') {
      setSafetyPlan(prev => ({
        ...prev,
        supportContacts: prev.supportContacts.filter((_, i) => i !== index)
      }));
    } else if (field === 'professionalContacts') {
      setSafetyPlan(prev => ({
        ...prev,
        professionalContacts: prev.professionalContacts.filter((_, i) => i !== index)
      }));
    } else {
      setSafetyPlan(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((_, i) => i !== index)
      }));
    }
  };

  const updateItem = (field: keyof SafetyPlan, index: number, value: string | object) => {
    if (field === 'supportContacts' || field === 'professionalContacts') {
      setSafetyPlan(prev => ({
        ...prev,
        [field]: prev[field].map((item: any, i: number) => 
          i === index ? { ...(typeof item === 'object' ? item : {}), ...(typeof value === 'object' ? value : {}) } : item
        )
      }));
    } else {
      setSafetyPlan(prev => ({
        ...prev,
        [field]: (prev[field] as string[]).map((item: string, i: number) => 
          i === index ? value as string : item
        )
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Filter out empty entries
      const cleanedPlan = {
        ...safetyPlan,
        warningSigns: safetyPlan.warningSigns.filter(s => s.trim() !== ''),
        copingStrategies: safetyPlan.copingStrategies.filter(s => s.trim() !== ''),
        supportContacts: safetyPlan.supportContacts.filter(c => c.name.trim() !== '' || c.phone.trim() !== ''),
        professionalContacts: safetyPlan.professionalContacts.filter(c => c.name.trim() !== '' || c.phone.trim() !== ''),
        environmentSafety: safetyPlan.environmentSafety.filter(s => s.trim() !== ''),
        reasonsToLive: safetyPlan.reasonsToLive.filter(s => s.trim() !== ''),
        lastUpdated: new Date()
      };

      await crisisMonitoring.saveSafetyPlan(userId, cleanedPlan);
      onClose();
    } catch (error) {
      console.error('Error saving safety plan:', error);
    } finally {
      setSaving(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <AlertCircle className="w-8 h-8 mx-auto mb-3 text-amber-400" />
        <h3 className="text-white text-lg font-medium mb-2">Warning Signs</h3>
        <p className="text-white/70 text-sm">
          What thoughts, feelings, or behaviors tell you that you might be in crisis?
        </p>
      </div>

      <div className="space-y-3">
        {safetyPlan.warningSigns.map((sign, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={sign}
              onChange={(e) => updateItem('warningSigns', index, e.target.value)}
              placeholder="e.g., Feeling hopeless, isolating from friends..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
            />
            {safetyPlan.warningSigns.length > 1 && (
              <button
                onClick={() => removeItem('warningSigns', index)}
                className="text-white/60 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={() => addItem('warningSigns')}
          className="w-full bg-white/10 border border-white/20 border-dashed rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/15 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Warning Sign
        </button>
      </div>

      <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-4 mt-6">
        <h4 className="text-amber-300 text-sm font-medium mb-2">Examples of Warning Signs:</h4>
        <ul className="text-amber-200/80 text-sm space-y-1">
          <li>• Feeling overwhelmed or hopeless</li>
          <li>• Withdrawing from friends and family</li>
          <li>• Trouble sleeping or sleeping too much</li>
          <li>• Increased substance use</li>
          <li>• Thinking about death or suicide</li>
        </ul>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Shield className="w-8 h-8 mx-auto mb-3 text-green-400" />
        <h3 className="text-white text-lg font-medium mb-2">Coping Strategies</h3>
        <p className="text-white/70 text-sm">
          What activities or techniques help you feel better when you're struggling?
        </p>
      </div>

      <div className="space-y-3">
        {safetyPlan.copingStrategies.map((strategy, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={strategy}
              onChange={(e) => updateItem('copingStrategies', index, e.target.value)}
              placeholder="e.g., Deep breathing, calling a friend, taking a walk..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
            />
            {safetyPlan.copingStrategies.length > 1 && (
              <button
                onClick={() => removeItem('copingStrategies', index)}
                className="text-white/60 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={() => addItem('copingStrategies')}
          className="w-full bg-white/10 border border-white/20 border-dashed rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/15 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Coping Strategy
        </button>
      </div>

      <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 mt-6">
        <h4 className="text-green-300 text-sm font-medium mb-2">Healthy Coping Ideas:</h4>
        <ul className="text-green-200/80 text-sm space-y-1">
          <li>• Practice deep breathing or meditation</li>
          <li>• Go for a walk or exercise</li>
          <li>• Listen to calming music</li>
          <li>• Write in a journal</li>
          <li>• Take a warm bath or shower</li>
        </ul>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Users className="w-8 h-8 mx-auto mb-3 text-blue-400" />
        <h3 className="text-white text-lg font-medium mb-2">Support Network</h3>
        <p className="text-white/70 text-sm">
          Who can you reach out to when you need support?
        </p>
      </div>

      <div className="space-y-4">
        {safetyPlan.supportContacts.map((contact, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Contact {index + 1}</span>
              {safetyPlan.supportContacts.length > 1 && (
                <button
                  onClick={() => removeItem('supportContacts', index)}
                  className="text-white/60 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={contact.name}
                onChange={(e) => updateItem('supportContacts', index, { name: e.target.value })}
                placeholder="Name"
                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
              />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateItem('supportContacts', index, { phone: e.target.value })}
                placeholder="Phone number"
                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
              />
              <input
                type="text"
                value={contact.relationship}
                onChange={(e) => updateItem('supportContacts', index, { relationship: e.target.value })}
                placeholder="Relationship (friend, family, etc.)"
                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={() => addItem('supportContacts')}
          className="w-full bg-white/10 border border-white/20 border-dashed rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/15 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Support Contact
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Phone className="w-8 h-8 mx-auto mb-3 text-purple-400" />
        <h3 className="text-white text-lg font-medium mb-2">Professional Support</h3>
        <p className="text-white/70 text-sm">
          Mental health professionals and crisis services you can contact
        </p>
      </div>

      <div className="space-y-4">
        {safetyPlan.professionalContacts.map((contact, index) => (
          <div key={index} className="bg-white/5 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70 text-sm">Professional {index + 1}</span>
              {safetyPlan.professionalContacts.length > 1 && (
                <button
                  onClick={() => removeItem('professionalContacts', index)}
                  className="text-white/60 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-3">
              <input
                type="text"
                value={contact.name}
                onChange={(e) => updateItem('professionalContacts', index, { name: e.target.value })}
                placeholder="Name or service"
                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
              />
              <input
                type="tel"
                value={contact.phone}
                onChange={(e) => updateItem('professionalContacts', index, { phone: e.target.value })}
                placeholder="Phone number"
                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
              />
              <input
                type="text"
                value={contact.type}
                onChange={(e) => updateItem('professionalContacts', index, { type: e.target.value })}
                placeholder="Type (therapist, crisis line, etc.)"
                className="bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
              />
            </div>
          </div>
        ))}
        
        <button
          onClick={() => addItem('professionalContacts')}
          className="w-full bg-white/10 border border-white/20 border-dashed rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/15 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Professional Contact
        </button>
      </div>

      <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
        <h4 className="text-purple-300 text-sm font-medium mb-2">Always Available:</h4>
        <ul className="text-purple-200/80 text-sm space-y-1">
          <li>• National Suicide Prevention Lifeline: 988</li>
          <li>• Crisis Text Line: Text HOME to 741741</li>
          <li>• Emergency Services: 911</li>
        </ul>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Shield className="w-8 h-8 mx-auto mb-3 text-teal-400" />
        <h3 className="text-white text-lg font-medium mb-2">Environment Safety</h3>
        <p className="text-white/70 text-sm">
          Steps to make your environment safer during difficult times
        </p>
      </div>

      <div className="space-y-3">
        {safetyPlan.environmentSafety.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem('environmentSafety', index, e.target.value)}
              placeholder="e.g., Remove harmful items, ask friend to hold medications..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
            />
            {safetyPlan.environmentSafety.length > 1 && (
              <button
                onClick={() => removeItem('environmentSafety', index)}
                className="text-white/60 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={() => addItem('environmentSafety')}
          className="w-full bg-white/10 border border-white/20 border-dashed rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/15 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Safety Step
        </button>
      </div>

      <div className="bg-teal-500/20 border border-teal-500/30 rounded-xl p-4">
        <h4 className="text-teal-300 text-sm font-medium mb-2">Safety Ideas:</h4>
        <ul className="text-teal-200/80 text-sm space-y-1">
          <li>• Remove or secure harmful objects</li>
          <li>• Have someone hold medications temporarily</li>
          <li>• Create a calm, comfortable space</li>
          <li>• Remove alcohol or drugs</li>
          <li>• Install website blockers if needed</li>
        </ul>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Heart className="w-8 h-8 mx-auto mb-3 text-pink-400" />
        <h3 className="text-white text-lg font-medium mb-2">Reasons to Live</h3>
        <p className="text-white/70 text-sm">
          What gives your life meaning and purpose? What are you living for?
        </p>
      </div>

      <div className="space-y-3">
        {safetyPlan.reasonsToLive.map((reason, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={reason}
              onChange={(e) => updateItem('reasonsToLive', index, e.target.value)}
              placeholder="e.g., My children, my dreams, my pets, helping others..."
              className="flex-1 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/30 focus:outline-none"
            />
            {safetyPlan.reasonsToLive.length > 1 && (
              <button
                onClick={() => removeItem('reasonsToLive', index)}
                className="text-white/60 hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        
        <button
          onClick={() => addItem('reasonsToLive')}
          className="w-full bg-white/10 border border-white/20 border-dashed rounded-xl p-3 text-white/70 hover:text-white hover:bg-white/15 transition-colors flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Reason to Live
        </button>
      </div>

      <div className="bg-pink-500/20 border border-pink-500/30 rounded-xl p-4">
        <h4 className="text-pink-300 text-sm font-medium mb-2">Remember:</h4>
        <p className="text-pink-200/80 text-sm">
          These reasons matter, even when they feel distant. Your life has value and meaning, 
          and there are people and possibilities waiting for you.
        </p>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-md rounded-3xl p-6 max-w-2xl w-full border border-blue-500/50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white text-xl font-light">Personal Safety Plan</h2>
            <p className="text-white/60 text-sm">Step {currentStep} of 6</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-2">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index + 1 === currentStep;
              const isCompleted = index + 1 < currentStep;
              
              return (
                <div key={index} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(index + 1)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted 
                        ? 'bg-green-500/30 text-green-300' 
                        : isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : <StepIcon className="w-4 h-4" />}
                  </button>
                  {index < steps.length - 1 && (
                    <div className={`w-6 h-px ${isCompleted ? 'bg-green-500/30' : 'bg-white/20'}`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="text-white/70 text-xs">{steps[currentStep - 1].description}</div>
        </div>

        {/* Content */}
        <div className="mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:text-white/40 text-white px-4 py-2 rounded-xl transition-colors"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            {currentStep < 6 ? (
              <button
                onClick={() => setCurrentStep(Math.min(6, currentStep + 1))}
                className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-xl transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-500/30 hover:bg-green-500/40 text-green-300 px-6 py-2 rounded-xl transition-colors flex items-center disabled:opacity-50"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Safety Plan'}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Your safety plan is private and secure. Only you can access this information.
          </p>
        </div>
      </div>
    </div>
  );
}