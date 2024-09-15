import { z } from 'zod';
import { err, t } from '../trpc';

import { graph } from '@@/db/graph';
import { graphql } from '@@/db/lib/utilities';
import { signReferralToken, signToken } from '@@/auth/sign';
import { verifyReferralToken } from '@@/auth/verify';
import { emails } from '@@/email';

export const checkReferral = t.procedure
  .input(z.object({ email: z.string() }))
  .mutation(async ({ input: { email } }) => {
    // try to find a matching pre-user
    const { data, errors } = await graph(
      graphql(`
        query PreUserFromEmail($email: String!) {
          preUserFromEmail(email: $email) {
            id
            email
          }
        }
      `),
      { email }
    );
    if (errors || !data?.preUserFromEmail)
      throw err('BAD_REQUEST', 'NEEDS_REFERRAL');
    const { id, email: parsedEmail } = data.preUserFromEmail;

    // sign referral token
    const token = await signReferralToken(id).catch(() => {
      throw err('INTERNAL_SERVER_ERROR', 'SERVER_ERROR');
    });

    // send email
    const success = await emails.emailRegistration(parsedEmail, { token });
    if (!success) throw err('INTERNAL_SERVER_ERROR', 'EMAIL_SEND_FAILED');
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

/**
 * create user from preuser
 * @returns a new auth token for the user
 */
export const createUser = t.procedure
  .input(
    z.object({
      user: z.object({
        name: z.string(),
        firstName: z.string(),
        email: z.string(),
      }),
      token: z.string(),
    })
  )
  .mutation(async ({ input: { user, token } }) => {
    // authenticate
    const preUserId = await verifyReferralToken(token);

    // validate preuser
    const { data: d0, errors: e0 } = await graph(
      graphql(`
        query GetPreUser($preUserId: ID!) {
          preUser(id: $preUserId) {
            id
            scope
          }
        }
      `),
      { preUserId }
    );
    if (e0 || !d0?.preUser) throw err('BAD_REQUEST', 'REFERRAL_NOT_FOUND');

    // create full user
    const { data: d1, errors: e1 } = await graph(
      graphql(`
        mutation UserCreate(
          $email: String!
          $name: String!
          $firstName: String!
          $scope: [UserScopeProp!]
        ) {
          userCreate(
            email: $email
            name: $name
            firstName: $firstName
            scope: $scope
          ) {
            id
          }
        }
      `),
      { ...user, scope: d0.preUser.scope }
    );
    if (e1 || !d1?.userCreate)
      throw err(
        'BAD_REQUEST',
        (e1?.[0]?.extensions?.code as string) ?? 'FAILED_TO_CREATE_USER'
      );
    const userId = d1.userCreate.id;

    // delete preuser
    const { data: d2, errors: e2 } = await graph(
      graphql(`
        mutation DeletePreUser($preUserId: ID!) {
          preUserDelete(id: $preUserId) {
            id
          }
        }
      `),
      { preUserId }
    );
    if (e2 || !d2?.preUserDelete)
      throw err('INTERNAL_SERVER_ERROR', 'FAILED_TO_DELETE', e2);

    const authToken = await signToken(userId);
    return authToken;
  });
