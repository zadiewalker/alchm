import { redirect } from 'next/navigation';

// Phantom download page detected by Firebase Studio
// Redirects to main app to maintain UX
export default function DownloadPage() {
  redirect('/');
}