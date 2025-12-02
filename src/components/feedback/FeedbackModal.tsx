'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { getFirebaseAuth } from '@/lib/firebase';
import { 
  FeedbackType, 
  FeedbackData, 
  FEEDBACK_TYPES, 
  getDeviceInfo, 
  getScreenSize 
} from '@/lib/feedback';
import { FeedbackSuccess } from './FeedbackSuccess';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [step, setStep] = useState<'type' | 'message' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<FeedbackType | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  // Get current user
  useEffect(() => {
    if (isOpen) {
      getFirebaseAuth().then(auth => {
        setCurrentUser(auth.currentUser);
      }).catch(() => {
        setCurrentUser(null);
      });
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      // Delay reset to allow exit animation
      setTimeout(() => {
        setStep('type');
        setSelectedType(null);
        setMessage('');
        setError(null);
      }, 300);
    }
  }, [isOpen]);

  // Auto-focus textarea when moving to message step
  useEffect(() => {
    if (step === 'message' && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [step]);

  const handleTypeSelect = (type: FeedbackType) => {
    setSelectedType(type);
    setStep('message');
  };

  const handleSubmit = async () => {
    if (!selectedType || !message.trim()) return;

    setIsSubmitting(true);
    setError(null);

    const feedbackData: FeedbackData = {
      type: selectedType,
      message: message.trim(),
      context: {
        page: pathname,
        userId: currentUser?.uid || null,
        isAnonymous: currentUser?.isAnonymous || true,
        timestamp: new Date().toISOString(),
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        buildNumber: process.env.NEXT_PUBLIC_BUILD_NUMBER || '1',
        deviceInfo: getDeviceInfo(),
        screenSize: getScreenSize(),
      },
    };

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });

      if (!response.ok) {
        throw new Error('Failed to send feedback');
      }

      setStep('success');
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
      }, 2500);
      
    } catch (err) {
      console.error('Feedback error:', err);
      setError('Couldn\'t send feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step === 'message') {
      setStep('type');
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-50 
                       bg-gray-50 rounded-t-[32px] shadow-2xl
                       max-h-[85vh] overflow-hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>

            {/* Content Container */}
            <div className="overflow-y-auto max-h-[calc(85vh-16px)]">
              <div className="p-6">
              {/* Step: Type Selection */}
              <AnimatePresence mode="wait">
                {step === 'type' && (
                  <motion.div
                    key="type"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-1">
                          Share your thoughts
                        </h2>
                        <p className="text-gray-600">
                          What's on your mind?
                        </p>
                      </div>
                      <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Close feedback modal"
                      >
                        <CloseIcon className="w-6 h-6 text-gray-500" />
                      </button>
                    </div>

                    {/* Type Options */}
                    <div className="space-y-3 mb-8">
                      {(Object.entries(FEEDBACK_TYPES) as [FeedbackType, typeof FEEDBACK_TYPES[FeedbackType]][]).map(
                        ([type, config]) => (
                          <motion.button
                            key={type}
                            onClick={() => handleTypeSelect(type)}
                            className="w-full p-4 rounded-2xl bg-white
                                     border-2 border-transparent
                                     hover:border-[#a4b792]/30
                                     active:scale-[0.98]
                                     transition-all duration-200
                                     flex items-center gap-4 text-left
                                     shadow-sm hover:shadow-md"
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-2xl">
                              {config.icon}
                            </span>
                            <span className="text-lg font-medium text-gray-800">
                              {config.label}
                            </span>
                            <ChevronRightIcon className="w-5 h-5 text-gray-400 ml-auto" />
                          </motion.button>
                        )
                      )}
                    </div>

                    {/* Version info */}
                    <p className="text-xs text-gray-400 text-center">
                      v{process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'} • {pathname}
                    </p>
                  </motion.div>
                )}

                {/* Step: Message Input */}
                {step === 'message' && selectedType && (
                  <motion.div
                    key="message"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Header with Back */}
                    <div className="flex items-center justify-between mb-6">
                      <button
                        onClick={handleBack}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        aria-label="Go back"
                      >
                        <ChevronLeftIcon className="w-6 h-6 text-gray-500" />
                      </button>
                      <div className="flex items-center gap-3">
                        {FEEDBACK_TYPES[selectedType].icon}
                        <span className="font-medium text-gray-800">
                          {FEEDBACK_TYPES[selectedType].label}
                        </span>
                      </div>
                    </div>

                    {/* Textarea */}
                    <div className="mb-6">
                      <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={FEEDBACK_TYPES[selectedType].placeholder}
                        className="w-full h-40 p-4 rounded-2xl bg-white
                                 border-2 border-gray-100 
                                 focus:border-[#a4b792] focus:ring-0
                                 text-[17px] text-[#2e2e2e]
                                 placeholder:text-gray-400
                                 resize-none transition-colors"
                        maxLength={2000}
                      />
                      <div className="text-right text-sm text-gray-400 mt-2">
                        {message.length}/2000
                      </div>
                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                        {error}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleSubmit}
                      disabled={!message.trim() || isSubmitting}
                      className="w-full py-4 px-6 rounded-2xl
                               bg-gradient-to-br from-[#a4b792] to-[#8fa07d]
                               text-white font-semibold text-lg
                               disabled:opacity-50 disabled:cursor-not-allowed
                               transition-all duration-200
                               hover:shadow-lg active:scale-[0.98]"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center gap-2">
                          <Spinner className="w-5 h-5" />
                          Sending...
                        </div>
                      ) : (
                        'Send Feedback'
                      )}
                    </button>

                    {/* Privacy Note */}
                    <div className="text-center mt-6 text-sm text-gray-500 leading-relaxed">
                      Your feedback helps us improve ALCHM for everyone.
                      <br />
                      We never share your personal journal entries.
                    </div>
                  </motion.div>
                )}

                {/* Step: Success */}
                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FeedbackSuccess />
                  </motion.div>
                )}
              </AnimatePresence>
              </div>
            </div>

            {/* Safe Area Spacer for iOS */}
            <div className="h-[env(safe-area-inset-bottom)]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Icons
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}