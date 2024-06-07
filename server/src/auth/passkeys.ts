import { EMAIL_LOGIN_EXPIRE } from '@/CONSTANTS';
import { siteDomain } from '@/util/dev';
import { PasswordlessClient } from '@passwordlessdev/passwordless-nodejs';
import axios from 'axios';

export const PASSWORDLESS_API = 'https://v4.passwordless.dev';
export const PASSWORDLESS_SECRET = process.env.PASSWORDLESS_SECRET;

export const passwordless = new PasswordlessClient(PASSWORDLESS_SECRET!, {
  baseUrl: PASSWORDLESS_API,
});

export const passwordlessSendMagicLink = (p: {
  email: string;
  userId: string;
}) =>
  axios.post(
    PASSWORDLESS_API + '/magic-links/send',
    {
      emailAddress: p.email,
      userId: p.userId,
      urlTemplate: siteDomain + '/auth/email?token=$TOKEN',
      timeToLive: EMAIL_LOGIN_EXPIRE,
    },
    { headers: { ApiSecret: PASSWORDLESS_SECRET } }
  );
