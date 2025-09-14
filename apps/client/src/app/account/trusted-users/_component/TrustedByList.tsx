'use client';

import { IconChecks, IconUserCheck } from '@tabler/icons-react';
import { ActionIcon, Button, Tooltip } from '@mantine/core';
import { TrustedUserProps } from './TrustedWrapper';
import { useCallback, useMemo } from 'react';
import { usePending } from '@/util/usePending';
import TUSkeleton from './TUSkeleton';

export default function TrustedByList(props: TrustedUserProps) {
  const { query, trustedBy, trustedUsers, memberAdd } = props;

  const [isPending, runPending] = usePending();

  const handleTrustButton = useCallback(
    (id: string) => {
      runPending([id])(() => memberAdd([id]));
    },
    [memberAdd, runPending],
  );
  const handleTrustAll = useCallback(() => {
    const ids = trustedBy
      .map((it) => it.id)
      .filter((it) => !trustedUsers.some((u) => u.id === it));
    runPending(ids)(() => memberAdd(ids));
  }, [memberAdd, runPending, trustedBy, trustedUsers]);

  const allTrusted = useMemo(() => {
    return trustedBy.every((it) => trustedUsers.some((u) => u.id === it.id));
  }, [trustedBy, trustedUsers]);

  return (
    <>
      <div className="relative flex flex-col gap-2 rounded-md border border-slate-200 p-4 shadow-xs">
        {/* title */}
        <div className="flex flex-row items-center justify-between">
          <h3 className="px-2 text-lg">You’re trusted by</h3>

          <div className="t">
            <Button
              justify="center"
              variant="subtle"
              leftSection={<IconChecks className="size-4" />}
              onClick={handleTrustAll}
              disabled={!trustedBy.length || allTrusted}
            >
              Add all to your list
            </Button>
          </div>
        </div>

        {/* members list */}
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-2">
            {trustedBy.map((m) => (
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
                  <Tooltip label="Trust this user">
                    <ActionIcon
                      aria-label="Trust this user"
                      size="sm"
                      variant="light"
                      disabled={trustedUsers.some((it) => it.id === m.id)}
                      loading={isPending(m.id)}
                      onClick={() => handleTrustButton(m.id)}
                    >
                      <IconUserCheck />
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

            <div className="mx-4 hidden text-slate-600 italic first:flex">
              none found
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
