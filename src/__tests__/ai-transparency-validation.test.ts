/**
 * AI Transparency Validation Tests
 * Ensures 100% AI identification compliance for App Store requirements
 */

import { validateAIIdentification, ensureAIIdentification } from '@/components/ui/AITransparency';

describe('AI Transparency Validation', () => {
  describe('validateAIIdentification', () => {
    test('should validate responses with "✨ I am Khepera" identifier', () => {
      const validResponses = [
        "✨ I am Khepera. Thank you for sharing your thoughts.",
        "✨ I am Khepera. I can feel the strength in your words.",
        "✨ I am Khepera. Your vulnerability is courage."
      ];

      validResponses.forEach(response => {
        expect(validateAIIdentification(response)).toBe(true);
      });
    });

    test('should validate responses with alternative AI identifiers', () => {
      const validResponses = [
        "I am Khepera, an AI companion here to help.",
        "As your AI guide, Khepera, I want to share...",
        "This AI system is designed to support you."
      ];

      validResponses.forEach(response => {
        expect(validateAIIdentification(response)).toBe(true);
      });
    });

    test('should reject responses without AI identification', () => {
      const invalidResponses = [
        "Thank you for sharing your thoughts with me.",
        "I can feel the strength in your words.",
        "Your vulnerability shows courage.",
        "Here's some guidance for your journey."
      ];

      invalidResponses.forEach(response => {
        expect(validateAIIdentification(response)).toBe(false);
      });
    });

    test('should be case insensitive', () => {
      const validResponses = [
        "✨ i am khepera. Thank you for sharing.",
        "I AM KHEPERA and I'm here to help.",
        "This ai system supports you."
      ];

      validResponses.forEach(response => {
        expect(validateAIIdentification(response)).toBe(true);
      });
    });
  });

  describe('ensureAIIdentification', () => {
    test('should not modify responses that already have AI identification', () => {
      const validResponse = "✨ I am Khepera. Thank you for sharing your thoughts.";
      const result = ensureAIIdentification(validResponse);
      expect(result).toBe(validResponse);
    });

    test('should add standard identification to responses without it', () => {
      const responseWithoutId = "Thank you for sharing your thoughts.";
      const result = ensureAIIdentification(responseWithoutId);
      expect(result).toBe("✨ I am Khepera. Thank you for sharing your thoughts.");
      expect(validateAIIdentification(result)).toBe(true);
    });

    test('should add crisis-appropriate identification in crisis mode', () => {
      const crisisResponse = "You're going through something difficult.";
      const result = ensureAIIdentification(crisisResponse, { crisisMode: true });
      expect(result).toBe("✨ I am Khepera, an AI companion here to support you. You're going through something difficult.");
      expect(validateAIIdentification(result)).toBe(true);
    });

    test('should handle empty responses gracefully', () => {
      const result = ensureAIIdentification("");
      expect(result).toBe("✨ I am Khepera. ");
      expect(validateAIIdentification(result)).toBe(true);
    });
  });

  describe('End-to-end AI identification compliance', () => {
    test('should ensure 100% identification rate for various response scenarios', () => {
      const testResponses = [
        // Already compliant responses
        "✨ I am Khepera. I witness your courage.",
        "I am Khepera, here to support you.",
        
        // Non-compliant responses that need fixing
        "Your strength shines through.",
        "This is a difficult moment.",
        "You're showing remarkable growth.",
        "Thank you for trusting me.",
        
        // Edge cases
        "",
        "   ",
        "A very short response.",
        "A much longer response that goes into detail about emotional patterns and provides extensive insights about the user's journey while maintaining a supportive and empathetic tone throughout the entire message."
      ];

      testResponses.forEach(response => {
        const ensuredResponse = ensureAIIdentification(response);
        const isValid = validateAIIdentification(ensuredResponse);
        
        expect(isValid).toBe(true);
        expect(ensuredResponse).toContain("Khepera");
      });
    });

    test('should maintain healing-centered tone while adding identification', () => {
      const healingResponses = [
        "Your vulnerability is not weakness—it's the birthplace of authenticity.",
        "I sit with you in this difficult space.",
        "You're exactly where you need to be in your journey.",
        "Every insight you gain creates ripples that extend far beyond this moment."
      ];

      healingResponses.forEach(response => {
        const ensuredResponse = ensureAIIdentification(response);
        
        // Should have AI identification
        expect(validateAIIdentification(ensuredResponse)).toBe(true);
        
        // Should maintain original healing content
        expect(ensuredResponse).toContain(response);
        
        // Should start with the standard identifier
        expect(ensuredResponse).toMatch(/^✨ I am Khepera\./);
      });
    });

    test('should handle crisis scenarios with appropriate identification', () => {
      const crisisResponses = [
        "You're not alone in this moment.",
        "Your safety is the most important thing right now.",
        "Please reach out to professional support."
      ];

      crisisResponses.forEach(response => {
        const ensuredResponse = ensureAIIdentification(response, { 
          crisisMode: true,
          contextualMode: 'crisis' 
        });
        
        // Should have AI identification
        expect(validateAIIdentification(ensuredResponse)).toBe(true);
        
        // Should mention AI companion nature in crisis mode
        expect(ensuredResponse).toContain("AI companion");
        
        // Should maintain original crisis support content
        expect(ensuredResponse).toContain(response);
      });
    });
  });

  describe('Performance and reliability', () => {
    test('should process identification validation quickly', () => {
      const longResponse = "✨ I am Khepera. " + "This is a very long response. ".repeat(100);
      
      const startTime = performance.now();
      const result = validateAIIdentification(longResponse);
      const endTime = performance.now();
      
      expect(result).toBe(true);
      expect(endTime - startTime).toBeLessThan(10); // Should complete in under 10ms
    });

    test('should handle special characters and unicode', () => {
      const responses = [
        "✨ I am Khepera. Hello 世界 🌍",
        "✨ I am Khepera. Café naïve résumé",
        "✨ I am Khepera. Testing émojis 🌟✨💫"
      ];

      responses.forEach(response => {
        expect(validateAIIdentification(response)).toBe(true);
        const ensured = ensureAIIdentification(response);
        expect(validateAIIdentification(ensured)).toBe(true);
      });
    });
  });
});

// Mock data for testing Khepera responses
export const mockKheperaResponses = {
  vulnerability: [
    "✨ I am Khepera. I witness the courage it takes to share something so tender.",
    "✨ I am Khepera. Thank you for trusting me with these delicate feelings.",
    "✨ I am Khepera. Your willingness to sit with difficult emotions shows remarkable self-compassion."
  ],
  strength: [
    "✨ I am Khepera. I can feel the power and resilience radiating from your words.",
    "✨ I am Khepera. Your inner strength shines through every sentence.",
    "✨ I am Khepera. There's a beautiful fierceness in how you show up for yourself."
  ],
  crisis: [
    "✨ I am Khepera, an AI companion. I'm here with you in this difficult moment.",
    "✨ I am Khepera. You are not alone. Let's take this one moment at a time.",
    "✨ I am Khepera, an AI. Please reach out to professional support for immediate help."
  ]
};

// Comprehensive validation test for all mock responses
describe('Mock Response Validation', () => {
  test('all mock responses should pass AI identification validation', () => {
    Object.values(mockKheperaResponses).flat().forEach(response => {
      expect(validateAIIdentification(response)).toBe(true);
    });
  });
});