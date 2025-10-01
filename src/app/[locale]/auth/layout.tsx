import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div 
      className="min-h-screen flex items-center justify-center container-mobile"
      style={{
        background: 'linear-gradient(135deg, #a4b792 0%, #93a682 50%, #7a8c6a 100%)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
        // Safe area support for notched devices
        paddingTop: 'max(2rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
        // Prevent zoom on input focus (iOS Safari)
        touchAction: 'manipulation'
      }}
    >
      <div 
        className="max-w-md w-full space-y-8 p-8 card-mobile"
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '24px',
          // Ensure minimum touch targets for crisis accessibility
          minHeight: 'fit-content',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)'
        }}
      >
        {children}
      </div>
    </div>
  );
}