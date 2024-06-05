import { type ResolverContextType, createExecutors } from './lib/executors';

import { modules, sources } from './schema/modules';
import { UserScopeProp } from './__types/graphql-types';

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
  auth(ctx, parse) {
    // TODO fix this

    return parse({ ADMIN: true });

    // sample unauth error state:
    // return [null, { status: 401, statusText: 'Unauthorized' }];

    // proper auth return state:
    // return parse(scope, user.id)
  },
});
