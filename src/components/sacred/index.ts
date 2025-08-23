// ALCHM Sacred Components - Main Export
// Sacred component library that aligns developer consciousness with healing mission

// Foundation Components
export { SanctuaryShell, CompleteSanctuary } from './SanctuaryShell';
export type { SanctuaryShellProps, CompletesanctuaryProps } from './SanctuaryShell';

// Interaction Components  
export { 
  IntentionGem, 
  HealingGem, 
  GrowthGem, 
  ConnectionGem, 
  WisdomGem, 
  TransformationGem, 
  CelebrationGem 
} from './IntentionGem';
export type { IntentionGemProps } from './IntentionGem';

// Modal & Dialog Components
export { RitualGate, HeartConversation } from './RitualGate';
export type { RitualGateProps, HeartConversationProps } from './RitualGate';

// Form Components
export { 
  SoulCanvas, 
  PrayerCanvas, 
  HeartCanvas, 
  WisdomCanvas, 
  GentleCanvas 
} from './SoulCanvas';
export type { SoulCanvasProps } from './SoulCanvas';

// Journey & Reflection Components
export { ReflectionCard } from './ReflectionCard';
export type { ReflectionCardProps, ReflectionEntry } from './ReflectionCard';

// AI Components
export { KheperaOracle } from './KheperaOracle';
export type { KheperaOracleProps } from './KheperaOracle';

// Sacred Component Name Mapping for Migration
export const SACRED_COMPONENT_MAP = {
  // Foundation
  'Layout': 'SanctuaryShell',
  'Header': 'CrownChakra',
  'Footer': 'GroundingRoots',
  'Sidebar': 'WisdomWing',
  'Modal': 'RitualGate',
  'Dialog': 'HeartConversation',
  
  // Interactive
  'Button': 'IntentionGem',
  'Link': 'BridgeWay',
  'Form': 'OfferingVessel',
  'Input': 'VoiceChannel',
  'Textarea': 'SoulCanvas',
  'Select': 'ChoiceChalice',
  'Checkbox': 'IntentionMark',
  'Radio': 'SacredChoice',
  
  // Content
  'Card': 'WisdomChamber',
  'Panel': 'CeremonyWindow',
  'Section': 'HolyGround',
  'Article': 'SacredScroll',
  'List': 'PrayerBeads',
  'Table': 'WisdomLoom',
  
  // Journey
  'JournalEntry': 'ReflectionCard',
  'Dashboard': 'MemoryGarden',
  'ProgressBar': 'GrowthThread',
  'Timeline': 'SacredSeasons',
  'Calendar': 'MoonCycle',
  
  // Navigation
  'Menu': 'PathwayCompass',
  'Tabs': 'ChapterGateway',
  'Breadcrumbs': 'SacredTrail',
  'Search': 'SoulSeeker',
  'Filter': 'WisdomSieve',
  
  // AI & Intelligence
  'AIInsightPanel': 'KheperaOracle',
  'ChatInterface': 'SoulDialogue',
  'PromptList': 'InvitationChalice',
  'AIToggle': 'WisdomGate',
  
  // Community
  'UserProfile': 'SoulPortrait',
  'CommentSection': 'WitnessingCircle',
  'Feed': 'CommunityRiver',
  'NotificationPanel': 'SacredMessenger',
  'Forum': 'TribalGathering',
  
  // Emotional
  'MoodTracker': 'EmotionalCompass',
  'EmotionalAlchemy': 'HeartTransmutation',
  'CrisisPrevention': 'LifelineBeacon',
  'BreathworkGuide': 'BreathSanctuary',
  'GroundingTechniques': 'EarthAnchor',
  
  // Assessment
  'Assessment': 'SoulInquiry',
  'Quiz': 'WisdomSeeds',
  'Survey': 'HeartSurvey',
  'Feedback': 'MirrorMedicine',
  'Rating': 'SacredWitness'
} as const;

// Helper function to get sacred name from technical name
export function getSacredComponentName(technicalName: string): string {
  return SACRED_COMPONENT_MAP[technicalName as keyof typeof SACRED_COMPONENT_MAP] || technicalName;
}

// Helper function to validate if component follows sacred naming
export function isSacredComponent(componentName: string): boolean {
  return Object.values(SACRED_COMPONENT_MAP).includes(componentName as any) ||
         componentName.match(/^(Sacred|Khepera|Soul|Heart|Wisdom|Growth|Healing|Connection)/);
}

// Sacred component factory for creating new components with proper semantics
export interface SacredComponentConfig {
  technicalFunction: string;
  ritualPurpose: string;
  emotionalContainer: string;
  sacredName: string;
}

export function createSacredComponent(config: SacredComponentConfig) {
  return {
    name: config.sacredName,
    purpose: config.ritualPurpose,
    container: config.emotionalContainer,
    technicalFunction: config.technicalFunction
  };
}

// Sacred naming validation for component development
export function validateSacredNaming(componentName: string): {
  isValid: boolean;
  suggestions: string[];
  reasoning: string;
} {
  const isSacred = isSacredComponent(componentName);
  
  if (isSacred) {
    return {
      isValid: true,
      suggestions: [],
      reasoning: 'Component follows sacred naming conventions'
    };
  }
  
  const suggestions = [];
  const reasoning = 'Component name should evoke ritual purpose and emotional container, not just technical function';
  
  // Generate suggestions based on common technical patterns
  if (componentName.includes('Button')) {
    suggestions.push('IntentionGem', 'WisdomGem', 'HealingGem');
  }
  if (componentName.includes('Modal') || componentName.includes('Dialog')) {
    suggestions.push('RitualGate', 'HeartConversation', 'SacredPortal');
  }
  if (componentName.includes('Input') || componentName.includes('Field')) {
    suggestions.push('VoiceChannel', 'SoulCanvas', 'WisdomVessel');
  }
  if (componentName.includes('Card') || componentName.includes('Panel')) {
    suggestions.push('WisdomChamber', 'CeremonyWindow', 'SacredSpace');
  }
  
  return {
    isValid: false,
    suggestions,
    reasoning
  };
}

export default {
  SanctuaryShell,
  IntentionGem,
  RitualGate,
  SoulCanvas,
  ReflectionCard,
  KheperaOracle,
  getSacredComponentName,
  isSacredComponent,
  validateSacredNaming
};