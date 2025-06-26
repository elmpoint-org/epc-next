import { environment } from './env';

export function defaultProps() {
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
    environment: environment(),
  } satisfies Partial<sst.aws.FunctionArgs>;
}
