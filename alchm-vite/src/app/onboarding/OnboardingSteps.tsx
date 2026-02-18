
import { HealthDisclaimer } from '@/components/HealthDisclaimer';
import { MoodSelector } from '@/components/MoodSelector';
import { DESIGN } from '@/lib/design';

type Step = 1 | 2 | 3;

export function OnboardingSteps(props: {
  step: Step;
  prompt: string;
  mood: number | undefined;
  setMood: (v: number) => void;
  content: string;
  setContent: (v: string) => void;
  isSaving: boolean;
  onNext: () => void;
  onFinish: () => void;
}) {
  if (props.step === 1) {
    return (
      <div style={{ marginTop: '18px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
          Welcome to ALCHM
        </h1>
        <p style={{ marginTop: '12px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.7 }}>
          A quiet sanctuary to write what is true, and meet Khepera, an AI companion who reflects gently.
        </p>
        <div style={{ marginTop: '16px' }}>
          <HealthDisclaimer variant="onboarding" />
        </div>
        <button
          type="button"
          onClick={props.onNext}
          aria-label="Continue onboarding"
          style={{
            marginTop: '22px',
            width: '100%',
            minHeight: '52px',
            borderRadius: DESIGN.radius.full,
            border: 'none',
            backgroundColor: DESIGN.colors.gold,
            color: '#fff',
            fontFamily: DESIGN.typography.sansSerif,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '15px',
            fontWeight: DESIGN.typography.weights.medium,
            cursor: 'pointer',
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  if (props.step === 2) {
    return (
      <div style={{ marginTop: '18px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
          Meet Khepera
        </h1>
        <p style={{ marginTop: '12px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.7 }}>
          Khepera listens through five gentle lenses: cognitive, parts, somatic, narrative, and existential. No score. No guilt. Only your words.
        </p>
        <button
          type="button"
          onClick={props.onNext}
          aria-label="Continue onboarding"
          style={{
            marginTop: '22px',
            width: '100%',
            minHeight: '52px',
            borderRadius: DESIGN.radius.full,
            border: 'none',
            backgroundColor: DESIGN.colors.gold,
            color: '#fff',
            fontFamily: DESIGN.typography.sansSerif,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            fontSize: '15px',
            fontWeight: DESIGN.typography.weights.medium,
            cursor: 'pointer',
          }}
        >
          Begin
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '18px' }}>
      <h1 style={{ margin: 0, fontSize: '22px', fontWeight: DESIGN.typography.weights.light, fontFamily: DESIGN.typography.sansSerif }}>
        First entry
      </h1>
      <p style={{ marginTop: '12px', fontSize: '14px', color: DESIGN.colors.textSecondary, lineHeight: 1.7 }}>
        {props.prompt}
      </p>

      <div style={{ marginTop: '16px' }}>
        <div style={{ fontSize: '13px', color: DESIGN.colors.textMuted, marginBottom: '10px' }}>Mood (optional)</div>
        <MoodSelector value={props.mood} onChange={props.setMood} />
      </div>

      <div style={{ marginTop: '16px' }}>
        <textarea
          value={props.content}
          onChange={(e) => props.setContent(e.target.value)}
          aria-label="Write your first journal entry"
          placeholder="One sentence is enough…"
          className="input journal-textarea"
          style={{
            width: '100%',
            minHeight: '160px',
            borderRadius: DESIGN.radius.lg,
            fontFamily: DESIGN.typography.sansSerif,
            fontSize: '16px',
            outline: 'none',
          }}
        />
      </div>

      <button
        type="button"
        onClick={props.onFinish}
        disabled={props.isSaving}
        aria-label="Finish onboarding"
        style={{
          marginTop: '22px',
          width: '100%',
          minHeight: '52px',
          borderRadius: DESIGN.radius.full,
          border: 'none',
          backgroundColor: DESIGN.colors.gold,
          color: '#fff',
          fontFamily: DESIGN.typography.sansSerif,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontSize: '15px',
          fontWeight: DESIGN.typography.weights.medium,
          cursor: props.isSaving ? 'default' : 'pointer',
          opacity: props.isSaving ? 0.75 : 1,
        }}
      >
        {props.isSaving ? 'Saving…' : 'Enter Sanctuary'}
      </button>
    </div>
  );
}
