'use client';

/**
 * EMERGENCY: MINIMAL AGE VERIFICATION
 * Ultra-lightweight age check for crisis situations
 * Bundle target: <10KB
 */

import React, { useState, useEffect } from 'react';

interface EmergencyAgeVerificationProps {
  onVerified: () => void;
  onCrisisAccess: () => void;
}

export default function EmergencyAgeVerification({ 
  onVerified, 
  onCrisisAccess 
}: EmergencyAgeVerificationProps) {
  const [birthYear, setBirthYear] = useState('');
  const [error, setError] = useState('');

  // Check if already verified
  useEffect(() => {
    const verified = localStorage.getItem('alchm_age_verified');
    if (verified === 'true') {
      onVerified();
    }
  }, [onVerified]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const year = parseInt(birthYear);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    if (year < 1900 || year > currentYear) {
      setError('Please enter a valid birth year');
      return;
    }
    
    if (age < 18) {
      setError('You must be 18 or older to use ALCHM');
      return;
    }
    
    localStorage.setItem('alchm_age_verified', 'true');
    onVerified();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #a4b792 0%, #93a682 100%)',
      padding: '16px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '32px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        color: 'white'
      }}>
        {/* Crisis Access */}
        <div style={{
          background: 'rgba(220, 38, 38, 0.1)',
          border: '2px solid rgba(220, 38, 38, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#fca5a5', margin: '0 0 12px 0', fontSize: '18px' }}>
            In Crisis?
          </h3>
          <button
            onClick={onCrisisAccess}
            style={{
              width: '100%',
              background: '#dc2626',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              padding: '16px',
              cursor: 'pointer',
              minHeight: '48px'
            }}
          >
            🆘 I need help now
          </button>
        </div>

        {/* Age Verification */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '36px', marginBottom: '16px' }}>🌿</div>
          <h2 style={{ fontSize: '24px', fontWeight: '300', margin: '0 0 8px 0' }}>
            Welcome to ALCHM
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0, fontSize: '14px' }}>
            Please verify you're 18 or older
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '16px'
          }}>
            <p style={{ color: '#fca5a5', fontSize: '14px', textAlign: 'center', margin: 0 }}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Birth Year
            </label>
            <input
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(e.target.value)}
              placeholder="e.g., 1995"
              required
              min="1900"
              max={new Date().getFullYear()}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '16px',
                outline: 'none',
                minHeight: '48px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              background: '#16a34a',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              padding: '16px',
              cursor: 'pointer',
              minHeight: '48px'
            }}
          >
            Continue
          </button>
        </form>

        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.6)',
          lineHeight: '1.4'
        }}>
          🔒 Your privacy is protected. We only verify your age - no personal information is stored.
        </div>
      </div>
    </div>
  );
}