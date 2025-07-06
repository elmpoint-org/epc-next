import { secrets } from '../secrets';
import { defaultProps } from '../util/defaultProps';
import { isProd } from '../util/isProd';

const handler: sst.aws.FunctionArgs = {
  handler: 'apps/server/src/cron/daily.handler',
  link: [...secrets],
  ...defaultProps(),
};

if (isProd()) {
  new sst.aws.Cron('CronDaily', {
    schedule: 'cron(0 4 * * ? *)',
    function: handler,
  });
} else {
  const f = new sst.aws.Function('CronDailyDev', {
    ...handler,
    url: true,
  });
}
