'use client';

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

function HomeContent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="sage-sanctuary" data-sage-enforced="true">
      <div className="container flex-col flex-center" style={{ 
        minHeight: '100vh',
        position: 'relative',
        paddingBottom: '120px'
      }}>
        
        {/* Hero Section - Sacred Invitation */}
        <section className="text-center mb-lg">
          <div className={`fade-in ${mounted ? 'slide-up' : ''}`} style={{ 
            maxWidth: '600px', 
            margin: '0 auto'
          }}>
            <h1 className="text-4xl font-light leading-tight tracking-tight text-sanctuary-white mb-4">
              Write it raw. Turn it gold.
            </h1>
            
            <p className="text-comfort mb-lg" style={{
              maxWidth: '480px',
              margin: '0 auto 32px'
            }}>
              Trauma-informed AI journaling. Private. Ritual, not therapy.
            </p>
            
            <div className="flex-col flex-center gap-md">
              <Link 
                href="/auth/login"
                className="bg-sage-400 hover:bg-sage-500 text-white px-8 py-4 rounded-xl text-lg font-medium transition-all duration-200 ease-out shadow-soft hover:shadow-card min-h-[56px] inline-flex items-center justify-center"
                style={{
                  position: 'relative',
                  zIndex: 10,
                  pointerEvents: 'auto'
                }}
              >
                Start Your First Entry
              </Link>
              
              <p className="text-gentle text-center">
                Free to start • No therapy license required • Your words, your space
              </p>
            </div>
          </div>
        </section>

        {/* Sacred Contract Section */}
        <section className="card-sanctuary fade-in-up" style={{ 
          marginTop: 'var(--space-sanctuary)',
          width: '100%',
          maxWidth: '600px',
          margin: 'var(--space-sanctuary) auto 0',
          background: 'rgba(254, 252, 251, 0.98)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(254, 252, 251, 0.6)',
          textAlign: 'center',
          animationDelay: '0.4s',
          position: 'relative',
          zIndex: 1
        }}>
          <h2 style={{
            fontSize: 'var(--text-lg)',
            fontWeight: 'var(--font-light)',
            color: '#2c2c2c',
            marginBottom: 'var(--space-breath)'
          }}>
            This is your sacred contract.
          </h2>
          
          <p className="wisdom-text" style={{
            fontSize: 'var(--text-sm)',
            lineHeight: 'var(--leading-relaxed)',
            color: '#525f44',
            maxWidth: '500px',
            margin: '0 auto',
            fontStyle: 'normal'
          }}>
            You show up. You write the truth. We hold the space, protect the words, and mirror back your wisdom. No therapy. No fixing. Just you, meeting you.
          </p>
        </section>

        {/* Crisis Support - Sanctuary Design */}
        <footer style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          padding: 'var(--space-breath)',
          textAlign: 'center',
          background: 'rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          zIndex: 20,
          pointerEvents: 'none'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-breath)',
            padding: 'var(--space-breath) var(--space-pause)',
            background: 'rgba(254, 252, 251, 0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            border: '1px solid rgba(254, 252, 251, 0.2)',
            fontSize: 'var(--text-xs)',
            color: 'rgba(254, 252, 251, 0.9)',
            fontWeight: 'var(--font-medium)',
            pointerEvents: 'auto'
          }}>
            <span>
              If you're in crisis, reach{' '}
              <span style={{ 
                color: 'var(--sanctuary-white)', 
                fontWeight: 'var(--font-semibold)' 
              }}>
                988 Lifeline
              </span>
            </span>
            <span style={{ color: 'rgba(254, 252, 251, 0.6)' }}>·</span>
            <span style={{ color: 'rgba(254, 252, 251, 0.8)' }}>
              We're journaling, not therapy
            </span>
          </div>
        </footer>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="sanctuary-layout home-sanctuary loading-breathe">
        <div className="container" style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
            <p style={{ color: 'rgba(254, 252, 251, 0.8)' }}>
              Preparing your sanctuary...
            </p>
          </div>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}