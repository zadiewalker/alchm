'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { healingTraditionsIntegrator, HealingTradition } from '@/lib/healing-traditions-integration';
import { culturalMicrocopyAuditor } from '@/lib/cultural-microcopy-audit';
import { LOCALE_CONFIG, getCulturalGreeting } from '@/lib/i18n';

interface CulturalSanctuaryShellProps {
  children: React.ReactNode;
  userCulturalContext?: {
    culturalBackground: string[];
    preferredLanguage: string;
    healingPreferences: string[];
    visualTheme?: string;
    communicationStyle?: 'direct' | 'contextual' | 'balanced';
  };
}

export default function CulturalSanctuaryShell({ 
  children, 
  userCulturalContext 
}: CulturalSanctuaryShellProps) {
  const [activeTheme, setActiveTheme] = useState('sanctuary-default');
  const [culturalGreeting, setCulturalGreeting] = useState('Welcome to your sanctuary');
  const [showCulturalSettings, setShowCulturalSettings] = useState(false);
  const [availableTraditions, setAvailableTraditions] = useState<HealingTradition[]>([]);
  const [culturalMicrocopy, setCulturalMicrocopy] = useState<Record<string, string>>({});

  useEffect(() => {
    if (userCulturalContext) {
      // Set culturally appropriate greeting
      const greeting = getCulturalGreeting(userCulturalContext.preferredLanguage as any);
      setCulturalGreeting(greeting);

      // Load appropriate healing traditions
      const traditions = healingTraditionsIntegrator.getAppropriatePractices({
        culturalBackground: userCulturalContext.culturalBackground,
        healingInterests: userCulturalContext.healingPreferences
      });
      
      // Get culturally-adapted microcopy
      const microcopy = culturalMicrocopyAuditor.generateCulturalMicrocopy('reflection');
      setCulturalMicrocopy(microcopy);

      // Set visual theme based on cultural preferences
      if (userCulturalContext.visualTheme) {
        setActiveTheme(userCulturalContext.visualTheme);
        applyTheme(userCulturalContext.visualTheme);
      }
    }
  }, [userCulturalContext]);

  const applyTheme = (themeName: string) => {
    // Remove existing cultural theme classes
    document.body.className = document.body.className
      .replace(/theme-\w+/g, '')
      .replace(/spacing-\w+/g, '')
      .replace(/typography-\w+/g, '');

    // Apply new theme classes
    document.body.classList.add(`theme-${themeName}`);
    
    // Apply cultural spacing and typography preferences
    if (userCulturalContext?.communicationStyle === 'direct') {
      document.body.classList.add('spacing-dense', 'typography-default');
    } else if (userCulturalContext?.communicationStyle === 'contextual') {
      document.body.classList.add('spacing-generous', 'typography-scholarly');
    } else {
      document.body.classList.add('spacing-balanced', 'typography-gentle');
    }
  };

  const themeOptions = [
    { id: 'sanctuary-default', name: 'Sanctuary (Default)', description: 'Clean, minimal, universally accessible' },
    { id: 'ubuntu', name: 'Ubuntu Community', description: 'Inspired by African Ubuntu philosophy' },
    { id: 'harmony', name: 'Harmony Balance', description: 'Inspired by East Asian balance traditions' },
    { id: 'tierra', name: 'Tierra Vibrant', description: 'Inspired by Latin American celebration of life' },
    { id: 'sacred-geometry', name: 'Sacred Geometry', description: 'Inspired by MENA geometric traditions' },
    { id: 'lotus', name: 'Lotus Wisdom', description: 'Inspired by South Asian spiritual traditions' },
    { id: 'land-connection', name: 'Land Connection', description: 'Inspired by Indigenous earth wisdom' }
  ];

  return (
    <div className={`cultural-sanctuary ${activeTheme}`}>
      {/* Cultural Theme Selector - Only show if user has indicated cultural preferences */}
      {userCulturalContext && (
        <div className="fixed top-4 right-4 z-50">
          <Button
            onClick={() => setShowCulturalSettings(!showCulturalSettings)}
            className="bg-white/90 backdrop-blur-sm border border-sage-200 text-sage-800 hover:bg-sage-50 shadow-soft"
            size="sm"
          >
            🎨 Cultural Themes
          </Button>
          
          {showCulturalSettings && (
            <Card className="absolute top-12 right-0 w-80 bg-white/95 backdrop-blur-sm border-sage-200 shadow-lg p-4">
              <div className="space-y-3">
                <div className="text-sm font-medium text-sage-800 mb-3">
                  Choose a visual theme that honors your cultural aesthetic preferences:
                </div>
                
                {themeOptions.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => {
                      setActiveTheme(theme.id);
                      applyTheme(theme.id);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                      activeTheme === theme.id
                        ? 'border-sage-400 bg-sage-50 shadow-sm'
                        : 'border-sage-200 hover:border-sage-300 hover:bg-sage-25'
                    }`}
                  >
                    <div className="font-medium text-sage-800 text-sm">{theme.name}</div>
                    <div className="text-xs text-sage-600 mt-1">{theme.description}</div>
                  </button>
                ))}
                
                <div className="pt-3 border-t border-sage-200">
                  <p className="text-xs text-sage-600 leading-relaxed">
                    These themes are offered with deep respect for the cultures that inspire them. 
                    Visual elements honor aesthetic traditions without appropriating sacred symbols.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Cultural Greeting Bar */}
      {userCulturalContext && (
        <div className="bg-gradient-to-r from-sage-50 to-terra-50 border-b border-sage-100 px-6 py-3">
          <div className="max-w-4xl mx-auto">
            <p className="text-sage-700 text-sm font-medium">
              {culturalGreeting}
            </p>
            {userCulturalContext.culturalBackground.length > 0 && (
              <p className="text-sage-600 text-xs mt-1">
                This sanctuary honors your {userCulturalContext.culturalBackground.join(' and ')} heritage
              </p>
            )}
          </div>
        </div>
      )}

      {/* Main Content with Cultural Adaptations */}
      <main className="min-h-screen cultural-adapted-layout">
        {children}
      </main>

      {/* Cultural Healing Wisdom Footer */}
      {userCulturalContext && availableTraditions.length > 0 && (
        <footer className="bg-sage-25 border-t border-sage-100 px-6 py-8">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-sage-800 font-medium mb-4 text-lg">
              Healing Wisdom from Your Traditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTraditions.slice(0, 3).map((tradition, index) => (
                <Card key={index} className="bg-white/80 border-sage-200 p-4 hover:shadow-md transition-shadow">
                  <div className="text-sm font-medium text-sage-800 mb-2">
                    {tradition.name}
                  </div>
                  <div className="text-xs text-sage-600 mb-3">
                    Origin: {tradition.culturalOrigin}
                  </div>
                  <div className="text-xs text-sage-700 leading-relaxed">
                    {tradition.corePhilosophy}
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6 text-xs text-sage-600 leading-relaxed">
              <strong>Cultural Respect Notice:</strong> These healing traditions are shared with deep respect 
              for their cultural origins. We encourage learning from qualified teachers and supporting the 
              communities that maintain these wisdom traditions.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}