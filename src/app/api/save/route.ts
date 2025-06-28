// src/app/api/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
  try {
    const { emotion, content } = await req.json();

    if (!emotion || !content) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const docRef = await addDoc(collection(db, 'journalEntries'), {
      emotion,
      content,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ success: true, id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error('[API ERROR]', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
