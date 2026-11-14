import { SecretMap } from './secrets';
import { environment } from './util/env';
import { isProd } from './util/isProd';

export const client = new sst.aws.Nextjs('Client', {
  path: 'apps/client',
  // OpenNext 3.9.14 only reads this flag when it has a value.
  buildCommand:
    'npx --yes @opennextjs/aws@3.9.14 build --dangerously-use-unsupported-next-version true',
  warm: isProd() ? 1 : 0,
  domain: isProd()
    ? {
        name: `www.elmpoint.org`,
        dns: false,
        cert: SecretMap.SecretDomainARN.value,
      }
    : $app.stage === 'next'
    ? {
        name: `next.elmpoint.org`,
        dns: false,
        cert: SecretMap.SecretDomainARN.value,
      }
    : undefined,
  environment: environment(),
});
