'use server';

import { AUTH_EXPIRES_AFTER_DAYS } from '@/CONSTANTS';
import { CookieOpts } from '@/util/cookies';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const daysToSeconds = (a: number) => a * 60 * 60 * 24;

export async function login(token: string) {
  cookies().set('USER_AUTH' as CookieOpts, token, {
    maxAge: daysToSeconds(AUTH_EXPIRES_AFTER_DAYS),
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
