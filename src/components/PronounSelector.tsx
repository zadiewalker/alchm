'use client';

import React, { useState } from 'react';
import { SacredInput, SacredCard, SacredText, SacredButton, SacredGrid } from '@/components/SacredUIFoundation';

// ===== PRONOUN PREFERENCE TYPES =====

export type PronounSet = 'they/them' | 'she/her' | 'he/him' | 'ze/zir' | 'xe/xir' | 'custom';

export interface CustomPronouns {
  subject: string;
  object: string;
  possessive: string;
  reflexive: string;
}

export interface PronounPreference {
  pronouns: PronounSet;
  customPronouns?: CustomPronouns;
  displayInProfile: boolean;
  useInAIResponses: boolean;
}

export interface PronounOption {
  value: PronounSet;
  label: string;
  example: string;
  description: string;
}

// ===== PRONOUN SELECTOR COMPONENT =====

interface PronounSelectorProps {
  value?: PronounPreference;
  onChange: (pronouns: PronounPreference) => void;
  includeCustom?: boolean;
  showPrivacyControls?: boolean;
  className?: string;
}

export function PronounSelector({ 
  value, 
  onChange, 
  includeCustom = true, 
  showPrivacyControls = true,
  className = '' 
}: PronounSelectorProps) {
  const [selectedSet, setSelectedSet] = useState<PronounSet>(value?.pronouns || 'they/them');
  const [customPronouns, setCustomPronouns] = useState<CustomPronouns>(
    value?.customPronouns || { subject: '', object: '', possessive: '', reflexive: '' }
  );

  const pronounOptions: PronounOption[] = [
    {
      value: 'they/them',
      label: 'they/them',
      example: 'They are writing in their journal about themselves',
      description: 'Gender-neutral pronouns'
    },
    {
      value: 'she/her',
      label: 'she/her', 
      example: 'She is exploring her inner wisdom about herself',
      description: 'Feminine pronouns'
    },
    {
      value: 'he/him',
      label: 'he/him',
      example: 'He is on his sacred journey, discovering himself',
      description: 'Masculine pronouns'
    },
    {
      value: 'ze/zir',
      label: 'ze/zir',
      example: 'Ze is honoring zir authentic self, being true to zirself',
      description: 'Gender-neutral neopronouns'
    },
    {
      value: 'xe/xir',
      label: 'xe/xir', 
      example: 'Xe is embracing xir unique path, trusting xirself',
      description: 'Gender-neutral neopronouns'
    }
  ];

  const handlePronounChange = (newPronounSet: PronounSet) => {
    setSelectedSet(newPronounSet);
    
    const newPreference: PronounPreference = {
      pronouns: newPronounSet,
      customPronouns: newPronounSet === 'custom' ? customPronouns : undefined,
      displayInProfile: value?.displayInProfile ?? true,
      useInAIResponses: value?.useInAIResponses ?? true
    };
    
    onChange(newPreference);
  };

  const handleCustomPronounChange = (field: keyof CustomPronouns, newValue: string) => {
    const updated = { ...customPronouns, [field]: newValue };
    setCustomPronouns(updated);
    
    if (selectedSet === 'custom') {
      onChange({
        pronouns: 'custom',
        customPronouns: updated,
        displayInProfile: value?.displayInProfile ?? true,
        useInAIResponses: value?.useInAIResponses ?? true
      });
    }
  };

  const handlePrivacyChange = (setting: 'displayInProfile' | 'useInAIResponses', newValue: boolean) => {
    const updated: PronounPreference = {
      pronouns: selectedSet,
      customPronouns: selectedSet === 'custom' ? customPronouns : undefined,
      displayInProfile: setting === 'displayInProfile' ? newValue : (value?.displayInProfile ?? true),
      useInAIResponses: setting === 'useInAIResponses' ? newValue : (value?.useInAIResponses ?? true)
    };
    
    onChange(updated);
  };

  return (
    <SacredCard variant="gentle" className={`pronoun-selector ${className}`}>
      <div className="space-y-ritual">
        <div>
          <SacredText variant="title" as="h3">
            How would you like to be referred to?
          </SacredText>
          <SacredText variant="body">
            Your pronouns help us create a more personalized and respectful experience. 
            Choose what feels most authentic to you.
          </SacredText>
        </div>

        <SacredGrid columns={2} gap="breath" className="pronoun-options">
          {pronounOptions.map(option => (
            <PronounOptionCard
              key={option.value}
              option={option}
              selected={selectedSet === option.value}
              onSelect={() => handlePronounChange(option.value)}
            />
          ))}
          
          {includeCustom && (
            <PronounOptionCard
              option={{
                value: 'custom',
                label: 'Custom pronouns',
                example: 'Let me specify my own pronouns',
                description: 'Define your own pronouns'
              }}
              selected={selectedSet === 'custom'}
              onSelect={() => handlePronounChange('custom')}
            />
          )}
        </SacredGrid>

        {selectedSet === 'custom' && includeCustom && (
          <CustomPronounInput
            value={customPronouns}
            onChange={handleCustomPronounChange}
          />
        )}

        {showPrivacyControls && (
          <PronounPrivacyControls
            displayInProfile={value?.displayInProfile ?? true}
            useInAIResponses={value?.useInAIResponses ?? true}
            onDisplayChange={(value) => handlePrivacyChange('displayInProfile', value)}
            onAIResponseChange={(value) => handlePrivacyChange('useInAIResponses', value)}
          />
        )}
      </div>
    </SacredCard>
  );
}

// ===== PRONOUN OPTION CARD =====

interface PronounOptionCardProps {
  option: PronounOption;
  selected: boolean;
  onSelect: () => void;
}

function PronounOptionCard({ option, selected, onSelect }: PronounOptionCardProps) {
  return (
    <SacredCard
      variant={selected ? 'warm' : 'default'}
      isInteractive
      onClick={onSelect}
      className={`pronoun-option-card ${selected ? 'selected' : ''}`}
    >
      <div className="space-y-whisper">
        <div className="flex items-center justify-between">
          <SacredText variant="caption" className="font-semibold">
            {option.label}
          </SacredText>
          {selected && (
            <div className="w-4 h-4 rounded-full bg-grounding-earth flex items-center justify-center">
              <span className="text-white text-xs">✓</span>
            </div>
          )}
        </div>
        
        <SacredText variant="caption" className="text-xs text-subtle">
          {option.description}
        </SacredText>
        
        <SacredText variant="caption" className="text-xs italic">
          Example: "{option.example}"
        </SacredText>
      </div>
    </SacredCard>
  );
}

// ===== CUSTOM PRONOUN INPUT =====

interface CustomPronounInputProps {
  value: CustomPronouns;
  onChange: (field: keyof CustomPronouns, newValue: string) => void;
}

function CustomPronounInput({ value, onChange }: CustomPronounInputProps) {
  const fields: { key: keyof CustomPronouns; label: string; example: string }[] = [
    { key: 'subject', label: 'Subject pronoun', example: 'they, she, he, ze, xe' },
    { key: 'object', label: 'Object pronoun', example: 'them, her, him, zir, xir' },
    { key: 'possessive', label: 'Possessive pronoun', example: 'their, her, his, zir, xir' },
    { key: 'reflexive', label: 'Reflexive pronoun', example: 'themselves, herself, himself, zirself, xirself' }
  ];

  return (
    <SacredCard variant="sacred" className="custom-pronoun-input">
      <SacredText variant="caption" className="font-semibold mb-breath">
        Define your custom pronouns
      </SacredText>
      
      <div className="space-y-breath">
        {fields.map(field => (
          <SacredInput
            key={field.key}
            label={field.label}
            placeholder={field.example}
            value={value[field.key]}
            onChange={(e) => onChange(field.key, e.target.value)}
          />
        ))}
      </div>
      
      <div className="mt-breath p-breath bg-healing-mist rounded-lg">
        <SacredText variant="caption" className="text-xs">
          <strong>Preview:</strong> {generatePronounExample(value)}
        </SacredText>
      </div>
    </SacredCard>
  );
}

// ===== PRONOUN PRIVACY CONTROLS =====

interface PronounPrivacyControlsProps {
  displayInProfile: boolean;
  useInAIResponses: boolean;
  onDisplayChange: (value: boolean) => void;
  onAIResponseChange: (value: boolean) => void;
}

function PronounPrivacyControls({ 
  displayInProfile, 
  useInAIResponses, 
  onDisplayChange, 
  onAIResponseChange 
}: PronounPrivacyControlsProps) {
  return (
    <SacredCard variant="gentle" className="pronoun-privacy-controls">
      <SacredText variant="caption" className="font-semibold mb-breath">
        Privacy Settings
      </SacredText>
      
      <div className="space-y-breath">
        <label className="flex items-center space-x-gentle cursor-pointer">
          <input
            type="checkbox"
            checked={displayInProfile}
            onChange={(e) => onDisplayChange(e.target.checked)}
            className="rounded border-2 border-grounding-earth text-grounding-earth focus:ring-grounding-earth"
          />
          <div>
            <SacredText variant="caption">Show pronouns in my profile</SacredText>
            <SacredText variant="caption" className="text-xs text-subtle">
              Other community members can see your pronouns
            </SacredText>
          </div>
        </label>
        
        <label className="flex items-center space-x-gentle cursor-pointer">
          <input
            type="checkbox"
            checked={useInAIResponses}
            onChange={(e) => onAIResponseChange(e.target.checked)}
            className="rounded border-2 border-grounding-earth text-grounding-earth focus:ring-grounding-earth"
          />
          <div>
            <SacredText variant="caption">Use my pronouns in AI responses</SacredText>
            <SacredText variant="caption" className="text-xs text-subtle">
              KHEPERA will use your pronouns when responding to you
            </SacredText>
          </div>
        </label>
      </div>
    </SacredCard>
  );
}

// ===== UTILITY FUNCTIONS =====

function generatePronounExample(pronouns: CustomPronouns): string {
  const { subject, object, possessive, reflexive } = pronouns;
  
  if (!subject || !object || !possessive || !reflexive) {
    return 'Complete all fields to see example';
  }
  
  return `${subject.charAt(0).toUpperCase() + subject.slice(1)} is exploring ${possessive} inner wisdom and discovering ${object}self through ${reflexive}.`;
}

// ===== PRONOUN UTILITY FUNCTIONS =====

export function formatPronouns(preference: PronounPreference): string {
  if (preference.pronouns === 'custom' && preference.customPronouns) {
    const { subject, object } = preference.customPronouns;
    return `${subject}/${object}`;
  }
  
  return preference.pronouns;
}

export function getPronounExample(preference: PronounPreference): string {
  if (preference.pronouns === 'custom' && preference.customPronouns) {
    return generatePronounExample(preference.customPronouns);
  }
  
  const option = pronounOptions.find(opt => opt.value === preference.pronouns);
  return option?.example || '';
}

// Export for use in other components
export { type PronounPreference as UserPronounPreference };