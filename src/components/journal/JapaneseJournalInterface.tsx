/**
 * Japanese Journal Interface
 * Culturally adapted journaling experience for Japanese users
 */

'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { JapaneseInput, JapaneseText, CulturalContext } from '@/components/i18n/JapaneseLayout';
import JapaneseLocalization, { JapaneseLocaleConfig } from '@/lib/i18n/japanese-localization';
import JapaneseKheperaPersonality, { JapaneseKheperaConfig } from '@/lib/ai/japanese-khepera-personality';
import JapaneseCrisisSupport from '@/lib/crisis/japanese-crisis-resources';
import { japaneseTranslations } from '@/lib/i18n/japanese-translations';

interface JapaneseJournalProps {
  userAge: 'student' | 'young-adult' | 'adult' | 'senior';
  culturalContext: 'academic' | 'workplace' | 'family' | 'personal';
  formalityPreference: 'casual' | 'polite' | 'respectful' | 'honorific';
  onSave: (entry: JournalEntry) => void;
}

interface JournalEntry {
  content: string;
  mood: string;
  culturalTheme?: string;
  crisisLevel?: 'none' | 'low' | 'medium' | 'high' | 'emergency';
  kheperaResponse?: string;
}

interface CulturalPrompt {
  theme: string;
  prompt: string;
  culturalConcept: string;
  description: string;
}

export default function JapaneseJournalInterface({
  userAge,
  culturalContext,
  formalityPreference,
  onSave
}: JapaneseJournalProps) {
  const [journalContent, setJournalContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState<CulturalPrompt | null>(null);
  const [kheperaResponse, setKheperaResponse] = useState('');
  const [crisisDetection, setCrisisDetection] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);

  const localeConfig: JapaneseLocaleConfig = {
    formalityLevel: formalityPreference,
    userAge,
    context: culturalContext,
    culturalFramework: culturalContext === 'family' ? 'collective' : 'individual'
  };

  const kheperaConfig: JapaneseKheperaConfig = {
    communicationStyle: formalityPreference === 'casual' ? 'direct' : 'indirect',
    emotionalIntensity: 'gentle',
    culturalFramework: localeConfig.culturalFramework,
    responseLength: 'moderate',
    includesCulturalConcepts: true
  };

  // Cultural prompts based on Japanese concepts
  const culturalPrompts: CulturalPrompt[] = [
    {
      theme: 'ikigai',
      prompt: JapaneseLocalization.getCulturalConcept('ikigai').journalPrompt,
      culturalConcept: '生きがい',
      description: '人生の目的と意味について考える時間です'
    },
    {
      theme: 'wa',
      prompt: JapaneseLocalization.getCulturalConcept('wa').journalPrompt,
      culturalConcept: '和',
      description: '心の調和と人間関係のバランスについて'
    },
    {
      theme: 'ganbaru',
      prompt: JapaneseLocalization.getCulturalConcept('ganbaru').journalPrompt,
      culturalConcept: '頑張る',
      description: '健康的な努力と自己への優しさについて'
    },
    {
      theme: 'omoiyari',
      prompt: JapaneseLocalization.getCulturalConcept('omoiyari').journalPrompt,
      culturalConcept: '思いやり',
      description: '他者と自分への思いやりの心について'
    }
  ];

  // Generate contextual greeting
  const greeting = JapaneseLocalization.generateContextualContent(
    'greeting',
    localeConfig
  );

  // Handle text changes and crisis detection
  useEffect(() => {
    if (journalContent.length > 50) {
      const detection = JapaneseCrisisSupport.detectCrisisInJapaneseText(journalContent);
      setCrisisDetection(detection);

      if (detection.severity === 'high' || detection.severity === 'emergency') {
        setShowCrisisSupport(true);
      }

      // Generate Khepera response for non-crisis content
      if (detection.severity === 'none' || detection.severity === 'low') {
        const response = JapaneseKheperaPersonality.generateResponse(
          journalContent,
          selectedMood,
          kheperaConfig,
          localeConfig
        );
        setKheperaResponse(response);
      }
    }
  }, [journalContent, selectedMood]);

  const handleSave = async () => {
    setSaving(true);
    
    const entry: JournalEntry = {
      content: journalContent,
      mood: selectedMood,
      culturalTheme: currentPrompt?.theme,
      crisisLevel: crisisDetection?.severity || 'none',
      kheperaResponse
    };

    try {
      await onSave(entry);
      
      // Show success message
      const successMessage = JapaneseLocalization.generateContextualContent(
        'encouragement',
        localeConfig
      );
      
      // Reset form
      setJournalContent('');
      setSelectedMood('');
      setCurrentPrompt(null);
      setKheperaResponse('');
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    } finally {
      setSaving(false);
    }
  };

  const selectPrompt = (prompt: CulturalPrompt) => {
    setCurrentPrompt(prompt);
    if (journalContent) {
      setJournalContent(journalContent + '\n\n' + prompt.prompt);
    } else {
      setJournalContent(prompt.prompt + '\n\n');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Crisis Support Modal */}
      {showCrisisSupport && crisisDetection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-lg w-full p-6 bg-white">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800">
                <JapaneseText>心のサポート</JapaneseText>
              </h3>
              <p className="text-gray-600">
                {JapaneseCrisisSupport.generateCrisisMessage(
                  crisisDetection.severity,
                  formalityPreference
                )}
              </p>
              <div className="space-y-2">
                <Button
                  onClick={() => window.open('tel:0570-783-556')}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  いのちの電話に相談 (0570-783-556)
                </Button>
                <Button
                  onClick={() => window.open('tel:110')}
                  variant="outline"
                  className="w-full"
                >
                  緊急通報 (110)
                </Button>
                <Button
                  onClick={() => setShowCrisisSupport(false)}
                  variant="outline"
                  className="w-full"
                >
                  後で相談する
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Header */}
      <CulturalContext type="harmony" className="text-center">
        <h1 className="text-3xl font-light text-gray-800 mb-2">
          <JapaneseText withFurigana kanji="今日の心の記録" reading="きょうのこころのきろく">
            今日の心の記録
          </JapaneseText>
        </h1>
        <p className="text-gray-600">{greeting}</p>
      </CulturalContext>

      {/* Cultural Prompts */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          <JapaneseText>文化的な気づきのテーマ</JapaneseText>
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {culturalPrompts.map((prompt) => (
            <CulturalContext key={prompt.theme} type="respectful">
              <Button
                variant="outline"
                onClick={() => selectPrompt(prompt)}
                className="h-auto p-4 text-left flex flex-col items-start space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-medium text-sage-600">
                    <JapaneseText>{prompt.culturalConcept}</JapaneseText>
                  </span>
                </div>
                <p className="text-sm text-gray-600">{prompt.description}</p>
              </Button>
            </CulturalContext>
          ))}
        </div>
      </Card>

      {/* Mood Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">
          <JapaneseText>今の気持ち</JapaneseText>
        </h3>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          {Object.entries(japaneseTranslations.emotions).map(([key, emotion]) => (
            <Button
              key={key}
              variant={selectedMood === emotion ? 'sage' : 'outline'}
              onClick={() => setSelectedMood(emotion)}
              className="h-12 text-sm"
            >
              <JapaneseText>{emotion}</JapaneseText>
            </Button>
          ))}
        </div>
      </Card>

      {/* Journal Writing Area */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">
            <JapaneseText>自由な記録</JapaneseText>
          </h3>
          <JapaneseInput
            multiline
            value={journalContent}
            onChange={(e) => setJournalContent(e.target.value)}
            placeholder="今日の気持ち、考え、体験について自由に書いてください。正しい答えはありません。あなたのペースで。"
            className="w-full min-h-[200px] p-4 border border-gray-200 rounded-lg resize-vertical"
          />
          
          {/* Character count and composition indicator */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{journalContent.length} 文字</span>
            {crisisDetection && crisisDetection.severity !== 'none' && (
              <span className="text-orange-600">
                心のサポートが利用できます
              </span>
            )}
          </div>
        </div>
      </Card>

      {/* Khepera Response */}
      {kheperaResponse && (
        <CulturalContext type="harmony">
          <Card className="p-6 bg-sage-50 border-sage-200">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-sage-400 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm">ケ</span>
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sage-800 mb-2">
                  <JapaneseText>ケペラからの気づき</JapaneseText>
                </h4>
                <p className="text-sage-700 leading-relaxed">
                  <JapaneseText>{kheperaResponse}</JapaneseText>
                </p>
              </div>
            </div>
          </Card>
        </CulturalContext>
      )}

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => {
            setJournalContent('');
            setSelectedMood('');
            setCurrentPrompt(null);
            setKheperaResponse('');
          }}
        >
          <JapaneseText>クリア</JapaneseText>
        </Button>
        <Button
          onClick={handleSave}
          disabled={!journalContent.trim() || saving}
          variant="sage"
          size="lg"
        >
          {saving ? (
            <JapaneseText>保存中...</JapaneseText>
          ) : (
            <JapaneseText>記録を保存</JapaneseText>
          )}
        </Button>
      </div>

      {/* Cultural Note */}
      <CulturalContext type="collective" className="text-center">
        <p className="text-sm text-gray-500">
          <JapaneseText>
            あなたの心の記録は大切に保護され、完全にプライベートです。
            あなたのペースで、安全に進めていきましょう。
          </JapaneseText>
        </p>
      </CulturalContext>
    </div>
  );
}

/**
 * Japanese Mood Selector Component
 */
export function JapaneseMoodSelector({
  selectedMood,
  onMoodSelect,
  formalityLevel = 'polite'
}: {
  selectedMood: string;
  onMoodSelect: (mood: string) => void;
  formalityLevel?: 'casual' | 'polite' | 'formal';
}) {
  const moodCategories = {
    positive: ['嬉しい', '楽しい', '満足', '希望に満ちた', '感謝', '平和'],
    neutral: ['普通', '落ち着いている', 'リラックス', '考えている'],
    challenging: ['悲しい', '不安', '疲れた', 'ストレス', '混乱', '孤独']
  };

  return (
    <div className="space-y-4">
      {Object.entries(moodCategories).map(([category, moods]) => (
        <div key={category}>
          <h4 className="text-sm font-medium text-gray-600 mb-2 capitalize">
            {category === 'positive' ? '前向きな気持ち' :
             category === 'neutral' ? '落ち着いた気持ち' :
             '挑戦的な気持ち'}
          </h4>
          <div className="flex flex-wrap gap-2">
            {moods.map((mood) => (
              <Button
                key={mood}
                variant={selectedMood === mood ? 'sage' : 'outline'}
                size="sm"
                onClick={() => onMoodSelect(mood)}
              >
                <JapaneseText>{mood}</JapaneseText>
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}