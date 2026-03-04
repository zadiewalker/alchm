// @ts-nocheck
import { useState } from 'react';
import { useKheperaReflection } from './useKheperaReflection';

export function useDepthEntryFlow() {
  const [layer, setLayer] = useState<'name' | 'feel' | 'write' | 'reflect' | 'explore' | 'closing'>('name');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [emotionSelection, setEmotionSelection] = useState<any>(null);
  const [somatic, setSomatic] = useState<any>(null);
  const [savedId, setSavedId] = useState<string | null>(null);
  const reflection = useKheperaReflection({ preferredFramework: null });

  return {
    state: 'ready' as const,
    layer,
    setLayer,
    content,
    setContent,
    tags,
    setTags,
    emotionSelection,
    setEmotionSelection,
    somatic,
    setSomatic,
    onSomaticContinue: () => setLayer('write'),
    savedId,
    isSaving: false,
    onSave: async () => { const id = savedId || `${Date.now()}`; setSavedId(id); },
    writingPrompt: '',
    pathwayId: null as string | null,
    pathwayStep: null as number | null,
    settings: { preferredFramework: null as string | null },
    setBodyMap: () => {},
    setVoiceCaptureMeta: () => {},
    lens: 'mirror',
    isReflecting: reflection.isReflecting,
    reflection: reflection.reflection,
    reflectionPayload: reflection.payload,
    reflectionKind: reflection.reflectionKind,
    reflectionError: reflection.error,
    savedCrisis: null,
    reflect: reflection.reflect,
    onReflectionComplete: () => {},
    lateNight: false,
    setCheckInState: () => {},
  };
}
