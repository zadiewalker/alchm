'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  type: 'user' | 'bot' | 'system';
  content: string;
  timestamp: Date;
  quickActions?: QuickAction[];
  attachments?: Attachment[];
  success?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  category: 'diagnostic' | 'account' | 'payment' | 'technical' | 'crisis';
  action: () => void;
}

interface Attachment {
  id: string;
  type: 'screenshot' | 'log' | 'recording';
  name: string;
  size: number;
  url?: string;
}

interface ChatStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  current: boolean;
}

export function TechnicalSupportChatbot() {
  const { user } = useAuth() || { user: null }; // Fallback if not wrapped in AuthProvider
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatSteps, setChatSteps] = useState<ChatStep[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadDragActive, setUploadDragActive] = useState(false);
  const [highContrastMode, setHighContrastMode] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Firebase Functions with error handling
  const [functions, setFunctions] = useState<any>(null);
  const [startTechSupport, setStartTechSupport] = useState<any>(null);
  const [continueTechSupport, setContinueTechSupport] = useState<any>(null);
  const [completeTechSupport, setCompleteTechSupport] = useState<any>(null);

  // Initialize Firebase Functions
  useEffect(() => {
    const initializeFunctions = async () => {
      try {
        const funcs = getFunctions();
        setFunctions(funcs);
        setStartTechSupport(() => httpsCallable(funcs, 'startSimpleTechSupport'));
        setContinueTechSupport(() => httpsCallable(funcs, 'continueSimpleTechSupport'));
        setCompleteTechSupport(() => httpsCallable(funcs, 'completeSimpleTechSupport'));
      } catch (error) {
        console.warn('Firebase Functions initialization failed:', error);
        // Functions will remain null, fallback behavior will be used
      }
    };
    
    if (isClient) {
      initializeFunctions();
    }
  }, [isClient]);

  // Detect mobile and accessibility preferences
  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    const checkPreferences = () => {
      setHighContrastMode(window.matchMedia('(prefers-contrast: high)').matches);
      setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    };

    checkMobile();
    checkPreferences();
    
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (chatEndRef.current && !reducedMotion) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, reducedMotion]);

  // Initialize with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat();
    }
  }, [isOpen]);

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      type: 'bot',
      content: '✨ I am Khepera, here to help you with any technical questions about ALCHM. Your sanctuary should work seamlessly to support your healing journey. What can I assist you with today?',
      timestamp: new Date(),
      quickActions: [
        {
          id: 'login-help',
          label: 'Login Issues',
          icon: '🔐',
          category: 'account',
          action: () => handleQuickAction('I can\'t log into my account')
        },
        {
          id: 'app-crash',
          label: 'App Problems',
          icon: '⚡',
          category: 'technical',
          action: () => handleQuickAction('The app is crashing or not working properly')
        },
        {
          id: 'sync-issues',
          label: 'Journal Issues',
          icon: '📝',
          category: 'technical',
          action: () => handleQuickAction('My journal entries aren\'t saving or syncing')
        },
        {
          id: 'payment-help',
          label: 'Billing Questions',
          icon: '💳',
          category: 'payment',
          action: () => handleQuickAction('I have questions about billing or subscription')
        }
      ]
    };
    
    setMessages([welcomeMessage]);
  };

  const handleQuickAction = useCallback(async (userInput: string) => {
    // Add user message first
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: userInput,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Call the API
    await startSupportSession(userInput);
  }, []);

  // Start a new support session with Firebase Functions
  const startSupportSession = async (userInput: string) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setIsTyping(true);
    
    // Fallback behavior if Firebase Functions aren't available
    if (!startTechSupport) {
      addFallbackResponse(userInput);
      setIsLoading(false);
      setIsTyping(false);
      return;
    }
    
    try {
      const result = await startTechSupport({
        userInput,
        deviceContext: {
          platform: navigator.platform,
          userAgent: navigator.userAgent,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height,
          isMobile
        }
      });
      
      const data = result.data as any;
      setCurrentSessionId(data.sessionId);
      
      // Add bot response
      const botMessage: Message = {
        id: data.sessionId + '_response',
        type: 'bot',
        content: data.response.greeting + '\n\n' + data.response.acknowledgment,
        timestamp: new Date(),
        success: false
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Add guidance if available
      if (data.response.guidance?.steps?.length > 0) {
        const guidanceMessage: Message = {
          id: data.sessionId + '_guidance',
          type: 'bot',
          content: data.response.guidance.steps.map((step: any, index: number) => 
            `${index + 1}. ${step.therapeuticFraming || step.technicalAction || step}`
          ).join('\n\n'),
          timestamp: new Date(),
          success: false
        };
        setMessages(prev => [...prev, guidanceMessage]);
      }
      
      // Add encouragement
      if (data.response.encouragement?.length > 0) {
        const encouragementMessage: Message = {
          id: data.sessionId + '_encouragement',
          type: 'bot',
          content: data.response.encouragement[0],
          timestamp: new Date(),
          success: true
        };
        setMessages(prev => [...prev, encouragementMessage]);
      }
      
      // Show crisis resources if present
      if (data.crisisResources) {
        const crisisMessage: Message = {
          id: data.sessionId + '_crisis',
          type: 'system',
          content: 'Emergency resources are available:\n\n' + 
            data.crisisResources.immediate.map((resource: any) => 
              `${resource.type === 'phone' ? '📞' : '💬'} ${resource.description}: ${resource.contact}`
            ).join('\n'),
          timestamp: new Date(),
          success: false
        };
        setMessages(prev => [...prev, crisisMessage]);
      }
      
    } catch (error) {
      console.error('Support session error:', error);
      const errorMessage: Message = {
        id: 'error_' + Date.now(),
        type: 'bot',
        content: '✨ I\'m experiencing some technical difficulties, but I\'m still here to help. Please try describing your issue in your own words, or contact human support if this persists.',
        timestamp: new Date(),
        success: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Continue existing session
  const continueSession = async (userResponse: string, actionTaken?: string) => {
    if (!currentSessionId || isLoading) return;
    
    setIsLoading(true);
    setIsTyping(true);
    
    // Fallback if Firebase Functions aren't available
    if (!continueTechSupport) {
      addFallbackResponse(userResponse);
      setIsLoading(false);
      setIsTyping(false);
      return;
    }
    
    try {
      const result = await continueTechSupport({
        sessionId: currentSessionId,
        userResponse,
        actionTaken: actionTaken || 'user_message'
      });
      
      const data = result.data as any;
      
      const botMessage: Message = {
        id: currentSessionId + '_continue_' + Date.now(),
        type: 'bot',
        content: data.response.message || 'Thank you for that information. How can I help you further?',
        timestamp: new Date(),
        success: data.response.completed || false
      };
      setMessages(prev => [...prev, botMessage]);
      
      // Handle different response types
      if (data.response.alternatives) {
        const altMessage: Message = {
          id: currentSessionId + '_alternatives_' + Date.now(),
          type: 'bot',
          content: 'Here are some alternative approaches:\n\n' + 
            data.response.alternatives.map((alt: string, index: number) => `${index + 1}. ${alt}`).join('\n'),
          timestamp: new Date()
        };
        setMessages(prev => [...prev, altMessage]);
      }
      
    } catch (error) {
      console.error('Continue session error:', error);
      const errorMessage: Message = {
        id: 'continue_error_' + Date.now(),
        type: 'bot',
        content: 'I\'m having trouble processing that. Could you try rephrasing your response?',
        timestamp: new Date(),
        success: false
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Fallback response when Firebase Functions aren't available
  const addFallbackResponse = (userInput: string) => {
    const input = userInput.toLowerCase();
    let response = '';
    
    if (input.includes('login') || input.includes('sign in') || input.includes('password')) {
      response = '✨ I understand you\'re having trouble with logging in. Here are some steps that often help:\n\n1. Try refreshing your browser\n2. Clear your browser cache and cookies\n3. Try using an incognito/private browsing window\n4. Make sure you\'re using the correct email address\n\nIf these don\'t work, you can also try resetting your password. Your healing sanctuary should always be accessible to you.';
    } else if (input.includes('journal') || input.includes('save') || input.includes('writing')) {
      response = '✨ I can sense your concern about your journal entries. Your words are precious and important. Here\'s what I recommend:\n\n1. Try copying your text as a backup before doing anything else\n2. Refresh the page and see if your entry reappears\n3. Check if you\'re still logged in\n4. Try creating a new entry if the current one seems stuck\n\nYour writing and healing practice matter deeply.';
    } else if (input.includes('payment') || input.includes('billing') || input.includes('subscription')) {
      response = '✨ I understand billing concerns can create additional stress around your healing resources. Let me help:\n\n1. Check your email for any recent billing notifications\n2. Verify your payment method is up to date\n3. Review your subscription status in your account settings\n4. Contact our billing support if charges seem incorrect\n\nYour access to healing support shouldn\'t be a source of worry.';
    } else if (input.includes('crash') || input.includes('broken') || input.includes('not working')) {
      response = '✨ Technology issues can be really frustrating, especially when they affect your healing space. Let\'s troubleshoot this together:\n\n1. Try refreshing your browser or restarting the app\n2. Make sure you have a stable internet connection\n3. Check if you have enough device storage space\n4. Try accessing ALCHM from a different browser or device\n\nYour sanctuary should work smoothly to support your journey.';
    } else {
      response = '✨ I hear you and I want to help with your technical concern. While I\'m experiencing some system limitations right now, here are some general troubleshooting steps:\n\n1. Try refreshing your browser or app\n2. Check your internet connection\n3. Clear your browser cache if needed\n4. Try accessing from a different device\n\nFor personalized assistance, you can also reach out to our human support team. Your healing journey shouldn\'t be interrupted by technical issues.';
    }
    
    setTimeout(() => {
      const message: Message = {
        id: 'fallback_' + Date.now(),
        type: 'bot',
        content: response,
        timestamp: new Date(),
        success: false
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, reducedMotion ? 500 : 1500);
  };

  const addBotMessage = (content: string, success = false) => {
    setIsTyping(true);
    setTimeout(() => {
      const message: Message = {
        id: Date.now().toString(),
        type: 'bot',
        content,
        timestamp: new Date(),
        success
      };
      setMessages(prev => [...prev, message]);
      setIsTyping(false);
    }, reducedMotion ? 100 : 1000);
  };

  const handleSendMessage = async () => {
    if (!currentInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const messageContent = currentInput;
    setCurrentInput('');

    // If no session exists, start a new one
    if (!currentSessionId) {
      await startSupportSession(messageContent);
    } else {
      // Continue existing session
      await continueSession(messageContent);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        addBotMessage('File too large. Please upload files smaller than 10MB.');
        return;
      }

      const attachment: Attachment = {
        id: Date.now().toString(),
        type: file.type.startsWith('image/') ? 'screenshot' : 'log',
        name: file.name,
        size: file.size
      };

      const message: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: `Uploaded: ${file.name}`,
        timestamp: new Date(),
        attachments: [attachment]
      };

      setMessages(prev => [...prev, message]);
      addBotMessage('Thank you for the screenshot! I can see the issue now. Let me analyze this and provide a solution.', true);
    });
  };

  const completeStep = (stepId: string) => {
    setChatSteps(prev => prev.map(step => {
      if (step.id === stepId) {
        return { ...step, completed: true, current: false };
      }
      if (step.completed) return step;
      if (parseInt(step.id) === parseInt(stepId) + 1) {
        return { ...step, current: true };
      }
      return step;
    }));

    addBotMessage('Great! That step is complete. Ready for the next one?', true);
  };

  // Floating Action Button
  const FloatingButton = () => (
    <button
      onClick={() => setIsOpen(true)}
      className={`fixed bottom-20 right-6 z-40 ${
        isMobile ? 'w-16 h-16' : 'w-14 h-14'
      } rounded-full shadow-nurturing transition-all duration-300 ${
        highContrastMode 
          ? 'bg-white border-4 border-sage-600' 
          : 'bg-sanctuary-glass border border-sage-200/60 backdrop-blur-xl'
      } hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-sage-400/50`}
      style={{
        touchAction: 'manipulation',
        background: highContrastMode 
          ? 'white' 
          : 'linear-gradient(145deg, rgba(254, 252, 251, 0.95) 0%, rgba(254, 252, 251, 0.85) 100%)'
      }}
      aria-label="Open technical support chat"
    >
      <span className="text-2xl">💬</span>
    </button>
  );

  // Main Chat Interface
  if (!isOpen) return <FloatingButton />;

  return (
    <>
      <FloatingButton />
      
      {/* Chat Container */}
      <div 
        className={`fixed inset-0 z-50 flex items-end justify-end ${
          isMobile ? 'p-0' : 'p-6'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
        
        {/* Chat Window */}
        <Card 
          className={`relative ${
            isMobile 
              ? 'w-full h-full rounded-t-3xl rounded-b-none' 
              : 'w-96 h-[32rem] rounded-2xl'
          } bg-sanctuary-white/98 backdrop-blur-2xl border-sage-200/60 shadow-sacred overflow-hidden flex flex-col`}
          style={{
            maxHeight: isMobile ? '100vh' : '32rem',
            animation: reducedMotion 
              ? 'none' 
              : isMobile 
                ? 'slide-up-mobile 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                : 'slide-up 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
          }}
        >
          {/* Header */}
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-sage-100/50 bg-sage-50/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-400 to-sage-500 flex items-center justify-center shadow-soft">
                <span className="text-white text-lg">🤖</span>
              </div>
              <div>
                <h3 className="font-medium text-sanctuary-gray-800 text-lg">
                  Technical Support
                </h3>
                <p className="text-sm text-sanctuary-gray-600">
                  Here to help you
                </p>
              </div>
            </div>
            
            {/* Accessibility Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHighContrastMode(!highContrastMode)}
                className="w-8 h-8 rounded-lg bg-sanctuary-gray-100 hover:bg-sanctuary-gray-200 flex items-center justify-center transition-colors"
                aria-label="Toggle high contrast mode"
              >
                <span className="text-sm">🎨</span>
              </button>
              
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="w-8 h-8 rounded-lg bg-sanctuary-gray-100 hover:bg-sanctuary-gray-200 flex items-center justify-center transition-colors"
                aria-label="Toggle voice input"
              >
                <span className="text-sm">{voiceEnabled ? '🎤' : '🔇'}</span>
              </button>
              
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg bg-sanctuary-gray-100 hover:bg-sanctuary-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close chat"
              >
                <span className="text-sm">✕</span>
              </button>
            </div>
          </CardHeader>

          {/* Progress Steps */}
          {chatSteps.length > 0 && (
            <div className="p-4 border-b border-sage-100/50 bg-sage-25/30">
              <h4 className="text-sm font-medium text-sanctuary-gray-700 mb-3">
                Progress Steps
              </h4>
              <div className="space-y-2">
                {chatSteps.map(step => (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      step.completed 
                        ? 'bg-sage-100/50 text-sanctuary-gray-600' 
                        : step.current 
                          ? 'bg-sage-200/30 border border-sage-300/50' 
                          : 'text-sanctuary-gray-400'
                    }`}
                  >
                    <button
                      onClick={() => !step.completed && step.current && completeStep(step.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                        step.completed 
                          ? 'bg-sage-400 text-white' 
                          : step.current 
                            ? 'border-2 border-sage-400 hover:bg-sage-400 hover:text-white cursor-pointer' 
                            : 'border-2 border-sanctuary-gray-200'
                      }`}
                      disabled={!step.current || step.completed}
                      aria-label={`${step.completed ? 'Completed' : step.current ? 'Complete' : 'Pending'}: ${step.title}`}
                    >
                      {step.completed ? '✓' : step.current ? '○' : '○'}
                    </button>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{step.title}</div>
                      <div className="text-xs text-sanctuary-gray-500">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-sage-400 text-white'
                      : message.success
                        ? 'bg-green-50 border border-green-200 text-green-800'
                        : 'bg-sanctuary-gray-50 text-sanctuary-gray-800'
                  } transition-all ${
                    reducedMotion ? '' : 'animate-fade-in'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.success && (
                    <div className="flex items-center gap-1 mt-2 text-green-600">
                      <span className="text-lg">✨</span>
                      <span className="text-xs font-medium">Solution found!</span>
                    </div>
                  )}
                  
                  {message.attachments && (
                    <div className="mt-2 p-2 bg-white/50 rounded-lg">
                      {message.attachments.map(attachment => (
                        <div key={attachment.id} className="flex items-center gap-2 text-xs">
                          <span>📎</span>
                          <span>{attachment.name}</span>
                          <span className="text-sanctuary-gray-500">
                            ({(attachment.size / 1024).toFixed(1)}KB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.quickActions && (
                    <div className="mt-3 grid grid-cols-2 gap-2">
                      {message.quickActions.map(action => (
                        <Button
                          key={action.id}
                          onClick={action.action}
                          variant="secondary"
                          size="sm"
                          className="text-xs h-8 justify-start"
                        >
                          <span className="mr-1">{action.icon}</span>
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-sanctuary-gray-50 p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-sanctuary-gray-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-sanctuary-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-sanctuary-gray-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </CardContent>

          {/* File Upload Area */}
          {showUpload && (
            <div className="p-4 border-t border-sage-100/50 bg-sage-25/20">
              <div
                className={`border-2 border-dashed rounded-xl p-4 text-center transition-all ${
                  uploadDragActive 
                    ? 'border-sage-400 bg-sage-50/50' 
                    : 'border-sanctuary-gray-200 hover:border-sage-300'
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setUploadDragActive(true);
                }}
                onDragLeave={() => setUploadDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setUploadDragActive(false);
                  handleFileUpload(e.dataTransfer.files);
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.txt,.log"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />
                <div className="space-y-2">
                  <div className="text-2xl">📸</div>
                  <p className="text-sm text-sanctuary-gray-600">
                    Drop screenshots or logs here
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    size="sm"
                  >
                    Choose Files
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Input Area */}
          <CardFooter className="p-4 border-t border-sage-100/50">
            <div className="flex gap-2 w-full">
              <input
                ref={inputRef}
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 px-4 py-3 rounded-xl border border-sanctuary-gray-200 bg-white/90 focus:border-sage-400 focus:ring-2 focus:ring-sage-400/20 outline-none transition-all ${
                  isMobile ? 'text-base' : 'text-sm'
                }`}
                style={{ fontSize: isMobile ? '16px' : '14px' }} // Prevent zoom on iOS
              />
              <Button
                onClick={handleSendMessage}
                disabled={!currentInput.trim()}
                size={isMobile ? 'touch' : 'default'}
                className="px-4"
              >
                <span className="text-lg">📤</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes slide-up-mobile {
          from {
            opacity: 0;
            transform: translateY(100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}