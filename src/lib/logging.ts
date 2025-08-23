// Firebase-based logging system for ALCHM
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info', 
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export interface LogEntry {
  id?: string
  level: LogLevel
  message: string
  timestamp: Timestamp | Date
  userId?: string
  sessionId?: string
  requestId?: string
  component?: string
  action?: string
  metadata?: Record<string, any>
  error?: {
    name: string
    message: string
    stack?: string
    code?: string
  }
  context?: {
    url?: string
    userAgent?: string
    buildId?: string
    feature?: string
    [key: string]: any
  }
}

export interface LogQuery {
  level?: LogLevel
  userId?: string
  component?: string
  startDate?: Date
  endDate?: Date
  limit?: number
}

// Logger class with Firebase integration
export class AlchmLogger {
  private static instance: AlchmLogger | null = null
  private logQueue: LogEntry[] = []
  private isOnline: boolean = true
  private flushInterval: NodeJS.Timeout | null = null

  private constructor() {
    this.setupOnlineDetection()
    this.startPeriodicFlush()
  }

  static getInstance(): AlchmLogger {
    if (!this.instance) {
      this.instance = new AlchmLogger()
    }
    return this.instance
  }

  // Public logging methods
  debug(message: string, metadata?: Record<string, any>, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, metadata, context)
  }

  info(message: string, metadata?: Record<string, any>, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, metadata, context)
  }

  warn(message: string, metadata?: Record<string, any>, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, metadata, context)
  }

  error(message: string, error?: Error, metadata?: Record<string, any>, context?: Record<string, any>): void {
    const errorInfo = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as any).code
    } : undefined

    this.log(LogLevel.ERROR, message, metadata, context, errorInfo)
  }

  fatal(message: string, error?: Error, metadata?: Record<string, any>, context?: Record<string, any>): void {
    const errorInfo = error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
      code: (error as any).code
    } : undefined

    this.log(LogLevel.FATAL, message, metadata, context, errorInfo)
  }

  // Specialized logging methods
  logUserAction(action: string, userId: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, `User action: ${action}`, {
      ...metadata,
      action,
      userId
    }, {
      feature: 'user_analytics'
    })
  }

  logPerformance(metric: string, value: number, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, `Performance metric: ${metric}`, {
      ...metadata,
      metric,
      value,
      type: 'performance'
    }, {
      feature: 'performance_monitoring'
    })
  }

  logSecurityEvent(event: string, severity: 'low' | 'medium' | 'high', metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, `Security event: ${event}`, {
      ...metadata,
      event,
      severity,
      type: 'security'
    }, {
      feature: 'security_monitoring'
    })
  }

  logAPICall(
    endpoint: string, 
    method: string, 
    status: number, 
    duration: number, 
    metadata?: Record<string, any>
  ): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO
    
    this.log(level, `API call: ${method} ${endpoint}`, {
      ...metadata,
      endpoint,
      method,
      status,
      duration,
      type: 'api_call'
    }, {
      feature: 'api_monitoring'
    })
  }

  // Core logging method
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    context?: Record<string, any>,
    error?: any
  ): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      requestId: this.getRequestId(),
      component: context?.component,
      action: context?.action,
      metadata,
      error,
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        userAgent: typeof window !== 'undefined' ? navigator.userAgent : undefined,
        buildId: process.env.NEXT_PUBLIC_BUILD_ID || 'unknown',
        environment: process.env.NODE_ENV
      }
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      this.logToConsole(logEntry)
    }

    // Add to queue for Firebase
    this.logQueue.push(logEntry)

    // Flush immediately for critical errors
    if (level === LogLevel.ERROR || level === LogLevel.FATAL) {
      this.flushLogs()
    }
  }

  private logToConsole(entry: LogEntry): void {
    const emoji = {
      [LogLevel.DEBUG]: '🔍',
      [LogLevel.INFO]: 'ℹ️',
      [LogLevel.WARN]: '⚠️',
      [LogLevel.ERROR]: '❌',
      [LogLevel.FATAL]: '💀'
    }

    const color = {
      [LogLevel.DEBUG]: 'color: #6b7280',
      [LogLevel.INFO]: 'color: #2563eb',
      [LogLevel.WARN]: 'color: #d97706',
      [LogLevel.ERROR]: 'color: #dc2626',
      [LogLevel.FATAL]: 'color: #991b1b; font-weight: bold'
    }

    console.log(
      `%c${emoji[entry.level]} [${entry.level.toUpperCase()}] ${entry.message}`,
      color[entry.level]
    )

    if (entry.metadata) {
      console.log('Metadata:', entry.metadata)
    }

    if (entry.error) {
      console.error('Error:', entry.error)
    }

    if (entry.context) {
      console.log('Context:', entry.context)
    }
  }

  // Queue management
  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0 || !this.isOnline) {
      return
    }

    const logsToFlush = [...this.logQueue]
    this.logQueue = []

    try {
      await this.sendLogsToFirebase(logsToFlush)
    } catch (error) {
      console.error('Failed to flush logs to Firebase:', error)
      // Re-add failed logs to queue
      this.logQueue.unshift(...logsToFlush)
    }
  }

  private async sendLogsToFirebase(logs: LogEntry[]): Promise<void> {
    const batch = logs.map(async (log) => {
      try {
        const docRef = await addDoc(collection(db, 'logs'), {
          ...log,
          timestamp: serverTimestamp()
        })
        return { success: true, id: docRef.id }
      } catch (error) {
        console.error('Failed to write log entry:', error)
        return { success: false, log, error }
      }
    })

    await Promise.allSettled(batch)
  }

  private startPeriodicFlush(): void {
    // Flush logs every 30 seconds
    this.flushInterval = setInterval(() => {
      this.flushLogs()
    }, 30000)

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flushLogs()
      })

      window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushLogs()
        }
      })
    }
  }

  private setupOnlineDetection(): void {
    if (typeof window !== 'undefined') {
      this.isOnline = navigator.onLine

      window.addEventListener('online', () => {
        this.isOnline = true
        this.flushLogs() // Flush queued logs when back online
      })

      window.addEventListener('offline', () => {
        this.isOnline = false
      })
    }
  }

  // Utility methods
  private getCurrentUserId(): string | undefined {
    try {
      if (typeof window !== 'undefined') {
        const user = localStorage.getItem('alchm_user')
        return user ? JSON.parse(user).uid : undefined
      }
    } catch {
      return undefined
    }
    return undefined
  }

  private getSessionId(): string {
    try {
      if (typeof window !== 'undefined') {
        let sessionId = sessionStorage.getItem('alchm_session_id')
        if (!sessionId) {
          sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
          sessionStorage.setItem('alchm_session_id', sessionId)
        }
        return sessionId
      }
    } catch {
      return 'unknown'
    }
    return 'unknown'
  }

  private getRequestId(): string {
    // Generate or get request ID from headers/context
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Query methods for log retrieval
  async queryLogs(queryParams: LogQuery): Promise<LogEntry[]> {
    try {
      let q = query(collection(db, 'logs'))

      // Apply filters
      if (queryParams.level) {
        q = query(q, where('level', '==', queryParams.level))
      }

      if (queryParams.userId) {
        q = query(q, where('userId', '==', queryParams.userId))
      }

      if (queryParams.component) {
        q = query(q, where('component', '==', queryParams.component))
      }

      if (queryParams.startDate) {
        q = query(q, where('timestamp', '>=', queryParams.startDate))
      }

      if (queryParams.endDate) {
        q = query(q, where('timestamp', '<=', queryParams.endDate))
      }

      // Order by timestamp descending
      q = query(q, orderBy('timestamp', 'desc'))

      // Apply limit
      if (queryParams.limit) {
        q = query(q, limit(queryParams.limit))
      }

      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as LogEntry))

    } catch (error) {
      console.error('Failed to query logs:', error)
      return []
    }
  }

  async getRecentErrors(limitCount: number = 50): Promise<LogEntry[]> {
    return this.queryLogs({
      level: LogLevel.ERROR,
      limit: limitCount
    })
  }

  async getUserLogs(userId: string, limitCount: number = 100): Promise<LogEntry[]> {
    return this.queryLogs({
      userId,
      limit: limitCount
    })
  }

  // Cleanup
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
    }
    this.flushLogs() // Final flush
  }
}

// Structured logging utilities
export class StructuredLogger {
  private logger: AlchmLogger

  constructor() {
    this.logger = AlchmLogger.getInstance()
  }

  // Journal-specific logging
  journalCreated(userId: string, journalId: string, metadata?: Record<string, any>): void {
    this.logger.info('Journal entry created', {
      journalId,
      ...metadata
    }, {
      component: 'journal',
      action: 'create',
      userId
    })
  }

  journalUpdated(userId: string, journalId: string, metadata?: Record<string, any>): void {
    this.logger.info('Journal entry updated', {
      journalId,
      ...metadata
    }, {
      component: 'journal',
      action: 'update',
      userId
    })
  }

  journalDeleted(userId: string, journalId: string): void {
    this.logger.info('Journal entry deleted', {
      journalId
    }, {
      component: 'journal',
      action: 'delete',
      userId
    })
  }

  // Authentication logging
  userSignedIn(userId: string, method: string): void {
    this.logger.info('User signed in', {
      method,
      userId
    }, {
      component: 'auth',
      action: 'sign_in'
    })
  }

  userSignedOut(userId: string): void {
    this.logger.info('User signed out', {
      userId
    }, {
      component: 'auth',
      action: 'sign_out'
    })
  }

  authenticationFailed(method: string, reason: string): void {
    this.logger.warn('Authentication failed', {
      method,
      reason
    }, {
      component: 'auth',
      action: 'sign_in_failed'
    })
  }

  // AI interaction logging
  aiRequestSent(userId: string, prompt: string, model: string): void {
    this.logger.info('AI request sent', {
      promptLength: prompt.length,
      model,
      userId
    }, {
      component: 'ai',
      action: 'request'
    })
  }

  aiResponseReceived(userId: string, responseLength: number, duration: number): void {
    this.logger.info('AI response received', {
      responseLength,
      duration,
      userId
    }, {
      component: 'ai',
      action: 'response'
    })
  }

  aiRequestFailed(userId: string, error: Error): void {
    this.logger.error('AI request failed', error, {
      userId
    }, {
      component: 'ai',
      action: 'request_failed'
    })
  }
}

// Global logger instance
export const logger = AlchmLogger.getInstance()
export const structuredLogger = new StructuredLogger()

// Setup logging on module load
if (typeof window !== 'undefined') {
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    logger.destroy()
  })
}

export default AlchmLogger