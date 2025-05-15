import { redirect } from 'next/navigation';

const HREF = `https://www.google.com/maps/place/14+Elm+Point+Rd,+Mirror+Lake,+NH+03853/`;

export async function GET() {
  redirect(HREF);
}
