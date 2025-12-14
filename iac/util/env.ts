import { isProd } from './isProd';

import { server } from '../server';

export function environment() {
  return {
    NEXT_PUBLIC_SERVER_API_URL: server.url,
    NEXT_PUBLIC_IS_DEV: isProd() ? '' : 'true',
    NEXT_PUBLIC_STAGE: $app.stage,
  } as const;
}
