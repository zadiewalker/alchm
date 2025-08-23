import { redirect } from 'next/navigation';

// Temporary dashboard page that redirects to journals
// This resolves Firebase Studio build error while maintaining UX
export default function DashboardPage() {
  redirect('/journals');
}