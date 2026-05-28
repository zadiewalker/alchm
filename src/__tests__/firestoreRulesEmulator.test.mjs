import test, { after, before, beforeEach } from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const projectId = 'alchm-firestore-rules-test';
const rules = fs.readFileSync(path.join(repo, 'firestore.rules'), 'utf8');
let testEnv;

before(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv?.cleanup();
});

function userDb(userId) {
  return testEnv.authenticatedContext(userId).firestore();
}

test('unauthenticated access to sensitive user data is denied', async () => {
  const guestDb = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(guestDb, 'users/owner/sessions/session-1')));
  await assertFails(setDoc(doc(guestDb, 'users/owner/khepera/memory'), {
    themeTags: [],
    emotionalTone: 'processing',
  }));
});

test('session records are owner-readable but client writes are denied', async () => {
  const ownerSession = doc(userDb('owner'), 'users/owner/sessions/session-1');
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users/owner/sessions/session-1'), {
      userId: 'owner',
      entryText: 'Writing held by its owner.',
      kheperaResponse: 'A witness.\n\nA perspective.',
      seed: 'What feels present here?',
      generatedBy: 'server',
    });
  });

  await assertSucceeds(getDoc(ownerSession));
  await assertFails(getDoc(doc(userDb('other'), 'users/owner/sessions/session-1')));
  await assertFails(updateDoc(ownerSession, { userId: 'other' }));
  await assertFails(setDoc(doc(userDb('owner'), 'users/owner/sessions/session-2'), {
    userId: 'owner',
    entryText: 'Client-generated reflection.',
    kheperaResponse: 'Forged output.',
    seed: 'What feels present?',
    isCrisis: false,
  }));
});

test('Khepera memory is readable by its owner but writable only through server authority', async () => {
  const memory = doc(userDb('owner'), 'users/owner/khepera/memory');
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users/owner/khepera/memory'), {
      themeTags: ['rest_recovery'],
      emotionalTone: 'tenderness',
      derivedBy: 'server',
    });
  });

  await assertSucceeds(getDoc(memory));
  await assertFails(setDoc(memory, {
    themeTags: ['rest_recovery'],
    emotionalTone: 'tenderness',
  }));
  await assertFails(setDoc(memory, {
    themeTags: ['rest_recovery'],
    emotionalTone: 'tenderness',
    entryText: 'Raw writing must not enter memory.',
  }));
  await assertFails(setDoc(doc(userDb('owner'), 'users/owner/khepera/other'), {
    themeTags: [],
    emotionalTone: 'processing',
  }));
});

test('delayed reflections and container continuity mutations are server-write only', async () => {
  const delayed = doc(userDb('owner'), 'users/owner/kheperaDelayedReflections/reflection-1');
  const container = doc(userDb('owner'), 'users/owner/containers/container-1');
  const active = doc(userDb('owner'), 'users/owner/containerState/active');

  await assertFails(setDoc(delayed, {
    entryId: 'session-1',
    emotionalTone: 'processing',
    themeTags: [],
    scheduledAt: new Date(),
    status: 'pending',
    createdAt: new Date(),
  }));
  await assertFails(setDoc(container, {
    userId: 'owner',
    containerId: 'grounding',
    containerName: 'Grounding',
    tier: 'sanctuary',
    status: 'active',
    startedAt: new Date(),
    currentDay: 1,
    sessionIds: [],
    completionCeremonyViewed: false,
  }));
  await assertFails(setDoc(active, {
    userContainerId: 'container-1',
    status: 'active',
  }));

  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'users/owner/containers/server-container'), {
      userId: 'owner',
      containerId: 'seven-days-of-noticing',
      containerName: 'Seven Days of Noticing',
      tier: 'sanctuary',
      status: 'active',
      startedAt: new Date(),
      currentDay: 1,
      sessionIds: [],
      completionCeremonyViewed: false,
      transitionedBy: 'server',
      transitionSource: 'activateContainer',
      schemaVersion: 1,
      transitionVersion: 1,
      continuityVersion: 1,
      validatedAt: new Date(),
    });
    await setDoc(doc(context.firestore(), 'users/owner/containerState/active'), {
      userId: 'owner',
      userContainerId: 'server-container',
      status: 'active',
      transitionedBy: 'server',
      transitionSource: 'activateContainer',
      schemaVersion: 1,
      transitionVersion: 1,
      continuityVersion: 1,
      validatedAt: new Date(),
    });
  });
  await assertSucceeds(getDoc(doc(userDb('owner'), 'users/owner/containers/server-container')));
  await assertFails(updateDoc(doc(userDb('owner'), 'users/owner/containers/server-container'), { currentDay: 2 }));
  await assertFails(updateDoc(doc(userDb('owner'), 'users/owner/containerState/active'), { continuityVersion: 2 }));
  await assertFails(getDoc(doc(userDb('other'), 'users/owner/kheperaDelayedReflections/reflection-1')));
  await assertFails(updateDoc(doc(userDb('other'), 'users/owner/containers/container-1'), { status: 'completed' }));
  await assertFails(getDoc(doc(userDb('other'), 'users/owner/containerState/active')));
});

test('profile access remains owner-only even for crisis-authorized administrators', async () => {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'adminUsers/admin'), {
      verified: true,
      permissions: ['view_crisis_events'],
    });
    await setDoc(doc(context.firestore(), 'users/owner'), { marker: 'private' });
    await setDoc(doc(context.firestore(), 'users/owner/profile/main'), { locale: 'en' });
    await setDoc(doc(context.firestore(), 'crisisEvents/event-1'), { state: 'open' });
  });

  await assertSucceeds(getDoc(doc(userDb('owner'), 'users/owner/profile/main')));
  await assertFails(getDoc(doc(userDb('other'), 'users/owner/profile/main')));
  await assertSucceeds(getDoc(doc(userDb('admin'), 'crisisEvents/event-1')));
  await assertFails(getDoc(doc(userDb('admin'), 'users/owner')));
});

test('unsupported support persistence and unmatched collections are denied', async () => {
  await assertFails(setDoc(doc(userDb('owner'), 'support_tickets/ticket-1'), {
    userId: 'owner',
    message: 'A support request.',
  }));
  await assertFails(setDoc(doc(userDb('owner'), 'users/owner/unapproved/item'), {
    value: true,
  }));
});
