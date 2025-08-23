import { NextRequest, NextResponse } from 'next/server';
import { GeoLinguisticCrisisRouter } from '@/lib/crisis-support-routing';

export async function POST(request: NextRequest) {
  try {
    const { text, userLocale, userCountry, userIP } = await request.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const crisisRouter = new GeoLinguisticCrisisRouter();

    // Detect crisis keywords in user text
    const hasCrisisIndicators = crisisRouter.detectCrisisKeywords(text, userLocale || 'en');

    // Get client IP if not provided
    const clientIP = userIP || 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';

    // Get browser language preference
    const acceptLanguage = request.headers.get('accept-language') || undefined;

    let crisisResponse = null;
    if (hasCrisisIndicators) {
      // Generate appropriate crisis support resources
      crisisResponse = crisisRouter.generateCrisisResponse(
        userCountry || 'usa',
        userLocale || 'en',
        clientIP,
        acceptLanguage
      );
    }

    return NextResponse.json({
      hasCrisisIndicators,
      crisisResponse,
      userLocation: {
        ip: clientIP,
        detectedCountry: userCountry || 'usa',
        detectedLanguage: userLocale || 'en'
      }
    });

  } catch (error) {
    console.error('Crisis detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy',
    service: 'crisis-detection',
    timestamp: new Date().toISOString()
  });
}