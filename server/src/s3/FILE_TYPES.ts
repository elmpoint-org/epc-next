/*
THIS FILE IS IMPORTED BY THE CLIENT.
only raw types and client-friendly imports are allowed.
*/

import type { MimeType } from '@@/util/mimeTypes';

export const IMAGE_TYPES: MimeType[] = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/tiff',
  'image/heic',
];

/** if S3 returns no path for this object, the server will return this as its path. */
export const PATH_UNKNOWN_STRING = '___UNKNOWN_';
