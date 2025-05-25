/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  async app(input) {
    const { isProd } = await import('./iac/util/isProd');

    return {
      name: 'epc2',
      removal: isProd(input?.stage ?? '') ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const { client } = await import('./iac/client');
    const { server } = await import('./iac/server');

    return {
      clientURL: client.url,
      serverURL: server.url,
    };
  },
});
