// ALCHM IKIGAI Quadrant Input Component
// Visual quadrant capture interface with auto-save and AI assistance

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  PassionResponse,
  SkillResponse,
  ValueResponse,
  OpportunityResponse,
  CulturalAdaptation,
  IKIGAIQuadrantProps
} from '@/types/ikigai-schema';
import { CulturalContext } from '@/types/pathways-schema';

interface QuadrantItem {
  id: string;
  text: string;
  isEditing: boolean;
  metadata?: Record<string, any>;
}

interface AIAssistanceState {
  isActive: boolean;
  suggestions: string[];
  isLoading: boolean;
  currentSuggestionIndex: number;
}

const IKIGAIQuadrant: React.FC<IKIGAIQuadrantProps> = ({
  quadrantType,
  responses,
  onResponseUpdate,
  culturalContext,
  traumaInformedMode,
  aiAssistanceEnabled,
  isCompleted
}) => {
  const [items, setItems] = useState<QuadrantItem[]>([]);
  const [aiAssistance, setAiAssistance] = useState<AIAssistanceState>({
    isActive: false,
    suggestions: [],
    isLoading: false,
    currentSuggestionIndex: 0
  });
  const [isDragOver, setIsDragOver] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState<string | null>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize items from responses
  useEffect(() => {
    const initialItems = responses.map((response, index) => ({
      id: response.id || `item_${index}`,
      text: response.text,
      isEditing: false,
      metadata: response
    }));
    setItems(initialItems);
  }, [responses]);

  // Auto-save functionality
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      const updatedResponses = items
        .filter(item => item.text.trim().length > 0)
        .map(item => convertItemToResponse(item, quadrantType));
      
      onResponseUpdate(updatedResponses);
    }, 1000); // Save after 1 second of inactivity
  }, [items, quadrantType, onResponseUpdate]);

  useEffect(() => {
    scheduleAutoSave();
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [scheduleAutoSave]);

  // Quadrant configuration
  const getQuadrantConfig = () => {
    const configs = {
      passions: {
        title: 'What You LOVE',
        subtitle: 'Your passions, interests, and what makes you feel alive',
        placeholder: 'What activities, topics, or experiences light you up?',
        icon: '❤️',
        color: '#e74c3c',
        prompts: [
          'What do you love doing so much you lose track of time?',
          'What topics could you talk about for hours?',
          'What activities energize rather than drain you?',
          'What did you love as a child that still resonates?'
        ]
      },
      skills: {
        title: 'What You\'re GOOD AT',
        subtitle: 'Your talents, abilities, and developed competencies',
        placeholder: 'What skills and abilities do you excel at?',
        icon: '⚡',
        color: '#3498db',
        prompts: [
          'What do people often ask for your help with?',
          'What comes naturally to you that others find difficult?',
          'What skills have you developed through practice?',
          'What would colleagues say you\'re excellent at?'
        ]
      },
      values: {
        title: 'What the World NEEDS',
        subtitle: 'Your values, principles, and what matters most to you',
        placeholder: 'What values and principles guide your life?',
        icon: '🌟',
        color: '#2ecc71',
        prompts: [
          'What injustices or problems deeply concern you?',
          'What positive changes do you want to see in the world?',
          'What principles do you never compromise on?',
          'What legacy do you want to leave behind?'
        ]
      },
      opportunities: {
        title: 'What You Can Be PAID FOR',
        subtitle: 'Opportunities, careers, and ways to make a living',
        placeholder: 'What opportunities exist for you to earn income?',
        icon: '🚀',
        color: '#f39c12',
        prompts: [
          'What career paths align with your interests?',
          'What problems could you solve for people?',
          'What services or products could you offer?',
          'What industries or fields interest you?'
        ]
      }
    };
    
    return configs[quadrantType];
  };

  const config = getQuadrantConfig();

  // Add new item
  const addItem = useCallback(() => {
    const newItem: QuadrantItem = {
      id: `item_${Date.now()}`,
      text: '',
      isEditing: true,
      metadata: {}
    };
    
    setItems(prev => [...prev, newItem]);
  }, []);

  // Update item text
  const updateItemText = useCallback((id: string, text: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, text } : item
    ));
  }, []);

  // Toggle editing mode
  const toggleEditing = useCallback((id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, isEditing: !item.isEditing } : item
    ));
  }, []);

  // Remove item
  const removeItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  // AI Assistance functions
  const requestAIAssistance = useCallback(async () => {
    if (!aiAssistanceEnabled) return;
    
    setAiAssistance(prev => ({ ...prev, isLoading: true, isActive: true }));
    
    try {
      // In a real implementation, this would call the AI assistance API
      const suggestions = await generateAISuggestions(quadrantType, items, culturalContext);
      
      setAiAssistance(prev => ({
        ...prev,
        suggestions,
        isLoading: false,
        currentSuggestionIndex: 0
      }));
    } catch (error) {
      console.error('Error getting AI assistance:', error);
      setAiAssistance(prev => ({ ...prev, isLoading: false }));
    }
  }, [aiAssistanceEnabled, quadrantType, items, culturalContext]);

  // Apply AI suggestion
  const applySuggestion = useCallback((suggestion: string) => {
    const newItem: QuadrantItem = {
      id: `ai_suggestion_${Date.now()}`,
      text: suggestion,
      isEditing: false,
      metadata: { source: 'ai_suggestion' }
    };
    
    setItems(prev => [...prev, newItem]);
    setAiAssistance(prev => ({ ...prev, isActive: false }));
  }, []);

  // Cultural adaptations
  const getCulturalPrompts = () => {
    const culturalPrompts: Record<string, string[]> = {
      'collectivist': [
        'How does this connect to your family or community?',
        'What would your community value about this?',
        'How does this serve the greater good?'
      ],
      'individualist': [
        'What makes this uniquely yours?',
        'How does this express your individuality?',
        'What personal goals does this serve?'
      ],
      'family_centered': [
        'How does this honor your family values?',
        'What would your elders think of this?',
        'How does this support your family?'
      ]
    };
    
    const culturalValues = culturalContext.valueSystem;
    const relevantPrompts: string[] = [];
    
    culturalValues.forEach(value => {
      if (culturalPrompts[value]) {
        relevantPrompts.push(...culturalPrompts[value]);
      }
    });
    
    return relevantPrompts.slice(0, 2); // Limit to 2 cultural prompts
  };

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedText = e.dataTransfer.getData('text/plain');
    if (droppedText.trim()) {
      const newItem: QuadrantItem = {
        id: `dropped_${Date.now()}`,
        text: droppedText.trim(),
        isEditing: false,
        metadata: { source: 'drag_drop' }
      };
      
      setItems(prev => [...prev, newItem]);
    }
  }, []);

  return (
    <div 
      className={`ikigai-quadrant ${quadrantType} ${isCompleted ? 'completed' : ''}`}
      style={{
        border: `3px solid ${config.color}`,
        borderRadius: '16px',
        padding: '24px',
        minHeight: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        position: 'relative',
        transition: 'all 0.3s ease',
        transform: isDragOver ? 'scale(1.02)' : 'scale(1)',
        boxShadow: isDragOver 
          ? `0 8px 32px ${config.color}40` 
          : `0 4px 16px ${config.color}20`
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header */}
      <div className="quadrant-header" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px' }}>{config.icon}</span>
          <h2 style={{ 
            color: config.color, 
            fontSize: '24px', 
            fontWeight: 'bold',
            margin: 0
          }}>
            {config.title}
          </h2>
          {isCompleted && (
            <span style={{ 
              backgroundColor: '#27ae60', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '12px', 
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              ✓ Complete
            </span>
          )}
        </div>
        
        <p style={{ 
          color: '#666', 
          fontSize: '14px', 
          margin: 0,
          lineHeight: 1.4
        }}>
          {config.subtitle}
        </p>
      </div>

      {/* Items List */}
      <div className="items-container" style={{ marginBottom: '20px' }}>
        {items.map((item) => (
          <ItemComponent
            key={item.id}
            item={item}
            config={config}
            onUpdateText={updateItemText}
            onToggleEditing={toggleEditing}
            onRemove={removeItem}
            onShowDetails={() => setShowDetailForm(item.id)}
            traumaInformedMode={traumaInformedMode}
          />
        ))}
        
        {items.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#999',
            fontSize: '14px',
            border: `2px dashed ${config.color}40`,
            borderRadius: '12px',
            backgroundColor: `${config.color}05`
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px', opacity: 0.3 }}>
              {config.icon}
            </div>
            <p>Click "Add Item" to begin exploring this area</p>
            <p style={{ fontSize: '12px', opacity: 0.7 }}>
              Or drag and drop ideas from other quadrants
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="action-buttons" style={{ 
        display: 'flex', 
        gap: '12px', 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <button
          onClick={addItem}
          style={{
            backgroundColor: config.color,
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 4px 12px ${config.color}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <span>+</span> Add Item
        </button>

        {aiAssistanceEnabled && (
          <button
            onClick={requestAIAssistance}
            disabled={aiAssistance.isLoading}
            style={{
              backgroundColor: 'transparent',
              color: config.color,
              border: `2px solid ${config.color}`,
              padding: '10px 18px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: aiAssistance.isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              opacity: aiAssistance.isLoading ? 0.6 : 1
            }}
          >
            {aiAssistance.isLoading ? (
              <>
                <div className="spinner" style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid transparent',
                  borderTop: `2px solid ${config.color}`,
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                AI Thinking...
              </>
            ) : (
              <>
                <span>✨</span> AI Assist
              </>
            )}
          </button>
        )}
      </div>

      {/* AI Assistance Panel */}
      {aiAssistance.isActive && aiAssistance.suggestions.length > 0 && (
        <div
          className="ai-assistance-panel"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'white',
            border: `2px solid ${config.color}`,
            borderRadius: '12px',
            padding: '16px',
            marginTop: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            zIndex: 1000
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ color: config.color, margin: 0, fontSize: '16px' }}>
              ✨ AI Suggestions
            </h4>
            <button
              onClick={() => setAiAssistance(prev => ({ ...prev, isActive: false }))}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                color: '#999'
              }}
            >
              ×
            </button>
          </div>
          
          <div style={{ marginBottom: '12px' }}>
            {aiAssistance.suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #eee',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#fafafa'
                }}
                onClick={() => applySuggestion(suggestion)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = `${config.color}10`;
                  e.currentTarget.style.borderColor = config.color;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#fafafa';
                  e.currentTarget.style.borderColor = '#eee';
                }}
              >
                <div style={{ fontSize: '14px', color: '#333' }}>
                  {suggestion}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  Click to add to your {quadrantType}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reflection Prompts */}
      <div className="reflection-prompts" style={{ 
        marginTop: '24px',
        padding: '16px',
        backgroundColor: `${config.color}05`,
        borderRadius: '8px',
        border: `1px solid ${config.color}20`
      }}>
        <h4 style={{ 
          color: config.color, 
          fontSize: '14px', 
          fontWeight: 'bold',
          margin: '0 0 12px 0'
        }}>
          💭 Reflection Prompts
        </h4>
        
        <div style={{ fontSize: '13px', lineHeight: 1.4 }}>
          {config.prompts.slice(0, 2).map((prompt, index) => (
            <div key={index} style={{ marginBottom: '8px', color: '#666' }}>
              • {prompt}
            </div>
          ))}
          
          {/* Cultural prompts */}
          {getCulturalPrompts().map((prompt, index) => (
            <div key={`cultural_${index}`} style={{ 
              marginBottom: '8px', 
              color: '#666',
              fontStyle: 'italic'
            }}>
              🌍 {prompt}
            </div>
          ))}
        </div>
      </div>

      {/* Trauma-informed note */}
      {traumaInformedMode && (
        <div style={{
          marginTop: '16px',
          padding: '12px',
          backgroundColor: '#f8f9fa',
          borderRadius: '6px',
          border: '1px solid #dee2e6',
          fontSize: '12px',
          color: '#666'
        }}>
          💚 Remember: You have complete control over what you share. Go at your own pace and include only what feels safe and comfortable.
        </div>
      )}

      {/* Progress indicator */}
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        fontSize: '12px',
        color: '#999',
        backgroundColor: 'white',
        padding: '4px 8px',
        borderRadius: '12px',
        border: '1px solid #eee'
      }}>
        {items.filter(item => item.text.trim().length > 0).length} items
      </div>
    </div>
  );
};

// Individual Item Component
interface ItemComponentProps {
  item: QuadrantItem;
  config: any;
  onUpdateText: (id: string, text: string) => void;
  onToggleEditing: (id: string) => void;
  onRemove: (id: string) => void;
  onShowDetails: () => void;
  traumaInformedMode: boolean;
}

const ItemComponent: React.FC<ItemComponentProps> = ({
  item,
  config,
  onUpdateText,
  onToggleEditing,
  onRemove,
  onShowDetails,
  traumaInformedMode
}) => {
  const [localText, setLocalText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalText(item.text);
  }, [item.text]);

  useEffect(() => {
    if (item.isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [item.isEditing]);

  const handleSave = () => {
    onUpdateText(item.id, localText);
    onToggleEditing(item.id);
  };

  const handleCancel = () => {
    setLocalText(item.text);
    onToggleEditing(item.id);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className="item-component"
      style={{
        backgroundColor: 'white',
        border: `1px solid ${config.color}30`,
        borderRadius: '8px',
        padding: '12px',
        marginBottom: '8px',
        transition: 'all 0.2s ease',
        position: 'relative'
      }}
      draggable={!item.isEditing}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', item.text);
      }}
    >
      {item.isEditing ? (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            ref={inputRef}
            type="text"
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={config.placeholder}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '14px',
              backgroundColor: 'transparent'
            }}
          />
          <button
            onClick={handleSave}
            style={{
              backgroundColor: config.color,
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ✓
          </button>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: '#95a5a6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              flex: 1,
              fontSize: '14px',
              color: '#333',
              cursor: 'pointer',
              lineHeight: 1.3
            }}
            onClick={() => onToggleEditing(item.id)}
          >
            {item.text || <span style={{ color: '#999', fontStyle: 'italic' }}>Click to edit...</span>}
          </div>
          
          <div style={{ display: 'flex', gap: '4px', opacity: 0.7 }}>
            <button
              onClick={() => onToggleEditing(item.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                color: config.color
              }}
              title="Edit"
            >
              ✏️
            </button>
            <button
              onClick={onShowDetails}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                color: config.color
              }}
              title="Add details"
            >
              📋
            </button>
            <button
              onClick={() => onRemove(item.id)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                color: '#e74c3c'
              }}
              title="Remove"
            >
              🗑️
            </button>
          </div>
        </div>
      )}

      {/* Source indicator */}
      {item.metadata?.source && (
        <div style={{
          position: 'absolute',
          top: '4px',
          right: '4px',
          fontSize: '10px',
          color: '#999',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '2px 4px',
          borderRadius: '4px'
        }}>
          {item.metadata.source === 'ai_suggestion' && '✨'}
          {item.metadata.source === 'drag_drop' && '↔️'}
        </div>
      )}
    </div>
  );
};

// Helper function to convert item to response format
function convertItemToResponse(item: QuadrantItem, quadrantType: string): any {
  const baseResponse = {
    id: item.id,
    text: item.text,
    ...item.metadata
  };

  switch (quadrantType) {
    case 'passions':
      return {
        ...baseResponse,
        intensity: item.metadata?.intensity || 7,
        frequency: item.metadata?.frequency || 6,
        timeOrigin: item.metadata?.timeOrigin || 'Recent',
        culturalInfluence: item.metadata?.culturalInfluence || '',
        emotionalState: item.metadata?.emotionalState || 'Energized',
        growthPotential: item.metadata?.growthPotential || 7,
        barriers: item.metadata?.barriers || [],
        supportNetwork: item.metadata?.supportNetwork || [],
        aiInsights: [],
        clusterAssignment: item.metadata?.clusterAssignment
      } as PassionResponse;

    case 'skills':
      return {
        ...baseResponse,
        proficiencyLevel: item.metadata?.proficiencyLevel || 6,
        acquisitionSource: item.metadata?.acquisitionSource || 'Self-taught',
        applicationContext: item.metadata?.applicationContext || [],
        improvementDesire: item.metadata?.improvementDesire || 7,
        teachingAbility: item.metadata?.teachingAbility || 5,
        marketValue: item.metadata?.marketValue || 6,
        personalSatisfaction: item.metadata?.personalSatisfaction || 7,
        developmentPath: item.metadata?.developmentPath || [],
        culturalRecognition: item.metadata?.culturalRecognition || '',
        aiInsights: [],
        clusterAssignment: item.metadata?.clusterAssignment
      } as SkillResponse;

    case 'values':
      return {
        ...baseResponse,
        importance: item.metadata?.importance || 8,
        livingAlignment: item.metadata?.livingAlignment || 6,
        culturalAlignment: item.metadata?.culturalAlignment || 7,
        familyAlignment: item.metadata?.familyAlignment || 6,
        conflicts: item.metadata?.conflicts || [],
        expressions: item.metadata?.expressions || [],
        challenges: item.metadata?.challenges || [],
        support: item.metadata?.support || [],
        evolution: item.metadata?.evolution || '',
        aiInsights: [],
        clusterAssignment: item.metadata?.clusterAssignment
      } as ValueResponse;

    case 'opportunities':
      return {
        ...baseResponse,
        feasibility: item.metadata?.feasibility || 6,
        impact: item.metadata?.impact || 7,
        timeframe: item.metadata?.timeframe || 'Medium-term',
        requiredResources: item.metadata?.requiredResources || [],
        barriers: item.metadata?.barriers || [],
        supporters: item.metadata?.supporters || [],
        culturalReceptivity: item.metadata?.culturalReceptivity || 6,
        personalReadiness: item.metadata?.personalReadiness || 6,
        learningRequired: item.metadata?.learningRequired || [],
        riskFactors: item.metadata?.riskFactors || [],
        aiInsights: [],
        clusterAssignment: item.metadata?.clusterAssignment
      } as OpportunityResponse;

    default:
      return baseResponse;
  }
}

// Mock AI assistance function
async function generateAISuggestions(
  quadrantType: string,
  existingItems: QuadrantItem[],
  culturalContext: CulturalContext
): Promise<string[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const suggestionSets: Record<string, string[]> = {
    passions: [
      'Learning about different cultures and traditions',
      'Mentoring and helping others grow',
      'Creative problem-solving and innovation',
      'Building community connections',
      'Environmental sustainability and conservation'
    ],
    skills: [
      'Cross-cultural communication',
      'Active listening and empathy',
      'Digital literacy and technology',
      'Project management and organization',
      'Public speaking and presentation'
    ],
    values: [
      'Respect for all people regardless of background',
      'Lifelong learning and growth',
      'Authenticity and genuine relationships',
      'Social justice and equality',
      'Balance between individual and community needs'
    ],
    opportunities: [
      'Community outreach coordinator',
      'Diversity and inclusion consultant',
      'Educational content creator',
      'Social enterprise founder',
      'Cultural bridge-builder in organizations'
    ]
  };
  
  const baseSuggestions = suggestionSets[quadrantType] || [];
  
  // Filter out suggestions that are too similar to existing items
  const existingTexts = existingItems.map(item => item.text.toLowerCase());
  const filteredSuggestions = baseSuggestions.filter(suggestion =>
    !existingTexts.some(existing =>
      existing.includes(suggestion.toLowerCase().substring(0, 10))
    )
  );
  
  return filteredSuggestions.slice(0, 3);
}

export default IKIGAIQuadrant;