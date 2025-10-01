// src/app/api/journal/save/route.ts
// ALCHM Journal Saving API - Firebase Studio Optimized
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import admin from 'firebase-admin';
import { validateSession } from '@/lib/validateSession';

// Initialize Firebase Admin if not already done
if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

// CORS headers for Firebase Studio
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    // Validate session and get user
    const session = await validateSession(request);
    if (!session.valid || !session.user?.uid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: corsHeaders }
      );
    }

    // Parse request body
    const body = await request.json();
    const { title, content, mood, moodBefore, moodAfter, tags } = body;

    // Validate required fields
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Content validation for safety
    if (content.length > 50000) { // 50KB limit
      return NextResponse.json(
        { error: 'Content too long. Maximum 50,000 characters.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Initialize Firestore Admin
    const db = getFirestore();
    const userId = session.user.uid;

    // Create journal entry data
    const entryData = {
      userId,
      title: title || `Entry from ${new Date().toLocaleDateString()}`,
      content,
      mood: mood || null,
      moodBefore: typeof moodBefore === 'number' ? moodBefore : null,
      moodAfter: typeof moodAfter === 'number' ? moodAfter : null,
      tags: Array.isArray(tags) ? tags : [],
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      // Privacy compliance
      encrypted: false, // Client-side encryption would set this to true
      processed: false, // AI processing flag
    };

    // Save to appropriate collection based on user tier
    // Using legacy 'journals' collection for compatibility
    const journalsRef = db.collection('journals');
    const newDocRef = journalsRef.doc();
    
    await newDocRef.set(entryData);

    // Crisis detection (if content contains crisis indicators)
    const crisisPatterns = ['suicide', 'kill myself', 'end it all', 'not worth living', 'want to die'];
    const isCrisis = crisisPatterns.some(pattern => 
      content.toLowerCase().includes(pattern.toLowerCase())
    );

    let crisisResponse = null;
    if (isCrisis) {
      // Trigger crisis detection function
      try {
        const crisisResult = await fetch(`${process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_URL || 'https://us-central1-alchm-app.cloudfunctions.net'}/detectCrisis`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: content.substring(0, 200), // Limited for privacy
            userId: userId,
            entryId: newDocRef.id,
          }),
        });

        if (crisisResult.ok) {
          crisisResponse = await crisisResult.json();
        }
      } catch (crisisError) {
        console.error('Crisis detection failed:', crisisError);
        // Don't fail the save operation if crisis detection fails
      }
    }

    return NextResponse.json({
      success: true,
      entryId: newDocRef.id,
      message: 'Journal entry saved successfully',
      wordCount: entryData.wordCount,
      crisis: crisisResponse?.crisis_detected || false,
      resources: crisisResponse?.resources || null,
    }, { 
      status: 201,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Journal save error:', error);
    
    return NextResponse.json({
      error: 'Failed to save journal entry',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate session
    const session = await validateSession(request);
    if (!session.valid || !session.user?.uid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: corsHeaders }
      );
    }

    return NextResponse.json({
      message: 'Journal API is active',
      user: session.user.uid,
      timestamp: new Date().toISOString(),
    }, { headers: corsHeaders });

  } catch (error) {
    return NextResponse.json({
      error: 'API error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}