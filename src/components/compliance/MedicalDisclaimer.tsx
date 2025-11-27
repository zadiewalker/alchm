'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '../ui/card';
import { Button } from '../ui/button';

interface MedicalDisclaimerProps {
  variant?: 'full' | 'compact' | 'inline';
  showCrisisResources?: boolean;
  required?: boolean;
  onAccept?: () => void;
}

export function MedicalDisclaimer({ 
  variant = 'full', 
  showCrisisResources = true, 
  required = false,
  onAccept 
}: MedicalDisclaimerProps) {
  const [hasAccepted, setHasAccepted] = useState(false);

  useEffect(() => {
    // Check if user has previously accepted disclaimer
    const accepted = localStorage.getItem('alchm-medical-disclaimer-accepted');
    if (accepted === 'true') {
      setHasAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    setHasAccepted(true);
    localStorage.setItem('alchm-medical-disclaimer-accepted', 'true');
    localStorage.setItem('alchm-medical-disclaimer-date', new Date().toISOString());
    if (onAccept) {
      onAccept();
    }
  };

  const crisisResources = [
    {
      name: "Emergency Services",
      contact: "911",
      description: "For immediate emergency assistance",
      type: "phone"
    },
    {
      name: "988 Suicide & Crisis Lifeline", 
      contact: "988",
      description: "24/7 crisis support and suicide prevention",
      type: "phone"
    },
    {
      name: "Crisis Text Line",
      contact: "741741",
      description: "Text HOME for 24/7 crisis support via text",
      type: "text"
    },
    {
      name: "LGBTQ National Hotline",
      contact: "1-888-843-4564",
      description: "Support for LGBTQ+ individuals",
      type: "phone"
    },
    {
      name: "National Domestic Violence Hotline",
      contact: "1-800-799-7233", 
      description: "Support for domestic violence situations",
      type: "phone"
    }
  ];

  if (variant === 'inline') {
    return (
      <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded border-l-4 border-blue-500">
        <p className="font-medium">Medical Disclaimer:</p>
        <p>ALCHM is for emotional wellness and self-reflection. Not a substitute for professional medical advice. 
           In crisis situations, contact <a href="tel:988" className="text-blue-600 underline">988</a> or 
           <a href="tel:911" className="text-red-600 underline ml-1">911</a>.</p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-4">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">Important Notice</h3>
            <p className="text-sm text-gray-700 mb-3">
              ALCHM supports emotional wellness but is not medical treatment. 
              For mental health emergencies, contact crisis resources immediately.
            </p>
            {required && !hasAccepted && (
              <Button 
                onClick={handleAccept}
                className="w-full bg-sage-600 hover:bg-sage-700"
                aria-label="Accept medical disclaimer to continue"
              >
                I Understand
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full disclaimer
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-medium text-center text-gray-900">
          Important Medical Disclaimer
        </h2>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Primary Disclaimer */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                ALCHM is not a medical device or treatment
              </h3>
              <div className="mt-2 text-yellow-700">
                <p>
                  ALCHM is designed for emotional wellness, self-reflection, and personal growth. 
                  It is <strong>not intended to diagnose, treat, cure, or prevent any medical condition</strong>. 
                  This app is not a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Care */}
        <div className="prose max-w-none">
          <h3 className="text-lg font-medium">Seek Professional Care</h3>
          <p>
            Always seek the advice of qualified health providers with any questions about your mental health. 
            Never disregard professional medical advice or delay seeking it because of information from this app.
          </p>
          <p>
            If you are experiencing thoughts of self-harm, suicide, or are in a mental health crisis, 
            please contact professional help immediately using the resources below.
          </p>
        </div>

        {/* Crisis Resources */}
        {showCrisisResources && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-red-800 mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Crisis Support Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {crisisResources.map((resource, index) => (
                <div key={index} className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-900">{resource.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                  <a 
                    href={resource.type === 'phone' ? `tel:${resource.contact}` : `sms:${resource.contact}`}
                    className="inline-flex items-center text-red-600 hover:text-red-800 font-medium"
                    aria-label={`Contact ${resource.name} at ${resource.contact}`}
                  >
                    {resource.type === 'phone' ? '📞' : '💬'} {resource.contact}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* App Limitations */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-800 mb-2">What ALCHM Does and Doesn't Do</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-green-800">✅ ALCHM Provides:</h4>
              <ul className="text-sm text-green-700 list-disc list-inside mt-2 space-y-1">
                <li>Safe space for journaling and reflection</li>
                <li>Emotional wellness tools and insights</li>
                <li>Guided pathways for personal growth</li>
                <li>Crisis resource information</li>
                <li>Privacy-focused design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-800">❌ ALCHM Does NOT:</h4>
              <ul className="text-sm text-red-700 list-disc list-inside mt-2 space-y-1">
                <li>Provide medical diagnosis or treatment</li>
                <li>Replace professional therapy or counseling</li>
                <li>Offer emergency crisis intervention</li>
                <li>Prescribe medications or treatments</li>
                <li>Guarantee therapeutic outcomes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* User Responsibility */}
        <div className="text-sm text-gray-600">
          <p>
            By using ALCHM, you acknowledge that you understand these limitations and agree to use the app 
            as a wellness tool alongside, not instead of, professional mental health care when needed.
          </p>
          <p className="mt-2">
            <strong>Last updated:</strong> {new Date().toLocaleDateString()}
          </p>
        </div>

        {required && !hasAccepted && (
          <div className="text-center pt-4 border-t">
            <Button 
              onClick={handleAccept}
              className="px-8 py-3 bg-sage-600 hover:bg-sage-700 text-white font-medium"
              aria-label="Accept medical disclaimer and terms to continue using ALCHM"
            >
              I Understand and Accept
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}