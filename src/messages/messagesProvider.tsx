"use client";

import { ReactNode, createContext, useContext } from "react";

type MessagesContextType = {
    messages: Record<string, string>;
    locale: string;
};

// Create the context
const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

// Provider component
export function MessagesProvider({
    children,
    messages,
    locale,
}: {
    children: ReactNode;
    messages: Record<string, string>;
    locale: string;
}) {
    return (
        <MessagesContext.Provider value={{ messages, locale }}>
            {children}
        </MessagesContext.Provider>
    );
}

// Hook to consume messages in client components
export function useMessages() {
    const context = useContext(MessagesContext);
    if (!context) {
        throw new Error("useMessages must be used within a MessagesProvider");
    }
    return context;
}
