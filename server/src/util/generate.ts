import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

import { DEFAULT_KEY_LENGTH } from '@/CONSTANTS';

export const generateKey = async (len = DEFAULT_KEY_LENGTH) =>
  (await promisify(randomBytes)(Math.ceil((len + 3) / 1.5)))
    .toString('base64')
    .slice(0, len)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

export const generate6Digit = async () =>
  // prettier-ignore
  ('' + parseInt((await promisify(randomBytes)(3)).toString('hex'), 16)).slice(0,6);
