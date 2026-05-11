import type { ReactNode } from 'react';

export function PageTransition(props: { transitionKey: string; kind?: string; children: ReactNode }) {
  return <div key={props.transitionKey} data-transition-kind={props.kind || 'forward'}>{props.children}</div>;
}
