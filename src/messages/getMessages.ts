const dictionaries = {
  en: () => import('./en.json').then((mod) => mod.default),
  es: () => import('./es.json').then((mod) => mod.default),
  pt: () => import('./pt.json').then((mod) => mod.default),
  hi: () => import('./hi.json').then((mod) => mod.default),
  ko: () => import('./ko.json').then((mod) => mod.default),
  de: () => import('./de.json').then((mod) => mod.default),
};

export const getMessages = async (locale: string) => {
  const loadMessages =
    dictionaries[locale as keyof typeof dictionaries] || dictionaries.en;

  return loadMessages();
};
