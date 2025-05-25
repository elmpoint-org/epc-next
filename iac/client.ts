import { SecretMap } from './secrets';
import { environment } from './util/env';
import { isProd } from './util/isProd';

export const client = new sst.aws.Nextjs('Client', {
  path: 'apps/client',
  warm: isProd() ? 1 : 0,
  domain: isProd()
    ? {
        name: `www.elmpoint.xyz`,
        dns: false,
        cert: SecretMap.SecretDomainARN.value,
      }
    : undefined,
  environment: environment(),
});
