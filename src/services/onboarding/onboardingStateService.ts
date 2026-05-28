import { STORAGE_KEYS } from '@/config/storageKeys';
import { sanitizeOnboardingDataValue } from '@/services/storage/storageMigrationService';
import { getStorageItemWithFallback, setStorageItemNormalized } from '@/utils/storage';
import type { OnboardingState } from '@/types/onboarding';

const INITIAL_STATE: OnboardingState = {
  currentScreen: 'arrival',
  arrivalReasons: [],
  miniEntryText: '',
  miniEntryResponse: '',
  miniEntrySeed: '',
  selectedContainerId: '',
  notificationPreference: 'none',
  completedAt: null,
  skippedMiniEntry: false,
};

function sanitizePersistedState(state: OnboardingState): OnboardingState {
  return {
    ...state,
    miniEntryText: '',
    miniEntryResponse: '',
    miniEntrySeed: '',
  };
}

export function loadOnboardingState(): OnboardingState {
  try {
    const raw = getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_STATE);
    if (!raw) return INITIAL_STATE;
    const parsed = sanitizePersistedState({ ...INITIAL_STATE, ...JSON.parse(raw) } as OnboardingState);
    if (parsed.currentScreen === 'account_creation') parsed.currentScreen = 'container_selection';
    if (parsed.currentScreen === 'the_origin') parsed.currentScreen = 'meeting_khepera';
    return parsed;
  } catch {
    return INITIAL_STATE;
  }
}

export function saveOnboardingState(state: OnboardingState): void {
  setStorageItemNormalized(STORAGE_KEYS.ONBOARDING_STATE, JSON.stringify(sanitizePersistedState(state)));
}

export function isFirstTimeUser(): boolean {
  return getStorageItemWithFallback(STORAGE_KEYS.ONBOARDING_COMPLETE) !== 'true';
}

export function completeOnboardingState(state: OnboardingState): string {
  const completedAt = new Date().toISOString();
  setStorageItemNormalized(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  setStorageItemNormalized(
    STORAGE_KEYS.ONBOARDING_DATA,
    JSON.stringify(sanitizeOnboardingDataValue({
      arrivalReasons: state.arrivalReasons,
      selectedContainerId: state.selectedContainerId,
      notificationPreference: state.notificationPreference,
      completedAt,
    })),
  );
  return completedAt;
}
