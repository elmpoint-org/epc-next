/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'epc-next',
      removal: getIsProd(input?.stage) ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    const isProd = getIsProd($app.stage);

    // APP DEFINITION
    new sst.aws.Nextjs('EPCNext', {
      warm: isProd ? 1 : 0,
      domain: isProd
        ? {
            name: `one.elmpoint.xyz`,
            dns: false,
            cert: process.env.DOMAIN_ARN,
          }
        : undefined,
    });
  },
});

function getIsProd(s?: string) {
  return s === 'production';
}
