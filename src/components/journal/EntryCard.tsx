'use client';

import { AppCard } from '@/components/ui/AppCard';
import { AppText } from '@/components/ui/AppText';
import { useInternalNavigation } from '@/hooks/useInternalNavigation';
import type { EntryCardProps } from '@/types/journal';

const MOOD_COLORS: Record<string, string> = {
  anxious: 'var(--color-sage-500)',
  heavy: 'var(--color-sage-400)',
  numb: 'var(--color-sage-600)',
  restless: 'var(--color-sage-500)',
  tender: 'var(--color-text-secondary)',
  hopeful: 'var(--color-text-secondary)',
  alive: 'var(--color-text-primary)',
  shattered: 'var(--color-sage-300)',
  calm: 'var(--color-sage-400)',
  burning: 'var(--color-text-primary)'
};

function formatEntryDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
  
  if (diffInHours < 168) { // Within a week
    return date.toLocaleDateString('en-US', { 
      weekday: 'long' 
    });
  }
  
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
}

function createEntryExcerpt(content: string): string {
  if (!content) return 'Untitled reflection';
  
  // Clean up content and create meaningful excerpt
  const cleaned = content
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleaned.length <= 85) return cleaned;
  
  // Find natural break point
  const words = cleaned.split(' ');
  let excerpt = '';
  
  for (const word of words) {
    if ((excerpt + ' ' + word).length > 85) break;
    excerpt = excerpt ? excerpt + ' ' + word : word;
  }
  
  return excerpt + '...';
}

function getPrimaryMood(moods: string[]): string | null {
  if (!moods || moods.length === 0) return null;
  return moods[0];
}

export function EntryCard({ 
  entry, 
  showMood = true, 
  showKheperaIndicator = true 
}: EntryCardProps): React.JSX.Element {
  const { navigate } = useInternalNavigation();
  const primaryMood = getPrimaryMood(entry.moodWords || entry.emotions || []);
  const moodColor = primaryMood ? MOOD_COLORS[primaryMood] : undefined;
  const hasKheperaResponse = Boolean(entry.kheperaReflection);

  return (
    <button
      type="button"
      onClick={() => navigate(`/journal/?id=${entry.id}`, { source: 'entry_card', surface: 'dashboard' })}
      className="entry-card-link"
    >
      <AppCard className="entry-card">
        {showMood && moodColor && (
          <div
            className="entry-card-mood-stripe"
            style={{ background: moodColor }}
          />
        )}

        <div className="entry-card-header">
          <AppText variant="caption" as="span" className="entry-card-date">
            {formatEntryDate(entry.createdAt instanceof Date ? entry.createdAt.toISOString() : entry.createdAt)}
          </AppText>

          <div className="entry-card-meta">
            {showMood && primaryMood && (
              <AppText
                variant="caption"
                as="span"
                className="entry-card-mood-chip"
                style={{ background: moodColor, color: 'var(--text-primary)' }}
              >
                {primaryMood}
              </AppText>
            )}

            {showKheperaIndicator && hasKheperaResponse && (
              <div className="entry-card-khepera-dot" />
            )}
          </div>
        </div>

        <AppText variant="body" as="p" className="entry-card-excerpt">
          {createEntryExcerpt(String(entry.content || ''))}
        </AppText>

        {entry.tags && entry.tags.length > 0 && (
          <div className="entry-card-tags">
            {entry.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="entry-card-tag">
                <AppText variant="caption" as="span" className="entry-card-tag-text">
                  {tag}
                </AppText>
              </span>
            ))}
            {entry.tags.length > 3 && (
              <AppText variant="caption" as="span" className="entry-card-more">
                +{entry.tags.length - 3}
              </AppText>
            )}
          </div>
        )}
      </AppCard>
    </button>
  );
}
