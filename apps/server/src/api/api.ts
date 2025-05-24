import { awsLambdaRequestHandler } from '@trpc/server/adapters/aws-lambda';

import { appRouter } from './router';
import { createTrpcContext } from './trpc';

export const handler = awsLambdaRequestHandler({
  router: appRouter,
  createContext: createTrpcContext,
});
