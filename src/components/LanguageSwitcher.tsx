'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';

const locales = ['en', 'es', 'pt', 'hi', 'ko', 'de'];

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = event.target.value;
    const segments = pathname.split('/');

    // Replace the existing locale segment
    if (segments.length > 1) {
      segments[1] = newLocale;
    }

    router.push(segments.join('/'));
  };

  return (
    <div className="mb-4">
      <label htmlFor="language-select" className="mr-2 font-medium">
        🌍 Language:
      </label>
      <select
        id="language-select"
        onChange={handleChange}
        value={pathname.split('/')[1]}
        className="border rounded px-2 py-1"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}
