import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/calendar/me');
}
