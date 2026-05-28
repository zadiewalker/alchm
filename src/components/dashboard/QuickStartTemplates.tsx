'use client';

import { AppText } from '@/components/ui/AppText';
import type { QuickStartTemplatesProps, QuickTemplate } from '@/types/dashboard';

export const QUICK_TEMPLATES: QuickTemplate[] = [
  {
    id: 'daily-check',
    title: 'Daily Check-in',
    prompt: 'How am I showing up today? What needs attention?',
    icon: '🌅'
  },
  {
    id: 'gratitude',
    title: 'Three Things',
    prompt: 'Three things I notice, appreciate, or want to remember from today:',
    icon: '✨'
  },
  {
    id: 'feeling-through',
    title: 'Feeling Through',
    prompt: 'What am I feeling right now, and what might it be trying to tell me?',
    icon: '🌊'
  },
  {
    id: 'tension-release',
    title: 'Where I Hold It',
    prompt: 'Where do I feel tension in my body? What would it say if it could speak?',
    icon: '🫀'
  },
  {
    id: 'pattern-notice',
    title: 'What returned today',
    prompt: 'What came back into view today? How did it meet the day with me?',
    icon: '🔍'
  },
  {
    id: 'tomorrow-intention',
    title: 'Tomorrow\'s Intention',
    prompt: 'What do I want to carry into tomorrow? What can I leave behind?',
    icon: '🌱'
  },
  {
    id: 'difficult-moment',
    title: 'Difficult Moment',
    prompt: 'Something challenging happened. Let me write through it without needing to fix anything.',
    icon: '⚡'
  },
  {
    id: 'joy-capture',
    title: 'Joy Capture',
    prompt: 'A moment of lightness or joy today that I want to hold onto:',
    icon: '☀️'
  }
];

export function QuickStartTemplates({ onTemplateSelect, selectedMood }: QuickStartTemplatesProps): React.JSX.Element {
  // Filter templates based on mood if selected
  const getRecommendedTemplates = (): QuickTemplate[] => {
    if (!selectedMood) return QUICK_TEMPLATES;
    
    const moodTemplateMap: Record<string, string[]> = {
      anxious: ['feeling-through', 'tension-release', 'daily-check'],
      heavy: ['feeling-through', 'difficult-moment', 'tension-release'],
      numb: ['tension-release', 'pattern-notice', 'daily-check'],
      restless: ['pattern-notice', 'tension-release', 'tomorrow-intention'],
      tender: ['feeling-through', 'gratitude', 'joy-capture'],
      hopeful: ['tomorrow-intention', 'gratitude', 'joy-capture'],
      alive: ['joy-capture', 'gratitude', 'daily-check'],
      shattered: ['difficult-moment', 'feeling-through', 'tension-release'],
      calm: ['gratitude', 'pattern-notice', 'tomorrow-intention'],
      burning: ['difficult-moment', 'pattern-notice', 'feeling-through']
    };
    
    const recommended = moodTemplateMap[selectedMood] || [];
    const recommendedTemplates = QUICK_TEMPLATES.filter(t => recommended.includes(t.id));
    const otherTemplates = QUICK_TEMPLATES.filter(t => !recommended.includes(t.id));
    
    return [...recommendedTemplates, ...otherTemplates];
  };

  const templates = getRecommendedTemplates();
  const recommendedIds = selectedMood
    ? new Set(getRecommendedTemplates().slice(0, 3).map((template) => template.id))
    : new Set<string>();

  return (
    <div className="dashboard-template-stack">
      <AppText variant="caption" as="label">
        {selectedMood ? `For when you're ${selectedMood}` : 'A place to begin'}
      </AppText>

      <div className="dashboard-template-grid">
        {templates.slice(0, 4).map((template) => {
          const isRecommended = recommendedIds.has(template.id);
          
          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onTemplateSelect(template)}
              className={['dashboard-template-card', isRecommended ? 'is-recommended' : ''].filter(Boolean).join(' ')}
            >
              <div className="dashboard-template-content">
                <span style={{ fontSize: '16px' }}>{template.icon}</span>
                <div>
                  <AppText variant="body" as="div" className="dashboard-template-title">
                    {template.title}
                  </AppText>
                  <AppText variant="caption" as="div">
                    {template.prompt}
                  </AppText>
                </div>
              </div>
              
              {isRecommended && (
                <div className="dashboard-template-dot" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
