const test = require('node:test');
const assert = require('node:assert/strict');
const {
  evaluateKheperaRateLimit,
  handleKheperaGenerationRequest,
  KheperaGatewayError,
} = require('../lib/functions/src/kheperaGatewayCore.js');

const safeResponse = {
  witness: 'The happiness is tied to the app working now.',
  perspective: 'Relief sits close to the fact that something finally functions.',
  seed: 'What feels most alive in the app working now?',
};

function createDependencies(response = safeResponse) {
  const calls = { rateLimit: 0, provider: 0, persistence: [] };
  return {
    calls,
    dependencies: {
      consumeRateLimit: async () => {
        calls.rateLimit += 1;
      },
      requestReflection: async () => {
        calls.provider += 1;
        return response;
      },
      persistGeneratedSession: async (userId, entryText, generatedResponse, session) => {
        calls.persistence.push({ userId, entryText, generatedResponse, session });
      },
    },
  };
}

test('unauthenticated gateway access fails before provider invocation', async () => {
  const { calls, dependencies } = createDependencies();

  await assert.rejects(
    handleKheperaGenerationRequest({ entryText: 'I am writing here.' }, undefined, dependencies),
    (error) => error instanceof KheperaGatewayError && error.code === 'unauthenticated',
  );
  assert.equal(calls.provider, 0);
});

test('crisis content is blocked before rate limiting or provider invocation', async () => {
  const { calls, dependencies } = createDependencies();
  const result = await handleKheperaGenerationRequest(
    { entryText: 'I want to kill myself tonight.' },
    'user-1',
    dependencies,
  );

  assert.deepEqual(result, { blockedByCrisis: true, response: null, sessionId: null });
  assert.equal(calls.rateLimit, 0);
  assert.equal(calls.provider, 0);
});

test('malformed or directive model output is rejected', async () => {
  const malformed = createDependencies({ witness: 'Only one section.' });
  await assert.rejects(
    handleKheperaGenerationRequest({ entryText: 'A normal entry here.' }, 'user-1', malformed.dependencies),
    (error) => error instanceof KheperaGatewayError && error.code === 'failed-precondition',
  );

  const directive = createDependencies({
    witness: 'There is strain in this moment.',
    perspective: 'You should make a plan for tomorrow.',
    seed: 'What will you do next?',
  });
  await assert.rejects(
    handleKheperaGenerationRequest({ entryText: 'A normal entry here.' }, 'user-1', directive.dependencies),
    (error) => error instanceof KheperaGatewayError && error.code === 'failed-precondition',
  );
});

test('valid structured reflection is returned after rate limiting', async () => {
  const { calls, dependencies } = createDependencies();
  const result = await handleKheperaGenerationRequest(
    { entryText: 'I am noticing relief as this finally works.' },
    'user-1',
    dependencies,
  );

  assert.deepEqual(result, { blockedByCrisis: false, response: safeResponse, sessionId: null });
  assert.equal(calls.rateLimit, 1);
  assert.equal(calls.provider, 1);
});

test('authenticated canonical session persistence uses authenticated ownership after validation', async () => {
  const { calls, dependencies } = createDependencies();
  const session = {
    sessionId: 'session_12345678',
    writtenAt: '2026-05-26T12:00:00.000Z',
    reflectionTiming: 'immediate',
  };
  const result = await handleKheperaGenerationRequest(
    { entryText: 'I am noticing relief as this finally works.', session },
    'authenticated-user',
    dependencies,
  );

  assert.equal(result.sessionId, session.sessionId);
  assert.deepEqual(calls.persistence, [{
    userId: 'authenticated-user',
    entryText: 'I am noticing relief as this finally works.',
    generatedResponse: safeResponse,
    session,
  }]);
});

test('crisis content never persists a canonical generated session', async () => {
  const { calls, dependencies } = createDependencies();
  await handleKheperaGenerationRequest(
    {
      entryText: 'I want to kill myself tonight.',
      session: {
        sessionId: 'session_12345678',
        writtenAt: '2026-05-26T12:00:00.000Z',
        reflectionTiming: 'immediate',
      },
    },
    'authenticated-user',
    dependencies,
  );

  assert.equal(calls.persistence.length, 0);
});

test('rate limit permits bounded requests, rejects excess, and resets in a new window', () => {
  const windowMs = 60_000;
  const maxRequests = 6;
  const startedAt = 1_000;
  let state;

  for (let attempt = 0; attempt < maxRequests; attempt += 1) {
    const decision = evaluateKheperaRateLimit(state, startedAt + attempt, windowMs, maxRequests);
    assert.equal(decision.allowed, true);
    if (decision.allowed) {
      state = decision.state;
    }
  }

  assert.deepEqual(evaluateKheperaRateLimit(state, startedAt + 7, windowMs, maxRequests), { allowed: false });
  assert.deepEqual(
    evaluateKheperaRateLimit(state, startedAt + windowMs, windowMs, maxRequests),
    { allowed: true, state: { count: 1, windowStart: startedAt + windowMs, lastRequest: startedAt + windowMs } },
  );
});

test('rate-limit authorization failures fail closed before provider invocation', async () => {
  let providerCalls = 0;

  await assert.rejects(
    handleKheperaGenerationRequest(
      { entryText: 'A normal entry here.' },
      'user-1',
      {
        consumeRateLimit: async () => {
          throw new KheperaGatewayError('unavailable', 'Rate limit state is unavailable');
        },
        requestReflection: async () => {
          providerCalls += 1;
          return safeResponse;
        },
      },
    ),
    (error) => error instanceof KheperaGatewayError && error.code === 'unavailable',
  );

  assert.equal(providerCalls, 0);
});
