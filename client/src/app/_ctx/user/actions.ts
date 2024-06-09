'use server';

import { CookieOpts } from '@/util/cookies';
import { cookies } from 'next/headers';

export async function login(token: string) {
  const c = cookies();
  c.set('USER_AUTH' as CookieOpts, token);
}

export async function logout() {
  const c = cookies();
  c.delete('USER_AUTH' as CookieOpts);
}
