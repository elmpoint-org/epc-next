'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

import { CookieOpts } from '@/util/cookies';
import { getTokenExpirationSeconds } from '@/util/extractTokenData';

import { AUTH_EXPIRES_AFTER_DAYS } from '@/CONSTANTS';

export async function login(token: string) {
  const { time } = getTokenExpirationSeconds(token);

  cookies().set('USER_AUTH' as CookieOpts, token, {
    maxAge: time ?? AUTH_EXPIRES_AFTER_DAYS,
  });
}

export async function logout() {
  cookies().delete('USER_AUTH' as CookieOpts);
}

export async function removeStoredToken() {
  logout();
}

export async function invalidateUser() {
  await revalidatePath('/', 'layout');
}
