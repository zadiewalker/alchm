// ALCHM Sacred Motion System
// JavaScript utilities for trauma-informed motion and transitions
// Designed to complement the CSS motion tokens with programmatic control

export interface SacredMotionConfig {
  respectsReducedMotion: boolean;
  culturalPacing: 'contemplative' | 'responsive' | 'ceremonial';
  nervousSystemState: 'regulated' | 'activated' | 'dorsal';
  accessibilityLevel: 'standard' | 'high_contrast' | 'minimal_motion';
}

export interface MotionTiming {
  hover: number;
  fade: number;
  page: number;
  confirmation: number;
  focus: number;
  load: number;
  breath: number;
  ceremony: number;
}

export interface EasingCurves {
  sacredFlow: string;
  healingBreath: string;
  contemplation: string;
  presence: string;
  ceremony: string;
  gentleness: string;
}

// ===== MOTION CONFIGURATION SYSTEM =====

export class SacredMotionManager {
  private config: SacredMotionConfig;
  private timings: MotionTiming;
  private easings: EasingCurves;
  private observer: IntersectionObserver | null = null;

  constructor(config: Partial<SacredMotionConfig> = {}) {
    this.config = {
      respectsReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      culturalPacing: 'responsive',
      nervousSystemState: 'regulated',
      accessibilityLevel: 'standard',
      ...config
    };

    this.timings = this.calculateTimings();
    this.easings = this.getEasingCurves();
    this.initializeMotionObserver();
  }

  // ===== TIMING CALCULATION =====
  
  private calculateTimings(): MotionTiming {
    const baseTimings = {
      hover: 150,
      fade: 300,
      page: 300,
      confirmation: 400,
      focus: 200,
      load: 600,
      breath: 150,
      ceremony: 1200
    };

    // Adjust based on reduced motion preference
    if (this.config.respectsReducedMotion) {
      return Object.keys(baseTimings).reduce((acc, key) => {
        acc[key as keyof MotionTiming] = 50; // Minimal timing
        return acc;
      }, {} as MotionTiming);
    }

    // Adjust based on cultural pacing
    const pacingMultiplier = {
      contemplative: 1.5,  // Slower, more meditative
      responsive: 1.0,     // Standard timing
      ceremonial: 2.0      // Much slower, reverent timing
    }[this.config.culturalPacing];

    // Adjust based on nervous system state
    const nervousSystemMultiplier = {
      regulated: 1.0,      // Standard timing
      activated: 0.7,      // Faster to not increase anxiety
      dorsal: 1.3          // Slower to support gentle re-engagement
    }[this.config.nervousSystemState];

    const finalMultiplier = pacingMultiplier * nervousSystemMultiplier;

    return Object.keys(baseTimings).reduce((acc, key) => {
      acc[key as keyof MotionTiming] = Math.round(
        baseTimings[key as keyof MotionTiming] * finalMultiplier
      );
      return acc;
    }, {} as MotionTiming);
  }

  private getEasingCurves(): EasingCurves {
    if (this.config.respectsReducedMotion) {
      return {
        sacredFlow: 'linear',
        healingBreath: 'linear',
        contemplation: 'linear',
        presence: 'linear',
        ceremony: 'linear',
        gentleness: 'linear'
      };
    }

    return {
      sacredFlow: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      healingBreath: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      contemplation: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      presence: 'cubic-bezier(0.4, 0.0, 0.6, 1)',
      ceremony: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      gentleness: 'cubic-bezier(0.4, 0.0, 1, 1)'
    };
  }

  // ===== PROGRAMMATIC ANIMATION HELPERS =====

  createSacredTransition(
    element: HTMLElement, 
    property: string, 
    value: string, 
    timing: keyof MotionTiming = 'fade'
  ): Promise<void> {
    return new Promise((resolve) => {
      const duration = this.timings[timing];
      const easing = this.easings.sacredFlow;

      if (this.config.respectsReducedMotion) {
        element.style[property as any] = value;
        resolve();
        return;
      }

      element.style.transition = `${property} ${duration}ms ${easing}`;
      element.style[property as any] = value;

      setTimeout(() => {
        element.style.transition = '';
        resolve();
      }, duration);
    });
  }

  animatePageTransition(
    exitElement: HTMLElement, 
    enterElement: HTMLElement
  ): Promise<void> {
    return new Promise(async (resolve) => {
      const duration = this.timings.page;
      const easing = this.easings.sacredFlow;

      if (this.config.respectsReducedMotion) {
        exitElement.style.display = 'none';
        enterElement.style.display = 'block';
        resolve();
        return;
      }

      // Exit animation
      await this.createSacredTransition(exitElement, 'opacity', '0', 'page');
      exitElement.style.display = 'none';

      // Enter animation
      enterElement.style.opacity = '0';
      enterElement.style.display = 'block';
      await this.createSacredTransition(enterElement, 'opacity', '1', 'page');

      resolve();
    });
  }

  createBreathingAnimation(element: HTMLElement, cycles: number = Infinity): () => void {
    if (this.config.respectsReducedMotion) {
      return () => {}; // No-op for reduced motion
    }

    const breathCycle = 4000; // 4 seconds per breath cycle
    const animation = element.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0.6, transform: 'scale(1.02)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: breathCycle,
      iterations: cycles,
      easing: this.easings.healingBreath
    });

    return () => animation.cancel();
  }

  createGentleGlow(
    element: HTMLElement, 
    color: string = 'rgba(164, 183, 146, 0.3)',
    intensity: 'whisper' | 'breath' | 'gentle' | 'presence' = 'gentle'
  ): () => void {
    if (this.config.respectsReducedMotion) {
      element.style.boxShadow = `0 0 8px ${color}`;
      return () => { element.style.boxShadow = ''; };
    }

    const glowSizes = {
      whisper: '2px',
      breath: '4px', 
      gentle: '8px',
      presence: '12px'
    };

    const maxGlow = glowSizes[intensity];
    const animation = element.animate([
      { boxShadow: `0 0 2px ${color}` },
      { boxShadow: `0 0 ${maxGlow} ${color}` },
      { boxShadow: `0 0 2px ${color}` }
    ], {
      duration: this.timings.confirmation * 2,
      iterations: Infinity,
      easing: this.easings.gentleness
    });

    return () => animation.cancel();
  }

  // ===== SCROLL-LINKED ANIMATIONS =====

  private initializeMotionObserver(): void {
    if (this.config.respectsReducedMotion || typeof IntersectionObserver === 'undefined') {
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;
          
          if (entry.isIntersecting) {
            this.revealElement(element);
          } else {
            this.hideElement(element);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
  }

  observeElement(element: HTMLElement): void {
    if (this.observer) {
      // Set initial state
      element.style.opacity = '0.1';
      element.style.transform = 'translateY(8px)';
      element.style.transition = `opacity ${this.timings.fade}ms ${this.easings.sacredFlow}, transform ${this.timings.fade}ms ${this.easings.sacredFlow}`;
      
      this.observer.observe(element);
    }
  }

  private revealElement(element: HTMLElement): void {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  private hideElement(element: HTMLElement): void {
    if (this.config.nervousSystemState === 'activated') {
      // Don't hide elements for activated nervous system
      return;
    }
    
    element.style.opacity = '0.1';
    element.style.transform = 'translateY(8px)';
  }

  // ===== NERVOUS SYSTEM RESPONSIVE ANIMATIONS =====

  adaptToNervousSystemState(state: SacredMotionConfig['nervousSystemState']): void {
    this.config.nervousSystemState = state;
    this.timings = this.calculateTimings();
    this.updateCSSCustomProperties();
  }

  private updateCSSCustomProperties(): void {
    const root = document.documentElement;
    
    root.style.setProperty('--motion-hover', `${this.timings.hover}ms`);
    root.style.setProperty('--motion-fade', `${this.timings.fade}ms`);
    root.style.setProperty('--motion-page', `${this.timings.page}ms`);
    root.style.setProperty('--motion-confirmation', `${this.timings.confirmation}ms`);
    root.style.setProperty('--motion-focus', `${this.timings.focus}ms`);

    Object.entries(this.easings).forEach(([key, value]) => {
      root.style.setProperty(`--ease-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
  }

  // ===== FORM INTERACTION ANIMATIONS =====

  animateFormSuccess(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      if (this.config.respectsReducedMotion) {
        element.style.borderColor = 'var(--color-primary)';
        resolve();
        return;
      }

      const glowColor = 'rgba(164, 183, 146, 0.4)';
      const animation = element.animate([
        { 
          borderColor: 'var(--color-healing-mist)',
          boxShadow: '0 0 0 rgba(164, 183, 146, 0)'
        },
        { 
          borderColor: 'var(--color-primary)',
          boxShadow: `0 0 8px ${glowColor}`
        },
        { 
          borderColor: 'var(--color-primary)',
          boxShadow: `0 0 4px ${glowColor}`
        }
      ], {
        duration: this.timings.confirmation,
        easing: this.easings.gentleness,
        fill: 'forwards'
      });

      animation.addEventListener('finish', () => resolve());
    });
  }

  animateFormError(element: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      if (this.config.respectsReducedMotion) {
        element.style.borderColor = 'var(--color-warm-terra)';
        resolve();
        return;
      }

      const pulseAnimation = element.animate([
        { opacity: 1, transform: 'scale(1)' },
        { opacity: 0.8, transform: 'scale(1.01)' },
        { opacity: 1, transform: 'scale(1)' }
      ], {
        duration: this.timings.confirmation,
        iterations: 2,
        easing: this.easings.contemplation
      });

      element.style.borderColor = 'var(--color-warm-terra)';
      
      pulseAnimation.addEventListener('finish', () => resolve());
    });
  }

  // ===== LOADING STATE ANIMATIONS =====

  createGentleLoader(container: HTMLElement): () => void {
    if (this.config.respectsReducedMotion) {
      container.innerHTML = '<div style="text-align: center; padding: 1rem;">Loading...</div>';
      return () => { container.innerHTML = ''; };
    }

    const loader = document.createElement('div');
    loader.style.cssText = `
      width: 100%;
      height: 2px;
      background: rgba(164, 183, 146, 0.1);
      border-radius: 1px;
      overflow: hidden;
      position: relative;
    `;

    const progress = document.createElement('div');
    progress.style.cssText = `
      height: 100%;
      background: linear-gradient(90deg, transparent 0%, var(--color-primary) 50%, transparent 100%);
      width: 50%;
      border-radius: 1px;
    `;

    loader.appendChild(progress);
    container.appendChild(loader);

    const animation = progress.animate([
      { transform: 'translateX(-100%)' },
      { transform: 'translateX(200%)' }
    ], {
      duration: this.timings.load * 2,
      iterations: Infinity,
      easing: this.easings.sacredFlow
    });

    return () => {
      animation.cancel();
      container.removeChild(loader);
    };
  }

  // ===== CULTURAL MOTION PATTERNS =====

  applyCulturalPacing(context: 'indigenous' | 'african_diaspora' | 'east_asian' | 'universal'): void {
    const culturalPacingMap = {
      indigenous: 'ceremonial' as const,
      african_diaspora: 'responsive' as const,
      east_asian: 'contemplative' as const,
      universal: 'responsive' as const
    };

    this.config.culturalPacing = culturalPacingMap[context];
    this.timings = this.calculateTimings();
    this.updateCSSCustomProperties();
  }

  // ===== ACCESSIBILITY HELPERS =====

  respectUserPreferences(): void {
    // Listen for changes in motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.config.respectsReducedMotion = e.matches;
      this.timings = this.calculateTimings();
      this.easings = this.getEasingCurves();
      this.updateCSSCustomProperties();
    });

    // Listen for changes in contrast preferences
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    contrastQuery.addEventListener('change', (e) => {
      this.config.accessibilityLevel = e.matches ? 'high_contrast' : 'standard';
    });
  }

  // ===== CLEANUP =====

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  // ===== STATIC UTILITY METHODS =====

  static getMotionTimings(): MotionTiming {
    const style = getComputedStyle(document.documentElement);
    
    return {
      hover: parseInt(style.getPropertyValue('--js-motion-hover') || '150'),
      fade: parseInt(style.getPropertyValue('--js-motion-fade') || '300'),
      page: parseInt(style.getPropertyValue('--js-motion-page') || '300'),
      confirmation: parseInt(style.getPropertyValue('--js-motion-confirmation') || '400'),
      focus: 200,
      load: 600,
      breath: 150,
      ceremony: 1200
    };
  }

  static createSacredHover(element: HTMLElement): void {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    element.addEventListener('mouseenter', () => {
      element.style.transform = 'translateY(-2px)';
      element.style.boxShadow = '0 4px 8px rgba(164, 183, 146, 0.2)';
    });

    element.addEventListener('mouseleave', () => {
      element.style.transform = '';
      element.style.boxShadow = '';
    });
  }

  static applySacredFocus(element: HTMLElement): void {
    element.addEventListener('focus', () => {
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        element.style.boxShadow = '0 0 8px rgba(164, 183, 146, 0.4)';
      }
    });

    element.addEventListener('blur', () => {
      element.style.boxShadow = '';
    });
  }
}

// ===== REACT HOOK FOR MOTION SYSTEM =====

export function useSacredMotion(config?: Partial<SacredMotionConfig>) {
  const motionManager = new SacredMotionManager(config);
  
  React.useEffect(() => {
    motionManager.respectUserPreferences();
    return () => motionManager.destroy();
  }, []);

  return {
    createTransition: motionManager.createSacredTransition.bind(motionManager),
    animatePageTransition: motionManager.animatePageTransition.bind(motionManager),
    createBreathing: motionManager.createBreathingAnimation.bind(motionManager),
    createGlow: motionManager.createGentleGlow.bind(motionManager),
    observeElement: motionManager.observeElement.bind(motionManager),
    animateSuccess: motionManager.animateFormSuccess.bind(motionManager),
    animateError: motionManager.animateFormError.bind(motionManager),
    createLoader: motionManager.createGentleLoader.bind(motionManager),
    adaptNervousSystem: motionManager.adaptToNervousSystemState.bind(motionManager),
    applyCultural: motionManager.applyCulturalPacing.bind(motionManager),
    timings: motionManager.timings,
    easings: motionManager.easings
  };
}

// ===== EXPORT MOTION CONSTANTS =====

export const SACRED_MOTION_PRESETS = {
  hover: {
    duration: 150,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(164, 183, 146, 0.2)'
  },
  
  focus: {
    duration: 200,
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    boxShadow: '0 0 8px rgba(164, 183, 146, 0.4)'
  },
  
  confirmation: {
    duration: 400,
    easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
    animation: 'softGlowPulse 400ms ease-out 2'
  },
  
  pageTransition: {
    duration: 300,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    animation: 'fadeIn 300ms ease-in-out'
  }
};

export default SacredMotionManager;