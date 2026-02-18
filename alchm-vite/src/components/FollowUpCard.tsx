import { useEffect, useState } from 'react';
import { DESIGN } from '@/lib/design';

export function FollowUpCard(props: {
  visible: boolean;
  question: string | null;
  isLoading: boolean;
  onRequest: () => void;
  onSaveResponse: (response: string) => void;
  onDone: () => void;
}) {
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Reset when a new question arrives.
    if (props.question) setResponse('');
  }, [props.question]);

  useEffect(() => {
    if (props.visible && !props.question && !props.isLoading) props.onRequest();
  }, [props.isLoading, props.onRequest, props.question, props.visible]);

  if (!props.visible) return null;

  return (
    <div style={{ marginTop: '14px' }} aria-label="Khepera follow-up">
      <div
        className="card"
        style={{
          padding: '16px',
          borderLeft: `3px solid ${DESIGN.colors.gold}`,
          background: DESIGN.gradients.cardWarm,
        }}
      >
        <div style={{ fontSize: '12px', letterSpacing: '0.10em', textTransform: 'uppercase', color: DESIGN.colors.textMuted }}>
          Explore it (optional)
        </div>

        <div style={{ marginTop: '10px', fontSize: '15px', lineHeight: 1.7, color: DESIGN.colors.gold }}>
          {props.isLoading && !props.question ? '…' : props.question ? `“${props.question}”` : ''}
        </div>

        {props.question ? (
          <>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              aria-label="Write a response to Khepera's question"
              placeholder="Write a few words (optional)…"
              className="input"
              style={{
                marginTop: '12px',
                width: '100%',
                minHeight: '90px',
                resize: 'none',
                borderRadius: DESIGN.radius.lg,
                fontFamily: DESIGN.typography.sansSerif,
                fontSize: '16px',
                outline: 'none',
                lineHeight: 1.7,
              }}
            />

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
              <button
                type="button"
                onClick={() => props.onSaveResponse(response)}
                aria-label="Save response"
                className="btn-secondary"
                disabled={!response.trim()}
                style={{
                  borderRadius: DESIGN.radius.full,
                  fontFamily: DESIGN.typography.sansSerif,
                  cursor: response.trim() ? 'pointer' : 'default',
                  opacity: response.trim() ? 1 : 0.5,
                }}
              >
                Save response
              </button>

              <button
                type="button"
                onClick={props.onDone}
                aria-label="Finish without responding"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: DESIGN.colors.textMuted,
                  fontFamily: DESIGN.typography.sansSerif,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
              >
                I&apos;m done for now
              </button>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={props.onDone}
            aria-label="Skip follow-up"
            style={{
              marginTop: '10px',
              border: 'none',
              background: 'transparent',
              color: DESIGN.colors.textMuted,
              fontFamily: DESIGN.typography.sansSerif,
              cursor: 'pointer',
              minHeight: '44px',
              padding: 0,
            }}
          >
            I&apos;m done for now
          </button>
        )}
      </div>
    </div>
  );
}

