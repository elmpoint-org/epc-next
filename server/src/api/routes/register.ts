import { z } from 'zod';
import { err, t } from '../trpc';

import { graph } from '@@/db/graph';
import { graphql } from '@@/db/lib/utilities';
import { signReferralToken } from '@@/auth/sign';
import { sendRegistrationEmail } from '@@/email/send';
import { verifyReferralToken } from '@@/auth/verify';

export const checkReferral = t.procedure
  .input(z.object({ email: z.string() }))
  .mutation(async ({ input: { email } }) => {
    // try to find a matching pre-user
    const { data, errors } = await graph(
      graphql(`
        query PreUserFromEmail($email: String!) {
          preUserFromEmail(email: $email) {
            id
          }
        }
      `),
      { email }
    );
    if (errors || !data?.preUserFromEmail)
      throw err('BAD_REQUEST', 'NEEDS_REFERRAL');
    const { id } = data.preUserFromEmail;

    // sign referral token
    const token = await signReferralToken(id).catch(() => {
      throw err('INTERNAL_SERVER_ERROR', 'SERVER_ERROR');
    });

    // send email
    await sendRegistrationEmail(token).catch((e) => {
      throw err('INTERNAL_SERVER_ERROR', 'FAILED_TO_SEND_EMAIL', e);
    });
  });

export const verifyToken = t.procedure
  .input(z.object({ token: z.string() }))
  .mutation(async ({ input: { token } }) => {
    // verify token and get preuser id
    const id = await verifyReferralToken(token);

    // get the rest of the user's data
    const { data, errors } = await graph(
      graphql(`
        query PreUser($id: ID!) {
          preUser(id: $id) {
            id
            email
            name
          }
        }
      `),
      { id }
    );
    if (errors || !data?.preUser) throw err('BAD_REQUEST', 'USER_NOT_FOUND');

    return data.preUser;
  });
