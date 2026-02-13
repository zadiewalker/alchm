'use client';

import React, { useEffect, useState } from 'react';

export function DebugWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    // LAYERED REACT MOUNT PROOF - Multiple immediate DOM mutations
    
    // 1. Change main React proof indicator
    const reactProof = document.getElementById('react-proof');
    if (reactProof) {
      reactProof.style.background = '#8B9A7C';
      reactProof.textContent = 'REACT';
      reactProof.style.boxShadow = '0 0 10px #E5C97D';
    }

    // 2. Multiple body mutations for maximum visibility
    document.body.style.borderTop = '5px solid #8B9A7C';
    document.body.style.borderBottom = '5px solid #8B9A7C';
    document.body.style.outline = '3px solid #E5C97D';

    // 3. Add multiple React execution confirmations
    const createProof = (id: string, text: string, color: string, position: string) => {
      const proof = document.createElement('div');
      proof.id = id;
      proof.style.cssText = `position:fixed;${position};background:${color};color:white;padding:8px;font-family:monospace;font-size:12px;z-index:20000;border:2px solid white;font-weight:bold;`;
      proof.textContent = text;
      document.body.appendChild(proof);
    };

    createProof('react-mount-1', 'REACT MOUNT ✓', '#8B9A7C', 'top:10px;left:300px');
    createProof('react-useeffect', 'useEffect ✓', '#A8B5A0', 'top:50px;left:300px');
    
    // 4. React timing proof
    setTimeout(() => {
      createProof('react-async', 'ASYNC ✓', '#E5C97D', 'top:90px;left:300px');
      
      // Test React state updates work
      setMounted(true);
      
      // Add React environment check
      const reactEnvDiv = document.createElement('div');
      reactEnvDiv.style.cssText = 'position:fixed;top:130px;left:300px;background:#D4B76A;color:white;padding:8px;font-family:monospace;font-size:10px;z-index:20001;border:2px solid white;max-width:180px;';
      reactEnvDiv.innerHTML = `
        <div>React: ${typeof React !== 'undefined' ? '✓' : '✗'}</div>
        <div>useState: ${typeof useState !== 'undefined' ? '✓' : '✗'}</div>
        <div>useEffect: ${typeof useEffect !== 'undefined' ? '✓' : '✗'}</div>
      `;
      document.body.appendChild(reactEnvDiv);
    }, 100);

    // 5. Enhanced error handlers with React context
    const handleError = (event: ErrorEvent) => {
      setErrors(prev => [...prev, `${event.error?.message || event.message}`]);
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position:fixed;bottom:10px;right:10px;background:#8B9A7C;color:white;padding:12px;z-index:30000;font-family:monospace;font-size:11px;max-width:300px;border:3px solid white;';
      errorDiv.innerHTML = `
        <div><strong>REACT ERROR:</strong></div>
        <div>${event.error?.message || 'Unknown'}</div>
        <div>Stack: ${event.error?.stack?.substring(0, 50) || 'N/A'}</div>
      `;
      document.body.appendChild(errorDiv);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setErrors(prev => [...prev, `Promise rejected: ${event.reason}`]);
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = 'position:fixed;bottom:100px;right:10px;background:#A8B5A0;color:white;padding:12px;z-index:30001;font-family:monospace;font-size:11px;max-width:300px;border:3px solid white;';
      errorDiv.innerHTML = `
        <div><strong>REACT PROMISE:</strong></div>
        <div>${event.reason}</div>
      `;
      document.body.appendChild(errorDiv);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // 6. Log React mount success (even if console hidden)
    try {
      console.log('🟢 REACT: DebugWrapper useEffect executed successfully');
      console.log('🟢 REACT: State and effects working');
    } catch (e) {
      // Fallback if console access fails
      createProof('console-fail', 'CONSOLE FAIL', '#D4B76A', 'top:170px;left:300px');
    }

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  if (!mounted) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui',
        fontSize: '18px',
        zIndex: 9999
      }}>
        🔍 DEBUG: React Mounting...
      </div>
    );
  }

  return (
    <>
      {/* Debug indicator */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        pointerEvents: 'none'
      }}>
        ✅ React OK
      </div>

      {/* Error display */}
      {errors.length > 0 && (
        <div style={{
          position: 'fixed',
          top: 60,
          right: 20,
          background: 'rgba(255, 255, 255, 0.2)',
          color: 'white',
          padding: '12px',
          borderRadius: '4px',
          fontSize: '11px',
          fontFamily: 'monospace',
          maxWidth: '300px',
          zIndex: 9999
        }}>
          <div>❌ Errors:</div>
          {errors.map((error, i) => (
            <div key={i} style={{ marginTop: '4px' }}>{error}</div>
          ))}
        </div>
      )}

      {children}
    </>
  );
}
