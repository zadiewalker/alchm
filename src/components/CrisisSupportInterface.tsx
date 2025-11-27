'use client';

import React, { useState, useEffect } from 'react';
import { GeoLinguisticCrisisRouter, CrisisResponse, CrisisLine } from '@/lib/crisis-support-routing';

interface CrisisSupportInterfaceProps {
  userText?: string;
  userLocale: string;
  userCountry?: string;
  isVisible: boolean;
  onClose?: () => void;
}

export default function CrisisSupportInterface({ 
  userText = '', 
  userLocale, 
  userCountry = 'usa',
  isVisible,
  onClose 
}: CrisisSupportInterfaceProps) {
  const [crisisResponse, setCrisisResponse] = useState<CrisisResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSecondaryResources, setShowSecondaryResources] = useState(false);

  const crisisRouter = new GeoLinguisticCrisisRouter();

  useEffect(() => {
    if (isVisible) {
      generateCrisisSupport();
    }
  }, [isVisible, userLocale, userCountry]);

  const generateCrisisSupport = async () => {
    setIsLoading(true);
    try {
      // In production, get actual user IP and browser language
      const response = crisisRouter.generateCrisisResponse(
        userCountry,
        userLocale,
        '127.0.0.1', // placeholder IP
        `${userLocale},en;q=0.9` // placeholder accept-language
      );
      setCrisisResponse(response);
    } catch (error) {
      console.error('Error generating crisis support:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneCall = (phone: string) => {
    const telUrl = crisisRouter.generateClickToCallUrl(phone, userCountry);
    window.location.href = telUrl;
  };

  const handleTextMessage = (textNumber: string) => {
    const smsUrl = `sms:${textNumber}`;
    window.location.href = smsUrl;
  };

  const handleWebChat = (chatUrl: string) => {
    window.open(chatUrl, '_blank');
  };

  const handleWebsite = (websiteUrl: string) => {
    window.open(websiteUrl, '_blank');
  };

  if (!isVisible || !crisisResponse) {
    return null;
  }

  const { crisisLine, message, urgentMessage, action, secondaryResources, culturalGuidance, immediateSteps } = crisisResponse;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-red-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-medium mb-2">{urgentMessage}</h2>
              <p className="text-red-100">{message}</p>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-red-100 hover:text-white text-2xl"
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Immediate Steps */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-3">Immediate Steps:</h3>
            <ul className="space-y-2">
              {immediateSteps.map((step, index) => (
                <li key={index} className="flex items-start text-yellow-800">
                  <span className="text-yellow-600 mr-2 mt-1">•</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Primary Crisis Line */}
          <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
            <h3 className="text-xl font-medium text-blue-800 mb-2">{crisisLine.name}</h3>
            <p className="text-blue-700 mb-4">{crisisLine.availability}</p>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              {action === 'clickToCall' && (
                <button
                  onClick={() => handlePhoneCall(crisisLine.phone)}
                  className="w-full bg-green-600 text-white py-4 px-6 rounded-lg text-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">📞</span>
                  Call {crisisLine.phone}
                </button>
              )}

              {crisisLine.textSupport && (
                <button
                  onClick={() => handleTextMessage(crisisLine.textSupport)}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">💬</span>
                  Text {crisisLine.textSupport}
                </button>
              )}

              {crisisLine.chatSupport && (
                <button
                  onClick={() => handleWebChat(crisisLine.chatSupport)}
                  className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">💻</span>
                  Start Web Chat
                </button>
              )}

              {crisisLine.website && (
                <button
                  onClick={() => handleWebsite(crisisLine.website)}
                  className="w-full bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <span className="mr-2">🌐</span>
                  Visit Website
                </button>
              )}
            </div>

            {/* Cultural Notes */}
            {crisisLine.culturalNotes && (
              <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">About this service:</h4>
                <p className="text-blue-700 text-sm">{crisisLine.culturalNotes}</p>
              </div>
            )}
          </div>

          {/* Cultural Guidance */}
          {culturalGuidance && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-800 mb-2">Remember:</h3>
              <p className="text-green-700">{culturalGuidance}</p>
            </div>
          )}

          {/* Secondary Resources */}
          {secondaryResources.length > 0 && (
            <div>
              <button
                onClick={() => setShowSecondaryResources(!showSecondaryResources)}
                className="text-blue-600 hover:text-blue-800 font-medium mb-3"
              >
                {showSecondaryResources ? 'Hide' : 'Show'} Additional Resources ({secondaryResources.length})
              </button>

              {showSecondaryResources && (
                <div className="space-y-3">
                  {secondaryResources.map((resource) => (
                    <div key={resource.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800">{resource.name}</h4>
                      <p className="text-gray-600 text-sm mb-2">{resource.availability}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handlePhoneCall(resource.phone)}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded text-sm hover:bg-green-200"
                        >
                          📞 {resource.phone}
                        </button>
                        
                        {resource.website && (
                          <button
                            onClick={() => handleWebsite(resource.website)}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm hover:bg-blue-200"
                          >
                            🌐 Website
                          </button>
                        )}
                        
                        {resource.textSupport && (
                          <button
                            onClick={() => handleTextMessage(resource.textSupport)}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded text-sm hover:bg-purple-200"
                          >
                            💬 Text
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Emergency Services */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-2">In Immediate Danger?</h3>
            <p className="text-red-700 mb-3">If you are in immediate physical danger, call emergency services:</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handlePhoneCall('911')}
                className="bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700"
              >
                🚨 Emergency: 911
              </button>
              
              {userCountry === 'brazil' && (
                <button
                  onClick={() => handlePhoneCall('192')}
                  className="bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700"
                >
                  🚨 SAMU: 192
                </button>
              )}
              
              {userCountry === 'uk' && (
                <button
                  onClick={() => handlePhoneCall('999')}
                  className="bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700"
                >
                  🚨 Emergency: 999
                </button>
              )}
              
              {userCountry === 'india' && (
                <button
                  onClick={() => handlePhoneCall('102')}
                  className="bg-red-600 text-white py-2 px-4 rounded font-medium hover:bg-red-700"
                >
                  🚨 Emergency: 102
                </button>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center space-x-4 pt-4 border-t">
            <button
              onClick={generateCrisisSupport}
              className="px-4 py-2 text-blue-600 hover:text-blue-800"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh Resources'}
            </button>
            
            {onClose && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}