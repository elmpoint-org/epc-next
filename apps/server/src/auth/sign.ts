import * as jose from 'jose';

import { EMAIL_LOGIN_EXPIRE, JWT_ALGORITHM, LOGIN_EXPIRE } from '@@/CONSTANTS';
import { getUserSecret } from './utilities';

const { USER_AUTH_SECRET } = process.env;

export async function signToken(userId: string, expiresInSeconds?: number) {
  const { secret, user } = await getUserSecret(userId).catch(() => {
    throw 'USER_NOT_FOUND';
  });

  return await new jose.SignJWT({ data: { id: user.id } })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds ?? LOGIN_EXPIRE}s`)
    .sign(new TextEncoder().encode(secret + USER_AUTH_SECRET))
    .catch(() => {
      throw 'SERVER_ERROR';
    });
}

export async function signReferralToken(
  preUserId: string,
  expiresInSeconds?: number
) {
  return await new jose.SignJWT({ data: { id: preUserId, referral: true } })
    .setProtectedHeader({ alg: JWT_ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds ?? EMAIL_LOGIN_EXPIRE}s`)
    .sign(new TextEncoder().encode(USER_AUTH_SECRET))
    .catch(() => {
      throw 'SERVER_ERROR';
    });
}
