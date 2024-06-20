import { EMAIL_LOGIN_EXPIRE } from '@@/CONSTANTS';
import { isDev, siteDomain } from '@@/util/dev';
import { PasswordlessClient } from '@passwordlessdev/passwordless-nodejs';
import axios from 'axios';
import qs from 'qs';

export const PASSWORDLESS_API = 'https://v4.passwordless.dev';
export const PASSWORDLESS_SECRET = process.env.PASSWORDLESS_SECRET;

export const passwordless = new PasswordlessClient(PASSWORDLESS_SECRET!, {
  baseUrl: PASSWORDLESS_API,
});

export async function passwordlessSendMagicLink(p: {
  email: string;
  userId: string;
  redirect?: string;
}) {
  const params = {
    emailAddress: p.email,
    userId: p.userId,
    urlTemplate:
      siteDomain +
      `/auth/email?${qs.stringify({
        to: p.redirect,
      })}&token=$TOKEN`,
    timeToLive: EMAIL_LOGIN_EXPIRE,
  };

  if (isDev) {
    // generate fake login email for dev environments
    const { data } = await axios.post(
      PASSWORDLESS_API + '/signin/generate-token',
      { userId: params.userId },
      { headers: { ApiSecret: PASSWORDLESS_SECRET } }
    );
    const out = {
      ...params,
      urlTemplate: undefined,
      url: params.urlTemplate.replace('$TOKEN', data?.token),
    };
    console.log('MAGIC LINK EMAIL\n', out);
    return;
  }

  await axios.post(PASSWORDLESS_API + '/magic-links/send', params, {
    headers: { ApiSecret: PASSWORDLESS_SECRET },
  });
}

export const passwordlessDeleteCredential = (credentialId: string) =>
  axios.post(
    PASSWORDLESS_API + '/credentials/delete',
    { credentialId },
    { headers: { ApiSecret: PASSWORDLESS_SECRET } }
  );
