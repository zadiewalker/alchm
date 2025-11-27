/**
 * Intelligent Technical Support Chat Component
 * 
 * Main interface for ALCHM's trauma-informed technical support chatbot.
 * Integrates with the backend triage engine to provide intelligent issue
 * detection, therapeutic responses, and seamless escalation to human support.
 * 
 * Features:
 * - Natural language understanding of user problems
 * - Trauma-informed response patterns
 * - Crisis detection and emergency resource provision
 * - Device-specific solution recommendations
 * - Therapeutic personality modes based on emotional state
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, Phone, MessageSquare, AlertTriangle, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface SupportMessage {
  id: string;
  sender: 'user' | 'khepera';
  content: string;
  timestamp: Date;
  type: 'text' | 'steps' | 'crisis-resources' | 'escalation';
  metadata?: {
    emotionalState?: string;
    urgencyLevel?: string;
    category?: string;
    stepNumber?: number;
    crisisResources?: CrisisResource[];
  };
}

interface CrisisResource {
  type: 'phone' | 'text' | 'chat' | 'local';
  name: string;
  contact: string;
  description: string;
  availability: string;
}

interface SupportSession {
  sessionId: string;
  status: 'active' | 'escalated' | 'completed';
  emotionalState: string;
  category: string;
  urgencyLevel: string;
  personalityMode: string;
}

interface DeviceContext {
  userAgent: string;
  platform: string;
  screenWidth: number;
  screenHeight: number;
}

export default function IntelligentTechSupportChat() {
  // State management
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<SupportSession | null>(null);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [satisfactionLevel, setSatisfactionLevel] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Device context detection
  const [deviceContext] = useState<DeviceContext>(() => ({
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
    platform: typeof window !== 'undefined' ? 
      (window.innerWidth < 768 ? 'mobile' : 'desktop') : 'desktop',
    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 1920,
    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 1080
  }));

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: SupportMessage = {
      id: 'welcome',
      sender: 'khepera',
      content: "✨ I am Khepera, your technical support companion. I'm here to help you navigate any challenges with your digital sanctuary using both technical knowledge and therapeutic care. What's bringing you here today?",
      timestamp: new Date(),
      type: 'text',
      metadata: {
        emotionalState: 'welcoming'
      }
    };
    setMessages([welcomeMessage]);
  }, []);

  // Handle sending user message
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: SupportMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      let response;
      
      if (!session) {
        // Start new support session
        response = await startTechSupportSession(inputText.trim());
        
        if (response.sessionId) {
          setSession({
            sessionId: response.sessionId,
            status: 'active',
            emotionalState: response.supportContext?.emotionalState || 'neutral',
            category: response.supportContext?.category || 'general',
            urgencyLevel: response.supportContext?.urgency || 'medium',
            personalityMode: response.response?.personalityMode || 'sage'
          });
        }
      } else {
        // Continue existing session
        response = await continueTechSupportSession(session.sessionId, inputText.trim());
      }

      // Process and display response
      await processKheperaResponse(response);
      
    } catch (error) {
      console.error('Support chat error:', error);
      
      const errorMessage: SupportMessage = {
        id: `error-${Date.now()}`,
        sender: 'khepera',
        content: "I'm experiencing some technical difficulties right now, but I still want to help you. While I work through this, please know that immediate support is available through 988 (call or text) if you're in crisis, or you can try refreshing this page in a moment.",
        timestamp: new Date(),
        type: 'text',
        metadata: {
          emotionalState: 'supportive'
        }
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Start new technical support session
  const startTechSupportSession = async (userInput: string) => {
    const response = await fetch('/api/support/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userInput,
        deviceContext
      })
    });

    if (!response.ok) throw new Error('Failed to start support session');
    return response.json();
  };

  // Continue existing support session
  const continueTechSupportSession = async (sessionId: string, userResponse: string) => {
    const response = await fetch('/api/support/continue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        userResponse,
        actionTaken: currentStep > 0 ? 'step_attempted' : 'general_response'
      })
    });

    if (!response.ok) throw new Error('Failed to continue support session');
    return response.json();
  };

  // Process Khepera's response and create appropriate message components
  const processKheperaResponse = async (response: any) => {
    const { response: supportResponse, crisisResources, supportContext } = response;
    
    // Add typing delay for more natural interaction
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Main response message
    const mainMessage: SupportMessage = {
      id: `khepera-${Date.now()}`,
      sender: 'khepera',
      content: `${supportResponse.greeting}\n\n${supportResponse.problemValidation}\n\n${supportResponse.emotionalAcknowledgment}`,
      timestamp: new Date(),
      type: 'text',
      metadata: {
        emotionalState: supportContext?.emotionalState,
        urgencyLevel: supportContext?.urgency,
        category: supportContext?.category
      }
    };

    setMessages(prev => [...prev, mainMessage]);

    // Add guidance steps if available
    if (supportResponse.guidance?.steps && supportResponse.guidance.steps.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const stepsMessage: SupportMessage = {
        id: `steps-${Date.now()}`,
        sender: 'khepera',
        content: "Here's how we can work through this together:",
        timestamp: new Date(),
        type: 'steps',
        metadata: {
          steps: supportResponse.guidance.steps,
          approach: supportResponse.guidance.approach,
          pacing: supportResponse.guidance.pacing
        }
      };

      setMessages(prev => [...prev, stepsMessage]);
    }

    // Add crisis resources if needed
    if (crisisResources && crisisResources.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const crisisMessage: SupportMessage = {
        id: `crisis-${Date.now()}`,
        sender: 'khepera',
        content: "I want to make sure you have immediate support available:",
        timestamp: new Date(),
        type: 'crisis-resources',
        metadata: {
          crisisResources
        }
      };

      setMessages(prev => [...prev, crisisMessage]);
      setShowCrisisResources(true);
    }

    // Add encouragement
    if (supportResponse.encouragement && supportResponse.encouragement.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const encouragementMessage: SupportMessage = {
        id: `encouragement-${Date.now()}`,
        sender: 'khepera',
        content: supportResponse.encouragement[0],
        timestamp: new Date(),
        type: 'text',
        metadata: {
          emotionalState: 'encouraging'
        }
      };

      setMessages(prev => [...prev, encouragementMessage]);
    }
  };

  // Handle step completion
  const handleStepCompleted = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    
    const completionMessage: SupportMessage = {
      id: `step-complete-${Date.now()}`,
      sender: 'user',
      content: `I completed step ${stepNumber}`,
      timestamp: new Date(),
      type: 'text',
      metadata: {
        stepNumber
      }
    };

    setMessages(prev => [...prev, completionMessage]);
    
    // Automatically continue with next guidance
    handleSendMessage();
  };

  // Handle crisis resource contact
  const handleCrisisContact = (resource: CrisisResource) => {
    if (resource.type === 'phone') {
      window.location.href = `tel:${resource.contact}`;
    } else if (resource.type === 'text') {
      window.location.href = `sms:${resource.contact}`;
    }
  };

  // Handle escalation to human support
  const handleEscalation = async () => {
    if (!session) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/support/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: session.sessionId,
          escalationReason: 'User requested human support',
          urgencyLevel: session.urgencyLevel
        })
      });

      if (response.ok) {
        const escalationData = await response.json();
        
        const escalationMessage: SupportMessage = {
          id: `escalation-${Date.now()}`,
          sender: 'khepera',
          content: escalationData.message,
          timestamp: new Date(),
          type: 'escalation',
          metadata: {
            escalationId: escalationData.escalationId,
            estimatedWaitTime: escalationData.estimatedWaitTime
          }
        };

        setMessages(prev => [...prev, escalationMessage]);
        setSession(prev => prev ? { ...prev, status: 'escalated' } : null);
      }
    } catch (error) {
      console.error('Escalation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle satisfaction rating
  const handleSatisfactionRating = async (rating: number) => {
    setSatisfactionLevel(rating);
    
    if (session) {
      try {
        await fetch('/api/support/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: session.sessionId,
            resolved: rating >= 3,
            satisfactionLevel: rating,
            resolutionType: 'technical-solution'
          })
        });
      } catch (error) {
        console.error('Failed to submit satisfaction rating:', error);
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-medium">Technical Support</h3>
              <p className="text-sm opacity-90">
                {session ? `${session.personalityMode} mode • ${session.category}` : 'Khepera AI Support'}
              </p>
            </div>
          </div>
          
          {/* Session status */}
          {session && (
            <div className="flex items-center gap-2">
              <Badge 
                variant={session.urgencyLevel === 'critical' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {session.urgencyLevel}
              </Badge>
              {session.status === 'escalated' && (
                <Badge variant="outline" className="text-xs bg-white/20 border-white/30">
                  Human Support Requested
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence>
          {messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              onStepCompleted={handleStepCompleted}
              onCrisisContact={handleCrisisContact}
              currentStep={currentStep}
            />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-gray-500"
          >
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-purple-600" />
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Crisis Resources Panel */}
      {showCrisisResources && (
        <div className="bg-red-50 border-t border-red-200 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h4 className="font-medium text-red-800">Immediate Support Available</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleCrisisContact({ type: 'phone', contact: '988', name: '988 Lifeline', description: '', availability: '' })}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              <Phone className="w-4 h-4 mr-2" />
              Call 988
            </Button>
            <Button
              onClick={() => handleCrisisContact({ type: 'text', contact: '741741', name: 'Crisis Text', description: '', availability: '' })}
              variant="outline"
              className="border-red-600 text-red-600 hover:bg-red-50"
              size="sm"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Text 741741
            </Button>
          </div>
        </div>
      )}

      {/* Satisfaction Rating */}
      {session?.status === 'completed' && satisfactionLevel === null && (
        <div className="bg-blue-50 border-t border-blue-200 p-4">
          <h4 className="font-medium text-blue-800 mb-3">How was your support experience?</h4>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <Button
                key={rating}
                onClick={() => handleSatisfactionRating(rating)}
                variant="outline"
                size="sm"
                className="hover:bg-blue-100"
              >
                {rating} ⭐
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={session?.status === 'escalated' 
                ? 'Human support is being arranged...' 
                : 'Describe what\'s happening with your ALCHM sanctuary...'}
              className="resize-none min-h-[60px] max-h-[120px]"
              disabled={isLoading || session?.status === 'escalated'}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading || session?.status === 'escalated'}
              className="bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
            
            {session && session.status === 'active' && (
              <Button 
                onClick={handleEscalation}
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={isLoading}
              >
                <User className="w-3 h-3 mr-1" />
                Human Help
              </Button>
            )}
          </div>
        </div>
        
        <p className="text-xs text-gray-500 mt-2">
          Your privacy is protected. Technical details are analyzed to help, but personal content isn't stored.
        </p>
      </div>
    </div>
  );
}

// Message Component
interface MessageComponentProps {
  message: SupportMessage;
  onStepCompleted: (stepNumber: number) => void;
  onCrisisContact: (resource: CrisisResource) => void;
  currentStep: number;
}

function MessageComponent({ 
  message, 
  onStepCompleted, 
  onCrisisContact, 
  currentStep 
}: MessageComponentProps) {
  const isUser = message.sender === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] ${isUser ? 'order-2' : ''}`}>
        {/* Avatar */}
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-blue-600' : 'bg-purple-100'
          }`}>
            {isUser ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              <Bot className="w-4 h-4 text-purple-600" />
            )}
          </div>

          <div className={`flex-1 ${isUser ? 'text-right' : ''}`}>
            {/* Message content */}
            <Card className={`p-4 ${
              isUser 
                ? 'bg-blue-600 text-white' 
                : message.type === 'crisis-resources'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white dark:bg-gray-800'
            }`}>
              {message.type === 'steps' ? (
                <StepsComponent 
                  steps={message.metadata?.steps || []}
                  onStepCompleted={onStepCompleted}
                  currentStep={currentStep}
                  approach={message.metadata?.approach}
                  pacing={message.metadata?.pacing}
                />
              ) : message.type === 'crisis-resources' ? (
                <CrisisResourcesComponent 
                  resources={message.metadata?.crisisResources || []}
                  onContact={onCrisisContact}
                />
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </Card>

            {/* Timestamp */}
            <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : ''}`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Steps Component
interface StepsComponentProps {
  steps: any[];
  onStepCompleted: (stepNumber: number) => void;
  currentStep: number;
  approach?: string;
  pacing?: string;
}

function StepsComponent({ steps, onStepCompleted, currentStep, approach, pacing }: StepsComponentProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <Badge variant="outline" className="text-xs">
          {approach} approach
        </Badge>
        <Badge variant="outline" className="text-xs">
          {pacing} pacing
        </Badge>
      </div>
      
      {steps.map((step, index) => (
        <div 
          key={index}
          className={`p-3 rounded-lg border ${
            index < currentStep 
              ? 'bg-green-50 border-green-200' 
              : index === currentStep
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
              index < currentStep
                ? 'bg-green-600 text-white'
                : index === currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-400 text-white'
            }`}>
              {step.stepNumber}
            </div>
            
            <div className="flex-1">
              <p className="font-medium">{step.therapeuticFraming}</p>
              {step.encouragementPhrase && (
                <p className="text-sm text-gray-600 mt-1 italic">{step.encouragementPhrase}</p>
              )}
              {step.safetyCheck && (
                <p className="text-sm text-orange-600 mt-2">⚠️ {step.safetyCheck}</p>
              )}
              
              {index === currentStep && (
                <Button
                  onClick={() => onStepCompleted(step.stepNumber)}
                  size="sm"
                  className="mt-3"
                >
                  Mark as Completed
                </Button>
              )}
              
              {step.celebrationMoment && index < currentStep && (
                <p className="text-sm text-green-600 mt-2 font-medium">{step.celebrationMoment}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Crisis Resources Component
interface CrisisResourcesComponentProps {
  resources: CrisisResource[];
  onContact: (resource: CrisisResource) => void;
}

function CrisisResourcesComponent({ resources, onContact }: CrisisResourcesComponentProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-red-800 mb-3">
        <AlertTriangle className="w-5 h-5" />
        <h4 className="font-medium">Immediate Support Available</h4>
      </div>
      
      {resources.map((resource, index) => (
        <div key={index} className="p-3 bg-white rounded-lg border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-red-800">{resource.name}</h5>
              <p className="text-sm text-gray-600">{resource.description}</p>
              <p className="text-xs text-gray-500">{resource.availability}</p>
            </div>
            <Button
              onClick={() => onContact(resource)}
              className="bg-red-600 hover:bg-red-700 text-white"
              size="sm"
            >
              {resource.type === 'phone' ? (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  Call {resource.contact}
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Text {resource.contact}
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}