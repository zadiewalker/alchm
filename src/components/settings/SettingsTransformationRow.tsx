'use client';

import { Sparkles } from 'lucide-react';
import { useTransformationAccess } from '@/hooks/useTransformationAccess';
import { SettingsRow } from '@/components/settings/SettingsPrimitives';

export function SettingsTransformationRow(): React.JSX.Element {
  const transformation = useTransformationAccess({
    surface: 'settings',
    source: 'settings_transformation',
    route: '/settings',
  });

  return (
    <SettingsRow
      icon={<Sparkles size={16} strokeWidth={1.7} />}
      label="Transformation"
      sublabel="Upgrade, restore, manage"
      type="navigation"
      onPress={transformation.openTransformation}
    />
  );
}
