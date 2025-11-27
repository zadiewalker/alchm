'use client';

import React, { useState, useEffect } from 'react';
import { CulturalRitual, getCulturalRitual, getAllAvailableRituals, CulturalRitualManager } from '@/khepera/cultural-ritual-system';

interface CulturalRitualSelectorProps {
  userLocale: string;
  onRitualSelect: (ritual: CulturalRitual) => void;
  onRitualComplete: (session: any) => void;
}

export default function CulturalRitualSelector({ 
  userLocale, 
  onRitualSelect, 
  onRitualComplete 
}: CulturalRitualSelectorProps) {
  const [selectedRitual, setSelectedRitual] = useState<CulturalRitual | null>(null);
  const [ritualPhase, setRitualPhase] = useState<'selection' | 'grounding' | 'reflection' | 'complete'>('selection');
  const [currentStep, setCurrentStep] = useState(0);
  const [ritualSession, setRitualSession] = useState<any>(null);
  const [reflectionText, setReflectionText] = useState('');

  const ritualManager = new CulturalRitualManager();
  const availableRituals = getAllAvailableRituals();

  // Auto-select based on user locale
  useEffect(() => {
    const defaultRitual = availableRituals.find(r => r.locale === userLocale);
    if (defaultRitual && !selectedRitual) {
      setSelectedRitual(defaultRitual);
    }
  }, [userLocale, selectedRitual, availableRituals]);

  const handleStartRitual = (ritual: CulturalRitual) => {
    setSelectedRitual(ritual);
    const session = ritualManager.startRitualSession(ritual.region.toLowerCase().replace(/\s+/g, '_'), 'user_id');
    setRitualSession(session);
    setRitualPhase('grounding');
    setCurrentStep(0);
    onRitualSelect(ritual);
  };

  const handleNextStep = () => {
    if (!selectedRitual) return;

    if (ritualPhase === 'grounding') {
      if (currentStep < selectedRitual.groundingRitual.instructions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setRitualPhase('reflection');
      }
    } else if (ritualPhase === 'reflection') {
      setRitualPhase('complete');
      onRitualComplete({ ...ritualSession, reflectionNotes: reflectionText });
    }
  };

  const handleRitualSelect = (ritual: CulturalRitual) => {
    setSelectedRitual(ritual);
  };

  if (ritualPhase === 'selection') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            Choose Your Sacred Ritual
          </h2>
          <p className="text-gray-600">
            Select a culturally rooted practice to ground your reflection
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableRituals.map((ritual) => (
            <div 
              key={ritual.region}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:shadow-lg ${
                selectedRitual?.region === ritual.region 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleRitualSelect(ritual)}
            >
              <h3 className="text-lg font-medium mb-2">{ritual.region}</h3>
              <p className="text-sm text-gray-600 mb-3">{ritual.groundingRitual.name}</p>
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500">Sacred Phrase:</div>
                <div className="text-sm font-medium">{ritual.sacredPhrase.text}</div>
                <div className="text-xs italic text-gray-600">{ritual.sacredPhrase.translation}</div>
              </div>

              <div className="mt-4">
                <div className="text-xs text-gray-500 mb-1">Theme:</div>
                <div className="text-sm text-gray-700">{ritual.reflectionPrompt.theme}</div>
              </div>
            </div>
          ))}
        </div>

        {selectedRitual && (
          <div className="text-center mt-8">
            <button
              onClick={() => handleStartRitual(selectedRitual)}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Begin {selectedRitual.groundingRitual.name}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (ritualPhase === 'grounding' && selectedRitual) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            {selectedRitual.groundingRitual.name}
          </h2>
          <p className="text-gray-600">{selectedRitual.region} Sacred Practice</p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium mb-2">Sacred Phrase</h3>
          <div className="text-xl font-medium text-indigo-800 mb-1">
            {selectedRitual.sacredPhrase.text}
          </div>
          <div className="text-sm italic text-gray-600">
            {selectedRitual.sacredPhrase.translation}
          </div>
          {selectedRitual.sacredPhrase.pronunciation && (
            <div className="text-xs text-gray-500 mt-2">
              Pronunciation: {selectedRitual.sacredPhrase.pronunciation}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Grounding Practice</h3>
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {selectedRitual.groundingRitual.instructions.length}
            </span>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <p className="text-lg text-gray-800 leading-relaxed">
              {selectedRitual.groundingRitual.instructions[currentStep]}
            </p>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Previous
            </button>
            
            <button
              onClick={handleNextStep}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {currentStep === selectedRitual.groundingRitual.instructions.length - 1 
                ? 'Begin Reflection' 
                : 'Next Step'
              }
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Take your time with each step. There's no rush in sacred practice.</p>
        </div>
      </div>
    );
  }

  if (ritualPhase === 'reflection' && selectedRitual) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            Sacred Reflection
          </h2>
          <p className="text-gray-600">{selectedRitual.reflectionPrompt.theme}</p>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-medium mb-3">Reflection Prompt</h3>
          <p className="text-lg text-gray-800 leading-relaxed mb-4">
            {selectedRitual.reflectionPrompt.question}
          </p>
          
          <div className="space-y-2">
            <h4 className="font-medium text-gray-700">Guidance:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedRitual.reflectionPrompt.guidance.map((guide, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-emerald-500 mr-2">•</span>
                  {guide}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-lg font-medium text-gray-800">Your Reflection</span>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Let your heart speak freely here..."
              className="w-full mt-2 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              rows={8}
            />
          </label>

          <div className="text-center">
            <button
              onClick={handleNextStep}
              disabled={!reflectionText.trim()}
              className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Complete Sacred Practice
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (ritualPhase === 'complete' && selectedRitual) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-6 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-2xl text-white">✨</span>
          </div>
          <h2 className="text-2xl font-medium text-gray-800 mb-2">
            Sacred Practice Complete
          </h2>
          <p className="text-gray-600">
            You have honored the wisdom of {selectedRitual.region}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <p className="text-lg text-gray-800 italic mb-4">
            "{selectedRitual.sacredPhrase.text}"
          </p>
          <p className="text-sm text-gray-600">
            {selectedRitual.sacredPhrase.translation}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            Your reflection has been received with honor and respect. 
            The wisdom you've shared contributes to the collective healing.
          </p>
          
          <button
            onClick={() => {
              setRitualPhase('selection');
              setSelectedRitual(null);
              setReflectionText('');
              setCurrentStep(0);
            }}
            className="px-6 py-2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            Begin Another Practice
          </button>
        </div>
      </div>
    );
  }

  return null;
}