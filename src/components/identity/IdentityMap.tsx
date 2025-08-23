// ALCHM Identity Map Visualization Component
// Interactive, culturally responsive identity exploration interface

'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  IdentityMap as IIdentityMap,
  PersonalIdentityElement,
  CulturalIdentityElement,
  AspirationalIdentityElement,
  IdentityIntersection,
  CulturalContext,
  IdentityJourney,
  BiasReflection
} from '@/types/identity-schema';
import { CulturalFluencyAI, GeneratedPrompt } from '@/lib/cultural-fluency-ai';

interface IdentityMapProps {
  identityMap: IIdentityMap;
  culturalContext: CulturalContext;
  onElementUpdate: (element: PersonalIdentityElement | CulturalIdentityElement | AspirationalIdentityElement) => void;
  onIntersectionExplore: (intersection: IdentityIntersection) => void;
  onReflectionGenerate: (elementId: string, reflectionType: string) => void;
  traumaInformedMode: boolean;
  readOnly?: boolean;
  showPrivateElements?: boolean;
  culturalAdaptationLevel: 'surface' | 'integrated' | 'immersive';
}

interface IdentityMapState {
  activeElement: string | null;
  selectedElements: string[];
  viewMode: 'overview' | 'personal' | 'cultural' | 'aspirational' | 'intersections';
  showHiddenElements: boolean;
  filterByVisibility: 'all' | 'public' | 'community' | 'private';
  reflectionMode: boolean;
  biasCheckMode: boolean;
  empathyBuildingMode: boolean;
  narrativeMode: boolean;
  intersectionAnalysisMode: boolean;
  healingFocusMode: boolean;
}

export const IdentityMapComponent: React.FC<IdentityMapProps> = ({
  identityMap,
  culturalContext,
  onElementUpdate,
  onIntersectionExplore,
  onReflectionGenerate,
  traumaInformedMode,
  readOnly = false,
  showPrivateElements = true,
  culturalAdaptationLevel
}) => {
  
  const [state, setState] = useState<IdentityMapState>({
    activeElement: null,
    selectedElements: [],
    viewMode: 'overview',
    showHiddenElements: false,
    filterByVisibility: 'all',
    reflectionMode: false,
    biasCheckMode: false,
    empathyBuildingMode: false,
    narrativeMode: false,
    intersectionAnalysisMode: false,
    healingFocusMode: false
  });

  const [culturalAI] = useState(() => new CulturalFluencyAI({
    primaryAI: 'hybrid',
    culturalSensitivity: 'high',
    languagePreference: 'en',
    tonePreference: 'healing_centered',
    culturalFrameworks: [],
    traumaInformed: traumaInformedMode,
    intersectionalAnalysis: true,
    communityWisdomIntegration: true
  }));

  // Filter elements based on current settings
  const filteredElements = useMemo(() => {
    const allElements = [
      ...identityMap.personal.map(e => ({ ...e, category: 'personal' as const })),
      ...identityMap.cultural.map(e => ({ ...e, category: 'cultural' as const })),
      ...identityMap.aspirational.map(e => ({ ...e, category: 'aspirational' as const }))
    ];

    return allElements.filter(element => {
      // Visibility filter
      if (state.filterByVisibility !== 'all' && element.visibility !== state.filterByVisibility) {
        return false;
      }

      // Private elements visibility
      if (!showPrivateElements && element.visibility === 'private') {
        return false;
      }

      // View mode filter
      if (state.viewMode !== 'overview' && element.category !== state.viewMode) {
        return false;
      }

      return true;
    });
  }, [identityMap, state.filterByVisibility, state.viewMode, showPrivateElements]);

  // Calculate element positioning for visualization
  const elementPositions = useMemo(() => {
    const positions = new Map<string, { x: number; y: number; radius: number }>();
    const centerX = 400;
    const centerY = 300;
    
    // Position elements in concentric circles by category
    identityMap.personal.forEach((element, index) => {
      const angle = (2 * Math.PI * index) / identityMap.personal.length;
      const radius = 120 + (element.significance * 20);
      positions.set(element.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        radius: 8 + (element.significance * 2)
      });
    });

    identityMap.cultural.forEach((element, index) => {
      const angle = (2 * Math.PI * index) / identityMap.cultural.length + Math.PI / 4;
      const radius = 200 + (element.significance * 15);
      positions.set(element.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        radius: 10 + (element.significance * 2)
      });
    });

    identityMap.aspirational.forEach((element, index) => {
      const angle = (2 * Math.PI * index) / identityMap.aspirational.length + Math.PI / 2;
      const radius = 280 + (element.socialImpactPotential * 20);
      positions.set(element.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
        radius: 6 + (element.socialImpactPotential * 3)
      });
    });

    return positions;
  }, [identityMap]);

  // Generate cultural reflection prompt
  const generateReflectionPrompt = useCallback(async (
    elementId: string,
    promptType: string
  ) => {
    try {
      const element = [
        ...identityMap.personal,
        ...identityMap.cultural,
        ...identityMap.aspirational
      ].find(e => e.id === elementId);

      if (!element) return;

      const prompt = await culturalAI.generateCulturalPrompt({
        userId: 'current_user', // Would be passed from props
        promptType: promptType as any,
        context: {
          culturalContext,
          recentContent: element.description || '',
          progressLevel: 0.5
        },
        culturalAdaptationLevel,
        urgencyLevel: 'contemplative'
      });

      onReflectionGenerate(elementId, prompt.content);
    } catch (error) {
      console.error('Error generating reflection prompt:', error);
    }
  }, [identityMap, culturalContext, culturalAI, culturalAdaptationLevel, onReflectionGenerate]);

  // Handle element interaction
  const handleElementClick = useCallback((elementId: string) => {
    if (readOnly) return;

    setState(prev => ({
      ...prev,
      activeElement: prev.activeElement === elementId ? null : elementId,
      selectedElements: prev.selectedElements.includes(elementId)
        ? prev.selectedElements.filter(id => id !== elementId)
        : [...prev.selectedElements, elementId]
    }));
  }, [readOnly]);

  // Handle intersection exploration
  const handleIntersectionClick = useCallback((intersection: IdentityIntersection) => {
    setState(prev => ({
      ...prev,
      intersectionAnalysisMode: true,
      selectedElements: intersection.elements
    }));
    onIntersectionExplore(intersection);
  }, [onIntersectionExplore]);

  // Toggle various modes
  const toggleMode = useCallback((mode: keyof IdentityMapState) => {
    setState(prev => ({
      ...prev,
      [mode]: !prev[mode]
    }));
  }, []);

  // Get element color based on category and properties
  const getElementColor = useCallback((element: any, category: string) => {
    const baseColors = {
      personal: '#3498db',
      cultural: '#e74c3c', 
      aspirational: '#2ecc71'
    };

    let color = baseColors[category as keyof typeof baseColors];

    // Adjust for bias check mode
    if (state.biasCheckMode && element.biasCheckRequired) {
      color = '#f39c12'; // Orange for bias check needed
    }

    // Adjust for healing focus mode  
    if (state.healingFocusMode && element.emotionalResonance > 7) {
      color = '#9b59b6'; // Purple for high emotional resonance
    }

    // Adjust opacity based on visibility
    const opacity = element.visibility === 'private' ? 0.7 : 
                   element.visibility === 'community' ? 0.85 : 1;

    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  }, [state.biasCheckMode, state.healingFocusMode]);

  // Render individual identity element
  const renderIdentityElement = useCallback((element: any, category: string, position: { x: number; y: number; radius: number }) => {
    const isActive = state.activeElement === element.id;
    const isSelected = state.selectedElements.includes(element.id);
    const color = getElementColor(element, category);

    return (
      <g key={element.id} className={`identity-element ${category}`}>
        {/* Element circle */}
        <circle
          cx={position.x}
          cy={position.y}
          r={position.radius + (isActive ? 4 : 0)}
          fill={color}
          stroke={isSelected ? '#ffffff' : 'transparent'}
          strokeWidth={isSelected ? 3 : 0}
          onClick={() => handleElementClick(element.id)}
          style={{ cursor: readOnly ? 'default' : 'pointer', transition: 'all 0.3s ease' }}
        />
        
        {/* Element label */}
        <text
          x={position.x}
          y={position.y + position.radius + 20}
          textAnchor="middle"
          fontSize="12"
          fill="#333"
          style={{ pointerEvents: 'none' }}
        >
          {element.identification || element.description?.substring(0, 15) + '...' || 'Element'}
        </text>

        {/* Significance indicator */}
        <circle
          cx={position.x + position.radius - 2}
          cy={position.y - position.radius + 2}
          r="3"
          fill={`rgba(255, 255, 255, ${element.significance / 10})`}
          style={{ pointerEvents: 'none' }}
        />

        {/* Bias check indicator */}
        {state.biasCheckMode && element.biasCheckRequired && (
          <circle
            cx={position.x - position.radius + 2}
            cy={position.y - position.radius + 2}
            r="4"
            fill="#f39c12"
            style={{ pointerEvents: 'none' }}
          />
        )}

        {/* Cultural resonance indicator */}
        {category === 'cultural' && element.prideLevels?.heritage > 8 && (
          <text
            x={position.x}
            y={position.y - position.radius - 10}
            textAnchor="middle"
            fontSize="16"
            fill="#e74c3c"
            style={{ pointerEvents: 'none' }}
          >
            ✨
          </text>
        )}

        {/* Healing focus indicator */}
        {state.healingFocusMode && element.emotionalResonance > 7 && (
          <text
            x={position.x + position.radius + 5}
            y={position.y + 5}
            textAnchor="middle"
            fontSize="14"
            fill="#9b59b6"
            style={{ pointerEvents: 'none' }}
          >
            💚
          </text>
        )}
      </g>
    );
  }, [state, getElementColor, handleElementClick, readOnly]);

  // Render intersection connections
  const renderIntersections = useCallback(() => {
    if (!state.intersectionAnalysisMode && state.viewMode !== 'intersections') return null;

    return identityMap.intersections.map(intersection => {
      const elementPositions = intersection.elements
        .map(id => ({ id, position: elementPositions.get(id) }))
        .filter(item => item.position);

      if (elementPositions.length < 2) return null;

      // Draw connections between intersecting elements
      const connections = [];
      for (let i = 0; i < elementPositions.length - 1; i++) {
        for (let j = i + 1; j < elementPositions.length; j++) {
          const pos1 = elementPositions[i].position!;
          const pos2 = elementPositions[j].position!;
          
          connections.push(
            <line
              key={`${intersection.id}_${i}_${j}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={intersection.intersectionType === 'reinforcing' ? '#2ecc71' :
                     intersection.intersectionType === 'challenging' ? '#e74c3c' :
                     intersection.intersectionType === 'complex' ? '#f39c12' : '#95a5a6'}
              strokeWidth={intersection.strength * 3}
              strokeOpacity={0.6}
              onClick={() => handleIntersectionClick(intersection)}
              style={{ cursor: 'pointer' }}
            />
          );
        }
      }

      return (
        <g key={intersection.id} className="identity-intersection">
          {connections}
        </g>
      );
    });
  }, [identityMap.intersections, elementPositions, state.intersectionAnalysisMode, state.viewMode, handleIntersectionClick]);

  return (
    <div className="identity-map-container" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      {/* Header and Controls */}
      <div className="identity-map-header" style={{ marginBottom: '20px' }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '16px' }}>
          🎭 Your Identity Map
        </h2>
        
        {/* View Mode Selector */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {(['overview', 'personal', 'cultural', 'aspirational', 'intersections'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setState(prev => ({ ...prev, viewMode: mode }))}
              style={{
                backgroundColor: state.viewMode === mode ? '#3498db' : 'white',
                color: state.viewMode === mode ? 'white' : '#3498db',
                border: '2px solid #3498db',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {mode.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Mode Toggles */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => toggleMode('biasCheckMode')}
            style={{
              backgroundColor: state.biasCheckMode ? '#f39c12' : 'transparent',
              color: state.biasCheckMode ? 'white' : '#f39c12',
              border: '1px solid #f39c12',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            🔍 Bias Check
          </button>
          
          <button
            onClick={() => toggleMode('empathyBuildingMode')}
            style={{
              backgroundColor: state.empathyBuildingMode ? '#e74c3c' : 'transparent',
              color: state.empathyBuildingMode ? 'white' : '#e74c3c',
              border: '1px solid #e74c3c',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ❤️ Empathy Building
          </button>
          
          <button
            onClick={() => toggleMode('healingFocusMode')}
            style={{
              backgroundColor: state.healingFocusMode ? '#9b59b6' : 'transparent',
              color: state.healingFocusMode ? 'white' : '#9b59b6',
              border: '1px solid #9b59b6',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            💚 Healing Focus
          </button>

          <button
            onClick={() => toggleMode('narrativeMode')}
            style={{
              backgroundColor: state.narrativeMode ? '#2ecc71' : 'transparent',
              color: state.narrativeMode ? 'white' : '#2ecc71',
              border: '1px solid #2ecc71',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            📖 Narrative Mode
          </button>
        </div>
      </div>

      {/* Cultural Context Display */}
      {culturalAdaptationLevel !== 'surface' && (
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e74c3c',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <h4 style={{ color: '#e74c3c', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🌍 Cultural Context
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Viewing through {culturalContext.valueSystem?.join(', ')} lens with {culturalAdaptationLevel} cultural integration
          </p>
        </div>
      )}

      {/* Trauma-Informed Note */}
      {traumaInformedMode && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #27ae60',
          borderRadius: '8px',
          padding: '12px',
          marginBottom: '20px'
        }}>
          <p style={{ margin: 0, fontSize: '12px', color: '#27ae60', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💚 <strong>Trauma-Informed Space:</strong> You have complete control over what you explore and share. Go at your own pace.
          </p>
        </div>
      )}

      {/* Main Visualization */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '20px',
        minHeight: '600px',
        position: 'relative'
      }}>
        <svg width="800" height="600" viewBox="0 0 800 600">
          {/* Background circles for categories */}
          <circle cx="400" cy="300" r="100" fill="rgba(52, 152, 219, 0.1)" stroke="rgba(52, 152, 219, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="400" cy="300" r="180" fill="rgba(231, 76, 60, 0.1)" stroke="rgba(231, 76, 60, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
          <circle cx="400" cy="300" r="260" fill="rgba(46, 204, 113, 0.1)" stroke="rgba(46, 204, 113, 0.3)" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Category labels */}
          <text x="400" y="220" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3498db">Personal</text>
          <text x="400" y="140" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e74c3c">Cultural</text>
          <text x="400" y="80" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2ecc71">Aspirational</text>

          {/* Render intersections first (so they appear behind elements) */}
          {renderIntersections()}

          {/* Render identity elements */}
          {filteredElements.map(element => {
            const position = elementPositions.get(element.id);
            return position ? renderIdentityElement(element, element.category, position) : null;
          })}
        </svg>
      </div>

      {/* Active Element Details Panel */}
      {state.activeElement && (
        <ActiveElementPanel
          element={filteredElements.find(e => e.id === state.activeElement)}
          onClose={() => setState(prev => ({ ...prev, activeElement: null }))}
          onReflectionGenerate={(type) => generateReflectionPrompt(state.activeElement!, type)}
          traumaInformedMode={traumaInformedMode}
          culturalAdaptationLevel={culturalAdaptationLevel}
          readOnly={readOnly}
        />
      )}

      {/* Legend */}
      <div style={{
        marginTop: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <h4 style={{ marginBottom: '12px', color: '#2c3e50' }}>Legend</h4>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3498db' }}></div>
            <span>Personal Identity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#e74c3c' }}></div>
            <span>Cultural Identity</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2ecc71' }}></div>
            <span>Aspirational Identity</span>
          </div>
          {state.biasCheckMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#f39c12' }}></div>
              <span>Bias Check Needed</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Active Element Details Panel Component
const ActiveElementPanel: React.FC<{
  element: any;
  onClose: () => void;
  onReflectionGenerate: (type: string) => void;
  traumaInformedMode: boolean;
  culturalAdaptationLevel: string;
  readOnly: boolean;
}> = ({ element, onClose, onReflectionGenerate, traumaInformedMode, culturalAdaptationLevel, readOnly }) => {
  
  if (!element) return null;

  const getReflectionPrompts = () => {
    const prompts = [
      { type: 'exploration', label: 'Explore Deeper', icon: '🔍' },
      { type: 'bias_awareness', label: 'Bias Check', icon: '⚖️' },
      { type: 'empathy_expansion', label: 'Empathy Building', icon: '❤️' },
      { type: 'healing_support', label: 'Healing Focus', icon: '💚' }
    ];

    if (element.category === 'cultural') {
      prompts.push({ type: 'bridge_building', label: 'Cultural Bridge', icon: '🌉' });
    }

    if (element.category === 'aspirational') {
      prompts.push({ type: 'allyship_activation', label: 'Allyship Action', icon: '🤝' });
    }

    return prompts;
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#2c3e50' }}>
            {element.identification || element.description || 'Identity Element'}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#95a5a6'
            }}
          >
            ×
          </button>
        </div>

        {/* Element Details */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '12px' }}>
            <strong>Category:</strong> {element.category}
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Significance:</strong> {element.significance}/10
          </div>
          <div style={{ marginBottom: '12px' }}>
            <strong>Visibility:</strong> {element.visibility}
          </div>
          {element.emotionalResonance && (
            <div style={{ marginBottom: '12px' }}>
              <strong>Emotional Resonance:</strong> {element.emotionalResonance}/10
            </div>
          )}
        </div>

        {/* Reflection Generation */}
        {!readOnly && (
          <div>
            <h4 style={{ marginBottom: '12px', color: '#2c3e50' }}>Generate Reflection</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {getReflectionPrompts().map(prompt => (
                <button
                  key={prompt.type}
                  onClick={() => onReflectionGenerate(prompt.type)}
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#e9ecef';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#f8f9fa';
                  }}
                >
                  <span>{prompt.icon}</span>
                  <span>{prompt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Trauma-Informed Note */}
        {traumaInformedMode && (
          <div style={{
            marginTop: '16px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #27ae60',
            borderRadius: '6px',
            padding: '10px',
            fontSize: '12px',
            color: '#27ae60'
          }}>
            💚 You have complete control over your reflections. Share only what feels safe and comfortable.
          </div>
        )}
      </div>
    </div>
  );
};

export default IdentityMapComponent;