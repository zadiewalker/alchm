'use client';

import React, { useState, useEffect } from 'react';
import { getSacredContractPrivacy, SacredContractPrivacy, getComplianceRequirements } from '@/locales/sacred-contract-privacy';

interface SacredContractPrivacyProps {
  locale: string;
  country: string;
  isVisible: boolean;
  onAccept: () => void;
  onDecline?: () => void;
  showFullText?: boolean;
}

export default function SacredContractPrivacy({
  locale,
  country,
  isVisible,
  onAccept,
  onDecline,
  showFullText = false
}: SacredContractPrivacyProps) {
  const [contract, setContract] = useState<SacredContractPrivacy | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const contractData = getSacredContractPrivacy(locale, country);
    setContract(contractData);
  }, [locale, country]);

  const compliance = getComplianceRequirements(country);

  if (!isVisible || !contract) {
    return null;
  }

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleScroll = (e: React.UIEvent) => {
    const target = e.target as HTMLDivElement;
    const scrolled = target.scrollTop > 50;
    setHasScrolled(scrolled);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold mb-2">{contract.sacredContract.title}</h1>
          <p className="text-purple-100">
            {contract.country} • {contract.legalFramework}
          </p>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-6"
          onScroll={handleScroll}
        >
          {/* Primary Sacred Text */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Sacred Promise</h2>
            <p className="text-lg text-purple-900 leading-relaxed">
              {contract.sacredContract.primaryText}
            </p>
          </div>

          {/* Expandable Sections */}
          <div className="space-y-4">
            {/* Data Protection */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('dataProtection')}
                className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">Data Protection & Security</span>
                <span className="text-gray-500">
                  {expandedSection === 'dataProtection' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'dataProtection' && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">
                    {contract.sacredContract.dataProtection}
                  </p>
                </div>
              )}
            </div>

            {/* AI Purpose */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('aiPurpose')}
                className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">AI Spiritual Guidance</span>
                <span className="text-gray-500">
                  {expandedSection === 'aiPurpose' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'aiPurpose' && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">
                    {contract.sacredContract.aiPurpose}
                  </p>
                </div>
              )}
            </div>

            {/* User Rights */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('userRights')}
                className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">Your Sacred Rights</span>
                <span className="text-gray-500">
                  {expandedSection === 'userRights' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'userRights' && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {contract.sacredContract.userRights}
                  </p>
                  
                  {/* Compliance Rights */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-800 mb-2">Your Legal Rights Include:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>✓ Access your personal data</li>
                      <li>✓ Correct inaccurate information</li>
                      {compliance.rightToForgotten && <li>✓ Request deletion of your data</li>}
                      {compliance.dataPortability && <li>✓ Export your data</li>}
                      <li>✓ Withdraw consent at any time</li>
                      <li>✓ Object to processing</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Cultural Respect */}
            <div className="border border-gray-200 rounded-lg">
              <button
                onClick={() => toggleSection('culturalRespect')}
                className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center"
              >
                <span className="font-semibold text-gray-800">Cultural Honor & Respect</span>
                <span className="text-gray-500">
                  {expandedSection === 'culturalRespect' ? '−' : '+'}
                </span>
              </button>
              {expandedSection === 'culturalRespect' && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-gray-700 leading-relaxed">
                    {contract.sacredContract.culturalRespect}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Legal Footnotes */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Legal Compliance</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{contract.legalFootnotes.compliance}</p>
              <p>{contract.legalFootnotes.rights}</p>
              <p>{contract.legalFootnotes.contact}</p>
            </div>
          </div>

          {/* Cultural Notes for Development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-medium text-yellow-800 mb-2">Cultural Adaptation Notes:</h4>
              <p className="text-sm text-yellow-700">{contract.culturalNotes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-lg">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-sm text-gray-600">
              By continuing, you agree to this Sacred Contract
              {!hasScrolled && showFullText && (
                <span className="block text-yellow-600 mt-1">
                  Please scroll to read the full agreement
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              {onDecline && (
                <button
                  onClick={onDecline}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Decline
                </button>
              )}
              
              <button
                onClick={onAccept}
                disabled={showFullText && !hasScrolled}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Accept Sacred Contract
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quick privacy notice banner component
export function SacredPrivacyBanner({ 
  locale, 
  country, 
  onAccept, 
  onViewFull 
}: {
  locale: string;
  country: string;
  onAccept: () => void;
  onViewFull: () => void;
}) {
  const contract = getSacredContractPrivacy(locale, country);
  
  if (!contract) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Your reflections are sacred.</span> We protect your privacy with encryption and use AI only to support your spiritual growth.
          </p>
        </div>
        
        <div className="flex gap-3 shrink-0">
          <button
            onClick={onViewFull}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            View Sacred Contract
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}