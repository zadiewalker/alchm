// /src/app/page.tsx
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/en'); // Change '/en' if your default locale is different
}
