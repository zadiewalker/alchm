'use client'
import { useEffect, useState } from 'react'

export function useSplashScreen() {
  const [isReady, setIsReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Wait for essential app initialization
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Check if we're in Capacitor environment
        if (typeof window !== 'undefined' && (window as any).Capacitor) {
          try {
            const { SplashScreen } = await import('@capacitor/splash-screen')
            
            // Hide splash screen manually
            await SplashScreen.hide({
              fadeOutDuration: 300
            })
            
            console.log('✅ Splash screen hidden successfully')
          } catch (splashError) {
            console.warn('⚠️ Could not hide splash screen:', splashError)
            // Continue anyway
          }
        }
        
        setIsReady(true)
      } catch (error) {
        console.error('❌ App initialization error:', error)
        setHasError(true)
        setIsReady(true) // Still mark as ready to show error state
      }
    }

    initializeApp()
  }, [])

  return { isReady, hasError }
}