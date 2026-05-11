import { buildKheperaMemorySignal, inferThemeTags, selectContinuityMode } from './memoryProfile';
import { selectStance } from './selectStance';
import { getStyleDefinition } from './styleEngine';
import { adjustStanceForPacing, buildKheperaPacingState } from './timing';
import type {
  KheperaContinuityMode,
  KheperaMemorySignal,
  KheperaStyleProfile,
  KheperaUserContext,
  ReflectionAnalysis,
  ResponseStance,
} from '@/types/khepera';
import type { ThemeTag } from '@/types/journal';

export interface KheperaReflectionPlan {
  currentThemes: ThemeTag[];
  memorySignal: KheperaMemorySignal;
  continuityMode: KheperaContinuityMode;
  stance: ResponseStance;
  styleProfile: KheperaStyleProfile;
  styleDefinition: ReturnType<typeof getStyleDefinition>;
}

export function mapStanceToStyleProfile(stance: ResponseStance): KheperaStyleProfile {
  switch (stance) {
    case 'containing':
      return 'soft_container';
    case 'clarifying':
      return 'gentle_organizer';
    case 'expanding':
    case 'integrating':
      return 'perspective_opener';
    case 'holding_ambiguity':
      return 'open_field';
    case 'witnessing':
    default:
      return 'grounded_witness';
  }
}

export function generateReflection(input: {
  entryText: string;
  analysis: ReflectionAnalysis;
  context?: KheperaUserContext;
  currentThemes?: ThemeTag[];
}): KheperaReflectionPlan {
  const currentThemes = (input.currentThemes?.length ? input.currentThemes : inferThemeTags(input.entryText)).slice(0, 3);
  const memorySignal = buildKheperaMemorySignal({
    currentThemes,
    currentTone: input.analysis.emotionalTone,
    context: input.context,
  });
  const continuityMode = selectContinuityMode({
    currentThemes,
    memorySignal,
    context: input.context,
  });
  const selectedStance = selectStance(input.analysis, {
    memorySignal,
    continuityMode,
  });
  const stance = adjustStanceForPacing(
    selectedStance,
    buildKheperaPacingState(input.context),
    input.analysis,
  );

  return {
    currentThemes,
    memorySignal,
    continuityMode,
    stance,
    styleProfile: mapStanceToStyleProfile(stance),
    styleDefinition: getStyleDefinition(mapStanceToStyleProfile(stance)),
  };
}
