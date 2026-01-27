'use client';

export default function EmergencyPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(180deg, #C8D4BC 0%, #A4B792 50%, #8A9A78 100%)',
      color: 'white',
      fontFamily: 'system-ui',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤗</div>
          <h1 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>
            You're Not Alone
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6 }}>
            If you're having thoughts of hurting yourself or others, please reach out for immediate support. 
            Your life has value, and help is available 24/7.
          </p>
        </div>

        {/* Immediate Crisis Support */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem',
          border: '2px solid rgba(255, 255, 255, 0.3)'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            🚨 Immediate Crisis Support
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <a 
              href="tel:988"
              style={{
                display: 'block',
                background: '#fff',
                color: '#333',
                padding: '1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              📞 Call 988 - Suicide & Crisis Lifeline
            </a>
            
            <a 
              href="sms:741741"
              style={{
                display: 'block',
                background: 'rgba(255, 255, 255, 0.9)',
                color: '#333',
                padding: '1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              💬 Text HOME to 741741 - Crisis Text Line
            </a>
            
            <a 
              href="tel:911"
              style={{
                display: 'block',
                background: 'rgba(255, 255, 255, 0.8)',
                color: '#333',
                padding: '1.5rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              🚑 Call 911 - Emergency Services
            </a>
          </div>
        </div>

        {/* Additional Support Resources */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            💚 Additional Support Resources
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🌈 LGBTQ+ Crisis Support
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Trevor Project Lifeline: <a href="tel:1-866-488-7386" style={{ color: 'white' }}>1-866-488-7386</a>
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🎯 Veterans Crisis Line
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                Call: <a href="tel:1-800-273-8255" style={{ color: 'white' }}>1-800-273-8255</a>, Press 1
              </p>
            </div>
            
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              padding: '1rem',
              borderRadius: '8px'
            }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                🌍 International Support
              </h3>
              <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>
                <a href="https://findahelpline.com" style={{ color: 'white', textDecoration: 'underline' }}>
                  Find crisis support in your country
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Self-Care in Crisis */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 300, marginBottom: '1.5rem' }}>
            🌱 Right Now, You Can:
          </h2>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🫁</div>
              <div>
                <strong>Breathe slowly:</strong> In for 4, hold for 4, out for 6
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🤲</div>
              <div>
                <strong>Ground yourself:</strong> Name 5 things you can see, 4 you can touch, 3 you can hear
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>💧</div>
              <div>
                <strong>Drink water</strong> and eat something if you haven't recently
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>🔒</div>
              <div>
                <strong>Remove access</strong> to anything that might harm you
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.5rem' }}>👥</div>
              <div>
                <strong>Reach out</strong> to a trusted friend, family member, or counselor
              </div>
            </div>
          </div>
        </div>

        {/* Navigation back */}
        <div style={{ textAlign: 'center' }}>
          <a 
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              marginRight: '1rem'
            }}
          >
            ← Return to Dashboard
          </a>
          
          <a 
            href="/journal"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px'
            }}
          >
            Continue Journaling
          </a>
        </div>
        
        <div style={{ 
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '0.9rem',
          opacity: 0.8
        }}>
          <p>
            Remember: Crisis feelings are temporary. You are stronger than you know, 
            and professional help can provide you with tools and support.
          </p>
        </div>

      </div>
    </div>
  );
}