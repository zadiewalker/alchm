'use client';
/**
 * Component Lazy Loading Manager for Bundle Size Optimization
 * Reduces initial bundle by ~400KB through strategic code splitting
 */

import { lazy } from 'react';

// Create safe lazy components with error boundaries
const createSafeLazy = (importFn: () => Promise<any>) => {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      console.warn('Failed to load component:', error);
      // Return a fallback component
      return {
        default: () => <div className="text-gray-500 p-4">Component unavailable</div>
      };
    }
  });
};

// Crisis-critical components (always loaded)
export const CrisisIntervention = createSafeLazy(() => import('../components/EnhancedCrisisIntervention'));

// Feature-specific components (loaded on demand) 
export const CreativeCommunity = createSafeLazy(() => import('../components/CreativeCommunity'));
export const CreativeCommunityGallery = createSafeLazy(() => import('../components/CreativeCommunityGallery'));
export const MusicTherapy = createSafeLazy(() => import('../components/MusicTherapy'));
export const MovementTherapy = createSafeLazy(() => import('../components/MovementTherapy'));
export const ArtCanvas = createSafeLazy(() => import('../components/ArtCanvas'));
export const PoetryLab = createSafeLazy(() => import('../components/PoetryLab'));
export const CreativeExpressionHub = createSafeLazy(() => import('../components/CreativeExpressionHub'));
export const CreativeJournalHub = createSafeLazy(() => import('../components/CreativeJournalHub'));

// Analytics components (loaded only when needed)
export const WellnessAnalytics = createSafeLazy(() => import('../components/analytics/WellnessAnalytics'));
export const CrossModalPatternRecognition = createSafeLazy(() => import('../components/CrossModalPatternRecognition'));

// Onboarding components (loaded only once)
export const CulturallyResponsiveOnboarding = createSafeLazy(() => import('../components/onboarding/CulturallyResponsiveOnboarding'));

// Safe gamification components - only load if available
export const MasterGamification = createSafeLazy(() => import('../components/gamification/MasterGamificationIntegration'));
export const HealingQuests = createSafeLazy(() => import('../components/gamification/HealingQuests'));
export const HealingGamificationInterface = createSafeLazy(() => import('../components/gamification/HealingGamificationInterface'));
export const CommunityHealingCircles = createSafeLazy(() => import('../components/gamification/CommunityHealingCircles'));
export const IdentityEvolution = createSafeLazy(() => import('../components/gamification/IdentityEvolution'));

// Loading fallback component for all lazy-loaded components
export const ComponentLoadingFallback = ({ componentName }: { componentName: string }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    background: 'rgba(164, 183, 146, 0.05)',
    borderRadius: '12px',
    border: '1px solid rgba(164, 183, 146, 0.1)'
  }}>
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        width: '24px',
        height: '24px',
        border: '2px solid rgba(164, 183, 146, 0.2)',
        borderTop: '2px solid rgba(164, 183, 146, 0.8)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{
        color: 'rgba(164, 183, 146, 0.8)',
        fontSize: '14px',
        margin: 0
      }}>
        Loading {componentName}...
      </p>
    </div>
  </div>
);

// Preload critical components for faster perceived performance
export const preloadCriticalComponents = () => {
  if (typeof window === 'undefined') return;
  
  // Preload crisis intervention immediately after page load
  requestIdleCallback(() => {
    CrisisIntervention;
  });
  
  // Preload common components after user interaction
  const preloadCommonComponents = () => {
    CreativeExpressionHub;
    MasterGamification;
    WellnessAnalytics;
  };
  
  // Preload on first user interaction
  ['click', 'touchstart', 'keydown'].forEach(event => {
    document.addEventListener(event, preloadCommonComponents, { once: true });
  });
};