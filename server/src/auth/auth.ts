import { TextEncoder } from 'node:util';
import * as jose from 'jose';
import { z } from 'zod';

import { validate } from '@/util/validate';
import { graph } from '@/db/graph';
import { graphql } from '@/db/lib/utilities';

const { USER_AUTH_SECRET } = process.env;

function reject() {
  return 'UNAUTHORIZED';
}

type ScopeUser = {
  id: string;
  scope: string[];
};

export async function verifyAuth(header: string) {
  // extract token
  const m = header.match(/^\s*Bearer (.+)\s*$/);
  if (!m?.length || m.length < 2) throw reject();
  const token = m[1];

  // attempt to look up user and get their user secret
  const id = extractUserId(token);
  const { user, secret } = await getUserSecret(id);

  // verify auth
  await verifyToken(token, secret);

  // if all is well, return the user object
  return user;
}

export function extractUserId(jwt: string) {
  let p: unknown;
  try {
    p = jose.decodeJwt(jwt);
  } catch (_) {
    throw reject();
  }
  const { data, error } = validate(
    p,
    z.object({
      data: z.object({ id: z.string() }),
    })
  );
  if (error || !data) throw reject();

  return data.data.id;
}

export async function getUserSecret(userId: string) {
  const { data, errors } = await graph(
    graphql(`
      query User($userId: ID!) {
        userSECURE(id: $userId) {
          user {
            id
            scope
          }
          secret
        }
      }
    `),
    { userId }
  );
  if (errors || !data?.userSECURE) throw reject();

  const user = data.userSECURE as { secret: string; user: ScopeUser };

  user.user.scope = user.user.scope ?? [];

  return user;
}

export async function verifyToken(token: string, userSecret: string) {
  try {
    await jose.jwtVerify(
      token,
      new TextEncoder().encode(userSecret + USER_AUTH_SECRET)
    );
  } catch (_) {
    throw reject();
  }
}
