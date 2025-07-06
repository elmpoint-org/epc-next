import { secrets } from '../secrets';
import { defaultProps } from '../util/defaultProps';
import { isProd } from '../util/isProd';

const handler: sst.aws.FunctionArgs = {
  handler: 'apps/server/src/cron/weekly.handler',
  link: [...secrets],
  ...defaultProps(),
};

if (isProd()) {
  new sst.aws.Cron('CronWeekly', {
    schedule: 'cron(15 8 ? * MON *)',
    function: handler,
  });
} else {
  const f = new sst.aws.Function('CronWeeklyDev', {
    ...handler,
    url: true,
  });
}
