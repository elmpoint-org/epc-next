import { z } from 'zod';
import { err, t } from '../trpc';
import { RegisterOptions } from '@passwordlessdev/passwordless-nodejs';

import { graph } from '@@/db/graph';
import { graphql } from '@@/db/lib/utilities';
import { passwordless, passwordlessSendMagicLink } from '@@/auth/passkeys';
import { signToken } from '@@/auth/sign';

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

export const sendMagicLink = t.procedure
  .input(z.object({ email: z.string(), redirect: z.string().optional() }))
  .mutation(async ({ input: { email, redirect } }) => {
    // find the user's id from email
    const { data, errors } = await graph(
      graphql(`
        query UserFromEmail($email: String!) {
          userFromEmail(email: $email) {
            id
            email
          }
        }
      `),
      { email }
    );
    if (errors || !data?.userFromEmail)
      throw err('BAD_REQUEST', 'USER_NOT_FOUND');

    // send magic link
    const u = data.userFromEmail;
    await passwordlessSendMagicLink({
      userId: u.id,
      email: u.email,
      redirect,
    }).catch((e) => {
      throw err('BAD_REQUEST', 'MAGIC_LINK_FAILED', e);
    });
  });
