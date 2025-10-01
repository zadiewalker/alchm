// lib/badges/export.ts - Multi-format badge export system

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: 'presence' | 'reflection' | 'growth' | 'community';
  earnedDate: string;
  iconUrl?: string;
  metadata?: {
    streakLength?: number;
    reflectionCount?: number;
    communityEngagement?: boolean;
  };
  notes?: string;
}

export interface ExportConfig {
  includePersonalNotes: boolean;
  includeMetadata: boolean;
  format: 'json' | 'pdf' | 'png' | 'csv';
  studentName?: string;
  exportDate: string;
  schoolYear?: string;
}

// JSON Export (for technical users, data portability)
export function badgeToJSON(badges: Badge[], config: ExportConfig): string {
  const exportData = {
    alchemExport: {
      version: '1.0',
      exportDate: config.exportDate,
      studentName: config.studentName || 'Anonymous',
      schoolYear: config.schoolYear,
      totalBadges: badges.length,
      badges: badges.map(badge => ({
        ...badge,
        ...(config.includeMetadata ? { metadata: badge.metadata } : {}),
        ...(config.includePersonalNotes ? { notes: badge.notes } : {})
      }))
    }
  };
  
  return JSON.stringify(exportData, null, 2);
}

// CSV Export (for spreadsheet analysis, grade books)
export function badgesToCSV(badges: Badge[], config: ExportConfig): string {
  const headers = [
    'Badge Name',
    'Category', 
    'Earned Date',
    'Description'
  ];
  
  if (config.includeMetadata) {
    headers.push('Streak Length', 'Reflection Count', 'Community Engagement');
  }
  
  if (config.includePersonalNotes) {
    headers.push('Personal Notes');
  }
  
  const rows = badges.map(badge => {
    const row = [
      badge.name,
      badge.category,
      badge.earnedDate,
      badge.description
    ];
    
    if (config.includeMetadata) {
      row.push(
        badge.metadata?.streakLength?.toString() || '',
        badge.metadata?.reflectionCount?.toString() || '',
        badge.metadata?.communityEngagement ? 'Yes' : 'No'
      );
    }
    
    if (config.includePersonalNotes) {
      row.push(badge.notes || '');
    }
    
    return row.map(cell => `"${cell}"`).join(',');
  });
  
  return [headers.join(','), ...rows].join('\n');
}

// PDF Export (for portfolios, family sharing, official records)
export function generateBadgePDF(badges: Badge[], config: ExportConfig): string {
  // Returns HTML template that can be converted to PDF via browser's print functionality
  const badgeCards = badges.map(badge => `
    <div class="badge-card">
      <div class="badge-header">
        <img src="${badge.iconUrl || '/default-badge.svg'}" alt="${badge.name}" class="badge-icon">
        <h3>${badge.name}</h3>
        <span class="badge-category">${badge.category}</span>
      </div>
      <p class="badge-description">${badge.description}</p>
      <div class="badge-footer">
        <span class="earned-date">Earned: ${new Date(badge.earnedDate).toLocaleDateString()}</span>
        ${config.includeMetadata && badge.metadata ? `
          <div class="metadata">
            ${badge.metadata.streakLength ? `<span>Streak: ${badge.metadata.streakLength} days</span>` : ''}
            ${badge.metadata.reflectionCount ? `<span>Reflections: ${badge.metadata.reflectionCount}</span>` : ''}
          </div>
        ` : ''}
        ${config.includePersonalNotes && badge.notes ? `<p class="notes">${badge.notes}</p>` : ''}
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${config.studentName || 'Student'} - ALCHM Badge Portfolio</title>
      <style>
        body { 
          font-family: 'Inter', system-ui, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 2rem;
          background: #FEFCFB;
          color: #2C2C2C;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #8B7355;
          padding-bottom: 2rem;
          margin-bottom: 3rem;
        }
        .header h1 {
          color: #8B7355;
          margin: 0;
          font-size: 2.5rem;
        }
        .header p {
          color: #666;
          margin: 0.5rem 0 0 0;
        }
        .badge-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .badge-card {
          border: 1px solid #E5D5C3;
          border-radius: 12px;
          padding: 1.5rem;
          background: white;
          box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
        }
        .badge-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .badge-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }
        .badge-header h3 {
          color: #8B7355;
          margin: 0;
          font-size: 1.25rem;
        }
        .badge-category {
          background: #F4F1EC;
          color: #8B7355;
          padding: 0.25rem 0.75rem;
          border-radius: 16px;
          font-size: 0.875rem;
          text-transform: capitalize;
        }
        .badge-description {
          color: #666;
          line-height: 1.5;
          margin-bottom: 1rem;
        }
        .badge-footer {
          border-top: 1px solid #F4F1EC;
          padding-top: 1rem;
        }
        .earned-date {
          color: #8B7355;
          font-weight: 500;
          font-size: 0.875rem;
        }
        .metadata {
          margin-top: 0.5rem;
          display: flex;
          gap: 1rem;
        }
        .metadata span {
          color: #666;
          font-size: 0.875rem;
        }
        .notes {
          margin-top: 1rem;
          padding: 1rem;
          background: #F4F1EC;
          border-radius: 8px;
          color: #666;
          font-style: italic;
        }
        @media print {
          body { background: white; }
          .badge-card { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Badge Portfolio</h1>
        <p>${config.studentName || 'Student Name'} • ${config.exportDate}</p>
        <p>${badges.length} badges earned${config.schoolYear ? ` • ${config.schoolYear}` : ''}</p>
      </div>
      <div class="badge-grid">
        ${badgeCards}
      </div>
    </body>
    </html>
  `;
}

// PNG Export (for social sharing, visual portfolios)
export function generateBadgePNG(badges: Badge[], config: ExportConfig): Promise<string> {
  return new Promise((resolve) => {
    const canvas = typeof window !== 'undefined' && document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }
    
    // Calculate canvas size based on badge count
    const badgesPerRow = 4;
    const badgeSize = 120;
    const padding = 20;
    const headerHeight = 100;
    
    const rows = Math.ceil(badges.length / badgesPerRow);
    canvas.width = (badgesPerRow * badgeSize) + ((badgesPerRow + 1) * padding);
    canvas.height = headerHeight + (rows * badgeSize) + ((rows + 1) * padding);
    
    // Background
    ctx.fillStyle = '#FEFCFB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = '#8B7355';
    ctx.font = 'bold 24px Inter, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(
      `${config.studentName || 'Student'} - ALCHM Badges`,
      canvas.width / 2,
      40
    );
    
    ctx.font = '16px Inter, system-ui';
    ctx.fillStyle = '#666';
    ctx.fillText(
      `${badges.length} badges • ${config.exportDate}`,
      canvas.width / 2,
      70
    );
    
    // Draw badges
    badges.forEach((badge, index) => {
      const row = Math.floor(index / badgesPerRow);
      const col = index % badgesPerRow;
      
      const x = padding + (col * (badgeSize + padding));
      const y = headerHeight + padding + (row * (badgeSize + padding));
      
      // Badge background circle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(x + badgeSize/2, y + badgeSize/2, badgeSize/2 - 5, 0, 2 * Math.PI);
      ctx.fill();
      
      // Badge border
      ctx.strokeStyle = '#8B7355';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Badge name
      ctx.fillStyle = '#2C2C2C';
      ctx.font = 'bold 12px Inter, system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(
        badge.name,
        x + badgeSize/2,
        y + badgeSize - 10
      );
    });
    
    // Convert to data URL
    resolve(canvas.toDataURL('image/png'));
  });
}

// Usage Examples
export const EXPORT_EXAMPLES = {
  json: {
    description: "Technical format for data portability and integration",
    useCase: "Developer integration, data backup, technical analysis",
    fileExtension: ".json"
  },
  
  csv: {
    description: "Spreadsheet format for grade books and analysis", 
    useCase: "Teacher grade books, parent tracking, academic records",
    fileExtension: ".csv"
  },
  
  pdf: {
    description: "Professional format for portfolios and sharing",
    useCase: "Student portfolios, family sharing, college applications",
    fileExtension: ".pdf"
  },
  
  png: {
    description: "Visual format for social sharing and display",
    useCase: "Social media sharing, visual portfolios, celebration posts",
    fileExtension: ".png"
  }
};

// Export validation
export function validateExportRequest(badges: Badge[], config: ExportConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (badges.length === 0) {
    errors.push("No badges available to export");
  }
  
  if (!config.format || !['json', 'pdf', 'png', 'csv'].includes(config.format)) {
    errors.push("Invalid export format specified");
  }
  
  if (config.includePersonalNotes && badges.some(b => !b.notes)) {
    errors.push("Some badges missing personal notes");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper function to download file
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = typeof window !== 'undefined' && document.createElement('a');
  link.href = url;
  link.download = filename;
  typeof window !== 'undefined' && document.body.appendChild(link);
  link.click();
  typeof window !== 'undefined' && document.body.removeChild(link);
  URL.revokeObjectURL(url);
}