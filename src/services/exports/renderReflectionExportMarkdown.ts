import type { ReflectionExportDocument, ReflectionExportSelectedExcerpt } from '../../types/exports';
import { REFLECTION_EXPORT_TITLE } from '../../config/exports/reflectionExportConstants';

function normalizeParagraph(value: string): string {
  return value.trim();
}

function renderBulletList(items: string[]): string {
  return items.map((item) => `- ${item.trim()}`).join('\n');
}

function renderExcerpt(excerpt: ReflectionExportSelectedExcerpt): string {
  return [
    `> ${excerpt.excerpt}`,
    '',
    `${formatSourceType(excerpt.sourceType)} · ${formatDate(excerpt.createdAt)}`,
  ].join('\n');
}

function formatSourceType(sourceType: ReflectionExportSelectedExcerpt['sourceType']): string {
  switch (sourceType) {
    case 'journal_entry':
      return 'Journal entry';
    case 'khepera_reflection':
      return 'Khepera reflection';
    case 'return':
      return 'Return';
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  return date.toISOString().slice(0, 10);
}

export function renderReflectionExportMarkdown(document: ReflectionExportDocument): string {
  const sections: string[] = [
    `# ${REFLECTION_EXPORT_TITLE}`,
    '',
    '## Purpose',
    '',
    normalizeParagraph(document.purpose),
    '',
    '## What Has Been Present',
    '',
    normalizeParagraph(document.whatHasBeenPresent),
    '',
    '## Recurring Threads',
    '',
    renderBulletList(document.recurringThreads),
    '',
    '## Emotional Landscape',
    '',
    normalizeParagraph(document.emotionalLandscape),
  ];

  if (document.selectedExcerpts.length > 0) {
    sections.push(
      '',
      '## Selected Excerpts',
      '',
      document.selectedExcerpts.map(renderExcerpt).join('\n\n')
    );
  }

  sections.push(
    '',
    '## What You May Want to Carry Forward',
    '',
    renderBulletList(document.conversationOpenings)
  );

  if (document.userNote) {
    sections.push(
      '',
      '## User Note',
      '',
      normalizeParagraph(document.userNote)
    );
  }

  sections.push(
    '',
    '## Boundary Note',
    '',
    normalizeParagraph(document.boundaryNote)
  );

  return `${sections.join('\n').trim()}\n`;
}
