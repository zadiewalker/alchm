'use client';

import { useState, useEffect } from 'react';
import { Badge, ExportConfig, EXPORT_EXAMPLES, badgeToJSON, badgesToCSV, generateBadgePDF, generateBadgePNG, validateExportRequest, downloadFile } from '@/lib/badges/export';
import { badgeService } from '@/lib/badges/service';
import { useAuth } from '@/lib/useAuth';
import { Card } from '@/components/ui/card';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function BadgeExporter() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [exportConfig, setExportConfig] = useState<ExportConfig>({
    includePersonalNotes: true,
    includeMetadata: true,
    format: 'pdf',
    studentName: '',
    exportDate: new Date().toLocaleDateString(),
    schoolYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  });

  useEffect(() => {
    if (user) {
      loadBadges();
    }
  }, [user]);

  const loadBadges = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const userBadges = await badgeService.getUserBadges(user.uid);
      setBadges(userBadges);
    } catch (error) {
      console.error('Error loading badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!user || badges.length === 0) return;

    const validation = validateExportRequest(badges, exportConfig);
    if (!validation.isValid) {
      alert(`Export validation failed: ${validation.errors.join(', ')}`);
      return;
    }

    setExporting(true);
    try {
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${exportConfig.studentName || 'student'}-alchm-badges-${timestamp}`;

      switch (exportConfig.format) {
        case 'json':
          const jsonData = badgeToJSON(badges, exportConfig);
          downloadFile(jsonData, `${filename}.json`, 'application/json');
          break;

        case 'csv':
          const csvData = badgesToCSV(badges, exportConfig);
          downloadFile(csvData, `${filename}.csv`, 'text/csv');
          break;

        case 'pdf':
          const pdfHtml = generateBadgePDF(badges, exportConfig);
          // Open in new window for printing/saving as PDF
          const newWindow = window.open('', '_blank');
          if (newWindow) {
            newWindow.document.write(pdfHtml);
            newWindow.document.close();
          }
          break;

        case 'png':
          const pngDataUrl = await generateBadgePNG(badges, exportConfig);
          const link = document.createElement('a');
          link.href = pngDataUrl;
          link.download = `${filename}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          break;
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p>Loading your badges...</p>
        </div>
      </Card>
    );
  }

  if (badges.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
          <p className="text-[var(--ink-mute)] mb-4">
            Keep journaling to earn your first badges! Every entry brings you closer to meaningful achievements.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Badge Overview */}
      <Card className="p-6">
        <h2 className="text-2xl font-medium mb-4">Badge Portfolio Export</h2>
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-medium text-[var(--sage)]">{badges.length}</div>
            <div className="text-sm text-[var(--ink-mute)]">Total Badges</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-[var(--terra)]">
              {badges.filter(b => b.category === 'presence').length}
            </div>
            <div className="text-sm text-[var(--ink-mute)]">Presence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-[var(--sage)]">
              {badges.filter(b => b.category === 'reflection').length}
            </div>
            <div className="text-sm text-[var(--ink-mute)]">Reflection</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-medium text-[var(--terra)]">
              {badges.filter(b => b.category === 'growth').length + badges.filter(b => b.category === 'community').length}
            </div>
            <div className="text-sm text-[var(--ink-mute)]">Growth & Community</div>
          </div>
        </div>

        {/* Recent Badges Preview */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Recent Achievements</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {badges.slice(0, 3).map((badge) => (
              <div key={badge.id} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--blush)]/30">
                <div className="w-10 h-10 rounded-full bg-[var(--sage)] flex items-center justify-center text-white font-medium">
                  {badge.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{badge.name}</div>
                  <div className="text-xs text-[var(--ink-mute)] capitalize">{badge.category}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Export Configuration */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Export Settings</h3>
        
        <div className="space-y-4">
          {/* Student Name */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Student Name (optional)
            </label>
            <input
              type="text"
              value={exportConfig.studentName}
              onChange={(e) => setExportConfig(prev => ({ ...prev, studentName: e.target.value }))}
              placeholder="Enter student name for personalized export"
              className="w-full px-4 py-2 rounded-xl border border-[var(--line)] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra)] transition-all duration-base"
            />
          </div>

          {/* School Year */}
          <div>
            <label className="block text-sm font-medium mb-2">
              School Year (optional)
            </label>
            <input
              type="text"
              value={exportConfig.schoolYear}
              onChange={(e) => setExportConfig(prev => ({ ...prev, schoolYear: e.target.value }))}
              placeholder="e.g., 2024-2025"
              className="w-full px-4 py-2 rounded-xl border border-[var(--line)] bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--terra)] transition-all duration-base"
            />
          </div>

          {/* Export Options */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Include in Export
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportConfig.includeMetadata}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, includeMetadata: e.target.checked }))}
                  className="rounded border-[var(--line)]"
                />
                <span className="text-sm">Badge metadata (streak lengths, counts, etc.)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={exportConfig.includePersonalNotes}
                  onChange={(e) => setExportConfig(prev => ({ ...prev, includePersonalNotes: e.target.checked }))}
                  className="rounded border-[var(--line)]"
                />
                <span className="text-sm">Personal notes and reflections</span>
              </label>
            </div>
          </div>
        </div>
      </Card>

      {/* Export Format Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Choose Export Format</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          {Object.entries(EXPORT_EXAMPLES).map(([format, info]) => (
            <div
              key={format}
              className={`p-4 rounded-xl border cursor-pointer transition-colors duration-base ${
                exportConfig.format === format
                  ? 'border-[var(--sage)] bg-[var(--sage)]/10'
                  : 'border-[var(--line)] hover:border-[var(--sage)]'
              }`}
              onClick={() => setExportConfig(prev => ({ ...prev, format: format as any }))}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium uppercase text-sm">{format}</h4>
                <span className="text-xs text-[var(--ink-mute)]">{info.fileExtension}</span>
              </div>
              <p className="text-sm text-[var(--ink-mute)] mb-2">{info.description}</p>
              <p className="text-xs text-[var(--sage)]">{info.useCase}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Export Action */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Ready to Export</h3>
            <p className="text-sm text-[var(--ink-mute)]">
              Export {badges.length} badges as {exportConfig.format.toUpperCase()}
            </p>
          </div>
          <PrimaryButton 
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? 'Exporting...' : `Export ${exportConfig.format.toUpperCase()}`}
          </PrimaryButton>
        </div>
        
        {exportConfig.format === 'pdf' && (
          <div className="mt-4 p-4 rounded-xl bg-[var(--blush)]/30">
            <p className="text-sm">
              <strong>PDF Export:</strong> A new window will open with your badge portfolio. 
              Use your browser's print function and select "Save as PDF" to download.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}