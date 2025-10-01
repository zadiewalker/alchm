import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// CRISIS-CRITICAL: Emergency session management for users in crisis
// Provides immediate access without full authentication when users need help

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { crisisLevel = 'moderate', emergencyMode = true } = body;

    // Generate emergency session ID
    const sessionId = `emergency_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Create emergency session data
    const emergencySessionData = {
      sessionId,
      type: 'emergency',
      crisisLevel,
      emergencyMode,
      createdAt: Date.now(),
      expiresAt: Date.now() + (2 * 60 * 60 * 1000), // 2 hours for emergency sessions
      capabilities: {
        canJournal: true,
        canAccessCrisisResources: true,
        canContactSupport: true,
        canAccessEmergencyMode: true
      }
    };

    const response = NextResponse.json({ 
      success: true,
      sessionId,
      type: 'emergency',
      crisisLevel,
      emergencyMode: true
    });

    // Set emergency session cookie
    response.cookies.set('alchm-emergency-session', JSON.stringify(emergencySessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60, // 2 hours
      path: '/'
    });

    return response;

  } catch (error) {
    console.error('Emergency session creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create emergency session' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });
    
    // Clear emergency session cookie
    response.cookies.delete('alchm-emergency-session');
    
    return response;

  } catch (error) {
    console.error('Emergency session deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to clear emergency session' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const emergencySessionCookie = cookieStore.get('alchm-emergency-session');

    if (!emergencySessionCookie) {
      return NextResponse.json(
        { error: 'No emergency session found' },
        { status: 401 }
      );
    }

    const emergencySessionData = JSON.parse(emergencySessionCookie.value);
    
    // Check if emergency session is expired
    if (emergencySessionData.expiresAt < Date.now()) {
      return NextResponse.json(
        { error: 'Emergency session expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      sessionId: emergencySessionData.sessionId,
      type: 'emergency',
      crisisLevel: emergencySessionData.crisisLevel,
      emergencyMode: emergencySessionData.emergencyMode,
      capabilities: emergencySessionData.capabilities
    });

  } catch (error) {
    console.error('Emergency session retrieval error:', error);
    return NextResponse.json(
      { error: 'Invalid emergency session' },
      { status: 401 }
    );
  }
}