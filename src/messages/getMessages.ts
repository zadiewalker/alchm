export async function getMessages(locale: string) {
  try {
    const messages = await import(`../locales/${locale}.json`);
    return messages.default;
  } catch (e) {
    console.warn(`Locale ${locale} not found, defaulting to English`);
    const fallback = await import(`../locales/en.json`);
    return fallback.default;
  }
}
