import { doc, getDoc, setDoc, collection,
         query, orderBy, limit, getDocs } from 'firebase/firestore';
import { getFirestoreDb } from '@/services/firebase/firebaseService';
import { generateCompanionText } from '@/services/khepera/service';

// ── ARC REFLECTION — Days 7 and 14 ───────────────────────────────────────────

export async function generateArcReflection(
  userId: string,
  userContainerId: string,
  containerName: string,
  currentDay: number
): Promise<string> {
  const db = getFirestoreDb();
  // Check cache — never show the same arc reflection twice
  const cacheRef = doc(
    db, 'users', userId, 'containers', userContainerId,
    'arcReflections', `day-${currentDay}`
  );
  const cached = await getDoc(cacheRef);
  if (cached.exists()) return cached.data().text;

  // Load emotional tone history from completed sessions in this container
  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('createdAt', 'asc'), limit(20));
  const snap = await getDocs(q);

  const containerSessions = snap.docs
    .filter(d => d.data().containerId === userContainerId)
    .map(d => d.data().emotionalTone ?? 'processing');

  const toneHistory = containerSessions.length > 0
    ? containerSessions.join(', ')
    : 'processing';

  const prompt = `The user has completed sessions inside "${containerName}."
Emotional tones recorded across their sessions: ${toneHistory}.
They are now at day ${currentDay} in this container.

Write 2–3 sentences observing something true about the arc of their
experience so far.

Rules:
- Never reference specific entry content
- Never praise consistency or "showing up"
- Notice what shifted, what remained, what surprised
- Tone: quiet companion who has been present with them
- Never start with "I"
- No platitudes
- Do not exceed 3 sentences`;

  try {
    const response = await generateCompanionText({
      inputTextForSafety: prompt,
      model: 'claude-3-5-haiku-20241022',
      maxTokens: 200,
      system: 'Write calm, non-directive companion text.',
      prompt,
    });

    const text = !response.blockedByCrisis
      ? response.text.trim()
      : getFallbackArcReflection(containerName, currentDay);

    // Cache it — this arc reflection belongs to this day for this user
    await setDoc(cacheRef, { text, generatedAt: new Date().toISOString() });

    return text;
  } catch {
    return getFallbackArcReflection(containerName, currentDay);
  }
}

// ── COMPLETION CEREMONY GENERATION ───────────────────────────────────────────

export async function generateCompletionAcknowledgment(
  containerName: string,
  totalDays: number,
  dominantTone: string,
  recurringThemes: string[]
): Promise<string> {
  const themes = recurringThemes.length > 0
    ? recurringThemes.join(', ')
    : 'presence, noticing, inner life';

  const prompt = `The user has completed all ${totalDays} days of "${containerName}."
Their emotional tone across the container: ${dominantTone}.
Recurring themes that surfaced: ${themes}.

Write 3–4 sentences acknowledging this completion.
Reference the texture of what they carried — not specific content.
Do not use the word "proud." Do not say "amazing" or "incredible."
Do not mention consistency or showing up.
Tone: like someone who was quietly present for all of it.
Do not start with "I."`;

  try {
    const response = await generateCompanionText({
      inputTextForSafety: prompt,
      model: 'claude-3-5-haiku-20241022',
      maxTokens: 250,
      system: 'Write calm, non-directive companion text.',
      prompt,
    });

    return !response.blockedByCrisis
      ? response.text.trim()
      : getFallbackCompletion(containerName);
  } catch {
    return getFallbackCompletion(containerName);
  }
}

export async function generateClosingSeed(
  containerName: string
): Promise<string> {
  const prompt = `Generate a single closing observation or question for someone
who has just finished "${containerName}."

It should feel like something to carry into the next season,
not a summary of what they did.
It should be open, not resolved.
15–25 words maximum.
Do not start with "I."`;

  try {
    const response = await generateCompanionText({
      inputTextForSafety: prompt,
      model: 'claude-3-5-haiku-20241022',
      maxTokens: 80,
      system: 'Write calm, non-directive companion text.',
      prompt,
    });

    return !response.blockedByCrisis
      ? response.text.trim()
      : 'What has changed in how you see yourself?';
  } catch {
    return 'What has changed in how you see yourself?';
  }
}

// ── FALLBACKS ─────────────────────────────────────────────────────────────────

function getFallbackArcReflection(
  containerName: string,
  day: number
): string {
  const reflections = [
    `Something has shifted in how you're approaching this space. The writing has changed texture.`,
    `Something keeps returning here, though not in exactly the same way each time.`,
    `There is a patient quality in these entries. That remains part of what has been here.`,
  ];
  return reflections[day % reflections.length];
}

function getFallbackCompletion(containerName: string): string {
  return `Something real happened here. What you brought to "${containerName}" — the honesty, the willingness to keep returning — that belongs to you now in a different way than it did before.`;
}
