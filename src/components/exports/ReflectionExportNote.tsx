'use client';

import { AppText } from '@/components/ui/AppText';

type ReflectionExportNoteProps = {
  value: string;
  onChange: (value: string) => void;
};

export function ReflectionExportNote({
  value,
  onChange,
}: ReflectionExportNoteProps): React.JSX.Element {
  return (
    <div className="export-note-block">
      <div className="export-note-header">
        <AppText variant="label" as="p">
          Anything you want to add to this document?
        </AppText>
        <AppText variant="whisper" as="p">
          Optional. This note stays exactly as you write it.
        </AppText>
      </div>
      <label className="export-note-label">
        <span className="sr-only">Optional note for this export</span>
        <textarea
          className="export-note-field"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          placeholder="Add a short note if you want one carried with the selections above."
        />
      </label>
    </div>
  );
}
