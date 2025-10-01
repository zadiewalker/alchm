'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface JournalEntry {
  id: string;
  date: string;
  pathway: string;
  prompt: string;
  content: string;
  mood?: string;
  aiResponse?: string;
}

interface ExportOptions {
  includePrompts: boolean;
  includeAIResponses: boolean;
  includeMoodData: boolean;
  dateRange: 'all' | 'last30' | 'last90' | 'custom';
  pathways: string[];
  format: 'beautiful' | 'minimal' | 'therapeutic';
}

const MOCK_ENTRIES: JournalEntry[] = [
  {
    id: '1',
    date: '2024-01-15',
    pathway: 'resilience',
    prompt: "What's one time you survived when you thought you wouldn't?",
    content: "I remember when I lost my job last year. I felt like my whole identity was tied to that role. But looking back, losing that job pushed me to discover parts of myself I never knew existed. I started painting again, something I hadn't done since high school. That period of uncertainty taught me that I'm more resilient than I ever imagined.",
    mood: 'reflective',
    aiResponse: "I hear the strength in your story. The fact that you found your way back to creativity during such a difficult time shows incredible resilience. Your identity is so much richer than any job title."
  },
  {
    id: '2', 
    date: '2024-01-20',
    pathway: 'becoming',
    prompt: "Who are you becoming that your younger self wouldn't believe?",
    content: "My younger self was so afraid of taking up space, of being seen. I would shrink myself to make others comfortable. Now I'm learning to speak up, to advocate for myself and others. I'm becoming someone who stands firm in their values, even when it's uncomfortable.",
    mood: 'empowered',
    aiResponse: "What a beautiful transformation. Your younger self would be so proud to see how you've grown into someone who honors both your own needs and your values. That takes real courage."
  }
];

export default function PDFExporter() {
  const [entries] = useState<JournalEntry[]>(MOCK_ENTRIES);
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    includePrompts: true,
    includeAIResponses: true,
    includeMoodData: true,
    dateRange: 'all',
    pathways: ['resilience', 'becoming', 'purpose', 'belonging'],
    format: 'beautiful'
  });
  const [isExporting, setIsExporting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleExportOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generatePDF = async () => {
    setIsExporting(true);
    
    try {
      // Filter entries based on options
      let filteredEntries = entries;
      
      if (exportOptions.pathways.length > 0) {
        filteredEntries = filteredEntries.filter(entry => 
          exportOptions.pathways.includes(entry.pathway)
        );
      }
      
      // Create PDF content based on format
      const pdfContent = generatePDFContent(filteredEntries, exportOptions);
      
      // In production, this would use a PDF generation library like jsPDF or Puppeteer
      // For demo purposes, we'll create a downloadable HTML file that looks like a PDF
      const blob = new Blob([pdfContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `ALCHM_Journey_Export_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const generatePDFContent = (entries: JournalEntry[], options: ExportOptions) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My ALCHM Journey</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #2D2D30;
            background: white;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #5E8E7F;
        }
        
        .title {
            font-size: 2.5em;
            color: #5E8E7F;
            margin-bottom: 10px;
            font-weight: normal;
        }
        
        .subtitle {
            font-size: 1.2em;
            color: #666;
            font-style: italic;
        }
        
        .export-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            font-size: 0.9em;
            color: #666;
        }
        
        .entry {
            margin-bottom: 40px;
            padding: 30px;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            background: #fafbfc;
            page-break-inside: avoid;
        }
        
        .entry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .entry-date {
            font-weight: bold;
            color: #5E8E7F;
        }
        
        .entry-pathway {
            background: #5E8E7F;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            text-transform: capitalize;
        }
        
        .entry-mood {
            background: #f0f9ff;
            color: #0ea5e9;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            margin-left: 8px;
        }
        
        .prompt {
            font-style: italic;
            color: #666;
            margin-bottom: 15px;
            font-size: 1.1em;
            border-left: 4px solid #5E8E7F;
            padding-left: 15px;
        }
        
        .content {
            margin-bottom: 20px;
            font-size: 1em;
            line-height: 1.8;
        }
        
        .ai-response {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
        }
        
        .ai-response-label {
            font-size: 0.85em;
            color: #0ea5e9;
            font-weight: bold;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        
        .ai-response-content {
            font-style: italic;
            color: #334155;
        }
        
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 0.9em;
            color: #666;
        }
        
        .disclaimer {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 15px;
            margin: 30px 0;
            font-size: 0.85em;
        }
        
        @media print {
            body { padding: 20px; }
            .entry { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="title">My ALCHM Journey</h1>
        <p class="subtitle">A Personal Reflection Export</p>
    </div>
    
    <div class="export-info">
        <strong>Export Details:</strong><br>
        Generated on: ${formattedDate}<br>
        Total Entries: ${entries.length}<br>
        Pathways: ${options.pathways.join(', ')}<br>
        Format: ${options.format.charAt(0).toUpperCase() + options.format.slice(1)}
    </div>
    
    <div class="disclaimer">
        <strong>⚠️ Privacy Notice:</strong> This export contains your personal reflections and mental health journey. 
        Please store and share this document securely. ALCHM is not therapy - consult licensed professionals 
        for mental health treatment.
    </div>
    
    ${entries.map(entry => `
        <div class="entry">
            <div class="entry-header">
                <div>
                    <span class="entry-date">${new Date(entry.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                    ${options.includeMoodData && entry.mood ? `<span class="entry-mood">${entry.mood}</span>` : ''}
                </div>
                <div class="entry-pathway">${entry.pathway}</div>
            </div>
            
            ${options.includePrompts ? `<div class="prompt">"${entry.prompt}"</div>` : ''}
            
            <div class="content">${entry.content}</div>
            
            ${options.includeAIResponses && entry.aiResponse ? `
                <div class="ai-response">
                    <div class="ai-response-label">🔮 Khepera AI Response</div>
                    <div class="ai-response-content">${entry.aiResponse}</div>
                </div>
            ` : ''}
        </div>
    `).join('')}
    
    <div class="footer">
        <p>This document was generated by ALCHM - Your Digital Sanctuary for healing and growth.</p>
        <p style="margin-top: 10px; font-size: 0.8em;">
            For support: support@alchm.app | Crisis support: Call 988
        </p>
    </div>
</body>
</html>
    `;
  };

  const PreviewModal = () => {
    if (!showPreview) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Export Preview</h3>
              <Button
                onClick={() => setShowPreview(false)}
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </Button>
            </div>
          </div>
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="prose max-w-none">
              <div className="text-center mb-8">
                <h1 className="text-3xl text-[#5E8E7F] mb-2">My ALCHM Journey</h1>
                <p className="text-gray-600 italic">A Personal Reflection Export</p>
              </div>
              
              {entries.slice(0, 2).map(entry => (
                <div key={entry.id} className="mb-8 p-6 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium text-[#5E8E7F]">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                    <span className="bg-[#5E8E7F] text-white px-3 py-1 rounded-full text-sm capitalize">
                      {entry.pathway}
                    </span>
                  </div>
                  
                  {exportOptions.includePrompts && (
                    <p className="italic text-gray-600 mb-3 border-l-4 border-[#5E8E7F] pl-4">
                      "{entry.prompt}"
                    </p>
                  )}
                  
                  <p className="mb-4 leading-relaxed">{entry.content}</p>
                  
                  {exportOptions.includeAIResponses && entry.aiResponse && (
                    <div className="bg-blue-50 border border-blue-200 rounded p-4">
                      <p className="text-blue-700 font-medium text-sm mb-2">🔮 Khepera AI Response</p>
                      <p className="text-gray-700 italic">{entry.aiResponse}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#5E8E7F]/20 flex items-center justify-center">
          <span className="text-2xl">📄</span>
        </div>
        <h1 className="text-3xl font-light text-white mb-2">Export Your Journey</h1>
        <p className="text-white/80">Create a beautiful PDF of your healing journey and insights</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Export Options */}
        <Card className="bg-white/5 border-white/10 p-6">
          <h2 className="text-xl font-medium text-white mb-6">Export Options</h2>
          
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-3 block">Document Style</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { value: 'beautiful', label: 'Beautiful', description: 'Elegant design with colors and styling' },
                  { value: 'minimal', label: 'Minimal', description: 'Clean and simple layout' },
                  { value: 'therapeutic', label: 'Therapeutic', description: 'Professional format for sharing with therapists' }
                ].map(format => (
                  <button
                    key={format.value}
                    onClick={() => handleExportOptionChange('format', format.value)}
                    className={`p-3 rounded-lg text-left transition-all ${
                      exportOptions.format === format.value
                        ? 'bg-[#5E8E7F]/20 border border-[#5E8E7F]'
                        : 'bg-white/5 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-white font-medium">{format.label}</div>
                    <div className="text-white/60 text-xs">{format.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Content Options */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-3 block">Include in Export</label>
              <div className="space-y-3">
                {[
                  { key: 'includePrompts', label: 'Reflection Prompts', description: 'The questions that guided your writing' },
                  { key: 'includeAIResponses', label: 'Khepera AI Responses', description: 'AI insights and reflections on your entries' },
                  { key: 'includeMoodData', label: 'Mood & Wellness Data', description: 'Your mood tracking and wellness metrics' }
                ].map(option => (
                  <label key={option.key} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions[option.key as keyof ExportOptions] as boolean}
                      onChange={(e) => handleExportOptionChange(option.key as keyof ExportOptions, e.target.checked)}
                      className="mt-1 rounded border-white/20 bg-white/10 text-[#5E8E7F] focus:ring-[#5E8E7F]"
                    />
                    <div>
                      <div className="text-white text-sm">{option.label}</div>
                      <div className="text-white/60 text-xs">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Pathway Selection */}
            <div>
              <label className="text-white/90 text-sm font-medium mb-3 block">Pathways to Include</label>
              <div className="space-y-2">
                {['resilience', 'becoming', 'purpose', 'belonging'].map(pathway => (
                  <label key={pathway} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exportOptions.pathways.includes(pathway)}
                      onChange={(e) => {
                        const newPathways = e.target.checked
                          ? [...exportOptions.pathways, pathway]
                          : exportOptions.pathways.filter(p => p !== pathway);
                        handleExportOptionChange('pathways', newPathways);
                      }}
                      className="rounded border-white/20 bg-white/10 text-[#5E8E7F] focus:ring-[#5E8E7F]"
                    />
                    <span className="text-white text-sm capitalize">{pathway}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Export Summary */}
        <Card className="bg-white/5 border-white/10 p-6">
          <h2 className="text-xl font-medium text-white mb-6">Export Summary</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Total Entries</span>
              <span className="text-white font-medium">{entries.length}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Selected Pathways</span>
              <span className="text-white font-medium">{exportOptions.pathways.length}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
              <span className="text-white/80">Export Format</span>
              <span className="text-white font-medium capitalize">{exportOptions.format}</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Preview Export
            </Button>
            
            <Button
              onClick={generatePDF}
              disabled={isExporting || exportOptions.pathways.length === 0}
              className="w-full bg-[#5E8E7F] hover:bg-[#4A6B5E] disabled:opacity-50"
            >
              {isExporting ? 'Generating Export...' : 'Download PDF Export'}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-200 text-sm">
              <span className="font-medium">💡 Pro Tip:</span> Your exported document is perfect for 
              sharing progress with therapists or keeping as a personal growth record.
            </p>
          </div>
        </Card>
      </div>

      {/* Privacy Notice */}
      <Card className="bg-amber-500/10 border-amber-500/20 p-4">
        <div className="flex items-start gap-3">
          <span className="text-amber-400 text-lg">🔒</span>
          <div>
            <p className="text-amber-200 text-sm font-medium mb-1">Privacy & Security</p>
            <p className="text-amber-200/80 text-xs leading-relaxed">
              Your exported document contains personal mental health information. Store it securely 
              and only share with trusted healthcare providers. The export is generated locally - 
              your data never leaves your device during the export process.
            </p>
          </div>
        </div>
      </Card>

      <PreviewModal />
    </div>
  );
}