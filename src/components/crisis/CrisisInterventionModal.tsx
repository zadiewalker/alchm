'use client';

import React, { useState, useEffect } from 'react';
import { X, Phone, MessageCircle, Heart, AlertTriangle, Shield } from 'lucide-react';
import { getEmergencyResources } from '@/lib/crisisMonitoring';

interface CrisisInterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  onSafetyPlanClick?: () => void;
  onResourcesClick?: () => void;
}

export default function CrisisInterventionModal({ 
  isOpen, 
  onClose, 
  riskLevel,
  onSafetyPlanClick,
  onResourcesClick
}: CrisisInterventionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userResponse, setUserResponse] = useState<'safe' | 'need_help' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setUserResponse(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const emergencyResources = getEmergencyResources();

  const getModalConfig = () => {
    switch (riskLevel) {
      case 'critical':
        return {
          title: "Immediate Support Needed",
          titleColor: "text-red-300",
          bgColor: "from-red-900/40 to-red-800/40",
          borderColor: "border-red-500/50",
          message: "We're very concerned about you right now. Your safety is our top priority.",
          showEmergency: true,
          autoClose: false
        };
      case 'high':
        return {
          title: "We're Here for You", 
          titleColor: "text-orange-300",
          bgColor: "from-orange-900/40 to-orange-800/40",
          borderColor: "border-orange-500/50",
          message: "It sounds like you're going through a really difficult time.",
          showEmergency: true,
          autoClose: false
        };
      case 'medium':
        return {
          title: "Checking In",
          titleColor: "text-yellow-300", 
          bgColor: "from-yellow-900/40 to-yellow-800/40",
          borderColor: "border-yellow-500/50",
          message: "We notice you might be struggling. How are you feeling right now?",
          showEmergency: false,
          autoClose: true
        };
      default:
        return {
          title: "Wellness Check",
          titleColor: "text-blue-300",
          bgColor: "from-blue-900/40 to-blue-800/40", 
          borderColor: "border-blue-500/50",
          message: "Your wellbeing matters to us. Here are some resources that might help.",
          showEmergency: false,
          autoClose: true
        };
    }
  };

  const config = getModalConfig();

  const handleEmergencyCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmergencyText = (number: string, message: string) => {
    window.open(`sms:${number}?body=${encodeURIComponent(message)}`, '_self');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-4xl mb-4">
          {riskLevel === 'critical' ? '🚨' : riskLevel === 'high' ? '❤️' : '💙'}
        </div>
        <h2 className={`text-2xl font-light mb-3 ${config.titleColor}`}>
          {config.title}
        </h2>
        <p className="text-white/80 text-base leading-relaxed mb-6">
          {config.message}
        </p>
      </div>

      {config.showEmergency && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-6">
          <h3 className="text-red-300 text-sm font-medium mb-3 flex items-center">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Emergency Resources
          </h3>
          <div className="space-y-3">
            {emergencyResources.map((resource, index) => (
              <button
                key={index}
                onClick={() => {
                  if (resource.phone) {
                    handleEmergencyCall(resource.phone);
                  } else if (resource.text) {
                    handleEmergencyText('741741', 'HOME');
                  }
                }}
                className="w-full bg-red-500/30 hover:bg-red-500/40 text-red-200 p-3 rounded-xl text-left transition-colors flex items-center"
              >
                {resource.phone && <Phone className="w-4 h-4 mr-3" />}
                {resource.text && <MessageCircle className="w-4 h-4 mr-3" />}
                <div>
                  <div className="font-medium">{resource.name}</div>
                  <div className="text-sm opacity-80">{resource.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <p className="text-white/70 text-sm">How are you feeling right now?</p>
        <div className="space-y-2">
          <button
            onClick={() => setUserResponse('safe')}
            className="w-full bg-green-500/20 hover:bg-green-500/30 text-green-300 p-3 rounded-xl transition-colors"
          >
            I'm safe and managing
          </button>
          <button
            onClick={() => setUserResponse('need_help')}
            className="w-full bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
          >
            I could use some support
          </button>
        </div>
      </div>

      {userResponse && (
        <div className="text-center">
          <button
            onClick={() => setCurrentStep(2)}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full text-sm transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {userResponse === 'safe' ? (
        <div className="text-center">
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-white text-xl font-light mb-3">
            We're glad you're safe
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            It takes courage to check in with yourself. Here are some tools to help you continue caring for your wellbeing.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <div className="text-4xl mb-4">💙</div>
          <h3 className="text-white text-xl font-light mb-3">
            You're not alone
          </h3>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Reaching out for support is a sign of strength. Let's connect you with resources that can help.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {onSafetyPlanClick && (
          <button
            onClick={onSafetyPlanClick}
            className="w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors text-left flex items-center"
          >
            <Shield className="w-5 h-5 mr-3" />
            <div>
              <div className="font-medium">Create Your Safety Plan</div>
              <div className="text-sm opacity-70">Prepare for difficult moments</div>
            </div>
          </button>
        )}

        {onResourcesClick && (
          <button
            onClick={onResourcesClick}
            className="w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors text-left flex items-center"
          >
            <Heart className="w-5 h-5 mr-3" />
            <div>
              <div className="font-medium">Find Support Resources</div>
              <div className="text-sm opacity-70">Connect with professional help</div>
            </div>
          </button>
        )}

        <button
          onClick={() => {
            console.log("Opening community support");
            onClose();
          }}
          className="w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors text-left flex items-center"
        >
          <MessageCircle className="w-5 h-5 mr-3" />
          <div>
            <div className="font-medium">Community Support</div>
            <div className="text-sm opacity-70">Connect with others on healing journeys</div>
          </div>
        </button>

        <button
          onClick={() => {
            console.log("Scheduling with Khepera");
            onClose();
          }}
          className="w-full bg-white/10 hover:bg-white/20 text-white p-4 rounded-xl transition-colors text-left flex items-center"
        >
          <div className="w-5 h-5 mr-3 rounded-full bg-white/20 flex items-center justify-center text-xs">K</div>
          <div>
            <div className="font-medium">Talk with Khepera</div>
            <div className="text-sm opacity-70">AI-guided reflection and support</div>
          </div>
        </button>
      </div>

      <div className="text-center">
        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-full text-sm transition-colors"
        >
          I'm set for now
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-gradient-to-br ${config.bgColor} backdrop-blur-md rounded-3xl p-6 max-w-md w-full border ${config.borderColor} max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-white/60 text-sm">Crisis Support</span>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white/80 transition-colors"
            disabled={riskLevel === 'critical' && currentStep === 1}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {currentStep === 1 ? renderStep1() : renderStep2()}

        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-white/40 text-xs text-center">
            Your privacy is protected. This check-in helps us provide better support.
          </p>
        </div>
      </div>
    </div>
  );
}