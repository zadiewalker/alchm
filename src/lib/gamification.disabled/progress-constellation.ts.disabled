/**
 * ALCHM Progress Constellation System
 * A magical, trauma-informed visualization that makes progress irresistibly beautiful
 * 
 * Instead of linear bars or numbers, users see their healing journey as a living constellation
 * that grows more beautiful with each entry, creating genuine addiction to their own growth.
 */

export interface ConstellationStar {
  id: string;
  type: 'reflection' | 'breakthrough' | 'grace' | 'milestone' | 'connection' | 'wisdom';
  brightness: number; // 0-1, affects visual intensity
  size: 'tiny' | 'small' | 'medium' | 'large' | 'radiant';
  color: string;
  position: { x: number; y: number };
  createdAt: Date;
  connectionStrength: number; // How connected to other stars
  emotionalResonance: 'gentle' | 'powerful' | 'transformative' | 'sacred';
  isNewlyFormed: boolean; // For celebration animations
  linkedMemories?: string[]; // Journal entry IDs
  healingPhase: 'seeding' | 'growing' | 'blooming' | 'radiating';
}

export interface ConstellationConnection {
  id: string;
  fromStarId: string;
  toStarId: string;
  strength: number; // 0-1, affects line thickness/opacity
  type: 'growth' | 'pattern' | 'breakthrough' | 'support';
  formedAt: Date;
  healingNarrative?: string; // The story this connection tells
}

export interface HealingConstellation {
  id: string;
  userId: string;
  stars: ConstellationStar[];
  connections: ConstellationConnection[];
  centerOfGravity: { x: number; y: number }; // Where the user's core healing energy sits
  overallBrightness: number; // Total luminosity of their journey
  constellationName?: string; // User can name their constellation
  evolutionStage: 'nascent' | 'forming' | 'established' | 'luminous' | 'guiding_light';
  lastUpdated: Date;
  
  // Psychological engagement metrics
  totalLuminosity: number;
  harmoniousConnections: number;
  breakthroughMoments: number;
  wisdomClusters: number;
}

export interface ConstellationInsight {
  type: 'pattern' | 'growth' | 'strength' | 'opportunity';
  title: string;
  description: string;
  starIds: string[];
  celebrationLevel: 'gentle' | 'warm' | 'joyful' | 'profound';
  actionSuggestion?: string;
  wisdomQuote?: string;
}

export class ProgressConstellationEngine {
  
  /**
   * Create a new star when the user has a meaningful moment
   * This is called after journal entries, breakthroughs, grace usage, etc.
   */
  static createNewStar(
    constellation: HealingConstellation,
    starData: {
      type: ConstellationStar['type'];
      emotionalIntensity: number; // 0-1
      healingSignificance: number; // 0-1
      contextualMemories?: string[];
      userFeeling?: 'vulnerable' | 'strong' | 'clear' | 'peaceful' | 'courageous';
    }
  ): { updatedConstellation: HealingConstellation; celebrationMoment: ConstellationCelebration } {
    
    const newStar: ConstellationStar = {
      id: `star_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      type: starData.type,
      brightness: this.calculateStarBrightness(starData.emotionalIntensity, starData.healingSignificance),
      size: this.determineStarSize(starData.healingSignificance),
      color: this.selectStarColor(starData.type, starData.userFeeling),
      position: this.calculateHarmoniousPosition(constellation),
      createdAt: new Date(),
      connectionStrength: 0, // Will be calculated when connections form
      emotionalResonance: this.mapEmotionalResonance(starData.emotionalIntensity),
      isNewlyFormed: true,
      linkedMemories: starData.contextualMemories || [],
      healingPhase: this.determineHealingPhase(constellation, starData)
    };
    
    // Find natural connections with existing stars
    const newConnections = this.discoverConnections(constellation, newStar);
    
    const updatedConstellation: HealingConstellation = {
      ...constellation,
      stars: [...constellation.stars, newStar],
      connections: [...constellation.connections, ...newConnections],
      centerOfGravity: this.recalculateCenterOfGravity([...constellation.stars, newStar]),
      overallBrightness: this.calculateOverallBrightness([...constellation.stars, newStar]),
      evolutionStage: this.determineEvolutionStage([...constellation.stars, newStar]),
      lastUpdated: new Date(),
      totalLuminosity: constellation.totalLuminosity + newStar.brightness,
      harmoniousConnections: constellation.harmoniousConnections + newConnections.length,
      breakthroughMoments: newStar.type === 'breakthrough' ? constellation.breakthroughMoments + 1 : constellation.breakthroughMoments
    };
    
    const celebrationMoment = this.generateStarCelebration(newStar, newConnections, updatedConstellation);
    
    return { updatedConstellation, celebrationMoment };
  }
  
  /**
   * Generate insights from the constellation pattern
   * This creates the "aha moments" that make users excited about their progress
   */
  static generateConstellationInsights(constellation: HealingConstellation): ConstellationInsight[] {
    const insights: ConstellationInsight[] = [];
    
    // Detect emerging patterns
    const patternInsights = this.detectHealingPatterns(constellation);
    insights.push(...patternInsights);
    
    // Identify growth clusters
    const growthInsights = this.identifyGrowthClusters(constellation);
    insights.push(...growthInsights);
    
    // Recognize strength formations
    const strengthInsights = this.recognizeStrengthFormations(constellation);
    insights.push(...strengthInsights);
    
    // Suggest constellation opportunities
    const opportunityInsights = this.suggestGrowthOpportunities(constellation);
    insights.push(...opportunityInsights);
    
    return insights.sort((a, b) => 
      this.getCelebrationWeight(b.celebrationLevel) - this.getCelebrationWeight(a.celebrationLevel)
    );
  }
  
  /**
   * Create constellation visualization data for the frontend
   */
  static generateVisualizationData(constellation: HealingConstellation): ConstellationVisualization {
    return {
      viewBox: this.calculateOptimalViewBox(constellation),
      backgroundGradient: this.generateHealingGradient(constellation),
      starElements: constellation.stars.map(star => this.createStarElement(star)),
      connectionElements: constellation.connections.map(conn => this.createConnectionElement(conn, constellation)),
      centerOfGravityElement: this.createCenterElement(constellation),
      animationSequence: this.createAnimationSequence(constellation),
      interactionZones: this.defineInteractionZones(constellation),
      healingAura: this.generateHealingAura(constellation)
    };
  }
  
  /**
   * Calculate perfect position for new star using golden ratio and sacred geometry
   */
  private static calculateHarmoniousPosition(constellation: HealingConstellation): { x: number; y: number } {
    if (constellation.stars.length === 0) {
      return { x: 0.5, y: 0.5 }; // Center for first star
    }
    
    const goldenRatio = 1.618033988749895;
    const existingPositions = constellation.stars.map(s => s.position);
    
    // Use fibonacci spiral to place stars in naturally pleasing patterns
    const angle = (constellation.stars.length * 137.5) * (Math.PI / 180); // Golden angle
    const radius = Math.sqrt(constellation.stars.length) * 0.1;
    
    const centerX = constellation.centerOfGravity.x;
    const centerY = constellation.centerOfGravity.y;
    
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    
    // Ensure position is within bounds and not too close to existing stars
    return this.ensureHarmoniousSpacing({ x: Math.max(0.1, Math.min(0.9, x)), y: Math.max(0.1, Math.min(0.9, y)) }, existingPositions);
  }
  
  /**
   * Discover natural connections between stars based on healing patterns
   */
  private static discoverConnections(constellation: HealingConstellation, newStar: ConstellationStar): ConstellationConnection[] {
    const connections: ConstellationConnection[] = [];
    const recentStars = constellation.stars.filter(s => 
      (new Date().getTime() - s.createdAt.getTime()) < (7 * 24 * 60 * 60 * 1000) // Last 7 days
    );
    
    recentStars.forEach(existingStar => {
      const connectionStrength = this.calculateConnectionStrength(existingStar, newStar);
      
      if (connectionStrength > 0.3) { // Threshold for meaningful connections
        const connection: ConstellationConnection = {
          id: `conn_${existingStar.id}_${newStar.id}`,
          fromStarId: existingStar.id,
          toStarId: newStar.id,
          strength: connectionStrength,
          type: this.determineConnectionType(existingStar, newStar),
          formedAt: new Date(),
          healingNarrative: this.generateConnectionNarrative(existingStar, newStar, connectionStrength)
        };
        
        connections.push(connection);
      }
    });
    
    return connections;
  }
  
  /**
   * Generate celebration moments that create genuine dopamine rewards
   */
  private static generateStarCelebration(
    newStar: ConstellationStar, 
    newConnections: ConstellationConnection[],
    constellation: HealingConstellation
  ): ConstellationCelebration {
    const isBreakthrough = newStar.type === 'breakthrough';
    const hasMultipleConnections = newConnections.length > 1;
    const isLuminousStage = constellation.evolutionStage === 'luminous';
    
    if (isBreakthrough) {
      return {
        type: 'breakthrough',
        title: 'A New Star is Born',
        message: 'Something profound just shifted in your constellation. This breakthrough is illuminating your entire journey.',
        animation: 'supernova',
        duration: 4000,
        soundEffect: 'cosmic_chime',
        followUpReflection: 'What does this new light reveal about who you\'re becoming?'
      };
    }
    
    if (hasMultipleConnections) {
      return {
        type: 'connection_cascade',
        title: 'Your Wisdom is Connecting',
        message: `This moment is creating ${newConnections.length} new pathways in your healing. See how everything connects?`,
        animation: 'connection_ripple',
        duration: 3000,
        soundEffect: 'gentle_harmony',
        followUpReflection: 'Notice how your growth creates natural patterns of wisdom.'
      };
    }
    
    return {
      type: 'gentle_growth',
      title: 'Your Constellation Grows',
      message: 'Each reflection adds another point of light to your unique healing pattern.',
      animation: 'gentle_pulse',
      duration: 2000,
      soundEffect: 'soft_twinkle',
      followUpReflection: 'Every word you write becomes part of your luminous transformation.'
    };
  }
  
  /**
   * Detect meaningful patterns in the user's healing journey
   */
  private static detectHealingPatterns(constellation: HealingConstellation): ConstellationInsight[] {
    const insights: ConstellationInsight[] = [];
    
    // Look for clustering of breakthrough moments
    const breakthroughStars = constellation.stars.filter(s => s.type === 'breakthrough');
    if (breakthroughStars.length >= 3) {
      const clustered = this.findClusters(breakthroughStars);
      if (clustered.length > 0) {
        insights.push({
          type: 'pattern',
          title: 'Your Breakthrough Pattern',
          description: 'You have a beautiful pattern of breakthroughs forming. These moments of clarity are creating a powerful foundation for your growth.',
          starIds: breakthroughStars.map(s => s.id),
          celebrationLevel: 'profound',
          wisdomQuote: 'Breakthroughs are not accidents - they are the result of consistent courage to look within.'
        });
      }
    }
    
    // Detect growth spirals
    const recentGrowth = this.analyzeRecentGrowthPattern(constellation);
    if (recentGrowth.isUpwardSpiral) {
      insights.push({
        type: 'growth',
        title: 'You\'re in an Upward Spiral',
        description: 'Your recent reflections show a beautiful pattern of ascending growth. Each entry is building on the last.',
        starIds: recentGrowth.starIds,
        celebrationLevel: 'joyful',
        actionSuggestion: 'This is a powerful time to lean into your growth. What wants to emerge next?'
      });
    }
    
    return insights;
  }
  
  // Supporting interfaces and utility methods...
  
  private static calculateStarBrightness(emotionalIntensity: number, healingSignificance: number): number {
    return Math.min(1, (emotionalIntensity * 0.4 + healingSignificance * 0.6));
  }
  
  private static determineStarSize(healingSignificance: number): ConstellationStar['size'] {
    if (healingSignificance > 0.8) return 'radiant';
    if (healingSignificance > 0.6) return 'large';
    if (healingSignificance > 0.4) return 'medium';
    if (healingSignificance > 0.2) return 'small';
    return 'tiny';
  }
  
  private static selectStarColor(type: ConstellationStar['type'], feeling?: string): string {
    const colorMap = {
      reflection: '#8ea876', // Sage green
      breakthrough: '#d4756b', // Warm coral
      grace: '#cb997e', // Soft brown
      milestone: '#f4e8c1', // Warm cream
      connection: '#a0c4ff', // Gentle blue
      wisdom: '#ddbea9'  // Wise beige
    };
    
    // Adjust color based on feeling
    const baseColor = colorMap[type];
    if (feeling === 'courageous') return this.adjustColorBrightness(baseColor, 0.2);
    if (feeling === 'peaceful') return this.adjustColorSaturation(baseColor, -0.1);
    if (feeling === 'vulnerable') return this.adjustColorWarmth(baseColor, 0.1);
    
    return baseColor;
  }
  
  private static mapEmotionalResonance(intensity: number): ConstellationStar['emotionalResonance'] {
    if (intensity > 0.8) return 'sacred';
    if (intensity > 0.6) return 'transformative';
    if (intensity > 0.4) return 'powerful';
    return 'gentle';
  }
  
  private static determineHealingPhase(constellation: HealingConstellation, starData: any): ConstellationStar['healingPhase'] {
    const totalStars = constellation.stars.length;
    if (totalStars < 5) return 'seeding';
    if (totalStars < 20) return 'growing';
    if (totalStars < 50) return 'blooming';
    return 'radiating';
  }
  
  private static calculateConnectionStrength(star1: ConstellationStar, star2: ConstellationStar): number {
    // Calculate based on temporal proximity, emotional resonance, and healing phase alignment
    const timeDiff = Math.abs(star1.createdAt.getTime() - star2.createdAt.getTime());
    const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    
    let strength = Math.max(0, 1 - (daysDiff / 7)); // Stronger if closer in time
    
    // Boost for similar emotional resonance
    if (star1.emotionalResonance === star2.emotionalResonance) {
      strength += 0.3;
    }
    
    // Boost for complementary types
    if (this.areComplementaryTypes(star1.type, star2.type)) {
      strength += 0.2;
    }
    
    return Math.min(1, strength);
  }
  
  private static areComplementaryTypes(type1: ConstellationStar['type'], type2: ConstellationStar['type']): boolean {
    const complementaryPairs = [
      ['reflection', 'breakthrough'],
      ['grace', 'wisdom'],
      ['milestone', 'connection']
    ];
    
    return complementaryPairs.some(pair => 
      (pair.includes(type1) && pair.includes(type2)) && type1 !== type2
    );
  }
  
  private static determineConnectionType(star1: ConstellationStar, star2: ConstellationStar): ConstellationConnection['type'] {
    if (star1.type === 'breakthrough' || star2.type === 'breakthrough') return 'breakthrough';
    if (star1.healingPhase === star2.healingPhase) return 'pattern';
    if (star1.type === 'connection' || star2.type === 'connection') return 'support';
    return 'growth';
  }
  
  private static generateConnectionNarrative(star1: ConstellationStar, star2: ConstellationStar, strength: number): string {
    const narratives = [
      'This connection shows how your insights build upon each other.',
      'These moments of growth are naturally flowing together.',
      'Your healing journey is creating beautiful patterns of wisdom.',
      'Each reflection deepens the ones that came before.'
    ];
    
    return narratives[Math.floor(Math.random() * narratives.length)];
  }
  
  // Additional utility methods would go here...
  private static recalculateCenterOfGravity(stars: ConstellationStar[]): { x: number; y: number } {
    if (stars.length === 0) return { x: 0.5, y: 0.5 };
    
    const weightedX = stars.reduce((sum, star) => sum + star.position.x * star.brightness, 0);
    const weightedY = stars.reduce((sum, star) => sum + star.position.y * star.brightness, 0);
    const totalWeight = stars.reduce((sum, star) => sum + star.brightness, 0);
    
    return {
      x: weightedX / totalWeight,
      y: weightedY / totalWeight
    };
  }
  
  private static calculateOverallBrightness(stars: ConstellationStar[]): number {
    return stars.reduce((sum, star) => sum + star.brightness, 0);
  }
  
  private static determineEvolutionStage(stars: ConstellationStar[]): HealingConstellation['evolutionStage'] {
    const totalLuminosity = stars.reduce((sum, star) => sum + star.brightness, 0);
    const breakthroughCount = stars.filter(s => s.type === 'breakthrough').length;
    const connectionDensity = stars.length > 0 ? stars.reduce((sum, star) => sum + star.connectionStrength, 0) / stars.length : 0;
    
    if (totalLuminosity > 50 && breakthroughCount > 10 && connectionDensity > 0.7) return 'guiding_light';
    if (totalLuminosity > 30 && breakthroughCount > 5) return 'luminous';
    if (totalLuminosity > 15) return 'established';
    if (totalLuminosity > 5) return 'forming';
    return 'nascent';
  }
  
  private static ensureHarmoniousSpacing(position: { x: number; y: number }, existingPositions: { x: number; y: number }[]): { x: number; y: number } {
    // TODO: Implement minimum distance logic
    return position;
  }
  
  private static getCelebrationWeight(level: ConstellationInsight['celebrationLevel']): number {
    const weights = { gentle: 1, warm: 2, joyful: 3, profound: 4 };
    return weights[level];
  }
  
  private static findClusters(stars: ConstellationStar[]): ConstellationStar[][] {
    // TODO: Implement clustering algorithm
    return [];
  }
  
  private static analyzeRecentGrowthPattern(constellation: HealingConstellation): { isUpwardSpiral: boolean; starIds: string[] } {
    // TODO: Implement growth pattern analysis
    return { isUpwardSpiral: false, starIds: [] };
  }
  
  private static adjustColorBrightness(color: string, factor: number): string {
    // TODO: Implement color adjustment
    return color;
  }
  
  private static adjustColorSaturation(color: string, factor: number): string {
    // TODO: Implement color adjustment
    return color;
  }
  
  private static adjustColorWarmth(color: string, factor: number): string {
    // TODO: Implement color adjustment
    return color;
  }
  
  private static identifyGrowthClusters(constellation: HealingConstellation): ConstellationInsight[] {
    // TODO: Implement growth cluster identification
    return [];
  }
  
  private static recognizeStrengthFormations(constellation: HealingConstellation): ConstellationInsight[] {
    // TODO: Implement strength formation recognition
    return [];
  }
  
  private static suggestGrowthOpportunities(constellation: HealingConstellation): ConstellationInsight[] {
    // TODO: Implement growth opportunity suggestions
    return [];
  }
  
  private static calculateOptimalViewBox(constellation: HealingConstellation): string {
    // TODO: Implement optimal viewbox calculation
    return '0 0 1000 1000';
  }
  
  private static generateHealingGradient(constellation: HealingConstellation): string {
    // TODO: Implement healing gradient generation
    return 'linear-gradient(45deg, #1a1a2e, #16213e)';
  }
  
  private static createStarElement(star: ConstellationStar): any {
    // TODO: Implement star element creation
    return {};
  }
  
  private static createConnectionElement(connection: ConstellationConnection, constellation: HealingConstellation): any {
    // TODO: Implement connection element creation
    return {};
  }
  
  private static createCenterElement(constellation: HealingConstellation): any {
    // TODO: Implement center element creation
    return {};
  }
  
  private static createAnimationSequence(constellation: HealingConstellation): any {
    // TODO: Implement animation sequence creation
    return {};
  }
  
  private static defineInteractionZones(constellation: HealingConstellation): any {
    // TODO: Implement interaction zones definition
    return {};
  }
  
  private static generateHealingAura(constellation: HealingConstellation): any {
    // TODO: Implement healing aura generation
    return {};
  }
}

// Supporting interfaces
export interface ConstellationCelebration {
  type: 'breakthrough' | 'connection_cascade' | 'gentle_growth' | 'milestone_reached' | 'wisdom_cluster';
  title: string;
  message: string;
  animation: 'supernova' | 'connection_ripple' | 'gentle_pulse' | 'stardust' | 'aurora';
  duration: number; // milliseconds
  soundEffect?: 'cosmic_chime' | 'gentle_harmony' | 'soft_twinkle' | 'wisdom_bell';
  followUpReflection?: string;
}

export interface ConstellationVisualization {
  viewBox: string;
  backgroundGradient: string;
  starElements: any[];
  connectionElements: any[];
  centerOfGravityElement: any;
  animationSequence: any;
  interactionZones: any;
  healingAura: any;
}