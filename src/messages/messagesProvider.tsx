'use client';

import { ReactNode, createContext, useContext } from 'react';

const MessagesContext = createContext<Record<string, string>>({});

export const MessagesProvider = ({
  children,
  messages,
}: {
  children: ReactNode;
  messages: Record<string, string>;
}) => {
  return (
    <MessagesContext.Provider value={messages}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => useContext(MessagesContext);
