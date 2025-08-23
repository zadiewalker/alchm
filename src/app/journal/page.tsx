import { redirect } from 'next/navigation';

// Journal page - redirects to main journals interface
// Created by Firebase Studio Master Diagnostic to resolve build error
export default function JournalPage() {
  // Redirect to journals (plural) which is the main interface
  redirect('/journals');
}

// Metadata for SEO
export const metadata = {
  title: 'Journal - ALCHM',
  description: 'Access your personal journaling space'
};