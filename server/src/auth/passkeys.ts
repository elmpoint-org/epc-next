import { PasswordlessClient } from '@passwordlessdev/passwordless-nodejs';

export const PASSWORDLESS_API = 'https://v4.passwordless.dev';
export const PASSWORDLESS_SECRET = process.env.PASSWORDLESS_SECRET;

export const passwordless = new PasswordlessClient(PASSWORDLESS_SECRET!, {
  baseUrl: PASSWORDLESS_API,
});
