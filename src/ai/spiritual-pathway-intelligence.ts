/**
 * ALCHM Spiritual Pathway Intelligence System
 * 
 * AI-driven system that identifies user's spiritual and meaning-making preferences,
 * then suggests aligned healing approaches across diverse faith traditions and 
 * secular philosophies while maintaining radical inclusivity.
 */

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

// Core spiritual intelligence types
export interface SpiritualProfile {
  userId: string;
  spiritualOpenness: 'religious' | 'spiritual-not-religious' | 'secular' | 'exploring' | 'questioning' | 'atheist';
  religiousTraditions: string[];
  secularPhilosophies: string[];
  meaningMakingStyle: 'narrative' | 'logical' | 'experiential' | 'communal' | 'individual' | 'hybrid';
  traumaHistory: {
    religiousTrauma: boolean;
    traumaType?: 'institutional' | 'doctrinal' | 'community' | 'authority' | 'family';
    healingStage: 'denial' | 'anger' | 'exploration' | 'reconstruction' | 'integration';
    triggerWords: string[];
    safeLanguages: string[];
  };
  culturalBackground: string[];
  existentialConcerns: string[];
  spiritualPractices: string[];
  avoidedTopics: string[];
  preferredVocabulary: {
    divine: string[]; // e.g., ['God', 'Universe', 'Source', 'Life', 'Nature']
    prayer: string[]; // e.g., ['prayer', 'meditation', 'reflection', 'contemplation']
    sacred: string[]; // e.g., ['sacred', 'meaningful', 'important', 'special']
    community: string[]; // e.g., ['congregation', 'community', 'group', 'circle']
  };
  lastUpdated: Date;
  confidenceScore: number; // 0-100, how confident we are in this profile
}

export interface SpiritualPathwayRecommendation {
  pathwayId: string;
  title: string;
  spiritualFramework: string[];
  secularAlternative?: string;
  culturalAdaptations: string[];
  traumaConsiderations: {
    isSafe: boolean;
    warnings: string[];
    alternatives: string[];
    supportRequired: boolean;
  };
  meaningMakingApproach: string;
  vocabularyAdaptations: Record<string, string>;
  practiceModifications: string[];
  communitySupport: {
    availableGroups: string[];
    peerMentors: boolean;
    professionalGuidance: boolean;
  };
  confidenceScore: number;
  reasoning: string[];
}

export interface JournalSpiritualSignal {
  userId: string;
  entryId: string;
  detectedThemes: string[];
  spiritualLanguage: string[];
  meaningMakingAttempts: string[];
  existentialQuestions: string[];
  traumaIndicators: string[];
  growthSignals: string[];
  culturalReferences: string[];
  confidenceLevel: number;
  timestamp: Date;
}

export class SpiritualPathwayIntelligence {
  private static instance: SpiritualPathwayIntelligence;
  
  private constructor() {}
  
  static getInstance(): SpiritualPathwayIntelligence {
    if (!SpiritualPathwayIntelligence.instance) {
      SpiritualPathwayIntelligence.instance = new SpiritualPathwayIntelligence();
    }
    return SpiritualPathwayIntelligence.instance;
  }

  /**
   * Analyze journal entries to extract spiritual and meaning-making patterns
   */
  async analyzeJournalForSpiritualSignals(userId: string, journalText: string, entryId: string): Promise<JournalSpiritualSignal> {
    try {
      const signals: JournalSpiritualSignal = {
        userId,
        entryId,
        detectedThemes: [],
        spiritualLanguage: [],
        meaningMakingAttempts: [],
        existentialQuestions: [],
        traumaIndicators: [],
        growthSignals: [],
        culturalReferences: [],
        confidenceLevel: 0,
        timestamp: new Date()
      };

      const text = journalText.toLowerCase();

      // Detect spiritual language patterns
      const spiritualTerms = {
        religious: ['god', 'prayer', 'faith', 'divine', 'sacred', 'holy', 'blessed', 'church', 'temple', 'mosque', 'synagogue'],
        universal: ['universe', 'energy', 'connection', 'higher power', 'source', 'spirit', 'soul'],
        secular: ['meaning', 'purpose', 'values', 'ethics', 'philosophy', 'humanity', 'existence'],
        buddhist: ['mindfulness', 'compassion', 'suffering', 'impermanence', 'dharma', 'karma', 'meditation'],
        indigenous: ['ancestors', 'land', 'ceremony', 'tradition', 'community', 'reciprocity', 'balance'],
        existential: ['authentic', 'freedom', 'choice', 'responsibility', 'absurd', 'anxiety', 'angst']
      };

      Object.entries(spiritualTerms).forEach(([category, terms]) => {
        terms.forEach(term => {
          if (text.includes(term)) {
            signals.spiritualLanguage.push(`${category}:${term}`);
          }
        });
      });

      // Detect meaning-making attempts
      const meaningPatterns = [
        /why (did|does|is|am|are).+happen/gi,
        /what(\'s| is) the (point|meaning|purpose)/gi,
        /i (believe|think|feel).+(because|that)/gi,
        /this (means|shows|teaches) (me |that)/gi,
        /i\'m learning (that|to)/gi,
        /maybe.+(is|means|shows)/gi
      ];

      meaningPatterns.forEach(pattern => {
        const matches = journalText.match(pattern);
        if (matches) {
          signals.meaningMakingAttempts.push(...matches);
        }
      });

      // Detect existential questions
      const existentialPatterns = [
        /what.+purpose/gi,
        /why.+(exist|live|here)/gi,
        /what.+after.+death/gi,
        /is there.+(god|meaning|point)/gi,
        /what.+life.+about/gi
      ];

      existentialPatterns.forEach(pattern => {
        const matches = journalText.match(pattern);
        if (matches) {
          signals.existentialQuestions.push(...matches);
        }
      });

      // Detect religious trauma indicators
      const traumaTerms = [
        'religious trauma', 'church hurt', 'spiritual abuse', 'toxic faith',
        'religious guilt', 'shame', 'judgment', 'exclusion', 'rejected by',
        'lost faith', 'questioning everything', 'betrayed by church',
        'scared of hell', 'fear of god', 'religious anxiety'
      ];

      traumaTerms.forEach(term => {
        if (text.includes(term.toLowerCase())) {
          signals.traumaIndicators.push(term);
        }
      });

      // Detect growth signals
      const growthTerms = [
        'growing in faith', 'spiritual growth', 'finding peace', 'letting go',
        'forgiveness', 'healing', 'recovery', 'rebuilding', 'exploring',
        'open to', 'discovering', 'learning about', 'finding meaning'
      ];

      growthTerms.forEach(term => {
        if (text.includes(term.toLowerCase())) {
          signals.growthSignals.push(term);
        }
      });

      // Detect cultural references
      const culturalTerms = {
        christianity: ['jesus', 'christ', 'bible', 'gospel', 'salvation', 'trinity'],
        islam: ['allah', 'prophet', 'quran', 'hajj', 'ramadan', 'imam'],
        judaism: ['torah', 'shabbat', 'rabbi', 'synagogue', 'kosher', 'tikkun olam'],
        hinduism: ['karma', 'dharma', 'yoga', 'meditation', 'guru', 'ashram'],
        buddhism: ['buddha', 'sangha', 'monastery', 'zen', 'mindfulness'],
        indigenous: ['ceremony', 'elder', 'tradition', 'ancestor', 'sacred site'],
        secular: ['humanism', 'philosophy', 'ethics', 'science', 'reason']
      };

      Object.entries(culturalTerms).forEach(([culture, terms]) => {
        terms.forEach(term => {
          if (text.includes(term)) {
            signals.culturalReferences.push(`${culture}:${term}`);
          }
        });
      });

      // Calculate confidence level
      const totalSignals = 
        signals.spiritualLanguage.length +
        signals.meaningMakingAttempts.length +
        signals.existentialQuestions.length +
        signals.culturalReferences.length;
      
      signals.confidenceLevel = Math.min(100, (totalSignals / journalText.length) * 1000);

      // Store signals for pattern analysis
      await this.storeSpiritualSignals(signals);

      return signals;

    } catch (error) {
      console.error('Error analyzing journal for spiritual signals:', error);
      throw error;
    }
  }

  /**
   * Build or update spiritual profile based on accumulated signals
   */
  async buildSpiritualProfile(userId: string): Promise<SpiritualProfile> {
    try {
      // Get existing profile
      const existingProfile = await this.getSpiritualProfile(userId);
      
      // Get recent spiritual signals
      const recentSignals = await this.getRecentSpiritualSignals(userId, 30); // Last 30 days
      
      // Analyze patterns in signals
      const analysis = this.analyzeSpiritualSignalPatterns(recentSignals);
      
      // Build or update profile
      const profile: SpiritualProfile = {
        userId,
        spiritualOpenness: this.determineSpiritualOpenness(analysis, existingProfile),
        religiousTraditions: this.identifyReligiousTraditions(analysis),
        secularPhilosophies: this.identifySecularPhilosophies(analysis),
        meaningMakingStyle: this.determineMeaningMakingStyle(analysis),
        traumaHistory: this.assessTraumaHistory(analysis, existingProfile),
        culturalBackground: this.identifyCulturalBackground(analysis),
        existentialConcerns: this.extractExistentialConcerns(analysis),
        spiritualPractices: this.identifySpiritualPractices(analysis),
        avoidedTopics: this.identifyAvoidedTopics(analysis),
        preferredVocabulary: this.buildPreferredVocabulary(analysis),
        lastUpdated: new Date(),
        confidenceScore: this.calculateProfileConfidence(analysis, recentSignals.length)
      };

      // Store updated profile
      await this.storeSpiritualProfile(profile);
      
      return profile;

    } catch (error) {
      console.error('Error building spiritual profile:', error);
      throw error;
    }
  }

  /**
   * Generate spiritually-informed pathway recommendations
   */
  async generateSpiritualPathwayRecommendations(userId: string): Promise<SpiritualPathwayRecommendation[]> {
    try {
      const profile = await this.getSpiritualProfile(userId);
      if (!profile) {
        // Build profile first
        await this.buildSpiritualProfile(userId);
        return this.generateSpiritualPathwayRecommendations(userId);
      }

      const recommendations: SpiritualPathwayRecommendation[] = [];

      // Get available pathways
      const pathways = await this.getAvailablePathways();

      for (const pathway of pathways) {
        const recommendation = await this.evaluatePathwayForUser(pathway, profile);
        if (recommendation && recommendation.confidenceScore > 60) {
          recommendations.push(recommendation);
        }
      }

      // Sort by confidence score
      recommendations.sort((a, b) => b.confidenceScore - a.confidenceScore);

      return recommendations.slice(0, 5); // Top 5 recommendations

    } catch (error) {
      console.error('Error generating spiritual pathway recommendations:', error);
      return [];
    }
  }

  /**
   * Adapt pathway content for user's spiritual profile
   */
  async adaptPathwayContent(pathwayId: string, userId: string): Promise<{
    adaptedContent: any;
    vocabularyMap: Record<string, string>;
    culturalNotes: string[];
    traumaConsiderations: string[];
  }> {
    try {
      const profile = await this.getSpiritualProfile(userId);
      if (!profile) {
        throw new Error('No spiritual profile found for user');
      }

      // Get original pathway content
      const pathway = await this.getPathwayContent(pathwayId);
      
      // Build vocabulary adaptation map
      const vocabularyMap = this.buildVocabularyMap(profile);
      
      // Adapt content
      const adaptedContent = this.adaptContentForProfile(pathway, profile, vocabularyMap);
      
      // Generate cultural notes
      const culturalNotes = this.generateCulturalNotes(profile, pathway);
      
      // Generate trauma considerations
      const traumaConsiderations = this.generateTraumaConsiderations(profile, pathway);

      return {
        adaptedContent,
        vocabularyMap,
        culturalNotes,
        traumaConsiderations
      };

    } catch (error) {
      console.error('Error adapting pathway content:', error);
      throw error;
    }
  }

  // Private helper methods

  private async storeSpiritualSignals(signals: JournalSpiritualSignal): Promise<void> {
    try {
      const signalsRef = collection(db, 'spiritual_signals');
      await setDoc(doc(signalsRef), signals);
    } catch (error) {
      console.error('Error storing spiritual signals:', error);
    }
  }

  private async getSpiritualProfile(userId: string): Promise<SpiritualProfile | null> {
    try {
      const docRef = doc(db, 'spiritual_profiles', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as SpiritualProfile;
      }
      return null;
    } catch (error) {
      console.error('Error getting spiritual profile:', error);
      return null;
    }
  }

  private async storeSpiritualProfile(profile: SpiritualProfile): Promise<void> {
    try {
      const docRef = doc(db, 'spiritual_profiles', profile.userId);
      await setDoc(docRef, profile);
    } catch (error) {
      console.error('Error storing spiritual profile:', error);
    }
  }

  private async getRecentSpiritualSignals(userId: string, days: number): Promise<JournalSpiritualSignal[]> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const q = query(
        collection(db, 'spiritual_signals'),
        where('userId', '==', userId),
        where('timestamp', '>=', cutoffDate),
        orderBy('timestamp', 'desc'),
        limit(100)
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => doc.data() as JournalSpiritualSignal);
    } catch (error) {
      console.error('Error getting recent spiritual signals:', error);
      return [];
    }
  }

  private analyzeSpiritualSignalPatterns(signals: JournalSpiritualSignal[]): any {
    const analysis = {
      spiritualLanguageFrequency: new Map<string, number>(),
      meaningMakingPatterns: new Map<string, number>(),
      existentialThemes: new Map<string, number>(),
      traumaIndicators: new Map<string, number>(),
      growthSignals: new Map<string, number>(),
      culturalReferences: new Map<string, number>(),
      totalEntries: signals.length,
      avgConfidence: signals.reduce((sum, s) => sum + s.confidenceLevel, 0) / signals.length
    };

    signals.forEach(signal => {
      // Count spiritual language
      signal.spiritualLanguage.forEach(lang => {
        const count = analysis.spiritualLanguageFrequency.get(lang) || 0;
        analysis.spiritualLanguageFrequency.set(lang, count + 1);
      });

      // Count cultural references
      signal.culturalReferences.forEach(ref => {
        const count = analysis.culturalReferences.get(ref) || 0;
        analysis.culturalReferences.set(ref, count + 1);
      });

      // Count trauma indicators
      signal.traumaIndicators.forEach(trauma => {
        const count = analysis.traumaIndicators.get(trauma) || 0;
        analysis.traumaIndicators.set(trauma, count + 1);
      });

      // Count growth signals
      signal.growthSignals.forEach(growth => {
        const count = analysis.growthSignals.get(growth) || 0;
        analysis.growthSignals.set(growth, count + 1);
      });
    });

    return analysis;
  }

  private determineSpiritualOpenness(analysis: any, existingProfile?: SpiritualProfile | null): SpiritualProfile['spiritualOpenness'] {
    const religiousTerms = Array.from(analysis.spiritualLanguageFrequency.keys()).filter(lang => lang.startsWith('religious:')).length;
    const universalTerms = Array.from(analysis.spiritualLanguageFrequency.keys()).filter(lang => lang.startsWith('universal:')).length;
    const secularTerms = Array.from(analysis.spiritualLanguageFrequency.keys()).filter(lang => lang.startsWith('secular:')).length;
    const traumaIndicators = analysis.traumaIndicators.size;

    if (traumaIndicators > 2) {
      return 'questioning';
    }

    if (religiousTerms > universalTerms && religiousTerms > secularTerms) {
      return 'religious';
    }

    if (universalTerms > 0 && secularTerms > 0) {
      return 'spiritual-not-religious';
    }

    if (secularTerms > religiousTerms && secularTerms > universalTerms) {
      return 'secular';
    }

    return existingProfile?.spiritualOpenness || 'exploring';
  }

  private identifyReligiousTraditions(analysis: any): string[] {
    const traditions: string[] = [];
    const culturalRefs = Array.from(analysis.culturalReferences.keys());

    const traditionMap = {
      'christianity': ['christianity'],
      'islam': ['islam'],
      'judaism': ['judaism'],
      'hinduism': ['hinduism'],
      'buddhism': ['buddhism'],
      'indigenous': ['indigenous']
    };

    Object.entries(traditionMap).forEach(([tradition, keys]) => {
      if (keys.some(key => culturalRefs.some(ref => ref.includes(key)))) {
        traditions.push(tradition);
      }
    });

    return traditions;
  }

  private identifySecularPhilosophies(analysis: any): string[] {
    const philosophies: string[] = [];
    const secularTerms = Array.from(analysis.spiritualLanguageFrequency.keys())
      .filter(lang => lang.startsWith('secular:') || lang.startsWith('existential:'));

    if (secularTerms.some(term => term.includes('humanism'))) {
      philosophies.push('humanism');
    }

    if (secularTerms.some(term => term.includes('existential'))) {
      philosophies.push('existentialism');
    }

    if (secularTerms.some(term => term.includes('philosophy'))) {
      philosophies.push('philosophy');
    }

    return philosophies;
  }

  private determineMeaningMakingStyle(analysis: any): SpiritualProfile['meaningMakingStyle'] {
    // Simple heuristic - can be made more sophisticated
    if (analysis.meaningMakingPatterns.size > 5) {
      return 'narrative';
    }
    
    if (Array.from(analysis.spiritualLanguageFrequency.keys()).some(lang => lang.includes('reason') || lang.includes('philosophy'))) {
      return 'logical';
    }

    return 'hybrid';
  }

  private assessTraumaHistory(analysis: any, existingProfile?: SpiritualProfile | null): SpiritualProfile['traumaHistory'] {
    const traumaIndicators = Array.from(analysis.traumaIndicators.keys());
    const hasReligiousTrauma = traumaIndicators.some(trauma => 
      trauma.includes('religious') || trauma.includes('church') || trauma.includes('spiritual abuse')
    );

    return {
      religiousTrauma: hasReligiousTrauma,
      traumaType: hasReligiousTrauma ? 'institutional' : undefined,
      healingStage: this.determineHealingStage(analysis),
      triggerWords: this.extractTriggerWords(analysis),
      safeLanguages: this.extractSafeLanguages(analysis)
    };
  }

  private determineHealingStage(analysis: any): SpiritualProfile['traumaHistory']['healingStage'] {
    const growthSignals = analysis.growthSignals.size;
    const traumaIndicators = analysis.traumaIndicators.size;

    if (growthSignals > traumaIndicators) {
      return 'integration';
    }

    if (Array.from(analysis.spiritualLanguageFrequency.keys()).some(lang => lang.includes('exploring'))) {
      return 'exploration';
    }

    return 'anger';
  }

  private extractTriggerWords(analysis: any): string[] {
    return Array.from(analysis.traumaIndicators.keys()).slice(0, 5);
  }

  private extractSafeLanguages(analysis: any): string[] {
    const safeTerms = Array.from(analysis.spiritualLanguageFrequency.keys())
      .filter(lang => lang.includes('universal:') || lang.includes('secular:'))
      .map(lang => lang.split(':')[1]);
    
    return safeTerms.slice(0, 5);
  }

  private identifyCulturalBackground(analysis: any): string[] {
    return Array.from(analysis.culturalReferences.keys())
      .map(ref => ref.split(':')[0])
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  private extractExistentialConcerns(analysis: any): string[] {
    return Array.from(analysis.existentialThemes.keys()).slice(0, 5);
  }

  private identifySpiritualPractices(analysis: any): string[] {
    const practices: string[] = [];
    const spiritualTerms = Array.from(analysis.spiritualLanguageFrequency.keys());

    const practiceMap = {
      'meditation': ['meditation', 'mindfulness'],
      'prayer': ['prayer'],
      'contemplation': ['contemplation', 'reflection'],
      'service': ['service', 'volunteer'],
      'study': ['study', 'learning']
    };

    Object.entries(practiceMap).forEach(([practice, terms]) => {
      if (terms.some(term => spiritualTerms.some(st => st.includes(term)))) {
        practices.push(practice);
      }
    });

    return practices;
  }

  private identifyAvoidedTopics(analysis: any): string[] {
    const traumaTopics = Array.from(analysis.traumaIndicators.keys());
    return traumaTopics.slice(0, 3);
  }

  private buildPreferredVocabulary(analysis: any): SpiritualProfile['preferredVocabulary'] {
    const spiritualTerms = Array.from(analysis.spiritualLanguageFrequency.keys());
    
    const getDivineTerms = () => {
      const divine = ['Source', 'Universe', 'Life'];
      if (spiritualTerms.some(term => term.includes('god'))) divine.unshift('God');
      return divine;
    };

    const getPrayerTerms = () => {
      const prayer = ['reflection', 'contemplation'];
      if (spiritualTerms.some(term => term.includes('prayer'))) prayer.unshift('prayer');
      if (spiritualTerms.some(term => term.includes('meditation'))) prayer.unshift('meditation');
      return prayer;
    };

    return {
      divine: getDivineTerms(),
      prayer: getPrayerTerms(),
      sacred: ['meaningful', 'important', 'special'],
      community: ['community', 'group', 'circle']
    };
  }

  private calculateProfileConfidence(analysis: any, signalCount: number): number {
    const baseConfidence = Math.min(90, signalCount * 3);
    const avgSignalConfidence = analysis.avgConfidence || 0;
    return Math.round((baseConfidence + avgSignalConfidence) / 2);
  }

  private async getAvailablePathways(): Promise<any[]> {
    // This would fetch from your pathway registry
    // For now, return mock data
    return [
      {
        id: 'meaning-making-exploration',
        title: 'Sacred Meaning-Making',
        category: 'purpose',
        spiritualFrameworks: ['buddhism', 'christianity', 'secular'],
        content: {}
      }
    ];
  }

  private async evaluatePathwayForUser(pathway: any, profile: SpiritualProfile): Promise<SpiritualPathwayRecommendation | null> {
    // This would contain the logic to evaluate if a pathway is suitable
    // Return mock for now
    return {
      pathwayId: pathway.id,
      title: pathway.title,
      spiritualFramework: pathway.spiritualFrameworks,
      culturalAdaptations: [],
      traumaConsiderations: {
        isSafe: true,
        warnings: [],
        alternatives: [],
        supportRequired: false
      },
      meaningMakingApproach: 'hybrid',
      vocabularyAdaptations: {},
      practiceModifications: [],
      communitySupport: {
        availableGroups: [],
        peerMentors: false,
        professionalGuidance: false
      },
      confidenceScore: 75,
      reasoning: ['Matches your spiritual openness level']
    };
  }

  private async getPathwayContent(pathwayId: string): Promise<any> {
    // Fetch pathway content from database
    return {};
  }

  private buildVocabularyMap(profile: SpiritualProfile): Record<string, string> {
    return {
      'God': profile.preferredVocabulary.divine[0] || 'Source',
      'prayer': profile.preferredVocabulary.prayer[0] || 'reflection',
      'sacred': profile.preferredVocabulary.sacred[0] || 'meaningful',
      'blessing': 'gift',
      'sin': 'mistake',
      'salvation': 'healing'
    };
  }

  private adaptContentForProfile(content: any, profile: SpiritualProfile, vocabularyMap: Record<string, string>): any {
    // This would contain logic to adapt content based on profile
    return content;
  }

  private generateCulturalNotes(profile: SpiritualProfile, pathway: any): string[] {
    const notes: string[] = [];
    
    profile.culturalBackground.forEach(culture => {
      notes.push(`This pathway honors ${culture} wisdom traditions`);
    });

    return notes;
  }

  private generateTraumaConsiderations(profile: SpiritualProfile, pathway: any): string[] {
    const considerations: string[] = [];

    if (profile.traumaHistory.religiousTrauma) {
      considerations.push('This pathway uses inclusive language to avoid religious trauma triggers');
      considerations.push('Professional support is available if needed');
      considerations.push('You can opt out of any spiritual content at any time');
    }

    return considerations;
  }
}

export default SpiritualPathwayIntelligence;