/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const { isProd } = await import('./iac/util/isProd');

    return {
      name: 'epc',
      removal: isProd(input?.stage ?? '') ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const { client } = await import('./iac/client');
    const { server } = await import('./iac/server');

    // cron jobs
    await import('./iac/cron/daily');
    await import('./iac/cron/weekly');

    return {
      clientURL: client.url,
      serverURL: server.url,
    };
  },
});
