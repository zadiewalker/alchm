import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the request headers
    const userId = request.headers.get('x-user-id');
    const authHeader = request.headers.get('Authorization');

    if (!userId || !authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get journal entries for the user
    const entriesRef = adminDb.collection('users').doc(userId).collection('entries');
    const snapshot = await entriesRef.orderBy('createdAt', 'desc').get();

    const journals = snapshot.docs.map(doc => {
      const data = doc.data();
      const content = data.content || '';
      const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
      
      // Create a preview (first 150 characters)
      const preview = content.length > 150 
        ? content.substring(0, 150).trim() + '...'
        : content;

      return {
        id: doc.id,
        content: data.content,
        title: data.title || null,
        mood: data.mood || null,
        wordCount,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        preview,
        tags: data.tags || [],
      };
    });

    return NextResponse.json({ journals });

  } catch (error) {
    console.error('Error fetching journal list:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journals', journals: [] },
      { status: 500 }
    );
  }
}