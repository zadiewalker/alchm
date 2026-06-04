'use client';

export function BlockInProduction() {
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom, #A4B792, #8B9A7C)',
        color: 'rgba(255,255,255,0.9)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        textAlign: 'center',
        padding: '24px',
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 300 }}>404</h1>
        <p style={{ marginTop: '12px', fontSize: '14px', opacity: 0.8 }}>This page could not be found.</p>
      </div>
    </div>
  );
}
