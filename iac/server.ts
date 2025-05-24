import { isProd } from './util/isProd';

import { secrets } from './secrets';

export const server = new sst.aws.ApiGatewayV2('Server', {
  link: [...secrets],
  cors: true,
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

function defaultProps() {
  return {
    permissions: [
      {
        actions: [
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:GetItem',
          'dynamodb:PutItem',
          'dynamodb:UpdateItem',
          'dynamodb:DeleteItem',
          'dynamodb:BatchGetItem',
          'dynamodb:BatchWriteItem',
          's3:*',
        ],
        resources: ['*'],
      },
    ],
    environment: {
      NEXT_PUBLIC_SERVER_API_URL: server.url,
      NEXT_PUBLIC_IS_DEV: String(!isProd()),
    },
  } satisfies Partial<sst.aws.FunctionArgs>;
}
