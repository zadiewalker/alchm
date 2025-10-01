import { Metadata } from 'next';
import SignupClient from './SignupClient';

// Generate static params for supported locales
export async function generateStaticParams() {
  const locales = ['en', 'es', 'pt', 'sw', 'ar', 'hi', 'zh', 'fr', 'yo', 'ko', 'de'];
  
  return locales.map((locale) => ({
    locale: locale,
  }));
}

export const metadata: Metadata = {
  title: 'Sign Up - ALCHM',
  description: 'Create your ALCHM trauma-informed journaling sanctuary',
};

export default function SignupPage() {
  return <SignupClient />;
}