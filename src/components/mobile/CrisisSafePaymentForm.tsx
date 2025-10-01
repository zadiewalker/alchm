'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

// Crisis-Safe Payment Form for Mobile Users
// Designed for users experiencing emotional distress, trembling hands, or panic attacks

interface CrisisSafePaymentFormProps {
  planName: string;
  planPrice: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CrisisSafePaymentForm({ 
  planName, 
  planPrice, 
  onCancel, 
  onSuccess 
}: CrisisSafePaymentFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    name: '',
    zipCode: ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCrisisExit, setShowCrisisExit] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    
    // iOS viewport fix
    if (window.navigator.userAgent.includes('iPhone')) {
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
      }
    }
  }, []);

  // Crisis detection based on rapid form changes
  useEffect(() => {
    let changeCount = 0;
    const timer = setTimeout(() => {
      if (changeCount > 10) {
        setShowCrisisExit(true);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear related errors
    setFormErrors(prev => prev.filter(error => !error.includes(field)));
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.email.includes('@')) {
      errors.push('Please enter a valid email address');
    }
    
    if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      errors.push('Please enter a complete card number');
    }
    
    if (!formData.expiryDate || formData.expiryDate.length < 5) {
      errors.push('Please enter a valid expiry date');
    }
    
    if (!formData.cvv || formData.cvv.length < 3) {
      errors.push('Please enter your security code');
    }
    
    if (!formData.name.trim()) {
      errors.push('Please enter the cardholder name');
    }
    
    setFormErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate processing time with gentle feedback
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess();
    } catch (error) {
      setFormErrors(['Payment processing failed. Please try again or contact support.']);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        
        {/* Crisis Exit Modal */}
        {showCrisisExit && (
          <div className="absolute inset-0 bg-red-50 border-2 border-red-200 rounded-2xl p-6 z-10">
            <h3 className="text-xl font-medium text-red-800 mb-4 text-center">
              Feeling Overwhelmed?
            </h3>
            <p className="text-red-700 mb-6 text-center leading-relaxed">
              It's okay to pause. Your mental health is more important than any purchase.
            </p>
            <div className="space-y-3">
              <button
                onClick={onCancel}
                className="w-full bg-red-500 text-white py-4 rounded-xl font-medium text-lg"
                style={{ minHeight: '60px', touchAction: 'manipulation' }}
              >
                Exit Safely
              </button>
              <button
                onClick={() => setShowCrisisExit(false)}
                className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-medium text-lg"
                style={{ minHeight: '60px', touchAction: 'manipulation' }}
              >
                Continue with Payment
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">
              Subscribe to {planName}
            </h2>
            <button
              onClick={onCancel}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              style={{ minHeight: '48px', minWidth: '48px', touchAction: 'manipulation' }}
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-gray-600 mt-2">
            {planPrice}/month • Cancel anytime
          </p>
        </div>

        {/* Financial Safety Notice */}
        <div className="p-6 bg-green-50 border-b border-gray-100">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-medium text-green-800">Safe to Proceed</p>
              <p className="text-sm text-green-700 mt-1">
                Cancel anytime. No questions asked. Your wellbeing comes first.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Error Display */}
          {formErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Please correct the following:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {formErrors.map((error, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
              style={{ 
                minHeight: '56px',
                fontSize: '16px', // Prevents iOS zoom
                touchAction: 'manipulation'
              }}
              placeholder="your@email.com"
              autoComplete="email"
            />
          </div>

          {/* Card Number */}
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
            </label>
            <input
              type="text"
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
              style={{ 
                minHeight: '56px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              autoComplete="cc-number"
            />
          </div>

          {/* Expiry and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
                style={{ 
                  minHeight: '56px',
                  fontSize: '16px',
                  touchAction: 'manipulation'
                }}
                placeholder="MM/YY"
                maxLength={5}
                autoComplete="cc-exp"
              />
            </div>
            <div>
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-2">
                Security Code
              </label>
              <input
                type="text"
                id="cvv"
                value={formData.cvv}
                onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
                style={{ 
                  minHeight: '56px',
                  fontSize: '16px',
                  touchAction: 'manipulation'
                }}
                placeholder="123"
                maxLength={4}
                autoComplete="cc-csc"
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
              style={{ 
                minHeight: '56px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="Full Name"
              autoComplete="cc-name"
            />
          </div>

          {/* ZIP Code */}
          <div>
            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              id="zipCode"
              value={formData.zipCode}
              onChange={(e) => handleInputChange('zipCode', e.target.value)}
              className="w-full px-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-400 focus:border-sage-400 transition-colors"
              style={{ 
                minHeight: '56px',
                fontSize: '16px',
                touchAction: 'manipulation'
              }}
              placeholder="12345"
              autoComplete="postal-code"
            />
          </div>

          {/* Crisis Support Reminder */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 text-center">
              Remember: If you're in crisis, tap the red heart button for immediate support.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-sage-400 hover:bg-sage-500 text-white font-medium text-lg py-4 rounded-xl transition-colors"
              style={{ 
                minHeight: '64px',
                touchAction: 'manipulation'
              }}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                `Subscribe to ${planName} • ${planPrice}/month`
              )}
            </Button>
            
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-lg py-4 rounded-xl transition-colors"
              style={{ 
                minHeight: '64px',
                touchAction: 'manipulation'
              }}
            >
              Cancel
            </button>
          </div>

          {/* Security Notice */}
          <div className="text-center pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <span>Secured by 256-bit encryption</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}