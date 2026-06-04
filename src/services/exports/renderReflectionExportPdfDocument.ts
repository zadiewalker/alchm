import type { ReflectionExportDocument } from '../../types/exports';
import { getReflectionExportFramingMeta, getReflectionExportTimeWindowMeta, REFLECTION_EXPORT_TRUST_LINE } from '../../config/exports/reflectionExportUi';
import { REFLECTION_EXPORT_TITLE } from '../../config/exports/reflectionExportConstants';
import type { ReflectionExportInput } from '../../types/exports';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderSection(title: string, bodyHtml: string): string {
  return `<section><h2>${escapeHtml(title)}</h2>${bodyHtml}</section>`;
}

function renderParagraph(value: string): string {
  return `<p>${escapeHtml(value)}</p>`;
}

function renderList(items: string[]): string {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function renderExcerpts(document: ReflectionExportDocument): string {
  if (document.selectedExcerpts.length === 0) {
    return '';
  }

  const blocks = document.selectedExcerpts
    .map((excerpt) => {
      const sourceLabel = `${excerpt.sourceType.replace(/_/g, ' ')} · ${escapeHtml(excerpt.createdAt.slice(0, 10))}`;
      return `<div class="excerpt-block"><blockquote>${escapeHtml(excerpt.excerpt)}</blockquote><p class="meta">${sourceLabel}</p></div>`;
    })
    .join('');

  return renderSection('Selected Excerpts', blocks);
}

export function renderReflectionExportPdfDocument(
  document: ReflectionExportDocument,
  input?: ReflectionExportInput,
): string {
  const framing = getReflectionExportFramingMeta(input?.framing ?? 'personal_conversation');
  const timeWindow = getReflectionExportTimeWindowMeta(input?.timeWindow ?? 'custom_selected_items');

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(document.documentTitle)}</title>
    <style>
      :root {
        color-scheme: light;
      }
      body {
        margin: 0;
        padding: 56px 64px 72px;
        font-family: "Jost", "Avenir Next", "Segoe UI", sans-serif;
        color: #6B7A5C;
        background: #F2D99D;
        line-height: 1.75;
      }
      article {
        max-width: 720px;
        margin: 0 auto;
      }
      .trust-line,
      .kicker,
      .meta,
      .footer-note {
        letter-spacing: 0.01em;
      }
      .trust-line {
        margin: 0 0 28px;
        color: rgba(255,255,255,0.8);
        font-size: 13px;
      }
      .kicker {
        margin: 0 0 14px;
        color: rgba(255,255,255,0.8);
        font-size: 12px;
        text-transform: none;
      }
      h1, h2 {
        font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, "Noto Serif", Georgia, serif;
        font-weight: 500;
        color: #6B7A5C;
      }
      h1 {
        margin: 0 0 12px;
        font-size: 42px;
        line-height: 1.1;
      }
      .document-meta {
        display: grid;
        gap: 4px;
        margin: 0 0 40px;
      }
      h2 {
        margin: 42px 0 14px;
        padding-top: 22px;
        border-top: 1px solid rgba(255,255,255,0.1);
        font-size: 25px;
        line-height: 1.2;
      }
      p, li, blockquote {
        font-size: 15px;
        margin: 0;
      }
      p + p {
        margin-top: 12px;
      }
      ul {
        margin: 0;
        padding-left: 20px;
      }
      li + li {
        margin-top: 8px;
      }
      blockquote {
        margin: 0;
        padding: 18px 22px;
        border-left: 2px solid rgba(255,255,255,0.2);
        background: rgba(255,255,255,0.05);
        color: #6B7A5C;
        white-space: pre-wrap;
        font-size: 17px;
        line-height: 1.8;
      }
      .meta {
        margin-top: 10px;
        margin-bottom: 22px;
        color: rgba(255,255,255,0.8);
        font-size: 13px;
      }
      .excerpt-block + .excerpt-block {
        margin-top: 18px;
      }
      .footer-note {
        margin-top: 36px;
        padding-top: 20px;
        border-top: 1px solid rgba(255,255,255,0.1);
        color: rgba(255,255,255,0.8);
        font-size: 13px;
      }
    </style>
  </head>
  <body>
    <article>
      <p class="trust-line">${escapeHtml(REFLECTION_EXPORT_TRUST_LINE)}</p>
      <p class="kicker">${escapeHtml(REFLECTION_EXPORT_TITLE)}</p>
      <h1>${escapeHtml(document.documentTitle)}</h1>
      <div class="document-meta">
        <p>${escapeHtml(framing.label)} · ${escapeHtml(timeWindow.label)}</p>
      </div>
      ${renderSection('Purpose', renderParagraph(document.purpose))}
      ${renderSection('What Has Been Present', renderParagraph(document.whatHasBeenPresent))}
      ${renderSection('Recurring Threads', renderList(document.recurringThreads))}
      ${renderSection('Emotional Landscape', renderParagraph(document.emotionalLandscape))}
      ${renderExcerpts(document)}
      ${renderSection('What You May Want to Carry Forward', renderList(document.conversationOpenings))}
      ${document.userNote ? renderSection('User Note', renderParagraph(document.userNote)) : ''}
      ${renderSection('Boundary Note', renderParagraph(document.boundaryNote))}
      <p class="footer-note">This is yours to share if you choose.</p>
    </article>
  </body>
</html>`;
}
