'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthChanged } from '../../lib/auth';
import type { User } from 'firebase/auth';

export default function WelcomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthChanged((user) => {
      setUser(user);
      setLoading(false);
      if (!user) {
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleComplete = () => {
    if (user) {
      // Mark onboarding as complete
      localStorage.setItem(`alchm-welcome-${user.uid}`, 'completed');
    }
    router.push('/dashboard');
  };

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #C8D4BC 0%, #A4B792 50%, #8A9A78 100%)',
        color: 'white',
        fontFamily: 'system-ui'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  const steps = [
    {
      title: "Welcome to Your Digital Sanctuary",
      content: "ALCHM is a safe space designed specifically for trauma survivors and anyone seeking emotional healing. Here, your feelings are valid, your pace is respected, and your growth is celebrated.",
      icon: "🌱"
    },
    {
      title: "Meet Khepera, Your AI Companion",
      content: "Khepera is an AI companion trained in trauma-informed care. Named after the ancient Egyptian symbol of transformation, Khepera will reflect your wisdom back to you and support your healing journey with gentle insights.",
      icon: "🔮"
    },
    {
      title: "How Khepera Supports You",
      content: "After you write a journal entry, Khepera will offer:\n• Recognition of your emotions\n• Acknowledgment of your strengths\n• Gentle insights for growth\n• Nurturing self-care suggestions\n\nKhepera never diagnoses or judges - only supports and validates your experience.",
      icon: "💚"
    },
    {
      title: "Your Privacy & Safety",
      content: "Your journal entries are private and secured. Khepera analyzes your words to provide insights, but this information stays with you. If Khepera detects you might need additional support, gentle resources will be offered.",
      icon: "🛡️"
    },
    {
      title: "You're in Control",
      content: "You can:\n• Choose when to receive insights\n• Dismiss any analysis that doesn't feel right\n• Journal without analysis anytime\n• Access crisis support whenever needed\n\nThis is your sanctuary - you set the pace.",
      icon: "🤗"
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #C8D4BC 0%, #A4B792 50%, #8A9A78 100%)',
      color: 'white',
      fontFamily: 'system-ui',
      padding: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        maxWidth: '600px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '3rem',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        textAlign: 'center'
      }}>
        
        {/* Progress indicator */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem',
          gap: '0.5rem'
        }}>
          {steps.map((_, index) => (
            <div
              key={index}
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: index + 1 <= step ? 'white' : 'rgba(255, 255, 255, 0.3)',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Step content */}
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>
          {currentStep.icon}
        </div>
        
        <h1 style={{ 
          fontSize: '1.8rem', 
          fontWeight: 300, 
          marginBottom: '1.5rem',
          lineHeight: 1.3
        }}>
          {currentStep.title}
        </h1>
        
        <div style={{ 
          fontSize: '1.1rem', 
          lineHeight: 1.6, 
          marginBottom: '3rem',
          opacity: 0.9,
          whiteSpace: 'pre-line'
        }}>
          {currentStep.content}
        </div>

        {/* Navigation */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: '2rem'
        }}>
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            style={{
              padding: '12px 24px',
              background: step === 1 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
              color: step === 1 ? 'rgba(255, 255, 255, 0.5)' : 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: step === 1 ? 'not-allowed' : 'pointer',
              fontSize: '1rem'
            }}
          >
            Previous
          </button>

          <div style={{ 
            fontSize: '0.9rem', 
            opacity: 0.7,
            fontWeight: 'bold'
          }}>
            {step} of {steps.length}
          </div>

          {step < steps.length ? (
            <button
              onClick={() => setStep(step + 1)}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleComplete}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#333',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold'
              }}
            >
              Enter Your Sanctuary
            </button>
          )}
        </div>

        {/* Crisis support always visible */}
        <div style={{ 
          marginTop: '2rem',
          padding: '1rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          fontSize: '0.9rem'
        }}>
          <div style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Need Support Right Now?
          </div>
          <div>
            <a href="/emergency" style={{ color: 'white', textDecoration: 'underline' }}>
              Crisis Support: 988
            </a>
            {' • '}
            <a href="tel:741741" style={{ color: 'white', textDecoration: 'underline' }}>
              Text HOME to 741741
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}