import { NextRequest, NextResponse } from 'next/server';

// Privacy-preserving location detection for crisis resource selection
// Only returns country code, never stores or logs specific location data

export async function GET(request: NextRequest) {
  try {
    // Get IP address for basic country detection
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    // For development/localhost, return default
    if (ip === 'unknown' || ip.includes('127.0.0.1') || ip.includes('localhost')) {
      return NextResponse.json({
        country: 'US',
        source: 'default',
        timestamp: Date.now()
      });
    }

    // Use a simple IP geolocation service for country detection
    // This is only for crisis resource selection, never stored
    try {
      const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`, {
        headers: {
          'User-Agent': 'ALCHM-Crisis-Support/1.0'
        }
      });
      
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        return NextResponse.json({
          country: geoData.countryCode || 'US',
          source: 'geo-ip',
          timestamp: Date.now()
        });
      }
    } catch (geoError) {
      console.warn('Geo IP lookup failed, using default:', geoError);
    }

    // Fallback to US if geolocation fails
    return NextResponse.json({
      country: 'US',
      source: 'fallback',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Location detection error:', error);
    
    // Always return a safe default for crisis situations
    return NextResponse.json({
      country: 'US',
      source: 'error-fallback',
      timestamp: Date.now()
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Handle coordinates from browser geolocation
    const body = await request.json();
    const { latitude, longitude } = body;
    
    if (!latitude || !longitude) {
      return NextResponse.json({
        country: 'US',
        source: 'invalid-coords',
        timestamp: Date.now()
      });
    }

    // Use reverse geocoding for country detection
    // Note: In production, you might want to use a more reliable service
    try {
      const reverseGeoResponse = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      
      if (reverseGeoResponse.ok) {
        const reverseGeoData = await reverseGeoResponse.json();
        return NextResponse.json({
          country: reverseGeoData.countryCode || 'US',
          source: 'coordinates',
          timestamp: Date.now()
        });
      }
    } catch (reverseGeoError) {
      console.warn('Reverse geocoding failed:', reverseGeoError);
    }

    // Fallback to IP-based detection if coordinates don't work
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const ip = forwardedFor?.split(',')[0] || realIp || 'unknown';
    
    if (ip !== 'unknown') {
      try {
        const geoResponse = await fetch(`http://ip-api.com/json/${ip}?fields=countryCode`);
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          return NextResponse.json({
            country: geoData.countryCode || 'US',
            source: 'ip-fallback',
            timestamp: Date.now()
          });
        }
      } catch (ipError) {
        console.warn('IP fallback failed:', ipError);
      }
    }

    return NextResponse.json({
      country: 'US',
      source: 'final-fallback',
      timestamp: Date.now()
    });

  } catch (error) {
    console.error('Location POST error:', error);
    
    return NextResponse.json({
      country: 'US',
      source: 'post-error-fallback',
      timestamp: Date.now()
    });
  }
}