'use server';

import { revalidatePath } from 'next/cache';

export async function revalidatePage(slug: string) {
  revalidatePath(`/pages/${slug}`);
}
