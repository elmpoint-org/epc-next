import type { YogaInitialContext } from 'graphql-yoga';
import type { ResolverContext } from '@/db/graph';
import type { ContextFnType } from '@/db/lib/executors';

import { verifyAuth } from './verify';
import { getScopeObject } from './scope';
import { err } from '@/db/lib/utilities';
import { ALLOW_UNAUTH_USERS } from '@/CONSTANTS';

export async function graphqlAuth(
  ctx: YogaInitialContext,
  parse: ContextFnType<ResolverContext>
) {
  let user;
  try {
    user = await verifyAuth(ctx.request.headers.get('authorization') ?? '');
  } catch (error) {
    if (ALLOW_UNAUTH_USERS) return parse({});
    throw err('UNAUTHORIZED', 'Failed to authenticate.');
  }

  // add user context and move on
  const scope = getScopeObject(user.scope as any);
  return parse(scope, user.id);
}
