export const REFLECTION_EXPORT_MARKDOWN_STRUCTURE = [
  '# Reflection Summary',
  '## Purpose',
  '## What Has Been Present',
  '## Recurring Threads',
  '## Emotional Landscape',
  '## Selected Excerpts',
  '## What You May Want to Carry Forward',
  '## User Note',
  '## Boundary Note',
] as const;

export const REFLECTION_EXPORT_MARKDOWN_GUIDANCE = `Render a calm, spacious markdown document with this exact section order:

# Reflection Summary

## Purpose

## What Has Been Present

## Recurring Threads

## Emotional Landscape

## Selected Excerpts
(omit only if empty)

## What You May Want to Carry Forward

## User Note
(omit only if absent)

## Boundary Note

Formatting rules:
- no tables
- no emojis
- bullets only where truly needed
- preserve excerpt wording exactly
- add no interpretation during rendering`;
