import { server } from './server';
import { isProd } from './util/isProd';

export const client = new sst.aws.Nextjs('Client', {
  path: 'apps/client',
  warm: isProd() ? 1 : 0,
  domain: isProd()
    ? {
        name: `two.elmpoint.xyz`,
        dns: false,
        cert: process.env.DOMAIN_ARN,
      }
    : undefined,
  environment: {
    NEXT_PUBLIC_SERVER_API_URL: server.url,
    NEXT_PUBLIC_IS_DEV: String(!isProd()),
  },
});
