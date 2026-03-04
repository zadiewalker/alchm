import { useRouter } from '@/router';

export function PageHeader(props: { title: string; subtitle?: string; hideBack?: boolean }) {
  const router = useRouter();
  return (
    <header style={{ padding: '8px 24px 0' }}>
      {!props.hideBack ? (
        <button type="button" className="back-button" onClick={() => router.back()} aria-label="Go back">
          ← Back
        </button>
      ) : null}
      <h1 className="page-header-title" style={{ marginTop: props.hideBack ? '12px' : '8px' }}>{props.title}</h1>
      {props.subtitle ? <p className="page-header-subtitle">{props.subtitle}</p> : null}
    </header>
  );
}
