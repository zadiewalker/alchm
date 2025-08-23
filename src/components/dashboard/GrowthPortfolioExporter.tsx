// ALCHM Growth Portfolio Exporter
// Creates beautiful, printable growth portfolios for users, families, and educators
// Transforms data into narrative stories of becoming

import React, { useState, useRef } from 'react';
import { 
  DocumentArrowDownIcon, 
  PrinterIcon, 
  ShareIcon,
  SparklesIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import {
  GrowthPortfolio,
  Badge,
  EmotionalTerrain
} from '@/lib/memory-garden-analytics';
import { useSacredMicrocopy } from '@/components/SacredMicrocopyProvider';
import KheperaScarabIcon from '@/components/khepera/KheperaScarabIcons';

// ===== INTERFACE TYPES =====

interface GrowthPortfolioExporterProps {
  portfolio: GrowthPortfolio;
  onClose: () => void;
  onExport: (format: 'pdf' | 'print' | 'share') => void;
  className?: string;
}

interface PortfolioSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  printPageBreak?: boolean;
}

// ===== MAIN COMPONENT =====

export default function GrowthPortfolioExporter({
  portfolio,
  onClose,
  onExport,
  className = ''
}: GrowthPortfolioExporterProps) {
  
  const { getSacredButton } = useSacredMicrocopy();
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set([
    'journey-highlights',
    'emotional-terrain', 
    'ai-themes',
    'badges',
    'wisdom'
  ]));

  const toggleSection = (sectionId: string) => {
    const newSelected = new Set(selectedSections);
    if (newSelected.has(sectionId)) {
      newSelected.delete(sectionId);
    } else {
      newSelected.add(sectionId);
    }
    setSelectedSections(newSelected);
  };

  const handleExport = (format: 'pdf' | 'print' | 'share') => {
    onExport(format);
  };

  const formatDateRange = (start: Date, end: Date) => {
    const startStr = start.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    const endStr = end.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    return `${startStr} - ${endStr}`;
  };

  return (
    <div className={`growth-portfolio-exporter ${className}`}>
      {/* Export Controls */}
      <div className="export-controls bg-surface-elevated border border-healing-mist rounded-lg p-space-gentle mb-space-gentle">
        <div className="flex items-center justify-between mb-space-gentle">
          <h2 className="text-text-primary font-weight-presence text-text-vibrant">
            Growth Portfolio
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Section Selection */}
        <div className="section-selector mb-space-gentle">
          <h3 className="text-text-primary font-weight-presence mb-space-breath">
            Include in Portfolio:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-space-breath">
            {[
              { id: 'journey-highlights', label: 'Journey Highlights' },
              { id: 'emotional-terrain', label: 'Emotional Landscape' },
              { id: 'ai-themes', label: 'Growth Themes' },
              { id: 'badges', label: 'Celebrations' },
              { id: 'wisdom', label: 'Wisdom Collected' },
              { id: 'future-intentions', label: 'Future Intentions' }
            ].map((section) => (
              <label key={section.id} className="section-checkbox flex items-center gap-space-whisper">
                <input
                  type="checkbox"
                  checked={selectedSections.has(section.id)}
                  onChange={() => toggleSection(section.id)}
                  className="sacred-checkbox"
                />
                <span className="text-text-breath">{section.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Export Actions */}
        <div className="export-actions flex gap-space-breath">
          <button
            onClick={() => handleExport('pdf')}
            className="sacred-button sacred-button-primary flex items-center gap-space-whisper"
          >
            <DocumentArrowDownIcon className="w-4 h-4" />
            {getSacredButton('download', 'Download PDF')}
          </button>
          
          <button
            onClick={() => handleExport('print')}
            className="sacred-button sacred-button-secondary flex items-center gap-space-whisper"
          >
            <PrinterIcon className="w-4 h-4" />
            {getSacredButton('print', 'Print Portfolio')}
          </button>
          
          <button
            onClick={() => handleExport('share')}
            className="sacred-button sacred-button-secondary flex items-center gap-space-whisper"
          >
            <ShareIcon className="w-4 h-4" />
            {getSacredButton('share', 'Share Link')}
          </button>
        </div>
      </div>

      {/* Portfolio Preview */}
      <div 
        ref={portfolioRef}
        className="portfolio-preview bg-white border border-healing-mist rounded-lg shadow-lg"
      >
        
        {/* Portfolio Header */}
        <div className="portfolio-header bg-gradient-to-br from-primary-whisper to-soft-blush-whisper p-space-ritual border-b border-healing-mist">
          <div className="flex items-center justify-center mb-space-gentle">
            <div className="portfolio-icon-container">
              <KheperaScarabIcon size={64} mode="affirming" showAura={true} />
              <SparklesIcon className="w-6 h-6 text-soft-blush floating-top-right" />
              <HeartIcon className="w-5 h-5 text-warm-terra floating-bottom-left" />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="portfolio-title text-3xl font-weight-ceremony text-text-primary mb-space-breath">
              {portfolio.userInfo.name}'s Growth Portfolio
            </h1>
            <div className="portfolio-subtitle text-text-secondary text-text-presence">
              A Journey of Sacred Becoming
            </div>
            <div className="portfolio-date-range text-text-tertiary text-text-breath mt-space-breath">
              {formatDateRange(portfolio.userInfo.portfolioDateRange.start, portfolio.userInfo.portfolioDateRange.end)}
            </div>
          </div>
        </div>

        {/* Poetic Summary */}
        <PortfolioSection
          title="Your Sacred Story"
          icon={<SparklesIcon className="w-5 h-5" />}
        >
          <div className="poetic-summary bg-soft-blush-whisper p-space-gentle rounded-lg">
            <p className="text-text-primary text-text-presence leading-spacious italic">
              "{portfolio.poeticSummary}"
            </p>
          </div>
        </PortfolioSection>

        {/* Journey Highlights */}
        {selectedSections.has('journey-highlights') && (
          <PortfolioSection
            title="Journey Highlights"
            icon={<StarIcon className="w-5 h-5" />}
          >
            <div className="highlights-grid grid grid-cols-2 md:grid-cols-4 gap-space-gentle">
              <div className="highlight-stat text-center">
                <div className="stat-number text-2xl font-weight-ceremony text-primary">
                  {portfolio.journeyHighlights.totalDaysJournaled}
                </div>
                <div className="stat-label text-text-secondary text-text-breath">
                  Days of Sacred Attention
                </div>
              </div>
              
              <div className="highlight-stat text-center">
                <div className="stat-number text-2xl font-weight-ceremony text-warm-terra">
                  {portfolio.journeyHighlights.longestStreak}
                </div>
                <div className="stat-label text-text-secondary text-text-breath">
                  Longest Consistency
                </div>
              </div>
              
              <div className="highlight-stat text-center">
                <div className="stat-number text-2xl font-weight-ceremony text-soft-blush">
                  {portfolio.journeyHighlights.badgesEarned.length}
                </div>
                <div className="stat-label text-text-secondary text-text-breath">
                  Celebrations Earned
                </div>
              </div>
              
              <div className="highlight-stat text-center">
                <div className="stat-number text-2xl font-weight-ceremony text-primary">
                  {portfolio.journeyHighlights.growthMoments.length}
                </div>
                <div className="stat-label text-text-secondary text-text-breath">
                  Growth Moments
                </div>
              </div>
            </div>
          </PortfolioSection>
        )}

        {/* Emotional Terrain */}
        {selectedSections.has('emotional-terrain') && (
          <PortfolioSection
            title="Emotional Landscape"
            icon={<HeartIcon className="w-5 h-5" />}
            printPageBreak={true}
          >
            <EmotionalTerrainVisual terrain={portfolio.emotionalTerrain} />
          </PortfolioSection>
        )}

        {/* AI Themes */}
        {selectedSections.has('ai-themes') && (
          <PortfolioSection
            title="Poetry of Growth"
            icon={<SparklesIcon className="w-5 h-5" />}
          >
            <div className="ai-themes-grid grid grid-cols-1 md:grid-cols-2 gap-space-gentle">
              {portfolio.journeyHighlights.aiThemes.map((theme, index) => (
                <div key={index} className="theme-quote bg-healing-whisper p-space-gentle rounded-lg">
                  <p className="text-text-primary italic leading-relaxed">
                    "{theme}"
                  </p>
                </div>
              ))}
            </div>
          </PortfolioSection>
        )}

        {/* Badges Earned */}
        {selectedSections.has('badges') && (
          <PortfolioSection
            title="Celebrations of Growth"
            icon={<StarIcon className="w-5 h-5" />}
          >
            <BadgeShowcase badges={portfolio.journeyHighlights.badgesEarned} />
          </PortfolioSection>
        )}

        {/* Wisdom Collected */}
        {selectedSections.has('wisdom') && portfolio.wisdomCollected.length > 0 && (
          <PortfolioSection
            title="Wisdom Collected"
            icon={<SparklesIcon className="w-5 h-5" />}
            printPageBreak={true}
          >
            <div className="wisdom-collection space-y-space-breath">
              {portfolio.wisdomCollected.map((wisdom, index) => (
                <div key={index} className="wisdom-item bg-primary-whisper p-space-gentle rounded-lg">
                  <p className="text-text-primary leading-relaxed">
                    {wisdom}
                  </p>
                </div>
              ))}
            </div>
          </PortfolioSection>
        )}

        {/* Future Intentions */}
        {selectedSections.has('future-intentions') && (
          <PortfolioSection
            title="Seeds for Tomorrow"
            icon={<HeartIcon className="w-5 h-5" />}
          >
            <div className="future-intentions bg-soft-blush-whisper p-space-gentle rounded-lg">
              <p className="text-text-secondary text-text-breath mb-space-gentle">
                As you continue this sacred journey of becoming, what intentions will guide your next season of growth?
              </p>
              
              <div className="intentions-space">
                {portfolio.futureIntentions.length > 0 ? (
                  <ul className="space-y-space-breath">
                    {portfolio.futureIntentions.map((intention, index) => (
                      <li key={index} className="flex items-start gap-space-breath">
                        <div className="w-2 h-2 bg-soft-blush rounded-full mt-2 flex-shrink-0" />
                        <span className="text-text-primary">{intention}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="intentions-lines space-y-space-gentle">
                    {[1, 2, 3, 4, 5].map((line) => (
                      <div key={line} className="intention-line border-b border-healing-mist pb-space-breath">
                        <div className="text-text-tertiary text-text-breath">
                          {line === 1 && 'I am growing toward...'}
                          {line === 2 && 'I want to cultivate...'}
                          {line === 3 && 'I am ready to release...'}
                          {line === 4 && 'I hope to learn...'}
                          {line === 5 && 'My heart is calling me to...'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </PortfolioSection>
        )}

        {/* Portfolio Footer */}
        <div className="portfolio-footer bg-healing-whisper p-space-gentle text-center border-t border-healing-mist">
          <p className="text-text-secondary text-text-breath italic">
            "Every journey of a thousand miles begins with a single step. Every garden begins with a single seed. 
            Your growth is a gift to the world."
          </p>
          <div className="footer-logo mt-space-breath">
            <KheperaScarabIcon size={24} mode="present" />
            <span className="text-text-tertiary text-text-whisper ml-space-breath">
              ALCHM - Sacred Technology for Human Flourishing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== PORTFOLIO SECTION COMPONENT =====

function PortfolioSection({ 
  title, 
  icon, 
  children, 
  printPageBreak = false 
}: PortfolioSectionProps) {
  return (
    <div className={`portfolio-section p-space-gentle border-b border-healing-mist ${printPageBreak ? 'print-page-break' : ''}`}>
      <div className="section-header flex items-center gap-space-breath mb-space-gentle">
        <div className="section-icon text-warm-terra">
          {icon}
        </div>
        <h2 className="section-title text-text-primary font-weight-presence text-text-vibrant">
          {title}
        </h2>
      </div>
      <div className="section-content">
        {children}
      </div>
    </div>
  );
}

// ===== EMOTIONAL TERRAIN VISUAL =====

function EmotionalTerrainVisual({ terrain }: { terrain: EmotionalTerrain }) {
  const metrics = [
    { key: 'resilience', label: 'Resilience', color: '#a4b792', description: 'Your ability to navigate challenges with grace' },
    { key: 'clarity', label: 'Clarity', color: '#cb997e', description: 'Your understanding of yourself and your path' },
    { key: 'selfCompassion', label: 'Self-Compassion', color: '#eeddd3', description: 'The kindness you show yourself' },
    { key: 'connection', label: 'Connection', color: '#f9f6f1', description: 'Your sense of belonging and community' },
    { key: 'culturalGrounding', label: 'Cultural Grounding', color: '#a4b792', description: 'Your connection to cultural wisdom and heritage' }
  ];

  return (
    <div className="emotional-terrain-visual">
      <div className="terrain-chart space-y-space-gentle">
        {metrics.map((metric) => (
          <div key={metric.key} className="terrain-row">
            <div className="flex justify-between items-center mb-space-whisper">
              <div className="metric-info">
                <div className="metric-label text-text-primary font-weight-presence">
                  {metric.label}
                </div>
                <div className="metric-description text-text-secondary text-text-breath">
                  {metric.description}
                </div>
              </div>
              <div className="metric-score text-lg font-weight-presence text-primary">
                {Math.round(terrain[metric.key as keyof EmotionalTerrain] * 100)}%
              </div>
            </div>
            
            <div className="terrain-visual-bar bg-healing-mist rounded-full h-3 overflow-hidden">
              <div 
                className="terrain-visual-fill h-full rounded-full transition-all"
                style={{ 
                  width: `${terrain[metric.key as keyof EmotionalTerrain] * 100}%`,
                  backgroundColor: metric.color
                }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="terrain-summary mt-space-gentle p-space-gentle bg-primary-whisper rounded-lg">
        <div className="text-center">
          <div className="overall-score text-xl font-weight-ceremony text-primary mb-space-breath">
            {Math.round(terrain.overallWellbeing * 100)}% Overall Flourishing
          </div>
          <p className="text-text-secondary">
            {terrain.overallWellbeing > 0.8 ? 'Your emotional landscape shows vibrant growth across all areas of wellbeing.' :
             terrain.overallWellbeing > 0.6 ? 'You are cultivating steady growth and resilience in your emotional journey.' :
             terrain.overallWellbeing > 0.4 ? 'Seeds of growth are planted and beginning to flourish in your emotional garden.' :
             'You are in the sacred early stages of tending your emotional landscape with care.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== BADGE SHOWCASE =====

function BadgeShowcase({ badges }: { badges: Badge[] }) {
  const badgesByCategory = badges.reduce((acc, badge) => {
    if (!acc[badge.category]) {
      acc[badge.category] = [];
    }
    acc[badge.category].push(badge);
    return acc;
  }, {} as Record<string, Badge[]>);

  const getBadgeColor = (color: string) => {
    const colors = {
      sage: '#a4b792',
      terra: '#cb997e', 
      blush: '#eeddd3',
      healing: '#f9f6f1'
    };
    return colors[color as keyof typeof colors] || colors.sage;
  };

  return (
    <div className="badge-showcase">
      {Object.entries(badgesByCategory).map(([category, categoryBadges]) => (
        <div key={category} className="badge-category mb-space-gentle">
          <h3 className="category-title text-text-primary font-weight-presence mb-space-breath capitalize">
            {category.replace('_', ' ')} Celebrations
          </h3>
          
          <div className="badge-grid grid grid-cols-2 md:grid-cols-3 gap-space-breath">
            {categoryBadges.map((badge, index) => (
              <div 
                key={`${badge.id}-${index}`}
                className="portfolio-badge text-center p-space-breath rounded-lg border"
                style={{ 
                  backgroundColor: `${getBadgeColor(badge.color)}20`,
                  borderColor: `${getBadgeColor(badge.color)}40`
                }}
              >
                <div 
                  className="badge-visual w-12 h-12 rounded-full mx-auto mb-space-breath flex items-center justify-center"
                  style={{ backgroundColor: getBadgeColor(badge.color) }}
                >
                  <StarIcon className="w-6 h-6 text-white" />
                </div>
                
                <div className="badge-info">
                  <div className="badge-name text-text-primary font-weight-presence text-text-breath">
                    {badge.name}
                  </div>
                  <div className="badge-description text-text-secondary text-text-whisper">
                    {badge.description}
                  </div>
                  <div className="badge-date text-text-tertiary text-text-whisper mt-space-whisper">
                    {badge.earnedDate.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GrowthPortfolioExporter;