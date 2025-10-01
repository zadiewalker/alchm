// src/app/api/journal/list/route.ts
// ALCHM Journal List API - Retrieve user's journal entries
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

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    // Validate session and get user
    const session = await validateSession(request);
    if (!session.valid || !session.user?.uid) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers: corsHeaders }
      );
    }

    const userId = session.user.uid;
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Initialize Firestore Admin
    const db = getFirestore();
    
    // Query journals collection for user's entries
    let query = db.collection('journals')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit);

    if (offset > 0) {
      // For pagination, we'd need to implement proper cursor-based pagination
      // For now, just limit the results
      query = query.offset(offset);
    }

    const snapshot = await query.get();
    
    const journals = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || `Entry from ${data.createdAt?.toDate()?.toLocaleDateString() || 'Unknown date'}`,
        content: data.content || '',
        preview: data.content ? data.content.substring(0, 200) + (data.content.length > 200 ? '...' : '') : '',
        mood: data.mood || null,
        wordCount: data.wordCount || 0,
        tags: data.tags || [],
        createdAt: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
      };
    });

    // Get total count for pagination
    const totalCountSnapshot = await db.collection('journals')
      .where('userId', '==', userId)
      .count()
      .get();
    
    const totalCount = totalCountSnapshot.data().count;

    return NextResponse.json({
      journals,
      totalCount,
      hasMore: (offset + limit) < totalCount,
      nextOffset: journals.length === limit ? offset + limit : null,
    }, { 
      status: 200,
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Journal list error:', error);
    
    return NextResponse.json({
      error: 'Failed to retrieve journal entries',
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      journals: [], // Return empty array as fallback
    }, { 
      status: 500,
      headers: corsHeaders 
    });
  }
}