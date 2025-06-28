import { getMessages } from '../../messages/getMessages';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages(params.locale);

  return (
    <html lang={params.locale}>
      <body>{children}</body>
    </html>
  );
}

// 👇 This lets Next.js statically generate pages at build time
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





