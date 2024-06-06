import { t } from './trpc';

import * as auth from './routes/auth';

export const appRouter = t.router({
  auth: t.router({ ...auth }),
});

export type AppRouter = typeof appRouter;
