import { z } from 'zod';
import { err, t } from '../trpc';

import { graph } from '@/db/graph';
import { graphql } from '@/db/lib/utilities';
import {
  PASSWORDLESS_API,
  PASSWORDLESS_SECRET,
  passwordless,
  passwordlessSendMagicLink,
} from '@/auth/passkeys';
import { RegisterOptions } from '@passwordlessdev/passwordless-nodejs';
import { signToken } from '@/auth/sign';
import axios from 'axios';
import { apiDomain, siteDomain } from '@/util/dev';
import { EMAIL_LOGIN_EXPIRE } from '@/CONSTANTS';

function unauth(error?: any) {
  if (typeof error !== 'undefined') console.log(error);
  return err('UNAUTHORIZED', 'AUTHORIZATION_FAILED');
}

// VERIFY A PASSKEY
export const verifyPasskey = t.procedure
  .input(z.object({ token: z.string() }))
  .mutation(async ({ input: { token } }) => {
    const credential = await passwordless.verifyToken(token).catch((e) => {
      throw err('INTERNAL_SERVER_ERROR', 'SERVER_ERROR', e);
    });

    if (!credential) throw unauth();

    const jwt = await signToken(credential.userId).catch((e) => {
      throw unauth(e);
    });

    return { token: jwt } as { token: string };
  });

// REGISTER NEW USER
export const register = t.procedure
  .input(z.object({ email: z.string() }))
  .mutation(async ({ input: { email } }): Promise<string> => {
    // attempt to add user

    const { data, errors } = await graph(
      graphql(`
        mutation UserCreate($email: String!) {
          userCreate(email: $email) {
            id
            email
          }
        }
      `),
      { email }
    );
    if (errors || !data?.userCreate) {
      let m;
      if ((m = errors?.[0]?.extensions?.code))
        throw err('BAD_REQUEST', m as string);
      throw err('INTERNAL_SERVER_ERROR', 'DB_ERROR');
    }
    const user = data.userCreate;

    // get auth token

    const opts = new RegisterOptions();
    opts.userId = user.id;
    opts.username = user.email;

    const { token } = await passwordless
      .createRegisterToken(opts)
      .catch((e) => {
        throw err('INTERNAL_SERVER_ERROR', undefined, e);
      });

    return token;
  });

export const sendMagicLink = t.procedure
  .input(z.object({ email: z.string() }))
  .mutation(async ({ input: { email } }) => {
    // find the user's id from email
    const { data, errors } = await graph(
      graphql(`
        query UserFromEmail($email: String!) {
          userFromEmail(email: $email) {
            id
          }
        }
      `),
      { email }
    );
    if (errors || !data?.userFromEmail)
      throw err('BAD_REQUEST', 'USER_NOT_FOUND');

    // send magic link
    const userId = data.userFromEmail.id;
    await passwordlessSendMagicLink({ email, userId }).catch((e) => {
      throw err('BAD_REQUEST', 'MAGIC_LINK_FAILED', e);
    });
  });
