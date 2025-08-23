import React from 'react';
import MessagesProvider from '../../components/MessagesProvider';

type Props = {
  children: React.ReactNode;
  messages: Record<string, string>;
  params?: { locale?: string };
};

export default function LocaleLayout({ children, messages, params }: Props) {
  const lang = params?.locale ?? 'en';
  return (
    <html lang={lang}>
      <body>
        <MessagesProvider messages={messages}>{children}</MessagesProvider>
      </body>
    </html>
  );
}

// Optional: static generation for supported locales
export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'es' },
    { locale: 'pt' },
    { locale: 'ko' },
    { locale: 'hi' },
    { locale: 'de' },
  ];
}
