'use client';

import { BlockInProduction } from '@/components/BlockInProduction';

export default function TestPage() {
  if (process.env.NODE_ENV === 'production') return <BlockInProduction />;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #FF6B6B, #4ECDC4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'system-ui',
      fontSize: '24px',
      textAlign: 'center',
      padding: '20px'
    }}>
      <div>
        <h1>🎯 TEST PAGE SUCCESS</h1>
        <p>React is mounting correctly!</p>
        <p style={{ fontSize: '14px', marginTop: '20px' }}>
          Current URL: {typeof window !== 'undefined' ? window.location.href : 'SSR'}
        </p>
      </div>
    </div>
  );
}
