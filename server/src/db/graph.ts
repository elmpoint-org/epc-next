import { type ResolverContextType, createExecutors } from './lib/executors';

import type { UserScopeProp } from './__types/graphql-types';

import { modules, sources } from './models/modules';
import { graphqlAuth } from '@@/auth/graphql';

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
