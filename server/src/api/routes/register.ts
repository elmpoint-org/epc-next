import { z } from 'zod';
import { err, t } from '../trpc';
import { graph } from '@@/db/graph';
import { graphql } from '@@/db/lib/utilities';
import { signReferralToken } from '@@/auth/sign';
import { sendTestEmail } from '@@/email/send';

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
    // sendTestEmail().catch((err) => console.log(err));
  });
