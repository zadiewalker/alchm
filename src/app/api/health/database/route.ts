// Database health check endpoint for ALCHM
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, doc, getDoc, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { logger } from '@/lib/logging'

export async function GET(request: NextRequest) {
  try {
    // Test basic Firestore connectivity and operations
    const healthCheck = await performDatabaseHealthCheck()
    
    logger.info('Database health check performed', {
      ...healthCheck
    }, {
      component: 'database_health',
      action: 'health_check_performed'
    })

    const statusCode = healthCheck.healthy ? 200 : 503

    return NextResponse.json(healthCheck, { status: statusCode })

  } catch (error) {
    console.error('Database health check failed:', error)
    
    logger.error('Database health check failed', error instanceof Error ? error : new Error(String(error)), {
      endpoint: '/api/health/database'
    }, {
      component: 'database_health',
      action: 'health_check_failed'
    })

    return NextResponse.json({
      healthy: false,
      timestamp: new Date().toISOString(),
      error: 'Database health check failed',
      checks: {
        connection: false,
        read: false,
        write: false,
        delete: false
      },
      latency: null
    }, { status: 503 })
  }
}

async function performDatabaseHealthCheck() {
  const startTime = Date.now()
  const checks = {
    connection: false,
    read: false,
    write: false,
    delete: false
  }
  
  try {
    // Test 1: Basic connection by reading a system document
    try {
      // Try to read from a health check collection
      const healthCheckRef = doc(db, 'system', 'health')
      await getDoc(healthCheckRef)
      checks.connection = true
      checks.read = true
    } catch (readError) {
      console.warn('Database read test failed:', readError)
    }
    
    // Test 2: Write operation
    try {
      const testData = {
        timestamp: serverTimestamp(),
        test: true,
        healthCheck: true
      }
      
      const docRef = await addDoc(collection(db, 'health_checks'), testData)
      checks.write = true
      
      // Test 3: Delete operation (cleanup the test document)
      try {
        await deleteDoc(docRef)
        checks.delete = true
      } catch (deleteError) {
        console.warn('Database delete test failed:', deleteError)
      }
      
    } catch (writeError) {
      console.warn('Database write test failed:', writeError)
    }
    
    const latency = Date.now() - startTime
    const healthy = checks.connection && checks.read && checks.write
    
    return {
      healthy,
      timestamp: new Date().toISOString(),
      checks,
      latency,
      performance: {
        fast: latency < 100,
        acceptable: latency < 500,
        slow: latency >= 500
      }
    }
    
  } catch (error) {
    return {
      healthy: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      checks,
      latency: Date.now() - startTime
    }
  }
}