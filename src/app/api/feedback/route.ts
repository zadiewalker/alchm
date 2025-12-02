import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseDb } from '@/lib/firebase';
import { FeedbackData } from '@/lib/feedback';

export async function POST(req: NextRequest) {
  try {
    const data: FeedbackData = await req.json();

    // Validate
    if (!data.type || !data.message?.trim()) {
      return NextResponse.json(
        { error: 'Type and message are required' },
        { status: 400 }
      );
    }

    // Sanitize message
    const sanitizedMessage = data.message
      .trim()
      .substring(0, 2000); // Enforce max length

    // Get Firestore instance
    const db = await getFirebaseDb();

    // Prepare document
    const feedbackDoc = {
      type: data.type,
      message: sanitizedMessage,
      context: {
        page: data.context.page || 'unknown',
        userId: data.context.userId || null,
        isAnonymous: data.context.isAnonymous ?? true,
        appVersion: data.context.appVersion || 'unknown',
        buildNumber: data.context.buildNumber || 'unknown',
        deviceInfo: data.context.deviceInfo || 'unknown',
        screenSize: data.context.screenSize || 'unknown',
      },
      status: 'new',
      createdAt: new Date(),
      processedAt: null,
      notes: null,
    };

    // Save to Firestore
    const docRef = await db.collection('feedback').add(feedbackDoc);

    // Optional: Send to Slack for real-time notification
    if (process.env.SLACK_FEEDBACK_WEBHOOK) {
      const typeEmoji = {
        bug: '🐛',
        confusion: '🤔',
        suggestion: '💡',
        appreciation: '✨',
      }[data.type];

      await fetch(process.env.SLACK_FEEDBACK_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: `${typeEmoji} New Feedback: ${data.type}`,
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `*Message:*\n${sanitizedMessage}`,
              },
            },
            {
              type: 'context',
              elements: [
                {
                  type: 'mrkdwn',
                  text: `📍 ${data.context.page} • 📱 ${data.context.deviceInfo} • 🏷️ v${data.context.appVersion}`,
                },
              ],
            },
          ],
        }),
      }).catch(console.error); // Don't fail request if Slack fails
    }

    return NextResponse.json({ 
      success: true, 
      id: docRef.id 
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
}

// GET: Retrieve feedback (for admin dashboard, if needed)
export async function GET(req: NextRequest) {
  // Add authentication check here for admin access
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'new';
  const limit = parseInt(searchParams.get('limit') || '50');

  try {
    const db = await getFirebaseDb();
    const snapshot = await db
      .collection('feedback')
      .where('status', '==', status)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    const feedback = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve feedback' },
      { status: 500 }
    );
  }
}