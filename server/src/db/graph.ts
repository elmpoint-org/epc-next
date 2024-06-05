import { type ResolverContextType, createExecutors } from './lib/executors';
import type { UserScopeProp } from './__types/graphql-types';

import { modules, sources } from './schema/modules';
import { verifyAuth } from '@/auth/auth';
import { getScopeObject } from '@/auth/scope';
import { graphqlAuth } from '@/auth/graphql';

// context type
export type ResolverContext = ResolverContextType<
  ReturnType<typeof sources>,
  UserScopeProp
>;

// generate functions
export const { graph, graphHTTP } = createExecutors<ResolverContext>({
  sources,
  modules,
  secureScope: { ADMIN: true, __SECURE: true },
  auth: graphqlAuth,
});
