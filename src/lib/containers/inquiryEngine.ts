import type {
  ContainerContext,
  ContainerInquiry,
  ContainerInquiryDomain,
  ContainerRelationshipState,
} from './types';

const DEFAULT_INQUIRIES: Record<ContainerInquiryDomain, string> = {
  need: 'What do I need right now?',
  carrying: 'What am I carrying that no longer belongs to me?',
  becoming: 'What am I becoming?',
  belonging: 'Where does belonging feel possible, even faintly?',
  boundary: 'What is asking for a boundary without needing to be defended?',
  rest: 'What kind of rest feels honest right now?',
  trust: 'What would self-trust sound like here?',
  selfWorth: 'What part of me is asking not to be measured?',
};

const REENTRY_STATE_SET = new Set<ContainerRelationshipState>(['returning', 'revisiting', 'resting']);

export function createInitialInquiries(
  context: ContainerContext,
  nowIso = new Date().toISOString(),
): ContainerInquiry[] {
  return context.inquiryDomains.slice(0, 3).map((domain) => ({
    id: `${context.id}:${domain}`,
    containerId: context.id,
    text: DEFAULT_INQUIRIES[domain],
    domain,
    state: 'recurring',
    emergedAt: nowIso,
    confidence: 'moderate',
  }));
}

export function evolveInquiry(
  inquiry: ContainerInquiry,
  relationshipState: ContainerRelationshipState,
  movementHint?: 'softening' | 'integration' | 'emergence',
  nowIso = new Date().toISOString(),
): ContainerInquiry {
  if (REENTRY_STATE_SET.has(relationshipState)) {
    return {
      ...inquiry,
      state: 'unresolved',
      lastTouchedAt: nowIso,
    };
  }

  if (movementHint === 'integration') {
    return {
      ...inquiry,
      state: 'integrating',
      lastTouchedAt: nowIso,
      confidence: 'high',
    };
  }

  if (movementHint === 'emergence') {
    return {
      ...inquiry,
      state: 'changing',
      lastTouchedAt: nowIso,
    };
  }

  return {
    ...inquiry,
    state: relationshipState === 'deepening' ? 'deepening' : inquiry.state,
    lastTouchedAt: nowIso,
  };
}
