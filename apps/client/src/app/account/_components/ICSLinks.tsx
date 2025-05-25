'use client';

import { graphAuth, graphql } from '@/query/graphql';
import { ActionIcon, CloseButton } from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { useUser } from '@/app/_ctx/user/context';
import { useGraphQuery } from '@/query/query';
import { useCallback } from 'react';
import { useLoading } from '@/util/useLoading';
import { api } from '@/util/dev';

const WEBCAL_PREFIX = `webcal://${new URL(api ?? '').hostname}/ics/`;

export default function ICSLinks() {
  const user = useUser();

  const query = useGraphQuery(
    graphql(`
      query StayTokensFromUser($userId: ID!) {
        stayTokensFromUser(userId: $userId) {
          id
          token
          timestamp {
            created
          }
        }
      }
    `),
    { userId: user?.id ?? '' },
  );
  const tokens = query.data?.stayTokensFromUser;

  const [isLoading, loading] = useLoading();
  const createICS = useCallback(() => {
    loading(async () => {
      await graphAuth(
        graphql(`
          mutation StayTokenCreate {
            stayTokenCreate {
              id
            }
          }
        `),
      );
      await query.refetch();
    });
  }, [loading, query]);

  const deleteICS = useCallback(
    (id: string) => () => {
      loading(async () => {
        await graphAuth(
          graphql(`
            mutation StayTokenDelete($id: ID!) {
              stayTokenDelete(id: $id) {
                id
              }
            }
          `),
          { id },
        );
        await query.refetch();
      });
    },
    [loading, query],
  );

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        <div className="flex flex-row items-center justify-between">
          <h3 className="text-lg">Calendar Integrations</h3>

          <ActionIcon
            aria-label="add new"
            size="sm"
            color="slate"
            variant="light"
            onClick={createICS}
            loading={isLoading}
          >
            <IconPlus />
          </ActionIcon>
        </div>
        <div className="p-2 pb-0 text-slate-600">
          <p>These are your calendar integration links.</p>
        </div>

        <div className="flex flex-col gap-2 p-4">
          {tokens?.map(({ token, id }, i) => (
            <div
              key={token}
              className="flex flex-row gap-4 rounded-md bg-slate-200/30 px-4 py-2 hover:bg-slate-200/50"
            >
              <a
                href={WEBCAL_PREFIX + token}
                className="flex-1 font-bold text-emerald-700 hover:underline"
              >
                ICS/WebCal Link
              </a>

              <CloseButton
                aria-label="delete ics"
                size="xs"
                icon={<IconTrash />}
                onClick={deleteICS(id)}
              />
            </div>
          ))}

          {/* loading state */}
          {query.isPending &&
            Array(2)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded-md bg-slate-200"
                />
              ))}

          {/* no items */}
          <div className="hidden text-sm italic text-slate-600 first:block">
            none found
          </div>
        </div>
      </div>
    </>
  );
}
