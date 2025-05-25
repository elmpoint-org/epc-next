import { graph } from '##/db/graph.js';
import { graphql } from '##/db/lib/utilities.js';

export function reject() {
  return 'UNAUTHORIZED';
}

export type ScopeUser = {
  id: string;
  scope: string[];
};

export async function getUserSecret(userId: string) {
  const { data, errors } = await graph(
    graphql(`
      query User($userId: ID!) {
        userSECURE(id: $userId) {
          user {
            id
            scope
          }
          secret
        }
      }
    `),
    { userId }
  );
  if (errors || !data?.userSECURE) throw reject();

  const user = data.userSECURE as { secret: string; user: ScopeUser };

  user.user.scope = user.user.scope ?? [];

  return user;
}
