export type ContainerTransitionErrorCode =
  | "unauthenticated"
  | "invalid-argument"
  | "failed-precondition"
  | "unavailable";

export type ServerActivatableContainer = {
  id: string;
  name: string;
  tier: "sanctuary";
  initialDay: 1;
};

export type ContainerActivationPlan = {
  userId: string;
  container: ServerActivatableContainer;
};

export type ContainerAdvancementRequest = {
  userId: string;
  userContainerId: string;
  expectedContinuityVersion: number;
};

export type PersistedContainerContinuityState = {
  userId?: unknown;
  containerId?: unknown;
  tier?: unknown;
  status?: unknown;
  currentDay?: unknown;
  continuityVersion?: unknown;
  transitionVersion?: unknown;
};

export type PersistedActiveContainerPointer = {
  userId?: unknown;
  userContainerId?: unknown;
  status?: unknown;
  continuityVersion?: unknown;
  transitionVersion?: unknown;
};

export type ContainerAdvancementPlan = {
  userId: string;
  userContainerId: string;
  currentDay: number;
  nextDay: number;
  previousContinuityVersion: number;
  continuityVersion: number;
  previousTransitionVersion: number;
  transitionVersion: number;
};

const ACTIVATABLE_SANCTUARY_CONTAINERS: Readonly<Record<string, ServerActivatableContainer>> = {
  "seven-days-of-noticing": {
    id: "seven-days-of-noticing",
    name: "Seven Days of Noticing",
    tier: "sanctuary",
    initialDay: 1,
  },
  grief: {
    id: "grief",
    name: "Grief",
    tier: "sanctuary",
    initialDay: 1,
  },
  identity: {
    id: "identity",
    name: "Identity",
    tier: "sanctuary",
    initialDay: 1,
  },
};

const SANCTUARY_CONTAINER_DAY_LIMITS: Readonly<Record<string, number>> = {
  "seven-days-of-noticing": 7,
  grief: 21,
  identity: 21,
};

export class ContainerTransitionError extends Error {
  constructor(
    readonly code: ContainerTransitionErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ContainerTransitionError";
  }
}

export function planContainerActivation(
  data: unknown,
  authenticatedUserId: string | undefined,
): ContainerActivationPlan {
  if (!authenticatedUserId) {
    throw new ContainerTransitionError("unauthenticated", "User must be authenticated");
  }

  if (typeof data !== "object" || data === null || !("containerId" in data)) {
    throw new ContainerTransitionError("invalid-argument", "containerId is required");
  }

  const containerId = (data as { containerId: unknown }).containerId;
  if (typeof containerId !== "string" || containerId.length > 80) {
    throw new ContainerTransitionError("invalid-argument", "containerId is invalid");
  }

  const container = ACTIVATABLE_SANCTUARY_CONTAINERS[containerId];
  if (!container) {
    throw new ContainerTransitionError(
      "failed-precondition",
      "This container cannot be activated through the verified continuity boundary",
    );
  }

  return {
    userId: authenticatedUserId,
    container,
  };
}

export function parseContainerAdvancementRequest(
  data: unknown,
  authenticatedUserId: string | undefined,
): ContainerAdvancementRequest {
  if (!authenticatedUserId) {
    throw new ContainerTransitionError("unauthenticated", "User must be authenticated");
  }

  if (typeof data !== "object" || data === null) {
    throw new ContainerTransitionError("invalid-argument", "Advancement input is required");
  }

  const requestData = data as {
    userContainerId?: unknown;
    expectedContinuityVersion?: unknown;
  };
  if (
    typeof requestData.userContainerId !== "string"
    || requestData.userContainerId.length === 0
    || requestData.userContainerId.length > 128
  ) {
    throw new ContainerTransitionError("invalid-argument", "userContainerId is invalid");
  }
  if (
    !Number.isInteger(requestData.expectedContinuityVersion)
    || (requestData.expectedContinuityVersion as number) < 1
  ) {
    throw new ContainerTransitionError("invalid-argument", "expectedContinuityVersion is invalid");
  }

  return {
    userId: authenticatedUserId,
    userContainerId: requestData.userContainerId,
    expectedContinuityVersion: requestData.expectedContinuityVersion as number,
  };
}

export function planSanctuaryAdvancement(
  request: ContainerAdvancementRequest,
  state: PersistedContainerContinuityState,
): ContainerAdvancementPlan {
  const maximumDay = typeof state.containerId === "string"
    ? SANCTUARY_CONTAINER_DAY_LIMITS[state.containerId]
    : undefined;
  if (
    state.userId !== request.userId
    || state.tier !== "sanctuary"
    || state.status !== "active"
    || maximumDay === undefined
  ) {
    throw new ContainerTransitionError(
      "failed-precondition",
      "This container is not eligible for verified sanctuary advancement",
    );
  }
  if (
    !Number.isInteger(state.currentDay)
    || !Number.isInteger(state.continuityVersion)
    || !Number.isInteger(state.transitionVersion)
  ) {
    throw new ContainerTransitionError("failed-precondition", "Continuity state is incomplete");
  }

  const currentDay = state.currentDay as number;
  const continuityVersion = state.continuityVersion as number;
  const transitionVersion = state.transitionVersion as number;
  if (continuityVersion !== request.expectedContinuityVersion) {
    throw new ContainerTransitionError(
      "failed-precondition",
      "Continuity state has changed; refresh before requesting this transition",
    );
  }
  if (currentDay < 1 || currentDay >= maximumDay) {
    throw new ContainerTransitionError(
      "failed-precondition",
      "This sanctuary container cannot advance further",
    );
  }

  return {
    userId: request.userId,
    userContainerId: request.userContainerId,
    currentDay,
    nextDay: currentDay + 1,
    previousContinuityVersion: continuityVersion,
    continuityVersion: continuityVersion + 1,
    previousTransitionVersion: transitionVersion,
    transitionVersion: transitionVersion + 1,
  };
}

export function assertActivePointerForAdvancement(
  request: ContainerAdvancementRequest,
  pointer: PersistedActiveContainerPointer,
  containerState: PersistedContainerContinuityState,
): void {
  if (
    pointer.userId !== request.userId
    || pointer.userContainerId !== request.userContainerId
    || pointer.status !== "active"
    || pointer.continuityVersion !== request.expectedContinuityVersion
    || pointer.transitionVersion !== containerState.transitionVersion
  ) {
    throw new ContainerTransitionError(
      "failed-precondition",
      "The active continuity pointer does not match this transition",
    );
  }
}
