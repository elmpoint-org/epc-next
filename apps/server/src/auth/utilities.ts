import type { ResultOf } from '@graphql-typed-document-node/core';
import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';

export function reject() {
  return 'UNAUTHORIZED';
}

const USER_SECRET_QUERY = graphql(`
  query User($userId: ID!) {
    userSECURE(id: $userId) {
      user {
        id
        scope
      }
      secret
    }
  }
`);

export type ScopeUser = (ResultOf<
  typeof USER_SECRET_QUERY
>['userSECURE'] & {})['user'];

export async function getUserSecret(userId: string) {
  const { data, errors } = await graph(USER_SECRET_QUERY, { userId });
  if (errors || !data?.userSECURE) throw reject();

  const user = data.userSECURE as { secret: string; user: ScopeUser };

  user.user.scope = user.user.scope ?? [];

  return user;
}
