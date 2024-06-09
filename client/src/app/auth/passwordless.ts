import { ErrorMap, prettyError } from '@/util/prettyErrors';
import { Client } from '@passwordlessdev/passwordless-client';
import {
  PromiseResult,
  TokenResponse,
} from '@passwordlessdev/passwordless-client/dist/types';
import { useEffect, useRef } from 'react';

export const initPasswordless = () =>
  new Client({
    apiKey: 'elmpointorg:public:9020008d8b6b49a2919e44e39d59b2c3',
    apiUrl: 'https://v4.passwordless.dev',
  });

export const usePkey = () => {
  const pkey = useRef<Client | null>(null);
  useEffect(() => {
    pkey.current = initPasswordless();
  }, []);

  return pkey;
};

export type TokenResponseType = Awaited<PromiseResult<TokenResponse>>;

export const pkeyErrorMap = prettyError({
  __DEFAULT: 'Something went wrong. Try again.',

  unknown: 'Your device had an error. Try reloading the page.',
  unknown_credential: `That passkey wasn't found in your account. If it's outdated, you should delete it.`,
  magic_link_email_quota_exceeded: `We're having trouble sending email links right now. Please use a passkey or try again in a few minutes.`,
});
