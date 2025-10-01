'use client';

import { useState } from 'react';

export default function DesignSystemDemo() {
  const [showDemo, setShowDemo] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setShowDemo(!showDemo)}
          className="btn-base btn-secondary"
          style={{
            fontSize: '12px',
            padding: '8px 12px',
            minHeight: '36px'
          }}
        >
          {showDemo ? 'Hide' : 'Show'} Design System
        </button>
      </div>

      {/* Design System Demo Panel */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" onClick={() => setShowDemo(false)}>
          <div 
            className="fixed right-4 top-4 bottom-4 w-96 bg-sanctuary-white border border-sage-200 rounded-2xl shadow-elevated overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-2xl font-medium text-text-primary mb-6" style={{ 
                fontSize: 'var(--text-2xl)',
                fontWeight: 'var(--font-medium)',
                color: 'var(--text-primary)',
                marginBottom: 'var(--space-rest)'
              }}>
                ALCHM Design System
              </h2>

              {/* Color Palette */}
              <section className="mb-8">
                <h3 className="text-lg font-medium text-sage-600 mb-4" style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sage-600)',
                  marginBottom: 'var(--space-pause)'
                }}>
                  Sacred Color Palette
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800].map(weight => (
                    <div key={weight} className="text-center">
                      <div 
                        className="w-full h-12 rounded-lg mb-1 border border-sage-200"
                        style={{ backgroundColor: `var(--sage-${weight})` }}
                      />
                      <span className="text-xs text-text-muted">sage-{weight}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Typography Scale */}
              <section className="mb-8">
                <h3 className="text-lg font-medium text-sage-600 mb-4" style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sage-600)',
                  marginBottom: 'var(--space-pause)'
                }}>
                  Typography Scale
                </h3>
                <div className="space-y-2">
                  {[
                    { size: 'xs', label: 'Micro details' },
                    { size: 'sm', label: 'Secondary info' },
                    { size: 'base', label: 'Body text' },
                    { size: 'lg', label: 'Emphasized body' },
                    { size: 'xl', label: 'Small headings' },
                    { size: '2xl', label: 'Section headings' },
                    { size: '3xl', label: 'Page headings' }
                  ].map(({ size, label }) => (
                    <div key={size}>
                      <div 
                        className="text-text-primary"
                        style={{ 
                          fontSize: `var(--text-${size})`,
                          color: 'var(--text-primary)'
                        }}
                      >
                        The quick brown fox ({size})
                      </div>
                      <div className="text-xs text-text-muted">{label}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Spacing System */}
              <section className="mb-8">
                <h3 className="text-lg font-medium text-sage-600 mb-4" style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sage-600)',
                  marginBottom: 'var(--space-pause)'
                }}>
                  Breathing-Based Spacing
                </h3>
                <div className="space-y-3">
                  {[
                    { space: 'whisper', px: '4px' },
                    { space: 'breath', px: '8px' },
                    { space: 'pause', px: '16px' },
                    { space: 'rest', px: '24px' },
                    { space: 'comfort', px: '32px' },
                    { space: 'sanctuary', px: '48px' }
                  ].map(({ space, px }) => (
                    <div key={space} className="flex items-center gap-3">
                      <div 
                        className="bg-sage-200"
                        style={{ 
                          width: `var(--space-${space})`,
                          height: '16px',
                          minWidth: `var(--space-${space})`
                        }}
                      />
                      <span className="text-sm text-text-secondary">
                        --space-{space} ({px})
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Button System */}
              <section className="mb-8">
                <h3 className="text-lg font-medium text-sage-600 mb-4" style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sage-600)',
                  marginBottom: 'var(--space-pause)'
                }}>
                  Compassionate Buttons
                </h3>
                <div className="space-y-3">
                  <button className="btn-base btn-primary w-full">
                    Primary Action
                  </button>
                  <button className="btn-base btn-secondary w-full">
                    Secondary Action
                  </button>
                  <button className="btn-base btn-ghost w-full">
                    Ghost Action
                  </button>
                  <button className="btn-base btn-crisis w-full">
                    Crisis Support
                  </button>
                </div>
              </section>

              {/* Card System */}
              <section className="mb-8">
                <h3 className="text-lg font-medium text-sage-600 mb-4" style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sage-600)',
                  marginBottom: 'var(--space-pause)'
                }}>
                  Sacred Cards
                </h3>
                <div className="space-y-4">
                  <div 
                    className="card-sanctuary cursor-pointer"
                    onClick={() => setSelectedCard('sanctuary')}
                  >
                    <div className="card-content">
                      <h4 className="font-medium text-text-primary">Sanctuary Card</h4>
                      <p className="text-sm text-text-secondary">
                        Base card design with gentle hover states
                      </p>
                    </div>
                  </div>
                  
                  <div 
                    className="card-reflection cursor-pointer"
                    onClick={() => setSelectedCard('reflection')}
                  >
                    <div className="card-content">
                      <h4 className="font-medium text-text-primary">Reflection Card</h4>
                      <p className="text-sm text-text-secondary">
                        For contemplative content
                      </p>
                    </div>
                  </div>

                  <div 
                    className="card-pathway cursor-pointer"
                    onClick={() => setSelectedCard('pathway')}
                  >
                    <div className="card-content">
                      <h4 className="font-medium text-text-primary">Pathway Card</h4>
                      <p className="text-sm text-text-secondary">
                        For guided journeys
                      </p>
                    </div>
                  </div>

                  <div 
                    className="card-crisis cursor-pointer"
                    onClick={() => setSelectedCard('crisis')}
                  >
                    <div className="card-content">
                      <h4 className="font-medium text-text-primary">Crisis Card</h4>
                      <p className="text-sm text-text-secondary">
                        For support resources
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Form Elements */}
              <section className="mb-8">
                <h3 className="text-lg font-medium text-sage-600 mb-4" style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sage-600)',
                  marginBottom: 'var(--space-pause)'
                }}>
                  Emotional Intelligence Inputs
                </h3>
                <div className="space-y-4">
                  <input 
                    type="text" 
                    placeholder="Sacred input field..."
                    className="input-sanctuary"
                  />
                  <textarea 
                    placeholder="Begin your reflection here..."
                    className="textarea-journal"
                    rows={4}
                  />
                </div>
              </section>

              {/* Animations Demo */}
              <section className="mb-8">
                <h3 className="text-lg font-medium text-sage-600 mb-4" style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: 'var(--font-medium)',
                  color: 'var(--sage-600)',
                  marginBottom: 'var(--space-pause)'
                }}>
                  Gentle Animations
                </h3>
                <div className="space-y-4">
                  <div className="card-sanctuary">
                    <div className="loading-breathe w-4 h-4 bg-sage-400 rounded-full mx-auto mb-2" />
                    <p className="text-sm text-center text-text-secondary">Breathing animation</p>
                  </div>
                  
                  <div className="stagger-children animate">
                    <div className="card-sanctuary mb-2">
                      <p className="text-sm text-text-secondary">Staggered item 1</p>
                    </div>
                    <div className="card-sanctuary mb-2">
                      <p className="text-sm text-text-secondary">Staggered item 2</p>
                    </div>
                    <div className="card-sanctuary">
                      <p className="text-sm text-text-secondary">Staggered item 3</p>
                    </div>
                  </div>
                </div>
              </section>

              {selectedCard && (
                <div className="bg-sage-50 p-4 rounded-lg border border-sage-200">
                  <p className="text-sm text-text-secondary">
                    You selected: <strong className="text-sage-600">{selectedCard}</strong> card
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </>
  );
}