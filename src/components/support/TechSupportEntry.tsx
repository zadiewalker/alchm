/**
 * Technical Support Entry Component
 * 
 * Simple entry point for ALCHM's intelligent technical support system.
 * Can be integrated into existing pages or used as a standalone support page.
 * Provides easy access to trauma-informed technical assistance.
 */

'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Wrench, 
  Heart, 
  Shield, 
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import IntelligentTechSupportChat from './IntelligentTechSupportChat';

interface TechSupportEntryProps {
  embedded?: boolean;
  onClose?: () => void;
  defaultOpen?: boolean;
}

export default function TechSupportEntry({ 
  embedded = false, 
  onClose,
  defaultOpen = false 
}: TechSupportEntryProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleOpenSupport = (category?: string) => {
    setSelectedCategory(category || null);
    setIsOpen(true);
  };

  const handleCloseSupport = () => {
    setIsOpen(false);
    setSelectedCategory(null);
    onClose?.();
  };

  if (isOpen) {
    return (
      <div className={embedded ? 'h-full' : 'fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'}>
        <div className={`${embedded ? 'h-full' : 'w-full max-w-4xl h-[90vh]'} bg-white rounded-lg shadow-xl overflow-hidden`}>
          <div className="h-full flex flex-col">
            {!embedded && (
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-semibold">Technical Support</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCloseSupport}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </Button>
              </div>
            )}
            <div className="flex-1 min-h-0">
              <IntelligentTechSupportChat />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${embedded ? 'w-full' : 'max-w-4xl mx-auto'} p-6`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Technical Support</h1>
            <p className="text-gray-600 dark:text-gray-300">Khepera-powered assistance for your digital sanctuary</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <Heart className="w-3 h-3 mr-1" />
            Trauma-Informed
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Shield className="w-3 h-3 mr-1" />
            Crisis-Aware
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Zap className="w-3 h-3 mr-1" />
            Intelligent Triage
          </Badge>
        </div>
      </div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-6 mb-8"
      >
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <div className="flex items-center gap-4 mb-4">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Start a Support Conversation</h2>
              <p className="text-gray-600">Describe what's happening with your ALCHM sanctuary</p>
            </div>
          </div>
          <Button 
            onClick={() => handleOpenSupport()}
            className="bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            Start Chat with Khepera
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Card>
      </motion.div>

      {/* Common Issues */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Common Issues</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {COMMON_ISSUES.map((issue, index) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className="p-4 cursor-pointer hover:shadow-md transition-shadow border-gray-200 hover:border-purple-300"
                onClick={() => handleOpenSupport(issue.category)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${issue.color}`}>
                    <issue.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white mb-1">{issue.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{issue.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {issue.urgency} priority
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">How We Support You</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {SUPPORT_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start gap-4"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${feature.color}`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Emergency Resources */}
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Crisis Support Always Available</h3>
        </div>
        <p className="text-red-700 mb-4">
          If you're experiencing a crisis, immediate support is available regardless of any technical issues:
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={() => window.location.href = 'tel:988'}
            className="bg-red-600 hover:bg-red-700 text-white"
            size="sm"
          >
            Call 988
          </Button>
          <Button 
            onClick={() => window.location.href = 'sms:741741'}
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
            size="sm"
          >
            Text 741741
          </Button>
        </div>
      </Card>
    </div>
  );
}

// Common issues data
const COMMON_ISSUES = [
  {
    id: 'login',
    title: 'Login Problems',
    description: "Can't access your account or having authentication issues",
    category: 'login_auth',
    urgency: 'high',
    icon: Shield,
    color: 'bg-orange-500'
  },
  {
    id: 'journal',
    title: 'Journal Not Saving',
    description: 'Writing disappears or auto-save not working',
    category: 'journal_writing',
    urgency: 'high',
    icon: MessageSquare,
    color: 'bg-red-500'
  },
  {
    id: 'mobile',
    title: 'Mobile App Issues',
    description: 'App crashes, slow performance, or installation problems',
    category: 'mobile_app',
    urgency: 'medium',
    icon: Zap,
    color: 'bg-blue-500'
  },
  {
    id: 'sync',
    title: 'Data Sync Problems',
    description: 'Missing entries or sync failures across devices',
    category: 'sync_data',
    urgency: 'high',
    icon: Wrench,
    color: 'bg-purple-500'
  },
  {
    id: 'payment',
    title: 'Billing Issues',
    description: 'Payment problems, charges, or subscription questions',
    category: 'payment_billing',
    urgency: 'medium',
    icon: Shield,
    color: 'bg-green-500'
  },
  {
    id: 'performance',
    title: 'Slow Performance',
    description: 'Pages loading slowly or site not responding',
    category: 'performance_speed',
    urgency: 'low',
    icon: Zap,
    color: 'bg-yellow-500'
  }
];

// Support features data
const SUPPORT_FEATURES = [
  {
    title: 'Trauma-Informed Responses',
    description: 'Every interaction is designed with therapeutic principles, acknowledging that technical problems can create stress and emotional overwhelm.',
    icon: Heart,
    color: 'bg-pink-500'
  },
  {
    title: 'Crisis Detection & Resources',
    description: 'Our system recognizes when users might be in crisis and immediately provides emergency resources while maintaining technical support.',
    icon: Shield,
    color: 'bg-red-500'
  },
  {
    title: 'Intelligent Issue Categorization',
    description: 'Advanced natural language processing understands your problem and routes you to the most effective solutions quickly.',
    icon: Zap,
    color: 'bg-blue-500'
  },
  {
    title: 'Device-Specific Solutions',
    description: 'Solutions are tailored to your specific device, browser, and technical context for maximum effectiveness.',
    icon: Wrench,
    color: 'bg-purple-500'
  }
];