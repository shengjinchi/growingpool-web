import { redirect } from 'next/navigation';

export default async function RootPage() {
  // Always redirect to Chinese page
  redirect('/zh');
}
