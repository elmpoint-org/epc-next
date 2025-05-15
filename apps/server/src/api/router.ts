import { t } from './trpc';

import * as auth from './routes/auth';
import * as register from './routes/register';

export const appRouter = t.router({
  auth: t.router({ ...auth }),
  register: t.router({ ...register }),
});

export type AppRouter = typeof appRouter;
