import { z } from 'zod';
import { err, t } from '../trpc';

import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';
import { passwordless, passwordlessSendMagicLink } from '##/auth/passkeys.js';
import { signToken } from '##/auth/sign.js';
import { unixNow } from '@epc/date-ts';

import { COOLDOWN_TIMES } from '@epc/gql-consts/cooldown';

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

    // record the login time
    try {
      await graph(
        graphql(`
          mutation UserLogLogin($id: ID!) {
            userLogLogin(id: $id)
          }
        `),
        { id: credential.userId },
      );
    } catch (_) {}

    return { token: jwt } as const;
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
            firstName
            cooldowns {
              nextLoginEmail
            }
          }
        }
      `),
      { email },
    );
    if (errors || !data?.userFromEmail)
      throw err('BAD_REQUEST', 'USER_NOT_FOUND');

    if (unixNow() < (data.userFromEmail.cooldowns?.nextLoginEmail ?? 0))
      throw err('TOO_MANY_REQUESTS', 'COOLDOWN_VIOLATION');

    // send magic link
    const u = data.userFromEmail;
    await passwordlessSendMagicLink({
      userId: u.id,
      email: u.email,
      firstName: u.firstName ?? undefined,
      redirect,
    }).catch((e) => {
      throw err('BAD_REQUEST', 'MAGIC_LINK_FAILED', e);
    });

    graph(
      graphql(`
        mutation UserCooldownUpdate(
          $userId: ID!
          $updates: UserCooldownUpdateOpts!
        ) {
          userCooldownUpdate(userId: $userId, updates: $updates) {
            id
          }
        }
      `),
      {
        userId: u.id,
        updates: {
          nextLoginEmail: unixNow() + COOLDOWN_TIMES['nextLoginEmail'],
        },
      },
    );
  });
