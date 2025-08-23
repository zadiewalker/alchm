import React from 'react';

type Props = {
  messages: Record<string, string>;
  children: React.ReactNode;
};

/** Minimal i18n/messages provider stub. Replace with your real provider when ready. */
export default function MessagesProvider({ messages, children }: Props) {
  // TODO: wire messages into context if needed
  return <>{children}</>;
}
