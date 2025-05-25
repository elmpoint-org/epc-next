import { server } from '../server';
import { isProd } from './isProd';

export function environment() {
  return {
    NEXT_PUBLIC_SERVER_API_URL: server.url,
    NEXT_PUBLIC_IS_DEV: isProd() ? '' : 'true',
  } as const;
}
