'use client';

import { BlockInProduction } from '@/components/BlockInProduction';

// Ultra-minimal React component with NO hooks, NO complexity
console.log('🔥 DebugReactPage: File loading')

export default function DebugReactPage() {
  if (process.env.NODE_ENV === 'production') return <BlockInProduction />;

  // Add immediate console logging
  console.log('🔥 DebugReactPage: Starting render')
  console.log('🔥 DebugReactPage: Node env:', process.env.NODE_ENV)
  console.log('🔥 DebugReactPage: Window available:', typeof window !== 'undefined')
  
  if (typeof window !== 'undefined') {
    console.log('🔥 DebugReactPage: Window location:', window.location.href)
    console.log('🔥 DebugReactPage: User agent:', navigator.userAgent.slice(0, 50))
  }

  // Inline styles to avoid any CSS dependencies
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    color: 'white',
    padding: '20px',
    textAlign: 'center' as const
  }

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '450px',
    width: '100%',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)'
  }

  const timestampStyle = {
    fontSize: '12px',
    opacity: 0.7,
    fontFamily: 'monospace',
    background: 'rgba(255,255,255,0.1)',
    padding: '5px 8px',
    borderRadius: '4px',
    marginTop: '15px'
  }

  const linkStyle = {
    display: 'inline-block',
    padding: '10px 20px',
    margin: '5px',
    background: '#D4A84B',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.2s'
  }

  const currentTime = new Date().toLocaleTimeString()
  const renderTime = performance.now()

  console.log('🔥 DebugReactPage: About to return JSX')

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: '2rem', marginBottom: '10px' }}>⚛️</div>
        
        <h1 style={{ margin: '0 0 20px 0', fontSize: '24px', fontWeight: '500' }}>
          ✅ React Component Working!
        </h1>
        
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ JSX rendering:</strong> Success
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ React mounting:</strong> Success  
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ Inline styles:</strong> Applied
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ JavaScript execution:</strong> Working
          </div>
          <div style={{ marginBottom: '8px' }}>
            <strong>✅ Console logging:</strong> Check browser console
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          padding: '15px',
          borderRadius: '8px',
          fontSize: '14px',
          marginBottom: '20px'
        }}>
          <div><strong>Environment:</strong> {process.env.NODE_ENV || 'unknown'}</div>
          <div><strong>Render time:</strong> {currentTime}</div>
          <div><strong>Performance:</strong> {renderTime.toFixed(2)}ms since navigation</div>
          <div><strong>Platform:</strong> {typeof window !== 'undefined' ? 
            ((window as any).Capacitor?.getPlatform?.() || 'web') : 'server'}</div>
        </div>
        
        <div>
          <a href="/debug-hooks/" style={linkStyle}>
            🪝 Test Hooks →
          </a>
          
          <a href="/dashboard" style={{ ...linkStyle, background: '#E5C97D' }}>
            🏠 Test Dashboard →
          </a>
          
          <a href="/debug.html" style={{ ...linkStyle, background: 'rgba(255,255,255,0.2)' }}>
            ← Back to Debug
          </a>
        </div>
        
        <div style={timestampStyle}>
          Component rendered successfully at {new Date().toISOString()}
        </div>
      </div>
    </div>
  )
}

console.log('🔥 DebugReactPage: File loaded completely')
