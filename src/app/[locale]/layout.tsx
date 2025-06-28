import { ReactNode } from "react";
import { getMessages } from "../../messages/getMessages";
// Update the import path to match the actual file name and casing
import { MessagesProvider } from "../../messages/messagesProvider";
export default async function LocaleLayout({
    children,
    params,
}: {
    children: ReactNode;
    params: { locale: string };
}) {
    const messages = await getMessages(params.locale);

    return (
        <html lang={params.locale}>
            <body>
                <MessagesProvider messages={messages} locale={params.locale}>
                    {children}
                </MessagesProvider>
            </body>
        </html>
    );
}

// Optional: Ensure static generation for supported locales
export async function generateStaticParams() {
    return [
        { locale: "en" },
        { locale: "es" },
        { locale: "pt" },
        { locale: "ko" },
        { locale: "hi" },
        { locale: "de" },
    ];
}






