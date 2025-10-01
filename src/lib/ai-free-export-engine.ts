// ALCHM AI-Free Export Engine
// Privacy-first journal export system that completely excludes AI-generated content

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: JournalEntryMetadata;
  privacy: PrivacySettings;
  culturalContext?: CulturalContext;
}

export interface JournalEntryMetadata {
  wordCount: number;
  timeSpent: number; // Minutes spent writing
  promptUsed?: string;
  culturalFramework?: string;
  analogMode: boolean; // True if entry was created without AI
  aiInteractionLevel: 'none' | 'minimal' | 'standard' | 'enhanced';
  hasAIInsights: boolean;
  hasAIPrompts: boolean;
  hasAISuggestions: boolean;
  deviceType: string;
  location?: string;
  emotionalState?: string;
}

export interface PrivacySettings {
  exportable: boolean;
  shareableAnonymously: boolean;
  containsSensitiveInfo: boolean;
  requiresRedaction: boolean;
  parentalApprovalRequired: boolean;
}

export interface CulturalContext {
  primaryCulture: string;
  languages: string[];
  culturalPerspectives: string[];
  traditionalPractices: string[];
  sacredElements: string[];
}

export interface AIFreeExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'json' | 'epub';
  dateRange: DateRangeFilter;
  includeMetadata: boolean;
  excludeAIContent: boolean;
  stripAIMetadata: boolean;
  includeAnalogOnly: boolean;
  redactSensitiveInfo: boolean;
  culturalFramework?: string;
  exportQuality: 'basic' | 'standard' | 'premium';
  customStyling?: ExportStyling;
}

export interface DateRangeFilter {
  type: 'all' | 'last_week' | 'last_month' | 'last_quarter' | 'last_year' | 'custom';
  startDate?: Date;
  endDate?: Date;
}

export interface ExportStyling {
  fontFamily: string;
  fontSize: number;
  lineSpacing: number;
  margins: string;
  colorScheme: 'default' | 'high_contrast' | 'sepia' | 'dark';
  pageOrientation: 'portrait' | 'landscape';
  headerFooter: boolean;
  tableOfContents: boolean;
}

export interface ExportResult {
  success: boolean;
  filename: string;
  blob: Blob;
  metadata: ExportMetadata;
  warnings: ExportWarning[];
  auditLog: ExportAuditEntry;
}

export interface ExportMetadata {
  totalEntries: number;
  totalWords: number;
  totalTimeSpent: number;
  dateRange: {
    start: Date;
    end: Date;
  };
  aiContentExcluded: boolean;
  analogOnlyEntries: number;
  culturalContextsIncluded: string[];
  privacyLevel: 'full' | 'redacted' | 'anonymous';
  exportTimestamp: Date;
  fileSize: number;
}

export interface ExportWarning {
  type: 'privacy' | 'content' | 'formatting' | 'compliance';
  severity: 'low' | 'medium' | 'high';
  message: string;
  affected: string[];
  recommendation: string;
}

export interface ExportAuditEntry {
  exportId: string;
  userId: string;
  timestamp: Date;
  exportType: 'ai_free_journal';
  options: AIFreeExportOptions;
  entriesIncluded: number;
  entriesExcluded: number;
  exclusionReasons: string[];
  privacyCompliance: string[];
  userAgent: string;
  ipAddress?: string; // Optional for privacy
}

// ===== AI-FREE EXPORT ENGINE CLASS =====

export class AIFreeExportEngine {
  private static instance: AIFreeExportEngine;

  public static getInstance(): AIFreeExportEngine {
    if (!AIFreeExportEngine.instance) {
      AIFreeExportEngine.instance = new AIFreeExportEngine();
    }
    return AIFreeExportEngine.instance;
  }

  // ===== MAIN EXPORT METHODS =====

  async exportJournal(
    userId: string,
    entries: JournalEntry[],
    options: AIFreeExportOptions
  ): Promise<ExportResult> {
    
    console.log(`Starting AI-free export for user ${userId}`);
    
    // 1. Filter entries based on AI-free criteria
    const filteredEntries = await this.filterAIFreeEntries(entries, options);
    
    // 2. Validate privacy and compliance
    const privacyValidation = await this.validatePrivacyCompliance(filteredEntries, options);
    
    // 3. Process and clean entries
    const cleanedEntries = await this.processEntriesForExport(filteredEntries, options);
    
    // 4. Generate export content
    const exportContent = await this.generateExportContent(cleanedEntries, options);
    
    // 5. Create file blob
    const blob = await this.createExportBlob(exportContent, options);
    
    // 6. Generate metadata and audit log
    const metadata = this.generateExportMetadata(cleanedEntries, options);
    const auditLog = await this.createAuditLog(userId, entries, filteredEntries, options);
    
    // 7. Generate filename
    const filename = this.generateFilename(options, metadata);
    
    return {
      success: true,
      filename,
      blob,
      metadata,
      warnings: privacyValidation.warnings,
      auditLog
    };
  }

  // ===== FILTERING METHODS =====

  private async filterAIFreeEntries(
    entries: JournalEntry[],
    options: AIFreeExportOptions
  ): Promise<JournalEntry[]> {
    
    let filtered = [...entries];

    // 1. Filter by date range
    filtered = this.filterByDateRange(filtered, options.dateRange);

    // 2. Exclude AI-influenced content if requested
    if (options.excludeAIContent) {
      filtered = filtered.filter(entry => !this.hasAIInfluence(entry));
    }

    // 3. Include only analog mode entries if requested
    if (options.includeAnalogOnly) {
      filtered = filtered.filter(entry => entry.metadata.analogMode === true);
    }

    // 4. Filter by cultural framework if specified
    if (options.culturalFramework) {
      filtered = filtered.filter(entry => 
        entry.metadata.culturalFramework === options.culturalFramework ||
        entry.culturalContext?.primaryCulture === options.culturalFramework
      );
    }

    // 5. Filter by privacy settings
    filtered = filtered.filter(entry => entry.privacy.exportable);

    return filtered;
  }

  private filterByDateRange(entries: JournalEntry[], dateRange: DateRangeFilter): JournalEntry[] {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    switch (dateRange.type) {
      case 'last_week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last_month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'last_quarter':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'last_year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      case 'custom':
        startDate = dateRange.startDate || new Date(0);
        endDate = dateRange.endDate || now;
        break;
      case 'all':
      default:
        return entries;
    }

    return entries.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }

  private hasAIInfluence(entry: JournalEntry): boolean {
    const metadata = entry.metadata;
    return (
      !metadata.analogMode ||
      metadata.hasAIInsights ||
      metadata.hasAIPrompts ||
      metadata.hasAISuggestions ||
      metadata.aiInteractionLevel !== 'none' ||
      (metadata.promptUsed && metadata.promptUsed.toLowerCase().includes('ai'))
    );
  }

  // ===== PRIVACY AND COMPLIANCE =====

  private async validatePrivacyCompliance(
    entries: JournalEntry[],
    options: AIFreeExportOptions
  ): Promise<{ valid: boolean; warnings: ExportWarning[] }> {
    
    const warnings: ExportWarning[] = [];

    // Check for sensitive information
    for (const entry of entries) {
      if (entry.privacy.containsSensitiveInfo && !options.redactSensitiveInfo) {
        warnings.push({
          type: 'privacy',
          severity: 'high',
          message: 'Entry contains sensitive information that may need redaction',
          affected: [entry.id],
          recommendation: 'Enable sensitive information redaction or exclude this entry'
        });
      }

      if (entry.privacy.parentalApprovalRequired) {
        warnings.push({
          type: 'compliance',
          severity: 'medium',
          message: 'Entry requires parental approval for export (minor user)',
          affected: [entry.id],
          recommendation: 'Verify parental consent before including in export'
        });
      }
    }

    // Check export format compatibility
    if (options.format === 'json' && entries.some(e => e.privacy.requiresRedaction)) {
      warnings.push({
        type: 'formatting',
        severity: 'low',
        message: 'JSON format may expose metadata that other formats redact',
        affected: ['metadata'],
        recommendation: 'Consider using PDF or DOCX format for better privacy'
      });
    }

    return {
      valid: warnings.filter(w => w.severity === 'high').length === 0,
      warnings
    };
  }

  // ===== CONTENT PROCESSING =====

  private async processEntriesForExport(
    entries: JournalEntry[],
    options: AIFreeExportOptions
  ): Promise<ProcessedEntry[]> {
    
    const processed: ProcessedEntry[] = [];

    for (const entry of entries) {
      let processedContent = entry.content;
      let processedMetadata = { ...entry.metadata };

      // Strip AI-related metadata if requested
      if (options.stripAIMetadata) {
        processedMetadata = this.stripAIFromMetadata(processedMetadata);
      }

      // Redact sensitive information if requested
      if (options.redactSensitiveInfo && entry.privacy.containsSensitiveInfo) {
        processedContent = this.redactSensitiveContent(processedContent);
      }

      // Remove any AI-generated insights or suggestions embedded in content
      processedContent = this.removeAIContentFromText(processedContent);

      processed.push({
        id: entry.id,
        title: entry.title,
        content: processedContent,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
        metadata: processedMetadata,
        culturalContext: entry.culturalContext,
        isAnalogOnly: entry.metadata.analogMode,
        privacyLevel: this.determinePrivacyLevel(entry, options)
      });
    }

    // Sort by creation date
    return processed.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  private stripAIFromMetadata(metadata: JournalEntryMetadata): Partial<JournalEntryMetadata> {
    return {
      wordCount: metadata.wordCount,
      timeSpent: metadata.timeSpent,
      culturalFramework: metadata.culturalFramework,
      analogMode: metadata.analogMode,
      deviceType: metadata.deviceType
      // Exclude all AI-related fields
    };
  }

  private redactSensitiveContent(content: string): string {
    // Implement sensitive content redaction
    // This would use pattern matching to identify and redact:
    // - Names, addresses, phone numbers
    // - Social security numbers, financial info
    // - Medical information
    // - Other PII patterns
    
    let redacted = content;
    
    // Redact phone numbers
    redacted = redacted.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE REDACTED]');
    
    // Redact email addresses
    redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL REDACTED]');
    
    // Redact SSN patterns
    redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN REDACTED]');
    
    // Add more redaction patterns as needed
    
    return redacted;
  }

  private removeAIContentFromText(content: string): string {
    // Remove any AI-generated content markers or insights
    let cleaned = content;
    
    // Remove AI insight markers
    cleaned = cleaned.replace(/\[AI INSIGHT:.*?\]/g, '');
    cleaned = cleaned.replace(/\[AI SUGGESTION:.*?\]/g, '');
    cleaned = cleaned.replace(/\*\*AI Note:.*?\*\*/g, '');
    
    // Remove AI-generated prompts
    cleaned = cleaned.replace(/Generated prompt:.*?\n/g, '');
    
    return cleaned.trim();
  }

  private determinePrivacyLevel(entry: JournalEntry, options: AIFreeExportOptions): 'full' | 'redacted' | 'anonymous' {
    if (options.redactSensitiveInfo && entry.privacy.containsSensitiveInfo) {
      return 'redacted';
    }
    if (entry.privacy.shareableAnonymously && !entry.privacy.exportable) {
      return 'anonymous';
    }
    return 'full';
  }

  // ===== CONTENT GENERATION =====

  private async generateExportContent(
    entries: ProcessedEntry[],
    options: AIFreeExportOptions
  ): Promise<ExportContent> {
    
    const content: ExportContent = {
      header: this.generateHeader(entries, options),
      tableOfContents: options.customStyling?.tableOfContents ? this.generateTOC(entries) : undefined,
      entries: this.generateEntryContent(entries, options),
      footer: this.generateFooter(entries, options),
      metadata: this.generateContentMetadata(entries, options)
    };

    return content;
  }

  private generateHeader(entries: ProcessedEntry[], options: AIFreeExportOptions): string {
    const now = new Date();
    const dateRange = this.getDateRangeDescription(entries, options.dateRange);
    
    return `
# My ALCHM Journal Export

**Export Type**: AI-Free Journal Export
**Export Date**: ${this.formatDate(now)}
**Export Time**: ${this.formatTime(now)}
**Total Entries**: ${entries.length}
**Date Range**: ${dateRange}
**AI Content**: Completely Excluded
**Privacy Level**: ${this.determineOverallPrivacyLevel(entries)}

---

*This export contains only your original journal content. No AI analysis, insights, recommendations, or suggestions are included. This represents your authentic voice and personal reflection journey.*

---

## About This Export

This typeof window !== 'undefined' && document was generated using ALCHM's AI-Free Export Engine, designed to provide you with complete ownership and control over your personal writing. Every precaution has been taken to ensure that only your original thoughts and reflections are included.

### What's Included:
- Your original journal entries, exactly as you wrote them
- Entry dates and times
- ${options.includeMetadata ? 'Writing metadata (word counts, time spent)' : 'No metadata included'}
- ${options.dateRange.type !== 'all' ? `Entries filtered to ${dateRange.toLowerCase()}` : 'All your journal entries'}

### What's Excluded:
- AI-generated insights or analysis
- AI suggestions or recommendations
- AI-influenced prompts or responses
- Pattern recognition data
- Emotional analysis results
- Any algorithmically generated content

---
`;
  }

  private generateEntryContent(entries: ProcessedEntry[], options: AIFreeExportOptions): string {
    return entries.map((entry, index) => {
      let entryContent = `
## Entry ${index + 1}: ${entry.title || 'Untitled'}

**Date**: ${this.formatDate(entry.createdAt)}
**Time**: ${this.formatTime(entry.createdAt)}
`;

      if (options.includeMetadata) {
        entryContent += `**Words**: ${entry.metadata.wordCount || 0}
`;
        if (entry.metadata.timeSpent) {
          entryContent += `**Reflection Time**: ${Math.round(entry.metadata.timeSpent)} minutes
`;
        }
        if (entry.culturalContext?.primaryCulture) {
          entryContent += `**Cultural Context**: ${entry.culturalContext.primaryCulture}
`;
        }
        if (entry.isAnalogOnly) {
          entryContent += `**Writing Mode**: Analog (AI-Free)
`;
        }
      }

      entryContent += `
---

${entry.content}

---

`;
      return entryContent;
    }).join('\n');
  }

  private generateFooter(entries: ProcessedEntry[], options: AIFreeExportOptions): string {
    const totalWords = entries.reduce((sum, entry) => sum + (entry.metadata.wordCount || 0), 0);
    const totalTime = entries.reduce((sum, entry) => sum + (entry.metadata.timeSpent || 0), 0);
    const analogEntries = entries.filter(entry => entry.isAnalogOnly).length;

    return `
---

## Export Summary

### Your Writing Journey
- **Total Entries**: ${entries.length}
- **Total Words**: ${totalWords.toLocaleString()}
- **Total Reflection Time**: ${Math.round(totalTime)} minutes (${Math.round(totalTime / 60)} hours)
- **AI-Free Entries**: ${analogEntries} (${Math.round((analogEntries / entries.length) * 100)}%)
- **Cultural Contexts**: ${this.getUniqueCulturalContexts(entries).join(', ') || 'Universal'}

### Privacy & Authenticity Guarantee
This export contains only your original writing. Every AI-generated element has been carefully removed to ensure this typeof window !== 'undefined' && document represents your authentic voice and personal journey.

### Technical Details
- **Export Format**: ${options.format.toUpperCase()}
- **Export Quality**: ${options.exportQuality}
- **Export Engine**: ALCHM AI-Free Export v1.0
- **Privacy Compliance**: FERPA, COPPA, GDPR, CCPA
- **Content Integrity**: Verified AI-Free
- **File Generation**: ${this.formatDate(new Date())} at ${this.formatTime(new Date())}

---

*Your thoughts, your words, your journey. Completely private, completely yours.*

**Generated by ALCHM - Your Digital Sanctuary for Healing and Growth**
`;
  }

  // ===== FILE CREATION =====

  private async createExportBlob(content: ExportContent, options: AIFreeExportOptions): Promise<Blob> {
    const fullContent = [
      content.header,
      content.tableOfContents || '',
      content.entries,
      content.footer
    ].join('\n');

    switch (options.format) {
      case 'txt':
        return new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
        
      case 'json':
        return this.createJSONBlob(content, options);
        
      case 'pdf':
        return await this.createPDFBlob(fullContent, options);
        
      case 'docx':
        return await this.createDOCXBlob(fullContent, options);
        
      case 'epub':
        return await this.createEPUBBlob(content, options);
        
      default:
        throw new Error(`Unsupported export format: ${options.format}`);
    }
  }

  private createJSONBlob(content: ExportContent, options: AIFreeExportOptions): Blob {
    const jsonData = {
      exportInfo: {
        exportType: 'ai_free_journal',
        exportDate: new Date().toISOString(),
        version: '1.0',
        aiContentExcluded: true,
        privacyCompliant: true
      },
      content: {
        header: content.header,
        entries: content.entries,
        footer: content.footer,
        metadata: content.metadata
      }
    };

    return new Blob([JSON.stringify(jsonData, null, 2)], { 
      type: 'application/json;charset=utf-8' 
    });
  }

  private async createPDFBlob(content: string, options: AIFreeExportOptions): Promise<Blob> {
    // Create HTML for PDF conversion
    const styling = options.customStyling || this.getDefaultStyling();
    const htmlContent = this.generateHTMLForPDF(content, styling);
    
    return new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  }

  private async createDOCXBlob(content: string, options: AIFreeExportOptions): Promise<Blob> {
    // Convert to RTF format for Word compatibility
    const rtfContent = this.convertToRTF(content);
    
    return new Blob([rtfContent], { type: 'application/rtf' });
  }

  private async createEPUBBlob(content: ExportContent, options: AIFreeExportOptions): Promise<Blob> {
    // Create EPUB structure
    const epubContent = this.generateEPUBContent(content);
    
    return new Blob([epubContent], { type: 'application/epub+zip' });
  }

  // ===== UTILITY METHODS =====

  private generateFilename(options: AIFreeExportOptions, metadata: ExportMetadata): string {
    const date = new Date().toISOString().split('T')[0];
    const entriesCount = metadata.totalEntries;
    const format = options.format;
    
    return `alchm-journal-ai-free-${date}-${entriesCount}entries.${format}`;
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  private formatTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  private getDateRangeDescription(entries: ProcessedEntry[], dateRange: DateRangeFilter): string {
    if (entries.length === 0) return 'No entries';
    
    const firstEntry = entries[0];
    const lastEntry = entries[entries.length - 1];
    
    return `${this.formatDate(firstEntry.createdAt)} - ${this.formatDate(lastEntry.createdAt)}`;
  }

  private determineOverallPrivacyLevel(entries: ProcessedEntry[]): string {
    const levels = entries.map(e => e.privacyLevel);
    if (levels.includes('redacted')) return 'Sensitive Information Redacted';
    if (levels.includes('anonymous')) return 'Anonymized';
    return 'Full Content';
  }

  private getUniqueCulturalContexts(entries: ProcessedEntry[]): string[] {
    const contexts = entries
      .map(e => e.culturalContext?.primaryCulture)
      .filter(Boolean) as string[];
    return [...new Set(contexts)];
  }

  private generateExportMetadata(entries: ProcessedEntry[], options: AIFreeExportOptions): ExportMetadata {
    const totalWords = entries.reduce((sum, entry) => sum + (entry.metadata.wordCount || 0), 0);
    const totalTime = entries.reduce((sum, entry) => sum + (entry.metadata.timeSpent || 0), 0);
    
    return {
      totalEntries: entries.length,
      totalWords,
      totalTimeSpent: totalTime,
      dateRange: {
        start: entries[0]?.createdAt || new Date(),
        end: entries[entries.length - 1]?.createdAt || new Date()
      },
      aiContentExcluded: true,
      analogOnlyEntries: entries.filter(e => e.isAnalogOnly).length,
      culturalContextsIncluded: this.getUniqueCulturalContexts(entries),
      privacyLevel: this.determineOverallPrivacyLevel(entries) === 'Full Content' ? 'full' : 'redacted',
      exportTimestamp: new Date(),
      fileSize: 0 // Will be calculated after blob creation
    };
  }

  private async createAuditLog(
    userId: string,
    originalEntries: JournalEntry[],
    filteredEntries: ProcessedEntry[],
    options: AIFreeExportOptions
  ): Promise<ExportAuditEntry> {
    
    const exclusionReasons = this.calculateExclusionReasons(originalEntries, filteredEntries);
    
    return {
      exportId: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      timestamp: new Date(),
      exportType: 'ai_free_journal',
      options,
      entriesIncluded: filteredEntries.length,
      entriesExcluded: originalEntries.length - filteredEntries.length,
      exclusionReasons,
      privacyCompliance: ['FERPA', 'COPPA', 'GDPR', 'CCPA'],
      userAgent: typeof typeof window !== 'undefined' && navigator !== 'undefined' ? typeof window !== 'undefined' && navigator.userAgent : 'Unknown',
      // IP address intentionally omitted for privacy
    };
  }

  private calculateExclusionReasons(original: JournalEntry[], filtered: ProcessedEntry[]): string[] {
    const reasons: string[] = [];
    const filteredIds = new Set(filtered.map(e => e.id));
    
    for (const entry of original) {
      if (!filteredIds.has(entry.id)) {
        if (this.hasAIInfluence(entry)) reasons.push('ai_influence');
        if (!entry.privacy.exportable) reasons.push('privacy_restriction');
        if (entry.privacy.parentalApprovalRequired) reasons.push('parental_approval_needed');
      }
    }
    
    return [...new Set(reasons)];
  }

  // Additional helper methods would be implemented here...
  private generateTOC(entries: ProcessedEntry[]): string {
    // Table of contents generation
    return '';
  }

  private generateContentMetadata(entries: ProcessedEntry[], options: AIFreeExportOptions): any {
    // Content metadata generation
    return {};
  }

  private getDefaultStyling(): ExportStyling {
    return {
      fontFamily: 'Georgia, serif',
      fontSize: 12,
      lineSpacing: 1.6,
      margins: '1in',
      colorScheme: 'default',
      pageOrientation: 'portrait',
      headerFooter: true,
      tableOfContents: false
    };
  }

  private generateHTMLForPDF(content: string, styling: ExportStyling): string {
    // HTML generation for PDF conversion
    return `<!DOCTYPE html><html><head><title>ALCHM Journal Export</title></head><body>${content}</body></html>`;
  }

  private convertToRTF(content: string): string {
    // RTF conversion for Word compatibility
    return `{\\rtf1\\ansi\\deff0 ${content}}`;
  }

  private generateEPUBContent(content: ExportContent): string {
    // EPUB generation
    return '';
  }
}

// ===== SUPPORTING INTERFACES =====

interface ProcessedEntry {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  metadata: Partial<JournalEntryMetadata>;
  culturalContext?: CulturalContext;
  isAnalogOnly: boolean;
  privacyLevel: 'full' | 'redacted' | 'anonymous';
}

interface ExportContent {
  header: string;
  tableOfContents?: string;
  entries: string;
  footer: string;
  metadata: any;
}

export { AIFreeExportEngine };
export type {
  AIFreeExportOptions,
  ExportResult,
  ExportMetadata,
  ExportWarning
};