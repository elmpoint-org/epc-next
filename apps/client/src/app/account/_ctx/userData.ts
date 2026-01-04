import { useGraphQuery, queryClient } from '@/query/query';
import { graphql } from '@/query/graphql';

export const USE_USER_DATA = [
  graphql(`
    query UserFromAuth {
      userFromAuth {
        id
        name
        firstName
        email
        credentials {
          id
          userId
          createdAt
          lastUsedAt
          country
          device
          aaGuid
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

export type UserDataType = ReturnType<typeof useUserData> & {};

export const useUserData = () => {
  const { data } = useGraphQuery(...USE_USER_DATA);
  return data?.userFromAuth ?? null;
};
export const invalidateUserData = () =>
  queryClient.invalidateQueries({ queryKey: USE_USER_DATA });
