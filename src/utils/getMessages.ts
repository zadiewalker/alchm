export async function getMessages(locale: string) {
  try {
    const messages = await import(`../messages/${locale}.json`);
    return messages.default; // ⬅️ REQUIRED!
  } catch (error) {
    console.error(`Could not load messages for locale: ${locale}`, error);
    return {}; // fallback
  }
}

