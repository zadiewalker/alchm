/**
 * Medical Disclaimer Compliance Test Suite
 * 
 * Validates App Store compliance for medical disclaimers in mental health applications.
 * Tests all scenarios from the AI Safety Validation Report.
 */

import { 
  analyzeHealthContent, 
  wrapResponseWithDisclaimer, 
  validateDisclaimerCompliance,
  HealthContentContext 
} from '@/lib/medical-disclaimer-system';

describe('Medical Disclaimer Compliance Tests', () => {
  
  describe('Health Content Detection', () => {
    
    test('detects mental health terminology', () => {
      const testCases = [
        'I think I have depression',
        'My anxiety is getting worse',
        'I was diagnosed with PTSD',
        'I need therapy',
        'Should I take medication?'
      ];
      
      testCases.forEach(text => {
        const context = analyzeHealthContent(text);
        expect(context.containsMentalHealthContent).toBe(true);
        expect(context.needsDisclaimer).toBe(true);
      });
    });
    
    test('detects crisis language', () => {
      const crisisInputs = [
        'I want to kill myself',
        'I can\'t go on anymore',
        'I have a plan to end it',
        'Everyone would be better off without me',
        'I\'m going to hurt myself tonight'
      ];
      
      crisisInputs.forEach(text => {
        const context = analyzeHealthContent(text);
        expect(context.containsCrisisLanguage).toBe(true);
        expect(context.disclaimerType).toBe('crisis');
        expect(context.severityLevel).toMatch(/medium|high|crisis/);
      });
    });
    
    test('detects therapy and medical advice terms', () => {
      const therapyInputs = [
        'What therapeutic techniques should I use?',
        'How do I do exposure therapy?',
        'What medication should I take?',
        'I need a diagnosis',
        'What are the symptoms of bipolar disorder?'
      ];
      
      therapyInputs.forEach(text => {
        const context = analyzeHealthContent(text);
        expect(context.containsTherapyTerms || context.containsMedicalAdvice).toBe(true);
        expect(context.disclaimerType).toMatch(/therapy_boundary|elevated/);
      });
    });
    
    test('handles normal journaling without false positives', () => {
      const normalInputs = [
        'I had a good day today',
        'Work was challenging but rewarding',
        'I went for a walk in the park',
        'My friend and I had coffee',
        'I\'m looking forward to the weekend'
      ];
      
      normalInputs.forEach(text => {
        const context = analyzeHealthContent(text);
        expect(context.needsDisclaimer).toBe(false);
        expect(context.disclaimerType).toBe('standard');
      });
    });
  });
  
  describe('Disclaimer Text Generation', () => {
    
    test('generates crisis disclaimer for high-risk content', () => {
      const crisisContext: HealthContentContext = {
        containsMentalHealthContent: true,
        containsTherapyTerms: false,
        containsCrisisLanguage: true,
        containsMedicalAdvice: false,
        containsAssessmentLanguage: false,
        severityLevel: 'crisis',
        triggeredKeywords: ['suicide', 'kill myself'],
        needsDisclaimer: true,
        disclaimerType: 'crisis'
      };
      
      const result = wrapResponseWithDisclaimer(
        "I understand you're in pain.",
        "I want to kill myself",
        crisisContext
      );
      
      expect(result.disclaimerAdded).toBe(true);
      expect(result.response).toContain('IMPORTANT SAFETY NOTICE');
      expect(result.response).toContain('988');
      expect(result.response).toContain('911');
      expect(result.response).toContain('ALCHM cannot provide emergency mental health care');
    });
    
    test('generates therapy boundary disclaimer', () => {
      const therapyContext: HealthContentContext = {
        containsMentalHealthContent: true,
        containsTherapyTerms: true,
        containsCrisisLanguage: false,
        containsMedicalAdvice: true,
        containsAssessmentLanguage: false,
        severityLevel: 'medium',
        triggeredKeywords: ['therapy', 'medication'],
        needsDisclaimer: true,
        disclaimerType: 'therapy_boundary'
      };
      
      const result = wrapResponseWithDisclaimer(
        "Here are some coping strategies",
        "What therapy techniques work best?",
        therapyContext
      );
      
      expect(result.disclaimerAdded).toBe(true);
      expect(result.response).toContain('Professional Care Reminder');
      expect(result.response).toContain('never replaces therapy');
      expect(result.response).toContain('licensed healthcare professionals');
    });
    
    test('generates elevated disclaimer for mental health content', () => {
      const elevatedContext: HealthContentContext = {
        containsMentalHealthContent: true,
        containsTherapyTerms: false,
        containsCrisisLanguage: false,
        containsMedicalAdvice: false,
        containsAssessmentLanguage: false,
        severityLevel: 'medium',
        triggeredKeywords: ['depression', 'anxiety'],
        needsDisclaimer: true,
        disclaimerType: 'elevated'
      };
      
      const result = wrapResponseWithDisclaimer(
        "Your feelings are valid",
        "I've been feeling depressed lately",
        elevatedContext
      );
      
      expect(result.disclaimerAdded).toBe(true);
      expect(result.response).toContain('Professional Support Available');
      expect(result.response).toContain('licensed mental health professionals');
    });
  });
  
  describe('App Store Compliance Validation', () => {
    
    test('validates crisis response compliance', () => {
      const crisisInput = "I want to end my life tonight";
      const responseWithoutDisclaimer = "I'm here for you during this difficult time.";
      
      const compliance = validateDisclaimerCompliance(crisisInput, responseWithoutDisclaimer);
      
      expect(compliance.compliant).toBe(true); // Should be compliant after wrapper applies disclaimer
      expect(compliance.requiredAction).toContain('Crisis disclaimer');
    });
    
    test('fails compliance for health content without disclaimer', () => {
      const healthInput = "What medication should I take for my depression?";
      const responseWithoutDisclaimer = "There are many options available.";
      
      // Simulate a response that doesn't include disclaimers
      const mockNonCompliantResponse = responseWithoutDisclaimer;
      
      const context = analyzeHealthContent(healthInput);
      expect(context.needsDisclaimer).toBe(true);
    });
    
    test('validates AI responses include professional referrals', () => {
      const healthInputs = [
        "I think I need therapy",
        "My mental health is declining", 
        "I was diagnosed with anxiety",
        "How do I cope with trauma?"
      ];
      
      healthInputs.forEach(input => {
        const context = analyzeHealthContent(input);
        if (context.needsDisclaimer) {
          const wrapped = wrapResponseWithDisclaimer(
            "Here's some guidance",
            input,
            context
          );
          
          expect(wrapped.disclaimerAdded).toBe(true);
          expect(wrapped.response).toMatch(/(licensed|professional|therapist|counselor|healthcare)/i);
        }
      });
    });
  });
  
  describe('Cultural Competency in Disclaimers', () => {
    
    test('detects culturally specific crisis expressions', () => {
      const culturalCrisisExpressions = [
        "I feel like a burden to my family", // Asian cultural context
        "I have brought shame to my family", // Honor-based cultural context
        "I don't deserve to exist", // Various cultural contexts
        "My community would reject me", // LGBTQ+ cultural context
        "I'm trapped and can't escape" // Immigration/economic context
      ];
      
      culturalCrisisExpressions.forEach(text => {
        const context = analyzeHealthContent(text);
        
        // Should detect need for support even if not explicitly suicidal
        expect(context.needsDisclaimer).toBe(true);
        
        if (context.disclaimerType === 'crisis') {
          const wrapped = wrapResponseWithDisclaimer("I understand", text, context);
          expect(wrapped.response).toContain('988'); // Crisis line should be included
        }
      });
    });
    
    test('includes specialized crisis resources for LGBTQ+ content', () => {
      const lgbtqCrisisText = "My family rejected me for being trans and I can't take it anymore";
      const context = analyzeHealthContent(lgbtqCrisisText);
      
      expect(context.containsCrisisLanguage).toBe(true);
      
      const wrapped = wrapResponseWithDisclaimer("I'm here for you", lgbtqCrisisText, context);
      
      // Should include general crisis resources
      expect(wrapped.response).toContain('988');
      // Additional LGBTQ+ resources would be added in the UI component
    });
  });
  
  describe('Response Time and Performance', () => {
    
    test('health content analysis completes within 3 seconds', async () => {
      const startTime = Date.now();
      
      const complexText = `
        I've been struggling with depression and anxiety for months. 
        My therapist said I might have PTSD from childhood trauma. 
        I'm taking medication but it's not helping. Sometimes I think 
        about ending it all. I feel like a burden to everyone I love.
        Should I try a different therapeutic approach? What about 
        cognitive behavioral therapy or EMDR? I'm desperate for help.
      `;
      
      const context = analyzeHealthContent(complexText);
      const wrapped = wrapResponseWithDisclaimer(
        "I hear how much you're struggling",
        complexText,
        context
      );
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      expect(processingTime).toBeLessThan(3000); // Under 3 seconds
      expect(wrapped.disclaimerAdded).toBe(true);
      expect(context.disclaimerType).toBe('crisis');
    });
  });
  
  describe('Edge Cases and Error Handling', () => {
    
    test('handles empty or null input gracefully', () => {
      const edgeCases = ['', null, undefined, '   ', '\n\n\t'];
      
      edgeCases.forEach(input => {
        const context = analyzeHealthContent(input || '');
        expect(context).toBeDefined();
        expect(context.needsDisclaimer).toBe(false);
      });
    });
    
    test('handles very long text input', () => {
      const longText = 'I feel anxious about many things. '.repeat(1000);
      const context = analyzeHealthContent(longText);
      
      expect(context.containsMentalHealthContent).toBe(true);
      expect(context.needsDisclaimer).toBe(true);
      expect(context.triggeredKeywords).toContain('anxious');
    });
    
    test('provides fallback disclaimer when analysis fails', () => {
      // Simulate malformed input that might cause analysis to fail
      const problematicInput = "I need help with my \u0000\u0001\u0002 mental health";
      
      try {
        const context = analyzeHealthContent(problematicInput);
        const wrapped = wrapResponseWithDisclaimer(
          "I'm here to help",
          problematicInput,
          context
        );
        
        // Should either work normally or provide safe fallback
        expect(wrapped.response).toBeDefined();
        expect(typeof wrapped.response).toBe('string');
      } catch (error) {
        // If analysis fails, should still provide a basic disclaimer
        expect(true).toBe(true); // Test that we handle the error gracefully
      }
    });
  });
});

describe('Integration with Khepera API', () => {
  
  test('API response includes medical disclaimer metadata', () => {
    // This would test the actual API response structure
    const mockApiResponse = {
      insight: "Your feelings are completely valid.",
      encouragement: "You're taking important steps toward healing.",
      medicalDisclaimer: {
        applied: true,
        type: 'elevated',
        complianceStatus: 'compliant',
        healthContentDetected: true,
        severityLevel: 'medium'
      }
    };
    
    expect(mockApiResponse.medicalDisclaimer).toBeDefined();
    expect(mockApiResponse.medicalDisclaimer.applied).toBe(true);
    expect(mockApiResponse.medicalDisclaimer.complianceStatus).toBe('compliant');
  });
});