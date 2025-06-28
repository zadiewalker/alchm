// Update the import path if the file is located elsewhere, for example:
import { getMessages } from '@/utils/getMessages';
// Or create the file at src/utils/getMessages.ts if it doesn't exist.
import JournalPage from './journal/page';

type Params = {
  params: {
    locale: string;
  };
};

export default async function LocalePage({ params }: Params) {
  const messages = await getMessages(params.locale);

  // 🛠 Optional Debug Print
  console.log('[LocalePage] Loaded messages:', messages);

  return <JournalPage messages={messages} />;
}
