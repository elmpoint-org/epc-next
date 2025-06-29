import { isProd } from './util/isProd';

import { SecretMap, secrets } from './secrets';
import { environment } from './util/env';
import { defaultProps } from './util/defaultProps';

export const server = new sst.aws.ApiGatewayV2('Server', {
  link: [...secrets],
  cors: true,
  domain: isProd()
    ? {
        name: 'api.elmpoint.xyz',
        dns: false,
        cert: SecretMap.SecretDomainARN.value,
      }
    : undefined,
});

// ---------------------------------------
// ROUTES

// TRPC API
route('/api/{proxy+}', {
  methods: ['GET', 'POST'],
  handler: 'apps/server/src/api/handler.handler',
});

// GRAPHQL API
route('/gql', {
  handler: 'apps/server/src/db/handler.handler',
});

// ICS API
route('/ics/{token}', {
  handler: 'apps/server/src/ics/handler.handler',
});

// ---------------------------------------

function route(
  path: string,
  { methods, ...opts }: sst.aws.FunctionArgs & { methods?: Method[] },
  config?: sst.aws.ApiGatewayV2RouteArgs
) {
  if (!methods?.length) methods = ['ANY'];

  for (const method of methods) {
    server.route(
      `${method} ${path}`,
      {
        ...defaultProps(),
        ...opts,
      },
      config
    );
  }
}

type Method =
  | 'GET'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'HEAD'
  | 'OPTIONS'
  | 'ANY';
