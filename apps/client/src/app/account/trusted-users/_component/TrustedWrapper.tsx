'use client';

import { graphAuth, graphql } from '@/query/graphql';
import { useGraphQuery } from '@/query/query';
import TrustedList from './TrustedList';
import TrustedByList from './TrustedByList';
import { UseQueryResult } from '@tanstack/react-query';
import { ResultOf } from '@graphql-typed-document-node/core';
import { useCallback, useMemo, useState } from 'react';
import { IsPending, RunPending, usePending } from '../_util/usePending';
import { prepMemberList } from '../_util/prepMemberList';
import { useUser } from '@/app/_ctx/user/context';
import { prettyErrorPlaceholder } from '@/util/prettyErrors';
import { notifications } from '@mantine/notifications';
import { MemberUser, USER_FRAGMENT } from '../../_components/UserSearch';

export const TRUSTED_USERS_QUERY = graphql(
  `
    query UserFromAuth {
      userFromAuth {
        id
        trustedUsers {
          ...MemberUser
        }
        trustedBy {
          ...MemberUser
        }
      }
    }
  `,
  [USER_FRAGMENT],
);
export type TrustedUsersQuery = UseQueryResult<
  ResultOf<typeof TRUSTED_USERS_QUERY>
>;

export default function TrustedWrapper() {
  const user = useUser();

  const query = useGraphQuery(TRUSTED_USERS_QUERY);

  const trustedUsers = useMemo(
    () => prepMemberList(query.data?.userFromAuth?.trustedUsers),
    [query.data?.userFromAuth?.trustedUsers],
  );
  const trustedBy = useMemo(
    () => prepMemberList(query.data?.userFromAuth?.trustedBy),
    [query.data?.userFromAuth?.trustedBy],
  );

  const [isPending, runPending] = usePending<string>();

  const memberAdd = useCallback(
    async (ids: string[]) => {
      if (!user) return;

      await runPending(ids)(async () => {
        const { errors } = await graphAuth(
          graphql(`
            mutation UserUpdate($id: ID!, $trustedUserAdd: [String!]) {
              userUpdate(id: $id, trustedUserAdd: $trustedUserAdd) {
                id
              }
            }
          `),
          { id: user.id, trustedUserAdd: ids },
        );
        if (errors) {
          notifications.show({
            color: 'red',
            message: prettyErrorPlaceholder(errors?.[0]?.code),
          });
          return;
        }
        await query.refetch();
      });
    },
    [query, runPending, user],
  );

  const memberRemove = useCallback(
    async (ids: string[]) => {
      if (!user) return;

      await runPending(ids)(async () => {
        const { errors } = await graphAuth(
          graphql(`
            mutation UserUpdate($id: ID!, $trustedUserRemove: [String!]) {
              userUpdate(id: $id, trustedUserRemove: $trustedUserRemove) {
                id
              }
            }
          `),
          { id: user.id, trustedUserRemove: ids },
        );
        if (errors) {
          notifications.show({
            color: 'red',
            message: prettyErrorPlaceholder(errors?.[0]?.code),
          });
          return;
        }
        await query.refetch();
      });
    },
    [query, runPending, user],
  );

  const props: TrustedUserProps = {
    query,
    trustedUsers,
    trustedBy,
    isPending,
    runPending,
    memberAdd,
    memberRemove,
  };

  return (
    <>
      <TrustedList {...props} />
      <hr />
      <TrustedByList {...props} />
    </>
  );
}

export type TrustedUserProps = {
  query: TrustedUsersQuery;
  trustedUsers: MemberUser[];
  trustedBy: MemberUser[];
  isPending: IsPending<string>;
  runPending: RunPending<string>;
  memberAdd: (ids: string[]) => Promise<void>;
  memberRemove: (ids: string[]) => Promise<void>;
};
