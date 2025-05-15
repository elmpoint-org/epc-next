import { EMAIL_LOGIN_EXPIRE } from '@@/CONSTANTS';
import { emails } from '@@/email';
import { siteDomain } from '@@/util/dev';
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
  firstName?: string;
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

  // get validation token
  const { data } = await axios
    .post(
      PASSWORDLESS_API + '/signin/generate-token',
      { userId: params.userId, timeToLive: EMAIL_LOGIN_EXPIRE },
      { headers: { ApiSecret: PASSWORDLESS_SECRET } }
    )
    .catch((e) => ({ data: console.log(new Error(e)) }));
  if (!data?.token) throw new Error();

  const url = params.urlTemplate.replace('$TOKEN', data.token);

  const success = await emails.emailLogin(p.email, {
    url,
    firstName: p.firstName,
  });
  if (success) return;

  // use passwordless as a fallback sender
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
