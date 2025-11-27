'use client';

import React, { useState } from 'react';
import Link from 'next/link';

/**
 * AI vs Human Service Distinction Components
 * Clearly differentiates between AI support and human professional services
 * Maintains healing-centered experience while meeting transparency requirements
 */

export interface ServiceOption {
  id: string;
  name: string;
  type: 'ai' | 'human';
  description: string;
  capabilities: string[];
  limitations: string[];
  availability: string;
  cost: string;
  urgency: 'immediate' | 'soon' | 'scheduled';
}

export const serviceOptions: ServiceOption[] = [
  {
    id: 'khepera-ai',
    name: 'Khepera AI Companion',
    type: 'ai',
    description: 'AI-powered emotional intelligence support for reflection and growth',
    capabilities: [
      'Emotional pattern recognition',
      'Personalized reflection prompts',
      'Trauma-informed responses',
      '24/7 availability',
      'Privacy-focused interactions',
      'Multilingual support'
    ],
    limitations: [
      'Cannot provide medical diagnosis',
      'Not a licensed therapist',
      'Cannot replace professional therapy',
      'AI-generated insights only',
      'Cannot handle crisis intervention'
    ],
    availability: 'Available now, 24/7',
    cost: 'Included in your plan',
    urgency: 'immediate'
  },
  {
    id: 'crisis-support',
    name: 'Crisis Support Services',
    type: 'human',
    description: 'Immediate human support for mental health emergencies',
    capabilities: [
      'Crisis intervention',
      'Suicide prevention',
      'Emergency mental health support',
      'Professional counselors',
      'Immediate safety planning',
      'Resource connection'
    ],
    limitations: [
      'May have wait times during peak hours',
      'Not available for ongoing therapy',
      'Emergency-focused support'
    ],
    availability: 'Available 24/7',
    cost: 'Free',
    urgency: 'immediate'
  },
  {
    id: 'therapy-services',
    name: 'Professional Therapy',
    type: 'human',
    description: 'Licensed mental health professionals for ongoing treatment',
    capabilities: [
      'Clinical diagnosis',
      'Evidence-based treatment',
      'Medication management referrals',
      'Specialized therapy approaches',
      'Treatment planning',
      'Insurance coverage'
    ],
    limitations: [
      'Requires appointments',
      'May have waiting lists',
      'Geographic limitations',
      'Insurance requirements'
    ],
    availability: 'By appointment',
    cost: 'Varies by insurance',
    urgency: 'scheduled'
  },
  {
    id: 'peer-support',
    name: 'Peer Support Groups',
    type: 'human',
    description: 'Community-based support from people with shared experiences',
    capabilities: [
      'Lived experience sharing',
      'Community connection',
      'Mutual support',
      'Various specializations',
      'Both online and in-person options',
      'Cultural and identity-specific groups'
    ],
    limitations: [
      'Not professional treatment',
      'Varies in quality and approach',
      'May not be available in all areas',
      'Scheduling constraints'
    ],
    availability: 'Scheduled sessions',
    cost: 'Often free or low-cost',
    urgency: 'soon'
  }
];

export interface AIHumanDistinctionProps {
  onServiceSelect: (service: ServiceOption) => void;
  showKheperaFirst?: boolean;
  context?: 'onboarding' | 'crisis' | 'settings' | 'help';
  className?: string;
}

export const AIHumanDistinction: React.FC<AIHumanDistinctionProps> = ({
  onServiceSelect,
  showKheperaFirst = true,
  context = 'onboarding',
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai' | 'human'>('all');

  const filteredServices = selectedCategory === 'all' 
    ? serviceOptions 
    : serviceOptions.filter(service => service.type === selectedCategory);

  const sortedServices = showKheperaFirst 
    ? [...filteredServices].sort((a, b) => a.type === 'ai' ? -1 : 1)
    : filteredServices;

  const getContextualMessage = () => {
    switch (context) {
      case 'crisis':
        return {
          title: "Immediate Support Options",
          subtitle: "Choose the type of support that feels right for your current situation",
          emphasis: "For immediate danger, please call 911 or go to your nearest emergency room"
        };
      case 'onboarding':
        return {
          title: "Choose Your Support Path",
          subtitle: "We offer both AI-powered and human professional support options",
          emphasis: "You can always change or combine these options later"
        };
      case 'settings':
        return {
          title: "Support Service Preferences",
          subtitle: "Manage your preferred types of support and how they're presented",
          emphasis: "These settings help personalize your support experience"
        };
      default:
        return {
          title: "Support Options Available",
          subtitle: "Explore the different ways we can support your emotional journey",
          emphasis: "Each option serves different needs and preferences"
        };
    }
  };

  const contextMessage = getContextualMessage();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">{contextMessage.title}</h2>
        <p className="text-gray-600 mb-2">{contextMessage.subtitle}</p>
        {contextMessage.emphasis && (
          <p className="text-sm font-medium text-blue-600 bg-blue-50 p-2 rounded-lg">
            {contextMessage.emphasis}
          </p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All Options
          </button>
          <button
            onClick={() => setSelectedCategory('ai')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'ai'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            ✨ AI Support
          </button>
          <button
            onClick={() => setSelectedCategory('human')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedCategory === 'human'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            👤 Human Support
          </button>
        </div>
      </div>

      {/* Service options */}
      <div className="grid gap-6 md:grid-cols-2">
        {sortedServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={() => onServiceSelect(service)}
            isRecommended={service.id === 'khepera-ai' && showKheperaFirst}
          />
        ))}
      </div>

      {/* Comparison table for detailed view */}
      {selectedCategory === 'all' && (
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Service</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Availability</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Best For</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Limitations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {serviceOptions.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {service.type === 'ai' ? '✨' : '👤'}
                        </span>
                        <span className="font-medium text-gray-900">{service.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{service.availability}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {service.capabilities.slice(0, 2).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {service.limitations[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legal disclaimer */}
      <div className="pt-6 border-t border-gray-200">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Important Information</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• AI support is not a replacement for professional medical care</li>
            <li>• Crisis situations require immediate human professional intervention</li>
            <li>• You can combine AI and human support for comprehensive care</li>
            <li>• All interactions are subject to our privacy policy and terms of service</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

interface ServiceCardProps {
  service: ServiceOption;
  onSelect: () => void;
  isRecommended?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, isRecommended }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getCardColor = () => {
    if (service.type === 'ai') return 'blue';
    if (service.urgency === 'immediate') return 'red';
    return 'green';
  };

  const cardColor = getCardColor();
  
  const colorClasses = {
    blue: {
      border: 'border-blue-200',
      bg: 'bg-blue-50',
      text: 'text-blue-900',
      button: 'bg-blue-600 hover:bg-blue-700',
      accent: 'text-blue-600'
    },
    red: {
      border: 'border-red-200',
      bg: 'bg-red-50',
      text: 'text-red-900',
      button: 'bg-red-600 hover:bg-red-700',
      accent: 'text-red-600'
    },
    green: {
      border: 'border-green-200',
      bg: 'bg-green-50',
      text: 'text-green-900',
      button: 'bg-green-600 hover:bg-green-700',
      accent: 'text-green-600'
    }
  };

  const colors = colorClasses[cardColor];

  return (
    <div className={`relative p-6 border rounded-lg ${colors.border} ${isRecommended ? 'ring-2 ring-blue-500' : ''}`}>
      {isRecommended && (
        <div className="absolute -top-2 left-4 px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded">
          Recommended
        </div>
      )}
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">
            {service.type === 'ai' ? '✨' : '👤'}
          </span>
          <div>
            <h3 className="font-medium text-gray-900">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Availability:</span>
          <span className={`font-medium ${colors.accent}`}>{service.availability}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Cost:</span>
          <span className="font-medium text-gray-900">{service.cost}</span>
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
        >
          {showDetails ? 'Hide' : 'Show'} details
          <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
            ▼
          </span>
        </button>
      </div>

      {showDetails && (
        <div className="space-y-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Capabilities:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {service.capabilities.map((capability, index) => (
                <li key={index}>• {capability}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Limitations:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {service.limitations.map((limitation, index) => (
                <li key={index}>• {limitation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <button
        onClick={onSelect}
        className={`w-full px-4 py-2 text-white font-medium rounded-lg transition-colors ${colors.button}`}
      >
        {service.type === 'ai' ? 'Start with Khepera' : 'Connect Now'}
      </button>
    </div>
  );
};

export default AIHumanDistinction;