import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CRISIS-CRITICAL: Ultra-minimal session management for emergency access
// Optimized for instant response times during user crisis situations

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, user } = body;

    if (!uid || !user) {
      return NextResponse.json(
        { error: 'Missing required session data' },
        { status: 400 }
      );
    }

    // Create session cookie (simplified for crisis response)
    const sessionData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    const response = NextResponse.json({ 
      success: true,
      sessionId: uid 
    });

    // Set secure session cookie
    response.cookies.set('alchm-session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear session cookie
    response.cookies.delete('alchm-session');
    
    return response;

  } catch (error) {
    console.error('Session deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to clear session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('alchm-session');

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'No session found' },
        { status: 401 }
      );
    }

    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check if session is expired
    if (sessionData.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        uid: sessionData.uid,
        email: sessionData.email,
        displayName: sessionData.displayName
      }
    });

  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Invalid session' },
      { status: 401 }
    );
  }
}