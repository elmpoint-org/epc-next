import { randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

import { DEFAULT_KEY_LENGTH } from '##/CONSTANTS.js';

export const generateKey = async (len = DEFAULT_KEY_LENGTH) =>
  (await promisify(randomBytes)(Math.ceil((len + 3) / 1.5)))
    .toString('base64')
    .slice(0, len)
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

export const generateNumerical = async (length: number) =>
  (
    Array(length).fill(0).join('') +
    parseInt(
      (await promisify(randomBytes)(Math.ceil(length / 2))).toString('hex'),
      16
    )
  ).slice(0 - length);

export const generate6Digit = () => generateNumerical(6);
