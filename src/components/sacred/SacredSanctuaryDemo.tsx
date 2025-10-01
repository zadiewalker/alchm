'use client';

import React, { useState } from 'react';

/**
 * Sacred Digital Sanctuary Demo Component
 * 
 * This component demonstrates the complete sacred design system with:
 * - Sacred geometry and Fibonacci-based spacing
 * - Sage green palette with spiritual comfort colors
 * - Nature-inspired patterns and organic shapes
 * - Ritual-like micro-interactions
 * - Typography that evokes contemplation
 * - Breathing space and visual meditation
 */

interface SacredComponentProps {
  children: React.ReactNode;
  className?: string;
}

const SacredCard: React.FC<SacredComponentProps> = ({ children, className = '' }) => (
  <div className={`sacred-card sacred-hover blessing-touch ${className}`}>
    {children}
  </div>
);

const SacredButton: React.FC<{
  variant?: 'primary' | 'secondary' | 'blessing';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ variant = 'primary', children, onClick, className = '' }) => (
  <button
    className={`alchm-button alchm-button--${variant} sacred-hover blessing-touch ${className}`}
    onClick={onClick}
  >
    {children}
  </button>
);

const SacredInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ placeholder, value, onChange, className = '' }) => (
  <input
    type="text"
    className={`alchm-input contemplative-focus ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
  />
);

const SacredTextarea: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}> = ({ placeholder, value, onChange, className = '' }) => (
  <textarea
    className={`alchm-textarea contemplative-focus ${className}`}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={6}
  />
);

export default function SacredSanctuaryDemo() {
  const [journalText, setJournalText] = useState('');
  const [intention, setIntention] = useState('');
  const [isBlessing, setIsBlessing] = useState(false);

  const handleBlessingClick = () => {
    setIsBlessing(true);
    setTimeout(() => setIsBlessing(false), 2000);
  };

  return (
    <div className="sacred-sanctuary sacred-pattern min-h-screen">
      {/* Sacred Header */}
      <div className="sacred-section">
        <div className="sanctuary-container-enhanced">
          <div className="text-center space-y-phi">
            <h1 className="font-blessing weight-whisper text-8xl text-sanctuary tracking-spacious animate-sacred-breathing">
              Sacred Digital Sanctuary
            </h1>
            <p className="font-contemplation weight-presence text-xl text-sanctuary/90 leading-spacious tracking-comfortable max-w-2xl mx-auto">
              Experience the spiritual design system that creates a sense of reverence, 
              peace, and meaningful interaction through sacred geometry and nature-inspired patterns.
            </p>
          </div>
        </div>
      </div>

      <div className="ritual-divider" />

      {/* Sacred Components Showcase */}
      <div className="sacred-section">
        <div className="sanctuary-container-enhanced">
          <div className="sacred-grid">
            
            {/* Sacred Colors Palette */}
            <SacredCard className="fibonacci-pattern">
              <h2 className="font-blessing weight-sacred text-2xl text-sage-800 mb-mindful tracking-comfortable">
                Sacred Color Palette
              </h2>
              <div className="space-y-contemplative">
                <div className="flex items-center gap-gentle">
                  <div className="w-8 h-8 bg-sage-400 rounded-infinite shadow-blessing animate-sacred-pulse" />
                  <span className="font-contemplation text-sage-700">Sage Green - Growth & Wisdom</span>
                </div>
                <div className="flex items-center gap-gentle">
                  <div className="w-8 h-8 bg-blush-soft rounded-infinite shadow-blessing animate-sacred-pulse blessing-delay-1" />
                  <span className="font-contemplation text-sage-700">Soft Blush - Emotional Comfort</span>
                </div>
                <div className="flex items-center gap-gentle">
                  <div className="w-8 h-8 bg-terracotta rounded-infinite shadow-blessing animate-sacred-pulse blessing-delay-2" />
                  <span className="font-contemplation text-sage-700">Terracotta - Earthly Humanity</span>
                </div>
                <div className="flex items-center gap-gentle">
                  <div className="w-8 h-8 bg-sanctuary rounded-infinite shadow-blessing animate-sacred-pulse blessing-delay-3" />
                  <span className="font-contemplation text-sage-700">Sanctuary White - Breathing Space</span>
                </div>
              </div>
            </SacredCard>

            {/* Sacred Typography */}
            <SacredCard className="organic-flow">
              <h2 className="font-blessing weight-sacred text-2xl text-sage-800 mb-mindful tracking-comfortable">
                Sacred Typography
              </h2>
              <div className="space-y-contemplative">
                <p className="font-blessing weight-whisper text-4xl text-sage-600 tracking-intimate">
                  Whisper Weight
                </p>
                <p className="font-contemplation weight-breath text-2xl text-sage-700 tracking-comfortable">
                  Breath Weight
                </p>
                <p className="font-sacred weight-presence text-xl text-sage-800 tracking-natural leading-comfortable">
                  Presence Weight - For comfortable reading and contemplation
                </p>
                <p className="font-contemplation weight-intention text-lg text-sage-800 tracking-spacious leading-spacious">
                  Intention Weight - For mindful emphasis and sacred text
                </p>
              </div>
            </SacredCard>

            {/* Sacred Spacing & Geometry */}
            <SacredCard>
              <h2 className="font-blessing weight-sacred text-2xl text-sage-800 mb-mindful tracking-comfortable">
                Sacred Geometry
              </h2>
              <div className="space-y-contemplative">
                <div className="p-breath bg-blush-soft/30 rounded-breath">
                  <span className="font-meditation text-sm text-sage-600">Breath spacing (8px)</span>
                </div>
                <div className="p-contemplative bg-blush-warm/30 rounded-embrace">
                  <span className="font-meditation text-sm text-sage-600">Contemplative spacing (24px)</span>
                </div>
                <div className="p-phi bg-terracotta-light/30 rounded-temple">
                  <span className="font-meditation text-sm text-sage-600">Golden ratio spacing (φ = 52px)</span>
                </div>
                <div className="p-fibonacci bg-sage-200/30 rounded-sacred">
                  <span className="font-meditation text-sm text-sage-600">Fibonacci spacing (40px)</span>
                </div>
              </div>
            </SacredCard>

            {/* Sacred Interactions */}
            <SacredCard>
              <h2 className="font-blessing weight-sacred text-2xl text-sage-800 mb-mindful tracking-comfortable">
                Sacred Interactions
              </h2>
              <div className="blessing-buttons">
                <SacredButton 
                  variant="primary"
                  onClick={handleBlessingClick}
                  className={isBlessing ? 'celebrate' : ''}
                >
                  Primary Sacred Action
                </SacredButton>
                <SacredButton variant="secondary">
                  Secondary Blessing
                </SacredButton>
                <SacredButton variant="blessing">
                  Special Ritual
                </SacredButton>
              </div>
              <div className="mt-mindful space-y-contemplative">
                <SacredInput 
                  placeholder="Enter your sacred intention..."
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                />
              </div>
            </SacredCard>

            {/* Sacred Writing Space */}
            <SacredCard className="md:col-span-2">
              <h2 className="font-blessing weight-sacred text-2xl text-sage-800 mb-mindful tracking-comfortable">
                Sacred Writing Sanctuary
              </h2>
              <div className="meditation-zone">
                <SacredTextarea
                  placeholder="This is your sacred space for contemplation and reflection. Notice the gentle breathing animation, the soft shadows, and the nature-inspired patterns that create a sense of reverence and peace. Write whatever comes from your heart..."
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                />
                <div className="mt-phi text-center">
                  <span className="font-meditation text-sm text-sage-600 tracking-spacious">
                    {journalText.length > 0 ? `${journalText.length} characters of sacred expression` : 'Awaiting your sacred words...'}
                  </span>
                </div>
              </div>
            </SacredCard>

            {/* Sacred Animation States */}
            <SacredCard>
              <h2 className="font-blessing weight-sacred text-2xl text-sage-800 mb-mindful tracking-comfortable">
                Sacred Animations
              </h2>
              <div className="space-y-contemplative">
                <div className="p-mindful bg-sanctuary rounded-temple shadow-blessing animate-sacred-breathing">
                  <span className="font-contemplation text-sage-700">Sacred Breathing</span>
                </div>
                <div className="p-mindful bg-blush-soft rounded-embrace shadow-sanctuary animate-divine-float">
                  <span className="font-contemplation text-sage-700">Divine Float</span>
                </div>
                <div className="p-mindful bg-terracotta-light rounded-sanctuary shadow-temple animate-blessing-sparkle">
                  <span className="font-contemplation text-sage-700">Blessing Sparkle</span>
                </div>
                <div className="sacred-indicator active p-mindful bg-sage-100 rounded-breath">
                  <span className="font-contemplation text-sage-700">Sacred Indicator</span>
                </div>
              </div>
            </SacredCard>

            {/* Sacred Loading States */}
            <SacredCard>
              <h2 className="font-blessing weight-sacred text-2xl text-sage-800 mb-mindful tracking-comfortable">
                Sacred States
              </h2>
              <div className="space-y-contemplative">
                <div className="sacred-loading p-meditation bg-blush-soft/20 rounded-temple text-center">
                  <span className="font-contemplation text-sage-700">Sacred Loading</span>
                </div>
                <div className="p-mindful bg-sacred-gradient rounded-embrace text-sanctuary text-center">
                  <span className="font-contemplation">Sacred Gradient</span>
                </div>
                <div className="p-mindful bg-blessing-gradient rounded-sanctuary text-sage-800 text-center">
                  <span className="font-contemplation">Blessing Gradient</span>
                </div>
                <div className="p-mindful bg-earth-gradient rounded-temple text-sanctuary text-center">
                  <span className="font-contemplation">Earth Gradient</span>
                </div>
              </div>
            </SacredCard>

          </div>
        </div>
      </div>

      <div className="ritual-divider" />

      {/* Sacred Philosophy */}
      <div className="sacred-section">
        <div className="sanctuary-container-enhanced">
          <div className="text-center max-w-4xl mx-auto space-y-phi">
            <h2 className="font-blessing weight-breath text-4xl text-sanctuary tracking-spacious leading-tight">
              Design Philosophy
            </h2>
            <div className="space-y-contemplative text-sanctuary/90 font-contemplation weight-presence leading-spacious tracking-comfortable">
              <p className="text-lg">
                This sacred design system transforms digital interfaces into sanctuaries for healing. 
                Every element serves the deeper purpose of creating reverence, peace, and meaningful connection.
              </p>
              <p>
                Sacred geometry guides our spacing through the golden ratio and Fibonacci sequences. 
                Nature-inspired patterns connect users to something larger than themselves. 
                Micro-interactions feel like gentle blessings rather than mechanical functions.
              </p>
              <p>
                The sage green palette represents growth and spiritual healing, while soft blush provides 
                emotional comfort and terracotta grounds users in earthly warmth and humanity. 
                Off-white sanctuary space creates visual meditation and breathing room for the soul.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final Sacred Blessing */}
      <div className="text-center py-sanctuary">
        <p className="font-meditation text-sanctuary/60 text-sm tracking-ceremonial">
          🕊️ May this digital sanctuary bring peace, healing, and transformation 🌱
        </p>
      </div>
    </div>
  );
}