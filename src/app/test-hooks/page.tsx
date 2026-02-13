'use client'
import { BlockInProduction } from '@/components/BlockInProduction'
import { useState, useEffect } from 'react'

console.log('🪝 Hook test component file loading')

export default function TestHooksPage() {
  if (process.env.NODE_ENV === 'production') return <BlockInProduction />
  console.log('🪝 Hook test component rendering')
  
  const [message, setMessage] = useState('⏳ Loading...')
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<string[]>([])
  const [testCount, setTestCount] = useState(0)

  const addResult = (result: string) => {
    console.log(`🪝 Test result: ${result}`)
    setTestResults(prev => [...prev, result])
  }

  useEffect(() => {
    console.log('🪝 useEffect starting')
    
    try {
      addResult('✅ useEffect started')
      
      // Test 1: Simple state update
      setMessage('🪝 useEffect is running...')
      addResult('✅ State update works')
      
      // Test 2: Timer
      const timer1 = setTimeout(() => {
        addResult('✅ setTimeout works')
        setMessage('✅ useEffect completed!')
        setTestCount(1)
      }, 500)

      // Test 3: Second timer
      const timer2 = setTimeout(() => {
        addResult('✅ Multiple timers work')
        setTestCount(2)
      }, 1000)

      // Test 4: Cleanup test
      const interval = setInterval(() => {
        setTestCount(prev => {
          const newCount = prev + 1
          if (newCount <= 10) {
            addResult(`✅ Interval tick: ${newCount}`)
          }
          return newCount
        })
      }, 1500)

      // Cleanup after 10 seconds
      const cleanupTimer = setTimeout(() => {
        clearInterval(interval)
        addResult('✅ Cleanup completed')
      }, 15000)

      console.log('✅ useEffect setup completed successfully')

      return () => {
        console.log('🧹 useEffect cleanup running')
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearInterval(interval)
        clearTimeout(cleanupTimer)
        addResult('🧹 Cleanup function executed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      console.error('❌ useEffect error:', errorMessage)
      setError(errorMessage)
      setMessage('❌ useEffect failed')
    }
  }, []) // Empty deps - run once only

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, #FF6B6B, #FF8E8E)', 
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div>
          <h1>❌ useEffect Error</h1>
          <p style={{ background: 'rgba(255,255,255,0.1)', padding: '15px', borderRadius: '10px' }}>
            {error}
          </p>
          <a 
            href="/test-simple/"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              margin: '10px',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '20px'
            }}
          >
            ← Back to Simple Test
          </a>
        </div>
      </div>
    )
  }

  return (
    <div 
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #8B9A7C, #A8B5A0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'system-ui',
        textAlign: 'center',
        padding: '20px'
      }}
    >
      <div style={{ maxWidth: '500px' }}>
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
          🪝
        </div>
        
        <h1>Hook Test</h1>
        <p style={{ fontSize: '18px', marginBottom: '20px' }}>{message}</p>
        <p style={{ marginBottom: '30px', opacity: 0.8 }}>
          Test Count: <strong>{testCount}</strong>
        </p>
        
        <div 
          style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '30px',
            textAlign: 'left',
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          <h3 style={{ marginTop: 0 }}>Test Results:</h3>
          {testResults.length === 0 ? (
            <p style={{ opacity: 0.6 }}>No results yet...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} style={{ margin: '5px 0', fontSize: '14px' }}>
                {result}
              </div>
            ))
          )}
        </div>

        <div>
          <a 
            href="/dashboard"
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
            Test Dashboard →
          </a>
          
          <a 
            href="/test-simple/"
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
            ← Simple Test
          </a>
        </div>
      </div>
    </div>
  )
}
