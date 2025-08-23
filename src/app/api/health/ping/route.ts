// Simple ping endpoint for ALCHM health checks
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'alchm',
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown'
  })
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'X-Service': 'alchm',
      'X-Status': 'ok',
      'X-Timestamp': new Date().toISOString()
    }
  })
}