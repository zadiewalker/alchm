import JournalClient from './JournalClient';

export default function Page() {
  // PageState loading/ready is handled inside the client component (static export).
  return <JournalClient />;
}
