// Ultra-simple React component with NO hooks, NO complexity
console.log('🧪 Simple test component file loading')

export default function SimpleTestPage() {
  console.log('🧪 Simple test component rendering')
  
  const currentTime = new Date().toLocaleTimeString()
  
  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        textAlign: 'center'
      }}
    >
      <div style={{ maxWidth: '400px', padding: '20px' }}>
        <div 
          style={{
            width: '80px',
            height: '80px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '2rem'
          }}
        >
          ⚛️
        </div>
        
        <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>✅ React Works!</h1>
        <p style={{ marginBottom: '10px', opacity: 0.8 }}>Simple component loaded successfully</p>
        <p style={{ marginBottom: '20px', fontSize: '14px', opacity: 0.6 }}>
          Rendered at: {currentTime}
        </p>
        
        <div style={{ marginBottom: '30px' }}>
          <p style={{ fontSize: '16px', margin: '10px 0' }}>✅ React mounting works</p>
          <p style={{ fontSize: '16px', margin: '10px 0' }}>✅ JSX rendering works</p>
          <p style={{ fontSize: '16px', margin: '10px 0' }}>✅ Inline styles work</p>
          <p style={{ fontSize: '16px', margin: '10px 0' }}>✅ JavaScript execution works</p>
        </div>
        
        <div>
          <a 
            href="/test-hooks/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '5px',
              background: '#D4A84B',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          >
            Test Hooks Next →
          </a>
          
          <a 
            href="/test.html"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '5px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          >
            ← Back to Static
          </a>
          
          <a 
            href="/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '5px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '20px',
              fontSize: '14px'
            }}
          >
            Home
          </a>
        </div>
        
        {/* Debug info */}
        <div 
          style={{ 
            marginTop: '30px',
            padding: '15px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '10px',
            fontSize: '12px',
            textAlign: 'left'
          }}
        >
          <strong>Debug Info:</strong><br />
          User Agent: {navigator.userAgent.slice(0, 50)}...<br />
          Platform: {navigator.platform}<br />
          Language: {navigator.language}<br />
          Cookies Enabled: {navigator.cookieEnabled ? 'Yes' : 'No'}<br />
          Online: {navigator.onLine ? 'Yes' : 'No'}
        </div>
      </div>
    </div>
  )
}