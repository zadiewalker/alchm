import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const firebaseUrl = process.env.FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-digital-sanctuary.cloudfunctions.net';
    
    const response = await fetch(`${firebaseUrl}/joinCollectiveExperience`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}