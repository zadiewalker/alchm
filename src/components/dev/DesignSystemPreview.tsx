'use client';

import { useState, useEffect } from 'react';

interface DesignToken {
  name: string;
  value: string;
  category: 'color' | 'spacing' | 'typography' | 'animation';
  description?: string;
}

const designTokens: DesignToken[] = [
  // Sage Green Color Palette
  { name: '--color-primary', value: '#a4b792', category: 'color', description: 'Primary sage green - Calm meets strategy' },
  { name: '--color-primary-hover', value: '#8fa67d', category: 'color', description: 'Hover state for primary' },
  { name: '--color-primary-light', value: '#b9c9a8', category: 'color', description: 'Light sage for backgrounds' },
  { name: '--color-primary-dark', value: '#7a8a68', category: 'color', description: 'Dark sage for text' },
  { name: '--sanctuary-white', value: '#fefcfb', category: 'color', description: 'Pure sanctuary white' },
  
  // Spacing System
  { name: '--space-whisper', value: '4px', category: 'spacing', description: 'Minimal spacing' },
  { name: '--space-breath', value: '8px', category: 'spacing', description: 'Breathing room' },
  { name: '--space-pause', value: '12px', category: 'spacing', description: 'Gentle pause' },
  { name: '--space-rest', value: '16px', category: 'spacing', description: 'Comfortable rest' },
  { name: '--space-comfort', value: '24px', category: 'spacing', description: 'Comfort zone' },
  { name: '--space-sanctuary', value: '32px', category: 'spacing', description: 'Sacred space' },
  { name: '--space-vastness', value: '48px', category: 'spacing', description: 'Expansive vastness' },
  
  // Typography
  { name: '--text-xs', value: '0.75rem', category: 'typography' },
  { name: '--text-sm', value: '0.875rem', category: 'typography' },
  { name: '--text-base', value: '1rem', category: 'typography' },
  { name: '--text-lg', value: '1.125rem', category: 'typography' },
  { name: '--text-xl', value: '1.25rem', category: 'typography' },
  { name: '--text-2xl', value: '1.5rem', category: 'typography' },
  { name: '--text-4xl', value: '2.25rem', category: 'typography' },
  { name: '--text-5xl', value: '3rem', category: 'typography' },
  
  // Animation
  { name: '--ease-sanctuary', value: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', category: 'animation', description: 'Sanctuary easing curve' },
];

export default function DesignSystemPreview() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [livePreview, setLivePreview] = useState(true);
  const [customToken, setCustomToken] = useState({ name: '', value: '' });

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const categories = ['all', 'color', 'spacing', 'typography', 'animation'];
  const filteredTokens = selectedCategory === 'all' 
    ? designTokens 
    : designTokens.filter(token => token.category === selectedCategory);

  const applyCustomToken = () => {
    if (customToken.name && customToken.value) {
      document.documentElement.style.setProperty(customToken.name, customToken.value);
    }
  };

  const resetTokens = () => {
    // Reset all custom properties
    designTokens.forEach(token => {
      document.documentElement.style.removeProperty(token.name);
    });
    
    // Reload CSS
    const links = document.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href) {
        link.setAttribute('href', href + '?v=' + Date.now());
      }
    });
  };

  const exportTokens = () => {
    const cssVars = designTokens.map(token => 
      `  ${token.name}: ${token.value};${token.description ? ` /* ${token.description} */` : ''}`
    ).join('\n');
    
    const cssContent = `:root {\n${cssVars}\n}`;
    
    const blob = new Blob([cssContent], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'alchm-design-tokens.css';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '350px',
      maxHeight: '80vh',
      background: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '16px',
      border: '1px solid rgba(164, 183, 146, 0.3)',
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'Monaco, monospace',
      overflow: 'hidden',
      boxShadow: '0 20px 64px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid rgba(164, 183, 146, 0.2)',
        background: 'rgba(164, 183, 146, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px'
        }}>
          <span style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
            🌿 ALCHM Design System
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={resetTokens}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#ef4444',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
            <button
              onClick={exportTokens}
              style={{
                background: 'rgba(164, 183, 146, 0.2)',
                border: '1px solid rgba(164, 183, 146, 0.3)',
                color: 'var(--color-primary)',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '10px',
                cursor: 'pointer'
              }}
            >
              Export
            </button>
          </div>
        </div>
        
        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                background: selectedCategory === category 
                  ? 'var(--color-primary)' 
                  : 'rgba(164, 183, 146, 0.1)',
                color: selectedCategory === category ? 'black' : 'var(--color-primary)',
                border: '1px solid var(--color-primary)',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '10px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Token List */}
      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        padding: '8px'
      }}>
        {filteredTokens.map((token, index) => (
          <TokenItem key={index} token={token} />
        ))}
      </div>

      {/* Custom Token Input */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(164, 183, 146, 0.2)',
        background: 'rgba(164, 183, 146, 0.05)'
      }}>
        <div style={{ marginBottom: '8px', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 'bold' }}>
          Live Token Editor
        </div>
        <input
          type="text"
          placeholder="--custom-property"
          value={customToken.name}
          onChange={(e) => setCustomToken(prev => ({ ...prev, name: e.target.value }))}
          style={{
            width: '100%',
            padding: '6px 8px',
            marginBottom: '4px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(164, 183, 146, 0.3)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '11px'
          }}
        />
        <input
          type="text"
          placeholder="value"
          value={customToken.value}
          onChange={(e) => setCustomToken(prev => ({ ...prev, value: e.target.value }))}
          style={{
            width: '100%',
            padding: '6px 8px',
            marginBottom: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(164, 183, 146, 0.3)',
            borderRadius: '4px',
            color: 'white',
            fontSize: '11px'
          }}
        />
        <button
          onClick={applyCustomToken}
          style={{
            width: '100%',
            padding: '6px',
            background: 'var(--color-primary)',
            color: 'black',
            border: 'none',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Apply Live
        </button>
      </div>
    </div>
  );
}

function TokenItem({ token }: { token: DesignToken }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(token.value);

  const applyEdit = () => {
    document.documentElement.style.setProperty(token.name, editValue);
    setIsEditing(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'color': return '#ef4444';
      case 'spacing': return '#3b82f6';
      case 'typography': return '#8b5cf6';
      case 'animation': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{
      padding: '8px',
      marginBottom: '6px',
      background: 'rgba(255, 255, 255, 0.02)',
      borderRadius: '6px',
      border: '1px solid rgba(164, 183, 146, 0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '4px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: getCategoryColor(token.category)
          }} />
          <code style={{ color: 'var(--color-primary)', fontSize: '11px' }}>
            {token.name}
          </code>
        </div>
        
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            fontSize: '10px'
          }}
        >
          {isEditing ? '×' : '✎'}
        </button>
      </div>
      
      {isEditing ? (
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={{
              flex: 1,
              padding: '4px 6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(164, 183, 146, 0.3)',
              borderRadius: '3px',
              color: 'white',
              fontSize: '10px'
            }}
          />
          <button
            onClick={applyEdit}
            style={{
              background: 'var(--color-primary)',
              color: 'black',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '3px',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            Apply
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {token.category === 'color' && (
            <div style={{
              width: '16px',
              height: '16px',
              borderRadius: '3px',
              background: token.value,
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }} />
          )}
          <code style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '10px',
            flex: 1
          }}>
            {token.value}
          </code>
        </div>
      )}
      
      {token.description && (
        <div style={{
          fontSize: '9px',
          color: 'rgba(255, 255, 255, 0.5)',
          marginTop: '4px',
          fontStyle: 'italic'
        }}>
          {token.description}
        </div>
      )}
    </div>
  );
}