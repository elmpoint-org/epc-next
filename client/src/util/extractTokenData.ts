import { decodeJwt } from 'jose';

export function getTokenExpirationSeconds(jwt: string) {
  try {
    const d = decodeJwt(jwt);
    if (!(d.iat && d.exp)) throw 0;
    return { time: d.exp - d.iat };
  } catch (_) {
    return { error: 'FAILED_TO_DECODE' };
  }
}
