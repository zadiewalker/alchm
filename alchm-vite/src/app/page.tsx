
import { useCallback, useState } from 'react';
import { useRouter } from '@/router';
import { DESIGN } from '@/lib/design';
import { isOnboarded } from '@/lib/onboarding';

export default function SplashPage() {
  // PageState: handled inline on this splash screen (no async loads).
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const onEnter = useCallback(() => {
    if (isNavigating) return;
    setIsNavigating(true);
    const destination = isOnboarded() ? '/dashboard/' : '/onboarding/';
    router.push(destination);
  }, [isNavigating, router]);

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 120px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: '32px',
        paddingRight: '32px',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.10) 0%, transparent 50%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-64px' }}>
        <div style={{ marginBottom: '32px' }}>
          <svg
            viewBox="0 0 64 80"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '56px', height: '72px' }}
            aria-label="Khepera scarab"
          >
            <circle cx="32" cy="6" r="5.5" fill="#D8CA7B" />
            <path d="M26,22 Q26,13 32,12 Q38,13 38,22 Z" fill="#EAE5D9" />
            <path d="M28,15 Q24,8 22,6" stroke="#EAE5D9" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M36,15 Q40,8 42,6" stroke="#EAE5D9" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <ellipse cx="12" cy="36" rx="10" ry="9" fill="#EAE5D9" opacity="0.92" />
            <ellipse cx="52" cy="36" rx="10" ry="9" fill="#EAE5D9" opacity="0.92" />
            <ellipse cx="32" cy="44" rx="14" ry="24" fill="#EAE5D9" />
            <path d="M20,33 Q32,30 44,33" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M19,40 Q32,37 45,40" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M20,47 Q32,44 44,47" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
            <path d="M22,54 Q32,51 42,54" stroke="#D5D0C4" strokeWidth="0.8" fill="none" />
          </svg>
        </div>

        <h1
          style={{
            marginTop: '24px',
            marginBottom: '16px',
            fontSize: '36px',
            fontWeight: 300,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.92)',
            whiteSpace: 'nowrap',
            fontFamily: DESIGN.typography.sansSerif,
          }}
        >
          A L C H M
        </h1>

        <p
          style={{
            marginTop: '16px',
            textAlign: 'center',
            fontSize: '18px',
            fontWeight: 300,
            lineHeight: 1.6,
            maxWidth: '280px',
            color: 'rgba(255, 255, 255, 0.65)',
            fontFamily: DESIGN.typography.sansSerif,
          }}
        >
          Your digital sanctuary for healing and transformation
        </p>

        <div style={{ width: '100%', marginTop: '48px', paddingLeft: '32px', paddingRight: '32px' }}>
          <button
            type="button"
            onClick={onEnter}
            disabled={isNavigating}
            aria-label="Begin your journey"
            style={{
              width: '100%',
              minHeight: '52px',
              paddingTop: '16px',
              paddingBottom: '16px',
              borderRadius: DESIGN.radius.full,
              border: 'none',
              backgroundColor: '#E8C56D',
              cursor: isNavigating ? 'default' : 'pointer',
              opacity: isNavigating ? 0.7 : 1,
            }}
          >
            <span
              style={{
                color: '#FFFFFF',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                fontSize: '15px',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                fontFamily: DESIGN.typography.sansSerif,
              }}
            >
              {isNavigating ? 'OPENING...' : 'BEGIN YOUR JOURNEY'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
