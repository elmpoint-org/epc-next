import { isProd } from './isProd';

import { client } from '../client';
import { server } from '../server';

export function environment() {
  return {
    NEXT_PUBLIC_SERVER_API_URL: server.url,
    NEXT_PUBLIC_CLIENT_URL: client.url,
    NEXT_PUBLIC_IS_DEV: isProd() ? '' : 'true',
  } as const;
}
