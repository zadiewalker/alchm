/**
 * Jest Global Teardown - Memory cleanup and performance reporting
 */

export default async function globalTeardown(): Promise<void> {
  console.log('🧹 Cleaning up ALCHM test environment...')
  
  // Calculate total test duration
  const startTime = parseInt(process.env.TEST_START_TIME || '0', 10)
  const totalDuration = Date.now() - startTime
  
  console.log(`⏱️ Total test duration: ${(totalDuration / 1000).toFixed(2)}s`)
  
  // Final garbage collection
  if (global.gc) {
    global.gc()
    console.log('🗑️ Final garbage collection completed')
  }
  
  // Report memory usage
  if (process.memoryUsage) {
    const memUsage = process.memoryUsage()
    console.log('📊 Memory usage:', {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
    })
  }
  
  console.log('✅ ALCHM test environment cleaned up')
}