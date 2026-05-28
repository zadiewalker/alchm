const test = require("node:test");
const assert = require("node:assert/strict");
const {
  assertActivePointerForAdvancement,
  ContainerTransitionError,
  parseContainerAdvancementRequest,
  planContainerActivation,
  planSanctuaryAdvancement,
} = require("../lib/functions/src/containerTransitionsCore.js");

test("container activation requires authenticated authority", () => {
  assert.throws(
    () => planContainerActivation({ containerId: "seven-days-of-noticing" }, undefined),
    (error) => error instanceof ContainerTransitionError && error.code === "unauthenticated",
  );
});

test("only approved sanctuary activation is admitted by the continuity boundary", () => {
  assert.deepEqual(
    planContainerActivation({ containerId: "seven-days-of-noticing" }, "user-1"),
    {
      userId: "user-1",
      container: {
        id: "seven-days-of-noticing",
        name: "Seven Days of Noticing",
        tier: "sanctuary",
        initialDay: 1,
      },
    },
  );

  assert.throws(
    () => planContainerActivation({ containerId: "sitting-with-anxiety" }, "user-1"),
    (error) => error instanceof ContainerTransitionError && error.code === "failed-precondition",
  );
});

test("container activation rejects unrecognized input", () => {
  assert.throws(
    () => planContainerActivation({ containerId: "unknown" }, "user-1"),
    (error) => error instanceof ContainerTransitionError && error.code === "failed-precondition",
  );
  assert.throws(
    () => planContainerActivation({}, "user-1"),
    (error) => error instanceof ContainerTransitionError && error.code === "invalid-argument",
  );
});

test("sanctuary advancement uses authenticated ownership and increments continuity monotonically", () => {
  const request = parseContainerAdvancementRequest({
    userContainerId: "container-1",
    expectedContinuityVersion: 1,
  }, "user-1");

  assert.deepEqual(
    planSanctuaryAdvancement(request, {
      userId: "user-1",
      containerId: "seven-days-of-noticing",
      tier: "sanctuary",
      status: "active",
      currentDay: 1,
      continuityVersion: 1,
      transitionVersion: 1,
    }),
    {
      userId: "user-1",
      userContainerId: "container-1",
      currentDay: 1,
      nextDay: 2,
      previousContinuityVersion: 1,
      continuityVersion: 2,
      previousTransitionVersion: 1,
      transitionVersion: 2,
    },
  );
});

test("sanctuary advancement rejects stale replay, terminal state, and transformation state", () => {
  const request = parseContainerAdvancementRequest({
    userContainerId: "container-1",
    expectedContinuityVersion: 1,
  }, "user-1");

  assert.throws(
    () => planSanctuaryAdvancement(request, {
      userId: "user-1",
      containerId: "seven-days-of-noticing",
      tier: "sanctuary",
      status: "active",
      currentDay: 2,
      continuityVersion: 2,
      transitionVersion: 2,
    }),
    (error) => error instanceof ContainerTransitionError && error.code === "failed-precondition",
  );
  assert.throws(
    () => planSanctuaryAdvancement(request, {
      userId: "user-1",
      containerId: "seven-days-of-noticing",
      tier: "sanctuary",
      status: "active",
      currentDay: 7,
      continuityVersion: 1,
      transitionVersion: 1,
    }),
    (error) => error instanceof ContainerTransitionError && error.code === "failed-precondition",
  );
  assert.throws(
    () => planSanctuaryAdvancement(request, {
      userId: "user-1",
      containerId: "sitting-with-anxiety",
      tier: "transformation",
      status: "active",
      currentDay: 1,
      continuityVersion: 1,
      transitionVersion: 1,
    }),
    (error) => error instanceof ContainerTransitionError && error.code === "failed-precondition",
  );
});

test("sanctuary advancement rejects divergent active pointer provenance", () => {
  const request = parseContainerAdvancementRequest({
    userContainerId: "container-1",
    expectedContinuityVersion: 2,
  }, "user-1");
  const containerState = {
    userId: "user-1",
    containerId: "seven-days-of-noticing",
    tier: "sanctuary",
    status: "active",
    currentDay: 2,
    continuityVersion: 2,
    transitionVersion: 2,
  };

  assert.doesNotThrow(() => assertActivePointerForAdvancement(request, {
    userId: "user-1",
    userContainerId: "container-1",
    status: "active",
    continuityVersion: 2,
    transitionVersion: 2,
  }, containerState));

  assert.throws(
    () => assertActivePointerForAdvancement(request, {
      userId: "user-1",
      userContainerId: "container-1",
      status: "active",
      continuityVersion: 2,
      transitionVersion: 1,
    }, containerState),
    (error) => error instanceof ContainerTransitionError && error.code === "failed-precondition",
  );
});
