import type {
  ReflectionExportFraming,
  ReflectionExportTimeWindow,
} from '@/types/exports';

export const REFLECTION_EXPORT_TRUST_LINE =
  'Only what you selected is included. Nothing else is gathered into this document.';

export const REFLECTION_EXPORT_COMPLETION_TITLE =
  'This is yours to share if you choose.';

export const REFLECTION_EXPORT_COMPLETION_BODY =
  'You can keep this, share it, or leave it with yourself for now.';

export const REFLECTION_EXPORT_FRAMING_OPTIONS: Array<{
  value: ReflectionExportFraming;
  label: string;
  title: string;
  purposeLead: string;
}> = [
  {
    value: 'shareable_reflection',
    label: 'Shareable reflection',
    title: 'Reflection Summary',
    purposeLead: 'This reflection summary gathers only the material selected for export so your own words can travel in a form you can keep or share.',
  },
  {
    value: 'personal_conversation',
    label: 'Selected reflection',
    title: 'Selected Reflection Summary',
    purposeLead: 'This reflection summary gathers only the material selected for export so your own words can travel in a form you may choose to bring elsewhere.',
  },
  {
    value: 'just_for_me',
    label: 'For yourself',
    title: 'Personal Reflection Summary',
    purposeLead: 'This reflection summary gathers only the material selected for export so it can stay with you, in your own language, on your own time.',
  },
];

export const REFLECTION_EXPORT_TIME_WINDOW_OPTIONS: Array<{
  value: ReflectionExportTimeWindow;
  label: string;
  days: number | null;
}> = [
  { value: 'last_2_weeks', label: 'Last 2 weeks', days: 14 },
  { value: 'last_month', label: 'Last month', days: 31 },
  { value: 'last_3_months', label: 'Last 3 months', days: 92 },
  { value: 'custom_selected_items', label: 'Custom selected items', days: null },
];

export function getReflectionExportFramingMeta(
  framing: ReflectionExportFraming,
) {
  return (
    REFLECTION_EXPORT_FRAMING_OPTIONS.find((option) => option.value === framing) ??
    REFLECTION_EXPORT_FRAMING_OPTIONS[1]
  );
}

export function getReflectionExportTimeWindowMeta(
  timeWindow: ReflectionExportTimeWindow,
) {
  return (
    REFLECTION_EXPORT_TIME_WINDOW_OPTIONS.find((option) => option.value === timeWindow) ??
    REFLECTION_EXPORT_TIME_WINDOW_OPTIONS[3]
  );
}
