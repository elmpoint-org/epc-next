'use client';

import { UserSearchBox } from '../../_components/UserSearch';
import { IconPlus, IconX } from '@tabler/icons-react';
import { ActionIcon, Tooltip } from '@mantine/core';
import { useUser } from '@/app/_ctx/user/context';
import { TrustedUserProps } from './TrustedWrapper';
import TUSkeleton from './TUSkeleton';

export default function TrustedList(props: TrustedUserProps) {
  const { query, trustedUsers, isPending, memberAdd, memberRemove } = props;

  const user = useUser();

  // RENDER
  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-sm">
        {/* title */}
        <div className="flex flex-row items-center justify-between">
          <h3 className="px-2 text-lg">Your trusted users</h3>

          <div className="t">
            <UserSearchBox
              color="slate"
              justify="center"
              variant="subtle"
              leftSection={<IconPlus className="size-4" />}
              onSelection={(id) => memberAdd([id])}
              omit={[...trustedUsers.map((it) => it.id), user?.id ?? '']}
            >
              Add user
            </UserSearchBox>
          </div>
        </div>

        {/* members list */}
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-2">
            {trustedUsers.map((m) => (
              <div
                key={m.id}
                className="flex flex-row items-center gap-3 rounded-md border border-slate-300 px-4 py-2"
              >
                <div
                  className="size-5 rounded-full bg-slate-300 bg-contain"
                  style={{ backgroundImage: `url(${m.avatarUrl})` }}
                ></div>
                <div className="flex-1">{m.name}</div>

                <div className="flex gap-2">
                  <Tooltip label="Remove">
                    <ActionIcon
                      aria-label="Remove"
                      color="slate"
                      size="sm"
                      variant="subtle"
                      onClick={() => memberRemove([m.id])}
                      loading={isPending(m.id)}
                    >
                      <IconX />
                    </ActionIcon>
                  </Tooltip>
                </div>
              </div>
            ))}

            {/* skeleton */}
            {query.isPending &&
              Array(3)
                .fill(0)
                .map((_, i) => <TUSkeleton key={i} i={i} />)}

            {/* none found */}
            <div className="mx-4 hidden italic text-slate-600 first:flex">
              no members
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
