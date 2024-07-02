import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { createNewPage } from '../_actions/create';

export const metadata: Metadata = {
  title: 'Create new page',
};

export default async function NewPagePage() {
  const { data, error } = await createNewPage();
  if (error || !data) return <>An error occurred.</>;

  redirect(`/cms/pages/edit/${data.id}`);
}
