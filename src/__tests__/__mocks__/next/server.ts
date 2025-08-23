// Next.js server mocks
import { jest } from '@jest/globals'

// Mock NextRequest
export class NextRequest {
  url: string
  method: string
  headers: Map<string, string>
  cookies: Map<string, { value: string }>
  body: any

  constructor(url: string, init?: RequestInit) {
    this.url = url
    this.method = init?.method || 'GET'
    this.headers = new Map()
    this.cookies = new Map()
    this.body = init?.body
  }

  json() {
    return Promise.resolve(this.body ? JSON.parse(this.body as string) : {})
  }

  text() {
    return Promise.resolve(this.body as string || '')
  }

  clone() {
    return new NextRequest(this.url, {
      method: this.method,
      body: this.body
    })
  }
}

// Mock NextResponse
export class NextResponse {
  status: number
  headers: Map<string, string>
  body: any

  constructor(body?: any, init?: ResponseInit) {
    this.status = init?.status || 200
    this.headers = new Map()
    this.body = body
  }

  static json(object: any, init?: ResponseInit) {
    const response = new NextResponse(JSON.stringify(object), init)
    response.headers.set('Content-Type', 'application/json')
    return response
  }

  static redirect(url: string, status: number = 302) {
    const response = new NextResponse(null, { status })
    response.headers.set('Location', url)
    return response
  }

  static next() {
    return new NextResponse(null, { status: 200 })
  }

  clone() {
    return new NextResponse(this.body, { status: this.status })
  }
}

export default {
  NextRequest,
  NextResponse
}