import { redirect } from 'next/navigation';
import { SupportedLocale } from '@/lib/i18n';

interface LocaleHomePageProps {
  params: { locale: SupportedLocale };
}

// Root locale page redirects to onboarding
export default function LocaleHomePage({ params }: LocaleHomePageProps) {
  redirect(`/${params.locale}/onboarding`);
}