import { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Generate static params for supported locales
export async function generateStaticParams() {
  const locales = ['en', 'es', 'pt', 'sw', 'ar', 'hi', 'zh', 'fr', 'yo', 'ko', 'de'];
  
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export const metadata: Metadata = {
  title: 'Start Healing - ALCHM',
  description: 'Begin your trauma-informed journaling journey with ALCHM',
};

// Redirect login page to main landing page for guest-first experience
export default function LoginPage() {
  redirect('/');
}