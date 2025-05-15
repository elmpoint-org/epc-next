import express from 'express';
import { createExpressMiddleware } from '@trpc/server/adapters/express';

import { appRouter } from './router';
import { createTrpcContext } from './trpc';

const r = express.Router();

r.use(
  createExpressMiddleware({
    router: appRouter,
    createContext: createTrpcContext,
  })
);

export default r;
