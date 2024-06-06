import { TextEncoder } from 'node:util';
import * as jose from 'jose';
import { z } from 'zod';

import { validate } from '@/util/validate';
import { getUserSecret, reject } from './utilities';

const { USER_AUTH_SECRET } = process.env;

/**
 * verifies authorization header requests. will either return user info or throw an error.
 * @param header full authorization header string
 * @returns ScopeUser type (id + generic scope)
 */
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

function extractUserId(jwt: string) {
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

async function verifyToken(token: string, userSecret: string) {
  try {
    await jose
      .jwtVerify(token, new TextEncoder().encode(userSecret + USER_AUTH_SECRET))
      .catch(() => {
        throw reject();
      });
  } catch (_) {
    throw reject();
  }
}
