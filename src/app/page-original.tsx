'use client';

import { useEffect } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { useRouter } from 'next/navigation';


export default function SplashPage() {
  const router = useRouter();
  
  useEffect(() => {
    SplashScreen.hide().catch(() => {});
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)', position: 'relative', padding: '0 2rem' }}>
      {/* Faint organic texture overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
      
      {/* Main content group — one unit, pushed down from top */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '28vh', position: 'relative', zIndex: 1 }}>
        {/* Scarab icon */}
        <div style={{ marginBottom: '32px' }}>
          <svg
            viewBox="0 0 80 96"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '64px', height: '80px' }}
            aria-label="Khepera scarab"
          >
            {/* SUN DISK */}
            <circle cx="40" cy="7" r="6" fill="#D8CA7B" />
            {/* ANTENNAE */}
            <path d="M35,20 Q30,12 27,8" stroke="#EAE5D9" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            <path d="M45,20 Q50,12 53,8" stroke="#EAE5D9" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            {/* HEAD — wide dome */}
            <path d="M30,30 Q30,17 40,16 Q50,17 50,30 Z" fill="#EAE5D9" />
            {/* LEFT WING */}
            <ellipse cx="14" cy="44" rx="12" ry="10" fill="#EAE5D9" opacity="0.9" />
            {/* RIGHT WING */}
            <ellipse cx="66" cy="44" rx="12" ry="10" fill="#EAE5D9" opacity="0.9" />
            {/* BODY */}
            <ellipse cx="40" cy="54" rx="18" ry="28" fill="#EAE5D9" />
            {/* BODY SEGMENT LINES */}
            <path d="M24,40 Q40,37 56,40" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M23,48 Q40,45 57,48" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M23,56 Q40,53 57,56" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M24,64 Q40,61 56,64" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M27,72 Q40,69 53,72" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
          </svg>
        </div>

        {/* Title */}
        <h1 style={{
          marginTop: '24px',
          fontSize: '36px',
          fontWeight: '300',
          letterSpacing: '0.35em',
          marginBottom: '16px',
          textTransform: 'uppercase',
          color: 'rgba(255, 255, 255, 0.92)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}>
          A L C H M
        </h1>

        {/* Tagline */}
        <p style={{
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '17px',
          fontWeight: '300',
          marginTop: '16px',
          textAlign: 'center',
          lineHeight: '1.5',
          letterSpacing: 'normal',
          wordSpacing: 'normal',
          maxWidth: '280px',
        }}>
          Your digital sanctuary for healing and transformation
        </p>

        {/* Button — part of the same group, moderate gap */}
        <div style={{ paddingLeft: '32px', paddingRight: '32px', marginTop: '48px', width: '100%' }}>
          <button
            onClick={() => {
              console.log('🔀 NAVIGATION: About to navigate to /dashboard');
              console.log('🔀 NAVIGATION: Current path =', window.location.pathname);
              router.push('/dashboard');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              width: '100%',
              paddingTop: '16px',
              paddingBottom: '16px',
              borderRadius: '9999px',
              backgroundColor: '#E8C56D',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <span style={{
              color: '#FFFFFF',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '15px',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}>
              BEGIN YOUR JOURNEY
            </span>
          </button>
        </div>
      </div>

      
      {/* 988 footer — only this is pinned to bottom */}
      <div style={{ marginTop: 'auto', marginBottom: '32px' }}>
        <span style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '13px' }}>
          Crisis support available · 988
        </span>
      </div>
    </div>
  );
}
