import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export async function verifyAuthToken(authorization: string | undefined): Promise<admin.auth.DecodedIdToken | null> {
  if (!authorization) {
    return null;
  }

  const token = authorization.replace("Bearer ", "");
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function validateUserAccess(decodedToken: admin.auth.DecodedIdToken | null, requestedUserId: string): boolean {
  if (!decodedToken) {
    return false;
  }
  
  // User can only access their own data
  return decodedToken.uid === requestedUserId;
}

export async function checkRateLimit(userId: string, operation: string): Promise<boolean> {
  try {
    const db = admin.firestore();
    const rateLimitRef = db.collection("rateLimits").doc(`${userId}_${operation}`);
    const rateLimitDoc = await rateLimitRef.get();
    
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = operation === "ai_analysis" ? 10 : 50; // 10 AI requests per minute
    
    if (!rateLimitDoc.exists) {
      await rateLimitRef.set({
        count: 1,
        windowStart: now,
        lastRequest: now
      });
      return true;
    }
    
    const data = rateLimitDoc.data()!;
    const windowStart = data.windowStart;
    
    // Reset window if expired
    if (now - windowStart > windowMs) {
      await rateLimitRef.set({
        count: 1,
        windowStart: now,
        lastRequest: now
      });
      return true;
    }
    
    // Check if within limits
    if (data.count >= maxRequests) {
      return false;
    }
    
    // Increment counter
    await rateLimitRef.update({
      count: admin.firestore.FieldValue.increment(1),
      lastRequest: now
    });
    
    return true;
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // On error, allow the request (fail open for user experience)
    return true;
  }
}