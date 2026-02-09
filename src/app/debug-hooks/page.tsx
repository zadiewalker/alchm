'use client'
import { useState, useEffect } from 'react'

console.log('🪝 DebugHooksPage: File loading')

export default function DebugHooksPage() {
  console.log('🪝 DebugHooksPage: Component starting render')
  
  const [status, setStatus] = useState('Initializing...')
  const [hookTests, setHookTests] = useState<string[]>([])
  const [mountCount, setMountCount] = useState(0)
  const [error, setError] = useState<string | null>(null)

  console.log('🪝 DebugHooksPage: useState hooks initialized')

  // Test useEffect with comprehensive logging
  useEffect(() => {
    console.log('🪝 DebugHooksPage: useEffect starting - mount #' + (mountCount + 1))
    
    setMountCount(prev => {
      const newCount = prev + 1
      console.log('🪝 DebugHooksPage: Mount count updated to:', newCount)
      return newCount
    })
    
    const addTest = (test: string) => {
      console.log(`🪝 Hook test result: ${test}`)
      setHookTests(prev => {
        const updated = [...prev, test]
        console.log('🪝 DebugHooksPage: Tests array updated, length:', updated.length)
        return updated
      })
    }

    const runHookTests = async () => {
      try {
        console.log('🪝 DebugHooksPage: Starting hook test sequence')
        
        // Test 1: Basic state update
        setStatus('Running useState tests...')
        addTest('✅ useState initialization works')
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Test 2: Function update
        setStatus('Running function state updates...')
        addTest('✅ Functional state updates work')
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Test 3: Async operations
        setStatus('Testing async operations...')
        const asyncResult = await new Promise<string>(resolve => {
          setTimeout(() => {
            resolve('Async operation completed')
          }, 200)
        })
        addTest('✅ Async/await operations work')
        addTest(`✅ Promise result: ${asyncResult}`)
        
        // Test 4: Timer operations
        setStatus('Testing timers...')
        const timerPromise = new Promise<void>(resolve => {
          const timerId = setTimeout(() => {
            addTest('✅ setTimeout operations work')
            resolve()
          }, 100)
          
          // Test cleanup tracking
          console.log('🪝 DebugHooksPage: Timer created with ID:', timerId)
        })
        
        await timerPromise
        
        // Test 5: State batch updates
        setStatus('Testing batch updates...')
        setHookTests(prev => [
          ...prev,
          '✅ Array spread operations work',
          '✅ Multiple state updates work',
          '✅ Batch state updates work'
        ])
        
        // Test 6: Error handling
        try {
          throw new Error('Test error handling')
        } catch (testError) {
          addTest('✅ Error handling works')
        }
        
        // Final status
        setStatus('✅ All hook tests completed successfully!')
        addTest(`✅ Test sequence finished at ${new Date().toLocaleTimeString()}`)
        
        console.log('🪝 DebugHooksPage: All hook tests completed successfully')
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        console.error('🪝 DebugHooksPage: Hook test error:', errorMessage)
        setError(errorMessage)
        setStatus(`❌ Error: ${errorMessage}`)
      }
    }

    // Run tests with small delay to ensure proper mounting
    const testTimeout = setTimeout(runHookTests, 250)

    // Cleanup function
    return () => {
      console.log('🪝 DebugHooksPage: useEffect cleanup running for mount #' + mountCount)
      clearTimeout(testTimeout)
      addTest('🧹 useEffect cleanup executed')
    }
  }, []) // Empty dependency array - should run once only

  console.log('🪝 DebugHooksPage: About to render JSX, current status:', status)

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
    color: 'white',
    padding: '20px'
  }

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '30px',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)'
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          ...cardStyle,
          borderColor: 'rgba(239, 68, 68, 0.5)',
          background: 'rgba(239, 68, 68, 0.1)'
        }}>
          <h1 style={{ margin: '0 0 20px 0', color: '#FF6B6B' }}>❌ useEffect Error</h1>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            fontFamily: 'monospace',
            fontSize: '12px'
          }}>
            {error}
          </div>
          <p>This indicates a problem with React hooks in this environment.</p>
          <a 
            href="/debug-react/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '10px 5px',
              background: '#D4A84B',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px'
            }}
          >
            ← Back to Basic React
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>🪝</div>
          <h1 style={{ margin: '0 0 10px 0' }}>React Hooks Test</h1>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            Mount Count: <strong>{mountCount}</strong> | 
            Status: <strong>{status}</strong>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '12px',
          padding: '15px',
          marginBottom: '20px',
          maxHeight: '300px',
          overflowY: 'auto',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '10px', fontSize: '16px' }}>Test Results:</h3>
          {hookTests.length === 0 ? (
            <div style={{ opacity: 0.6, fontSize: '14px' }}>
              ⏳ Running hook tests...
            </div>
          ) : (
            <div>
              {hookTests.map((test, index) => (
                <div 
                  key={index} 
                  style={{ 
                    margin: '6px 0',
                    padding: '8px',
                    fontSize: '13px',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    borderLeft: '3px solid rgba(34, 197, 94, 0.6)'
                  }}
                >
                  {test}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a 
            href="/dashboard/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '5px',
              background: '#D4A84B',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            🏠 Test Dashboard →
          </a>
          
          <a 
            href="/debug-react/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '5px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            ← Simple React
          </a>
          
          <a 
            href="/debug.html"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '5px',
              background: 'rgba(255,255,255,0.1)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            🔍 Debug Panel
          </a>
        </div>
        
        <div style={{
          marginTop: '20px',
          fontSize: '11px',
          opacity: 0.6,
          textAlign: 'center',
          fontFamily: 'monospace'
        }}>
          Check browser console for detailed 🪝 debug messages
        </div>
      </div>
    </div>
  )
}

console.log('🪝 DebugHooksPage: File loaded completely')