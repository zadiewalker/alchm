#!/usr/bin/env node
/**
 * scripts/seed-pathways.mjs
 * Node 20+ · ESM
 *
 * Usage:
 *   # Recommended (Application Default Credentials)
 *   gcloud config set project alchm-digital-sanctuary
 *   gcloud auth application-default login
 *   node scripts/seed-pathways.mjs
 *
 *   # Optional: seed a single pathway by slug
 *   node scripts/seed-pathways.mjs ikigai
 *
 *   # Optional: use a service-account JSON
 *   export GOOGLE_APPLICATION_CREDENTIALS="$HOME/keys/alchm-digital-sanctuary.json"
 *   node scripts/seed-pathways.mjs
 *
 *   # Or inline JSON (last resort)
 *   node --env-file=.env.local scripts/seed-pathways.mjs
 *   // .env.local: FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}'
 */

import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(__filename, '..');

// ---------- Credential Loader (ADC first, with clear errors) ----------
function loadCredential() {
  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (gac) {
    const p = gac.startsWith('~') ? gac.replace('~', process.env.HOME) : gac;
    if (!existsSync(p)) {
      console.error(
        `❌ GOOGLE_APPLICATION_CREDENTIALS points to a missing file:\n   ${p}\n` +
          `Fix: set a real path, or 'unset GOOGLE_APPLICATION_CREDENTIALS' and use ADC (gcloud auth application-default login).`,
      );
      process.exit(1);
    }
    return applicationDefault();
  }

  const inline = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (inline && inline.trim()) {
    try {
      const raw = inline.trim();
      const json = raw.startsWith('{')
        ? raw
        : readFileSync(resolve(raw), 'utf8');
      return cert(JSON.parse(json));
    } catch (e) {
      console.error(
        '❌ FIREBASE_SERVICE_ACCOUNT is neither valid JSON nor a readable file:\n',
        e.message,
      );
      process.exit(1);
    }
  }

  // Default: ADC (works with gcloud application-default login)
  return applicationDefault();
}

// ---------- Project ----------
const projectId =
  process.env.FIREBASE_PROJECT_ID ||
  process.env.GCLOUD_PROJECT ||
  process.env.GOOGLE_CLOUD_PROJECT ||
  'alchm-digital-sanctuary';

// ---------- Initialize Admin ----------
initializeApp({ credential: loadCredential(), projectId });
const db = getFirestore();

// ---------- Full Pathways Catalog (5 total) ----------
const catalog = [
  {
    slug: 'ikigai',
    title: 'Ikigai Discovery: Finding Your Inner Compass',
    audience: 'teens+young_adults',
    active: true,
    days: {
      1: {
        title: 'Values Mapping',
        prompt: 'List 5 values you care about. Pick 2 you’d never trade.',
        estMinutes: 6,
      },
      2: {
        title: 'Joy Moments Inventory',
        prompt:
          'Recall 3 moments of genuine joy. What were you doing, with whom?',
        estMinutes: 6,
      },
      3: {
        title: 'Strengths Assessment',
        prompt: 'What do others ask you for help with? Note 3 strengths.',
        estMinutes: 6,
      },
      4: {
        title: 'The World’s Needs',
        prompt:
          'Name one problem in your world that pulls your attention. Why you?',
        estMinutes: 6,
      },
      5: {
        title: 'Synthesis I',
        prompt:
          'Connect a value + strength to that need. What tiny action could help?',
        estMinutes: 7,
      },
      6: {
        title: 'Synthesis II (Value Exchange)',
        prompt:
          'How might your effort create value for others (time, care, insight)?',
        estMinutes: 7,
      },
      7: {
        title: 'Ikigai Declaration',
        prompt: 'Draft a 1–2 sentence purpose line. Read it aloud.',
        estMinutes: 5,
      },
    },
  },
  {
    slug: 'alchemy',
    title: 'Alchemy: Transforming Pain',
    audience: 'adults',
    active: true,
    days: {
      1: {
        title: 'Naming the Weight',
        prompt:
          'Name the emotion you’ve avoided. Describe it without judgment.',
        safetyTag: 'heavy',
        estMinutes: 5,
      },
      2: {
        title: 'Somatic Scan',
        prompt:
          'Where does it live in your body? Describe sensation, size, texture.',
        safetyTag: 'heavy',
        estMinutes: 5,
      },
      3: {
        title: 'Message in the Emotion',
        prompt: 'If this feeling had a voice, what is it asking for?',
        safetyTag: 'heavy',
        estMinutes: 6,
      },
      4: {
        title: 'Small Release',
        prompt:
          'Choose one small physical action to honor the message. What happened?',
        estMinutes: 6,
      },
      5: {
        title: 'Acknowledging Resilience',
        prompt:
          'Recall a time you carried a feeling like this and made it through.',
        estMinutes: 5,
      },
      6: {
        title: 'Pattern Recognition',
        prompt:
          'Notice any recurring triggers or contexts. What patterns appear?',
        estMinutes: 6,
      },
      7: {
        title: 'Integration',
        prompt:
          'What wisdom are you carrying forward? Write one boundary or practice.',
        estMinutes: 6,
      },
    },
  },
  {
    slug: 'future-vision',
    title: 'Future Vision: Designing Your Tomorrow',
    audience: 'all',
    active: true,
    days: {
      1: {
        title: 'Future Letter',
        prompt:
          'Write a note from your future self describing a day you want to live.',
        estMinutes: 7,
      },
      2: {
        title: 'Obstacle as the Way',
        prompt:
          'Name the #1 inner obstacle. What belief would you replace it with?',
        estMinutes: 6,
      },
      3: {
        title: 'First Step (72h)',
        prompt:
          'Pick one concrete action within 72h. When and how will you do it?',
        estMinutes: 5,
      },
    },
  },
  {
    slug: 'relationship-reset',
    title: 'Relationship Reset: Building Trust & Connection',
    audience: 'all',
    active: true,
    days: {
      1: {
        title: 'Mirror Reflection',
        prompt:
          'Recall a moment you felt seen or unseen. What made the difference?',
        estMinutes: 6,
      },
      2: {
        title: 'Naming a Boundary',
        prompt:
          'Choose a boundary to set (emotional/physical/digital). Draft the words.',
        estMinutes: 6,
      },
      3: {
        title: 'I Feel Statement',
        prompt:
          'Write an “I feel… when… because… I need…” message for a real moment.',
        estMinutes: 6,
      },
      4: {
        title: 'Generous Assumption',
        prompt:
          'Reframe a recent conflict with a generous assumption. What shifts?',
        estMinutes: 5,
      },
      5: {
        title: 'Act of Appreciation',
        prompt: 'Plan one specific appreciation you’ll do this week. Why them?',
        estMinutes: 5,
      },
    },
  },
  {
    slug: 'identity',
    title: 'Identity: Discovering Self',
    audience: 'all_ages',
    active: true,
    days: {
      1: {
        title: 'Story of Your Name',
        prompt:
          'What’s the story or meaning of your name? How do you feel about it?',
        estMinutes: 5,
      },
      2: {
        title: 'Heritage Story',
        prompt: 'Share a family tradition/story/recipe that shaped you.',
        estMinutes: 5,
      },
      3: {
        title: 'Where You Belong',
        prompt: 'Describe a place or group where you feel most authentic. Why?',
        estMinutes: 5,
      },
      4: {
        title: 'Inherited Values',
        prompt:
          'Which inherited values do you keep, and which do you question?',
        estMinutes: 6,
      },
      5: {
        title: 'Deconstruct Stereotypes',
        prompt:
          'Note a stereotype you’ve met; contrast it with your lived truth.',
        estMinutes: 6,
      },
      6: {
        title: 'Intersections',
        prompt: 'List identity facets that shape you together.',
        estMinutes: 5,
      },
      7: {
        title: 'I Am From…',
        prompt: 'Write a short “I am from…” poem that feels like you.',
        estMinutes: 7,
      },
    },
  },
];

// ---------- Seed Logic ----------
async function seed({ onlySlug } = {}) {
  const now = FieldValue.serverTimestamp();
  const paths = onlySlug ? catalog.filter((p) => p.slug === onlySlug) : catalog;

  if (paths.length === 0) {
    console.error(`❌ No pathway found for slug "${onlySlug}".`);
    process.exit(1);
  }

  const batch = db.batch();
  let writeCount = 0;

  for (const p of paths) {
    const ref = db.collection('pathways').doc(p.slug);
    const stepCount = Object.keys(p.days).length;

    batch.set(
      ref,
      {
        slug: p.slug,
        title: p.title,
        audience: p.audience,
        active: p.active ?? true,
        days: stepCount,
        createdAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
    writeCount++;

    for (const [day, step] of Object.entries(p.days)) {
      const sref = ref.collection('steps').doc(String(day));
      batch.set(
        sref,
        {
          day: Number(day),
          title: step.title,
          summary: step.summary ?? '',
          prompt: step.prompt,
          estMinutes: step.estMinutes ?? 5,
          safetyTag: step.safetyTag ?? null,
          updatedAt: now,
        },
        { merge: true },
      );
      writeCount++;
    }
  }

  await batch.commit();
  console.log(
    `✅ Seeded ${paths.length} pathway${
      paths.length > 1 ? 's' : ''
    } (${writeCount} writes) into ${projectId}`,
  );
}

// ---------- Run ----------
const onlySlug = process.argv[2]; // optional filter
seed({ onlySlug }).catch((e) => {
  console.error('❌ Seeding failed:', e?.message || e);
  process.exit(1);
});
