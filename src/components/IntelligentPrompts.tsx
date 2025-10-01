'use client';

import { useState, useEffect } from 'react';
import { JournalEntry } from '@/lib/journal-service';
import { Timestamp } from 'firebase/firestore';
import { culturalPromptsEngine, CulturalPrompt, CulturalPromptContext } from '@/lib/cultural-prompts-engine';

interface IntelligentPromptsProps {
  entries: JournalEntry[];
  currentMood?: number;
  onPromptSelect: (prompt: string) => void;
  culturalContext?: CulturalPromptContext;
}

interface PromptSuggestion {
  prompt: string;
  category: string;
  emoji: string;
  reason: string;
}

export default function IntelligentPrompts({ entries, currentMood, onPromptSelect, culturalContext }: IntelligentPromptsProps) {
  const [suggestions, setSuggestions] = useState<PromptSuggestion[]>([]);
  const [showPrompts, setShowPrompts] = useState(false);

  const generatePrompts = () => {
    const prompts: PromptSuggestion[] = [];

    // Analyze recent entries for patterns
    const recentEntries = entries.slice(0, 5);
    const recentMoods = recentEntries.map(e => e.mood).filter((mood): mood is number => typeof mood === 'number');
    const recentContent = recentEntries.map(e => e.content.toLowerCase()).join(' ');
    const averageMood = recentMoods.length > 0 ? recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length : 5;

    // Get writing frequency
    const now = new Date();
    const lastWeekEntries = entries.filter(e => {
      const entryDate = e.createdAt instanceof Timestamp ? e.createdAt.toDate() : new Date(e.createdAt);
      return now.getTime() - entryDate.getTime() < 7 * 24 * 60 * 60 * 1000;
    });
    const writingFrequency = lastWeekEntries.length;

    // Mood-based prompts
    if (currentMood && currentMood <= 3) {
      prompts.push({
        prompt: "What's one small thing that could make today feel a little easier or more manageable?",
        category: "Support",
        emoji: "🤗",
        reason: "You seem to be having a challenging day. This can help identify practical support."
      });
      prompts.push({
        prompt: "If a dear friend was feeling exactly how you feel right now, what would you want to tell them?",
        category: "Self-Compassion",
        emoji: "💝",
        reason: "Sometimes we're kinder to others than ourselves. This helps practice self-compassion."
      });
    } else if (currentMood && currentMood >= 8) {
      prompts.push({
        prompt: "What made today special? How can you carry this positive energy forward?",
        category: "Celebration",
        emoji: "✨",
        reason: "You're feeling great! Let's capture and build on this positive moment."
      });
      prompts.push({
        prompt: "What am I most grateful for right now, and how has it shaped my recent experiences?",
        category: "Gratitude",
        emoji: "🙏",
        reason: "Gratitude amplifies positive feelings and creates lasting happiness."
      });
    }

    // Pattern-based prompts
    if (averageMood < 5 && recentEntries.length >= 3) {
      prompts.push({
        prompt: "Looking at my recent experiences, what patterns do I notice? What might be contributing to how I've been feeling?",
        category: "Reflection",
        emoji: "🔍",
        reason: "Your mood has been lower lately. Understanding patterns can help identify what might help."
      });
    }

    // Content-based prompts
    if (recentContent.includes('stress') || recentContent.includes('overwhelm') || recentContent.includes('anxious')) {
      prompts.push({
        prompt: "What are three things currently within my control that I can focus on today?",
        category: "Control",
        emoji: "🎯",
        reason: "You've mentioned stress recently. Focusing on what you can control helps reduce anxiety."
      });
    }

    if (recentContent.includes('lonely') || recentContent.includes('isolated')) {
      prompts.push({
        prompt: "Who in my life brings me joy or comfort? How might I connect with them today?",
        category: "Connection",
        emoji: "🤝",
        reason: "You've mentioned feeling isolated. Connection is vital for mental health."
      });
    }

    // Frequency-based prompts
    if (writingFrequency < 2) {
      prompts.push({
        prompt: "What's been on my mind lately that I haven't had a chance to process or explore?",
        category: "Check-in",
        emoji: "💭",
        reason: "It's been a while since you've written. This helps capture what's been brewing."
      });
    }

    // Growth-focused prompts (for regular writers)
    if (writingFrequency >= 4) {
      prompts.push({
        prompt: "What's one thing I've learned about myself this week, and how might I apply this insight going forward?",
        category: "Growth",
        emoji: "🌱",
        reason: "You're a consistent writer! This helps synthesize your insights into actionable growth."
      });
    }

    // Indigenous Wisdom-Inspired Prompts
    const indigenousWisdomPrompts = [
      {
        prompt: "What does the land around you want you to know today?",
        category: "Land Connection",
        emoji: "🌍",
        reason: "Indigenous wisdom teaches us to listen to the natural world for guidance and healing."
      },
      {
        prompt: "How do the seasons mirror what you're experiencing?",
        category: "Cycles",
        emoji: "🍃",
        reason: "Natural cycles reflect our inner rhythms and can offer perspective on change and growth."
      },
      {
        prompt: "What would seven generations forward want you to remember?",
        category: "Legacy",
        emoji: "🌳",
        reason: "Indigenous wisdom considers the impact of our actions on future generations."
      },
      {
        prompt: "How does your relationship with Mother Earth inform this moment?",
        category: "Sacred Relationship",
        emoji: "🌎",
        reason: "Connection to the earth can provide grounding and wisdom for life's challenges."
      }
    ];

    // Disability Justice Prompts
    const disabilityJusticePrompts = [
      {
        prompt: "Your body-mind has its own wisdom. What is it teaching you?",
        category: "Embodied Wisdom",
        emoji: "🧠",
        reason: "Honoring the wisdom that comes through different ways of being in the world."
      },
      {
        prompt: "How does crip time serve you differently than clock time?",
        category: "Time Justice",
        emoji: "⏰",
        reason: "Recognizing that bodies and minds have their own rhythms and needs."
      },
      {
        prompt: "What accommodations would help your soul flourish?",
        category: "Access Needs",
        emoji: "💫",
        reason: "Centering what you need to thrive, without shame or apology."
      },
      {
        prompt: "How do you define access and belonging for yourself?",
        category: "Belonging",
        emoji: "🏠",
        reason: "Your definition of inclusion and community matters most."
      }
    ];

    // Economic Justice Prompts
    const economicJusticePrompts = [
      {
        prompt: "What resources (material and spiritual) are available to you right now?",
        category: "Resource Awareness",
        emoji: "💎",
        reason: "Recognizing abundance in all its forms, without shame about material circumstances."
      },
      {
        prompt: "How do you find stability when systems feel unstable?",
        category: "Resilience",
        emoji: "⚓",
        reason: "Honoring the strength it takes to navigate economic uncertainty."
      },
      {
        prompt: "What would abundance look like if money weren't a factor?",
        category: "Vision",
        emoji: "🌈",
        reason: "Expanding beyond capitalist definitions of success and wealth."
      },
      {
        prompt: "How do you practice care with limited resources?",
        category: "Mutual Aid",
        emoji: "🤝",
        reason: "Celebrating resourcefulness and community care practices."
      }
    ];

    // Faith & Spirituality Prompts (Optional)
    const faithSpiritualityPrompts = [
      {
        prompt: "If you have spiritual practices, how might they guide you?",
        category: "Spiritual Guidance",
        emoji: "🕯️",
        reason: "Honoring the wisdom from your faith or spiritual traditions."
      },
      {
        prompt: "What wisdom from your traditions speaks to this moment?",
        category: "Ancestral Wisdom",
        emoji: "📿",
        reason: "Drawing on the collective wisdom passed down through generations."
      },
      {
        prompt: "How does your relationship with the sacred inform your choices?",
        category: "Sacred Connection",
        emoji: "🙏",
        reason: "Integrating spiritual perspective with daily decisions and challenges."
      },
      {
        prompt: "What prayers or meditations want to emerge?",
        category: "Contemplation",
        emoji: "🧘",
        reason: "Creating space for whatever spiritual practice feels right for you."
      }
    ];

    // International & Immigrant Perspectives
    const immigrantPerspectivePrompts = [
      {
        prompt: "How do you honor both your heritage and your current home?",
        category: "Cultural Bridge",
        emoji: "🌉",
        reason: "Celebrating the complexity of holding multiple cultural identities."
      },
      {
        prompt: "What wisdom travels with you across borders?",
        category: "Ancestral Knowledge",
        emoji: "🧳",
        reason: "Recognizing the valuable knowledge and perspectives you carry."
      },
      {
        prompt: "How do you navigate between languages and cultures?",
        category: "Code-Switching",
        emoji: "🗣️",
        reason: "Honoring the skill and complexity of existing in multiple cultural contexts."
      },
      {
        prompt: "What does belonging mean when you hold multiple homes?",
        category: "Belonging",
        emoji: "🏡",
        reason: "Exploring identity and connection across different places and communities."
      }
    ];

    // Universal prompts (updated with inclusive language)
    const universalPrompts = [
      {
        prompt: "What would I tell my younger self about what I'm experiencing right now?",
        category: "Wisdom",
        emoji: "🦉",
        reason: "This perspective can provide clarity and self-compassion."
      },
      {
        prompt: "If I could address one challenge in my life, what would it be and why?",
        category: "Values",
        emoji: "⭐",
        reason: "This reveals what matters most to you right now."
      },
      {
        prompt: "What's something I'm proud of recently, even if it seems small?",
        category: "Achievement",
        emoji: "🏆",
        reason: "Celebrating wins builds confidence and resilience."
      },
      {
        prompt: "How has my relationship with myself evolved over time?",
        category: "Self-Awareness",
        emoji: "🪞",
        reason: "Self-relationship is the foundation of all other relationships."
      },
      {
        prompt: "What boundaries serve me well, and which ones might need adjusting?",
        category: "Boundaries",
        emoji: "🛡️",
        reason: "Healthy boundaries are essential for wellbeing and authentic relationships."
      },
      {
        prompt: "What brings me joy that costs nothing or very little?",
        category: "Joy",
        emoji: "😊",
        reason: "Recognizing accessible sources of happiness and fulfillment."
      }
    ];

    // Combine all prompt categories
    const allPromptCategories = [
      indigenousWisdomPrompts,
      disabilityJusticePrompts,
      economicJusticePrompts,
      faithSpiritualityPrompts,
      immigrantPerspectivePrompts,
      universalPrompts
    ];

    // Intelligently select from diverse categories
    // Always include 2-3 universal prompts
    const shuffledUniversal = universalPrompts.sort(() => 0.5 - Math.random()).slice(0, 2);
    prompts.push(...shuffledUniversal);

    // Add diverse perspectives based on various factors
    const remainingSlots = 4 - prompts.length;
    const diversePrompts: PromptSuggestion[] = [];

    // Randomly select from different categories to ensure variety
    allPromptCategories.forEach(category => {
      if (diversePrompts.length < remainingSlots && category.length > 0) {
        const randomPrompt = category[Math.floor(Math.random() * category.length)];
        // Avoid duplicates
        if (randomPrompt && !prompts.some(p => p.prompt === randomPrompt.prompt)) {
          diversePrompts.push(randomPrompt);
        }
      }
    });

    // Add the diverse prompts
    prompts.push(...diversePrompts.slice(0, remainingSlots));

    // Shuffle final selection and limit to 6 max
    const finalPrompts = prompts.sort(() => 0.5 - Math.random()).slice(0, 6);
    setSuggestions(finalPrompts);
  };

  useEffect(() => {
    generatePrompts();
  }, [entries, currentMood]);

  if (suggestions.length === 0) return null;

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button
        onClick={() => setShowPrompts(!showPrompts)}
        style={{
          background: 'transparent',
          border: '2px dashed #cb997e',
          borderRadius: '12px',
          padding: '12px 16px',
          width: '100%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.9rem',
          color: '#cb997e',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#cb997e';
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.color = '#cb997e';
        }}
      >
        <span>💡</span>
        {showPrompts ? 'Hide Writing Prompts' : 'Get AI-Powered Writing Prompts'}
        <span style={{ fontSize: '0.8rem' }}>
          {showPrompts ? '▲' : '▼'}
        </span>
      </button>

      {showPrompts && (
        <div style={{
          marginTop: '1rem',
          background: 'white',
          border: '2px solid #cb997e',
          borderRadius: '12px',
          padding: '1.5rem'
        }}>
          <h4 style={{
            color: '#2e2e2e',
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            fontWeight: '600'
          }}>
            ✨ Personalized Writing Prompts
          </h4>
          <p style={{
            color: '#666',
            fontSize: '0.9rem',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.5'
          }}>
            These prompts are tailored to your recent journal patterns and current mood to help unlock deeper insights.
          </p>

          <div style={{
            display: 'grid',
            gap: '1rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
          }}>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  border: '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: '#fafafa'
                }}
                onClick={() => {
                  onPromptSelect(suggestion.prompt);
                  setShowPrompts(false);
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#f0f7ff';
                  e.currentTarget.style.borderColor = '#8ea876';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fafafa';
                  e.currentTarget.style.borderColor = '#e5e5e5';
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>{suggestion.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      background: '#cb997e',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      display: 'inline-block',
                      marginBottom: '0.5rem'
                    }}>
                      {suggestion.category}
                    </div>
                    <p style={{
                      color: '#2e2e2e',
                      fontSize: '0.9rem',
                      lineHeight: '1.4',
                      margin: 0,
                      fontWeight: '500'
                    }}>
                      "{suggestion.prompt}"
                    </p>
                  </div>
                </div>
                <p style={{
                  color: '#666',
                  fontSize: '0.8rem',
                  margin: 0,
                  fontStyle: 'italic',
                  lineHeight: '1.3'
                }}>
                  {suggestion.reason}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: '#f0f7ff',
            borderRadius: '8px',
            border: '1px solid #8ea876'
          }}>
            <p style={{
              color: '#2e2e2e',
              fontSize: '0.9rem',
              margin: 0,
              fontWeight: '500'
            }}>
              💡 <strong>Tip:</strong> Click any prompt to add it to your journal entry. These suggestions are generated based on your writing patterns, mood trends, and recent themes to help you explore deeper insights and maintain emotional wellness.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}