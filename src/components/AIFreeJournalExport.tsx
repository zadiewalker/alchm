'use client';

import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { SacredCard, SacredText, SacredButton, SacredGrid } from '@/components/SacredUIFoundation';
import { AIFreeExportEngine, AIFreeExportOptions, ExportResult, DateRangeFilter } from '@/lib/ai-free-export-engine';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    wordCount: number;
    timeSpent: number;
    promptUsed?: string;
    culturalContext?: string;
    analogMode: boolean;
  };
}

interface AIFreeJournalExportProps {
  userId: string;
  entries?: JournalEntry[];
  onExportComplete?: (result: ExportResult) => void;
  className?: string;
}

export default function AIFreeJournalExport({
  userId,
  entries = [],
  onExportComplete,
  className = ''
}: AIFreeJournalExportProps) {
  const [exportOptions, setExportOptions] = useState<AIFreeExportOptions>({
    format: 'pdf',
    dateRange: { type: 'all' },
    includeMetadata: true,
    excludeAIContent: true,
    stripAIMetadata: true,
    includeAnalogOnly: false,
    redactSensitiveInfo: true,
    exportQuality: 'standard',
    customStyling: {
      fontFamily: 'Georgia, serif',
      fontSize: 12,
      lineSpacing: 1.6,
      margins: '1in',
      colorScheme: 'default',
      pageOrientation: 'portrait',
      headerFooter: true,
      tableOfContents: false
    }
  });
  
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportEngine] = useState(() => AIFreeExportEngine.getInstance());
  const [previewData, setPreviewData] = useState<{
    filteredCount: number;
    totalWords: number;
    dateRange: string;
    aiContentExcluded: number;
  } | null>(null);

  // Update preview data when options or entries change
  useEffect(() => {
    updatePreviewData();
  }, [exportOptions, entries]);

  const updatePreviewData = () => {
    // Simulate filtering to show preview
    let filtered = entries;
    
    if (exportOptions.excludeAIContent) {
      filtered = filtered.filter(entry => 
        entry.metadata.analogMode || !entry.metadata.promptUsed?.includes('AI')
      );
    }
    
    if (exportOptions.includeAnalogOnly) {
      filtered = filtered.filter(entry => entry.metadata.analogMode);
    }

    const totalWords = filtered.reduce((sum, entry) => sum + entry.metadata.wordCount, 0);
    const aiContentExcluded = entries.length - filtered.length;
    
    setPreviewData({
      filteredCount: filtered.length,
      totalWords,
      dateRange: getDateRangeDescription(filtered),
      aiContentExcluded
    });
  };

  const getDateRangeDescription = (filteredEntries: JournalEntry[]): string => {
    if (filteredEntries.length === 0) return 'No entries';
    const sorted = filteredEntries.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const first = format(sorted[0].createdAt, 'MMM yyyy');
    const last = format(sorted[sorted.length - 1].createdAt, 'MMM yyyy');
    return first === last ? first : `${first} - ${last}`;
  };

  const updateExportOption = (key: keyof AIFreeExportOptions, value: any) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const updateDateRange = (type: string, startDate?: string, endDate?: string) => {
    setExportOptions(prev => ({
      ...prev,
      dateRange: {
        type: type as any,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined
      }
    }));
  };

  const updateCustomStyling = (key: string, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      customStyling: {
        ...prev.customStyling,
        [key]: value
      }
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    try {
      if (!previewData || previewData.filteredCount === 0) {
        alert('No entries found for the selected criteria.');
        setIsExporting(false);
        return;
      }

      // Simulate progress for user feedback
      const progressInterval = setInterval(() => {
        setExportProgress(prev => Math.min(prev + 15, 90));
      }, 300);

      // Use the AI-Free Export Engine
      const result = await exportEngine.exportJournal(userId, entries, exportOptions);
      
      clearInterval(progressInterval);
      setExportProgress(100);

      // Create download link
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = result.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Log export for audit purposes
      await logExportEvent(result.metadata.totalEntries, exportOptions.format, result.auditLog);

      // Notify parent component if callback provided
      if (onExportComplete) {
        onExportComplete(result);
      }

      setTimeout(() => {
        setIsExporting(false);
        setExportProgress(0);
      }, 1000);

    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const logExportEvent = async (entryCount: number, format: string, auditLog: any) => {
    try {
      await fetch('/api/audit/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...auditLog,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log export event:', error);
      // Non-critical error, don't stop the export
    }
  };

  return (
    <SacredCard variant="gentle" className={`ai-free-journal-export ${className}`}>
      <div className="space-y-ritual">
        {/* Header */}
        <div className="text-center space-y-breath">
          <div className="text-4xl">📦</div>
          <SacredText variant="title" as="h2">
            AI-Free Journal Export
          </SacredText>
          <SacredText variant="body">
            Download your authentic journal entries with complete AI content exclusion. 
            Your original voice, completely private and secure.
          </SacredText>
        </div>

        <div className="space-y-ritual">
        {/* Export Format Selection */}
        <ExportFormatSelector
          selectedFormat={exportOptions.format}
          onFormatChange={(format) => updateExportOption('format', format)}
        />

        {/* Date Range Selection */}
        <DateRangeSelector
          dateRange={exportOptions.dateRange}
          onDateRangeChange={updateDateRange}
        />

        {/* Export Options */}
        <ExportOptionsSelector
          options={exportOptions}
          onOptionsChange={updateExportOption}
        />

        {/* Preview Summary */}
        {previewData && (
          <ExportPreview previewData={previewData} exportOptions={exportOptions} />
        )}

        {/* Export Button and Progress */}
        <ExportButton
          isExporting={isExporting}
          exportProgress={exportProgress}
          previewData={previewData}
          exportOptions={exportOptions}
          onExport={handleExport}
        />

        {/* Privacy Notice */}
        <PrivacyNotice />
        </div>
      </div>
    </SacredCard>
  );
}

// ===== EXPORT FORMAT SELECTOR =====

interface ExportFormatSelectorProps {
  selectedFormat: string;
  onFormatChange: (format: string) => void;
}

function ExportFormatSelector({ selectedFormat, onFormatChange }: ExportFormatSelectorProps) {
  const formats = [
    { value: 'pdf', name: 'PDF', description: 'Formatted document', icon: '📄' },
    { value: 'docx', name: 'Word', description: 'Editable document', icon: '📝' },
    { value: 'txt', name: 'Text', description: 'Plain text file', icon: '📋' },
    { value: 'json', name: 'JSON', description: 'Structured data', icon: '🔧' },
    { value: 'epub', name: 'EPUB', description: 'E-book format', icon: '📖' }
  ];

  return (
    <div className="space-y-breath">
      <SacredText variant="caption" className="font-semibold">
        Export Format
      </SacredText>
      <SacredGrid columns={3} gap="breath">
        {formats.map((format) => (
          <label
            key={format.value}
            className={`cursor-pointer p-breath border rounded-lg transition-all ${
              selectedFormat === format.value
                ? 'border-grounding-earth bg-tender-embrace'
                : 'border-gray-300 hover:border-grounding-earth'
            }`}
          >
            <input
              type="radio"
              value={format.value}
              checked={selectedFormat === format.value}
              onChange={(e) => onFormatChange(e.target.value)}
              className="sr-only"
            />
            <div className="text-center space-y-whisper">
              <div className="text-2xl">{format.icon}</div>
              <div>
                <SacredText variant="caption" className="font-medium">
                  {format.name}
                </SacredText>
                <SacredText variant="caption" className="text-xs text-subtle">
                  {format.description}
                </SacredText>
              </div>
            </div>
          </label>
        ))}
      </SacredGrid>
    </div>
  );
}

// ===== DATE RANGE SELECTOR =====

interface DateRangeSelectorProps {
  dateRange: DateRangeFilter;
  onDateRangeChange: (type: string, startDate?: string, endDate?: string) => void;
}

function DateRangeSelector({ dateRange, onDateRangeChange }: DateRangeSelectorProps) {
  const ranges = [
    { value: 'all', label: 'All Entries', icon: '📅' },
    { value: 'last_week', label: 'Last Week', icon: '📆' },
    { value: 'last_month', label: 'Last Month', icon: '🗓️' },
    { value: 'last_quarter', label: 'Last Quarter', icon: '📊' },
    { value: 'last_year', label: 'Last Year', icon: '🗂️' },
    { value: 'custom', label: 'Custom Range', icon: '⚙️' }
  ];

  return (
    <div className="space-y-breath">
      <SacredText variant="caption" className="font-semibold">
        Date Range
      </SacredText>
      <SacredGrid columns={3} gap="breath">
        {ranges.map((range) => (
          <label
            key={range.value}
            className={`cursor-pointer p-breath border rounded-lg transition-all ${
              dateRange.type === range.value
                ? 'border-grounding-earth bg-tender-embrace'
                : 'border-gray-300 hover:border-grounding-earth'
            }`}
          >
            <input
              type="radio"
              value={range.value}
              checked={dateRange.type === range.value}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="sr-only"
            />
            <div className="text-center space-y-whisper">
              <div className="text-lg">{range.icon}</div>
              <SacredText variant="caption" className="text-sm font-medium">
                {range.label}
              </SacredText>
            </div>
          </label>
        ))}
      </SacredGrid>

      {dateRange.type === 'custom' && (
        <SacredCard variant="gentle" className="mt-breath">
          <div className="grid grid-cols-2 gap-breath">
            <div>
              <SacredText variant="caption" className="text-sm mb-whisper">
                Start Date
              </SacredText>
              <input
                type="date"
                onChange={(e) => onDateRangeChange('custom', e.target.value, 
                  dateRange.endDate ? format(dateRange.endDate, 'yyyy-MM-dd') : undefined)}
                className="w-full p-gentle border border-gray-300 rounded focus:border-grounding-earth"
              />
            </div>
            <div>
              <SacredText variant="caption" className="text-sm mb-whisper">
                End Date
              </SacredText>
              <input
                type="date"
                onChange={(e) => onDateRangeChange('custom', 
                  dateRange.startDate ? format(dateRange.startDate, 'yyyy-MM-dd') : undefined,
                  e.target.value)}
                className="w-full p-gentle border border-gray-300 rounded focus:border-grounding-earth"
              />
            </div>
          </div>
        </SacredCard>
      )}
    </div>
  );
}

// ===== EXPORT OPTIONS SELECTOR =====

interface ExportOptionsSelectorProps {
  options: AIFreeExportOptions;
  onOptionsChange: (key: keyof AIFreeExportOptions, value: any) => void;
}

function ExportOptionsSelector({ options, onOptionsChange }: ExportOptionsSelectorProps) {
  const toggleOptions = [
    {
      key: 'excludeAIContent',
      title: 'Exclude AI-Generated Content',
      description: 'Remove all AI insights, suggestions, and analysis',
      icon: '🚫',
      recommended: true
    },
    {
      key: 'includeAnalogOnly',
      title: 'Analog Mode Entries Only',
      description: 'Include only entries written without AI assistance',
      icon: '✍️',
      recommended: false
    },
    {
      key: 'stripAIMetadata',
      title: 'Strip AI Metadata',
      description: 'Remove AI-related tracking and analysis metadata',
      icon: '🔒',
      recommended: true
    },
    {
      key: 'includeMetadata',
      title: 'Include Entry Metadata',
      description: 'Add word counts, reflection time, and cultural context',
      icon: '📊',
      recommended: true
    },
    {
      key: 'redactSensitiveInfo',
      title: 'Redact Sensitive Information',
      description: 'Automatically remove phone numbers, emails, and other PII',
      icon: '🛡️',
      recommended: true
    }
  ];

  return (
    <div className="space-y-breath">
      <SacredText variant="caption" className="font-semibold">
        Export Options
      </SacredText>
      <div className="space-y-breath">
        {toggleOptions.map((option) => (
          <label
            key={option.key}
            className="flex items-start gap-gentle cursor-pointer p-breath border rounded-lg hover:bg-healing-mist transition-colors"
          >
            <input
              type="checkbox"
              checked={options[option.key as keyof AIFreeExportOptions] as boolean}
              onChange={(e) => onOptionsChange(option.key as keyof AIFreeExportOptions, e.target.checked)}
              className="mt-whisper rounded border-2 border-grounding-earth text-grounding-earth focus:ring-grounding-earth"
            />
            <div className="flex-grow">
              <div className="flex items-center gap-whisper">
                <span className="text-lg">{option.icon}</span>
                <SacredText variant="caption" className="font-medium">
                  {option.title}
                </SacredText>
                {option.recommended && (
                  <span className="text-xs bg-grounding-earth text-white px-whisper py-1 rounded">
                    Recommended
                  </span>
                )}
              </div>
              <SacredText variant="caption" className="text-sm text-subtle">
                {option.description}
              </SacredText>
            </div>
          </label>
        ))}
      </div>

      {/* Export Quality */}
      <div className="space-y-whisper">
        <SacredText variant="caption" className="font-semibold text-sm">
          Export Quality
        </SacredText>
        <div className="flex gap-breath">
          {[
            { value: 'basic', label: 'Basic', icon: '📄' },
            { value: 'standard', label: 'Standard', icon: '📋' },
            { value: 'premium', label: 'Premium', icon: '✨' }
          ].map(quality => (
            <label
              key={quality.value}
              className={`flex-1 cursor-pointer p-gentle border rounded text-center transition-colors ${
                options.exportQuality === quality.value
                  ? 'border-grounding-earth bg-tender-embrace'
                  : 'border-gray-300 hover:border-grounding-earth'
              }`}
            >
              <input
                type="radio"
                name="exportQuality"
                value={quality.value}
                checked={options.exportQuality === quality.value}
                onChange={(e) => onOptionsChange('exportQuality', e.target.value)}
                className="sr-only"
              />
              <div className="space-y-whisper">
                <div className="text-lg">{quality.icon}</div>
                <SacredText variant="caption" className="text-sm">
                  {quality.label}
                </SacredText>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ===== EXPORT PREVIEW =====

interface ExportPreviewProps {
  previewData: {
    filteredCount: number;
    totalWords: number;
    dateRange: string;
    aiContentExcluded: number;
  };
  exportOptions: AIFreeExportOptions;
}

function ExportPreview({ previewData, exportOptions }: ExportPreviewProps) {
  return (
    <SacredCard variant="warm" className="space-y-breath">
      <div className="flex items-center gap-gentle">
        <span className="text-2xl">👀</span>
        <SacredText variant="caption" className="font-semibold">
          Export Preview
        </SacredText>
      </div>
      
      <SacredGrid columns={2} gap="breath" className="text-sm">
        <div className="space-y-whisper">
          <div className="flex justify-between">
            <span className="text-subtle">Entries:</span>
            <span className="font-medium">{previewData.filteredCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtle">Total Words:</span>
            <span className="font-medium">{previewData.totalWords.toLocaleString()}</span>
          </div>
        </div>
        <div className="space-y-whisper">
          <div className="flex justify-between">
            <span className="text-subtle">Date Range:</span>
            <span className="font-medium">{previewData.dateRange}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-subtle">AI Content:</span>
            <span className="font-medium text-green-600">
              {previewData.aiContentExcluded} entries excluded
            </span>
          </div>
        </div>
      </SacredGrid>

      <div className="border-t border-tender-embrace pt-breath">
        <div className="flex items-center gap-whisper text-sm">
          <span className="text-green-600">✓</span>
          <span className="text-subtle">
            Format: {exportOptions.format.toUpperCase()} • 
            Quality: {exportOptions.exportQuality} • 
            {exportOptions.excludeAIContent ? 'AI-Free' : 'Full Content'}
          </span>
        </div>
      </div>
    </SacredCard>
  );
}

// ===== EXPORT BUTTON =====

interface ExportButtonProps {
  isExporting: boolean;
  exportProgress: number;
  previewData: any;
  exportOptions: AIFreeExportOptions;
  onExport: () => void;
}

function ExportButton({ isExporting, exportProgress, previewData, exportOptions, onExport }: ExportButtonProps) {
  const hasEntries = previewData?.filteredCount > 0;

  if (isExporting) {
    return (
      <div className="space-y-breath">
        <div className="flex justify-between text-sm">
          <SacredText variant="caption">
            Preparing your AI-free export...
          </SacredText>
          <SacredText variant="caption" className="font-medium">
            {exportProgress}%
          </SacredText>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-grounding-earth h-2 rounded-full transition-all duration-500"
            style={{ width: `${exportProgress}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <SacredButton
        intention={hasEntries ? "primary" : "gentle"}
        size="comfortable"
        onClick={onExport}
        disabled={!hasEntries}
        className="px-ritual py-breath"
      >
        {hasEntries ? (
          <>📦 Export {previewData.filteredCount} Entries as {exportOptions.format.toUpperCase()}</>
        ) : (
          <>❌ No Entries to Export</>
        )}
      </SacredButton>
      
      {hasEntries && (
        <SacredText variant="caption" className="text-xs text-subtle mt-breath">
          Your journal will be downloaded as a {exportOptions.format.toUpperCase()} file
        </SacredText>
      )}
    </div>
  );
}

// ===== PRIVACY NOTICE =====

function PrivacyNotice() {
  return (
    <SacredCard variant="sacred" className="space-y-breath">
      <div className="flex items-center gap-gentle">
        <span className="text-2xl">🔒</span>
        <SacredText variant="caption" className="font-semibold text-grounding-earth">
          Privacy Protected Export
        </SacredText>
      </div>
      
      <ul className="space-y-whisper text-sm">
        <li className="flex items-start gap-whisper">
          <span className="text-green-600 font-bold">✓</span>
          <span>Your journal entries are exported directly from your device</span>
        </li>
        <li className="flex items-start gap-whisper">
          <span className="text-green-600 font-bold">✓</span>
          <span>No AI analysis, insights, or recommendations are included</span>
        </li>
        <li className="flex items-start gap-whisper">
          <span className="text-green-600 font-bold">✓</span>
          <span>This export represents your authentic voice and original thoughts</span>
        </li>
        <li className="flex items-start gap-whisper">
          <span className="text-green-600 font-bold">✓</span>
          <span>You have complete ownership and control over this content</span>
        </li>
        <li className="flex items-start gap-whisper">
          <span className="text-green-600 font-bold">✓</span>
          <span>Export is logged for audit purposes (metadata only, not content)</span>
        </li>
        <li className="flex items-start gap-whisper">
          <span className="text-green-600 font-bold">✓</span>
          <span>Compliant with FERPA, COPPA, GDPR, and CCPA privacy standards</span>
        </li>
      </ul>
    </SacredCard>
  );
}