import { type QueryResult, useGraphQuery, queryClient } from '@/query/query';
import { graphql } from '@/query/graphql';

export const USE_USER_DATA = [
  graphql(`
    query UserFromAuth {
      userFromAuth {
        id
        name
        email
        credentials {
          id
          userId
          createdAt
          lastUsedAt
          country
          device
          nickname
        }
        timestamp {
          created
          updated
        }
      }
    }
  `),
  {},
] as const;

export type UserDataType = QueryResult<typeof useUserData>['userFromAuth'];

export const useUserData = () => useGraphQuery(...USE_USER_DATA);
export const invalidateUserData = () =>
  queryClient.invalidateQueries({ queryKey: USE_USER_DATA });
