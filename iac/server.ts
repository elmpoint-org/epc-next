import { isProd } from './util/isProd';

import { secrets } from './secrets';

export const server = new sst.aws.ApiGatewayV2('Server', {
  link: [...secrets],
});

server.route('$default', {
  handler: 'apps/server/handler.handler',
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
});
