import { secrets } from './secrets';
import { defaultProps } from './util/defaultProps';
import { isProd } from './util/isProd';

const handler: sst.aws.FunctionArgs = {
  handler: 'apps/server/src/cron/daily.handler',
  link: [...secrets],
  ...defaultProps(),
};

if (isProd()) {
  new sst.aws.Cron('Daily', {
    schedule: 'cron(0 0 * * ? *)',
    function: handler,
  });
} else {
  const f = new sst.aws.Function('DailyDev', {
    ...handler,
    url: true,
  });
}
